// 点击标记事件 
export const showMarksData = (event) => {
  const _this = this;
  clearTimeout(timer);
  console.log(_this.data.showMarkDetail)
  if (_this.data.showMarkDetail) {
    _this.setData({
      showMarkDetail: false,
    })
  }
  setTimeout(() => {
    _this.setData({
      showMarkDetail: true
    })
  })
  let timer = setTimeout(() => {
    _this.setData({
      showMarkDetail: false,
    });
  }, 5000)
}
