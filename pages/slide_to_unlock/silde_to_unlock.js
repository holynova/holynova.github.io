window.onload = windowLoadHandler;

function windowLoadHandler() {
    var oSlot = document.querySelector('.slot'),
        oBlock = document.querySelector('.block'),
        oProgress = document.querySelector('.progress'),
        flagMousedown = false,
        slotRect = oSlot.getBoundingClientRect(),
        mouseStart = 0,
        flagSuccess = false;
    // EventUtil.addEvent(oBlock, 'mousedown', dragHandler);
    EventUtil.addEvent(window, 'mousemove', dragHandler);
    EventUtil.addEvent(oBlock, 'mousedown', getMouseState);
    EventUtil.addEvent(window, 'mouseup', getMouseState);

    function dragHandler(event) {
        // alert(1);
        event = event || window.event;
        // event.clientX
        if (flagMousedown && !flagSuccess) {
            var iLeft = event.clientX - mouseStart > 0 ? event.clientX - mouseStart : 0;
            if (iLeft >= oSlot.offsetWidth - oBlock.offsetWidth) {
                console.log('unlocked');
                iLeft = oSlot.offsetWidth - oBlock.offsetWidth;
                oProgress.style.color = '#fff';
                oProgress.querySelector('span').innerHTML = '验证成功';
                flagSuccess = true;
                oBlock.style.background = '#fff url("img/ok.png") no-repeat 50% 50%';
                oBlock.innerHTML = '';
                oProgress.classList.add('success');
            }
            var sLeft = iLeft === 0 ? 0 : iLeft + 'px';
            oBlock.style.left = sLeft;
            oProgress.style.width = sLeft;
        }

    }

    function getMouseState(event) {
        event = event || window.event;
        if (!flagSuccess) {
            if (event.type === 'mousedown') {
                flagMousedown = true;
                mouseStart = event.clientX;

            } else if (event.type === 'mouseup') {
                flagMousedown = false;
                oBlock.style.left = 0;
                oProgress.style.width = 0;
            }
        }
    }
}


var EventUtil = {
    'addEvent': function(elem, event, func) {
        return elem.attachEvent ? elem.attachEvent('on' + event, func) : elem.addEventListener(event, func, false);
    }
};
