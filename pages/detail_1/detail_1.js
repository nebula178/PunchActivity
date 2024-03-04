const app = getApp()
Page({
  data: {
    u: 0, //判断加入还是二维码
    cardId: '',
    dataObj: []
  },

  joinIn: function(){ //加入打卡活动
    const that = this
    wx.cloud.database().collection('part').add({
      data: {
        cardid: that.data.cardId
      },
      success(res){
        wx.showToast({
          title: '加入成功',
        })
        that.setData({
          u: 1
        })
      }
    })
    wx.cloud.database().collection('cycles_total').add({
      data: {
        cardid: that.data.cardId,
        date: '',
        number: 0,
        nickName: app.globalData.userInfo.nickName,
        faceImg: app.globalData.userInfo.avatarUrl
      },
      success(res){
        console.log('用户已加入统计表')
      }
    })
  },

  goToClock: function(e){
  //  console.log(e)
    wx.redirectTo({
      url: '/pages/clock_1/clock_1?id=' + e.currentTarget.dataset.id,
    })
  },

  //全屏展示图片
  viewImg: function(){
    let that = this
    const QRCode = [] 
    QRCode[0] = that.data.dataObj[0].QRcode
    wx.previewImage({
      current: '',
      urls: QRCode,
    })
  },

  //按钮判断
  judgeButton: function(){
    const that = this
  //  console.log('进入判断')
    wx.cloud.database().collection('cycles_total').where({  //是否已经加入活动
      cardid: that.data.cardId,
      _openid: app.globalData.openid
    }).get({
      success(res){
    //    console.log(res.data.length)
        if(res.data.length!=0){  //判断用户是否已经加入这个活动
          that.setData({  //加入输出1
            u:1
          })
        }
        else{
          that.setData({  //没加入输出0
            u:0  
          })
        }
      }
    })
  },

  login() {
    const that = this
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
                  wx.showToast({
                    title: '登录成功',
                  })
                  that.judgeButton()
                }
              })
            }
            else{
            //  console.log('判断')
              that.judgeButton()
            }
          }
        })
      },
      fail:(err)=> {
        console.log('user.js授权失败', err);
      }
    })
  },

  onLoad(options) {
    const that = this
    console.log('接收到的',options.scene)
    console.log('接收到的',options.id)

    if(options.scene){  //扫码
      //卡片信息对象赋值
      wx.cloud.database().collection('control_cycles').where({  //页面展示
        _id: options.scene
      }).get({
        success(result){
          console.log('卡片信息',result.data)
          that.setData({
            dataObj: result.data
          });
        }
      })
      that.setData({
        cardId: options.scene
      })

      if(app.globalData.userInfo != null){
        wx.cloud.database().collection('cycles_total').where({  //是否已经加入活动
          cardid: options.scene,
          _openid: app.globalData.openid
        }).get({
          success(res){
            if(res.data.length!=0){  //判断用户是否已经加入这个活动
              that.setData({  //加入输出1
                u:1
              })
            }
            else{
              that.setData({  //没加入输出0
                u:0  
              })
            }
          }
        })
      }
      else{
        that.setData({  //需要登录
          u: 2
        })
      }
    }
    else{
      that.setData({
        u: 1,
        cardId: options.id
      })
      //卡片信息对象赋值
      wx.cloud.database().collection('control_cycles').where({  
        _id: options.id
      }).get({
        success(result){
          console.log('卡片信息',result.data)
          that.setData({
            dataObj: result.data
          });
        }
      })
    }
  },
})