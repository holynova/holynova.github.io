window.onload = windowLoad;

function windowLoad() {
    var iconDatas = initData(20),
        originX = 0,
        originY = 0,
        originLeft = 0,
        originTop = 0,
        curIcon = null;
    initPage(iconDatas);
    var icons = document.querySelectorAll('span.icon');
    for (var i = 0; i < icons.length; i++) {
        EventUtil.addEvent(icons[i], 'mousedown', downHandler);

    }

    function downHandler(event) {
        curIcon = this;
        originX = event.clientX;
        originY = event.clientY;
        originLeft = parseFloat(window.getComputedStyle(this).left);
        originTop = parseFloat(window.getComputedStyle(this).top);
        EventUtil.addEvent(document, 'mousemove', moveHandler);
        EventUtil.addEvent(document, 'mouseup', upHandler);
        this.style.zIndex = 100;

    }

    function moveHandler(event) {
        var deltaX = event.clientX - originX,
            deltaY = event.clientY - originY;

        curIcon.style.left = originLeft + deltaX + 'px';
        curIcon.style.top = originTop + deltaY + 'px';
        event.preventDefault();
    }

    function upHandler(event) {
        curIcon.style.zIndex = 10;
        EventUtil.removeEvent(document, 'mousemove', moveHandler);
        EventUtil.removeEvent(document, 'mouseup', upHandler);

    }
}

function initData(N) {
    var iconDatas = [];
    for (var i = 0; i < N; i++) {
        var iconData = {};
        iconData.bgPos = i < 10 ? (-50 * i) + 'px 0' : (-50 * (i - 10)) + 'px -50px';
        iconData.bgImgSrc = 'img/sprite.png';
        iconData.row = Math.floor(i / 4);
        iconData.col = i % 4;
        iconData.left = 10 + iconData.col * 80;
        iconData.top = 10 + iconData.row * 80;
        iconDatas.push(iconData);
    }
    return iconDatas;
}

function initPage(datas) {
    var colLeft = document.querySelector('.col-left');
    for (var i = 0; i < datas.length; i++) {
        var span = document.createElement('span');
        span.className = 'icon';

        span.style.backgroundImage = 'url(' + datas[i].bgImgSrc + ')';
        span.style.backgroundPosition = datas[i].bgPos;
        span.style.left = datas[i].left + 'px';
        span.style.top = datas[i].top + 'px';

        colLeft.appendChild(span);
    }
}

var EventUtil = {
    'addEvent': function(elem, event, func) {
        elem.attachEvent ? elem.attachEvent('on' + event, func) : elem.addEventListener(event, func, false);
    },
    'removeEvent': function(elem, event, func) {
        elem.detachEvent ? elem.detachEvent('on' + event, func) : elem.removeEventListener(event, func);
    }
};
