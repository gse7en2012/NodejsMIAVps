
exports.show = function (req, res) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'shimen112',
        database: 'mia'
    });
    connection.connect();
    connection.query('SELECT * FROM info', function (err, rows) {
        if (err) throw err;
        res.render('show', {title:'MIA访客信息查看', result: rows})
    });
    connection.end();
}

exports.showDetails=function(req,res){
    var id = req.params.id;
    var moment=require('moment');
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'shimen112',
        database: 'mia',
        multipleStatements: true
    });
    connection.connect();
    connection.query('SELECT * FROM action  where info_id=?;SELECT * FROM page  where info_id=?;',[id,id], function (err, rowsAction) {
        if (err) throw err;
            rowsAction[0].forEach(function(item,index){
                item['time_format']=moment(item['time']).format('YYYY-MM-DD HH:mm:ss');
            })
            res.render('ajax',{result:rowsAction[0],page:rowsAction[1],infoid:req.param('fid')});

    });
    connection.end();


}
