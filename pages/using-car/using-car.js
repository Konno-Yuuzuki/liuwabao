import { getStorage, setStorage, getRandom, normalizeTime } from '../../util/index.js'
import { getUserFee, reportFault, ERR_OK } from '../../api/index.js'
import { showMarksData } from '../pile-temp/pile-temp.js';
import { hexMD5 } from '../../util/md5.js'
const app = getApp()

let countNum = 0
let timer = null
let countTimer = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    countTime: '00:00',
    fee: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkLogin()
    this.initUserinfo()
    this.setData({ markers: getStorage('markers') })
    this.countDown()
    this.getLocationInfo()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({ countTime: '00:00' })
    countNum = 0
    clearTimeout(countTimer)
    clearTimeout(timer)
  },

  clearTimer() {
    // wx.redirectTo({
    //   url: '/pages/result/result',
    // })
  },

  // 进入用户中心页
  goUserCenter() {
    wx.navigateTo({ url: '../user-center/user-center' })
  },



  // 初始化用户信息
  initUserinfo() {
    if (!this.data.hasLogin) return
    this.setData({ userinfo: getStorage('userinfo') })
  },

  // 获取自己位置信息
  getLocationInfo() {
    const _this = this;
    app.getLocationInfo(function (locationInfo) {
      // console.log('map', locationInfo);
      _this.setData({
        longitude: locationInfo.longitude,
        latitude: locationInfo.latitude
      })
      console.log(_this.data)

    })
  },

  // 计算用车费用
  getUseCarFee() {
    const _this = this
    timer = setTimeout(() => {
      getUserFee({ userId: getStorage('userId') }).then(res => {
        console.log(res, "计算用车费用");
        if (res.status === ERR_OK) {
          this.setData({ fee: res.data.map.useFee })
        }
        _this.getUseCarFee()
      })
    }, 60000)
  },

  // 判断是否登录,初始化hasLogin
  checkLogin() {
    if (getStorage('hasLogin')) {
      this.setData({ hasLogin: getStorage('hasLogin') })
    }
  },

  // 计时
  countDown() {
    const _this = this
    countTimer = setTimeout(() => {
      countNum += 1
      _this.setData({ countTime: `${normalizeTime(countNum)}` })
      _this.countDown()
    }, 1000)
  },

  uploadCarProblem() {
    wx.navigateTo({
      url: '../car-problem/car-problem',
    })
  },

  returnCarWrong() {
    console.log("你点击了还车失败")
  },


  // 上传图片
  chooseimage: function () {
    const _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['camera'],
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
      }
    })
  },

  getMarksData(event) {
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
  // 车辆故障
  gotoProblem() {
    wx.navigateTo({
      url: '../car-problem/car-problem',
    })
  },
  //还车未结算
  goToProblemSetting() {
    wx.navigateTo({
      url: '../return-car/return-car',
    })
  },
})