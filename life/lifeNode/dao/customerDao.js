var knex = require('../config/knex');
var CustomerDao = function() {}

CustomerDao.prototype.register = async function(customer) {
	try {
		var result = await knex("wx_customer").insert(customer);
		if(result.length > 0) {
			return result;
		}
	} catch(err) {
		return false;
	}
	return false;
}

CustomerDao.prototype.addCustomerInfo = async function(customer) {
	try {
		var result = await knex('wx_customer')
			.where('wxOpenId', '=', customer.wxOpenId)
			.update({
				name: customer.name,
				sex: customer.sex,
				birthday: customer.birthday,
				cardNumber: customer.cardNumber
			})
		return result;
	}catch(err) {
		return false;
	}
}
/**
 * 判断手机号是否已经验证过
 */
CustomerDao.prototype.getCustomerByMobile = async function(mobile) {
	try {
		var result = await knex("wx_customer").where('telephone', '=', mobile).select('*');
		if(result.length > 0) {
			return result[0];
		}
	} catch(err) {
		return false;
	}
	return false;

}
/**
 * 判断微信账号是否已经注册过
 */
CustomerDao.prototype.getCustomerByWxOpenId = async function(wxOpenId) {
	try {
		var result = await knex("wx_customer").where('wxOpenId', '=', wxOpenId).select('*');
		if(result.length > 0) {
			return result[0];
		}
	} catch(err) {
		return false;
	}
	return false;
}

module.exports = CustomerDao;