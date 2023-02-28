Page({
  data: {
    info: {},
  },

  onLoad(e) {
    try {
      const info = JSON.parse(decodeURIComponent(e.info));
      this.setData({ info });
    } catch (err) {
      console.error("页面参数获取失败", err);
      wx.showToast({
        title: "页面参数获取失败",
        icon: "none",
      });
    }
  },

  handleTapCase(e) {
    const { index } = e.currentTarget.dataset;

    let { path, customBtn } = this.data.info;

    // 如果有自定义按钮 设置为自定义按钮跳转的路径地址
    if (customBtn) {
      path = customBtn[index].path;
    }

    console.log(path);
    wx.navigateTo({
      url: `../..${path}`,
    });
  },

  onPlay() {},
  onPause() {},
  onEnded() {},
  onError() {},
  onTimeUpdate() {},
  onWaiting() {},
  onProgress() {},
  onLoadedMetaData() {},
});
