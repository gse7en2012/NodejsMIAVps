// mysql CRUD
var sqlclient = module.exports;
var _pool = null;
var NND = {};

/*
 * Innit sql connection pool
 * @param {Object} app The app for the server.
 */
NND.init = function(){
	if(!_pool)
		_pool = require('./mrs-pool').createMysqlPool(arguments[0]);
		
};

/**
 * Excute sql statement
 * @param {String} sql Statement The sql need to excute.
 * @param {Object} args The args for the sql.
 * @param {fuction} callback Callback function.
 * 
 */
NND.query = function(sql, args, callback){
	_pool.getConnection(function(err, connection) {
		if (!!err) {
			console.error('[sqlqueryErr] '+err.stack);
			return;
		}
		connection.query(sql, args, function(err, res) {
			connection.end();
			callback.apply(null, [err, res]);
		});
	});
};

/**
 * Close connection pool.
 */
NND.shutdown = function(){
	_pool.destroy();
};

/**
 * init database
 */
sqlclient.init = function() {
	if (!!_pool){
		return sqlclient;
	} else {
		NND.init.apply(null, arguments);
		sqlclient.insert = NND.query;
		sqlclient.update = NND.query;
		//sqlclient.delete = NND.query;
		sqlclient.query = NND.query;
    return sqlclient;
	}
};

/**
 * shutdown database
 */
sqlclient.shutdown = function() {
	NND.shutdown();
};
