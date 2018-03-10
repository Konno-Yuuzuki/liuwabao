const app = getApp()
const BASE_URL = 'https://panda.100-bike.com'

const AppId = 'wxc71a6783826d6c9f'
const AppSecret = '892cb6e93acfbff0f3d070ce2a97d61f'
// 获取设备信息
const GET_DEVICE = `${BASE_URL}/business/getDevice.do`

const REPORT_FAULT = `${BASE_URL}/business/reportFault.do`
const FORECE_REVERT = `${BASE_URL}/business/reportFault.do`
const GET_DEVICE_STAKE = `${BASE_URL}/business/getDeviceStake.do`
const GET_DEVICE_TYPE = `${BASE_URL}/business/getDeviceType.do`
const SEND_VERIFY_CODE = `${BASE_URL}/business/sendVerifyCode.do`
const LOGIN_USER = `${BASE_URL}/business/loginUser.do`
const WX_GET_USERINFO = `${BASE_URL}/business/weixin/getUserinfo.do`
const REFUND_USER = `${BASE_URL}/business/refundUser.do`
const RECHARGE_USER = `${BASE_URL}/business/rechargeUser.do`
const LOGIN_WX = `${BASE_URL}/business/loginWeixin.do`
const GET_USER_FEE = `${BASE_URL}/business/getUserFee.do`
const GET_REVERT_RECORD = `${BASE_URL}/business/getRevertRecord.do`
const GET_MESSAGE = `${BASE_URL}/business/action/getMessage.do`
const GET_OPENID = 'https://api.weixin.qq.com/sns/jscode2session'
// 获取用户钱包
const GET_GETUSERWALLET = `${BASE_URL}/business/getUserWallet.do`;
// 文件上传
const UPLOADFILE = `${BASE_URL}/business/forceClose.do`;
// 用户开锁
const OPEN_LOCK = `${BASE_URL}/business/openLock.do`;
// 用户充值记录
const RECHARGE_RECORD = `${BASE_URL}/basis/recharge/query.do`;

// 成功状态码
export const ERR_OK = 0

export function getDevice(data) {
  return getUrlReturn(GET_DEVICE, data)
}
export function reportFault(data) {
  return getUrlReturn(REPORT_FAULT, data)
}

export function getDeviceStake(data) {
  return getUrlReturn(GET_DEVICE_STAKE, data)
}

export function getDeviceType(data) {
  return getUrlReturn(GET_DEVICE_TYPE, data)
}

export function sendVerifyCode(data) {
  return getUrlReturn(SEND_VERIFY_CODE, data)
}

export function loginUser(data) {
  return getUrlReturn(LOGIN_USER, data)
}

export function wxGetUserinfo(data) {
  return getUrlReturn(WX_GET_USERINFO, data)
}

export function rechargeUser(data) {
  return getUrlReturn(RECHARGE_USER, data)
}

export function refundUser(data) {
  return getUrlReturn(REFUND_USER, data)
}

export function getOpenId(data) {
  return getUrlReturn(GET_OPENID, data, 'GET')
}

export function loginWX(data) {
  return getUrlReturn(LOGIN_WX, data)
}

export function getUserFee(data) {
  return getUrlReturn(GET_USER_FEE, data)
}

export function getRevertRecord(data) {
  return getUrlReturn(GET_REVERT_RECORD, data)
}

export function getMessage(data) {
  return getUrlReturn(GET_MESSAGE, data)
}
// 获取用户钱包
export const getUserWallet = (data) => {
  return getUrlReturn(GET_GETUSERWALLET, data)
}
// 充值记录
export const getUserChrageData = (data) => {
  return getUrlReturn()
};
// 文件上传
export const upLoadFile = (filePath, name) => {
  return upLoadFileReturn(UPLOADFILE, filePath, name);
};
// 用户开锁
export const openLock = (data) => {
  return getUrlReturn(OPEN_LOCK, data);
};
//用户充值记录
export const reChargeRecord =(data)=>{
  return getUrlReturn(RECHARGE_RECORD,data);
}


/**
 * 封装获取数据的统一方法， 返回Promise
 */
export function getUrlReturn(url, data, method) {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      header: { 'content-type': 'application/json' },
      method: method ? method : 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        resolve(res.data)
      },
      fail: function (res) {
        reject(res.data)
      },
      complete: function (res) { },
    })
  })
}

// 文件上传
export const upLoadFileReturn = (url, filPath, name) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url,
      filePath,
      name: name ? name : 'file',
      success: (res) => {
        resolve(res);
      },
      fail: (res) => {
        reject(res);
      }
    })
  })
}

// export const getS