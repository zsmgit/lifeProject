var uuid = require('node-uuid');
function generateUUID(){
	var uid = uuid.v1();
	uid = uid.replace(/\-/g,'');
	return uid;
}

module.exports = {
	generateUUID:generateUUID
}
