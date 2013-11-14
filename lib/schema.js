var Mysqlmid = require('./mysqlmid');
var util = require('util');

var Schema = function(name, table){
	var name = function(opts) {
		Mysqlmid.call(this, {table: table});
	};

	util.inherits(name, Mysqlmid);

	return new name()
}

module.exports = Schema;