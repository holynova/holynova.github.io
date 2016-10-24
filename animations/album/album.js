window.onload = function() {
    var oBox = document.getElementById('box'),
        oUl = oBox.children[0],
        aLi = oUl.children,
        aImg = oUl.getElementsByTagName('img'),
        aSpan = oUl.getElementsByTagName('span');

    changeSize();

    oUl.onmousedown = function(ev) {
        // console.log('down');

        var oEvent = ev || event,
            x = oEvent.clientX,
            left = oUl.offsetLeft;
        document.onmousemove = function(ev) {
            var oEvent = ev || event;

            changeSize();
            oUl.style.left = oEvent.clientX - x + left + 'px';
            // return false;
        }
        document.onmouseup = function() {
            // console.log('up');

            document.onmousemove = null;
            document.onmouseup = null;
        }
        return false;
    };

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
