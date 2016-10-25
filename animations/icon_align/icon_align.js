window.onload = function() {
    var oWrapper = document.body.children[0];
    var oUl = oWrapper.getElementsByTagName('ul')[0];
    var aLi = oUl.children;
    var aImg = oUl.getElementsByTagName('img');
    var oBtn = oWrapper.getElementsByTagName('input')[0];
    console.log('ready');
    //转换为定位的布局
    var arrPos = toAbsolute();
    console.log(arrPos);

    function toAbsolute() {
        var aPos = [];
        for (var i = 0; i < aLi.length; i++) {
            var pos = {};
            pos.left = getPos(aLi[i]).left - getPos(oUl).left;
            pos.top = getPos(aLi[i]).top - getPos(oUl).top;
            aPos.push(pos);
        }

        for (var i = 0; i < aLi.length; i++) {
            setStyle(aLi[i], {
                position: 'absolute',
                left: aPos[i].left + 'px',
                top: aPos[i].top + 'px',
            });
            aLi[i].myIndex = i;
            // setStyle(aLi[i], aPos[i]);
        }
        return aPos;
    }

    // setInterval(function() {
    //     for (var i = 0; i < aLi.length; i++) {
    //         aLi[i].innerHTML = aLi[i].myIndex;
    //     }
    // }, 100, false);

    oBtn.onclick = function() {

        arrPos.sort(function() {
            return Math.random() - 0.5;
        });

        for (var i = 0; i < aLi.length; i++) {
            animate(aLi[i], arrPos[aLi[i].myIndex]);
        }
    };
    //拖拽动作
    for (var i = 0; i < aLi.length; i++) {
        aLi[i].onmousedown = function(ev) {
            // console.log('down');
            var oEvent = ev || event;
            var curIcon = this;
            var x = oEvent.clientX,
                y = oEvent.clientY,
                left = parseInt(this.style.left),
                top = parseInt(this.style.top),
                oNearest = null;
            // console.log('down:%d', curIcon.myIndex);
            // console.log('down:x = %d,y = %d, left = %d, top = %d', x, y, left, top);
            curIcon.style.zIndex = 20;

            document.onmousemove = function(ev) {
                // console.log('move');

                var oEvent = ev || event;
                setStyle(curIcon, {
                    left: (left + oEvent.clientX - x) + "px",
                    top: (top + oEvent.clientY - y) + 'px'
                });

                for (var i = 0; i < aLi.length; i++) {
                    aLi[i].style.border = '1px dashed #26292C';
                    // aLi[i].style.border = '1px solid red';

                }
                oNearest = findNearest(curIcon);
                if (oNearest) {
                    oNearest.style.border = '1px dashed #ccc';
                    // console.log('Near %d', oNearest.myIndex);
                }

                return false;
            };
            document.onmouseup = function() {
                // console.log('up');

                // var minDisIndex = findNearest(curIcon);
                // var oNearest = findNearest(curIcon);
                if (!oNearest) {
                    animate(curIcon, arrPos[curIcon.myIndex]);
                } else {
                    // console.log('minDisIndex = %d', minDisIndex);
                    oNearest.style.border = '1px solid #26292C';
                    var temp = curIcon.myIndex;
                    animate(curIcon, arrPos[oNearest.myIndex]);
                    animate(oNearest, arrPos[curIcon.myIndex]);

                    curIcon.myIndex = oNearest.myIndex;
                    oNearest.myIndex = temp;

                }
                document.onmousemove = null;
                document.onmouseup = null;
                curIcon.style.zIndex = 10;
                curIcon = null;

            };

        }
    }
    //找到最近的元素,但必须距离到小于thereshold才换位置
    function findNearest(curEl, threshold) {
        if (typeof threshold === 'undefined') {
            threshold = aLi[0].offsetWidth / 2;
        }
        var minDis = 999999;
        var minDisIndex = -1;
        var dis;
        for (var i = 0; i < aLi.length; i++) {

            if (curEl.myIndex == aLi[i].myIndex) {
                // aLi[i].innerHTML = 'cur';
                continue;
            } else {
                if (isCover(curEl, aLi[i])) {
                    dis = disBetween(curEl, aLi[i]);
                    // aLi[i].innerHTML = dis.toFixed(1);
                    if (dis < minDis && dis < threshold) {
                        minDis = dis;
                        minDisIndex = i;
                    }
                }
            }
        }
        if (minDisIndex == -1) {
            //没有碰撞的
            return null;
        } else {
            return aLi[minDisIndex];
        }
    }

    //找到两个icon之间的距离
    //距离最小, 且小于
    function disBetween(el1, el2) {
        var pos1 = getPos(el1);
        var pos2 = getPos(el2);
        return Math.sqrt((pos1.left - pos2.left) * (pos1.left - pos2.left) + (pos1.top - pos2.top) * (pos1.top - pos2.top))
    }
    //碰撞检测
    function isCover(el1, el2) {
        var r1 = getRect(el1),
            r2 = getRect(el2);
        if (r1.right < r2.left || r1.left > r2.right || r1.top > r2.bottom || r1.bottom < r2.top) {
            return false;
        } else {
            return true;
        }
    }

    function setStyle(el, json) {
        for (var key in json) {
            el.style[key] = json[key];
        }
    }

    function getPos(el) {
        var pos = {};
        pos.left = 0;
        pos.top = 0;
        while (el) {
            pos.left += el.offsetLeft;
            pos.top += el.offsetTop;
            el = el.offsetParent;
        }
        return pos;
    }

    function getRect(el) {
        var rect = {};
        var pos = getPos(el);
        rect.left = pos.left;
        rect.top = pos.top;
        rect.right = pos.left + el.offsetWidth;
        rect.bottom = pos.top + el.offsetHeight;
        return rect;

    }

};
