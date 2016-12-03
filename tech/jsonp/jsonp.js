//2016年12月3日更新
//参数列表args
//args中:
//baseUrl:不带参数的url
//data:url中的参数,json格式
//callbackKey:jsonp中,要将回调函数的key作为参数发给后台
//比如百度建议 http://suggestion.baidu.com/su?wd=a&cb=xxx
//其中cb就是callbackKey
//fnSuccess:成功获取数据后的函数名称
var jsonp = function(args) {
    if (typeof args === 'undefined') {
        args = {};
    }
    if (typeof args.baseUrl === 'undefined') {
        return;
    }
    if (typeof args.data === 'undefined') {
        args.data = {};
    }
    if (typeof args.callbackKey === 'undefined') {
        args.callbackKey = 'callback';
    }
    var callbackValue = ('callback' + Math.random()).replace('.', '');
    window[callbackValue] = function(data) {
        if (typeof args.fnSuccess === 'function')
            args.fnSuccess(data);
        oHead.removeChild(oScript);
        delete window[callbackValue];
    };

    function data2url(baseUrl, data, callbackKey, callbackValue) {
        var dataArr = [];
        for (key in data) {
            dataArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        dataArr.push(callbackKey + '=' + callbackValue);
        return baseUrl + '?' + dataArr.join('&');
    }
    //根据数据生成url
    var url = data2url(args.baseUrl, args.data, args.callbackKey, callbackValue);
    console.log(url);
    //根据url创建动态的script,并插入文档
    var oScript = document.createElement('script');
    oScript.setAttribute('src', url);
    var oHead = document.getElementsByTagName('head')[0];
    oHead.appendChild(oScript);
};
