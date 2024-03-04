
App({
  onLaunch() {

    //云开发环境初始化
    wx.cloud.init({
      env:"clock-4g6f5ppv9c26dde8"
    })

    //获取用户的oppenid
    var that = this;
    wx.cloud.callFunction({
      name:'login_get_openid',
      success(res){
        console.log('获取用户的oppenid')
      //  console.log(res)
        that.globalData.openid = res.result.openid

        //查找数据库用户表里面是否有用这个记录
        wx.cloud.database().collection('login_users').where({
          _openid: res.result.openid
        }).get({
          success(result){
            console.log('全局变量userInfo赋值')
          //  console.log(result)
            that.globalData.userInfo = result.data[0]
          }
        })
      }
    })

  },
  
  globalData: {
    userInfo : null,
    openid : null
  }
})
