window.onload = function() {
    var oBox = document.querySelector('.box'),
        oUl = oBox.querySelector('ul'),
        oOl = oBox.querySelector('ol'),
        aImgs = oUl.querySelectorAll('img'),
        aBtn = oOl.querySelectorAll('li');

    oUl.style.width = aImgs[0].offsetWidth * aImgs.length + 'px';
    for (var i = 0; i < aBtn.length; i++) {
        // aBtn[i].index = i;
        (function(index) {
            EventUtil.addHandler(aBtn[index], 'mouseover', function(event) {
                event = EventUtil.getEvent(event);
                var target = EventUtil.getTarget(event);
                animate(oUl, {
                    marginLeft: -aImgs[0].offsetWidth * index
                }, {
                    duration: 500
                })
                for (var j = 0; j < aBtn.length; j++) {
                    aBtn[j].className = '';
                }
                target.className = 'active';

            });
        })(i);
        // EventUtil.addHandler(aBtn[i], 'mouseover', function(event) {
        //     event = EventUtil.getEvent(event);
        //     var target = EventUtil.getTarget(event);
        //     animate(oUl, {
        //         marginLeft: -aImgs[0].offsetWidth * target.index
        //     }, {
        //         duration: 1000
        //     })
        //     for (var j = 0; j < aBtn.length; j++) {
        //         aBtn[j].className = '';
        //     }
        //     target.className = 'active';

        // });

        // aBtn[i].onclick = function() {
        //         oUl.style.marginLeft = -aImgs[0].offsetWidth * this.index + 'px';
        //     }

        // aBtn[i].addEventListener('click',,false);
    }

    // EventUtil.addHandler(oOl, 'click', btnClick);

    // function btnClick(event) {
    //     event = EventUtil.getEvent(event);
    //     var target = EventUtil.getTarget(event);
    //     if (target.tagName.toLowerCase() === 'li') {

    //     }
    // }
}
