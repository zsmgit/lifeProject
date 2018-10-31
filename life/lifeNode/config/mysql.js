var mysql      = require('mysql');
var connection = mysql.createConnection({
//host     : '118.190.146.207',
	host     : '101.37.152.94',
  user     : 'root',
//password : 'Tangfengguoji_20180402',
	password:'shanghaidingjian',
  database : 'wuyanlife'
});

module.exports = connection
