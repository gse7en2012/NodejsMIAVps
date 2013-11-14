'use strict'
/**
 * part 1 命名空间
 * @type {*|{}}
 */


var MIA = MIA || {};
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


var module = MIA.namespace('MIA.getScreen');
var moduleChild = MIA.namespace('MIA.xhrHelper');
console.log(module);
MIA.getScreen = (function () {
    //依赖
    var xhrHelper = MIA.xhrHelper;
    return{
        width: window.screen.width,
        height: window.screen.height
    }
});
//创建构造函数的模块
MIA.namespace('MIA.util.Array');
MIA.util.Array = (function () {
    //依赖
    var uobj = MIA.util.getScreen;
    var ulang = MIA.util.xhrHelper;
    var Constr;
    //可选的一次性初始化过程
    //...
    //公有API——构造函数
    Constr = function (o) {
        this.elements = this.toArray(o);
    };
    //公有API——原型
    Constr.prototype = {
        constructor: MIA.util.Array,
        version: '2.0',
        toArray: function (o) {
            for (var i = 0, a = [], len = o.length; i < len; i++) {
                a[i] = o[i];
            }
            return a;
        }
    };
    //返回要分配给新命名空间的构造函数
    return Constr;
}());
var arr = new MIA.util.Array({name: 'Gseven'});
//将全局变量导入到模块中
MIA.util.module = (function (app, global) {
    //引用全局变量
    //转为局部变量加速
}(MIA, this))


/**
 * part2 构造函数
 * @constructor
 */
function Mia() {
    var version = '0.1';
    this.name = 'Gseven';
    this.getRes = function () {
        return 'Gseven Hello';
    };
    this.getVersion = function () {
        return version;
    };
}
Mia.prototype = (function () {
    var astr = '[object Array]';
    var browser = 'Chrome';
    var toString = Object.prototype.toString;


    function isArray(a) {
        return toString.call(a) === astr;
    }


    return{
        getBrowser: function () {
            return browser;
        },
        isArray: isArray
    }
})();
var module2 = new Mia();
console.log(module2);
console.log(module2.getBrowser());


function Batch(functions,completionHandler){
    this._functions=functions;
    this._completionHandler=completionHandler;
}
Batch.prototype.execute=function execute(){
    var i;
    var functions=this._functions;
    var length=this._remaining=functions.length;
    this._results=[];

    for(i=0;i<length;i++){
        functions[i](this);
    }
}
Batch.prototype.done=function done(result){
    this._remaining-=1;
    if(typeof result!=='undefined'){
        this._results.push(result);
    }

    if(this._remaining===0){
        this._completionHandler(this._results);
    }
}

var urls=[
    '/api/gists/1000',
    '/api/gists/1001',
    '/api/gists/1002',
    '/api/gists/1003'
]
var i;
var length=urls.length;
var batchFunctions=[];

for(i=0;i<length;i++){
    batchFunctions.push(function(batch){
        AJAXLib.get(urls[i],function(response){
            batch.done(response);
        })
    })
}

var gistsBatch=new Batch(batchFunctions,function(results){
    //Here we have an array of response that we can render to the page
})
gistsBatch.execute();

function extend(parent,child){
    var i;
    var toStr=Object.prototype.toString;
    var astr="[object Array]";
    child=child||{};
    for(i in parent){
        if(parent.hasOwnProperty(i)){
            if(typeof parent[i]==="object"){
                child[i]=(toStr.call(parent[i])===astr)?[]:{};
                extend(parent,child);
            }else{
                child[i]=parent[i];
            }
        }
    }
    return child;
}

