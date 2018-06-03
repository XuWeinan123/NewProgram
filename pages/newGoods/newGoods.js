var Bmob = require('../../utils/bmob.js');
var picUrl = "";
var pre_bio = "";
// pages/newGoods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pre_price: 0,
    price: "设置价格",
    priceModal: false,
    pre_name: "商品设置名称",
    name: "商品设置名称",
    nameModal: false,
    pre_wechat: "未设置",
    wechat: "未设置",
    wechatModal: false,
    pre_mail: "未设置",
    mail: "未设置",
    mailModal: false,

    sureModal: false,

    image_src: '/images/addPic.png',

    releaser_avaratUrl: "/images/default_avatar.png",
    releaser_name: "发布者"
  },
  //点击价格
  priceLabelTap: function (options) {
    this.setData({
      priceModal: true
    })
  },
  //点击名称
  nameLabelTap: function (options) {
    this.setData({
      nameModal: true
    })
  },
  //点击微信
  wechatLabelTap: function (options) {
    this.setData({
      wechatModal: true
    })
  },
  //点击邮箱
  mailLabelTap: function (options) {
    this.setData({
      mailModal: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var user = Bmob.User.current();
    pre_bio = "";
    that.setData({
      releaser_avaratUrl: user.get("userPic"),
      releaser_name: user.get("nickName")
    })
    //获取当前用户的微信和邮箱
    if (user.get("wechat") != "") {
      that.setData({
        wechat: user.get("wechat")
      })
    }
    if (user.get("mail") != "") {
      that.setData({
        mail: user.get("mail")
      })
    }
    
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
        price: this.pre_price + (this.pre_price == "正无穷"?"":" 元")
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
      wx.showLoading({
        title: '添加中',
      })
      goods.save({
        price: that.pre_price,
        name: that.pre_name,
        wechat: that.data.wechat,
        mail: that.data.mail,
        bio: (pre_bio != "" ? pre_bio:"卖家很懒没有填写简介"),
        picUrl: picUrl,
        releaser: user,
        releaserAvatarUrl: user.get("userPic"),
        releaserName: user.get("nickName"),
        releaserId: user.id
      }, {
          success: function (result) {
            // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
            console.log("对象创建成功, objectId:" + result.id);
            wx.hideLoading();
            wx.navigateBack();
          },
          error: function (result, error) {
            // 添加失败
            console.log('创建对象失败');
            wx.hideLoading();
          }
        });
    } else {
      wx.showToast({
        title: "信息不完整"
      })
    }
  },
  /**
   * 价格对话框失去焦点事件
   */
  inputBlur: function (content) {
    this.pre_price = content.detail.value;
  },
  //名称对话框失去焦点事件
  nameInputBlur: function (content) {
    this.pre_name = content.detail.value;
  },
  //微信
  wechatInputBlur: function (content) {
    this.pre_wechat = content.detail.value;
  },
  //邮箱
  mailInputBlur: function (content) {
    this.pre_mail = content.detail.value;
  },
  //简介
  bioInputBlur: function (content) {
    pre_bio = content.detail.value;
  },
  toAddGoods: function (content) {
    console.log(this.data.price)
    console.log(this.data.name)
    console.log(this.data.wechat)
    console.log(this.data.mail)

    //跳转到需要填写的地方
    if (this.data.image_src == "/images/addPic.png") {
      wx.showToast({
        title: '商品图片缺失！',
        icon: "none"
      })
    }else if (this.data.price == "设置价格") {
      wx.showToast({
        title: '价格未填写！',
        icon: "none"
      })
      this.setData({
        priceModal: true
      })
    } else if (this.data.name == "商品设置名称") {
      wx.showToast({
        title: '名称未填写！',
        icon: "none"
      })
      this.setData({
        nameModal: true
      })
    } else if ((this.data.wechat == undefined) && (this.data.mail == undefined)) {
      wx.showToast({
        title: '联系方式未填写！',
        icon: "none"
      })
    }else {
      this.setData({
        sureModal: true
      })
    }
  }
})