window.onload = function() {
    var oBox = document.getElementById('box'),
        oUl = oBox.children[0],
        aLi = oUl.children,
        aImg = oUl.getElementsByTagName('img'),
        aSpan = oUl.getElementsByTagName('span');
    changeSize();
    oUl.onmousedown = function(ev) {
        var oEvent = ev || event,
            x = oEvent.clientX,
            left = oUl.offsetLeft;
        document.onmousemove = function(ev) {
            var oEvent = ev || event;
            changeSize();
            oUl.style.left = oEvent.clientX - x + left + 'px';
        }
        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        }
        return false;
    };
    EventUtil.addHandler(oUl, 'touchstart', touchstartHandler);

    function touchstartHandler(event) {
        event = EventUtil.getEvent(event);
        // console.log(event);
        EventUtil.preventDefault(event);
        var target = EventUtil.getTarget(event);
        var pos = {};
        pos.left = oUl.offsetLeft;
        // pos.top = oUl.offsetTop;
        pos.x = event.touches[0].clientX;
        // pos.y = event.touches[0].clientY;
        EventUtil.addHandler(oUl, 'touchmove', touchMoveHandler);
        EventUtil.addHandler(oUl, 'touchend', touchEndHandler);

        function touchMoveHandler(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            EventUtil.preventDefault(event);
            changeSize();
            oUl.style.left = event.touches[0].clientX - pos.x + pos.left + 'px';
        }

        function touchEndHandler(event) {
            event = EventUtil.getEvent(event);
            EventUtil.preventDefault(event);
            var target = EventUtil.getTarget(event);
            EventUtil.removeHandler(oUl, 'touchmove', touchMoveHandler);
            EventUtil.removeHandler(oUl, 'touchend', touchEndHandler);
        }
    }

    function changeSize() {
        for (var i = 0; i < aLi.length; i++) {
            var ratio = getRatio(aLi[i]);
            aSpan[i].innerHTML = ratio.toFixed(2);
            aImg[i].style.width = ratio * 150 * 2 + 'px';
            aImg[i].style.marginLeft = -ratio * 150 * 1 / 2 + 'px';
            aImg[i].style.marginTop = -ratio * 150 * 1 / 2 + 'px';
            aLi[i].style.zIndex = ratio.toFixed(2) * 100;
        }
    }

    function getDisToCenter(el) {
        var center = oBox.offsetWidth / 2,
            elCenter = oUl.offsetLeft + el.offsetLeft + el.offsetWidth / 2;
        return Math.abs(center - elCenter);
    }

    function getRatio(el) {
        return Math.max(Math.min(1 - getDisToCenter(el) / 1000, 1), 0.5);
    }
};
