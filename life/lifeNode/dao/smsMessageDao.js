var knex = require('../config/knex');
var SmsMessageDao = function() {

}
/**
 * 
 * @param {*} message 发送成功，添加短信记录 
 */
SmsMessageDao.prototype.save = async function(message) {

	try {
		let result = await knex('wx_message').insert(message); //array [0]
		return result;
	} catch(err) {
		return false;
	}
}
/**
 * 根据手机号查询短信 验证时间小于10分鐘的 //todo
 * @param {*} mobile 
 */
SmsMessageDao.prototype.getMessageByMobile = async function(mobile) {

	var startTime = Math.floor((new Date()).getTime() / 1000) - 10*60;
	try {
		var result = await knex('wx_message').where('verifyTime', '>', startTime).andWhere({"telephone":mobile}).orderBy('verifyTime','desc').limit(1).offset(0).select('*');
		if(result.length > 0) {
			return result;
		}else{
			return false;
		}
	} catch(err) {
		return false;
	}
	
}

SmsMessageDao.prototype.deleteMessageByMobile = async function(mobile) {
	try {
		let result = await knex('wx_message').where({
			telephone: mobile
		}).del(); //删除的记录个数
		if(result > 0) {
			return result;
		}
	} catch(err) {
		return false;
	}
	return false;
}


SmsMessageDao.prototype.getByMobile = async function(mobile){
	try {
		var result = await knex('wx_message').where({"telephone":mobile}).select('*');
		if(result.length > 0) {
			return result;
		}else{
			return false;
		}
	} catch(err) {
		return false;
	}
}
module.exports = SmsMessageDao