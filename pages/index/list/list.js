import list from "../list-config";

Page({
  data: {
    list,
  },

  onLoad() {},

  handleTap(e) {
    const index = e.currentTarget.dataset.index;
    const { path } = this.data.list[index];

    wx.navigateTo({ url: `../video-list/video-list?path=${encodeURIComponent(path)}` });
  },

  back() {
    wx.navigateBack({ delta: 1 });
  },
});
