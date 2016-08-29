window.onload = windowLoad;

function windowLoad() {
    var imgSmall = document.querySelector('.img-small'),
        imgBig = document.querySelector('.img-big'),
        mask = document.querySelector('.mask');
    EventUtil.addEvent(imgSmall, 'mousemove', mousemoveImg);
    EventUtil.addEvent(imgSmall, 'mouseover', mouseoverImg);
    EventUtil.addEvent(imgSmall, 'mouseout', mouseoutImg);

    function mousemoveImg(event) {
        event = event || window.event;
        var rect = imgSmall.getBoundingClientRect(),
            x = event.clientX - rect.left,
            y = event.clientY - rect.top,
            left = 0,
            top = 0,
            leftPercent = 0,
            topPercent = 0;
        left = Math.min(Math.max(x - mask.offsetWidth / 2, 0), imgSmall.offsetWidth - mask.offsetWidth);
        top = Math.min(Math.max(y - mask.offsetHeight / 2, 0), imgSmall.offsetHeight - mask.offsetHeight);
        leftPercent = left / (imgSmall.offsetWidth - mask.offsetWidth) * 100;
        topPercent = top / (imgSmall.offsetHeight - mask.offsetHeight) * 100;
        mask.style.left = left + 'px';
        mask.style.top = top + 'px';
        imgBig.style.backgroundPosition = leftPercent + '% ' + topPercent + '%';
    }

    function mouseoverImg() {
        mask.style.display = 'block';
        imgBig.style.display = 'block';
    }

    function mouseoutImg() {
        mask.style.display = 'none';
        imgBig.style.display = 'none';

    }



}


var EventUtil = {
    'addEvent': function(elem, event, func) {
        return elem.attachEvent ? elem.attachEvent('on' + event, func) : elem.addEventListener(event, func, false);
    }
};
