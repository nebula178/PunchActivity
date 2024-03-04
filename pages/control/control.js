const app = getApp()
Page({
  data: {
    isChecked: false,
    isChecked_1: false,
    contro_length : 0,
    cycles_length : 0,
    dataObj : [],
    dataObj_1 : [],
  },

  //开关控制0
  changeSwitch: function (e){
    const orchecked = e.detail.value;
    this.setData({
      isChecked: orchecked
    });
  },
  //开关控制1
  changeSwitch_1: function (e){
    const orchecked = e.detail.value;
    this.setData({
      isChecked_1: orchecked
    });
  },
 
  //详情页面
  toDetail: function (e){
  //  console.log(e)
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },

  toDetail_1: function (e){
    //  console.log(e)
      wx.navigateTo({
        url: '/pages/detail_1/detail_1?id=' + e.currentTarget.dataset.id,
      })
  },

  del: function(e){
    const that = this
    wx.showModal({
      title: '确认删除', //提示的标题
      content: '是否删除打卡活动？', //提示的内容
      success: function(res) {
        if(res.confirm) {
          wx.cloud.database().collection('control_once').where({  //成功删除活动
            _id: e.currentTarget.dataset.id
          }).get({
            success(res){
              console.log(res.data[0].QRcode)
              wx.cloud.deleteFile({  
                fileList:[res.data[0].QRcode],
                success(result){
                  console.log('删除此活动二维码',)
                }
              })
              wx.cloud.database().collection('control_once').where({  //成功删除活动
                _id: e.currentTarget.dataset.id
              }).remove({
                success(result){
                  console.log('成功删除活动')
                  wx.showToast({
                    title: '删除中...', //提示的内容
                    duration: 1000, //持续的时间
                    icon: 'loading', //图标有success、error、loading、none四种
                    mask: true //显示透明蒙层 防止触摸穿透
                }) 
                  that.getOnceList()
                }
              })
            }
          })
          wx.cloud.database().collection('participant').where({  //成功删除参与人员
            cardid: e.currentTarget.dataset.id  
          }).remove({
            success(res){
              console.log('成功删除参与人员')
            }
          })
          wx.cloud.database().collection('once_actions').where({  //成功删除打卡信息
            cardid: e.currentTarget.dataset.id
          }).get({
            success(res){
              for(var i=0 ; i<res.data.length ; i++){  //删除云存储中的图片
                if(res.data[i].image != ''){
                  wx.cloud.deleteFile({  
                    fileList:[res.data[i].image],
                    success(result){
                      console.log('删除云存储中图片',)
                    }
                  })
                }
              }
              wx.cloud.database().collection('once_actions').where({  //成功删除打卡信息
                cardid: e.currentTarget.dataset.id    
              }).remove({
                success(result){
                  console.log('成功删除打卡信息')
                }
              })
            }
          })
          wx.cloud.database().collection('once_total').where({  //成功删除参与人员
            cardid: e.currentTarget.dataset.id  
          }).remove({
            success(res){
              console.log('成功删除参与人员打卡统计')
            }
          })
        } else if (res.cancel) {
          console.log('用户点击了取消')
        }
      }
    })  
  },

  del_1: function(e){
    const that = this
    wx.showModal({
      title: '确认删除', //提示的标题
      content: '是否删除打卡活动？', //提示的内容
      success: function(res) {
        if(res.confirm) {
          wx.cloud.database().collection('control_cycles').where({  //成功删除活动
            _id: e.currentTarget.dataset.id
          }).get({
            success(res){
              console.log(res.data[0].QRcode)
              wx.cloud.deleteFile({  
                fileList:[res.data[0].QRcode],
                success(result){
                  console.log('删除此活动二维码',)
                }
              })
              wx.cloud.database().collection('control_cycles').where({  //成功删除活动
                _id: e.currentTarget.dataset.id
              }).remove({
                success(result){
                  console.log('成功删除活动')
                  wx.showToast({
                    title: '删除中...', //提示的内容
                    duration: 1000, //持续的时间
                    icon: 'loading', //图标有success、error、loading、none四种
                    mask: true //显示透明蒙层 防止触摸穿透
                }) 
                  that.getCyclesList()
                }
              })
            }
          })
          wx.cloud.database().collection('part').where({  //成功删除参与人员
            cardid: e.currentTarget.dataset.id  
          }).remove({
            success(res){
              console.log('成功删除参与人员')
            }
          })
          wx.cloud.database().collection('cycles_actions').where({  //成功删除打卡信息
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
          wx.cloud.database().collection('cycles_total').where({  //成功删除参与人员
            cardid: e.currentTarget.dataset.id  
          }).remove({
            success(res){
              console.log('成功删除参与人员打卡统计')
            }
          })
        } else if (res.cancel) {
          console.log('用户点击了取消')
        }
      }
    })  
  },

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
    wx.cloud.database().collection('control_once').where({
      _openid: app.globalData.openid
    }).get({
      success(res){
        that.setData({
          contro_length: res.data.length,
          dataObj: res.data
        });
        console.log('获取单次打卡列表',that.data.dataObj)
      }
    })
  },
  getCyclesList(){  //获取周期打卡列表
    const that = this
    wx.cloud.database().collection('control_cycles').where({
      _openid: app.globalData.openid
    }).get({
      success(result){
        that.setData({
          cycles_length: result.data.length,
          dataObj_1: result.data
        });
        console.log('获取周期打卡列表',that.data.dataObj_1)
      }
    })
  },

  onPullDownRefresh(){
    this.getOnceList()
    this.getCyclesList()
  }
})