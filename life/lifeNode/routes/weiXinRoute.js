var crypto = require('crypto');
var URLEncoder = require('urlencode');
var url = require('url');
var https = require('https');
var http = require('http');
var Response = require('../utils/Response');
var RES_CONFIG = require('../config/res_config');
var wx_config = require('../config/wx_config');
var AppointmentDao = require('../dao/appointmentDao');
var multiparty = require('multiparty');
var uuidUtils = require('../utils/uuidUtils');
var CustomerDao = require('../dao/customerDao');
var appointmentDao = new AppointmentDao();
var customerDao = new CustomerDao();
var httpsUtils = require("../utils/httpUtils");
const querystring = require("querystring");
var xml2js = require('xml2js');
var domainUtils = require('../config/domain');

function check(timestamp, nonce, signature, token) {
	var currSign, tmp;
	tmp = [token, timestamp, nonce].sort().join("");
	currSign = crypto.createHash("sha1").update(tmp).digest("hex");
	return(currSign === signature);
};

//公众号接入验证
auth = function(req, res) {
	var query = url.parse(req.url, true).query;
	var signature = query.signature;
	var timestamp = query.timestamp;
	var nonce = query.nonce;
	var echostr = query.echostr;
	console.log("auth:" + check(timestamp, nonce, signature, wx_config.token))
	/**token  */
	if(check(timestamp, nonce, signature, wx_config.token)) {
		res.end(echostr);
	} else {
		res.end("It is not from weixin");
	}
};

function getWxOpenIdFromWeiXin(url) {
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
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
		})
	})
}



async function redirectToArtMuseumCenter(req, res) {
	var code = req.query.code;
	var APPID = wx_config.appID;
	var SECRET = wx_config.appScrect;
	var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + APPID + "&secret=" + SECRET + "&code=" + code + "&grant_type=authorization_code";

	var data =''
	var url1 = domainUtils.domain + "/wyArtCenter";
	var url2 = domainUtils.domain + "/wyRegister";
	
	if(!!code) {
		var dataStr = await getWxOpenIdFromWeiXin(url)
		var wxOpenId = JSON.parse(dataStr).openid;
		//		console.log(dataStr)
		console.log(wxOpenId)
		//重定向到vue 頁面
		if(!!wxOpenId) {
			
			var customer = await customerDao.getCustomerByWxOpenId(wxOpenId);
			if(!!customer){
				res.redirect(url1+"?data="+wxOpenId);
				
			}else{
				res.redirect(url2+"?wxOpenId="+wxOpenId+"&retName=0");
			}

		} else {
			data = "getOpenidError"
			res.redirect(url1+"?data="+data);
		}

	} else {
		data = "weixinauthError"
		res.redirect(url1+"?data="+data);
	}
}
async function redirectToCellStorageCenter(req, res) {
	var code = req.query.code;
	var APPID = wx_config.appID;
	var SECRET = wx_config.appScrect;
	var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + APPID + "&secret=" + SECRET + "&code=" + code + "&grant_type=authorization_code";

	var data =''
	var url1 = domainUtils.domain + "/wyCellCenter";
	var url2 = domainUtils.domain + "/wyRegister";
	
	if(!!code) {
		var dataStr = await getWxOpenIdFromWeiXin(url)
		var wxOpenId = JSON.parse(dataStr).openid;
		//		console.log(dataStr)
		console.log(wxOpenId)
		//重定向到vue 頁面
		if(!!wxOpenId) {
			
			var customer = await customerDao.getCustomerByWxOpenId(wxOpenId);
			if(!!customer){
				res.redirect(url1+"?data="+wxOpenId);
				
			}else{
				res.redirect(url2+"?wxOpenId="+wxOpenId+"&retName=1");
			}

		} else {
			data = "getOpenidError"
			res.redirect(url1+"?data="+data);
		}

	} else {
		data = "weixinauthError"
		res.redirect(url1+"?data="+data);
	}
	
}

//微信支付回调
async function payNotify(req, res) {

	console.log("notify received")
	var parser = new xml2js.Parser();

	parser.parseString(req.body, async (err, result) => {
		var data = result.xml;
		console.log(data);
		if(data.result_code[0] == "SUCCESS") {
			//通知微信
			var xml = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
			res.send(xml);
			//订单去重
			if(orderArray[data.out_trade_no[0]]) {
				console.log("paid tradeNo:"+data.out_trade_no[0])
				var result = await appointmentDao.updateChargeStatus(data.out_trade_no[0], 1);
				console.log("result"+result)
				delete orderArray[data.out_trade_no[0]];
			}
		}
	});

}

var orderArray = {};
var key = ''; //支付key
async function preOrder(req, res) {
	var real_ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;
	var openid = req.body.wxOpenId;
	var appoint_id = req.body.appointId;
	var total_fee = req.body.fee;
	
	//更新appoint tradeNo
	var tradeNo = Date.now();
	console.log("tradeNo:"+tradeNo)
	orderArray[tradeNo] = true; //记录订单状态
	var chargeStatus = "0"; //0 未支付 1已支付 
	
	appointmentDao.update(appoint_id, tradeNo, chargeStatus);

	var data = [{
			key: 'appid',
			value: "wx5753bd84103aaada"
		},
		{
			key: "attach",
			value: "wuyan"
		},
		{
			key: 'body',
			value: "pay"
		},
		{
			key: 'mch_id',
			value: "1513098661"
		},
		{
			key: 'nonce_str',
			value: getNonceStr()
		},
		{
			key: 'notify_url',
			value: "http://yuyue.wuyanbio.com/api/wxpay"
		},
		{
			key: "openid",
			value: openid
		},
		{
			key: 'out_trade_no',
			value: tradeNo
		},
		{
			key: 'spbill_create_ip',
			value: real_ip
		},
		{
			key: 'total_fee',
//			value: total_fee * 100
			value:10
		},
		{
			key: 'trade_type',
			value: "JSAPI"
		}
	]

	var firstData = data[0];
	var string = firstData.key + "=" + firstData.value;

	var sendData = {};
	sendData[data[0].key] = data[0].value;

	for(let i = 1; i < data.length; i++) {
		sendData[data[i].key] = data[i].value;
		string += ("&" + data[i].key + "=" + data[i].value);
	}

	string += ("&key=" + key);
	console.log(string)

	var md5 = crypto.createHash('md5');
	md5.update(string, 'utf8');
	var sign = md5.digest('hex').toUpperCase();

	string += ("&sign=" + sign);
	sendData["sign"] = sign;

	var builder = new xml2js.Builder();
	var xml = builder.buildObject(sendData);
	console.log("xml" + xml)
	var parser = new xml2js.Parser();

	const options = {
		hostname: 'api.mch.weixin.qq.com',
		// port: 443,
		path: '/pay/unifiedorder',
		method: 'POST'
	};

	var data = await httpsUtils.post(options, xml);
	parser.parseString(data, (err, result) => {
		if(result.xml) {
			var ret = result.xml;
			if(ret.return_code[0] == "SUCCESS" && ret.return_msg[0] == "OK") {
				var prepay_id = ret.prepay_id[0];
				var retData = {
					"appId": ret.appid[0], //公众号名称，由商户传入     
					"nonceStr": getNonceStr(), //随机串 
					"package": "prepay_id=" + ret.prepay_id[0],
					"signType": "MD5", //微信签名方式
					"timeStamp": ((Date.now() / 1000) | 0) + "" //时间戳，自1970年以来的秒数
				};
				var string = "appId=" + retData.appId + "&nonceStr=" + retData.nonceStr +
					"&package=" + retData.package + "&signType=" + retData.signType +
					"&timeStamp=" + retData.timeStamp + "&key=" + key;

				var md5 = crypto.createHash('md5');
				md5.update(string, 'utf8');
				var sign = md5.digest('hex').toUpperCase();

				retData["paySign"] = sign;
				return res.json(new Response(RES_CONFIG.success, retData, ""));
			} else {
				return res.json(new Response(RES_CONFIG.fail, "", ""));
			}
		}
	});
}

var getNonceStr = function() {
	var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	var str = '';
	for(var i = 0; i < 32; i++) {
		[0 - 31]
		Math.floor(Math.random() * chars.length)
		str += chars[(Math.random() * chars.length) | 0];
	}
	return str;
}


async function test1(req, res) {
	//	var ip = ipUtils.getClientIp(req, "nginx"); 127.0.0.1
	var real_ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;
	console.log(req.get("X-Forwarded-For"))
	console.log(req.ip)
	res.end("test1 received")
	res.end(real_ip)

}

async function test2(req, res) {
	var url = "http://wuhzn2.natappfree.cc/api/redirectToArtMuseumCenter";
	var url1 = URLEncoder.encode(url, "utf-8");
	console.log(url1)
}

module.exports = {
	auth: auth,
	test2: test2,
	test1: test1,
	redirectToArtMuseumCenter: redirectToArtMuseumCenter,
	redirectToCellStorageCenter: redirectToCellStorageCenter,
	//	getWxOpenId: getWxOpenId,
	preOrder: preOrder,
	payNotify: payNotify
}