
//遍历elem的一系列属性, 将结果存到一个obj中返回
//attrNames中存放的是需要遍历的属性名
function getAttributsObj(elem,attrNames){
    var resObj = {};
    for (var i=0;i<attrNames.length;i++){
        var name = attrNames[i];
        resObj[name] = elem[name];
    }
    return resObj;

}

function getAllSizePosInfo(elem) {
    var left = ['scroll', 'offset', 'client', 'screen'];
    var right = ['left', 'right', 'top', 'bottom', 'width', 'height','x','y'];
    var attrs = getCombineAttr(left, right);
    return getAttributsObj(elem,attrs);
}

function obj2str(obj) {
    // return JSON.stringify(obj);
    var str = '';
    for (var name in obj) {
        str += name + '=' + obj[name] + '<br>';
    }
    return str;
}

//将两个字符串数组进行排列组合,返回一个结果数组
function getCombineAttr(leftArr, rightArr) {
    function combine(leftStr, rightStr) {
        return leftStr + capitalize(rightStr);
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    }
    var res = [];
    for (var i = 0; i < leftArr.length; i++) {
        for (var j = 0; j < rightArr.length; j++) {
            res.push(combine(leftArr[i], rightArr[j]));
        }
    }
    return res;
}