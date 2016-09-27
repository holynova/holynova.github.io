//动画函数
//el:要变化的元素
//styles:要变化的sytle,JSON格式
//options:选项JSON格式,包括.FPS,duration,easing,callback等参数
function animate(el, styles, options) {
    clearInterval(el.timer);
    var styleOrigins = {},
        // startTime = Date.now();
        startTime = new Date().getTime();
    el.timer = null;
    for (var key in styles) {
        if (key.toLowerCase().indexOf('color') !== -1) {
            styleOrigins[key] = getStyle(el, key);
        } else {
            styleOrigins[key] = parseFloat(getStyle(el, key));
        }
    }
    if (typeof options === "undefined") {
        options = {};
    }
    if (typeof options.duration === 'undefined') {
        options.duration = 300;
    }
    if (typeof options.easing === 'undefined') {
        options.easing = 'slowdown';
    }
    if (typeof options.FPS === 'undefined') {
        options.FPS = 30;
    }

    var interval = Math.floor(1000 / options.FPS + 0.5);
    el.timer = setInterval(frame, interval);

    //走一帧
    function frame() {
        var per = getEasingPer(startTime, options.duration, options.easing);
        // var per = 1;
        // console.log(per.toFixed(2));

        for (var key in styles) {
            if (key.toLowerCase().indexOf('color') !== -1) {
                var originColor = getRGB(styleOrigins[key]),
                    finalColor = getRGB(styles[key]);
                el.style[key] = RGB2hex(
                    originColor.r + parseInt(per * (finalColor.r - originColor.r)),
                    originColor.g + parseInt(per * (finalColor.g - originColor.g)),
                    originColor.b + parseInt(per * (finalColor.b - originColor.b))
                );

            } else if (key == 'opacity') {
                el.style[key] = styleOrigins[key] + per * (styles[key] - styleOrigins[key]);
            } else {
                el.style[key] = styleOrigins[key] + per * (styles[key] - styleOrigins[key]) + 'px';
            }

        }
        if (per == 1) {
            clearInterval(el.timer);
            if (typeof options.callback != 'undefined') {
                options.callback();
            }
        }
    }
    //根据运动函数,获取动画进展的比例
    function getEasingPer(startTime, duration, easing) {
        var t = Date.now() - startTime + 0.0,
            per = 0.0;
        if (t > duration) {
            per = 1.0;
            // per = t / duration;
        } else {
            if (easing === 'linear') {
                per = t / duration;
            } else if (easing === 'speedup') {
                per = Math.pow((t / duration), 3);

            } else if (easing === 'slowdown') {
                per = Math.sqrt(t / duration);
            }
        }
        return per;
    }

    //#号开头的6位16进制颜色转成rgb
    function hex2RGB(hexColor) {
        var color = {};
        if (hexColor[0] !== '#' || hexColor.length !== 7) {
            console.log('颜色错误:' + hexColor);
            return false;
        } else {
            color.r = parseInt(hexColor.substring(1, 3), 16);
            color.g = parseInt(hexColor.substring(3, 5), 16);
            color.b = parseInt(hexColor.substring(5, 7), 16);
            return color;
        }

    }

    function RGB2hex(r, g, b) {
        r = r.toString(16);
        if (r.length < 2) {
            r = '0' + r;
        }
        g = g.toString(16);
        if (g.length < 2) {
            g = '0' + g;
        }

        b = b.toString(16);
        if (b.length < 2) {
            b = '0' + b;
        }

        return '#' + r + g + b;
    }

    function getRGB(colorStr) {
        // if (colorStr.indexOf('rgb') !== -1) {
        if (colorStr[0] === 'r') {
            var color = {};
            var arr = colorStr.replace(/rgb|\(|\)|\s/g, '').split(',');
            color.r = parseInt(arr[0]);
            color.g = parseInt(arr[1]);
            color.b = parseInt(arr[2]);
            return color;

        } else if (colorStr[0] === '#') {
            return hex2RGB(colorStr);
        }
    }

    function getStyle(element, style) {
        return (element.currentStyle || getComputedStyle(element))[style];
    }

}
