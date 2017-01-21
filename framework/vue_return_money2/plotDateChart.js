/*
2016年12月19日 桑益民
 */
function plotDateChart(canvasElem, borrowData, returnData) {
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
            dataArr = dataArr.slice();
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
            // console.log(minDate, maxDate);
            this.clear();
            //找到共同的Y轴最大值
            var borrowTotal = borrowData.reduce(function(a, b) {
                return a + b.value;
            }, 0)
            var returnTotal = returnData.reduce(function(a, b) {
                return a + b.value;
            }, 0)
            var maxY = Math.max(borrowTotal, returnTotal);
            // console.log(maxY, borrowTotal, returnTotal);
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
    var p = new PlotClass(canvasElem);
    p.plotBorrowReturnChart(borrowData, returnData);
}
