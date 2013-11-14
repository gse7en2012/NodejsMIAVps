/**
 * Created with JetBrains WebStorm.
 * User: Gseven @NIE
 * Date: 13-9-10
 * Time: 上午11:16
 */
/**
 * 依赖于jQuery
 * @type {*|{}|{}}
 */
var MIA = MIA || {};
/**
 * MIA库core模块，构造命名空间函数
 * @param nspString 命名空间名称
 * @returns {*|{}|{}} 命名空间对象
 */
MIA.namespace = function (nspString) {
    var parts = nspString.split('.'),
        parent = MIA;
    if (parts[0] === 'MIA') {
        parts = parts.slice(1);
    }
    for (var i = 0, len = parts.length; i < len; i++) {
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};
/**
 * 基础配置
 */
MIA.namespace('MIA.config');
MIA.config = {
    version: '0.0.1',
    author: 'Gseven',
    server: '/info'
}
/**
 * 声明util.resSize对象,返回屏幕分辨率
 */
MIA.namespace('MIA.util.resSize');
MIA.util.resSize = (function (win) {
    var screenWidth = win.screen.width,
        screenHeight = win.screen.height;

    function returnSize() {
        return screenWidth + '*' + screenHeight;
    }

    return{
        width: screenWidth,
        height: screenHeight,
        sizeString: returnSize()
    }
})(window);

MIA.namespace('MIA.util.obj2str');
MIA.util.obj2url = function (obj) {
    var server = obj['server'] || MIA.config.server;
    var str = server + '?';
    var obj = obj || {};
    for (var key in obj) {
        if (key == 'server') break;
        str += key + '=' + obj[key] + '&'
    }
    return str;
}
/**
 * 无耻地借用$.ajax对象
 */
MIA.namespace('MIA.util.AJAX');
MIA.util.AJAX = (function ($) {
    var obj = $.ajax;
    return obj;
})(jQuery);
/**
 * 页面属性
 */
MIA.namespace('MIA.util.page');
MIA.util.page = (function ($, win) {
    var title = win.document.title,
        url = win.location.href;
    return{
        pageTitle: title,
        pageUrl: url
    }
}(jQuery, window))
/**
 * tracker对象
 */
MIA.namespace('MIA.tracker');
MIA.tracker = (function () {
    var ImgSend = function (url) {
        var img = new Image(1, 1),
            randomId = '_mia_' + Math.random();
        window[randomId] = img;
        img.onload = img.onerror = img.onabort = function () {
            var img = window[randomId];
            img.onload = null;
            img.onerror = null;
            img.onabort = null;
            img = null;
            window[randomId] = null;
        };
        img.src = url;
        img = null;
    };
    return ImgSend;
}());

/**
 * MIA初始化工作
 */
MIA.init = function (fn) {
    var initStr = MIA.util.obj2url({
        res: MIA.util.resSize.sizeString,
        title: MIA.util.page.pageTitle,
        url: MIA.util.page.pageUrl,
        init: true,
        ref:document.referrer,
        path:window.location.pathname,
        tpl: $('body').attr('mia-tpl') || ''
    });
    var initTracker = new MIA.tracker(initStr);
    if (typeof fn === 'function') {
        fn();
    }
    $('body').on('click', function (e) {
        var ele = e.target,
            $ele = $(ele),
            miaTplPoint = $('body').attr('mia-tpl'),
            miaElePoint = $ele.attr('mia-point');
        if (!miaElePoint) return;
        var newTracker = new MIA.tracker(MIA.util.obj2url({
            point: miaElePoint,
            tpl: miaTplPoint,
            url: MIA.util.page.pageUrl,
            path:window.location.pathname
        }));
    })
}
$(function () {
    MIA.init(function () {
        $('#pic-list').find('img').each(function (i) {
            $(this).attr('mia-point', 'pic-list_img-' + i);
            $(this).on('click', function (e) {
                var miaTplPoint = $('body').attr('mia-tpl');
                var miaElePoint = $(this).attr('mia-point');
                if (!miaElePoint) return;
                var newTracker = new MIA.tracker(MIA.util.obj2url({
                    point: miaElePoint,
                    tpl: miaTplPoint,
                    url: MIA.util.page.pageUrl,
                    path:window.location.pathname
                }));
            })
        })
        $('.media-body').find('a').each(function(i){
            $(this).attr('mia-point', 'news-list_a-' + i);
            $(this).on('click', function (e) {
                var miaTplPoint = $('body').attr('mia-tpl');
                var miaElePoint = $(this).attr('mia-point');
                if (!miaElePoint) return;
                var newTracker = new MIA.tracker(MIA.util.obj2url({
                    point: miaElePoint,
                    tpl: miaTplPoint,
                    url: MIA.util.page.pageUrl,
                    path:window.location.pathname
                }));
            })
        })

    });
})



