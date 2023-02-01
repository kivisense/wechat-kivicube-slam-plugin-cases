import list from "../list-config";

Page({
  data: {
    list,
  },

  onLoad(e) {
    this.from = e.from;
  },

  handleTap(e) {
    const index = e.currentTarget.dataset.index;
    const { path } = this.data.list[index];

    wx.navigateTo({ url: `../video-list/video-list?path=${path}` });
  },
});
