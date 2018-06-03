//app.js

var Bmob = require('utils/bmob.js');
var that;


// var BmobSocketIo = require('utils/bmobSocketIo.js').BmobSocketIo;
// const BmobSocketIo = require('utils/tunnel');
Bmob.initialize(
  'b47c5a32d807a7fa9e5b50f5f5e8e3c2',
  '64e5294add7183cefc26ae2012751f0a'
)
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    
  },
  globalData: {
    userInfo: null
  }
})
