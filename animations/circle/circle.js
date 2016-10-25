window.onload = function() {
    var oBox = document.body.children[0];
    var str = '自古逢秋悲寂寥我言秋日胜春朝';
    createStrBalls(str);
    // var aSpan = document.getElementsByTagName('span');
    var aSpan = oBox.getElementsByTagName('span'),
        radius = oBox.offsetWidth / 2;
    for (var i = 0; i < aSpan.length; i++) {
        aSpan[i].degree = 0;

    }
    // moveOnCircle(aSpan[0], 270, {
    //     duration: 5000
    // });
    var isOpen = false;
    document.onclick = function() {
        for (i = 0; i < aSpan.length; i++) {

            moveOnCircle(aSpan[i], isOpen ? 0 : 360 / aSpan.length * i, {
                duration: 500
            });
        }
        isOpen = !isOpen;

    }



    function moveOnCircle(el, finalDegree, options) {
        var start = el.degree;
        var timePerFrame = 10;
        if (typeof options === 'undefined') {
            options = {};
        }
        // setDefault(options, {});
        // setDefault(options.duration, 300);
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

    function setDefault(para, defaultValue) {
        if (typeof para === 'undefined') {
            para = defaultValue;
        }
    }

    function createBalls(N) {
        for (var i = 0; i < N; i++) {
            var span = document.createElement('span');
            oBox.appendChild(span);
        }
    }

    function createStrBalls(str) {
        for (var i = 0; i < str.length; i++) {
            var span = document.createElement('span');
            span.innerHTML = str.charAt(i);
            oBox.appendChild(span);
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
