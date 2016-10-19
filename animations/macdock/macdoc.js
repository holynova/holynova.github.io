window.onload = function() {

    var aInput = document.getElementsByTagName('input');
    var aImg = document.getElementsByTagName('img');
    document.onmousemove = function(event) {
        for (var i = 0; i < aImg.length; i++) {
            var dis = 0;
            var rect = aImg[i].getBoundingClientRect();
            var a = event.clientX - (rect.left + rect.width / 2);
            var b = event.clientY - (rect.top + rect.height / 2);
            dis = Math.sqrt(a * a + b * b);
            var r = 1 - dis / 300;
            if (r < 0.3) {
                r = 0.3;
            } else if (r > 1) {
                r = 1;
            }
            aInput[i].value = r.toFixed(2);
            aImg[i].style.width = r * 128 + "px";
        }
    };
};
