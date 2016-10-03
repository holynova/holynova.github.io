//轮播图组件(类)
//parent父元素,必须有固定的宽高
//datas 数据数组
//每个data有
//data.imageURL
//data.herf
//
function Slide(parent, datas) {
    this.parent = parent;
    // this.width = parent.offsetWidth;
    // this.height = parent.offsetHeight;

    this.datas = datas;
    this.nowIndex = 0;
    this.id = new Date().getTime();
    this.parent.timer = null;

    var that = this;
    this.init = function() {
        console.log(that.parent);
        // creat
        that.create();

        that.oPrev = parent.querySelector('span.prev');
        that.oNext = parent.querySelector('span.next');
        that.aBtn = parent.querySelectorAll('ol li');
        that.aLi = parent.querySelectorAll('ul li');
        that.oOl = parent.querySelector('ol');

        //添加自定义属性
        for (var i = 0; i < that.aBtn.length; i++) {
            that.aBtn[i].myIndex = i;
        }

        //绑定事件
        that.bindEvent();
        that.setTimer(3000);

    };
    this.setTimer = function(interval) {
        //启动轮播定时器
        // that.parent.timer = null;
        clearInterval(that.parent.timer);
        that.parent.timer = setInterval(function() {
            that.nowIndex = (that.nowIndex + 1) % that.aBtn.length;
            that.toPage(that.nowIndex);
        }, interval);
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
            '</ol><span class="prev"><</span><span class="next">></span>';
        that.parent.innerHTML = html;

    };

    this.toPage = function(n) {
        for (var i = 0; i < that.aBtn.length; i++) {
            removeClass(that.aBtn[i], 'active');
            removeClass(that.aLi[i], 'active');
        }
        addClass(that.aBtn[n], 'active');
        addClass(that.aLi[n], 'active');

    };
    this.bindEvent = function() {
        var maxIndex = that.aBtn.length - 1;
        EventUtil.addHandler(that.oPrev, 'click', function() {
            that.nowIndex--;
            if (that.nowIndex < 0) {
                that.nowIndex = maxIndex;
            }
            that.toPage(that.nowIndex);
            that.setTimer(3000);
        });
        EventUtil.addHandler(that.oNext, 'click', function() {
            that.nowIndex++;
            if (that.nowIndex > maxIndex) {
                that.nowIndex = 0;
            }
            that.toPage(that.nowIndex);
            that.setTimer(3000);

        });
        EventUtil.addHandler(that.oOl, 'mouseover', function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            if (target.tagName.toUpperCase() === 'LI') {
                that.toPage(target.myIndex);
                that.nowIndex = target.myIndex;
                that.setTimer(3000);
            }
        });

    };
}
