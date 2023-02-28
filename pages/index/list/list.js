import list from "../list-config";

Page({
  data: {
    list,
  },

  onLoad() {},

  handleTap(e) {
    const index = e.currentTarget.dataset.index;
    const info = this.data.list[index];

    // wx.navigateTo({ url: `../video-list/video-list?path=${encodeURIComponent(info.path)}` });
    wx.navigateTo({ url: `../video-preview/video-preview?info=${encodeURIComponent(JSON.stringify(info))}` });
  },

  back() {
    wx.navigateBack({ delta: 1 });
  },
});
