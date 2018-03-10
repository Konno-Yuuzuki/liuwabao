import { getStorage, setStora, showToast } from '../../util/index.js'
import { rechargeUser, getDeviceStake, refundUser, wxGetUserinfo, ERR_OK } from '../../api/index.js'
import { hexMD5 } from '../../util/md5.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelected: false,
    availableCarSrc: '/images/inuse1_car_yes_icon.png',
    deviceStake: [],
    deviceInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.checkLogin()
    this.initUserinfo()
    this.setData({ markers: getStorage('markers') })
    this.getDeviceStakeInfo()
    // refundUser({ userId: 12, accountRefund: 500, orderId: 800000070, token: 110})
  },
  // 初始化用户信息
  initUserinfo() {
    if (!this.data.hasLogin) return
    this.setData({ userinfo: getStorage('userinfo') })
  },

  // 判断是否登录,初始化hasLogin
  checkLogin() {
    if (getStorage('hasLogin')) {
      this.setData({ hasLogin: getStorage('hasLogin') })
    }
  },

  // 进入用户中心页
  goUserCenter() {
    wx.navigateTo({ url: '../user-center/user-center' })
  },
  onSelectCar(e) {
    this.setData({ stakeId: e.currentTarget.dataset.stackid})
    const flag = this.data.isSelected
    this.setData({ isSelected: !flag})
  },

  // 获取桩位信息
  getDeviceStakeInfo() {
    getDeviceStake({ userId: getStorage('userId'), code: 2118181001}).then(res => {
      this.setData({ deviceStake: res.data.maps })
      this.setData({ deviceInfo: res.data.map})
    })
  },

  // 用户充值
  onPayCar() {
    const { stakeId, deviceInfo} = this.data
    const { merchantId, deposit, deviceId } = deviceInfo
    if (!stakeId) {
      showToast('请选择车辆', 'none')
      return
    }
    const data = {
      userId: getStorage('userId'),
      merchantId,
      payType: 1,
      rechargeType: 1,
      accountRest: deposit,
      deviceId,
      stakeId
    }
    rechargeUser(data).then(res => {
      if (res.status === ERR_OK) {
        const { nonceStr, paySign, pkg, signType, timeStamp} = res.data.map
        wx.requestPayment({
          timeStamp,
          nonceStr,
          package: pkg,
          signType: 'MD5',
          paySign,
          success: function(res) {
            wx.navigateTo({
              url: '../using-car/using-car',
            })
            console.log(res)
          },
        })
      }
    })
  }

})