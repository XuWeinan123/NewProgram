//index.js
//获取应用实例
const app = getApp()
var Bmob = require('../../utils/bmob.js');
var that;

Page({
  data: {
    isAuth:false,
    components: [
      // {
      //   name: '永生钢笔',
      //   remark: '上拉菜单',
      //   url: '/pages/actionsheet/index',
      //   icon: '../../assets/images/iconfont-actionsheet.png',
      //   bio: '这是一只买过来后就没再写过的钢笔……',
      // }
    ],
    user_avatar: "/images/default_avatar.png"
  },
  onShow:function(){
    var that = this
    getGoods(this);
    // 登录
    wx.login({
      success: function (res) {
        var user = new Bmob.User();//实例化          
        user.loginWithWeapp(res.code).then(function (user) {
          console.log("nickName" + user.get("nickName"));
          if (user.get("nickName")) {
            //更新缓存中的openid
            wx.setStorageSync('openid', user.get("openid"))
            that.setData({
              isAuth: true
            })
          } else {
            //*************保存用户其他信息，比如昵称头像之类的*****************
            //先判断授权
            wx.getSetting({
              success(res){
                //如果已经授权，那么更新用户信息
                if (res.authSetting['scope.userInfo']) {
                  console.log("已授权");
                  that.setData({
                    isAuth: true
                  })
                  wx.getUserInfo({
                    success: function (result) {
                      var nickName = result.userInfo.nickName;
                      var avatarUrl = result.userInfo.avatarUrl;
                      var openid = result.userInfo.openid;
                      var u = Bmob.Object.extend("_User");
                      var query = new Bmob.Query(u);
                      // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
                      query.get(user.id, {
                        success: function (result) {
                          // 自动绑定之前的账号
                          result.set('nickName', nickName);
                          result.set("userPic", avatarUrl);
                          result.set("openid", openid);
                          result.save();
                        }
                      });
                      //更新当前用户
                      user.set('nickName',nickName);
                      user.set("userPic", avatarUrl);
                      //更新界面元素
                      that.setData({
                        user_avatar: avatarUrl
                      })
                    }
                  });
                }else{
                  console.log("没有授权");
                }
              }
            })
            //*************保存用户其他信息，比如昵称头像之类的end*****************
          }
          //更新用户头像
          var user = Bmob.User.current();
          that.setData({
            user_avatar: user.get("userPic")
          })
        }, function (err) {
          console.log(err, 'errr');
        });
      }
    });
    //console.log("当前用户"+user.get("userPic"))
  },
  toAddGoods:function(){
    console.log("添加新商品")
  },
  refreshPage: function(){
    this.setData({
      isAuth:true
    })
    console.log("获取授权")
  },
  onPullDownRefresh:function(){
    console.log("刷新商品")
    getGoods(this);
  }
})
function getGoods(t) {
  that = t;
  var Goods = Bmob.Object.extend("Goods");
  var query = new Bmob.Query(Goods);
  query.find({
    success: function (results) {
      // 循环处理查询到的数据
      console.log("查询到了数据")
      console.log(results);
      that.setData({
        components: results.reverse()
      });
      wx.stopPullDownRefresh();
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}