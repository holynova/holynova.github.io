window.onload = function() {
    var oUl = document.getElementsByTagName('ul')[0];
    var aLi = oUl.getElementsByTagName('li');

    for (var i = 0; i < aLi.length; i++) {
        aLi[i].style.left = 50 * i + "px";
        aLi[i].myIndex = i;
        aLi[i].addEventListener('mouseover', hoverHandler, false);

    }

    function hoverHandler(event) {
        var curIndex = this.myIndex;
        for (var i = 0; i < aLi.length; i++) {
            if (i <= curIndex) {
                animate(aLi[i], {
                    left: i * 50
                });
            } else {
                animate(aLi[i], {
                    left: ((i - 1) * 50 + 512)
                });

            }
        }
    }

}
