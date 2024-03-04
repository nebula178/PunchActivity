const app = getApp()
var util = require('../../utils/util')
Page({
  data: {
    u: true,  //假设今天能打卡，时间判定
    v: false,   //假设今天星期几符合
    inputValue: '',  //文本
    tempFilePaths: [],  //图片
    cloudImg: '',  //图片
    cardid: '',
    endDate: '',
    endTime: '',
    information: '',
    lati: 0,
    longi: 0,
    scope: 0,
    site: true,
    siteName: '',
    startDate: '',
    startTime: '',
    text: false,  //？
    openId: '',
    num: 0
  },

  goToOrder: function(){
    const that = this
    //  console.log(e)
    wx.redirectTo({
      url: '/pages/orderBy_1/orderBy_1?id=' + that.data.cardid,
    })
  },

  //判断是否可以打卡
  clock: function (){
    console.log(util.formatDate(new Date()))
    var that = this
    //判断是否在可以打卡的时间段内
    wx.cloud.database().collection('control_cycles').where({  //找到卡片信息进行判断
      _id: that.data.cardid
    }).get({
      success(res){
        if(util.formatDate(new Date())>=res.data[0].startDate && util.formatDate(new Date())<=res.data[0].endDate){ //  console.log('日期是否符合')
          if(util.formatDate(new Date()) == res.data[0].startDate){//  console.log('早于开始时间')
            if(util.formatTimer(new Date()) < res.data[0].startTime){
              that.data.u = false  //不能打卡
            }
          }
          if(util.formatDate(new Date()) == res.data[0].endDate){//  console.log('晚于结束时间')
            if(util.formatTimer(new Date()) > res.data[0].endTime){
              that.data.u = false  //不能打卡
            }
          }
        }  //同单次打卡时间判定相同
        else{//  console.log('不在打卡时间内')
          that.data.u = false  //不能打卡
        }
        if(that.data.u == false){  //时间不对不能打卡
          wx.showToast({
            title: '当前不在打卡时间', //提示的内容
            duration: 1500, //持续的时间
            icon: 'none', //图标有success、error、loading、none四种
            mask: true //显示透明蒙层 防止触摸穿透
         })
         return; 
        }
        else{  //u:true星期是否符合
          if(util.formatWeek(new Date()) == 0){ //今天是周日
            if(res.data[0].week0 == true){  //打卡频率包括周日
              that.data.v = true
            }
          }
          if(util.formatWeek(new Date()) == 1){
            if(res.data[0].week1 == true){
              that.data.v = true
            }
          }
          if(util.formatWeek(new Date()) == 2){
            if(res.data[0].week2== true){
              that.data.v = true
            }
          }
          if(util.formatWeek(new Date()) == 3){
            if(res.data[0].week3 == true){
              that.data.v = true
            }
          }
          if(util.formatWeek(new Date()) == 4){
            if(res.data[0].week4 == true){
              that.data.v = true
              console.log( that.data.v)
            }
          }
          if(util.formatWeek(new Date()) == 5){
            if(res.data[0].week5 == true){
              that.data.v = true
            }
          }
          if(util.formatWeek(new Date()) == 6){
            if(res.data[0].week6 == true){
              that.data.v = true
            }
          }
          if(that.data.v == true){
            if(util.formatTimer(new Date()) <= res.data[0].end && util.formatTimer(new Date()) >= res.data[0].start){
              //判断今天是否已经打过卡
              wx.cloud.database().collection('cycles_actions').where({
                cardid: that.data.cardid,
                _openid: app.globalData.userInfo._openid,
                data: util.formatDate(new Date())
              }).get({
                success(result){
                  if(result.data.length!=0){
                    wx.showToast({
                      title: '今日已打过卡', //提示的内容
                      duration: 1500, //持续的时间
                      icon: 'none', //图标有success、error、loading、none四种
                      mask: true //显示透明蒙层 防止触摸穿透
                  })
                  return;
                  }
                  else{
                    //最终是否能够打卡
                  //  console.log('今天没打过卡')
                    that.data.text = true
                    that.setData({
                      text: true
                    })
                  }
                }
              })
            }
            else{
              wx.showToast({
                title: '当前不在打卡时间', //提示的内容
                duration: 1500, //持续的时间
                icon: 'none', //图标有success、error、loading、none四种
                mask: true //显示透明蒙层 防止触摸穿透
             })
             return; 
            }
          }
          else{
            wx.showToast({
              title: '今天不能打卡', //提示的内容
              duration: 1500, //持续的时间
              icon: 'none', //图标有success、error、loading、none四种
              mask: true //显示透明蒙层 防止触摸穿透
           })
           return; 
          }
        }
      }
    })
    
    //判断是否需要定位
    wx.cloud.database().collection('control_cycles').where({
      _id: that.data.cardid
    }).get({
      success(res){
        that.data.site = res.data[0].site
        that.data.siteName =  res.data[0].siteName
        that.setData({
          site:  res.data[0].site
        })
      }
    })
  },

  //判断打卡距离
  site_scope: function (){
    var that = this
    wx.cloud.database().collection('control_cycles').where({
      _id: that.data.cardid
    }).get({
      success(res){
        that.data.site = res.data[0].site
        that.setData({
          site:  res.data[0].site
        })
        if(res.data[0].site == true){   //需要地理位置
          var lat1,lng1  //用户所在的纬度经度
          var lat2 = res.data[0].lati  //活动打卡位置的纬度
          var lng2 = res.data[0].longi  //活动打卡位置的经度
          var scope = res.data[0].scope   //活动打卡的范围
          wx.getLocation({  //获取我所在的坐标
            type: 'wgs84',  //返回GBS坐标
            success: function (res2) {
              lat1 = res2.latitude,  //用户所在的纬度
              lng1 = res2.longitude  //用户所在的经度
              // 计算两地之间的距离
              var radLat1 = lat1 * Math.PI / 180.0;
              var radLat2 = lat2 * Math.PI / 180.0;
              var a = radLat1 - radLat2;
              var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
              var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
              s = s * 6378.137;
              s = Math.round(s * 10000) / 10000;
              scope = scope*0.001;
              if (Number(s)>scope){  //'距打卡位置过远'弹窗
                wx.showModal({
                  title: '温馨提示',
                  content: '距打卡位置过远',
                });
                return;
              }
              else{
                wx.showToast({ //'当定位成功'
                  title: '当定位成功', //提示的内容
                  duration: 1500, //持续的时间
                  icon: 'success', //图标有success、error、loading、none四种
                  mask: true //显示透明蒙层 防止触摸穿透
               })
               that.data.site = false
               that.setData({
                 site: false
               })
              }
              console.log('两点之间距离多少km：',s);

            }
          })
        }
        else{
          that.data.site = false
          that.setData({
            site: false
          })
        }
      }
    })
  },

  //获取输入的文本
  getValue: function (e){
    this.setData({
      inputValue: e.detail.value
    })
  },

  //选择图片
  upImage: function (e){
    var that = this
    if(that.data.tempFilePaths.length == 0){
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
        //  console.log(res)
          that.data.tempFilePaths[0] = res.tempFilePaths
          that.setData({
            tempFilePaths : res.tempFilePaths
          })
        //  that.upcloudImage()
        }
      })
    }
    else{
      wx.showToast({
        title: '只能上传一张图片', //提示的内容
        duration: 1500, //持续的时间
        icon: 'error', //图标有success、error、loading、none四种
        mask: true //显示透明蒙层 防止触摸穿透
     })   
    }
  },

  //删除图片
  deleteImg(e){
    var that = this
  //  console.log(e.currentTarget.dataset.index)
    this.data.tempFilePaths=[]
    this.setData({
      tempFilePaths: that.data.tempFilePaths
    })
  },

  viewImg0: function(){
    const that = this
    wx.previewImage({
      current: '',
      urls: that.data.tempFilePaths,
    })
  },

  //全屏展示图片
  viewImg: function(e){
    //console.log(e.currentTarget.dataset.id)
    const that = this
    const viewImg = [] 
    wx.cloud.database().collection('cycles_actions').where({
      _id: e.currentTarget.dataset.id
    }).get({
      success(res){
      //  console.log(res.data[0].image)
        viewImg[0] = res.data[0].image
        wx.previewImage({
          current: '',
          urls: viewImg,
        })
      }
    })
  },

  //提交打卡数据
  submitData: function (){
    var that = this
    if(that.data.inputValue == ''){
      wx.showToast({
        title: '文本内容不能为空', //提示的内容
        duration: 1500, //持续的时间
        icon: 'none', //图标有success、error、loading、none四种
        mask: true //显示透明蒙层 防止触摸穿透
     })
     return
    }
    
    wx.cloud.database().collection('control_cycles').where({  //找到卡片信息进行判断
      _id: that.data.cardid
    }).get({
      success(res){
        if(util.formatDate(new Date())>=res.data[0].startDate && util.formatDate(new Date())<=res.data[0].endDate){ //  console.log('日期是否符合')
          if(util.formatDate(new Date()) == res.data[0].startDate){//  console.log('早于开始时间')
            if(util.formatTimer(new Date()) < res.data[0].startTime){
              that.data.u = false  //不能打卡
            }
          }
          if(util.formatDate(new Date()) == res.data[0].endDate){//  console.log('晚于结束时间')
            if(util.formatTimer(new Date()) > res.data[0].endTime){
              that.data.u = false  //不能打卡
            }
          }
        }  //同单次打卡时间判定相同
        else{//  console.log('不在打卡时间内')
          that.data.u = false  //不能打卡
        }
        if(that.data.u == false){  //时间不对不能打卡
          wx.showToast({
            title: '当前不在打卡时间', //提示的内容
            duration: 1500, //持续的时间
            icon: 'none', //图标有success、error、loading、none四种
            mask: true //显示透明蒙层 防止触摸穿透
         })
         return; 
        }
        else{  //u:true星期是否符合
          if(util.formatWeek(new Date()) == 0){ //今天是周日
            if(res.data[0].week0 == true){  //打卡频率包括周日
              that.data.v = true
            }
          }
          if(util.formatWeek(new Date()) == 1){
            if(res.data[0].week1 == true){
              that.data.v = true
            }
          }
          if(util.formatWeek(new Date()) == 2){
            if(res.data[0].week2== true){
              that.data.v = true
            }
          }
          if(util.formatWeek(new Date()) == 3){
            if(res.data[0].week3 == true){
              that.data.v = true
            }
          }
          if(util.formatWeek(new Date()) == 4){
            if(res.data[0].week4 == true){
              that.data.v = true
              console.log( that.data.v)
            }
          }
          if(util.formatWeek(new Date()) == 5){
            if(res.data[0].week5 == true){
              that.data.v = true
            }
          }
          if(util.formatWeek(new Date()) == 6){
            if(res.data[0].week6 == true){
              that.data.v = true
            }
          }
          if(that.data.v == true){
            if(util.formatTimer(new Date()) <= res.data[0].end && util.formatTimer(new Date()) >= res.data[0].start){
              //判断今天是否已经打过卡
              wx.cloud.database().collection('cycles_actions').where({
                cardid: that.data.cardid,
                _openid: app.globalData.userInfo._openid,
                data: util.formatDate(new Date())
              }).get({
                success(result){
                  if(result.data.length!=0){
                    wx.showToast({
                      title: '今日已打过卡', //提示的内容
                      duration: 1500, //持续的时间
                      icon: 'none', //图标有success、error、loading、none四种
                      mask: true //显示透明蒙层 防止触摸穿透
                  })
                  return;
                  }
                  else{  //今天能打卡
                    //  console.log(that.data.tempFilePaths.length)
                    if(that.data.tempFilePaths.length!=0){ //上传图片到云
                      wx.cloud.uploadFile({
                        cloudPath: `cycles_actImg/${Math.random()}_${Date.now()}.${that.data.tempFilePaths[0].match(/\.(\w+)$/)[1]}`,
                        filePath: that.data.tempFilePaths[0], // 文件路径
                        success(result0){
                          that.data.cloudImg = result0.fileID
                          wx.cloud.database().collection('cycles_actions').add({  //打卡信息存到云数据库
                            data: {
                              cardid: that.data.cardid,
                              nickName: app.globalData.userInfo.nickName,
                              faceImg: app.globalData.userInfo.avatarUrl,
                              text: that.data.inputValue,
                              image: that.data.cloudImg,
                              data: util.formatDate(new Date()),
                              dateTime: util.formatTime(new Date()),
                              siteName: that.data.siteName,
                            },
                            success(result1){
                              wx.showToast({
                                title: '打卡成功', //提示的内容
                                duration: 1500, //持续的时间
                                icon: 'success', //图标有success、error、loading、none四种
                                mask: true //显示透明蒙层 防止触摸穿透
                            })
                            that.data.text = false
                            that.setData({
                              text: false
                            })
                            that.getActionsList()
                            }
                          })
                        }
                      })
                    }
                    else{
                      wx.cloud.database().collection('cycles_actions').add({  //打卡信息存到云数据库
                        data: {
                          cardid: that.data.cardid,
                          nickName: app.globalData.userInfo.nickName,
                          faceImg: app.globalData.userInfo.avatarUrl,
                          text: that.data.inputValue,
                          image: '',
                          data: util.formatDate(new Date()),
                          dateTime: util.formatTime(new Date()),
                          siteName: that.data.siteName,
                        },
                        success(result5){
                          console.log(result5)
                          wx.showToast({
                            title: '打卡成功', //提示的内容
                            duration: 1500, //持续的时间
                            icon: 'success', //图标有success、error、loading、none四种
                            mask: true //显示透明蒙层 防止触摸穿透
                        })
                        that.data.text = false
                        that.setData({
                          text: false
                        })
                        that.getActionsList()
                        },
                        
                      })
                    }

                    wx.cloud.database().collection('cycles_total').where({  //统计数据库
                      cardid: that.data.cardid,
                      _openid: app.globalData.openid
                    }).get({
                      success(result3){
                        wx.cloud.database().collection('cycles_total').where({
                          cardid: that.data.cardid,
                         _openid: app.globalData.openid
                        }).update({
                          data: {
                            number: result3.data[0].number + 1,
                            date: util.formatTime(new Date()),
                          }
                        })
                      } 
                    })

                  }
                }
              })
            }
            else{
              wx.showToast({
                title: '当前不在打卡时间', //提示的内容
                duration: 1500, //持续的时间
                icon: 'none', //图标有success、error、loading、none四种
                mask: true //显示透明蒙层 防止触摸穿透
             })
             return; 
            }
          }
          else{
            wx.showToast({
              title: '今天不能打卡', //提示的内容
              duration: 1500, //持续的时间
              icon: 'none', //图标有success、error、loading、none四种
              mask: true //显示透明蒙层 防止触摸穿透
           })
           return; 
          }
        }
      }
    })
  },

  //删除打卡数据
  deleteAction: function(e){
  //  console.log(e.currentTarget.dataset.id)
    var that = this
    wx.showModal({
      title: '确认删除', //提示的标题
      content: '是否删除打卡信息？', //提示的内容
      success: function(r) {
        if(r.confirm) {
          wx.cloud.deleteFile({  //删除云存储中的图片
            fileList:[that.data.cloudImg],
            success(res){
              console.log(res,'删除文件')
            }
          })
          wx.cloud.database().collection('cycles_actions').doc(e.currentTarget.dataset.id).remove({
            success(result){
              wx.showToast({
                title: '删除成功！', //提示的内容
                duration: 1000, //持续的时间
                icon: 'none', //图标有success、error、loading、none四种
                mask: true //显示透明蒙层 防止触摸穿透
              })
              that.getActionsList()
              //获取此人最大时间并更新
              wx.cloud.database().collection('cycles_actions')  //排序
                .orderBy('dateTime','desc')
                .get()
                  .then(result0=>{
                    console.log('降序成功',result0.data)
                    for(var i=0 ; i<result0.data.length ; i++){
                      if(result0.data[i].cardid == that.data.cardid && result0.data[i]._openid == app.globalData.openid){
                        wx.cloud.database().collection('cycles_total').where({  //统计数据库
                          cardid: that.data.cardid,
                          _openid: app.globalData.openId
                        }).get({
                          success(result1){
                            wx.cloud.database().collection('cycles_total').where({
                              cardid: that.data.cardid,
                              _openid: app.globalData.openid
                            }).update({
                              data: {                     
                                date: result0.data[i].dateTime,
                                number: result1.data[0].number - 1,
                              }
                            })
                          } 
                        })
                        return
                      }
                    }
                    wx.cloud.database().collection('cycles_total').where({
                      cardid: that.data.cardid,
                      _openid: app.globalData.openid
                    }).update({
                      data: {                     
                        date: '',
                        number: 0
                      }
                    })
                  })

            }
          })
        } else if (r.cancel) {
          console.log('用户点击了取消')
        }
      }
    })
  },

  //获取当前活动列表
  getActionsList: function (){
    var that = this
    wx.cloud.callFunction({
      name:'get_cycleActions',
      data:{
        cardid: that.data.cardid
      },
      success(res){
        console.log('打卡信息',res.result.data)
        that.setData({
          actionsList: res.result.data
        })
      }
    })
  },

  onLoad(options) {
    var that = this
  //  console.log(options)
    this.setData({
      openId: app.globalData.userInfo._openid
    })
    this.data.cardid = options.id
  //  console.log(app.globalData.userInfo)
    wx.cloud.database().collection('control_cycles').where({  //信息提示
      _id: that.data.cardid
    }).get({
      success(res){
        that.data.information = res.data[0].information
        that.setData({
          information: res.data[0].information
        })
      }
    })
    //互动信息
    this.getActionsList()
  },

  onPullDownRefresh(){
    this.getActionsList()
  }
})