import { getRevertRecord, ERR_OK } from '../../api/index.js'
import { getStorage, setStora, showLoading, formatTime } from '../../util/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.getRecord()
  },

  // 获取用车记录
  getRecord() {
    showLoading()
    getRevertRecord({ userId: getStorage('userId')}).then(res => {
      console.log(res)
      if (res.status === ERR_OK) {
        wx.hideLoading()
        this.setData({ recordList: this.normalizeList(res.data.maps)})
      }
    })
  },

  normalizeList(list) {
    let ret = []
    list.forEach(item => {
      let obj = {}
      obj.amount = parseInt(item.amount) / 100
      obj.inputTime = item.inputTime.substr(0, 10)
      obj.useTimeLength = formatTime(item.useTimeLength)
      obj.deviceKindName = item.deviceKindName
      ret.push(obj)
    })
    return ret
  },

})