var mysql = require('mysql');

var createMysqlPool = function(opt){
	return mysql.createPool(opt)
};

exports.createMysqlPool = createMysqlPool;
