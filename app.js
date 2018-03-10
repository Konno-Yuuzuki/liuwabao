import { setStorage, getStorage, getRandom, showModal, showToast, formatTime,showLoading } from './util/index.js'
import { getOpenId, getDevice, getMessage, ERR_OK } from './api/index.js'
import { hexMD5 } from './util/md5.js'

const AppId = 'wxc71a6783826d6c9f'
const AppSecret = '892cb6e93acfbff0f3d070ce2a97d61f'

// 开锁指令状态码
const SEND_OPEN = 20000
// 开锁通知状态码
const RECV_OPEN = 20001
// 还车指令状态码
const RECV_REVERT = 20002

App({
  onLaunch() {
    // wx.clearStorage()
    const _this = this;
    this.wechatLogin();

    // 获取桩位信息
    getDevice({ merchantId: 1 }).then(res => {
      // console.log(res,'桩')
      let ret = []
      const marker = {
        iconPath: "/images/icon_car_position.png",
        id: 0,
        width: 42,
        height: 52
      }
      res.data.maps2 && res.data.maps2.forEach(item => {
        ret.push(Object.assign({}, marker, item))
      })
      setStorage('markers', ret)
    })

    // 获取用户授权
    wx.getSetting({
      success(res) {
        // console.log(res, "获取用户授权")
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success(res) {
            }
          })
        }
      }
    })
    // 打开socket
    this.onSocket();
  },

  // 第一次打开获取微信授权
  wechatLogin() {
    wx.login({
      success: function (res) {
        // setStorage('loginCode', res.code)
        const data = {
          appid: AppId,
          secret: AppSecret,
          js_code: res.code,
          grant_type: 'authorization_code'
        }
        // 获取openid、session_key
        getOpenId(data).then(val => {
          // console.log(val, 'wx.login')
          setStorage('openid', val.openid)
          setStorage('session_key', val.session_key)
        })
        // 获取用户微信用户信息
        wx.getUserInfo({
          success: function (res) {
            // console.log(res, '用户信息');
            setStorage('userinfo', res.userInfo)
          },
        })
      },
    })
  },

  // socnket连接
  onSocket() {
    const random = getRandom()
    const rawSign = getStorage('userKey') + random
    const sign = hexMD5(getStorage('userKey') + random)
    let param = encodeURI(JSON.stringify({ random, sign }))
    const _this = this;
    let canUseSocket = false;
    let connected = false;
    const userId = getStorage('userId') ? getStorage('userId') : 0;
    // const userId = getStorage('userId');
    // console.log(userId, 'userId');
    const url = `wss://panda.100-bike.com/business/websocket/${userId}/${param}`
    // 启动socket
    wx.connectSocket({
      url,
      header: { 'content-type': 'application/json' },
      method: 'POST',
      protocols: [],
      success: function (res) {
        console.log(res, '连接socket')
      },
      fail: function (res) {
        console.log(res, 'connect fail')
      },
    })
    // 监听socket打开
    wx.onSocketOpen(res => {
      console.log(res, 'socket打开')
      canUseSocket = true
      connected = true
      // wx.closeSocket()
    })

    // 监听WebSocket错误
    wx.onSocketError(res => {
      console.log(res, 'WebSocket错误');
      // if (getStorage('userId') <= 0) {
      //   let timer = setTimeout(() => {
      //     _this.onSocket();
      //   }, 5000);
      // }
      // 当websocket连接失败时，调用轮询
      if (!connected && !canUseSocket) {                                                    
        _this.pollingData()
      }
    })

    // 监听WebSocket接受到服务器的消息事件
    wx.onSocketMessage(res => {
      const response = JSON.parse(res.data)
      // console.log(response, 'response')
      // console.log('recv id: ' + response.id + '; msg: ' + response.msg)
      // 用户还车后，进入结算页
      if (response.id === RECV_REVERT && response.data.map.success) {
        console.log(response.data.map, '费用');
        const { balance, useAmount, useTime } = response.data.map;
        const useCarInfo = {
          balance: balance / 100,
          useAmount: useAmount / 100,
          useTime
        }
        setStorage('useCarInfo', useCarInfo);
        wx.redirectTo({
          url: '/pages/result/result',
        })
      } else if (response.id === RECV_OPEN && response.data.map.success) {
        // 用户取车后，进入用车页
        showToast('取车成功', 'success');
        wx.redirectTo({
          url: '/pages/using-car/using-car',
        })
      } else if (response.id === RECV_OPEN && !response.data.map.success) {
        // 取车超时
        showModal('提示', '取车失败，余额已返还', true)
      }

      wx.onSocketClose(function (res) {
        connected = false
        if (!canUseSocket) {
          console.log('socket invalid！ use loop mode。')
          _this.pollingData()
        } else {
          console.log('socket close. begin connect after 5 second.')
          let timer = setTimeout(() => {
            _this.onSocket()
          }, 5000)
        }
      })
      console.log(response, '服务器返回数据')
    })
  },

  // 轮询替代websocket
  pollingData() {
    let timer = setTimeout(() => {
      let userId = getStorage('userId')
      if (!userId) {
        console.log('no login!')
        this.pollingData()
        return
      }
      getMessage({ userId: getStorage('userId') ? getStorage('userId') : 0 }).then(res => {
        console.log("getMessage ok.")
        // console.log(res)
        const { id, data } = res
        // 取车成功
        if (id === RECV_OPEN && data.map.success) {
          showLoading("取车成功")
          wx.redirectTo({
            url: '/pages/using-car/using-car',
          })
          clearTimeout(timer)
        } else if (id === RECV_OPEN && !data.map.success) {
          // 取车超时
          showModal('提示', '取车失败，余额已返还', true)
          clearTimeout(timer)
        } else if (id === RECV_REVERT && data.map.success) {
          // 取车成功 进入结算页
          console.log(res.data.map);
          const { balance, useAmount, useTime } = res.data.map
          const useCarInfo = {
            balance: balance / 100,
            useAmount: useAmount / 100,
            useTime
          }
          setStorage('useCarInfo', useCarInfo)
          wx.redirectTo({
            url: '/pages/result/result',
          })
          clearTimeout(timer)
        } else {
          if (res.status != 0) {
            // console.log("scan fail! " + res.msg)
            showToast(res.msg, 'none')
          }
        }
      })
      this.pollingData()
    }, 5000)
  },

  //获取当前位置
  getLocationInfo(cb) {
    const _this = this;
    if (this.globalData.locationInfo) {
      cb(this.globalData.locationInfo)
    } else {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          _this.globalData.locationInfo = res;
          cb(_this.globalData.locationInfo)
        },
        fail: (res) => {
          // console.log(res, '获取位置信息失败')
        },
        complete: (res) => {
        }
      })
    }
  },

  globalData: {
    locationInfo: null
  }
})