const RES_CONFIG = require('../config/res_config');
var Response = require('../utils/Response');
var smsUtils = require('../utils/smsUtils');
var uuidUtils = require('../utils/uuidUtils');
var SmsMessageDao = require('../dao/smsMessageDao');
var CustomerDao = require('../dao/customerDao');
var smsMessageDao = new SmsMessageDao();
var customerDao = new CustomerDao();
//短信接入验证
smsAuth = function(req, res) {
	//	console.log("sms auth success")
	res.status(200).send('ok');
};
/**
 *向短信平台 发送手机号 平台向用户手机发送验证码
 */
async function sendMsgToPlatform(req, res) {
	var mobile = req.body.mobile;
	if(!!mobile) {
		//根据手机号查看用户是否已注册
		var customer = await customerDao.getCustomerByMobile(mobile);
		if(!!customer) {
			return res.json(new Response(RES_CONFIG.fail, "", "hasRegisted"));
		}

		var dataStr = await smsUtils.getSmsPlatformResponseData(mobile);
		//		console.log(dataStr)
		if(!!dataStr) {
			console.log(dataStr)
			var data = JSON.parse(dataStr);
//			var data = {
//				code:200,
//				obj:"1234",
//				msg:'1111'		
//			}
			var codeStatus = data.code;
			var status = RES_CONFIG.fail;
			var remark = ''
			switch(codeStatus) {
				case 200:
					var uuid = uuidUtils.generateUUID();
					var sendMsg = {
						id: uuid,
						sendid: data.msg, //短信id
						telephone: mobile,
						code: data.obj, //平台向用户手机发送的验证码
						verifyTime: Math.floor((new Date()).getTime() / 1000)
					};

					//记录手机和验证码 
					var result = await smsMessageDao.save(sendMsg);
					if(!!result) {
						status = RES_CONFIG.success
					} else {
						remark = "insertError"
					}
					break;
				case 416:
					remark = 'mobileLimit'
					break;
				case 500:
					remark = 'sendError'
					break;
				default:
					remark = 'error'
			}
			return res.json(new Response(status, "", remark));
		}
		return res.json(new Response(RES_CONFIG.fail, "", "sendError"));
	}
	return res.json(new Response(RES_CONFIG.fail, "", "mobileError"));
}
/**
 * 校验验证码并注册用户
 */
async function checkCodeAndRegister(req, res) {
	var telephone = req.body.telephone; //與數據庫一致
	var verifyCode = req.body.verifyCode;

	var wxOpenId = req.body.wxOpenId;

	if(!wxOpenId || !telephone || !verifyCode) {
		return res.json(new Response(RES_CONFIG.fail, "", "paramsNotComplete"));
	}

	if(!!telephone && !!verifyCode) {
		//判断是否已经点击发送验证码
		var result1 = await smsMessageDao.getByMobile(telephone);
		console.log(result1)
		if(!result1){
			return res.json(new Response(RES_CONFIG.fail, "", "codeNotSend"));
		}
		
		//10分钟内的发送记录
		var result = await smsMessageDao.getMessageByMobile(telephone);
		if(!!result) {
			var code = result[0].code;
			if(verifyCode == code) {
				var customer = {
					id: uuidUtils.generateUUID(),
					telephone: telephone,
					wxOpenId: wxOpenId
				};
				var result = customerDao.register(customer);
				if(!!result) {
					return res.json(new Response(RES_CONFIG.success, "", "registerSuccess"));
				}
				return res.json(new Response(RES_CONFIG.fail, "", "500"));
			}
			return res.json(new Response(RES_CONFIG.fail, "", "codeError"));

		}
		return res.json(new Response(RES_CONFIG.fail, "", "overtime"));
	}
}

module.exports = {
	smsAuth: smsAuth,
	sendMsgToPlatform: sendMsgToPlatform,
	checkCodeAndRegister: checkCodeAndRegister

}