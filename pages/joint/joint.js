const app = getApp()
Page({
  data: {
    isChecked: false,
    isChecked_1: false,
    contro_length : 0,
    cycles_length : 0,
    dataObj: [],
    card_id: '',
    card_id1: ''
  },

  //开关控制
  changeSwitch: function (e){
    const orchecked = e.detail.value;
    this.setData({
      isChecked: orchecked
    });
  },
  //开关控制
  changeSwitch_1: function (e){
    const orchecked = e.detail.value;
    this.setData({
      isChecked_1: orchecked
    });
  },

  //详情页面
  toDetail: function (e){
    const that = this
  //  console.log(e.currentTarget.dataset.id)
    wx.cloud.database().collection('participant').where({
      _id: e.currentTarget.dataset.id
    }).get({
      success(res){
      //  console.log(res)
        that.setData({
          card_id: res.data[0].cardid
        })
        wx.navigateTo({
          url: '/pages/detail/detail?id=' + that.data.card_id,
        })
      }
    })
    
  },
  //详情页面
  toDetail_1: function (e){
    const that = this
  //  console.log(e.currentTarget.dataset.id)
    wx.cloud.database().collection('part').where({
      _id: e.currentTarget.dataset.id
    }).get({
      success(res){
        console.log(res)
        that.setData({
          card_id1: res.data[0].cardid
        })
        wx.navigateTo({
          url: '/pages/detail_1/detail_1?id=' + that.data.card_id1,
        })
      }
    })
  },

  del: function(e){
    const that = this
    wx.showModal({
      title: '确认删除', //提示的标题
      content: '是否删除打卡活动？', //提示的内容
      success: function(r) {
        if(r.confirm) { //用户点击了确定
          wx.cloud.database().collection('participant').where({  //成功删除我的参与
            cardid: e.currentTarget.dataset.id,
            _openid: app.globalData.openid 
          }).remove({
            success(res0){
              console.log('成功删除参与人员A')
              wx.showToast({
                title: '删除中...', //提示的内容
                duration: 1000, //持续的时间
                icon: 'loading', //图标有success、error、loading、none四种
                mask: true //显示透明蒙层 防止触摸穿透
             })       
              that.getOnceList()
            }
          })
          wx.cloud.database().collection('once_actions').where({  //成功删除我的打卡信息
            _openid: app.globalData.openid,
            cardid: e.currentTarget.dataset.id
          }).get({
            success(res){
              for(var i=0 ; i<res.data.length ; i++){  //删除云存储中的图片
                if(res.data[i].image != ''){
                  wx.cloud.deleteFile({
                    fileList:[res.data[i].image],
                    success(result){
                      console.log('删除云存储中图片')
                    }
                  })
                }
              }
              wx.cloud.database().collection('once_actions').where({  //成功删除打卡信息
                cardid: e.currentTarget.dataset.id,
                _openid: app.globalData.openid
              }).remove({
                success(result0){
                  console.log('成功删除打卡信息')
                }
              })
            }
          })
          wx.cloud.database().collection('once_total').where({  //成功删除我的打卡信息
            _openid: app.globalData.openid,
            cardid: e.currentTarget.dataset.id
          }).remove({
            success(result1){
              console.log('成功删除人员A打卡信息统计',result1)
            }
          })
        } else if (r.cancel) {
          console.log('用户点击了取消')
        }
      }
    })  
  },
  del_1: function(e){
    console.log(e)
    const that = this
    wx.showModal({
      title: '确认删除', //提示的标题
      content: '是否删除打卡活动？', //提示的内容
      success: function(r) {
        if(r.confirm) { //用户点击了确定
          wx.cloud.database().collection('part').where({  //成功删除我的参与
            cardid: e.currentTarget.dataset.id,
            _openid: app.globalData.openid 
          }).remove({
            success(resul){
              console.log('成功删除参与人员B')
              wx.showToast({
                title: '删除中...', //提示的内容
                duration: 1000, //持续的时间
                icon: 'loading', //图标有success、error、loading、none四种
                mask: true //显示透明蒙层 防止触摸穿透
             })       
              that.getCyclesList()
            }
          })
          wx.cloud.database().collection('cycles_actions').where({  //成功删除我的打卡信息
            _openid: app.globalData.openid,
            cardid: e.currentTarget.dataset.id
          }).get({
            success(res){
              for(var i=0 ; i<res.data.length ; i++){  //删除云存储中的图片
                if(res.data[i].image != ''){
                  wx.cloud.deleteFile({
                    fileList:[res.data[i].image],
                    success(result){
                      console.log('删除云存储中图片')
                    }
                  })
                }
              }
              wx.cloud.database().collection('cycles_actions').where({  //成功删除打卡信息
                cardid: e.currentTarget.dataset.id
              }).remove({
                success(result0){
                  console.log('成功删除打卡信息')
                }
              })
            }
          })
          wx.cloud.database().collection('cycles_total').where({  //成功删除我的打卡信息
            _openid: app.globalData.openid,
            cardid: e.currentTarget.dataset.id
          }).remove({
            success(result1){
              console.log('成功删除人员B的打卡信息统计')
            }
          })
        } else if (r.cancel) {
          console.log('用户点击了取消')
        }
      }
    })  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getOnceList()
    this.getCyclesList()
    //数据
    this.setData({
      userInfo: app.globalData.userInfo
    })

  },

  getOnceList(){  //获取单次打卡列表
    const that = this
    wx.cloud.callFunction({
      name:'once_List',
      success(res){
        console.log('云函数获取单次打卡列表',res.result.list)
        that.setData({
          contro_length: res.result.list.length,
          dataObj: res.result.list
        })
      }
    })
  },
  getCyclesList(){  //获取周期打卡列表
    const that = this
    wx.cloud.callFunction({
      name:'cycles_List',
      success(res){
        console.log('云函数获取周期打卡列表',res.result.list)
        that.setData({
          cycles_length: res.result.list.length,
          dataObj_1: res.result.list
        })
      }
    })
  },

  onPullDownRefresh(){
    this.getOnceList()
    this.getCyclesList()
  }
})