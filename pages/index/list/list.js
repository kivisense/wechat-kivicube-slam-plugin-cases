import list from "../list-config";

Page({
  data: {
    list,
    backStyle: "",
    wrapperStyle: "",
  },

  onLoad() {
    const rect = wx.getMenuButtonBoundingClientRect?.() || {};
    const { windowWidth } = wx.getSystemInfoSync();
    const { top, height, right } = rect;
    const scale = 1; // 控制返回图标大小
    const backHeight = height * scale;

    const backStyle = `left: ${windowWidth - right}px; top: ${top + (height - backHeight) / 2}px; height: ${
      backHeight
    }px`;
    const wrapperStyle = `margin-top: ${top + height}px; `

    this.setData({backStyle, wrapperStyle});
  },

  handleTap(e) {
    const index = e.currentTarget.dataset.index;
    const { path } = this.data.list[index];

    wx.navigateTo({ url: `../video-list/video-list?path=${path}` });
  },

  back() {
    wx.navigateBack({ delta: 1 });
  },
});
