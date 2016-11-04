window.onload = function() {
    var oBtn = document.getElementById('btnSend'),
        oInputName = document.getElementById('inputName'),
        oInputAbout = document.getElementById('inputAbout'),
        oUl = document.getElementById('show');
    // oInputGender = document.getElementsByName('gender');
    init();
    oBtn.addEventListener('click', send, false);
    oInputAbout.addEventListener('input', inputChange, false);
    oInputAbout.addEventListener('focus', function() {
        oInputAbout.rows = 6;
    }, false);
    // oInputAbout.addEventListener('blur', function() {
    //     oInputAbout.rows = 2;
    // }, false);
    // oInputAbout.cols = 90;
    function init() {
        getDataAndRender();
        countInput();
        var cookieContent = CookieUtil.get('bufferedContent');
        var cookieName = CookieUtil.get('bufferedName');
        if (cookieContent) {
            oInputAbout.value = cookieContent;
        }
        if (cookieName) {
            oInputName.value = cookieName;
        }
    }

    function inputChange() {
        countInput();
        CookieUtil.set('bufferedContent', oInputAbout.value);
        CookieUtil.set('bufferedName', oInputName.value);
    }

    function countInput() {
        document.getElementById('charCounter').innerHTML = oInputAbout.value.length;
    }

    function send() {
        var data = {};
        data.name = oInputName.value;
        data.about = oInputAbout.value;
        data.gender = getRadioValue('gender');
        data.date = new Date();
        var url = genGetUrl(window.location.href, data);
        // console.log(url);
        ajax(url, function(responseText) {
            console.log('get info form server ' + responseText);
            getDataAndRender();
            oInputAbout.value = '';
        });
    }
    //读取data.json,并利用返回数据来构造ul
    function getDataAndRender() {
        ajax('/data.json', function(resp) {
            oUl.innerHTML = '';
            var items = JSON.parse(resp);
            for (var i = items.length - 1; i >= 0; i--) {
                var li = document.createElement('li');
                li.innerHTML = '<p>姓名:<span class="name">' + items[i].name +
                    '</p><p></span> 性别:<span class="gender">' + items[i].gender +
                    '</p><p></span> 内容:<span class="about">' + items[i].about +
                    '</span></p><p>时间:' + dateFormat(items[i].date) + '</p>';
                oUl.appendChild(li);
            }
        })
    }

    function dateFormat(dateStr) {
        var date = new Date(dateStr);
        return DateToStr(date);
    }

    function getRadioValue(name) {
        var radios = document.getElementsByName(name);
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
            }
        }
        return false;
    }

    function genGetUrl(url, paraObj) {
        var paras = [];
        for (key in paraObj) {
            paras.push(encodeURIComponent(key) + '=' + encodeURIComponent(paraObj[key]));
        }
        return url + '?' + paras.join('&');
    }

    function DateToStr(date) {
        return date.getFullYear() + "年" +
            (date.getMonth() + 1) + '月' +
            date.getDate() + "日 " +
            toDouble(date.getHours()) + ':' +
            toDouble(date.getMinutes()) + ":" +
            toDouble(date.getSeconds());
    }

    function toDouble(num) {
        return num < 10 ? "0" + num : "" + num;
    }
};
