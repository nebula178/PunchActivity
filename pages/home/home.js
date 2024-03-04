const app = getApp()
var util = require('../../utils/util')
Page({
  goToonce:function(){
    wx.navigateTo({
      url: '/pages/once/once',
    })
  },
  goTocycles:function(){
    wx.navigateTo({
      url: '/pages/cycles/cycles',
    })
  },
  goTojoint:function(){
    if(app.globalData.userInfo == null){
      
      wx.showToast({
        title: '请授权登录！',
        icon: 'none',
        duration: 1500,
       })
    }
    else{
      wx.navigateTo({
      url: '/pages/joint/joint',
    })
    }
  },
  goTocontrol:function(){
    if(app.globalData.userInfo == null){
      
      wx.showToast({
        title: '请授权登录！',
        icon: 'none',
        duration: 1500,
       })
    }
    else{
      wx.navigateTo({
        url: '/pages/control/control',
      })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(util.formatDate(new Date()))
  },
})