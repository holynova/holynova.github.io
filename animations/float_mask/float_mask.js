window.onload = function() {
    var oWrapper = document.body.children[0],
        oUl = oWrapper.children[0],
        aLi = oUl.children,
        aSpan = oUl.getElementsByTagName('span');
    for (var i = 0; i < aLi.length; i++) {
        aLi[i].myIndex = i;
        aLi[i].addEventListener('mouseenter', moveHandler, false);
        aLi[i].addEventListener('mouseleave', moveHandler, false);
    }

    function moveHandler(event) {
        var dir = getDir(this, event.clientX, event.clientY);
        var data = {
            'up': 12,
            'down': 6,
            'left': 9,
            'right': 3
        };

        var span = aSpan[this.myIndex];
        if (event.type == 'mouseenter') {
            setClockPos(span, data[dir]);
            setClockPos(span, 0, true, {
                duration: 400
            });

        } else if (event.type == 'mouseleave') {
            setClockPos(span, data[dir], true, {
                duration: 400
            });
        }
    }

    function getDir(el, x, y) {
        var rect = el.getBoundingClientRect(),
            a = x - (rect.left + rect.width / 2),
            b = y - (rect.top + rect.height / 2),
            angle = Math.atan2(b, a) * (180 / Math.PI) + 180,
            dir = null;
        if (angle >= 45 && angle < 135) {
            dir = 'up';
        } else if (angle >= 135 && angle < 225) {
            dir = 'right';
        } else if (angle >= 225 && angle < 315) {
            dir = 'down';
        } else if ((angle >= 315 && angle <= 360) || (angle >= 0 && angle < 45)) {
            dir = 'left';
        }
        return dir;
    }

    //按时钟方向设置位置
    //12,3,6,9
    //0为9宫格中间的位置
    //animated = true,是用动画
    function setClockPos(el, clock, animated, animateOption) {
        var l = aLi[0].offsetWidth;
        var data = {
            0: {
                left: 0,
                top: 0
            },
            3: {
                left: l,
                top: 0
            },
            6: {
                left: 0,
                top: l
            },
            9: {
                left: -l,
                top: 0
            },
            12: {
                left: 0,
                top: -l
            }
        };
        if (typeof animated == 'undefind') {
            animated = false;
        }
        if (typeof animateOption === 'undefind') {
            animateOption = {};
        }
        if (animated) {
            animate(el, data[clock], animateOption);
        } else {
            el.style.left = data[clock].left + 'px';
            el.style.top = data[clock].top + 'px';
        }
    }

};
