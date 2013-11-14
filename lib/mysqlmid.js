//require('coffee-script');
var mohair = require('mohair');
var mysql = require('../driver/mysql');
var Schema = require('./schema');

var Mysqlmid = function(opts){
	var _opts = opts || {};
	var table = _opts.table || '';

  this.table = mohair.table(table);

};

Mysqlmid.prototype.findOne = function(_where, callback){
	var query = this.table.where(_where)
							.limit(1)
							.select();

  var sql = query.sql();
  var args = query.params();

  mysql.query(sql, args , function(err, res){
  	if(err){
      console.error(err);
      return callback(err);
    } 

    if(!!res && res.length > 0){
      return callback(err, res[0]);
    }

    return callback(err, null);
  });
};

Mysqlmid.prototype.insert = function(_insert, callback){
  var query = this.table.insert(_insert);

  var sql = query.sql();
  var args = query.params();

  mysql.query(sql, args, function(err, res){
    if(err) {
      console.error(err);
      callback(err,null);
    } else {
      callback(null, res.insertId)
    }
  });
};

Mysqlmid.prototype.update = function(_where, _update, callback){
  var query = this.table.where(_where)
                  .update(_update);

  var sql = query.sql();
  var args = query.params();
  mysql.query(sql, args, function(err, res){
    if(err) console.error(err);

    callback(err);
  });
};


Mysqlmid.prototype.find = function(_where, callback){
  var query = this.table.where(_where)
              .select();

  var sql = query.sql();
  var args = query.params();

  mysql.query(sql, args , function(err, res){
    if(err){
      console.error(err);
      return callback(err);
    } 

    if(!!res && res.length > 0){
      return callback(err, res);
    }

    return callback(err, null);
  });
};

Mysqlmid.prototype.delete = function(_where, callback){
  var query = this.table.where(_where).delete();

  var sql = query.sql();
  var args = query.params();

  mysql.query(sql, args, callback);

};

Mysqlmid.prototype.query = function(query, callback){
  var sql = query.sql();
  var args = query.params();

  mysql.query(sql, args, callback);
};


Mysqlmid.prototype.test = function(_where, arg, callback){
  var query = this.table.where(_where)
  var keys = Object.keys(arg);

  for(var i = 0; i < keys.length; i++){
    query = query[keys[i]](arg[keys[i]])
  }

  var sql = query.sql();
  var args = query.params(); 

  console.log(sql, args);

 // mysql.query(sql, args, callback);
};

module.exports = Mysqlmid