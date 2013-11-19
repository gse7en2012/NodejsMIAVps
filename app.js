/**
 * Module dependencies.
 */
var cluster = require('cluster');
if (cluster.isMaster) {
    var cpuCount = require('os').cpus().length;
    console.log("CPU Nums:" + cpuCount);
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
        cluster.fork();
    });
    // As workers come up.
    cluster.on('listening', function (worker, address) {
        console.log("A worker with #" + worker.id + " is now connected to " + address.address + ":" + address.port);
    });
} else {
    var express = require('express');
    var routes = require('./routes');
    var user = require('./routes/info');
    var show = require('./routes/show');
    var http = require('http');
    var path = require('path');
    var app = express();

// all environments
    app.set('port', process.env.PORT || 3300);
    app.set('views', __dirname + '/views');
    app.use('/public', express.static(__dirname + '/public'));
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

// development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    app.get('/', routes.index);
    app.get('/show', show.show);
    app.get('/info', user.info);
    app.get('/cc', routes.clearCookies);
    app.get('/show/:id', show.showDetails);
    app.get('/q',routes.testq);
    app.get('/mongo',user.mongoInfo);
    app.get('/y',user.yixin);



    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });

}
