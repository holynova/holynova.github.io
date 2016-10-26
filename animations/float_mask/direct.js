window.onload = function() {

    var oWrapper = document.querySelector('.wrapper');
    var oBox = document.querySelector('.box');

    oBox.addEventListener('mouseover', function(event) {
        var str = 'x = ' + event.clientX + ', y = ' + event.clientY;
        var dir = getDir(oBox, event.clientX, event.clientY);
        oBox.innerHTML = 'in ' + dir + ' ' + str;
    }, false);

    oBox.addEventListener('mouseout', function(event) {
        var dir = getDir(oBox, event.clientX, event.clientY);
        var str = 'x = ' + event.clientX + ', y = ' + event.clientY;

        oBox.innerHTML = 'out ' + dir + ' ' + str;
    }, false)

    function getDir(el, x, y) {
        var rect = el.getBoundingClientRect(),
            a = x - (rect.left + rect.width / 2),
            b = y - (rect.top + rect.height / 2),
            angle = Math.atan2(b, a) * (180 / Math.PI) + 180,
            dir = null;
        if (angle >= 45 && angle < 135) {
            dir = 'up';
        } else if (angle >= 135 && angle < 225) {
            dir = 'right';
        } else if (angle >= 225 && angle < 315) {
            dir = 'down';
        } else if ((angle >= 315 && angle <= 360) || (angle >= 0 && angle < 45)) {
            dir = 'left';
        }
        return dir;
    }
    console.log(oBox.getBoundingClientRect());
};
