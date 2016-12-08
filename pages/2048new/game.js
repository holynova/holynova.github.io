$(function() {
    main()
});

function main() {
    var gData = [];
    var gGrade = 4;
    var gScore = 0;
    var gGameSettings = {
        startCellQty: 12,
        startCellValues: [2, 4],
        animateInterval: 500,
        animateEasing: 'linear',
        winCellValue: 2048,
    };
    initGameBox();
    $('.select-grade').on('change', function() {
        initGameBox();
        $(this).blur();
    });
    $(document).on('keyup', handleKeyup);

    function handleKeyup(event) {
        switch (event.key) {
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowRight':
                move('right');
                break;
            case 'ArrowUp':
                move('up');
                break;
            case 'ArrowDown':
                move('down');
                break;
            default:
                break;
        }
        return false;
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
        moveAnimate(fromRow, fromCol, destRow, destCol);
        gScore += value * 2;
        if (value * 2 >= gGameSettings.winCellValue) {
            gIsWin = true;
        }
    }

    function moveAnimate(fromRow, fromCol, toRow, toCol) {
        var $from = $('#cell' + fromRow + '_' + fromCol);
        var $to = $('#cell' + toRow + '_' + toCol);
        var fromPos = $from.position();
        var toPos = $to.position();
        //动画期间禁止键盘输入
        $(document).off('keyup', handleKeyup);
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
            $(document).on('keyup', handleKeyup);
        });
    }

    function move1(direct) {
        if (direct === 'left') {
            for (var row = 0; row < gGrade; row++) {
                for (var col = 1; col < gGrade; col++) {
                    //col=0最左边,则不用移动
                    var curCellValue = getCellData(row, col);
                    if (!curCellValue) continue;
                    var neighborCellValue = getCellData(row, col - 1);
                    if (neighborCellValue) {
                        //向左找,左边不为空,则判断数字是否一致,如果一样,则合并,如果不一样,则不动
                        if (neighborCellValue === curCellValue) {
                            setCellData(row, col - 1, curCellValue * 2);
                            setCellData(row, col, 0);
                            moveCell({
                                row: row,
                                col: col
                            }, {
                                row: row,
                                col: col - 1
                            }, refreshAll);
                        }
                    } else {
                        //向左找,左边为空,则继续找,直到找到一个不为空的位置,移动过去,固定
                        var nextNotEmpatyCellIndex = col - 1;
                        while (nextNotEmpatyCellIndex >= 0) {
                            if (getCellData(row, nextNotEmpatyCellIndex)) {
                                break;
                            }
                            nextNotEmpatyCellIndex--;
                        }
                        nextNotEmpatyCellIndex++;
                        setCellData(row, nextNotEmpatyCellIndex, getCellData(row, col));
                        setCellData(row, col, 0);
                        moveCell({
                            row: row,
                            col: col
                        }, {
                            row: row,
                            col: nextNotEmpatyCellIndex
                        }, refreshAll);
                    }
                }
            }
        } else if (direct === 'right') {
            for (var row = 0; row < gGrade; row++) {
                for (var col = gGrade - 2; col >= 0; col--) {
                    //col=gGrade-1 最右边,则不用移动
                    if (!getCellData(row, col)) continue;
                    var nextCol = col + 1;
                    if (getCellData(row, nextCol)) {
                        //向右找,右边不为空,则判断数字是否一致,如果一样,则合并,如果不一样,则不动
                        merge(row, col, row, nextCol);
                    } else {
                        //向右找,右边为空,则继续找,直到找到一个不为空的位置,移动过去,固定
                        var nextNotEmpatyCellIndex = nextCol;
                        while (nextNotEmpatyCellIndex < gGrade) {
                            if (getCellData(row, nextNotEmpatyCellIndex)) {
                                break;
                            }
                            nextNotEmpatyCellIndex++;
                        }
                        nextNotEmpatyCellIndex--;
                        setCellData(row, nextNotEmpatyCellIndex, getCellData(row, col));
                        setCellData(row, col, 0);
                        moveCell({
                            row: row,
                            col: col
                        }, {
                            row: row,
                            col: nextNotEmpatyCellIndex
                        }, refreshAll);
                    }
                }
            }
        }
    }

    function merge1(row, col, nextRow, nextCol) {
        var curCellValue = getCellData(row, col);
        var neighborCellValue = getCellData(nextRow, nextCol);
        if (neighborCellValue === curCellValue) {
            setCellData(nextRow, nextCol, curCellValue * 2);
            setCellData(row, col, 0);
            moveCell({
                row: row,
                col: col
            }, {
                row: nextRow,
                col: nextCol
            }, refreshAll);
        }
    }

    function moveCell1(fromDic, toDic, callback) {
        var $fromCell = $('#cell' + fromDic.row + '_' + fromDic.col);
        var $toCell = $('#cell' + toDic.row + '_' + toDic.col);
        var $bgFromCell = $('#bg-cell' + fromDic.row + '_' + fromDic.col);
        var fromPos = $bgFromCell.position();
        $fromCell.css({
            zIndex: 100
        });
        $fromCell.animate({
            top: $toCell.position().top,
            left: $toCell.position().left
        }, function() {
            if (typeof callback === 'function') {
                callback();
            }
            $fromCell.css({
                top: fromPos.top + 'px',
                left: fromPos.left + 'px',
                zIndex: 10
            });
        });
    }

    function initGameBox() {
        var $gameBox = $('#game-box');
        $gameBox.html('');
        gScore = 0;
        gGrade = parseInt($('.select-grade').val());
        var boxWidth = $gameBox.width();
        var gutterWidth = Math.max(1, Math.round(boxWidth * 0.015));
        var rectWidth = Math.floor((boxWidth - gutterWidth * (gGrade + 1)) / gGrade);
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
                    fontSize: rectWidth / 2 + 'px',
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
        for (var i = 0; i < gGameSettings.startCellQty; i++) {
            genRandCell(randChoose(gGameSettings.startCellValues));
        }
    }

    function initCellData() {
        gData = new Array(gGrade * gGrade);
        gData.fill(0);
        return gData;
    }

    function setCellData(row, col, value) {
        gData[row * gGrade + col] = value;
    }

    function refreshCell(row, col) {
        var $cell = $('#cell' + row + '_' + col);
        var value = getCellData(row, col);
        $cell.html(value ? value : '');
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
        var id = 'cell' + row + '_' + col;
        var $cell = $('#' + id);
        var width = $cell.width();
        $cell.animate({
            width: width,
            height: width
        });
        $cell.html(value);
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
        var index = randChoose(blankCells);
        var col = index % gGrade;
        var row = Math.floor(index / gGrade);
        genCell(row, col, value);
    }

    function randChoose(arr) {
        var len = arr.length;
        var index = Math.floor(Math.random() * len);
        return arr[index];
    }
}
