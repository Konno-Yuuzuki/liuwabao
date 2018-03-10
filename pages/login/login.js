import { isMobilehone, showModal, showToast, setStorage, getStorage } from '../../util/index.js'
import { sendVerifyCode, loginWX, wxGetUserinfo, loginUser, getOpenId, ERR_OK } from '../../api/index.js'
const WXBizDataCrypt = require('../../util/RdWXBizDataCrypt.js');

const reGetCodeTime = 59
let hasSend = true

const AppId = 'wxc71a6783826d6c9f'

// 加密后的手机号信息
let phoneInfo = null
let session_key = null

// pages/login/login.js
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
    // 获取openid、session_key
  },
  // 手机号登录
  onLogin(e) {
    console.log(getStorage("openid"));
    const { phoneNum, verifyCode } = this.data
    loginUser({ userName: phoneNum, verify: verifyCode }).then(res => {
      console.log(res, "手机号登录")
      // const openId = res.data.map.openId;
      wx.getUserInfo({
        success: function (res) {
          // setStorage('userinfo', res.userInfo)
          console.log(res.userInfo, 'res.userInfo');
          loginWX(Object.assign(param, res.userInfo)).then(res => {
            if (res.status === 0) {
              setStorage('userId', res.data.map.userId)
            }
          })
        },
      })
      const param = {
        openId: getStorage('openid'),
        phone: this.data.phoneNum
      }
      console.log(getStorage('userinfo'), 'userinfo');
      if (res.status === ERR_OK) {
        setStorage('phoneNum', phoneNum)
        setStorage('userinfo', res.data.map)
        setStorage('hasLogin', true)
        // wx.redirectTo({ url: '../index/index' })
        // showToast("登录成功", 'none');

        showModal('微信绑定', '为了您更好的使用需要绑定微信,是否绑定微信', true).then(res => {
          if (res.confirm) {

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        })

        setTimeout(() => {
          wx.navigateBack({
            delta: 2
          }, 500);
        });
      } else {
        showToast(res.msg, 'none')
      }
    })
  },
  // 微信登录
  getPhoneNumber: function (e) {
    if (!e.detail.encryptedData && !e.detail.iv) {
      showToast('登录失败', 'none')
    } else {
      const { encryptedData, iv } = e.detail
      const pc = new WXBizDataCrypt(AppId, getStorage('session_key'))
      const data = pc.decryptData(encryptedData, iv)
      console.log(data)
      const param = {
        openId: getStorage('openid'),
        phone: data.phoneNumber
      }
      loginWX(Object.assign(param, getStorage('userinfo'))).then(res => {
        if (res.status === 0) {
          console.log(res.data.map.userId)
          setStorage('userId', res.data.map.userId)

          // setStorage('hasLogin', true)
          // wx.redirectTo({ url: '../index/index' })
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  onWechatLogin(e) {
  },
  // wx.login({
  //   success: function (res) {
  //     wx.request({
  //       url,
  //       data: {
  //         appid: AppId,
  //         secret: AppSecret,
  //         js_code: res.code,
  //         grant_type: 'authorization_code'
  //       },
  //       header: {
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       },
  //       success: function (res) {
  //         const openId = val.data.openid
  //         console.log(openId)
  //         wx.getUserInfo({
  //           success: function (data) {
  //             console.log(data.userInfo)
  //           },
  //         })
  //       },
  //     })
  //   },
  // })
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
  gotoAgreement() {
    wx.navigateTo({
      url: '../login-agreement/login-agreement',
    })
  }
})