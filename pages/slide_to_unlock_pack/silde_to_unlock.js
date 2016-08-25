window.onload = windowLoadHandler;

function windowLoadHandler() {
    var wrapper = document.querySelector('.wrapper'),
        lis = document.querySelectorAll('.wrapper ul li'),
        datas = [];
    var s = new Slide({
            parent: lis[0],
            width: 300,
            height: 50,
            // color: '#E18BE8'
        }),
        s1 = new Slide({
            parent: lis[1],
            width: 500,
            height: 50,
            // color: '#E18BE8'
        }),
        s2 = new Slide({
            parent: lis[2],
            width: 500,
            height: 100,
            // color: '#E18BE8'
        });

}

// 定义滑动条类
// 传入一个对象args
// keys of args:
// parent,width,height,color
function Slide(args) {
    for (var key in args) {
        this[key] = args[key];
    }
    this.init();
}
Slide.prototype = {
    init: function() {
        this.creat();
        this.getDOM();
        this.setStyle();
        this.drag();
    },
    creat: function() {
        var slide = document.createElement('div'),
            html = '<div class="bg"></div><div class="progress"><span>滑动验证</span></div><div class="handle">>></div>';
        slide.innerHTML = html;
        slide.className = 'slide';
        this.parent.appendChild(slide);
    },
    setStyle: function() {
        this.getDOM()
            // this.bg.style.width = '100px';
        console.log(this.width + " " + this.height);
        this.bg.style.width = this.width + 'px';
        this.bg.style.height = this.height + 'px';
        this.progress.style.height = this.height - 2 + 'px';
        this.progress.style.backgroundColor = this.color;

        this.handle.style.width = Math.floor(this.width / 10) + "px";
        this.handle.style.height = this.height - 2 + 'px';
        this.handle.style.lineHeight = this.height - 2 + 'px';

        var span = this.progress.querySelector('span');
        span.style.width = this.width + 'px';
        span.style.lineHeight = this.height - 2 + 'px';


    },
    getDOM: function() {
        this.slide = this.parent.querySelector('.slide');
        this.bg = this.slide.querySelector('.bg');
        this.progress = this.slide.querySelector('.progress');
        this.handle = this.slide.querySelector('.handle');
    },
    drag: function() {
        var that = this,
            offsetLeft = 0,
            mouseX = 0,
            startX = 0,
            bgWidth = this.bg.offsetWidth,
            handleWidth = this.handle.offsetWidth,
            max = offsetLeft + bgWidth - handleWidth,
            isMousedown = false,
            isSuccess = false;
        console.log('bgWidth' + bgWidth + ' handleWidth' + handleWidth);

        EventUtil.addEvent(document, 'mouseup', up);
        EventUtil.addEvent(document, 'mousemove', move);
        EventUtil.addEvent(that.handle, 'mousedown', down);


        function down(event) {
            if (!isSuccess) {
                isMousedown = true;
                startX = event.clientX;

            }
        }

        function up(event) {
            isMousedown = false;
            if (!isSuccess) {
                that.handle.style.left = 0;
                that.progress.style.width = 0;
            }
        }

        function move(event) {
            if (isMousedown) {
                mouseX = event.clientX;
                console.log('startX = ' + startX + ' mouseX= ' + mouseX + ' max = ' + max);
                var x = Math.max(0, offsetLeft + mouseX - startX);
                if (x >= max) {
                    x = max;
                    that.progress.classList.add('success');
                    that.handle.classList.add('success');
                    that.handle.innerHTML = '';
                    that.progress.querySelector('span').innerHTML = '通过验证';
                    up();
                    isSuccess = true;
                }
                that.progress.style.width = (x - offsetLeft) + 'px';
                that.handle.style.left = x + 'px';

            }
        }
    }
};

var EventUtil = {
    addEvent: function(elem, event, func) {
        return elem.attachEvent ? elem.attachEvent('on' + event, func) : elem.addEventListener(event, func, false);
    },
    removeEvent: function(elem, event) {
        return elem.detachEvent ? elem.detachEvent('on' + event, func) : elem.removeEventListener(event, func);
    }

};
