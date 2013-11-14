exports.dbTest = function (req, res) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database:'mia'
    });
    connection.connect();
    connection.query('SELECT * FROM user', function (err, rows) {
        if (err) throw err;

     //   console.log('The solution is: ',rows);
        res.render('mysql',{title:rows.length,result:rows})
    });
    connection.end();
}
