//@author 桑益民
//@date 2016-12-3 16:36:13
/**
 * [ajax description]
 * @param  {obj} settings ajax参数,包括
 * method 
 * url
 * data obj格式的数据
 * success 成功的回调函数,传进来的参数是responseText
 * error  请求失败的回调函数,传进来的参数是xhr.status 是错误码
 * timeout 超时时间
 * timeoutFunc 超时回调函数
 * header obj 请求头, 默认{}
 * @
 */
function ajax(settings) {
    // 设置默认值
    // 
    if (typeof settings === 'undefined') settings = {};
    if (typeof settings.url === 'undefined') return;
    if (typeof settings.method == 'undefined') settings.method = 'get';
    if (typeof settings.data === 'undefined') settings.data = {};
    if (typeof settings.header === 'undefined') settings.header = {};
    if (typeof settings.timeout === 'undefined') settings.timeout = 5000;
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else {
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    // var url = makeURL(settings.url, settings.data);
    if (settings.method.toLowerCase() === 'get') {
        var url = '';
        if (settings.data) {
            url = settings.url + '?' + json2url(settings.data);
        } else {
            url = settings.url;
        }
        xhr.open('GET', url, true);
        xhr.send();
    } else if (settings.method.toLowerCase() === 'post') {
        xhr.open('POST', settings.url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        setHttpHeader(xhr, settings.header);
        xhr.send(json2url(settings.data));
    }
    //将数据用url get请求的方式进行序列化
    function json2url(json) {
        if (!json) return;
        var arr = [];
        for (key in json) {
            arr.push(encodeURIComponent(key) + "=" + encodeURIComponent(json[key]));
        }
        return arr.join('&');
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 & xhr.status < 300) || xhr.status === 304) {
                clearTimeout(timer);
                if (typeof settings.success === 'function') {
                    settings.success(xhr.responseText);
                }
            } else {
                clearTimeout(timer);
                if (typeof settings.error === 'function') {
                    settings.error(xhr.status);
                }
            }
        }
    };
    if (typeof settings.timeoutFunc === 'undefined') {
        settings.timeoutFunc = function() {
            alert('请求超时');
        };
    }
    var timer = setTimeout(settings.timeoutFunc, settings.timeout);

    function setHttpHeader(xhr, headerData) {
        if (headerData) {
            for (key in headerData) {
                xhr.setRequestHeader(key, headerData[key]);
            }
        }
    }
}
