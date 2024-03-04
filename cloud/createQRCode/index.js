const cloud = require('wx-server-sdk')
cloud.init({ env: 'clock-4g6f5ppv9c26dde8' }) // 使用当前云环境

exports.main = async (event, context) => {
  try {
    const wxacodeResult = await cloud.openapi.wxacode.getUnlimited({
        "page": 'pages/detail/detail',
        "scene": id=event.cardid,
        "checkPath": false,
        "envVersion": 'trial'
      })
    
      const uploadResult = await cloud.uploadFile({  //上传至云存储
        cloudPath: 'once_code/' + event.cardid + '.jpg',  //上传至云存储的哪
        fileContent: wxacodeResult.buffer,
        success(res){
          console.log('上传至云函数',res)
        }
      });
      return uploadResult
      
  } catch (err) {
    return err
  }
}