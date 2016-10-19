window.onload = function() {
    var oWrapper = document.body.children[0];
    var oUl = oWrapper.getElementsByTagName('ul')[0];
    var aLi = oUl.children;
    var aImg = oUl.getElementsByTagName('img');
    console.log('ready');
    //转换为定位的布局
    var arrPos = toAbsolute();

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




    //拖拽动作
    for (var i = 0; i < aLi.length; i++) {
        // EventUtil.addHandler(aLi[i], 'mousedown', mousedownHandler);
        aLi[i].onmousedown = function(ev) {
            var oEvent = ev || event;
            var curIcon = this;
            var x = oEvent.clientX,
                y = oEvent.clientY,
                left = parseInt(this.style.left),
                top = parseInt(this.style.top);
            console.log('down:%d', curIcon.myIndex);
            // console.log('down:x = %d,y = %d, left = %d, top = %d', x, y, left, top);
            curIcon.style.zIndex = 20;

            document.onmousemove = function(ev) {
                var oEvent = ev || event;
                setStyle(curIcon, {
                    left: (left + oEvent.clientX - x) + "px",
                    top: (top + oEvent.clientY - y) + 'px'
                });

                var minDis = 99999;
                var minDisIndex = -1;
                for (var i = 0; i < aLi.length; i++) {
                    // console.log('%d vs %d =%s', curIcon.myIndex, aLi[i].myIndex, isCover(curIcon, aLi[i]))
                    aLi[i].style.border = '1px solid #26292C';
                    if (aLi[i] == curIcon) {
                        continue;
                    }
                    if (isCover(curIcon, aLi[i])) {
                        var dis = disBetween(curIcon, aLi[i]);
                        if (dis < minDis) {
                            minDis = dis;
                            minDisIndex = aLi[i].myIndex;
                            // aLi[i].style.border = '1px dashed #ccc';
                        }
                    }
                    // else {
                    //     aLi[i].style.border = '1px solid #26292C';

                    // }

                }
                if (minDis != 99999) {
                    aLi[minDisIndex].style.border = '1px dashed #ccc';

                }
                document.onmouseup = function() {
                    // setStyle(curIcon,"")
                    if (minDis == 99999) {
                        animate(curIcon, arrPos[curIcon.myIndex]);
                    } else {
                        //换位置
                        var temp = curIcon.myIndex;
                        curIcon.myIndex = aLi[minDisIndex].myIndex;
                        aLi[minDisIndex].myIndex = temp;

                        animate(curIcon, arrPos[curIcon.myIndex]);
                        animate(aLi[minDisIndex], arrPos[aLi[minDisIndex].myIndex]);

                    }



                    document.onmousemove = null;
                    document.onmouseup = null;
                    curIcon.style.zIndex = 10;

                };


                return false;
            };

        }
    }

    // function mousedownHandler(event) {
    //     console.log('down');
    //     EventUtil.addHandler(document, 'mousemove', mousemoveHandler);
    //     return false;
    // }

    // function mousemoveHandler(event) {
    //     console.log('move');
    //     event = EventUtil.getEvent(event);
    //     var target = EventUtil.getTarget(event);
    //     target.style.zIndex = 20;
    //     for (var i = 0; i < aLi.length; i++) {
    //         if (aLi[i] == target) {
    //             continue;
    //         } else {
    //             if (isCover(target, aLi[i])) {
    //                 aLi[i].style.border = '1px dashed #ccc';
    //             } else {
    //                 aLi[i].style.border = '1px solid #26292C';


    //             }
    //         }
    //     }
    //     EventUtil.addHandler(document, 'mouseup', mouesupHandler);

    // }

    // function mouesupHandler(event) {
    //     console.log('up');
    //     EventUtil.removeHandler(document, 'mousemove', mousemoveHandler);
    //     EventUtil.removeHandler(document, 'mouseup', mouseupHandler);
    // }

    // EventUtil.addHandler(oUl, 'mousedown', mousedownHandler);

    // function mousedownHandler(event) {
    //     event = EventUtil.getEvent(event);
    //     var target = EventUtil.getTarget(event);
    //     if (target.tagName.toUpperCase() == 'IMG' || 　target.tagName.toUpperCase() == 'LI') {
    //         setStyle(target, {
    //             border: "1px dashed #ccc"
    //         });
    //     }
    // }

    //找到两个icon之间的距离
    //距离最小, 且小于
    function disBetween(el1, el2) {
        var pos1 = getPos(el1);
        var pos2 = getPos(el2);
        return Math.sqrt((pos1.left - pos2.left) * (pos1.left - pos2.left), (pos1.top - pos2.top) * (pos1.top - pos2.top))
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
