window.onload = function() {

    //拆分
    var oWrapper = document.getElementsByTagName('div')[0],
        colNum = 20,
        rowNum = 15,
        htmlStr = '';
    //初始化

    //生成span,设置span属性
    for (var i = 0; i < rowNum * colNum; i++) {
        htmlStr += "<span></span>";
    }
    oWrapper.innerHTML = htmlStr;

    var aSpan = oWrapper.children,
        spanWidth = oWrapper.offsetWidth / colNum,
        spanHeight = oWrapper.offsetHeight / rowNum;
    for (var row = 0; row < rowNum; row++) {
        for (var col = 0; col < colNum; col++) {
            var span = aSpan[row * colNum + col];
            span.style.width = spanWidth + 'px';
            span.style.height = spanHeight + 'px';
            span.row = row;
            span.col = col;
            span.style.background = 'url(img/5.jpg) -' + spanWidth * col + 'px -' + spanHeight * row + 'px';
            span.style.backgroundSize = 100 * colNum + '% ' + 100 * rowNum + '%';

        }
    }

    //改变img 启动动画
    function toPage(num, mode) {
        for (var i = 0; i < rowNum * colNum; i++) {
            aSpan[i].style.opacity = 0;
        }
        if (typeof mode == 'undefined') {
            mode = 0;
        }

        for (var i = 0; i < rowNum * colNum; i++) {
            aSpan[i].style.backgroundImage = 'url(img/' + num + '.jpg)';
            var time = 0,
                obj = aSpan[i];
            switch (mode) {
                case 0:
                    time = (obj.col + obj.row) / 2;
                    break;
                case 1:
                    time = Math.random() * 10;
                    break;
                case 2:
                    time = obj.col;
                    break;
                case 3:
                    time = obj.row;
                    break;
                case 4:
                    time = (colNum - obj.col + rowNum - obj.row) / 2;
                    break;
                    // case 5:
                    //     time = (colNum - obj.col - obj.row) / 1.5;
                    //     break;
                default:
                    time = 5;
                    break;
            }

            (function(obj) {
                // setTimeout(obj)
                setTimeout(function() {
                    animate(obj, {
                        opacity: 1
                    });
                }, time * 100, false);
            })(aSpan[i]);
        }
    }
    var curPage = 1;
    var modeCnt = 0;
    setInterval(function() {
        oWrapper.style.backgroundImage = 'url(img/' + curPage + '.jpg)';
        curPage = (curPage + 1) % 5 + 1;
        toPage(curPage, (modeCnt++) % 5);

    }, 3000, false);

};
