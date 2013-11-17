/*
 * GET home page.
 */

exports.index = function (req, res) {
    var tplCookies = req.cookies['mia_tid'];
    var viewTpl = 'index';
    console.log(tplCookies);
    if (tplCookies) {
        switch (tplCookies) {
            case '2':
                viewTpl = 'index-pic';
                break;
            case '3':
                viewTpl = 'index-list';
                break;
            case '4':
                viewTpl = 'index-download';
                break;
            default :
                break;
        }
        //tplCookies>2?viewTpl='index-pic':tplCookies>3?viewTpl='index-list':viewTpl='index-download';
    }
    console.log(viewTpl);
    res.render(viewTpl, { title: 'NIE-MIA' });
};




exports.clearCookies = function (req, res) {
    res.clearCookie('mia_id');
    res.clearCookie('mia_sid');
    res.clearCookie('mia_tid');
    res.send(200)
}


//TODO 移除这些学习代码
exports.testq2=function(req,res){
    var Q=require('q'),
        fs=require('fs');
    var fs_readFile = Q.denodeify(fs.readFile),
        promise = fs_readFile(__dirname+'/db.js','utf-8');
    function test(data){
        var deffer= Q.defer();
        if(data.length>0){
            deffer.resolve('success')
        }else{
            deffer.reject('error');
        }
        return deffer.promise;
    }
    function success(data){
        res.json({re:data});
    }
    function error(data){
        res.json({re:data});
    }
    promise.then(test).then(success,error);
}

exports.testq=function(req,res){
    var mysql = require('mysql');
    var Q=require('q');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mia'
    });
    var selectDatabase=function(query){
       // return Q.nfcall(connection.query,query);
        var deferred = Q.defer();
        connection.query(query, function (error, text) {
            if (error) {
                deferred.reject(new Error(error));
            } else {
                deferred.resolve(text);
            }
        });
        return deferred.promise;
    }
    var render=function(data){
        res.json(data);
    }
    connection.connect();
    //connection.query('SELECT * FROM info', function (err, rows) {
   //     if (err) throw err;
   //     res.render('show', {title:'MIA访客信息查看', result: rows})
   // });
    selectDatabase('SELECT * FROM info').then(render);
    connection.end();
}

