var CustomerDao = require('../dao/customerDao');
var Response = require('../utils/Response');
var RES_CONFIG = require('../config/res_config');
var customerDao = new CustomerDao();

async function addCustomerInfo(req, res) {
	var name = req.body.name;
	var sex = req.body.sex;
	var birthday = req.body.birthday;
	var cardNumber = req.body.cardNumber;
	var wxOpenId = req.body.wxOpenId;

	if(!name || !sex || !birthday || !cardNumber || !wxOpenId) {
		return res.json(new Response(RES_CONFIG.fail, "", "paramsNotComplete"));
	}

	var customer = {
		name: name,
		sex: sex,
		birthday: birthday,
		cardNumber: cardNumber,
		wxOpenId: wxOpenId
	};

	var result = await customerDao.addCustomerInfo(customer);
	if(!!result) {
		return res.json(new Response(RES_CONFIG.success, "", ""));
	} else {
		return res.json(new Response(RES_CONFIG.fail, "", "500"))
	}

}
module.exports = {
	addCustomerInfo: addCustomerInfo
}