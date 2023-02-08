import list from "../list-config";

const videoList = list.map((item, index) => ({ id: index + 1, url: item.video, name: item.name, poster: item.poster, objectFit: "contain" }))

Page({
  data: {
    list,
    videoList,
    duration: 0,
    cacheExtent: 1, // *Skyline 缓存区域大小，值为 1 表示提前渲染上下各一屏区域
  },

  onLoad(e) {
    // this.currentCasePath = e.path;
    const index = list.findIndex((i) => i.path === e.path);
    // const current = index % 3;
    console.log("video-list onLoad, current is", index);
    this.setData({ current: index, showSwiper: true, duration: 500, });
  },

  handleTapCase(e) {
    const index = e.currentTarget.dataset.index;
    const { path } = this.data.list[index];

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
