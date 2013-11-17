//TODO:当客户端有cookies但数据表没对应cookies时出错
//TODO:替换成mongo。
exports.info = function (req, res) {
    var moment = require('moment');
    var crypto = require('crypto');
    var request = require('request');
    var userAgentLib = require('express-useragent');
    var tbInfo = require('../model/mysql').Info;
    var tbAction = require('../model/mysql').Action;
    var tbPage = require('../model/mysql').Page;
    var userUA = userAgentLib.parse(req.headers['user-agent']);
    var userIP = req.ip;
    var acitonJudge = require('../model/judge').judge;

    /**
     * 检查cookies和session 有则返回，无则生成
     * @param key
     * @returns {{isFisrt: boolean, cookieValue: *}}
     */
    function checkCookies(key, init, cookiesOpt) {
        if (!req.cookies[key] || init) {
            var newCookie = createCookies(req.ip)
            res.cookie(key, newCookie, cookiesOpt);
            return{
                isFisrt: true,
                cookieValue: newCookie
            };
        } else {
            return {
                isFisrt: false,
                cookieValue: req.cookies[key]};
        }
    }

    /**
     * 生成访客cookies
     * @param ip
     * @returns {string}
     */
    function createCookies(ip) {
        var time = new Date().valueOf(),
            ip = ip,
            rand = Math.random();
        return time + '.' + ip + '.' + rand;
    }

    /**
     * 返回城市，省份等信息
     * @param ip
     * @param callback
     */
    function getCity(ip, callback) {
        request('http://ip.taobao.com/service/getIpInfo.php?ip=' + ip, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(JSON.parse(body));
            } else {
                return false;
            }
        })
    }

    /**
     * 插入数据库操作
     * @param body
     */
    function recordInfo(body) {
        var cookieDetect = checkCookies('mia_id', false, { expires: new Date(3586476731782), httpOnly: true }),
            sessionDetect = checkCookies('mia_sid', /*req.param('init')*/false, {expires: new Date(Date.now() + 1000 * 60 * 30), httpOnly: true}),
            data = body['data'],
            country = data['country'],
            area = data['area'],
            region = data['region'],
            city = data['city'],
            isp = data['isp'],
            ip = data['ip'];
        var infoRow = {
            area: area,
            isp: isp,
            city: city,
            ip: ip,
            region: region,
            country: country,
            screen: req.param('res'),
            browser: userUA.Browser + '_' + userUA.Version,
            platform: userUA.Platform,
            os: userUA.OS
            // point:req.param('point'),
        }
        var pageRow = {
            page_url: req.param('url'),
            page_title: req.param('title'),
            referrer: req.param('ref')
        }
        var actionRow = {
            time: new Date(),
            point: (req.param('point') || 'land') + '@' + req.param('path'),
            page_url: req.param('url'),
            tpl: req.param('tpl')
            // session:sessionDetect
        }
        //cookie是否存在
        if (cookieDetect.isFisrt) {
            infoRow['cookie'] = cookieDetect.cookieValue;
            // dbRow['point']=req.param('point')||'';
            tbInfo.insert(infoRow, function (err, insertid) {
                actionRow['info_id'] = insertid;
                actionRow['create_time'] = new Date();
                if (sessionDetect.isFisrt) {
                    actionRow['session'] = sessionDetect.cookieValue;
                    tbAction.insert(actionRow, function (err, insertid) {
                        res.send(200);
                    })
                }
            });
        } else {
            //检查会话id，如果是新的session
            if (sessionDetect.isFisrt) {
                var where = {'cookie': cookieDetect.cookieValue};
                tbInfo.findOne(where, function (err, result) {
                    if (!result) return;
                    var info_id = result['info_id'];
                    actionRow['info_id'] = info_id;
                    actionRow['session'] = sessionDetect.cookieValue;
                    actionRow['create_time'] = new Date();
                    tbAction.insert(actionRow, function (err, insertid) {
                        res.send(200);
                    })
                })
            } else {
                //如果已经存在
                var where = {'session': sessionDetect.cookieValue};
                tbAction.findOne(where, function (err, result) {
                    if (!result) return;
                    var point = result['point'].split('|');
                    var reqPoint = (req.param('point') || 'land') + '@' + req.param('path');
                    point.push(reqPoint);
                    point = point.join('|');
                    actionRow['point'] = point;
                    res.cookie('mia_tid', acitonJudge(point), { expires: new Date(3586476731782), httpOnly: true });
                    tbAction.update(where, actionRow, function (err) {
                        res.send(200);
                    });
                })
            }
            //如果是页面的初次访问，记录入库
            if (req.param('init')) {
                var wherePg = {'cookie': cookieDetect.cookieValue};
                tbInfo.findOne(wherePg, function (err, result) {
                    var info_id = result['info_id'];

                    console.log(result, pageRow);
                    // tbPage.update({'info_id':info_id},pageRow)
                    tbPage.find({'info_id': info_id, 'page_url': pageRow.page_url}, function (err, result) {
                        if (!result) {
                            pageRow['info_id'] = info_id;
                            tbPage.insert(pageRow, function (err, insertid) {
                            })
                        } else {
                            pageRow['count'] = parseInt(result[0]['count'], 10) + 1;
                            tbPage.update({'info_id': info_id}, pageRow, function (err) {
                            });
                        }
                    })
                })
            }
        }
    }

    getCity(req.ip, recordInfo);
    //res.send(200);
}

//TODO: 2013.11.17  今晚将mongoLib封装了一下，接下来的要解耦之前的流程。记录用户行为的同时记录用户信息。
exports.mongoInfo = function (req, res) {
    var moment = require('moment'),
        crypto = require('crypto'),
        request = require('request'),
        Q = require('q'),
        userUA = require('express-useragent').parse(req.headers['user-agent']),
        acitonJudge = require('../model/judge').judge,
        miaDb = require('../model/mongoLib');

    // 用户行为对象
    var actionRow = {
        time: new Date(),
        point: (req.param('point') || 'land') + '@' + req.param('path'),
        page_url: req.param('url'),
        tpl: req.param('tpl')
        // session:sessionDetect
    }
    var myHelper = {
        /**
         * 检查是否已存在判别用户标识的cookie，有则返回该cookie标识，无则新建一个cookie标识并返回
         * @param key   | 该cookie值
         * @param init  |   页面是否第一次加载，true|false。
         * @param cookiesOpt  | 新建cookie的参数
         * @returns {{isFisrt: boolean, cookieValue: *}}
         */
        checkCookies: function (key, init, cookiesOpt) {
            if (!req.cookies[key] || init) {
                var newCookie = this.createCookies(req.ip);
                res.cookie(key, newCookie, cookiesOpt);
                return{
                    isFisrt: true,
                    cookieValue: newCookie
                };
            } else {
                return {
                    isFisrt: false,
                    cookieValue: req.cookies[key]};
            }
        },
        createCookies: function (ip) {
            var time = new Date().valueOf(),
                ip = ip,
                rand = Math.random();
            return time + '.' + ip + '.' + rand;
        },
        getCity: function (ip) {
            var deffered = Q.defer();
            request('http://ip.taobao.com/service/getIpInfo.php?ip=' + ip, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    deffered.resolve(body);
                } else {
                    deffered.reject('failed');
                }
            });
            return deffered.promise;
        }
    };

    var infoRecord = {
        markdownUserAction:function(actionRow){
            miaDb.info.updateRecord();
        },
        cookieIsFirstDoFn: function (infoRow) {
            var cookieDetect = myHelper.checkCookies('mia_id', false, {
                expires: new Date(3586476731782),
                httpOnly: true
            });
            infoRow['cookie'] = cookieDetect.cookieValue;
            miaDb.info.insertNew(infoRow).then();
            /*
            tbInfo.insert(infoRow, function (err, insertid) {
                actionRow['info_id'] = insertid;
                actionRow['create_time'] = new Date();
                if (sessionDetect.isFisrt) {
                    actionRow['session'] = sessionDetect.cookieValue;
                    tbAction.insert(actionRow, function (err, insertid) {
                        res.send(200);
                    })
                }
            });
            */

        }
    };

    function insertInfo() {
        miaDb.info.insertNew({
            id: 10
        }).then(function (data) {
                console.log('success', data)
            })
    }

    function find() {
        miaDb.info.findQuery({
            id: 10
        }).then(function (result) {
                res.json(result)
            })
        miaDb.info.findQuery()
    }

    function sendResult(data) {
        res.json(data);
    }

    function searchDb() {
        return miaDb.info.findTop10();
    }

    insertInfo();
    find();

    myHelper.getCity(req.ip)
    //  .then(searchDb)
    //  .then(sendResult);

}