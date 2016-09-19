window.onload = function() {
    var oWrapper = document.querySelector('.wrapper'),
        oBoxes = document.querySelectorAll('.box');
    EventUtil.addHandler(oWrapper, 'mouseover', move);
    EventUtil.addHandler(oWrapper, 'mouseout', move);

    function move(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        if (target.className === 'box') {
            if (event.type === 'mouseover') {
                animate(target, {
                    width: 800,
                    // height: 100
                }, {
                    duration: 300,
                    easing: 'slowdown'
                })
            } else if (event.type === 'mouseout') {
                animate(target, {
                    width: 50,
                }, {
                    duration: 300,
                    easing: 'speedup'
                })
            }
        }
    }
};
//动画函数
//参数el element
//参数styles 动画参数对象,比如{width:500,left:300}
//para:options 对象比如{duration:300,easing:xx,callback:foo}
//duration动画持续时间:default:400ms;
//easing:动画方式:swing,linear,
function animate(el, styles, options) {
    clearInterval(el.timer);
    for (var key in styles) {
        styles['start' + key] = parseFloat(getStyle(el, key));
    }
    if (typeof options.duration === 'undefined') {
        options.duration = 300;
    }
    if (typeof options.easing === 'undefined') {
        options.easing = 'linear';
    }
    var timePerFrame = 20.0,
        numOfFrames = Math.floor(options.duration / timePerFrame + 0.5),
        ratio = 0.0,
        cntFrame = 1;
    el.timer = null;
    el.timer = setInterval(function() {
        if (options.easing === 'linear') {
            r = cntFrame / numOfFrames * 1.0;
        } else if (options.easing === 'speedup') {
            r = cntFrame / numOfFrames * 1.0;
            r = r * r;
        } else if (options.easing === 'slowdown') {
            r = cntFrame / numOfFrames * 1.0;
            r = Math.sqrt(r);
        }
        for (key in styles) {
            el.style[key] = styles['start' + key] + r * (styles[key] - styles['start' + key]) + 'px';
        }
        cntFrame++;
        if (cntFrame > numOfFrames) {
            clearInterval(el.timer);
            if (typeof options.callback !== 'undefined') {
                options.callback();
            }
        }
    }, timePerFrame);

}
//兼容IE的获得样式的函数(只读)
function getStyle(element, style) {
    return (element.currentStyle || getComputedStyle(element))[style];
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
