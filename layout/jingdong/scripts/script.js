var gData = {
    city: "北京",
    slides: [
        [{
            href: '#',
            imgURL: 'imgs/slide0.jpg'
        }, {
            href: '#',
            imgURL: 'imgs/slide1.jpg'
        }, {
            href: '#',
            imgURL: 'imgs/slide2.jpg'
        }, {
            href: '#',
            imgURL: 'imgs/slide3.jpg'
        }],
    ]
}
window.onload = function() {
    var oTabCity = document.querySelectorAll('.login-bar ul>li')[0];
    // unitTest();
    flexTabEvent('city', oTabCity);
    var slide1 = new Slide(document.querySelector('.entrance .content .slide'), gData.slides[0]);
    slide1.init();

    // var s2 = new Slide(document.querySelector('.slide#slide2'), gData.slides[0]);
    // s1.init();

    //伸缩标签的事件处理通用程序
    //参数 key:这个标签对应的json中的key
    //参数 oLi:标签的li元素
    // 标签有统一的结构
    // ul
    // |-li
    // |  |-a
    // |  |-table
    function flexTabEvent(key, oLi) {
        var oTag = oLi.querySelector('a'),
            oTable = oLi.querySelector('table'),
            aTd = oTable.querySelectorAll('td');
        EventUtil.addHandler(oLi, 'mouseenter', function() {
            oTable.style.display = 'block';
        });

        EventUtil.addHandler(oLi, 'click', function(event) {
            // oTable.style.display = 'block';
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            if (target.tagName.toUpperCase() == 'TD') {
                for (var i = 0; i < aTd.length; i++) {
                    // aTd[i].className = '';
                    removeClass(aTd[i], 'active');
                }
                // target.className = 'active';
                addClass(target, 'active');
                gData[key] = target.innerHTML;
                oTag.innerHTML = '送至：' + target.innerHTML;
                oTable.style.display = 'none';
            }
        });

        EventUtil.addHandler(oLi, 'mouseleave', function() {
            oTable.style.display = 'none';
        });

    }

    // Slide.prototype = {
    //     init: function() {

    //     }
    // };

    function unitTest() {
        var s1 = new Slide(document.querySelector('.slide#slide1'), gData.slides[0]);
        var s2 = new Slide(document.querySelector('.slide#slide2'), gData.slides[0]);
        s1.init();
        s2.init();
    }

};
