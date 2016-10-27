window.onload = function() {
    var aBox = document.querySelectorAll('.box');
    for (var i = 0; i < aBox.length; i++) {
        aBox[i].dataIndex = i;
        EventUtil.addHandler(aBox[i], 'touchstart', touchStartHandler);
    }
    // function touchHandler(event) {
    //     event = EventUtil.getEvent(event);
    //     var target = EventUtil.getTarget(event);
    //     console.log(event.type + " " + target.dataIndex);
    //     if (event.type === 'touchemove') {
    //         target.style.left = +'px';
    //     } else if (event.type == 'touchstart') {
    //         console.log('touchstart at (%d,%d)', event.touches[0].clientX, event.touches[0].clientY);
    //         // console.log(event.touches);
    //     }
    // }
    var startPos = {},
        startPoint = {},
        movePoint = {};

    function touchStartHandler(event) {
        // var startPos = {},
        //     startPoint = {},
        //     movePoint = {};
        EventUtil.preventDefault(event);
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        // console.log('start' + target.dataIndex);
        // var rect = target.getBoundingClientRect();
        startPos.left = target.offsetLeft;
        startPos.top = target.offsetTop;
        startPoint.x = event.touches[0].clientX;
        startPoint.y = event.touches[0].clientY;
        // console.log('touchstart at (%d,%d)', event.touches[0].clientX, event.touches[0].clientY);
        // console.log(startPos);
        EventUtil.addHandler(target, 'touchend', touchEndHandler);
        EventUtil.addHandler(target, 'touchmove', touchMoveHandler);
    }

    function touchEndHandler(event) {
        EventUtil.preventDefault(event);
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        // console.log('end' + target.dataIndex);
        EventUtil.removeHandler(target, 'touchend', touchEndHandler);
        EventUtil.removeHandler(target, 'touchmove', touchMoveHandler);
    }

    function touchMoveHandler(event) {
        EventUtil.preventDefault(event);
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        // console.log('move' + target.dataIndex + " (" + event.touches[0].clientX + "," + event.touches[0].clientY + ")");
        target.style.left = (event.touches[0].clientX - startPoint.x) + startPos.left + 'px';
        target.style.top = (event.touches[0].clientY - startPoint.y) + startPos.top + 'px';
    }
}
