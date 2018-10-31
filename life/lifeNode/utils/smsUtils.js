var sha1 = require('sha1');
var crypto = require('crypto');
var SMS_CONFIG = require('../config/wangyiyun_sms');
var https = require('https');
var qs = require('querystring');
/**
 * 生成验证码：数字与字母
 */
function getVerifyCode() {
	//	var vcode = Math.floor(Math.random() * 99999999 + 11111111).toString(16).substr(0, 6);
	var vcode = (new Date() - 0).toString().substr(0, 4)
	return vcode;
}

function mathRand() {
	var num = "";
	for(var i = 0; i < 6; i++) {
		num += Math.floor(Math.random() * 10);
	}
	return num
}
//生成随机字符串 
const createNonceStr = function() {
	return(new Date()) - 0 + Math.floor(Math.random() * 100);
};

const createTimestamp = function() {
	return parseInt(new Date().getTime() / 1000) + "";
};

const getCheckSum = (appSecret, nonce, timestamp) => {
	const str = appSecret + nonce + timestamp;
	var checkSum = crypto.createHash('sha1').update(str).digest('hex');
	return checkSum;
}

function getSmsPlatformResponseData(mobile) {
	const appSecret = SMS_CONFIG.APP_SECRET;
	const Nonce = createNonceStr();
	const CurTime = createTimestamp();
	const CheckSum = getCheckSum(appSecret, Nonce, CurTime);

	var post_data = {
		//templateid:SMS_CONFIG.TEMPLATEID,  
		mobile: mobile,
		//由短信平台生成验证码
		codeLen: SMS_CONFIG.CODELEN
//		authCode:mathRand()
	}
	var content = qs.stringify(post_data);

	var options = {
		//hostname: "https://api.netease.im",
		hostname: 'api.netease.im',
		//port:'443',  
		path: '/sms/sendcode.action',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			'AppKey': SMS_CONFIG.APP_KEY,
			'Nonce': Nonce,
			'CurTime': CurTime,
			'CheckSum': CheckSum
		}
	};
	return new Promise((resolve, reject) => {
		var req = https.request(options, (res) => {
			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => {
				rawData += chunk;
			});
			res.on('end', () => {
				resolve(rawData);
			});
			res.on('error', () => {
				reject(error)
			});
		});
		req.on('error', function(e) {
			console.log(e.message);
		});
		req.write(content);
		req.end();
	});
}
module.exports = {
	getVerifyCode: getVerifyCode,
	getSmsPlatformResponseData: getSmsPlatformResponseData
}