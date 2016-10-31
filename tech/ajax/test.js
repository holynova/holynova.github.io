window.onload = function() {
    var oUl = document.getElementById('list'),
        oBtn = document.getElementById('btn');
    oBtn.addEventListener('click', clickHandler, false);

    function clickHandler() {
        var responseText = ajax('/tech/ajax/data/weibo.json' + "?t=" + Math.random(), show, showError);

        function show(res) {
            // console.log(res);
            console.log(JSON.parse(res));
        }

        function showError(status) {
            console.log('ajax error:' + status);
        }
    }
};
