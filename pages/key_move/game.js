window.onload = function() {
    EventUtil.addEvent(document, 'keydown', getKeyState);
    EventUtil.addEvent(document, 'keyup', getKeyState);
    var keys = {};
    var bgH = 0,
        bgV = 0,
        role = document.getElementById('role'),
        left = 0,
        top = 0,
        picTimer = null,
        keyTimer = null,
        keyTimer = setInterval(move, 80);

    function getKeyState(event) {
        event = event || window.event;
        if (event.type === 'keydown') {
            keys[event.key] = true;
        } else if (event.type === 'keyup') {
            keys[event.key] = false;
        }
    }

    function move() {
        clearInterval(picTimer);
        var stepLen = 15,
            animateInterval = 1;
        if (keys['ArrowDown']) {
            top = Math.min(top + stepLen, role.parentNode.offsetHeight - role.offsetHeight);
            picTimer = setInterval(step('down'), animateInterval);
        }
        if (keys['ArrowUp']) {
            top = Math.max(0, top - stepLen);
            picTimer = setInterval(step('up'), animateInterval);

        }
        if (keys['ArrowLeft']) {
            left = Math.max(0, left - stepLen);
            picTimer = setInterval(step('left'), animateInterval);
        }
        if (keys['ArrowRight']) {
            left = Math.min(left + stepLen, role.parentNode.offsetWidth - role.offsetWidth);
            picTimer = setInterval(step('right'), animateInterval);
        }
        role.style.left = left + "px";
        role.style.top = top + 'px';
        return false;
    }

    function step(dirction) {
        var dic = {
            'down': 0,
            'up': 3,
            'left': 1,
            'right': 2
        };
        bgV = dic[dirction];
        bgH = (bgH + 1) % 4;
        role.style.backgroundPosition = bgH * -83 + "px " + bgV * -63 + 'px';

    }
};
var EventUtil = {
    'addEvent': function(elem, event, func) {
        elem.attachEvent ? elem.attachEvent('on' + event, func) : elem.addEventListener(event, func, false);
    },
    'removeEvent': function(elem, event, func) {
        elem.detachEvent ? elem.detachEvent('on' + event, func) : elem.removeEventListener(event, func);

    }
};
