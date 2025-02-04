var api=require('../../api');
var app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
    loginInfo:{
        code:'',
        spread_spid:0,
        spread_code:0
    },
    openid:'', //用户的唯一身份标识
    nickname:'', //用户的微信昵称
    flag:1
    },
    login()
    {
    let that = this;
      //调用微信小程序的登录接口
          //调用微信小程序的获取用户信息的接口
          wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途
            lang: 'zh_CN',
            success(info) {
              //把获取到的信息复制到data中的loginInfo中
              that.data.loginInfo = Object.assign( that.data.loginInfo, info );
              that.nickname=info.userInfo.nickName;
              app.globalData.avatorUrl=info.userInfo.avatarUrl;
              app.globalData.nickname=info.userInfo.nickName;
              that.setData({
                nickname:info.userInfo.nickName
              })
              wx.switchTab({
                url:"../home/home",
              })
              //在此可以使用云数据库进行存储用户信息
              //调用后台的接口，把所有整合的个人信息传过去
             // that.handlerLogin( that.data.loginInfo );
            },
            fail(e) {
              console.log('获取用户信息失败', e);
            }
          })
     wx.login({
        success(e) {
          //that.data.loginInfo.code = e.code; //拿到的code存储在data中
          console.log(e);
          if(e.code){
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session', //用于请求用户的openid，作为数据库中的主键
              data: {
                 //填上自己的小程序唯一标识
                appid: 'wxe9a9c73f636ac70a',
                 //填上自己的小程序的 app secret
                secret: '611c80114f7032d312ba97295ca21008', //小程序密钥
                js_code: e.code,
                grant_type: 'authorization_code',
              },
              method: 'GET',
              header: { 'content-type': 'application/json'},
              success: function(openIdRes){
                   console.log("登录成功返回的openId：" + openIdRes.data.openid);
                   that.openid=openIdRes.data.openid;
                   app.globalData.openid=openIdRes.data.openid; //存储到全局变量中
                   that.setData({
                     openid:openIdRes.data.openid
                   })
                   that.judge(that.openid);
                   //将openid作为主键存储到数据库中，再加上用户姓名和性别作为用户基本信息
              },
              fail: function(error) {
                  console.info("获取用户openId失败");
                  console.info(error);
              }
          })
        }
        },
        fail(e) {
          console.log('fail', e);
          wx.showToast({
            title: '网络异常',
            duration: 2000
          })
          return;
        }
      })
      setTimeout(this.handlerLogin,5000);
  },
  judge:function(appid)
  {
    let that=this;
      wx.cloud.callFunction({
          // 云函数名称
          name: 'user',
          // 传给云函数的参数
          data: {
            type:'is_Find',
            openid:appid,
          },
          success: function(res) {
            console.log(res.result.data.length);
            that.flag=res.result.data.length;
            that.setData({
                flag:res.result.data.length,
            })
          },
          fail: console.error
        })
  },
//调用后台的接口，传递信息
  async handlerLogin() {
  console.log(this.flag);
  if(!this.flag)
  {
  console.log("ss");
  console.log(this.nickname);
  wx.cloud.callFunction({
    // 云函数名称
    name: 'user',
    // 传给云函数的参数
    data: {
      type:'basicId',
      nickname:this.nickname,
      openid:this.openid,
    },
    success: function(res) {
      console.log("用户基本信息已上传")
    },
    fail: console.error
  })
}
  
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

    }
})