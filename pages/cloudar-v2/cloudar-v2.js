import { errorHandler, showAuthModal, requestFile } from "../../utils/utils";

Page({
  data: {
    license: getApp().globalData.license,
    showGuide: false,
    guideTip: "请对准墙面识别",
  },

  onLoad() {
    wx.showLoading({ title: "初始化中...", mask: true });

    this.downloadAsset = Promise.all([
      requestFile(
        "https://meta.kivisense.com/kivicube-slam-mp-plugin/demo-assets/model/rabbit.glb"
      ),
    ]);
  },

  async ready({ detail: slam }) {
    try {
      const [rabbitArrayBuffer] = await this.downloadAsset;
      const [rabbitModel] = await Promise.all([
        slam.createGltfModel(rabbitArrayBuffer),
      ]);

      await slam.start();
      wx.hideLoading();

      this.slam = slam;
      this.rabbitModel = rabbitModel;

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
      const sceneId = await this.slam.startCloudar("b46rfc").catch((err) => {
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

  startPlay() {
    const { slam, rabbitModel } = this;
    // 设置3d对象的位置属性，在手机前方1米，并靠下0.5米
    rabbitModel.position.z = -1;
    rabbitModel.position.y = -0.5;
    slam.add(rabbitModel, 0.5);

    this.setData({ showGuide: false });
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
