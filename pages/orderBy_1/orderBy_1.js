const app = getApp()
Page({
  data: {
    member: [],
    member_length: 0
  },


  onLoad(options) {
    const that = this
    var j = 0
    var mem = []
    wx.cloud.database().collection('cycles_total')
    .orderBy('number','desc')
    .orderBy('date','asc')
    .get()
      .then(res=>{
        console.log('降序成功',res.data)
        for(var i=0 ; i<res.data.length ; i++){
          console.log(i,res.data[i].cardid,options.id)
          if(res.data[i].cardid == options.id){
            mem[j] = res.data[i]
            j++
          }
        }
        that.setData({
          member: mem,
          member_length: mem.length
        })
        console.log('数据获取完成',that.data.member)
      })
      .catch(err=>{
        console.log('降序失败',err)
      })
  },

})