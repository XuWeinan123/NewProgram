// pages/buyGoods/buyGoods.js
var Bmob = require('../../utils/bmob.js');
var picUrl = "";
var pre_bio = "";
var wechat = "";
var mail = "";
// pages/newGoods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: "设置价格",
    name: "商品设置名称",
    wechat: "未设置",
    mail: "未设置",
    bio: "简介",

    sureModal: false,

    image_src: '/images/addPic.png',

    releaser_avaratUrl: "/images/default_avatar.png",
    releaser_name: "发布者"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wechat = options.wechat;
    mail = options.mail;
    //加载图片
    this.setData({
      image_src: options.picUrl,
      price: options.price + (options.price=="正无穷"?"":" 元"),
      name: options.name,
      wechat: options.wechat,
      mail: options.mail,
      bio: options.bio,
      releaser_avaratUrl: options.releaserAvatarUrl,
      releaser_name: options.releaserName
    })
    /*
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意
              wx.getUserInfo({
                success: function (res) {
                  console.log(res.userInfo)
                  that.setData({
                    releaser_avaratUrl: res.userInfo.avatarUrl,
                    releaser_name: res.userInfo.nickName
                  })
                }
              })
            }
          })
        } else {
          //早就同意啦
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              that.setData({
                releaser_avaratUrl: res.userInfo.avatarUrl,
                releaser_name: res.userInfo.nickName
              })
            }
          })
        }
      }
    })
    */
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
  /**
     * 弹出框蒙层截断touchmove事件
     */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      priceModal: false,
      nameModal: false,
      wechatModal: false,
      mailModal: false,
      sureModal: false
    });
  },
  //图片点击事件
  picTap: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        that.setData({
          image_src: res.tempFilePaths[0]
        })
        var tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length > 0) {
          var name = "1.jpg";//上传的图片的别名，建议可以用日期命名
          var file = new Bmob.File(name, tempFilePaths);
          file.save().then(function (res) {
            picUrl = res.url();
          }, function (error) {

          })
        }
      },
    })
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 价格对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
    if (this.pre_price == undefined || this.pre_price == '') {
      this.setData({
        price: "设置价格"
      })
    } else {
      this.setData({
        price: this.pre_price + " 元"
      })
    }
  },
  //名称对话框确认按钮点击事件
  nameOnConfirm: function () {
    this.hideModal();
    if (this.pre_name == undefined || this.pre_name == '') {
      this.setData({
        name: "商品设置名称"
      })
    } else {
      this.setData({
        name: this.pre_name
      })
    }
  },
  //微信对话框确认按钮点击事件
  wechatOnConfirm: function () {
    this.hideModal();
    if (this.pre_wechat == undefined || this.pre_wechat == '') {
      this.setData({
        wechat: "未设置"
      })
    } else {
      this.setData({
        wechat: this.pre_wechat
      })
    }
  },
  //邮箱对话框确认按钮点击事件
  mailOnConfirm: function () {
    this.hideModal();
    if (this.pre_mail == undefined || this.pre_mail == '') {
      this.setData({
        mail: "未设置"
      })
    } else {
      this.setData({
        mail: this.pre_mail
      })
    }
  },
  //确定添加点击事件
  sureOnConfirm: function () {
    this.hideModal();
    if (true) {
      var that = this;
      var user = Bmob.User.current();
      console.log(that.pre_price);
      //创建上传类和实例
      var Goods = Bmob.Object.extend("Goods");
      var goods = new Goods();
      goods.save({
        price: that.pre_price,
        name: that.pre_name,
        wechat: that.pre_wechat,
        mail: that.pre_mail,
        bio: pre_bio,
        picUrl: picUrl,
        releaser: user
      }, {
          success: function (result) {
            // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
            console.log("对象创建成功, objectId:" + result.id);
            wx.navigateBack();
          },
          error: function (result, error) {
            // 添加失败
            console.log('创建对象失败');
          }
        });
    } else {
      wx.showToast({
        title: "信息不完整"
      })
    }
  },

  toAddGoods: function (content) {
    console.log(wechat);
    console.log(mail);
    if (wechat != "") {
      wx.setClipboardData({
        data: wechat,
        success:function(res){
          wx.showToast({
            title: '联系微信 已复制到剪贴板',
            icon: 'none'
          })
        }
      })
      
    }else if(mail != ""){
      wx.setClipboardData({
        data: mail,
        success: function(res){
          wx.showToast({
            title: '联系邮箱 已复制到剪贴板',
            icon: 'none'
          })
        }
      })
      
    }
  }
})