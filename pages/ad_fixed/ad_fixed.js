window.onload = windowLoad;

function windowLoad() {

    // console.log('ie6:' + isIE(6) + '\n' + 'ie7:' + isIE(7) + '\n' + 'ie8:' + isIE(8) + '\n' + 'ie9:' + isIE(9) + '\n' + 'ie:' + isIE());
    if (isIE() && !isIE(7) && !isIE(8) && !isIE(9)) {
        EventUtil.addEvent(window, 'resize', showAd);
        EventUtil.addEvent(window, 'scroll', showAd);
    }

}

function isIE(ver) {
    var b = document.createElement('b');
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
    return b.getElementsByTagName('i').length === 1;
}

function showAd() {
    // var ads = document.querySelectorAll('.ad'),
    var ads = document.getElementsByTagName('div'),
        scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
        browserHeight = window.innerHeight || document.body.clientHeight || document.documentElement.scrollTop,
        adHeight = ads[1].offsetHeight,
        top;
    top = parseInt(scrollTop + browserHeight / 2 - adHeight / 2);
    console.log(top)
    for (var i = 1; i < ads.length; i++) {
        ads[i].style.top = top + "px";
        // console.log(ads[i].style.top);
    }




}

var EventUtil = {
    addEvent: function(elem, event, func) {
        return elem.attachEvent ? elem.attachEvent('on' + event, func) : elem.addEventListener(event, func, false);
    },
    removeEvent: function(elem, event) {
        return elem.detachEvent ? elem.detachEvent('on' + event, func) : elem.removeEventListener(event, func);
    }

};
