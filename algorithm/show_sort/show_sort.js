var oCanvas = document.getElementById('my-canvas');
window.onload = function() {
    // unitTest();
    var btnPanel = document.getElementById('btn-panel');
    var inputN = document.getElementById('sample-num');
    var inputInterval = document.getElementById('interval');
    var selectSort = document.getElementById('select-sort');
    oCanvas.timer = null;
    oCanvas.curFrame = 0;
    btnPanel.addEventListener('click', handleBtns, false);

    function getSortFuncPointer() {
        var func = null;
        switch (selectSort.value) {
            case 'quickSort':
                func = quickSort;
                break;
            case 'bubbleSort':
                func = bubbleSort;
                break;
        }
        return func;
    }

    function handleBtns(event) {
        switch (event.target.id) {
            case 'btn-go':
                showSort(getSortFuncPointer(), inputN.value, inputInterval.value);
                break;
            case 'btn-pause':
                console.log(event.target.value);
                if (event.target.value === '暂停') {
                    clearInterval(oCanvas.timer);
                    event.target.value = '继续';
                } else {
                    event.target.value = '暂停';
                }
                break;
            case 'btn-next':
                pci
                break;
            case 'btn-prev':
                break;
            case 'btn-first':
                break;
            case 'btn-last':
                break;
        }
        event.stopPropagation();
    }
    // showSort(bubbleSort);
    function unitTest() {
        var s = new RandClass({
            N: 55
        });
        // console.log(s.numbers);
        var d = new DrawClass(document.getElementById('my-canvas'));
        var arr = s.randArr(60);
        console.log(arr);
        var historyArr = [];
        bubbleSort(arr, historyArr);
        // console.log(historyArr); 
        d.plotHist(historyArr);
    }

    function showSort(sortFunc, N, interval) {
        if (typeof N === 'undefined') N = 60;
        var sample = RandClass.prototype.randArr(N);
        var histArr = [];
        sortFunc(sample, histArr);
        var d = new DrawClass(document.getElementById('my-canvas'));
        d.plotHist(histArr, interval);
    }
}

function RandClass(args) {
    for (key in args) {
        this[key] = args[key];
    }
    this.numbers = this.randArr(this.N);
}
RandClass.prototype = {
    randBetween: function(min, max) {
        if (typeof min === 'undefined') min = 0;
        if (typeof max === 'undefined') max = 100;
        return min + Math.floor(Math.random() * (max - min));
    },
    randArr: function(N, min, max) {
        if (typeof N === 'undefined') N = 15;
        if (typeof min === 'undefined') min = 0;
        if (typeof max === 'undefined') max = 100;
        var arr = [];
        for (var i = 0; i < N; i++) {
            arr.push(this.randBetween(min, max));
        }
        return arr;
    }
};
// settings type obj
// settings para
// fillStyle:String 
function DrawClass(canvasElem, settings) {
    if (canvasElem.tagName.toUpperCase() !== 'CANVAS') {
        console.log('错误的canvas元素');
        return;
    }
    if (typeof settings === 'undefined') {
        settings = {};
    }
    this.canvasElem = canvasElem;
    this.ctx = canvasElem.getContext('2d');
    this.width = canvasElem.width;
    this.height = canvasElem.height;
    this.color = 'rgba(255,0,0,0.3)';
    this.highlightColor = 'rgba(0,0,255,0.3)'
    this.ctx.fillStyle = this.color;
    // this.ctx.fillStyle = 'rgba(255,0,0,0.3)';
}
DrawClass.prototype = {
    plotFrame: function(frameData) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        var widthStep = Math.floor(this.width / frameData.data.length);
        var columnRatio = 0.618;
        var heightRatio = 0.618;
        var max = Math.max.apply(null, frameData.data);
        // console.log('width=%d widthStep=%d length=%d', this.width, widthStep, frameData.data.length);
        for (var i = 0; i < frameData.data.length; i++) {
            var value = frameData.data[i];
            this.ctx.moveTo(i * widthStep, 0);
            var rectWidth = columnRatio * widthStep;
            var rectHeight = heightRatio * this.height * value / max;
            if (frameData.highlight.indexOf(i) !== -1) {
                //应高亮
                this.ctx.fillStyle = this.highlightColor;
                this.ctx.fillRect(i * widthStep,
                    this.height - rectHeight,
                    rectWidth,
                    rectHeight);
                this.ctx.fillStyle = this.color;
            } else {
                this.ctx.fillRect(i * widthStep,
                    this.height - rectHeight,
                    rectWidth,
                    rectHeight);
            }
        }
    },
    plotHist: function(histArr, t, startIndex) {
        if (typeof startIndex === 'undefined') {
            startIndex = 0;
        }
        clearInterval(oCanvas.timer);
        oCanvas.curFrame = startIndex;
        if (typeof t === 'undefined') t = 300;
        var me = this;
        oCanvas.timer = setInterval(function() {
            me.plotFrame(histArr[oCanvas.curFrame]);
            var oCurFrame = document.getElementById('cur-frame');
            oCurFrame.innerHTML = '当前步数:' + oCanvas.curFrame;
            oCanvas.curFrame++;
            if (oCanvas.curFrame >= histArr.length) {
                clearInterval(oCanvas.timer);
            }
        }, t);
    }
};

function bubbleSort(arr, histArr) {
    // var histArr = [];
    // var arr = arr.slice();
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        var isSwap = false;
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                isSwap = true;
                var hist = {
                    data: arr.slice(),
                    highlight: [j, j + 1]
                };
                histArr.push(hist);
            }
        }
        if (!isSwap) {
            return histArr;
        }
    }
    return histArr;
}
// var historyArr = []
function quickSort(arr, histArr) {
    // var histArr = [];
    function swap(arr, i, j) {
        if (i === j) return;
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        // console.log(arr);
    }

    function partition(arr, lo, hi) {
        var pivot = arr[hi];
        var keyIndex = lo;
        for (var i = lo; i < hi; i++) {
            if (arr[i] <= pivot) {
                swap(arr, i, keyIndex);
                //
                var hist = {
                    data: arr.slice(),
                    highlight: [i, keyIndex, hi]
                };
                histArr.push(hist);
                keyIndex++;
            }
        }
        swap(arr, keyIndex, hi);
        return keyIndex;
    }

    function sort(arr, lo, hi) {
        if (lo >= hi) {
            return;
        }
        var mid = partition(arr, lo, hi);
        sort(arr, lo, mid - 1);
        sort(arr, mid + 1, hi);
    }
    sort(arr, 0, arr.length - 1);
}
