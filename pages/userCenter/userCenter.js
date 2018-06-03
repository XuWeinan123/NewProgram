// pages/userCenter/userCenter.js
var Bmob = require('../../utils/bmob.js');
var array;
var currnetGoods = -1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pre_wechat: "未设置",
    wechat: "未设置",
    pre_mail: "未设置",
    mail: "未设置",
    array: [],
    itemcount: 3,
    currnetGoodsName: "",
    sureModal: false,
    wechatModal: false,
    mailModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //查询用户的微信
    var user = Bmob.User.current();
    this.setData({
      wechat: user.get("wechat"),
      mail: user.get("mail")
    })
    //更新商品
    var Goods = Bmob.Object.extend("Goods");
    var query = new Bmob.Query(Goods);
    query.equalTo("releaser", user.id);
    query.find({
      success: function (results) {
        // 循环处理查询到的数据
        console.log("查询到了数据")
        console.log(results);
        array = results;
        that.setData({
          array: results
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })
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
  //点击默认微信
  wechatLabelTap: function (options) {
    this.setData({
      wechatModal: true
    })
  },
  //点击默认邮箱
  mailLabelTap: function (options) {
    this.setData({
      mailModal: true
    })
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
      });
      //更新服务器
      var user = Bmob.User.current();
      user.set("wechat",this.pre_wechat)

      var _User = Bmob.Object.extend("_User");
      var query = new Bmob.Query(_User);
      // 这个 id 是要修改条目的 objectId，你在
      query.get(user.id, {
        success: function (result) {
          // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
          result.set('wechat', user.get("wechat"));
          result.save();
          // The object was retrieved successfully.
        },
        error: function (object, error) {

        }
      });
    }
  },
  //邮箱对话框确认按钮点击事件
  mailOnConfirm: function () {
    this.hideModal();
    if (this.pre_mail == undefined || this.pre_mail == '') {
      this.setData({
        mail: "未设置"
      })
      //更新服务器
    } else {
      this.setData({
        mail: this.pre_mail
      })
      //更新服务器
      var user = Bmob.User.current();
      user.set("mail", this.pre_mail)

      var _User = Bmob.Object.extend("_User");
      var query = new Bmob.Query(_User);
      // 这个 id 是要修改条目的 objectId，你在
      query.get(user.id, {
        success: function (result) {
          // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
          result.set('mail', user.get("mail"));
          result.save();
          // The object was retrieved successfully.
        },
        error: function (object, error) {
        }
      });
    }
  },
  //微信
  wechatInputBlur: function (content) {
    this.pre_wechat = content.detail.value;
  },
  //邮箱
  mailInputBlur: function (content) {
    this.pre_mail = content.detail.value;
  },
  deletaModal:function(e){
    currnetGoods = e.currentTarget.dataset.id
    this.setData({
      currnetGoodsName: array[currnetGoods].get("name"),
      sureModal:true
    })
    
  },
  //确定添加点击事件
  sureOnConfirm: function () {
    var that = this
    this.hideModal();
    array[currnetGoods].destroy({
      success: function (myObject) {
        //更新商品
        var user = Bmob.User.current();
        var Goods = Bmob.Object.extend("Goods");
        var query = new Bmob.Query(Goods);
        query.equalTo("releaser", user.id);
        query.find({
          success: function (results) {
            // 循环处理查询到的数据
            console.log("查询到了数据")
            console.log(results);
            array = results;
            that.setData({
              array: results
            })
          },
          error: function (error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        })
        // 删除成功
        wx.showToast({
          title: '删除成功',
        })
        
      },
      error: function (myObject, error) {
        // 删除失败
        wx.showToast({
          title: '删除失败',
        })
      }
    });
  },
  onCancel: function () {
    this.hideModal();
  }, 
  hideModal: function () {
    this.setData({
      sureModal: false,
      wechatModal: false,
      mailModal: false
    });
  }
})