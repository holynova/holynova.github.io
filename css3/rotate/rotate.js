window.onload = function() {
    var oBox = document.getElementById('box');
    var rect = oBox.getBoundingClientRect();
    var x = rect.left,
        y = rect.top,
        centerX = rect.left + rect.width / 2,
        centerY = rect.top + rect.height / 2;
    document.addEventListener('mousemove', handleMouseMove, false);
    oBox.style.boxShadow = '0 0 15px rgba(0,0,0,0.25)';

    function handleMouseMove(ev) {
        var oEvent = ev || event;
        var mX = event.clientX,
            mY = event.clientY;
        var percentX = (mX - centerX) / centerX;
        var percentY = (mY - centerY) / centerY;
        var base = 10;
        oBox.style.transform = 'rotateX(' + base * -percentY + 'deg)' + 'rotateY(' + base * percentX + 'deg)'
            // if (mX >= rect.left && mX <= rect.right && mY >= rect.top && mY <= rect.bottom) {
            //     // console.log(mX, mY);
            //     // oBox.style.transform = 'rotateY(' + base * percentY + 'deg)'
            //     console.log('rotateX(' + base * percentX + 'deg)', 'rotateY(' + base * percentY + 'deg)');
            // } else {
            //     oBox.style.boxShadow = 'none';
            // }
    }
}
