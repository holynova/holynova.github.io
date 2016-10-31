CookieUtil = {
    //cookie option format
    //path: default:'/'
    //domain: default :
    //max-age:
    //expires:date obj
    set: function(key, value, options) {
        console.log(CookieUtil.toString(key, value, options));
        document.cookie = CookieUtil.toString(key, value, options);
    },
    get: function(key) {
        //如果没找到 返回空字符串
        var reg = new RegExp('(^|\\s)' + key + '=[\\w%]+(;|\\s|$)', 'g');
        var matches = reg.exec(document.cookie);
        if (matches) {
            var arr = matches[0].replace(/[;\s]/g, '').split('=');
            return unescape(arr[1]);
        } else {
            return '';
        }
    },
    del: function(key) {
        CookieUtil.set(key, 'del', {
            'expires': (new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)).toString()
        });
    },
    toString: function(key, value, options) {
        var optionStr = '';
        if (typeof options === 'undefined') {
            var expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
            options = {
                // "path": "/",
                "expires": expires.toString()
            }
        }
        //日期处理
        if (options['expires']) {
            if (Object.prototype.toString.call(options['expires']) === "[object Date]") {
                options['expires'] = options['expires'].toString();
            }
        }
        for (name in options) {
            optionStr += name + '=' + options[name] + ";"
        }
        return key + "=" + escape(value) + ";" + optionStr;
    },
};
