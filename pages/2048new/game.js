$(function() {
    main();
});

function clone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0; i < obj.length; i++) {
            copy.push(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (obj instanceof Object) {
        var copy = {};
        for (var key in obj) {
            //递归
            if (obj.hasOwnProperty(key)) {
                copy[key] = clone(obj.key);
            }
        }
        return copy;
    }
}

function main() {
    function QueueClass(size) {
        this.size = size;
        this.arr = [];
    }
    QueueClass.prototype = {
        inQueue: function(value) {
            if (this.arr.length > this.size) {
                this.arr.shift();
            }
            this.arr.push(clone(value));
        },
        //回到上一步
        prev: function() {
            if (this.arr.length > 0) {
                return this.arr.pop();
            } else {
                return null;
            }
        }
    };
    var gData = [];
    var gGrade = $('.game-settings .grade').val()
    var gScore = 0;
    var gStep = 0;
    var gHistory = {
        data: new QueueClass(20),
        step: new QueueClass(20),
        score: new QueueClass(20)
    };
    var gGameSettings = {
        startCellQty: 'auto',
        startCellValues: [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4],
        animateInterval: 100,
        animateEasing: 'linear',
        winCellValue: 2048,
    };
    //-----------------------------------------------------------
    var gThemes = {};
    initTheme();
    var gCurTheme = gThemes[$('.game-settings .select-theme').val()];

    function initTheme() {
        gThemes['number'] = str2theme('2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768');
        gThemes['dynasty'] = str2theme('夏,商,周,春秋,战国,秦,汉,三国,晋,南北朝,隋,唐,五代十国,宋,元,明,清,民国,PRC');
        gThemes['chemistry'] = str2theme('氢氦锂铍硼碳氮氧氟氖钠镁铝硅磷硫氯氩钾钙'.split('').join(','));
        gThemes['reverse'] = str2theme('2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768'.split(',').reverse().join(','));
        gThemes['millitary'] = str2theme('炮灰,兵,班长,排长,连长,营长,团长,旅长,师长,军长,军区司令,国防部长,军委副主席,军委主席');
    }

    function str2theme(str) {
        //用逗号分隔的字符串,产生主题
        var theme = {};
        var arr = str.replace(/\s/g, '').split(',');
        for (var i = 0; i < arr.length; i++) {
            theme[Math.pow(2, (i + 1))] = arr[i];
        }
        return theme;
    }
    $('.game-settings .select-theme').on('change', function(ev) {
        var value = $(ev.target).val();
        gCurTheme = gThemes[value];
        refreshAll();
    });
    //-----------------------------------------------------------
    initGameBox();
    //-----------------------------------------------------------
    //events handler
    $('.select-grade').on('change', function() {
        initGameBox();
        $(this).blur();
    });
    $('.game-settings .btn-restart').click(initGameBox);
    $('.game-settings .btn-prev').click(function() {
        var prevData = gHistory.data.prev();
        var prevStep = gHistory.step.prev();
        var prevScore = gHistory.score.prev();
        if (prevData !== null) {
            gData = prevData;
            refreshAll();
        }
        if (prevStep !== null) {
            gStep = prevStep;
            $('.game-info .step').html(gStep);
        }
        if (prevScore !== null) {
            gScore = prevScore;
            $('.game-info .score').html(gScore);
        }
        // console.log(prevData);
    });
    $(document).on('keydown', handleKey);
    $(document).on('keydown', function(event) {
        //阻止按方向键页面滚动的默认事件
        if (event.key.indexOf('Arrow') !== -1) {
            event.preventDefault();
        }
    });
    // $('.game-settings .btn-restart')
    function handleKey(event) {
        // console.log(event.key);
        var keyStr = event.key;
        if (keyStr.indexOf('Arrow') !== -1) {
            var dirStr = keyStr.replace(/^Arrow/, '').toLowerCase();
            $('.cell').finish();
            //上一帧已经全部结束
            gHistory.data.inQueue(gData);
            gHistory.step.inQueue(gStep);
            gHistory.score.inQueue(gStep);
            var max = Math.max(1, Math.round(gGrade / 4));
            for (var i = 0; i < max; i++) {
                genRandCell();
            }
            // //动画结束后,产生随即格子
            // setTimeout(function() {
            //         var max = Math.max(1, Math.round(gGrade / 4));
            //         for (var i = 0; i < max; i++) {
            //             genRandCell();
            //         }
            //     }, gGameSettings.animateInterval)
            //     // genRandCell();
            move(dirStr);
            event.stopPropagation();
        }
    }

    function move(direct) {
        var isLastStepMerge = false;
        if (direct === 'left') {
            for (var row = 0; row < gGrade; row++) {
                isLastStepMerge = false;
                for (var col = 1; col < gGrade; col++) {
                    if (getCellData(row, col) === 0) {
                        continue;
                    }
                    //从右往左,一直找到一个不为零的格子
                    for (var nextCol = col - 1; nextCol >= 0; nextCol--) {
                        if (getCellData(row, nextCol) !== 0) {
                            break;
                        }
                    }
                    if (nextCol === -1 || getCellData(row, col) !== getCellData(row, nextCol)) {
                        moveCell(row, col, row, nextCol + 1);
                        isLastStepMerge = false;
                    } else {
                        if (isLastStepMerge) { //不合并
                            moveCell(row, col, row, nextCol + 1);
                            isLastStepMerge = false;
                        } else { //合并
                            mergeCell(row, col, row, nextCol);
                            isLastStepMerge = true;
                        }
                    }
                }
            }
        } else if (direct === 'right') {
            for (var row = 0; row < gGrade; row++) {
                isLastStepMerge = false;
                for (var col = gGrade - 2; col >= 0; col--) {
                    if (getCellData(row, col) === 0) {
                        continue;
                    }
                    //从左往右,一直找到一个不为零的格子
                    for (var nextCol = col + 1; nextCol < gGrade; nextCol++) {
                        if (getCellData(row, nextCol) !== 0) {
                            break;
                        }
                    }
                    if (nextCol === gGrade || getCellData(row, col) !== getCellData(row, nextCol)) {
                        moveCell(row, col, row, nextCol - 1);
                        isLastStepMerge = false;
                    } else {
                        if (isLastStepMerge) { //不合并
                            moveCell(row, col, row, nextCol - 1);
                            isLastStepMerge = false;
                        } else { //合并
                            mergeCell(row, col, row, nextCol);
                            isLastStepMerge = true;
                        }
                    }
                }
            }
        } else if (direct === 'up') {
            for (var col = 0; col < gGrade; col++) {
                isLastStepMerge = false;
                for (var row = 1; row < gGrade; row++) {
                    if (getCellData(row, col) === 0) {
                        continue;
                    }
                    //从下往上,直到找到一个非零的,或者找到边界
                    for (var nextRow = row - 1; nextRow >= 0; nextRow--) {
                        if (getCellData(nextRow, col) !== 0) {
                            break;
                        }
                    }
                    if (nextRow === -1 || getCellData(nextRow, col) !== getCellData(row, col)) {
                        moveCell(row, col, nextRow + 1, col);
                        isLastStepMerge = false;
                    } else {
                        if (isLastStepMerge) {
                            //不能合并
                            moveCell(row, col, nextRow + 1, col);
                            isLastStepMerge = false;
                        } else {
                            mergeCell(row, col, nextRow, col);
                            isLastStepMerge = true;
                        }
                    }
                }
            }
        } else if (direct === 'down') {
            for (var col = 0; col < gGrade; col++) {
                isLastStepMerge = false;
                for (var row = gGrade - 2; row >= 0; row--) {
                    if (getCellData(row, col) === 0) {
                        continue;
                    }
                    //从上往下,找到第一个不为0的格子
                    for (var nextRow = row + 1; nextRow < gGrade; nextRow++) {
                        if (getCellData(nextRow, col) !== 0) {
                            break;
                        }
                    }
                    if (nextRow === gGrade || getCellData(row, col) !== getCellData(nextRow, col)) {
                        moveCell(row, col, nextRow - 1, col);
                        isLastStepMerge = false;
                    } else {
                        if (isLastStepMerge) {
                            moveCell(row, col, nextRow - 1, col);
                            isLastStepMerge = false;
                        } else {
                            mergeCell(row, col, nextRow, col);
                            isLastStepMerge = true;
                        }
                    }
                }
            }
        }
        addStep();
    }

    function addStep() {
        gStep++;
        $('.game-info .step').html(gStep);
    }

    function moveCell(fromRow, fromCol, toRow, toCol) {
        if (fromRow === toRow && fromCol === toCol) {
            return;
        }
        setCellData(toRow, toCol, getCellData(fromRow, fromCol));
        setCellData(fromRow, fromCol, 0);
        moveAnimate(fromRow, fromCol, toRow, toCol);
    }

    function mergeCell(fromRow, fromCol, destRow, destCol) {
        if (fromRow === destRow && fromCol === destCol) {
            return;
        }
        var value = getCellData(fromRow, fromCol);
        setCellData(destRow, destCol, value * 2);
        setCellData(fromRow, fromCol, 0);
        moveAnimate(fromRow, fromCol, destRow, destCol, function() {
            addScore(value * 2);
            // if (value * 2 >= gGameSettings.winCellValue) {
            //     gIsWin = true;
            //     // alert('win');
            // }
        });
    }
    // function winTest()
    function addScore(score) {
        gScore += score;
        $('.game-info .score').html(gScore);
        if (score >= gGameSettings.winCellValue) {
            showWin();
        }
        // if(gScore >= gGameSettings.)
    }

    function showWin() {
        $('.game-info .result').html('You win');
    }

    function moveAnimate(fromRow, fromCol, toRow, toCol, callback) {
        var $from = $('#cell' + fromRow + '_' + fromCol);
        var $to = $('#cell' + toRow + '_' + toCol);
        var fromPos = $from.position();
        var toPos = $to.position();
        //动画期间禁止键盘输入
        // $(document).off('keydown');
        $from.css('zIndex', 100).animate({
            left: toPos.left,
            top: toPos.top
        }, gGameSettings.animateInterval, gGameSettings.animateEasing, function() {
            $from.css({
                left: fromPos.left,
                top: fromPos.top,
                zIndex: 10
            });
            refreshCell(fromRow, fromCol);
            refreshCell(toRow, toCol);
            if (typeof callback === 'function') {
                callback();
            }
            // $(document).on('keydown', handleKey);
        });
    }

    function setWidth() {
        var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var width = deviceWidth > 500 ? Math.floor(deviceWidth * 0.5) : Math.floor(deviceWidth * 0.9);
        // console.log(deviceWidth, width);
        $('#game-box').width(width);
        $('#game-box').height(width);
        // console.log()
    }

    function initGameBox() {
        var $gameBox = $('#game-box');
        setWidth();
        $gameBox.html('');
        gGrade = parseInt($('.select-grade').val());
        var boxWidth = $gameBox.width();
        var gutterWidth = Math.max(1, Math.round(boxWidth / (16 * gGrade + 1)));
        var rectWidth = Math.floor((boxWidth - (gGrade + 1) * gutterWidth) / gGrade);
        // var gutterWidth = Math.max(1, Math.round(boxWidth * 0.015));
        // var rectWidth = Math.floor((boxWidth - gutterWidth * (gGrade + 1)) / gGrade);
        for (var row = 0; row < gGrade; row++) {
            for (var col = 0; col < gGrade; col++) {
                var id = 'cell' + row + '_' + col;
                var cellStr = '<div class="cell" id = "' + id + '">' + '' + '</div>';
                var $cell = $(cellStr);
                var bgId = 'bg-cell' + row + '_' + col;
                var $bgCell = $('<div class="cell" id = "' + bgId + '">' + '' + '</div>')
                var left = gutterWidth + col * (rectWidth + gutterWidth);
                var top = gutterWidth + row * (rectWidth + gutterWidth);
                var cellStyle = {
                    width: rectWidth + 'px',
                    height: rectWidth + 'px',
                    left: left + 'px',
                    top: top + 'px',
                    fontSize: rectWidth / 4 + 'px',
                    lineHeight: rectWidth + 'px',
                    zIndex: 10
                };
                $bgCell.css(cellStyle);
                $cell.css(cellStyle);
                $gameBox.append($bgCell);
                $gameBox.append($cell);
            }
        }
        initCellData();
        var initCellNum = 0;
        if (['', 'auto', 0].indexOf(gGameSettings.startCellQty) !== -1) {
            initCellNum = gGrade;;
        } else {
            initCellNum = gGameSettings.startCellQty
        }
        for (var i = 0; i < initCellNum; i++) {
            genRandCell(randChoose(gGameSettings.startCellValues));
        }
    }

    function initCellData() {
        gData = new Array(gGrade * gGrade);
        gData.fill(0);
        gStep = 0;
        gScore = 0;
        $('.game-info .score').html('0');
        $('.game-info .step').html('0');
        $('.game-info .result').html('');
        // return gData;
    }

    function setCellData(row, col, value) {
        gData[row * gGrade + col] = value;
    }

    function refreshCell(row, col) {
        var $cell = $('#cell' + row + '_' + col);
        var value = getCellData(row, col);
        var content = '';
        if (value === 0) {
            content = '';
        } else {
            if (value in gCurTheme) {
                content = gCurTheme[value];
            } else {
                content = value;
            }
        }
        $cell.html(content);
        $cell.css({
            'backgroundColor': getColor(value)
        });
    }

    function refreshAll() {
        for (var row = 0; row < gGrade; row++) {
            for (var col = 0; col < gGrade; col++) {
                refreshCell(row, col);
            }
        }
    }
    //查到数字对应的背景颜色
    function getColor(value) {
        if (!value) return 'white';
        var color_table = {};
        color_table['0'] = 'white';
        // color_table['0'] = 'hsl(160,80%,80%)';
        color_table['2'] = 'hsl(150,80%,80%)';
        color_table['4'] = 'hsl(140,80%,80%)';
        color_table['8'] = 'hsl(130,80%,80%)';
        color_table['16'] = 'hsl(120,80%,80%)';
        color_table['32'] = 'hsl(110,80%,80%)';
        color_table['64'] = 'hsl(100,80%,80%)';
        color_table['128'] = 'hsl(90,80%,80%)';
        color_table['256'] = 'hsl(80,80%,80%)';
        color_table['512'] = 'hsl(70,80%,80%)';
        color_table['1024'] = 'hsl(60,80%,80%)';
        color_table['2048'] = 'hsl(50,80%,80%)';
        color_table['4096'] = 'hsl(40,80%,80%)';
        color_table['8192'] = 'hsl(30,80%,80%)';
        color_table['16384'] = 'hsl(20,80%,80%)';
        color_table['32768'] = 'hsl(10,80%,80%)';
        color_table['65536'] = 'hsl(0,80%,80%)';
        return color_table[value];
    }

    function getCellData(row, col) {
        return gData[row * gGrade + col];
    }

    function genCell(row, col, value) {
        if (typeof value === 'undefined') {
            value = randChoose(gGameSettings.startCellValues);
        }
        var $cell = $('#cell' + row + '_' + col);
        setCellData(row, col, value);
        refreshCell(row, col);
    }

    function genRandCell(value) {
        var blankCells = [];
        for (var i = 0, len = gData.length; i < len; i++) {
            if (!gData[i]) {
                blankCells.push(i);
            }
        }
        testGameoverAndShow();
        if (blankCells.length === 0) {
            return;
        }
        var index = randChoose(blankCells);
        var col = index % gGrade;
        var row = Math.floor(index / gGrade);
        genCell(row, col, value);
        testGameoverAndShow();
    }

    function isGameover() {
        var isAnyZero = gData.some(function(value) {
            return value === 0;
        });
        if (isAnyZero) {
            return false;
        }
        // var isOver = true;
        for (var row = 0; row < gGrade; row++) {
            for (var col = 0; col < gGrade - 1; col++) {
                if (getCellData(row, col) === getCellData(row, col + 1)) {
                    return false;
                }
            }
        }
        for (var col = 0; col < gGrade; col++) {
            for (var row = 0; row < gGrade - 1; row++) {
                if (getCellData(row, col) === getCellData(row + 1, col)) {
                    return false;
                }
            }
        }
        return true;
    }

    function testGameoverAndShow() {
        if (isGameover()) {
            $('.game-info .result').html('Game over');
            alert('Game Over');
            // $(document).off()
        }
    }

    function randChoose(arr) {
        var len = arr.length;
        var index = Math.floor(Math.random() * len);
        return arr[index];
    }
}
