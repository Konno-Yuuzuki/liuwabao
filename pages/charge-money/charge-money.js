import { rechargeUser } from '../../api/index.js';
import { showToast } from '../../util/index.js';

// pages/charge-money/charge-money.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 选择金额
  chooseValue(event) {
    console.log(event)
    const selectedValue = event.target.dataset.value;
    console.log(selectedValue, "选择金额");
    if (!selectedValue) return;
    this.setData({
      selectedValue: selectedValue,
      selectNum: event.target.dataset.index,
    })
  },

  // 充值金额
  chargeMoney() {
    this.applyRechargeUser();
  },

  // 调用用户充值
  applyRechargeUser: function (data) {
    rechargeUser(data).then(res => {
      const { nonceStr, paySign, pkg, signType, timeStamp } = res.data.map
      wx.requestPayment({
        timeStamp,
        nonceStr,
        package: pkg,
        signType: 'MD5',
        paySign,
        success: function (res) {
          console.log('充值成功');
          showToast("充值成功", "none");
          wx.navigateBack({
            delta: 1
          });
        },
        fail: function (res) {
          showToast("充值失败", "none");
        },
      })
    })
  },
})