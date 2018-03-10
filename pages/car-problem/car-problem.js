// pages/car-problem/car-problem.js
import { chooseImage, getStorage, showToast } from '../../util/index.js';
import { uploadFile, reportFault, ERR_OK } from '../../api/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // chooseProblemIndex: '',
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

  // 选择损坏部件
  chooseProblem(event) {
    console.log(event.target)
    const chooseIndex = event.target.dataset.index;
    this.setData({
      chooseIndex,
    })
    switch (chooseIndex) {
      case '0':
        this.setData({
          chooseProblem: '坐凳',
        })
        break;
      case '1':
        this.setData({
          chooseProblem: '把手',
        })
        break;
      case '2':
        this.setData({
          chooseProblem: '围圈',
        })
        break;
      case '3':
        this.setData({
          chooseProblem: '轮子',
        })
        break;
      case '4':
        this.setData({
          chooseProblem: '扶手',
        })
        break;
      default:
        break;
    }
  },

  // 选择图片
  chooseImage() {
    const _this = this;
    chooseImage({ count: 1 }).then((res) => {
      console.log(res);
      const selectImage = res.tempFilePaths[0];
      _this.setData({
        selectImage,
      })
    })
  },

  //获取文本框中的内容
  getProblemInfo(event) {
    const _this = this;
    if (!event.detail.value) {
      _this.setData({
        problemInfo: event.detail.value
      })
    }
  },

  // 提交
  submitProblem() {
    const _this = this;
    console.log("你点击了上传");
    reportFault({
      userId: getStorage('userId'),
      deviceId: deviceId,
      faultPicture: faultPicture,
      faultKindName: _this.data.chooseProblem,
      info: _this.data.problemInfo
    }).then((res) => {
      if (res.status == ERR_OK) {
        showToast("提交成功");
        setTimeout(() => {
          wx.navigateBack({
            delta: s1
          });
        }, 1500)
      } else {
        showToast("提交失败");
      }
    })
  }
})