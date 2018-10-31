var knex = require('../config/knex');
var connection = require('../config/mysql');

var AppointmentDao = function() {}

AppointmentDao.prototype.getAppointmentById = async function(id) {
	try {
		//		var result = await knex('wy_appointment').where("id","=",id).select('*');
		var result = await knex.select('*').from('wx_customer as c ').innerJoin('wy_appointment as a ', 'c.id', 'a.customerId').where({
			"a.id": id
		});
		if(result.length > 0) {
			return result[0];
		}
	} catch(err) {
		return false;
	}
	return false;
}

AppointmentDao.prototype.findListByWxOpenIdAndType = async function(wxOpenId, type) {
	try {
		var result = await knex.select('*').from('wx_customer as c ').leftJoin('wy_appointment as a ', 'c.id', 'a.customerId').where({
			"c.wxOpenId": wxOpenId,
			"a.type": type,
			"a.chargeStatus":1 //已支付
		});
		if(result.length > 0) {
			return result;
		}
	} catch(err) {
		return "err";
	}
	return "noAppoint";
}

AppointmentDao.prototype.save = async function(appointment) {
	try {
		var result = await knex('wy_appointment').insert(appointment); //array [0]
		return result;
	} catch(err) {
		return false;
	}
	return false;
}

AppointmentDao.prototype.deleteById = async function(id) {
	try {
		var result = await knex('wy_appointment').where({
			id: id
		}).del();
		if(result > 0) {
			return result;
		}
	} catch(err) {
		return false;
	}
	return false;
}

AppointmentDao.prototype.getAppointmentNumber = async function(type, visitDateTime) {

	var _tomorrow = visitDateTime + 86400; //明日零點
	//	var _today = new Date(visitDate.setHours(0, 0, 0, 0)); //visitDate日零點
	try {
		//		var result = await knex('wy_appointment').whereBetween('appointmentDate',[_today,_tomorrow]).andWhere({type:type}).groupBy('type').sum('totalNumber as allNumber');//[ { allNumber: 2 } ] []
		var result = await knex('wy_appointment').where({
			'type': type,
			"chargeStatus":1
		}).where('visitDate', '>=', visitDateTime).andWhere('visitDate', '<', _tomorrow).groupBy('type').sum('totalNumber as allNumber');
		if(!!result) {
			return result;
		}
	} catch(err) {
		return false;
	}
	return false;
}

AppointmentDao.prototype.update = async function(appoint_id, tradeNo, chargeStatus) {
	try {
		var result = await knex('wy_appointment').where('id', '=', appoint_id).update({
				tradeNo: tradeNo,
				chargeStatus: chargeStatus
			});
		if(!!result){
			return result;
		}
	}catch(err) {
		return false;
	}
	return false;
}

AppointmentDao.prototype.updateChargeStatus = async function(tradeNo,chargeStatus){
	try {
		var result = await knex('wy_appointment').where('tradeNo', '=', tradeNo).update({
				chargeStatus: chargeStatus
			});
		if(!!result){
			return result;  //1
		}
	}catch(err) {
		return false;
	}
	return false;
}
module.exports = AppointmentDao

