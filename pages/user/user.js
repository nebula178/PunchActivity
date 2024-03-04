const app = getApp()
Page({
  data: {

  },

  onLoad(options) {
    console.log('直接加载用户数据')
  //  console.log(app.globalData.userInfo)
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  login() {
    wx.getUserProfile({
        desc: '必须授权才能继续使用', // 必填 声明获取用户个人信息后的用途，后续会展示在弹窗中
        success:(res)=> { 
            console.log('授权成功', res);
            var user = res.userInfo
            app.globalData.userInfo = user
            this.setData({ 
                userInfo:user
            })

            //用户数据表
            //检查之前是否已经授权
            wx.cloud.database().collection('login_users').where({
              _openid: app.globalData.openid
            }).get({
              success(res){
              //  console.log('user.js',res)
                if(res.data.length==0){
                  console.log('之前没授权')
                  //添加记录到数据库
                  wx.cloud.database().collection('login_users').add({
                    data: {
                      avatarUrl : user.avatarUrl,
                      nickName : user.nickName
                    },
                    success(res){
                    //  console.log('user.js',res)
                      wx.showToast({
                        title: '登录成功',
                      })
                    }
                  })
                }
              }
            })
        },
        fail:(err)=> {
            console.log('user.js授权失败', err);
        }
    })
},

loginOut(){
  this.setData({ 
      userInfo : null
  })
  // 清空缓存
  app.globalData.userInfo = null
}

})