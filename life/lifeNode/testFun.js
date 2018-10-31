var knex = require('./config/knex');
moment = require('moment');
var weiXinRoute = require('./routes/weiXinRoute');
var uuidUtils = require('./utils/uuidUtils');
var AppointmentDao = require('./dao/appointmentDao');
var SmsMessageDao = require('./dao/smsMessageDao');
var appointmentDao = new AppointmentDao();
var smsMessageDao = new SmsMessageDao();
var CustomerDao = require('./dao/customerDao');
var customerDao = new CustomerDao();
var smsUtils = require('./utils/smsUtils')
var SMS_CONFIG = require('./config/wangyiyun_sms');
var crypto = require('crypto');
var URLEncoder = require('urlencode');
//生成随机字符串 
const createNonceStr = function() {
	//	return Math.random().toString(36).substr(2, 15);
	return(new Date()) - 0 + Math.floor(Math.random() * 100);
}

const createTimestamp = function() {
	return parseInt(new Date().getTime() / 1000) + "";
};

const getCheckSum = (appSecret, nonce, timestamp) => {
	const str = appSecret + nonce + timestamp;
	var checkSum = crypto.createHash('sha1').update(str).digest('hex');
	return checkSum;
}
async function updateTest() {
	//	var result = await appointmentDao.findListByWxOpenIdAndType('12', 1);
	//	var result = await appointmentDao.update('35876dd0a6a611e8aef1516fe20386d1','2','2');
	/*var result =await knex('wy_appointment').where('id', '=', "35876dd0a6a611e8aef1516fe20386d1").update({
				tradeNo: "1",
				chargeStatus: "1"
			});*/
	//	var result = await appointmentDao.updateChargeStatus('2',"3");
	var customer = {
		name: 'z',
		sex: '1',
		birthday: '2019-09-09',
		cardNumber: '1111',
		wxOpenId: '14'
	}

//	var result = await customerDao.addCustomerInfo(customer);
	var id ='7ebd54d0db1a11e8b3dcd1757f6466ba';
	var tradeNo = '1'
	var chargeStatus = '0'
	var result = await appointmentDao.update(id, tradeNo, chargeStatus);
	console.log(result)

	
}
//test();
updateTest();
// testArguments(12,null,2);