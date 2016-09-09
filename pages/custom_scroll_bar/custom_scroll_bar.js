window.onload = function() {
    var oBox = document.querySelector('.box'),
        oHandle = document.querySelector('.scroll-bar.handle'),
        oSlot = document.querySelector('.scroll-bar.slot'),
        oContent = document.querySelector('.content'),
        downX = -1,
        downY = -1,
        handleTop = 0;
    initHandle();
    EventUtil.addHandler(oHandle, 'mousedown', downHandler);

    EventUtil.addHandler(oSlot, 'click', slotClick);
    EventUtil.addHandler(document, 'mousewheel', scrollHandler);
    //for firefox mousewheel event
    EventUtil.addHandler(document, 'DOMMouseScroll', scrollHandler);

    function scrollHandler(e) {
        e = e || event;
        var wheelDelta = EventUtil.getWheelDelta(e);
        var handleRect = oHandle.getBoundingClientRect(),
            moveStep = oHandle.offsetHeight / 10;
        handleTop = oHandle.offsetTop;
        move(handleTop, wheelDelta > 0 ? -moveStep : moveStep);
    }

    function slotClick(e) {
        e = event || e;
        var handleRect = oHandle.getBoundingClientRect(),
            moveStep = oHandle.offsetHeight;
        handleTop = oHandle.offsetTop;
        if (e.clientY < handleRect.top) {
            move(handleTop, -moveStep);
        } else if (e.clientY > handleRect.top + oHandle.offsetHeight) {
            move(handleTop, moveStep);
        }
    }

    function initHandle() {
        var per = 1.0 * oBox.offsetHeight / oContent.offsetHeight;
        oHandle.style.height = Math.floor(per * oBox.offsetHeight) + 'px';
    }

    function downHandler(e) {
        e = e || event;
        downX = e.clientX;
        downY = e.clientY;
        handleTop = oHandle.offsetTop;
        EventUtil.addHandler(document, 'mousemove', moveHandler);
        EventUtil.addHandler(document, 'mouseup', upHandler);

    }

    function moveHandler(e) {
        e = e || event;
        var diffY = e.clientY - downY;
        move(handleTop, diffY)
        return false;
    }

    function upHandler(e) {
        // e = e || event;
        // console.log('mouseup');
        EventUtil.removeHandler(document, 'mousemove', moveHandler);
        EventUtil.removeHandler(document, 'mouseup', upHandler);
    }

    //函数功能:滚动条滑块和内容移动
    //参数 originHandleTop:移动之前滑块的顶端位置(top)
    //参数 moveY:滑块移动的距离,可以为负数
    function move(originHandleTop, moveY) {
        // var diffY = e.clientY - downY,
        var top = Math.min(Math.max(0, originHandleTop + moveY), oBox.offsetHeight - oHandle.offsetHeight),
            ratio = 1.0 * top / (oBox.offsetHeight - oHandle.offsetHeight),
            contentTop = (oContent.offsetHeight - oBox.offsetHeight) * ratio;
        oHandle.style.top = top + "px";
        oContent.style.top = -contentTop + 'px';
        EventUtil.addHandler(document, 'mouseup', upHandler);
    }
};
//兼容IE的通用事件处理对象
EventUtil = {
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.detachEvent('on' + type, handler);
        } else {
            element['on' + type] = null;
        }
    },
    getWheelDelta: function(event) {
        if (event.wheelDelta) {
            return event.wheelDelta;
        } else {
            //for firefox
            return event.detail * -40;
        }
    },
    getEvent: function(event) {
        return event ? event : window.event;
    },
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
};
