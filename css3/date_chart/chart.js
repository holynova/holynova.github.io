window.onload = function() {
    // unitTest();
    // var p1 = new PlotClass(document.getElementsByTagName('canvas')[0]);
    // console.log(p1);
    function PlotClass(canvasElem) {
        this.width = canvasElem.width;
        this.height = canvasElem.height;
        this.ctx = canvasElem.getContext('2d');
        this.color1 = 'rgba(255,0,0,0.3)';
        this.color2 = 'rgba(0,255,0,0.3)';
    }
    PlotClass.prototype = {
        clear: function() {
            this.ctx.clearRect(0, 0, this.width, this.height);
        },
        plotDateChart: function(dataArr, minDate, maxDate, fillColor, maxY) {
            // dataArr format: [{date:d1,value:v1},{date:d2,value:v2}]
            dataArr.sort(function(a, b) {
                return a.date - b.date;
            })
            if (typeof minDate === 'undefined') {
                minDate = dataArr[0].date;
            }
            if (typeof maxDate === 'undefined') {
                maxDate = dataArr[dataArr.length - 1].date;
            }
            if (typeof fillColor === 'undefined') {
                fillColor = this.color1;
            }
            this.ctx.fillStyle = fillColor;
            if (typeof maxY === 'undefined') {
                var totalValue = dataArr.reduce(function(a, b) {
                    return a + b.value;
                }, 0);
            } else {
                totalValue = maxY;
            }
            var widthRatio = 0.9,
                heightRatio = 0.618,
                offsetX = 2;
            var accX = 0,
                prevHeight = 0,
                accValue = 0;
            // console.log(totalValue, minDate, maxDate);
            this.ctx.beginPath();
            this.ctx.moveTo(offsetX, this.height);
            for (var i = 0, len = dataArr.length; i < len; i++) {
                accX = (dataArr[i].date - minDate) / (maxDate - minDate) * widthRatio * this.width;
                this.ctx.lineTo(offsetX + accX, this.height - prevHeight);
                accValue += dataArr[i].value;
                var height = accValue / totalValue * heightRatio * this.height;
                this.ctx.lineTo(offsetX + accX, this.height - height);
                prevHeight = height;
            }
            this.ctx.lineTo(2 * offsetX + accX, this.height - prevHeight);
            this.ctx.lineTo(2 * offsetX + accX, this.height);
            this.ctx.fill();
        },
        plotBorrowReturnChart: function(borrowData, returnData) {
            var dateArr = [];
            for (var i = 0, len = returnData.length; i < len; i++) {
                dateArr.push(returnData[i].date);
            }
            //找到最后一笔还款,把这个日期加入到借款的最后一个位置中.
            var returnMaxDate = Math.max.apply(null, dateArr);
            for (var i = 0, len = borrowData.length; i < len; i++) {
                dateArr.push(borrowData[i].date);
            }
            var minDate = Math.min.apply(null, dateArr);
            var maxDate = Math.max.apply(null, dateArr);
            console.log(minDate, maxDate);
            this.clear();
            //找到共同的Y轴最大值
            var borrowTotal = borrowData.reduce(function(a, b) {
                return a + b.value;
            }, 0)
            var returnTotal = returnData.reduce(function(a, b) {
                return a + b.value;
            }, 0)
            var maxY = Math.max(borrowTotal, returnTotal);
            console.log(maxY, borrowTotal, returnTotal);
            //找到最后一笔还款,把这个日期加入到借款的最后一个位置中.
            var borrowDataPlus = borrowData.slice();
            borrowDataPlus.push({
                date: returnMaxDate,
                value: 0
            });
            this.plotDateChart(borrowDataPlus, minDate, maxDate, this.color1, maxY);
            this.plotDateChart(returnData, minDate, maxDate, this.color2, maxY);
            // var minBorrowDate = Math.min.apply(null, borrowData);
        }
    };
    unitTest2();
    // function unitTest() {
    //     var data = [];
    //     data = randomDateData(2);
    //     draw(data, 'rgba(255,0,0,0.3)');
    //     data = randomDateData(5);
    //     draw(data, 'rgba(0,255,0,0.3)');
    // }
    function randomDateData(N) {
        var data = [];
        N = N || 5;
        for (var i = 0; i < N; i++) {
            var item = {};
            item.value = randBetween(0, 1000);
            item.date = new Date(randBetween(2010, 2019), randBetween(0, 11), randBetween(1, 28));
            data.push(item);
        }
        return data;
    }

    function randBetween(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    function draw(data, color) {
        console.log(data);
        var canvas = document.getElementsByTagName('canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        // ctx.fillStyle = color;
        //按时间排序
        data.sort(function(a, b) {
            return a.date - b.date;
        });
        var latestDate = data[data.length - 1].date;
        var oldestDate = data[0].date;
        var totalValue = data.reduce(function(a, b) {
            return a + b.value;
        }, 0);
        // console.log(latestDate.toLocaleDateString(), oldestDate.toLocaleDateString(), totalValue);
        var ratio = 0.8;
        var accX = 0,
            prevHeight = 0;
        var accValue = 0;
        var xOffset = 2;
        ctx.beginPath();
        ctx.moveTo(xOffset, canvas.height);
        for (var i = 0, len = data.length; i < len; i++) {
            accX = (data[i].date - oldestDate) / (latestDate - oldestDate) * 0.95 * canvas.width;
            ctx.lineTo(xOffset + accX, canvas.height - prevHeight);
            accValue += data[i].value;
            var height = accValue / totalValue * ratio * canvas.height;
            ctx.lineTo(xOffset + accX, canvas.height - height);
            prevHeight = height;
        }
        ctx.lineTo(xOffset + accX + xOffset, canvas.height - prevHeight);
        ctx.lineTo(2 * xOffset + accX, canvas.height);
        ctx.fill();
    }

    function unitTest2() {
        var borrowData = randomDateData(10);
        var returnData = randomDateData(10);
        var canvasElem = document.getElementsByTagName('canvas')[0];
        var p = new PlotClass(canvasElem);
        // p.plotDateChart(returnData);
        p.plotBorrowReturnChart(borrowData, returnData);
        console.log(p);
    }
};
