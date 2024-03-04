// pages/lol/lol.js
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
 
  },

  site: function () {
    var that = this;
    var lat1,lng1,lat2,lng2
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        lat1 = res.latitude,
        lng1 = res.longitude
      }
    })

    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        lat2 = res.latitude;
        lng2 = res.longitude;
        // 计算两地之间的距离
        console.log(lat1, lng1, lat2, lng2)
        var radLat1 = lat1 * Math.PI / 180.0;
        var radLat2 = lat2 * Math.PI / 180.0;
        var a = radLat1 - radLat2;
        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;
        s = Math.round(s * 10000) / 10000;
        if (Number(s)>0.5){
          wx.showModal({
            title: '温馨提示',
            content: '位置不能离你大于500米',
            success: function (res) {
              console.log('res')
              if (res.confirm) {
                  that.site()
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });
        }else{
          console.log('ok')
        }
        console.log('两点之间距离多少km：',s);
      }
    })
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
 
 
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