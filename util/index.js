//验证手机号
export function isMobilehone(phone) {
  var regNum = new RegExp("^1(3[0-9]|4[0-9]|5[0-9]|7[0-9]|8[0-9])\\d{8}$", 'g');
  if (!regNum.exec(phone)) {
    return false;
  }
  return true;
}

// 获取随机数
export function getRandom() {
  const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  let num = ''
  for (let i = 0; i < 16; i++) {
    let id = parseInt(Math.random() * 61);
    num += chars[id];
  }
  return num;
}

// 显示弹窗
export function showModal(title, content, flag) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      showCancel: flag ? flag : false,
      success: function (res) {
        resolve(res)
      }
    })
  })
};

// 选择图片
export const chooseImage = ({ count }) => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count,
      success: function (res) {
        resolve(res);
      },
      fail: (res) => {
        reject(res);
      }
    })
  })
}

// 显示Toast
export function showToast(title, icon) {
  title = title ? title : "错误！"
  wx.showToast({
    title,
    icon,
    duration: 2000
  })
}

export function showLoading(title = '加载中') {
  wx.showLoading({
    title,
    mask: true,
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}

// 设置Storage
export function setStorage(key, data) {
  wx.setStorageSync(key, data)
}

// 获取Storage
export function getStorage(key) {
  return wx.getStorageSync(key)
}

export function normalizeTime(time) {
  if (!time) return
  let hour, minute, second;
  second = Math.floor(time % 60);
  let delta = Math.floor(time / 60);
  if (delta >= 60) {
    hour = Math.floor(delta / 60);
    minute = Math.floor(delta % 60);
  } else {
    minute = delta;
  }
  if (hour) {
    hour = hour >= 10 ? hour : `0${hour}`;
  }
  minute = minute >= 10 ? minute : `0${minute}`;
  second = second >= 10 ? second : `0${second}`;
  return hour ? `${hour}:${minute}:${second}` : `${minute}:${second}`;
}


export function formatTime(time) {
  if (!time) return
  let hour, minute, second
  second = Math.floor(time % 60)
  let delta = Math.floor(time / 60)
  if (delta >= 60) {
    hour = Math.floor(delta / 60)
    minute = Math.floor(delta % 60)
  } else {
    minute = delta
  }
  if (hour) {
    hour = hour >= 10 ? hour : `0${hour}`
  }
  minute = minute >= 10 ? minute : `0${minute}`
  second = second >= 10 ? second : `0${second}`
  return hour ? `${hour}小时${minute}分${second}秒` : `${minute}分${second}秒`
}