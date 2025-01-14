// 云函数入口文件
const cloud = require('wx-server-sdk');
const basicId = require('./basicID/basic.js');
const predict=require('./score_predict/predict.js');
// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.type) {
      case 'basicId':
        return await basicId.main(event, context);
        break;
      case 'is_Find':
        return await basicId.main(event,context);
        break;
      case 'send_distance':
        return await basicId.main(event,context);
        break;
      case'get_runRecord':
        return await basicId.main(event,context);
        break; 
      case'predict':
        return await predict.main(event,context);
        break;
    }
}