window.onload = function() {
    var oUl = document.getElementById('list'),
        oBtn = document.getElementById('btn');
    oBtn.addEventListener('click', clickHandler, false);

    function clickHandler() {
        var settings = {
            url: './data/test.json',
            method: 'get',
            data: {
                //url中加入一个随机的t,是为了清除缓存
                t: Math.random()
            },
            success: responseHandler,
            error: showError,
            timeout: 5000,
            // timeoutFunc:function(){}
        }
        var settings2 = {
            url: 'https://andruxnet-random-famous-quotes.p.mashape.com/',
            method: 'post',
            header: {
                "X-Mashape-Key": "v35G9babWmmshnKXNbMYsqlPGg95p1hPxSTjsn5wmwCePeO3NC",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            success: function(responseText) {
                console.log(responseText);
            },
            error: showError,
            timeout: 20000,
        }
        var responseText = ajax(settings);

        function responseHandler(res) {
            // console.log(res);
            // console.log(JSON.parse(res));
            var data = JSON.parse(res);
            for (var i = 0; i < 5; i++) {
                var li = document.createElement('li');
                var d = data[i];
                li.innerHTML = '<img src="' + d.picture + '" alt=""><div class="info"><div class="name">' + d.name.first + ' ' + d.name.last + '</div><div class="about">' + d.about + '</div><div class="company">' + d.company + '</div><div class="reg-time">' + d.registered + '</div></div>';
                oUl.appendChild(li);
            }
        }

        function showError(status) {
            console.log('ajax error:' + status);
        }
    }
};
