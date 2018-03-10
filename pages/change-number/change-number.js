// pages/change-number/change-number.js
import { isMobilehone, showModal, showToast, setStorage, getStorage } from '../../util/index.js'
import { sendVerifyCode, loginWX, wxGetUserinfo, loginUser, getOpenId, ERR_OK } from '../../api/index.js'
const WXBizDataCrypt = require('../../util/RdWXBizDataCrypt.js');

const reGetCodeTime = 59
let hasSend = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countTime: reGetCodeTime,
    phoneNum: '',
    verifyCode: '',
    codeBtnActive: false,
    codeText: '获取验证码',
    codeColor: '#999'
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

  


  // 获取验证码
  getIdentifyingCode() {
    const { phoneNum } = this.data
    if (!isMobilehone(phoneNum)) {
      showModal('提示', '请输入正确的手机号')
      return
    } else {
      if (hasSend) {
        hasSend = false
        this.countDown()
        sendVerifyCode({ userName: this.data.phoneNum })
      }
    }
  },
  // 获取用户输入手机号
  bindKeyInput(e) {
    const len = e.detail.cursor
    if (!len) return
    if (len === 11) {
      this.setData({ codeColor: '#f5bd12', phoneNum: e.detail.value })
    } else {
      this.setData({ codeColor: '#999' })
    }
  },
  // 获取用户输入验证码
  bindVerifyInput(e) {
    const len = e.detail.cursor
    if (!len) return
    this.setData({ verifyCode: e.detail.value })
  },
  // 计时器
  countDown() {
    const _this = this
    const time = _this.data.countTime
    if (time === 0) {
      hasSend = true
      this.setData({
        countTime: reGetCodeTime,
        codeText: `重新发送`
      })
      return
    }
    setTimeout(() => {
      _this.setData({
        countTime: time - 1,
        codeText: `${time} 秒`
      })
      _this.countDown()
    }, 1000)
  },

})