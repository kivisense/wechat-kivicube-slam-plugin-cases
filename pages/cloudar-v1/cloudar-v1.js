import {
  errorHandler,
  showAuthModal,
  requestFile,
  throttle,
} from "../../utils/utils";

Page({
  data: {
    license: getApp().globalData.license,
    showGuide: false,
    guideTip: "请对准墙面识别",
    showPlaneTip: false,
  },

  onLoad() {
    wx.showLoading({ title: "初始化中...", mask: true });

    this.downloadAsset = Promise.all([
      requestFile(
        "https://meta.kivisense.com/kivicube-slam-mp-plugin/demo-assets/model/rabbit.glb"
      ),
      requestFile("https://meta.kivisense.com/wechat-case/model/indicator.glb"),
    ]);
  },

  async ready({ detail: slam }) {
    try {
      const [rabbitArrayBuffer, reticleArrayBuffer] = await this.downloadAsset;
      const [rabbitModel, reticleModel] = await Promise.all([
        slam.createGltfModel(rabbitArrayBuffer),
        slam.createGltfModel(reticleArrayBuffer),
      ]);

      await slam.start();
      wx.hideLoading();

      this.slam = slam;
      this.rabbitModel = rabbitModel;
      this.reticleModel = reticleModel;

      this.setData({ showGuide: true });

      // 开启一个计时器，超过10秒未识别到，关闭云识别，直接体验
      const timer = setTimeout(() => {
        this.slam.stopCloudar();
        this.startPlay();
      }, 10000);

      /**
       * 开始去云识别图片。
       * @param {String} collectionId - 合辑id。获取方式，参考：https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx3bbab3920eabccb2&token=&lang=zh_CN#-id-
       * @param {Array} [sceneList=[]] - 希望识别到的场景id列表。如果识别到的场景不在此列表中，则会忽略，继续识别。如果为空，或空数组，则代表识别合辑下的所有场景。
       * @returns {Promise<String|Undefined>} 场景id。如果识别过程中调用了stopCloudar，则会返回undefined值。
       */
      const sceneId = await this.slam.startCloudar("9l0rm3").catch((err) => {
        clearTimeout(timer);
        errorHandler(err);
      });

      // 识别成功，开始体验
      if (sceneId) {
        clearTimeout(timer);
        this.startPlay();
      }
    } catch (e) {
      wx.hideLoading();
      errorHandler(e);
    }
  },

  checkCameraAngle() {
    const camera = this.slam.defaultCamera;
    const pos = camera.position.clone();
    // 创建一个"天空"向量, 朝向Y轴正方向
    const sky = pos.set(0, 1, 0);
    // 获取相机Z轴正方向的向量
    const cameraUp = camera.getWorldDirection();

    /**
     * 这个向量的 x,y,z 分别为 0,-1,0 的时候，体验者可能一开始就抬起相机望向了天空
     * **/
    const { x, y, z } = cameraUp;
    if (x === 0 && y === -1 && z === 0) {
      this.slam.removePlaneIndicator();

      return wx.showModal({
        title: "提示",
        content: "slam v1模式下, 初始化的时候请尽量让手机相机倾斜向下",
        showCancel: false,
        success() {
          wx.navigateBack();
        },
      });
    }

    const angleToSky = cameraUp.angleTo(sky);
    // console.log("相机的Z轴与天空的夹角：", angleToSky);

    /**
     * 如果相机的Z轴向量与天空向量的夹角小于 90度 (Math.PI / 2)，那么相机就朝向天空
     * 注意：这个判断值可以根据需求自行调整
     * **/
    if (angleToSky < Math.PI / 1.5) {
      // wx.showToast({ title: "朝向天空啦，请对准地面哟", icon: "none" });
      this.setData({ showPlaneTip: true });
      this.reticleModel.visible = false;
      // this.resetV1PlaneOnce();
    } else {
      // wx.hideToast();
      this.setData({ showPlaneTip: false });
      this.reticleModel.visible = true;
    }
  },

  startPlay() {
    const { slam, reticleModel, rabbitModel } = this;
    const group = slam.createGroup();
    group.add(reticleModel);

    // 先隐藏模型和指示器
    reticleModel.visible = false;
    rabbitModel.visible = false;
    slam.add(rabbitModel, 0.8);

    this.setData({ showGuide: false });

    const invokeCheck = throttle(this.checkCameraAngle, 600);
    /**
     * 使用 addPlaneIndicator 加入指示器
     *
     * v1模式因为有一个巨大的平面，所以有着超高的放置成功率，但是一旦体验者将相机朝向天空，
     * 模型就会被放置在很远的地方，导致模型不可见或者特别小。这个时候我们利用 onPlaneShowing 这个持续放置成功的回调，
     * 来检测体验者相机的倾斜角度，以此来提醒用户让相机尽量倾斜向下体验。
     * **/
    slam.addPlaneIndicator(group, {
      size: 0.5,
      // camera画面中心对准的位置有可用平面，指示器持续放置到该平面都放置成功的时候调用 **持续**调用
      onPlaneShowing: () => {
        group.rotation.y += 0.02;
        invokeCheck();
      },
    });
  },

  // v1模式下, 通过放置模型的方法, 重置一次平面
  // resetV1PlaneOnce() {
  //   if (this._resetPlane) return;

  //   const {slam, rabbitModel } = this;
  //   const { windowWidth, windowHeight } = wx.getSystemInfoSync();
  //   const success = slam.standOnThePlane(
  //     rabbitModel,
  //     Math.round(windowWidth / 2),
  //     Math.round(windowHeight / 2),
  //     true
  //   );

  //   if (success) {
  //     console.log("重置成功");
  //     this._resetPlane = true;
  //     slam.removePlaneIndicator();
  //     this.startPlay();
  //   }
  // },

  tap() {
    const { slam, rabbitModel, reticleModel } = this;
    if (!reticleModel.visible) return;

    const { windowWidth, windowHeight } = wx.getSystemInfoSync();
    const res = slam.standOnThePlane(
      rabbitModel,
      Math.round(windowWidth / 2),
      Math.round(windowHeight / 2),
      true
    );
    console.log("stand result：", res);

    if (!rabbitModel.visible) {
      rabbitModel.visible = true;
      rabbitModel.playAnimation({ loop: true });
      slam.removePlaneIndicator();
    }
  },

  error({ detail }) {
    wx.hideLoading();
    // 判定是否camera权限问题，是则向用户申请权限。
    if (detail?.isCameraAuthDenied) {
      showAuthModal(this);
    } else {
      errorHandler(detail);
    }
  },
});
