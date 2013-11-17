var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/mia');
var Q = require('q');
/**
 * API请参考：
 *      https://github.com/kissjs/node-mongoskin
 *      https://github.com/mongodb/node-mongodb-native
 */
db.bind('info', {
    /**
     * 查找该集合下的前10条数据，返回结果数组。
     * @returns {Function|promise|promise|Q.promise|promise|Q.promise|Function|Function}
     */
    findTop10: function () {
        var deffered = Q.defer();
        this.find({}, {limit: 10}).toArray(function (err, result) {
            if (err) {
                deffered.reject(err);
            } else {
                deffered.resolve(result);
            }
        });
        return deffered.promise;
    },
    /**
     * 根据query和options查找数据库，以数组形式返回所有符合条件的结果。
     * @param query
     * @param options
     * @returns {Function|promise|promise|Q.promise|promise|Q.promise|Function|Function}
     */
    findQuery: function (query, options) {
        var findDefer = Q.defer();
        options = options || {};
        this.find(query, options).toArray(function (err, result) {
            if (err) findDefer.reject(err);
            findDefer.resolve(result)
        })
        return findDefer.promise;
    },
    /**
     * 更新一条记录，数组形式返回结果
     * @param query
     * @param news
     * @param options
     * @returns {Function|promise|promise|Q.promise|promise|Q.promise|Function|Function}
     */
    updateRecord: function (query, news, options) {
        var updateDefer = Q.defer();
        options = options || {
            safe: true,//  如果需要callback，请设定为true
            multi: true,// 如果为true，所有符合query的记录都会更新，不止第一条
            upsert: true// 如果为true，当没有符合query的记录时，自动insert一条
        };
        this.update(query, news, options, function (err, object) {
            if (err) updateDefer.reject(err);
            updateDefer.resolve(object)
        })
        return updateDefer.promise;
    },
    /**
     * 插入一条新的记录，数组形式返回该记录。
     * @param obj
     * @returns {Function|promise|promise|Q.promise|promise|Q.promise|Function|Function}
     */
    insertNew: function (obj) {
        var insertDefer = Q.defer();
        this.insert(obj, function (err, object) {
            if (err) {
                insertDefer.reject(err);
            }
            insertDefer.resolve(object);
        })
        return insertDefer.promise;
    },
    removeTagWith: function (tag, fn) {
        this.remove({tags: tag}, fn);
    }
});

module.exports = db;
