var mysqlmid = require('../lib');
var Schema = mysqlmid.Schema;
var opt = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mia'
}
mysqlmid.init(opt);
var Info = Schema('Info', 'info');
var Action=Schema('Action','action');
var Page=Schema('Page','page');

exports.Info=Info;
exports.Action=Action;
exports.Page=Page;