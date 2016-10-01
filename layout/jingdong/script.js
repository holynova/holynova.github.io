var gData = {
    city: "北京",
    datas: [{
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
    }]
}
window.onload = function() {
    var oTabCity = document.querySelectorAll('.login-bar ul>li')[0];
    unitTest();
    // flexTabEvent('city', oTabCity);

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

    //轮播图组件(类)
    //parent父元素,必须有固定的宽高
    //datas 数据数组
    //每个data有
    //data.imageURL
    //data.herf
    //
    function Slide(parent, datas) {
        this.parent = parent;
        this.width = parent.offsetWidth;
        this.height = parent.offsetHeight;
        this.datas = datas;
        this.nowIndex = 0;
        this.id = new Date().getTime();

        var that = this;
        this.init = function() {
            // creat
            that.create();
            setInterval(function() {
                var oPrev = parent.querySelector('span.prev'),
                    oNext = parent.querySelector('span.next'),
                    aBtn = parent.querySelectorAll('ol li'),
                    aLi = parent.querySelectorAll('ul li'),
                    oOl = parent.querySelector('ol');

                //添加自定义属性
                for (var i = 0; i < aBtn.length; i++) {
                    aBtn[i].myIndex = i;
                }

                //绑定事件
                that.bindEvent();

                //启动轮播定时器
                parent.timer = null;
                clearInterval(parent.timer);
                parent.timer = setInterval(function() {
                    that.nowIndex = (that.nowIndex + 1) % aBtn.length;
                    that.toPage(that.nowIndex);
                }, 3000);
            }, 300);
            // EventUtil.addHandler(that.parent, 'load', function() {
            //     alert('loaded');
            //     var oPrev = parent.querySelector('span.prev'),
            //         oNext = parent.querySelector('span.next'),
            //         aBtn = parent.querySelectorAll('ol li'),
            //         aLi = parent.querySelectorAll('ul li'),
            //         oOl = parent.querySelector('ol');

            //     //添加自定义属性
            //     for (var i = 0; i < aBtn.length; i++) {
            //         aBtn[i].myIndex = i;
            //     }

            //     //绑定事件
            //     that.bindEvent();

            //     //启动轮播定时器
            //     parent.timer = null;
            //     clearInterval(parent.timer);
            //     parent.timer = setInterval(function() {
            //         that.nowIndex = (that.nowIndex + 1) % aBtn.length;
            //         that.toPage(that.nowIndex);
            //     }, 3000);
            // });

            // //等待渲染完成
            // that.parent.onload() = function() {

            // };

        }
        this.create = function() {
            //生成固定部分html代码
            //设定好active
            //按数据格式加入li
            //渲染
            var ulItems = '',
                olItems = '';
            for (var i = 0; i < that.datas.length; i++) {
                var data = that.datas[i];
                var active = i === 0 ? ' class = "active"' : '';
                ulItems += '<li' + active + '><a href="' + data.href + '" title=""><img src="' + data.imgURL + '" alt=""></a></li>';
                olItems += '<li' + active + '>' + (i + 1) + '</li>';
            }
            var html = '<ul>' + ulItems + '</ul><ol>' + olItems +
                '</ol><span class="prev">&lt</span><span class="next">&gt</span>';
            that.parent.innerHTML = html;

        }

        this.toPage = function(n) {
            for (var i = 0; i < aBtn.length; i++) {
                removeClass(aBtn[i], 'active');
                removeClass(aLi[i], 'active');
            }
            addClass(aBtn[n], 'active');
            addClass(aLi[n], 'active');

        }
        this.bindEvent = function() {
            var maxIndex = aBtn.length - 1;
            EventUtil.addHandler(oPrev, 'click', function() {
                that.nowIndex--;
                if (that.nowIndex < 0) {
                    that.nowIndex = maxIndex;
                }
                that.toPage(that.nowIndex);
            });
            EventUtil.addHandler(oNext, 'click', function() {
                that.nowIndex++;
                if (that.nowIndex > maxIndex) {
                    that.nowIndex = 0;
                }
                that.toPage(that.nowIndex);

            });
            EventUtil.addHandler(oOl, 'mouseover', function(event) {
                event = EventUtil.getEvent(event);
                var target = EventUtil.getTarget(event);
                if (target.tagName.toUpperCase() === 'LI') {
                    that.toPage(target.myIndex);
                }
            });

        };
    }

    // Slide.prototype = {
    //     init: function() {

    //     }
    // };

    function unitTest() {
        var s = new Slide(document.querySelector('.slide#slide1'), gData.datas);
        s.init();
    }

};
