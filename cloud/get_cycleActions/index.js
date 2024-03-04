// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: 'clock-4g6f5ppv9c26dde8' }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
//查询
exports.main = async (event, context) => {
  try {
    //order
    return await db.collection('cycles_actions').where({
      cardid: event.cardid
    }).get({
      success: function (res) {
       return res;
      }
    });
  } catch (e) {
    console.error(e);
  }
}
