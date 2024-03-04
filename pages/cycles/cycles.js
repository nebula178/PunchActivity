const app = getApp()
var util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkMaxDate: '',
    startDateIndex: '',
    checkMinDate: '',
    endDateIndex: '',

    checkMaxTime: '',
    startTimeIndex: '',
    checkMinTime: '',
    endTimeIndex: '',

    week: [{
      title: '星期日',
      selected: false,
    },{
      title: '星期一',
      selected: false,
    },{
      title: '星期二',
      selected: false,
    },{
      title: '星期三',
      selected: false,
    },{
      title: '星期四',
      selected: false,
    },{
      title: '星期五',
      selected: false,
    },{
      title: '星期六',
      selected: false,
    },],

    checkMaxDayTime: '',
    dayStartTime: '00:00',
    checkMinDayTime: '',
    dayEndTime: '23:59',

    isChecked: false,
    isinput: false,
    latitude: 0, //首次加载维度
    longitude: 0, //首次加载的经度
    mapName: "", //选点的位置
    cope: '',
    dataId: '',
  },
  // 在开始时间 picker 组件的 bindchange 事件回调函数中更新开始时间的值，并根据当前选择的日期设置结束日期的最小可选日期
  bindCheckinDateChange: function (e) {
    const checkinDate = e.detail.value;
    const now_date = util.formatDate(new Date())  //获取当前时间
    if (checkinDate < now_date) {  //开始日期比当前日期小
      this.setData({
        checkMinDate: now_date  //结束日期的最小值
      });
    }
    else{
      this.setData({
        checkMinDate: checkinDate  //结束日期的最小值
      });
    }
    this.setData({
      startDateIndex: checkinDate
    });
    if(this.data.startDateIndex == this.data.endDateIndex){ //开始日期与结束日期相等
      if(this.data.startTimeIndex > this.data.endTimeIndex){  //开始时间大于结束时间
        const end = this.data.endTimeIndex
        this.setData({
          startTimeIndex: end
        });
      }
    }
    else{  //开始日期与结束日期不等
      this.setData({
        checkMaxTime: '',
        checkMinTime: '',
      });
    }
  },
  
  bindCheckinTimeChange: function (e) {
      const checkinTime = e.detail.value;
      const now_time = util.formatTimer(new Date())  //获取当前时间
      if(this.data.startDateIndex == this.data.endDateIndex){  //若开始日期与结束日期相等
        console.log('开始日期与结束日期相等')
        if (checkinTime < now_time) {  //开始时间比当前时间小
          console.log('结束时间的最小值为当前时间')
          this.setData({
            checkMinTime: now_time  //结束时间的最小值为当前时间
          });
        }
        else{
          console.log('结束时间的最小值为开始时间')
          this.setData({
            checkMinTime: checkinTime  //结束时间的最小值为开始时间
          });
        }
      }
      else{//开始日期与结束日期不相等
        console.log('开始日期与结束日期不相等')
        this.setData({
          checkMinTime: ''  //结束时间的最小值为00：00
        });
      }
      this.setData({
        startTimeIndex: checkinTime,
      });
  },
  
  // 在结束时间 picker 组件的 bindchange 事件回调函数中更新结束日期的值，并根据当前选择的日期设置开始日期的最大可选日期
  bindCheckoutDateChange: function (e) {
    const checkoutDate = e.detail.value;
    const now_date = util.formatDate(new Date())  //获取当前时间
    const now_time = util.formatTimer(new Date())  //获取当前时间
    this.setData({
      endDateIndex: checkoutDate,
      checkMaxDate: checkoutDate
    });
    if(this.data.startDateIndex == this.data.endDateIndex){ //开始日期与结束日期相等
      if(this.data.startTimeIndex > this.data.endTimeIndex){  //开始时间大于结束时间
        const end = this.data.startTimeIndex
        this.setData({
          endTimeIndex: end
        });
      }
    }
    else{  //开始日期与结束日期不等
      this.setData({
        checkMaxTime: '',
        checkMinTime: '',
      });
    }
    if(this.data.endDateIndex == now_date){
      if(this.data.endTimeIndex < now_time){
        this.setData({
          endTimeIndex: now_time
        });
      }
    }
  },
  
  bindCheckoutTimeChange: function (e) {
    const checkoutTime = e.detail.value;
    const now_date = util.formatDate(new Date())  //获取当前时间
    const now_time = util.formatTimer(new Date())  //获取当前时间
    if(this.data.startDateIndex == this.data.endDateIndex){ 
      this.setData({
        checkMaxTime: checkoutTime  //开始时间的最大值
      });
    }
    else{
      this.setData({
        checkMaxTime: ''  //开始时间的最大值
      });
    }
    if(now_date == this.data.endDateIndex){
      this.setData({
        checkMinTime: now_time  //结束时间的最小值
      });
    }
    this.setData({
      endTimeIndex: checkoutTime,
    });
  //  console.log(this.data.checkMaxTime)
  },

  //单个打卡日开始时间
  bindCheckinDayTimeChange: function (e) {
    const checkinTime = e.detail.value;
    const now_date = util.formatDate(new Date())  //获取当前时间
    const now_time = util.formatTimer(new Date())  //获取当前时间
    if(this.data.endDateIndex == now_date){
      const end = this.data.endTimeIndex
      this.setData({
        checkMinDayTime: end
      })
    }
    else{
      checkMinDayTime: checkinTime
    }
    this.setData({
      dayStartTime: checkinTime,
    })
  },

  //打卡频率
  weekboxChange: function (e){
    //  console.log(e.currentTarget.dataset.index)
      let string = "week[" + e.currentTarget.dataset.index + "].selected"
    //  console.log(this.data.week[e.target.dataset.index].selected)
      this.setData({
        [string]: !this.data.week[e.target.dataset.index].selected
      })
    //  console.log(this.data.week[e.target.dataset.index].selected)
    },

  //单个打卡日结束时间
  bindCheckoutDayTimeChange: function (e) {
    const checkoutTime = e.detail.value;
    const now_date = util.formatDate(new Date())  //获取当前时间
    const now_time = util.formatTimer(new Date())  //获取当前时间
    this.setData({
      dayEndTime: checkoutTime,
      checkMaxDayTime: checkoutTime
    })
  },

    //定位开关
  changeSwitch: function (e){
    const orchecked = e.detail.value;
    this.setData({
      isChecked: orchecked
    });
  },
  //地图
  moveToLocation() {
    const that = this;//防止this指向问题
    wx.chooseLocation({
        success: function (res) {
            console.log(res.name);
            //赋值给data中的mapName
            that.setData({
                mapName: res.name,
                latitude: res.latitude, 
                longitude: res.longitude, 
            })
        },
        //错误信息
        fail: function () {
            console.log(err);
        }
    })
  },

    //登录
  login() {
    if(app.globalData.userInfo == null){
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
    }
  },

  //生成二维码
  getQrCode: function(){
    const that = this
    wx.cloud.callFunction({
      name: 'createQRCode_1',
      data: {
        cardid: that.data.dataId,
      },
      success(result){
        console.log('生成二维码',result.result.fileID)
        wx.cloud.database().collection('control_cycles').where({
          _id: that.data.dataId,
        }).update({
          data: {
            QRcode: result.result.fileID,
          },
          success(res){
            wx.showToast({
              title: '创建成功',
              duration: 1500,
            })
            wx.redirectTo({
              url: '/pages/detail_1/detail_1?id=' + that.data.dataId,
            })
          }
        })
      }
    })
  },

  addTotal: function(){
    const that = this
    wx.cloud.database().collection('cycles_total').add({
      data: {
        cardid: that.data.dataId,
        date: '',
        number: 0,
        nickName: app.globalData.userInfo.nickName,
        faceImg: app.globalData.userInfo.avatarUrl
      }
    })
  },

    //提交表单
  once_form: function (res){
  //  console.log('once.js',res)
    const endDate = res.detail.value.endDate;
    const endTime = res.detail.value.endTime;
    const information = res.detail.value.information;
    const site = res.detail.value.site;
    const startDate = res.detail.value.startDate;
    const startTime = res.detail.value.startTime;
    const start = res.detail.value.start;
    const end = res.detail.value.end;
    const title = res.detail.value.title;
    var siteName,scope,lati,longi;
    const that = this
    if(app.globalData.userInfo == null){  //未登录跳出
      wx.showToast({
        title: '请登录后再创建活动',
        icon: 'none',
        duration: 1500,
       })
       return;
    }
    wx.cloud.database().collection('control_cycles').where({  //查找我创建了多少条
      _openid: app.globalData.openid
    }).get({
      success(r){
      //  console.log(r.data.length)
        if(r.data.length == 20){ //创建了20条，不能创建新的了
          wx.showToast({  //弹窗提示'最多创建20个单次打卡活动'
            title: '最多创建20个单次打卡活动',
            icon: 'none',
            duration: 1500,
           })
           return;
        }
        else{  //开始判断信息是否符合创建要求
          if(site == true){  //位置信息赋值
            siteName = res.detail.value.siteName;
            scope = res.detail.value.scope;
            lati = that.data.latitude;
            longi = that.data.longitude;
          }
          else{
            scope = 0;
            siteName = '';
            lati = 0;
            longi = 0;
          }
          if(title == ''){  //题目不为空
            wx.showToast({
              title: '题目不能为空',
              icon: 'none',
              duration: 1500,
             })
             return;
          }
          if(endDate == util.formatDate(new Date())){  //打卡结束时间不能小于当前时间
            if(endTime < util.formatTimer(new Date())){
              wx.showToast({
                title: '打卡结束时间不能小于当前时间',
                icon: 'none',
                duration: 1500,
               })
               return;
            }
          }
          var u = false;
          for(var i=0 ; i<7 ; i++){
            if(that.data.week[i].selected == true){
              u = true;
            }
          }
          if(u == false){
            wx.showToast({
              title: '打卡频率不能为空',
              icon: 'none',
              duration: 1500,
             })
             return;
          }
          if(site == true){  //定位开启信息判断
            if(siteName == ''){  //打卡地点不为空
              wx.showToast({
                title: '打卡地点不能为空',
                icon: 'none',
                duration: 1500,
               })
               return;
            }
            if(scope == ''){  //范围不为空
              wx.showToast({
                title: '打卡范围不能为空',
                icon: 'none',
                duration: 1500,
               })
               return;
            }
            var rex = /^[0-9]+$/; //正则表达式
            var flg =  rex.test(scope);  // 用正则卡 拿到的数值的类型
            if(flg == false){  //所输入的范围是否为数字类型
              wx.showToast({
                title: '打卡范围不能为字母类型',
                icon: 'none',
                duration: 1500,
               })
               return;
            }
          }
          if(information == ''){  //打卡信息不为空
            wx.showToast({
              title: '打卡信息不能为空',
              icon: 'none',
              duration: 1500,
             })
             return;
          } 
          lati = Number(that.data.latitude),
          longi = Number(that.data.longitude)
        
          wx.cloud.database().collection('control_cycles').add({  //单次打卡信息生成到数据库
            data: {
              name : title,
              startDate : startDate,
              startTime : startTime,
              endDate : endDate,
              endTime : endTime,
              site : site,
              siteName : siteName,
              scope : scope,
              lati : lati,
              longi : longi,
              information : information,
              face : app.globalData.userInfo.avatarUrl,
              week0 : that.data.week[0].selected,
              week1 : that.data.week[1].selected,
              week2 : that.data.week[2].selected,
              week3 : that.data.week[3].selected,
              week4 : that.data.week[4].selected,
              week5 : that.data.week[5].selected,
              week6 : that.data.week[6].selected,
              start : start,
              end : end,
              QRcode : ''
            },
            success(res){  //跳转传参赋值
              that.setData({
                dataId: res._id
              });
              that.addTotal()
              that.getQrCode()
              wx.showToast({
                title: '活动创建中', //提示的内容
                duration: 3000, //持续的时间
                icon: 'loading', //图标有success、error、loading、none四种
                mask: true //显示透明蒙层 防止触摸穿透
             })
           
            }
          })
        }
      }
    })
    

  },

  onLoad(options) {
    const today = util.formatDate(new Date());
    const time = util.formatTimer(new Date());
    this.setData({
      checkMaxDate: today,
      startDateIndex: today,
      checkMinDate: today,
      endDateIndex: today,
  
      checkMaxTime: time,  //开始时间的
      startTimeIndex: time,
      checkMinTime: time,
      endTimeIndex: time,  //结束时间的

      checkMinDayTime: time,
    });
  },

})