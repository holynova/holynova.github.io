window.onload = function() {
    var oBox = document.querySelector('.box'),
        tar = null,
        downMouse = new Mouse(-1, -1),
        rect = new Rect(),
        minSize = 50;
    EventUtil.addHandler(oBox, 'mousedown', mouseDownHandler);

    function mouseDownHandler(event) {
        EventUtil.addHandler(document, 'mousemove', mouseMoveHandler);
        EventUtil.addHandler(document, 'mouseup', mouseUpHandler);
        event = EventUtil.getEvent(event);
        tar = EventUtil.getTarget(event);
        downMouse.x = event.clientX;
        downMouse.y = event.clientY;
        rect.top = oBox.offsetTop;
        rect.left = oBox.offsetLeft;
        rect.width = oBox.offsetWidth;
        rect.height = oBox.offsetHeight;
        EventUtil.preventDefault(event);
    }

    function showPosSize(elem) {
        function getInfoStr() {
            var infoObj = getAttributsObj(elem, ['offsetLeft', 'offsetTop', 'offsetWidth', 'offsetHeight']);
            var rect = elem.getBoundingClientRect();
            infoObj['boundingLeft'] = rect.left;
            infoObj['boundingTop'] = rect.top;
            infoObj['boundingWidth'] = rect.width;
            infoObj['boundingHeight'] = rect.height;
            infoObj['window.scrollX'] = window.scrollX;
            infoObj['window.scrollY'] = window.scrollY;
            return obj2str(infoObj);
        }

        function show(infoStr) {
            var infoBox = document.getElementById('info');
            infoBox.innerHTML = infoStr;
        }
        show(getInfoStr());
    }

    function showMousePos() {}

    function mouseMoveHandler(event) {
        event = EventUtil.getEvent(event);
        var diffX = event.clientX - downMouse.x,
            diffY = event.clientY - downMouse.y,
            curRect = new Rect();
        // console.log(Object.prototype.toString.call(tar));
        if (hasClass(tar, 'bar') || hasClass(tar, 'corner')) {
            if (hasClass(tar, 'left')) {
                curRect.width = Math.max(minSize, rect.width - diffX);
                if (curRect.width !== minSize) {
                    curRect.left = rect.left + diffX;
                }
            }
            if (hasClass(tar, 'right')) {
                curRect.width = Math.max(minSize, rect.width + diffX);
            }
            if (hasClass(tar, 'top')) {
                curRect.height = Math.max(minSize, rect.height - diffY);
                if (curRect.height !== minSize) {
                    curRect.top = rect.top + diffY;
                }
            }
            if (hasClass(tar, 'bottom')) {
                curRect.height = Math.max(minSize, rect.height + diffY);
            }
            curRect.set(oBox);
        } else if (hasClass(tar, 'box')) {
            curRect.left = rect.left + diffX;
            curRect.top = rect.top + diffY;
            curRect.set(oBox);
        }
        EventUtil.preventDefault(event);
        //2017年2月10日增加, 显示box的各种位置参数
        showPosSize(oBox);
    }

    function mouseUpHandler(event) {
        event = EventUtil.getEvent(event);
        tar = EventUtil.getTarget(event);
        EventUtil.remouseMoveHandler(document, 'mousemove', mouseMoveHandler);
        EventUtil.remouseMoveHandler(document, 'mouseup', mouseUpHandler);
        EventUtil.preventDefault(event);
    }
};
//矩形对象
var Rect = function(top, left, width, height) {
    this.top = typeof top !== 'undefined' ? top : 'default';
    this.left = typeof left !== 'undefined' ? left : 'default';
    this.width = typeof width !== 'undefined' ? width : 'default';
    this.height = typeof height !== 'undefined' ? height : 'default';
};
//设置元素为本矩形的形状和位置
Rect.prototype = {
    'set': function(event) {
        if (this.top !== "default") event.style.top = this.top + 'px';
        if (this.left !== "default") event.style.left = this.left + 'px';
        if (this.width !== "default") event.style.width = this.width + 'px';
        if (this.height !== "default") event.style.height = this.height + 'px';
    }
};
//记录鼠标坐标的对象
var Mouse = function(x, y) {
    this.x = x;
    this.y = y;
};

function hasClass(elem, className) {
    var exp = new RegExp('(^| )' + className + "( |$)", 'gi');
    return exp.test(elem.className);
}
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
    remouseMoveHandler: function(element, type, handler) {
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
