window.onload = function() {
    var oText = document.getElementsByTagName('textarea')[0],
        charNum = document.getElementsByTagName('span')[0];
    init();
    oText.addEventListener('input', inputHandler, false);

    function init() {
        // CookieUtil.del('weibo');
        var weibo = CookieUtil.get('weibo');
        if (weibo) {
            oText.value = weibo;
        }
        showCharNum();
        oText.focus();
    }

    function inputHandler(event) {
        var expires = new Date();
        // expires = expires.setDate(expires.getDate() + 3);
        CookieUtil.set('weibo', oText.value);
        showCharNum();
        // charNum.innerHTML = 140 - oText.length
    }

    function showCharNum() {
        charNum.innerHTML = oText.value.length;
    }
}
