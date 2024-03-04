const app = getApp()
var util = require('../../utils/util')
Page({
  data: {
    now: ''
  },

  aa :function (){
    wxacode.getUnlimited({  //生成二维码二进制图片
      "page": 'pages/detail/detail',
      "scene": "id='5f964e6c64760b2a00001a0109329715'&u=0",
      "check_path": false,
      "envVersion": 'trial',
      success(res){
        console.log(res)
      }
      
    })
  },

  onLoad(options) {
    this.data.now = util.formatTime(new Date())
    console.log(this.data.now)
  },

})