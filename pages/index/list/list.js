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

    const prefix =
      this.from === "meta"
        ? "/subpackage/wechat-kivicube-slam-plugin-cases"
        : "";
    wx.navigateTo({ url: `${prefix}${path}` });
  },
});
