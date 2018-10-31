var RES_CONFIG = require('../config/res_config');
const formidable = require('formidable');
var Response = require('../utils/Response');
var AppointmentDao = require('../dao/appointmentDao');
var CustomerDao = require('../dao/customerDao');
var appointmentType = require('../config/appointmentType_config');
var multiparty = require('multiparty');
var uuidUtils = require('../utils/uuidUtils');
var dateUtils = require('../utils/dateUtils');

var appointmentDao = new AppointmentDao();
var customerDao = new CustomerDao();

async function loadArtMuseumAppointmentList(req, res) {
	var type = appointmentType.artMuseumAppointment; // 艺术馆type 0  细胞存储1
	var wxOpenId = req.body.wxOpenId;

	if(!wxOpenId) {
		return res.json(new Response(RES_CONFIG.fail, "", "500"));
	}

	var result = await appointmentDao.findListByWxOpenIdAndType(wxOpenId, type);
	
	if(result == "noAppoint"){
		return res.json(new Response(RES_CONFIG.success, "", "noAppoint"));
	}else if(result == 'err'){
		return res.json(new Response(RES_CONFIG.fail, "", "500"));
	}else{
		return res.json(new Response(RES_CONFIG.success, result, ""));
	}
	
	
}

async function loadCellStorageAppointmentList(req, res) {
	var wxOpenId = req.body.wxOpenId;
	var type = appointmentType.cellStorageAppoinment;

	if(!wxOpenId) {
		return res.json(new Response(RES_CONFIG.fail, "", "500"));
	}

	var result = await appointmentDao.findListByWxOpenIdAndType(wxOpenId, type);
	if(result == "noAppoint"){
		return res.json(new Response(RES_CONFIG.success, "", "noAppoint"));
	}else if(result == 'err'){
		return res.json(new Response(RES_CONFIG.fail, "", "500"));
	}else{
		return res.json(new Response(RES_CONFIG.success, result, ""));
	}
}

async function addArtMuseumAppointment(req, res) {
	var type = '0';
	var form = new multiparty.Form();
	form.parse(req, async function(err, fields, files) {
		var appointment = {
			type: 0,
			submitStatus: '审批中',
			appointmentDate: (new Date().getTime())/1000
		}
		var allNumber;
		var totalNumber;
		for(var key in fields) {
			if(key == 'visitDate') {
				var visitDate = new Date(fields['visitDate'][0]);
				var visitDateTime = (new Date(visitDate.setHours(0, 0, 0, 0)).getTime())/1000;//当日零点时间戳
				
				var result = await appointmentDao.getAppointmentNumber(type, visitDateTime);
				if(!!result) {
					allNumber = result.length == 0 ? 0 : result[0].allNumber;
					if(allNumber > 20) {
						return res.json(new Response(RES_CONFIG.fail, '', "今天预约已满，无法预约"))
					}else{
						appointment.visitDate = visitDate.getTime()/1000;
					}
				} else {
					return res.json(new Response(RES_CONFIG.fail, "", "预约出错，请稍后预约"));
				}
			}else if(key == 'totalNumber') {
				totalNumber = Number(fields['totalNumber'][0]);
				appointment.totalNumber = totalNumber;
			}else if(key == "wxOpenId") {
				var wxOpenId = fields['wxOpenId'][0];
				var customer = await customerDao.getCustomerByWxOpenId(wxOpenId);
				if(!!customer) {
					appointment['customerId'] = customer.id;
				}else{
					return res.json(new Response(RES_CONFIG.fail,"",""))
				}
			} else {
				appointment[key] = fields[key][0];
			}
		}
		if(totalNumber + allNumber > 20) {
			var left = 20 - allNumber;
			console.log("left:"+left)
			return res.json(new Response(RES_CONFIG.fail, left, ""));
		} else {
			appointment.id = uuidUtils.generateUUID();
			
			var result = await appointmentDao.save(appointment);
			if(!!result) {
				return res.json(new Response(RES_CONFIG.success, appointment.id, ""));
			} else {
				return res.json(new Response(RES_CONFIG.fail, "", "預約失敗"));
			}
		}
	});
}

async function addCellStorageAppointment(req, res) {
	
	var type = '1';
	var form = new multiparty.Form();
	var appointmentDate = Math.floor((new Date().getTime())/1000);
	form.parse(req, async function(err, fields, files) {
		var appointment = {
			type: 1,
			submitStatus: '审批中',
			appointmentDate: appointmentDate
		}
		var allNumber;
		var totalNumber;
		for(var key in fields) {
			if(key == 'visitDate') {
				var visitDate = new Date(fields['visitDate'][0]);
				var visitDateTime = (new Date(visitDate.setHours(0, 0, 0, 0)).getTime())/1000;//当日零点时间戳
				
				var result = await appointmentDao.getAppointmentNumber(type, visitDateTime);
				if(!!result) {
					allNumber = result.length == 0 ? 0 : result[0].allNumber;
					if(allNumber > 20) {
						return res.json(new Response(RES_CONFIG.fail, '', "今天预约已满，无法预约"))
					}else{
						appointment.visitDate = Math.floor(visitDate.getTime()/1000);
					}
				} else {
					return res.json(new Response(RES_CONFIG.fail, "", "预约出错，请稍后预约"));
				}
			}else if(key == 'totalNumber') {
				totalNumber = Number(fields['totalNumber'][0]);
				appointment.totalNumber = totalNumber;
			}else if(key == "wxOpenId") {
				var wxOpenId = fields['wxOpenId'][0];
				var customer = await customerDao.getCustomerByWxOpenId(wxOpenId);
				if(!!customer) {
					appointment['customerId'] = customer.id;
				}else{
					return res.json(new Response(RES_CONFIG.fail,"",""))
				}
			} else {
				appointment[key] = fields[key][0];
			}
		}
		
		
		if(totalNumber + allNumber > 20) {
			var left = 20 - allNumber;
			return res.json(new Response(RES_CONFIG.fail, left, ""));
		} else {
			appointment.id = uuidUtils.generateUUID();
			
			var result = await appointmentDao.save(appointment);
			if(!!result) {
				return res.json(new Response(RES_CONFIG.success, appointment.id, ""));
			} else {
				return res.json(new Response(RES_CONFIG.fail, "", "預約失敗"));
			}
		}
	});

}

async function getAppointment(req, res) {
	var id = req.body.id;

	if(!id) {
		return res.json(new Response(RES_CONFIG.fail, "", "查询参数出错"));
	}

	var appointment = await appointmentDao.getAppointmentById(id);
	if(!!appointment) {
		appointment.visitDate = dateUtils.getDate(appointment.visitDate);
		appointment.appointmentDate = dateUtils.getDate(appointment.appointmentDate);
		appointment.birthday = dateUtils.getRealTime(appointment.birthday);
		return res.json(new Response(RES_CONFIG.success, appointment, ""));
	} else {

		return res.json(new Response(RES_CONFIG.fail, "", "预约记录未查到"));
	}
}

async function deleteAppointment(req, res) {
	var id = req.body.id;
	if(!id) {
		return res.json(new Response(RES_CONFIG.fail, "", "出错了"));
	}

	var result = await appointmentDao.deleteById(id);
	if(!!result) {
		return res.json(new Response(RES_CONFIG.success, "", ""));
	} else {
		return res.json(new Response(RES_CONFIG.fail, "", "取消预约失败"));
	}
}

async function updateChargeStatus(req,res){
	var tradeNo = req.body.tradeNo;
	var chargeStatus = req.body.chargeStatus;
	
	var result = appointmentDao.updateChargeStatus(tradeNo,chargeStatus);
	if(!!result){
		return res.json(new Response(RES_CONFIG.success,"",""));
	}else{
		return res.json(new Response(RES_CONFIG.fail,"",""));
	}
}

module.exports = {
	loadArtMuseumAppointmentList: loadArtMuseumAppointmentList,
	loadCellStorageAppointmentList: loadCellStorageAppointmentList,
	addArtMuseumAppointment: addArtMuseumAppointment,
	addCellStorageAppointment: addCellStorageAppointment,
	getAppointment: getAppointment,
	deleteAppointment: deleteAppointment,
	updateChargeStatus:updateChargeStatus
}