window.onload = function() {
    var oT = document.getElementById('t1'),
        oUl = document.getElementById('ul1'),
        oUl2 = document.getElementById('ul2');
    oT.addEventListener('input', handleInput, false);
    handleInput();
    oT.focus();

    function handleInput() {
        showBaiduSug();
        show360Sug();
    }

    function updateUl(arr, mode) {
        if (mode === 'baidu') {
            var html = '';
            for (var i = 0, len = arr.length; i < len; i++) {
                html += '<li><a target="_blank" href="https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=' + encodeURIComponent(arr[i]) + '">' + arr[i] + '</a></li>'
            }
            oUl.innerHTML = html;
        } else if (mode === '360') {
            var html = '';
            for (var i = 0, len = arr.length; i < len; i++) {
                html += '<li><a target="_blank" href="https://www.so.com/s?ie=utf-8&shb=1&src=360sou_newhome&q=' + encodeURIComponent(arr[i]) + '">' + arr[i] + '</a></li>'
            }
            oUl2.innerHTML = html;
        }
    }

    function showBaiduSug() {
        // http://suggestion.baidu.com/su?wd=a&cb=xxx
        var args = {
            baseUrl: 'http://suggestion.baidu.com/su',
            data: {
                wd: oT.value
            },
            callbackKey: 'cb',
            fnSuccess: function(data) {
                updateUl(data.s, 'baidu');
            }
        };
        jsonp(args);
    };

    function show360Sug() {
        // http://sug.so.360.cn/suggest?word=a&callback=xx
        var args = {
            baseUrl: 'http://sug.so.360.cn/suggest',
            data: {
                word: oT.value
            },
            callbackKey: 'callback',
            fnSuccess: function(data) {
                updateUl(data.s, '360');
            }
        };
        jsonp(args);
    };
}
