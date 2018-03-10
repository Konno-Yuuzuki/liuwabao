import { isMobilehone, showModal, showToast, setStorage, getStorage } from '../../util/index.js'
import { sendVerifyCode, loginWX, wxGetUserinfo, loginUser, getOpenId, ERR_OK } from '../../api/index.js'
const app = getApp();

const WXBizDataCrypt = require('../../util/RdWXBizDataCrypt.js');
const AppId = 'wxc71a6783826d6c9f';

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取openID appID

  },

  // 微信登录
  getPhoneNumber: function (e) {
    if (!e.detail.encryptedData && !e.detail.iv) {
      showToast('登录失败', 'none')
    } else {
      const { encryptedData, iv } = e.detail
      const pc = new WXBizDataCrypt(AppId, getStorage('session_key'))
      const data = pc.decryptData(encryptedData, iv)
      const param = {
        openId: getStorage('openid'),
        phone: data.phoneNumber
      }
      loginWX(Object.assign(param, getStorage('userinfo'))).then(res => {
        console.log(res, '手机号登录');
        if (res.status === 0) {
          setStorage('userId', res.data.map.userId)
          setStorage('userKey', res.data.map.userKey)
          setStorage('token', res.data.map.token)
          setStorage('hasLogin', true)
          // wx.redirectTo({ url: '../index/index' })
          wx.navigateBack({  //跳转首页
            delta: 1,
          })
          console.log(res.data.map.userId)
        }
      })
    }
  },
  onWechatLogin(e) {

  },
  toLogin() {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  gotoAgreement() {
    wx.navigateTo({
      url: '../login-agreement/login-agreement',
    })
  }
})