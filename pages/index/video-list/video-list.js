import list from "../list-config";

const videoList = list.map((item, index) => ({ id: index + 1, url: item.video, name: item.name, path: item.path, customBtn: item.customBtn, poster: item.poster, objectFit: "cover" }))

Page({
  data: {
    list,
    videoList,
    duration: 0,
    cacheExtent: 1, // *Skyline 缓存区域大小，值为 1 表示提前渲染上下各一屏区域
  },

  onLoad(e) {
    const index = list.findIndex((i) => i.path === decodeURIComponent(e.path));

    console.log("video-list onLoad, index is", index);
    this.setData({ videoIndex: index, showSwiper: true, duration: 500, });
  },

  handleTapCase(e) {
    const {index, cindex} = e.currentTarget.dataset;

    let { path, customBtn } = videoList[index];

    // 如果有自定义按钮 设置为自定义按钮跳转的路径地址
    if (customBtn) {
      path = customBtn[cindex].path;
    }

    console.log(path);
    wx.navigateTo({
      url: `../..${path}`,
    });
  },

  swiperChange({ detail }) {
    console.log(detail.current);
    const current = detail.current;
    this.setData({ current });
  },

  animationfinish({ detail }) {
    const videoSrc = list[detail.current].video;
    this.setData({ videoSrc });
  },
});
