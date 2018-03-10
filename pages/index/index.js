import { getStorage, showModal, setStorage, showToast, showLoading } from '../../util/index.js'
import { getDevice, rechargeUser, refundUser, loginWX, getDeviceStake, getDeviceType, openLock, ERR_OK } from '../../api/index.js'
const WXBizDataCrypt = require('../../util/RdWXBizDataCrypt.js');
const app = getApp()
const AppId = 'wxc71a6783826d6c9f';

import { loading, drawCircle } from '../loading-temp/loading-temp.js'

Page({
  data: {
    userData: {},
    disable: false,
    getCarNow: false,
    canvasText: '连接中'

  },
  onLoad() {
    // this.checkLogin()
    // this.initUserinfo()
    // this.setData({ markers: getStorage('markers') })
    // console.log(getStorage('markers'))
    // 线控退款
    // refundUser({ userId: 12, accountRefund: 100, orderId: 800000275, token: 110 })
    // this.getLocationInfo();
  },

  // 当页面显示时
  onShow() {
    this.checkLogin();
    this.initUserinfo();
    this.setData({ markers: getStorage('markers') });
    // console.log(getStorage('markers'))
    // 线控退款
    // refundUser({ userId: 12, accountRefund: 100, orderId: 800000275, token: 110 })
    this.getLocationInfo();
    this.getControlPosition();
    // loading();
    // drawCircle();
  },

  // 当页面隐藏
  onHide() {
    this.setData({
      getCarNow: false,
    })
  },

  // 初始化用户信息
  initUserinfo() {
    if (!this.data.hasLogin) return
    this.setData({ userinfo: getStorage('userinfo') })
  },

  // 进入用户中心页
  goUserCenter() {
    wx.navigateTo({ url: '../user-center/user-center' })
  },

  // 判断是否登录,初始化hasLogin
  checkLogin() {
    if (getStorage('hasLogin')) {
      this.setData({ hasLogin: getStorage('hasLogin') })
    } else {
      this.setData({ hasLogin: getStorage('hasLogin') })
    }
  },

  // 拨打电话
  onMakeCall() {
    wx.makePhoneCall({
      phoneNumber: '1340000'
    })
  },

  //跳转注册
  onLoginClick() {
    wx.navigateTo({ url: '../login-type/login-type' })
  },

  // 扫码用车
  onButtonClick(e) {
    const _this = this
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        console.log(res, '扫码')
        const { result } = res
        // 利用正则截取result中的lockNo
        const reg = /https?:\/\/[^\/]+\/[^\?]*\?([^#]*)/;
        try {
          var codeStr = result.match(reg)[1];
        } catch (e) {
          showToast('扫码失败', 'none');
        }
        const code = codeStr.split('&')[0].substr(7);
        setStorage('qrcode', code);
        console.log({ code, userId: getStorage("userId") });
        getDeviceType({ code, userId: getStorage('userId') }).then(res => {
          if (res.status == 0) {
            console.log(res, 'getDeviceType');
            const { chargeType, chargeCycle, merchantId, unitFee, deposit, deviceId, deviceType, accountRest, } = res.data.map
            const userData = {
              userId: getStorage('userId'),
              merchantId,
              payType: 1,
              rechargeType: 1,
              accountRest: deposit,
              deviceId,
            }
            _this.setData({ userData: userData })
            if (deviceType === 2) {// 线控(无桩) 拉起充值   // 充值完成后跳转到用车页面
              if (accountRest < deposit) { //判断用户余额与预付金的大小
                if (chargeType == 1) {
                  showModal('计费规则', `单位费率: ${unitFee / 100}元 计费周期: ${chargeCycle}分钟`, true).then(res => {
                    if (res.confirm) {
                      _this.applyRechargeUser(userData)
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  })
                  // _this.setData({ isShowModal: true })
                } else if (chargeType === 2) {
                  showModal('计费规则', `本次用车费用：${res.data.map.maxDebiNum / 100}元`, true).then(res => {
                    if (res.confirm) {
                      _this.applyRechargeUser(userData)
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  })
                } else if (chargeType === 3) {
                  // _this.setData({ isShowModal: true })
                }
              } else {
                _this.setData({
                  getCarNow: true,
                })
                // loading();
                // drawCircle();
                showLoading("取车中");
                openLock({ userId: getStorage("userId"), deviceId: deviceId }).then(res => {
                  if (res.status == ERR_OK) {
                    console.log("开锁成功");
                  } else {
                    _this.setData({
                      getCarNow: false,
                    });
                    showToast(res.msg, "none");
                  }
                })
              }
            } else if (deviceType === 1) {
              // 点控(有桩)  跳转到选车页面
              wx.navigateTo({
                url: '../choose-car/choose-car',
              })
            }

          } else if (res.status == 11) {
            showToast("用户未找到,请重新登陆", "none");
          } else if (res.status == 2) { //用户冻结中，需要提交投诉
            showModal("警告", "您的账户已被冻结,是否提交还车投诉", true).then(res => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../return-car/return-car',
                });
              }
            })
          } else if (res.status == 51) { //用户重复租车
            showToast(res.msg, "none");
          }
        })
      }
    })
  },

  onChargeTempConfirm(data) {
    this.applyRechargeUser(this.data.userData)
    this.setData({ isShowModal: false })
  },

  onChargeTempCancel(data) {
    this.setData({ isShowModal: false })
  },

  // 调用用户充值
  applyRechargeUser: function (data) {
    const _this = this;
    rechargeUser(data).then(res => {
      console.log(res.status, 'res.status')
      if (res.status === ERR_OK) {
        const { nonceStr, paySign, pkg, signType, timeStamp } = res.data.map
        wx.requestPayment({
          timeStamp,
          nonceStr,
          package: pkg,
          signType: 'MD5',
          paySign,
          success: function (res) {
            console.log('充值成功');
            showLoading("取车中");
          },
          fail: function (res) {
            showToast("支付失败", "none")
          },
        })
      } else {
        showToast(res.msg, 'none');
      }
    })
  },

  // 微信登录 获取用户手机号
  getPhoneNumber: function (e) {
    // showModal('fuck you', 'fuck', true)
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
      const info = Object.assign({}, param, getStorage('userinfo'))
      // console.log(info)
      // showModal('info', JSON.stringify(param), true)
      // 登录接口 将获取的openid、手机号、用户信息发送给服务端
      loginWX(info).then(res => {
        if (res.status === 0) {
          setStorage('userId', res.data.map.userId);
          setStorage('userKey', res.data.map.userKey);
          setStorage('hasLogin', true);
          wx.redirectTo({ url: '../index/index' });
        }
      })
    }
  },

  // 获取自己位置信息
  getLocationInfo() {
    let _this = this;
    //  let timer = setTimeout(() => {
    app.getLocationInfo(function (locationInfo) {
      const myMarker = {
        iconPath: '/images/icon_position.png',
        id: 0,
        latitude: locationInfo.latitude,
        longitude: locationInfo.longitude,
      }
      // console.log(myMarker, 'mark')
      _this.setData({
        longitude: locationInfo.longitude,
        latitude: locationInfo.latitude,
        markers: [myMarker, ..._this.data.markers],
      })
    })
    // }, 3000);
    // this.getLocationInfo();
  },

  // 设置control组件的位置
  getControlPosition() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          // controls: [{
          //   id: 1,
          //   iconPath: '../../images/icon_position.png',
          //   position: {
          //     left: res.windowWidth / 2 - 8,
          //     top: res.windowHeight / 2 - 16,
          //     width: 30,
          //     height: 30
          //   }
          // }]
        })
      }
    })
  },

  //获取中间点的经纬度，并mark出来
  // getMapCenterPoint() {
  //   const _this = this;
  //   _this.mapCtx = wx.createMapContext("map");
  //   _this.mapCtx.getCenterLocation({
  //     success: (res) => {
  //       _this.setData({        
  //       })
  //     }
  //   })
  // },

  // 点击标记事件 
  getMarksData(event) {
    console.log(event)
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
  },

  // 点击地图时触发
  clickMap() {
    this.setData({
      showMarkDetail: false
    })
  },
  mapRegionchange() {
    this.clickMap();
  },

  // 联系客服
  contactService(e) {
    this.clickMap();
    wx.makePhoneCall({
      phoneNumber: '12212121'
    })
  },

  //还车未结算
  goToProblemSetting() {
    wx.navigateTo({
      url: '../return-car/return-car',
    })
  },

});