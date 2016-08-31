window.onload = windowLoad;
// function windowLoad1() {
//     var box = document.querySelector('.box'),
//         datas = [{
//             parent: box,
//             smallPicSrc: "img/s2.jpg",
//             bigPicSrc: "img/b2.b1.jpg",
//             size: '420px',
//             ratio: 5,
//             direct: 'h'
//         }]
// }
// /*
// 接口:
// 输入数据:
// parent 父元素
// smallPicSrc
// bigPicSrc
// size小图框宽度和高度
// ratio倍数
// direct:图片方向
// -h:宽大于高
// -v:高大于宽
// 根据图片尺寸修改css
//  */
// //放大镜类dd
// function MagnifyingGlass(data) {
//     this.id = new Date().getTime();
//     for (var key in data) {
//         this[key] = data[key];
//     }
// }
// MagnifyingGlass.prototype = {
//     creat: function() {
//         // var img = document.createElement('img');
//         var smallBox = document.createElement('div'),
//             bigBox = document.createElement('div');
//         smallBox.style.border = '1px solid #ccc';
//         bigBox.style.border = '1px solid #ccc';
//         if (this.direct === 'v') {
//         } else if (this.direct === 'h') {
//         }
//     }
// }
function windowLoad() {
    var smallBox = document.querySelector('.img-small'),
        bigBox = document.querySelector('.img-big'),
        smallImg = document.querySelector('.img-small img'),
        bigImg = document.querySelector('.img-big img'),
        mask = document.querySelector('.mask'),
        inputText = document.querySelector('input[type = "text"]'),
        btn = document.querySelector('input[type = "button"]'),
        radios = document.querySelectorAll('input[name = "pic-radio"]'),
        // radios = document.querySelector('input[name = "pic-radio"]'),
        ratio = 10;
    changeRatio();
    //事件委托
    EventUtil.addEvent(smallBox, 'mouseover', overFunc);
    EventUtil.addEvent(smallBox, 'mousemove', moveFunc);
    EventUtil.addEvent(smallBox, 'mouseout', outFunc);
    EventUtil.addEvent(btn, 'click', changeRatio);
    EventUtil.addEvent(smallImg, 'load', changeRatio);
    for (var i = 0; i < radios.length; i++) {
        EventUtil.addEvent(radios[i], 'change', changePic);
    }

    function changePic(event) {
        event = event || window.event;
        var tar = event.target || event.srcElement;
        smallImg.src = 'img/s' + tar.value + '.jpg';
        bigImg.src = 'img/b' + tar.value + '.jpg';
        // changeRatio();
        console.log('radio = ' + event.target.value);
    }

    function changeRatio() {
        ratio = Math.min(Math.max(0, parseFloat(inputText.value)), 50);
        mask.style.height = smallImg.offsetHeight / ratio + 'px';
        mask.style.width = smallImg.offsetWidth / ratio + 'px';
        bigImg.style.height = ratio * smallImg.offsetHeight + 'px';
        bigBox.style.width = smallBox.offsetHeight * smallImg.offsetWidth / smallImg.offsetHeight + 'px';
    }

    function overFunc(event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        // console.log('over ' + target.className);
        if (target === mask) {} else if (target === smallImg) {
            mask.style.display = 'block';
            bigBox.style.display = 'block';
            var rect = smallImg.getBoundingClientRect(),
                x = event.clientX - rect.left,
                y = event.clientY - rect.top,
                left = 0,
                top = 0,
                leftP = 0,
                topP = 0;
            left = Math.min(Math.max(x - mask.offsetWidth / 2, 0), smallImg.offsetWidth - mask.offsetWidth);
            top = Math.min(Math.max(y - mask.offsetHeight / 2, 0), smallImg.offsetHeight - mask.offsetHeight);
            mask.style.left = smallImg.offsetLeft + left + 'px';
            mask.style.top = smallImg.offsetTop + top + 'px';
            // moveHandler(event);
        } else if (target === smallBox) {}
    }

    function moveFunc(event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        // console.log('move ' + target.className);
        if (target === mask || target === smallImg) {
            var rect = smallImg.getBoundingClientRect(),
                x = event.clientX - rect.left,
                y = event.clientY - rect.top,
                left = 0,
                top = 0,
                leftP = 0,
                topP = 0;
            left = Math.min(Math.max(x - mask.offsetWidth / 2, 0), smallImg.offsetWidth - mask.offsetWidth);
            top = Math.min(Math.max(y - mask.offsetHeight / 2, 0), smallImg.offsetHeight - mask.offsetHeight);
            mask.style.left = smallImg.offsetLeft + left + 'px';
            mask.style.top = smallImg.offsetTop + top + 'px';
            leftP = left / (smallImg.offsetWidth - mask.offsetWidth) * 100;
            topP = top / (smallImg.offsetHeight - mask.offsetHeight) * 100;
            bigImg.style.left = -1 * left * ratio + 'px';
            bigImg.style.top = -1 * top * ratio + 'px';
        } else if (target === smallBox) {}
    }

    function outFunc(event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        // console.log('out ' + target.className);
        if (target === mask) {
            mask.style.display = 'none';
            bigBox.style.display = 'none';
        } else if (target === smallImg) {} else if (target === smallBox) {}
    }
}
var EventUtil = {
    'addEvent': function(elem, event, func) {
        return elem.attachEvent ? elem.attachEvent('on' + event, func) : elem.addEventListener(event, func, false);
    }
};
