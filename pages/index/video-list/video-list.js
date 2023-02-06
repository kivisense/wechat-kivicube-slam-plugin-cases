import list from "../list-config";

Page({
  data: {
    list,
    duration: 0,
    cacheExtent: 1, // *Skyline 缓存区域大小，值为 1 表示提前渲染上下各一屏区域
    current: "",
  },

  onLoad(e) {
    // this.currentCasePath = e.path;
    const current = list.findIndex((i) => i.path === e.path);
    this.setData({ current, duration: 500 });
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
    this.setData({ current: detail.current });
  },
});
