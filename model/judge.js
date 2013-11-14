var judgeFn = (function () {
    return function (point) {
        var _point = point;
        var cookieId;
        var result = {
            img: [],
            a: []
        };
        console.log(point.indexOf('land@/download'))
        console.log(point.indexOf('download-btn@/download') == -1)
        if (point.indexOf('land@/download') != -1 && point.indexOf('download-btn@/download') == -1) {
            return 4;
        }
        console.log('a');
        /*
        if(point.indexOf('refresh@/download') != -1 && point.indexOf('download-btn@/download') != -1){
            return 5;
        }  */
        var actionArr = _point.split('|');
        actionArr.forEach(function (item, index) {
            var itemArr = item.split('@');
            var itemArrItem = itemArr[0];
            if (itemArrItem.indexOf('list_img') != -1) {
                result.img.push(itemArrItem);
            }
            if (itemArrItem.indexOf('list_a') != -1) {
                result.a.push(itemArrItem);
            }

        })
        result.imgNum = result.img.length;
        result.aNum = result.a.length;
        console.log(result);
        result.imgNum > result.aNum ? cookieId = 2 : cookieId = 3;
        return cookieId;


    }
})();

exports.judge = judgeFn;
