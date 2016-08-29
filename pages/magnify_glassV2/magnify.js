window.onload = windowLoad;

function windowLoad() {
    var smallBox = document.querySelector('.img-small'),
        bigBox = document.querySelector('.img-big'),
        smallImg = document.querySelector('.img-small img'),
        bigImg = document.querySelector('.img-big img'),
        mask = document.querySelector('.mask');
    // EventUtil.addEvent(smallImg, 'mouseover', overHandler);
    // EventUtil.addEvent(mask, 'mouseout', outHandler);
    // EventUtil.addEvent(mask, 'mousemove', moveHandler);
    // EventUtil.addEvent(mask, 'mouseover', function() {
    //     bigBox.style.display = 'block';
    // });
    // 

    //事件委托
    EventUtil.addEvent(smallBox, 'mouseover', overFunc);
    EventUtil.addEvent(smallBox, 'mousemove', moveFunc);
    EventUtil.addEvent(smallBox, 'mouseout', outFunc);

    function overFunc(event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        console.log('over ' + target.className);

        if (target === mask) {

        } else if (target === smallImg) {
            mask.style.display = 'block';
            bigBox.style.display = 'block';
            var rect = smallImg.getBoundingClientRect(),
                x = event.clientX - rect.left,
                y = event.clientY - rect.top,
                left = 0,
                top = 0,
                leftP = 0,
                topP = 0;
            left = Math.min(Math.max(x - mask.offsetWidth / 2, 0), smallImg.offsetWidth - mask.offsetWidth);
            top = Math.min(Math.max(y - mask.offsetHeight / 2, 0), smallImg.offsetHeight - mask.offsetHeight);
            mask.style.left = smallImg.offsetLeft + left + 'px';
            mask.style.top = smallImg.offsetTop + top + 'px';
            // moveHandler(event);


        } else if (target === smallBox) {

        }
    }

    function moveFunc(event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        console.log('move ' + target.className);

        if (target === mask || target === smallImg) {
            var rect = smallImg.getBoundingClientRect(),
                x = event.clientX - rect.left,
                y = event.clientY - rect.top,
                left = 0,
                top = 0,
                leftP = 0,
                topP = 0;
            left = Math.min(Math.max(x - mask.offsetWidth / 2, 0), smallImg.offsetWidth - mask.offsetWidth);
            top = Math.min(Math.max(y - mask.offsetHeight / 2, 0), smallImg.offsetHeight - mask.offsetHeight);
            mask.style.left = smallImg.offsetLeft + left + 'px';
            mask.style.top = smallImg.offsetTop + top + 'px';
            leftP = left / (smallImg.offsetWidth - mask.offsetWidth) * 100;
            topP = top / (smallImg.offsetHeight - mask.offsetHeight) * 100;
            bigImg.style.left = -1 * left * 10 + 'px';
            bigImg.style.top = -1 * top * 10 + 'px';

        } else if (target === smallBox) {

        }
    }

    function outFunc(event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        console.log('out ' + target.className);
        if (target === mask) {
            mask.style.display = 'none';
            bigBox.style.display = 'none';


        } else if (target === smallImg) {


        } else if (target === smallBox) {

        }
    }


    function moveHandler(event) {
        event = event || window.event;
        var rect = smallImg.getBoundingClientRect(),
            x = event.clientX - rect.left,
            y = event.clientY - rect.top,
            left = 0,
            top = 0,
            leftP = 0,
            topP = 0;
        left = Math.min(Math.max(x - mask.offsetWidth / 2, 0), smallImg.offsetWidth - mask.offsetWidth);
        top = Math.min(Math.max(y - mask.offsetHeight / 2, 0), smallImg.offsetHeight - mask.offsetHeight);
        mask.style.left = smallImg.offsetLeft + left + 'px';
        mask.style.top = smallImg.offsetTop + top + 'px';
        leftP = left / (smallImg.offsetWidth - mask.offsetWidth) * 100;
        topP = top / (smallImg.offsetHeight - mask.offsetHeight) * 100;
        bigImg.style.left = -1 * left * 10 + 'px';
        bigImg.style.top = -1 * top * 10 + 'px';
    }


    function overHandler(event) {
        mask.style.display = 'block';
        moveHandler(event);

        // bigBox.style.display = 'block';
    }

    function outHandler() {
        mask.style.display = 'none';
        bigBox.style.display = 'none';
    }

    function mousemoveImg(event) {
        event = event || window.event;
        var rect = smallBox.getBoundingClientRect(),
            x = event.clientX - rect.left,
            y = event.clientY - rect.top,
            left = 0,
            top = 0,
            leftPercent = 0,
            topPercent = 0;
        left = Math.min(Math.max(x - mask.offsetWidth / 2, 0), smallBox.offsetWidth - mask.offsetWidth);
        top = Math.min(Math.max(y - mask.offsetHeight / 2, 0), smallBox.offsetHeight - mask.offsetHeight);
        // leftPercent = left / (smallBox.offsetWidth - mask.offsetWidth) * 100;
        // topPercent = top / (smallBox.offsetHeight - mask.offsetHeight) * 100;
        mask.style.left = left + smallBox.offsetLeft + 'px';
        mask.style.top = top + smallBox.offsetTop + 'px';
        // bigBox.style.backgroundPosition = leftPercent + '% ' + topPercent + '%';
    }

    function mouseoverImg() {
        mask.style.display = 'block';
        bigBox.style.display = 'block';
    }

    function mouseoutImg() {
        mask.style.display = 'none';
        bigBox.style.display = 'none';

    }



}


var EventUtil = {
    'addEvent': function(elem, event, func) {
        return elem.attachEvent ? elem.attachEvent('on' + event, func) : elem.addEventListener(event, func, false);
    }
};
