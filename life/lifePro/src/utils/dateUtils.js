function getRealTime(dateObj){
	let _date = new Date(dateObj);
	let _hour = _date.getHours();
	let realDate = new Date(_date.setHours(_hour+8,0,0,0));
	let result = realDate.getFullYear() + '-' + (realDate.getMonth()+1) + '-' + realDate.getDate();
	return result;
}

function getDate(time_stamp){
	var _date = new Date();
	_date.setTime(time_stamp*1000);
	return _date.getFullYear()+'-'+(_date.getMonth()+1)+'-'+_date.getDate();
}
module.exports ={
	getRealTime:getRealTime,
	getDate:getDate
}
