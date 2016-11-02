window.onload = function() {
    var oUl = document.getElementById('list'),
        oBtn = document.getElementById('btn');
    oBtn.addEventListener('click', clickHandler, false);

    function clickHandler() {
        var responseText = ajax('./data/test.json' + "?t=" + Math.random(), responseHandler, showError);

        function responseHandler(res) {
            // console.log(res);
            // console.log(JSON.parse(res));
            var data = JSON.parse(res);
            for (var i = 0; i < 10; i++) {
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
