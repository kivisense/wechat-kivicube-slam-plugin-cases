Component({
  data: {
    backStyle: "",
  },

  attached() {
    this.setCustomBackButton();
  },

  methods: {
    back() {
      wx.navigateBack();
    },

    setCustomBackButton() {
      const rect = wx.getMenuButtonBoundingClientRect?.() || {};
      const { windowWidth } = wx.getSystemInfoSync();
      const { top, height, right } = rect;
      const scale = 1; // 控制返回图标大小
      const backHeight = height * scale;

      const backStyle = `left: ${windowWidth - right}px; top: ${
        top + (height - backHeight) / 2
      }px; height: ${backHeight}px`;

      this.setData({ backStyle });
    },
  },
});
