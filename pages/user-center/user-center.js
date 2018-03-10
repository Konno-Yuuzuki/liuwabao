import { getStorage, setStorage, showToast } from '../../util/index.js'
import { ERR_OK, getUserWallet, getUserFee, refundUser } from '../../api/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: "",
    centerList: [{
      image: '../../images/icon_borrow_car.png',
      label: '借车记录',
      icon: '../../images/Combined Shape.png',
    }, {
      image: '../../images/icon_charge.png',
      label: '充值记录',
      icon: '../../images/Combined Shape.png',
    }, {
      image: '../../images/icon_directions.png',
      label: '使用说明',
      icon: '../../images/Combined Shape.png',
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ userinfo: getStorage('userinfo') })
  },

  // 生命周期函数--监听页面显示
  onShow() {
    // console.log(getStorage("token"))
    this.getUserWallet();
  },

  // 获取余额
  getUserWallet() {
    const _this = this;
    getUserWallet({ userId: getStorage("userId"), toke: getStorage('token') }).then((res) => {
      if (res.status == ERR_OK) {
        _this.setData({
          userWallet: res.data.map.accountRest / 100
        })
      }
    })
  },

  // 退款
  refundMoney() {
    refundUser({ userId: getStorage("userId"), token: getStorage('token'), accountRefund: this.data.userWallet * 100 }).then(res => {
      if (res.status == 0) {
        showToast("退款成功");
        this.setData({
          userWallet: 0,
        })
      } else {
        showToast("退款失败", "none")
      }
    })
  },

  // 联系客服
  onMakeCall() {
    wx.makePhoneCall({
      phoneNumber: '12212121'
    })
  },
  // 跳转用车记录页
  onUseRecord() {
    wx.navigateTo({
      url: '/pages/car-record/car-record',
    })
  },
  // 前往充值
  goToCharge() {
    wx.navigateTo({
      url: '../charge-money/charge-money',
    })
  },
  // 前往充值记录
  gotoChargeRecord() {
    wx.navigateTo({
      url: '../recharge-record/recharge-record',
    })
  },
  // 前往使用手册
  gotoDirections() {
    wx.navigateTo({
      url: '../use-directions/use-directions',
    });
  },

  // 前往更换手机号
  changeNum() {
    wx.navigateTo({
      url: '../change-number/change-number',
    })
  },
  // 推出登陆
  exitLogin() {
    try {
      setStorage('userId', '')
      setStorage('userKey', '')
      // setStorage('userinfo', '')
      setStorage('hasLogin', false)
    } catch (e) {
      console.log(e);
      //Do something when catche error
    }
    if (getStorage('hasLogin') == false) {
      wx.navigateBack({
        delta: 1
      })
    }
  },
})