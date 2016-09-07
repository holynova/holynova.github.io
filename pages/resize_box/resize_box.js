window.onload = function() {
    var oBox = document.querySelector('.box'),
        tar = null,
        downMouse = new Mouse(-1, -1),
        rect = new Rect(),
        minSize = 50;
    EventUtil.addEvent(oBox, 'mousedown', downHandler);

    function downHandler(e) {
        EventUtil.addEvent(document, 'mousemove', moveHandler);
        EventUtil.addEvent(document, 'mouseup', upHandler);
        e = e || event;
        tar = e.target || e.srcElement,
            downMouse.x = e.clientX,
            downMouse.y = e.clientY;
        rect.top = oBox.offsetTop;
        rect.left = oBox.offsetLeft;
        rect.width = oBox.offsetWidth;
        rect.height = oBox.offsetHeight;
        // e.preventDefault();
        return false;

    }

    function moveHandler(e) {
        e = e || event;
        var diffX = e.clientX - downMouse.x,
            diffY = e.clientY - downMouse.y,
            curRect = new Rect();
        // console.log(tar.className);
        // e.stopPropagation();
        console.log(Object.prototype.toString.call(tar));
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
        // e.preventDefault();
        return false;

    }

    function upHandler(e) {
        e = e || event;
        console.log('up');
        EventUtil.removeEvent(document, 'mousemove', moveHandler);
        EventUtil.removeEvent(document, 'mouseup', upHandler);
        // e.preventDefault();
        return false;

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
    'set': function(el) {
        if (this.top !== "default") el.style.top = this.top + 'px';
        if (this.left !== "default") el.style.left = this.left + 'px';
        if (this.width !== "default") el.style.width = this.width + 'px';
        if (this.height !== "default") el.style.height = this.height + 'px';
    }
};
//记录鼠标坐标的对象
var Mouse = function(x, y) {
    this.x = x;
    this.y = y;
};

//兼容IE的通用事件处理对象
EventUtil = {
    addEvent: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    },
    removeEvent: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.detachEvent('on' + type, handler);
        } else {
            element['on' + type] = null;
        }
    }
};

function hasClass(el, className) {
    // if (el.classList) {
    //     return el.contains(className);
    // } else {
    //     var exp = new RegExp('(^| )' + className + "( |$)", 'gi');
    //     return exp.test(el.className);
    // }

    var exp = new RegExp('(^| )' + className + "( |$)", 'gi');
    return exp.test(el.className);

}
