window.onload = function() {
    var oCircle = document.getElementById('circle'),
        oBtn = document.getElementById('btn'),
        oBtnMove = document.getElementById('btn2'),
        oInput = document.getElementById('input'),
        radius = oCircle.offsetWidth / 2;
    init();

    function init() {
        var str = '没有人是一座孤岛';
        createStrBalls(str);
        moveBalls('open');
    }
    oBtn.onclick = function(ev) {
        moveBalls('close');
        setTimeout(function() {
            createStrBalls(oInput.value);
        }, 550, false);
        setTimeout(function() {
            moveBalls('open');;
        }, 1100, false);
    };
    oBtnMove.onclick = function() {
        moveBalls('toggle');
    }
    var isOpen = true;

    function moveBalls(mode) {
        var aSpan = oCircle.children;
        if (typeof mode === 'undefined') {
            mode = 'toggle';
        }
        var degree = 0;
        switch (mode) {
            case 'open':
                if (!isOpen) {
                    for (var i = 0; i < aSpan.length; i++) {
                        moveOnCircle(aSpan[i], 360 / aSpan.length * i, {
                            duration: 500
                        });
                    }
                    isOpen = true;
                }
                break;
            case 'close':
                if (isOpen) {
                    for (var i = 0; i < aSpan.length; i++) {
                        moveOnCircle(aSpan[i], 0, {
                            duration: 500
                        });
                    }
                    isOpen = false;
                }
                break;
            case 'toggle':
                for (var i = 0; i < aSpan.length; i++) {
                    moveOnCircle(aSpan[i], isOpen ? 0 : 360 / aSpan.length * i, {
                        duration: 500
                    });
                }
                isOpen = !isOpen;
                break;
        }
    }

    function moveOnCircle(el, finalDegree, options) {
        var start = el.degree;
        var timePerFrame = 10;
        if (typeof options === 'undefined') {
            options = {};
        }
        if (typeof options.duration === 'undefined') {
            options.duration = 500
        }
        var cntFrame = 0,
            maxFrame = Math.floor(options.duration / timePerFrame);
        clearInterval(el.timer);
        el.timer = setInterval(function() {
            cntFrame++;
            var ratio = 1.0 * cntFrame / maxFrame;
            ratio = Math.cbrt(ratio);
            curDegree = start + ratio * (finalDegree - start);
            setPos(el, getPos(radius, curDegree));
            el.degree = curDegree;
            if (cntFrame === maxFrame) {
                clearInterval(el.timer);
            }
        }, timePerFrame, false);
    }

    function createBalls(N) {
        oCircle.innerHTML = "";
        for (var i = 0; i < N; i++) {
            var span = document.createElement('span');
            span.degree = 0;
            oCircle.appendChild(span);
        }
    }

    function createStrBalls(str) {
        oCircle.innerHTML = "";
        for (var i = 0; i < str.length; i++) {
            var span = document.createElement('span');
            span.innerHTML = str.charAt(i);
            span.degree = 0;
            oCircle.appendChild(span);
        }
    }

    function getPos(radius, degree) {
        var pos = {};
        pos.left = radius + radius * Math.sin(degreeToRad(degree));
        pos.top = radius * (1 - Math.cos(degreeToRad(degree)));
        return pos;
    }

    function setPos(el, pos) {
        el.style.left = pos.left + 'px';
        el.style.top = pos.top + 'px';
    }

    function degreeToRad(degree) {
        return degree / 180 * Math.PI;
    }
}
