(function() {
    var today = new Date();

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

    function date2str(date) {
        function toDouble(num) {
            return num < 10 ? '0' + num : '' + num;
        }
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }

    function str2date(str) {
        //str format: 2011-01-01;
        return new Date(str);
    }
    //--------------------------------
    var vm = new Vue({
        el: '#app',
        data: {
            baseArr: [{
                text: "贷款-一年以内-4.35",
                value: 4.35
            }, {
                text: "贷款-一至五年-4.75",
                value: 4.75
            }, {
                text: "贷款-五年以上-4.9",
                value: 4.9
            }, {
                text: "整存整取-三个月-1.35",
                value: 1.35
            }, {
                text: "整存整取-六个月-1.55",
                value: 1.55
            }, {
                text: "整存整取-一年-1.75",
                value: 1.75
            }, {
                text: "整存整取-二年-2.25",
                value: 2.25
            }, {
                text: "整存整取-三年-2.75",
                value: 2.75
            }, {
                text: "整存整取-五年-2.75",
                value: 2.75
            }, {
                text: "活期存款-活期存款-0.3",
                value: 0.3
            }, {
                text: "自定义-1.0",
                value: 1.0
            }],
            base: 4.35,
            ratio: 1.0,
            borrowData: [{
                date: "2011-01-01",
                value: 1111
            }, {
                date: "2012-02-02",
                value: 2222
            }],
            returnData: [{
                date: "2011-01-01",
                value: 1111
            }, {
                date: "2012-02-02",
                value: 2222
            }],
        },
        computed: {
            interest: function() {
                return (this.base * this.ratio).toFixed(2);
            },
            borrowTotal: function() {
                return this.borrowData.reduce(function(a, b) {
                    return a + parseFloat(b.value);
                }, 0);
            },
            returnTotal: function() {
                return this.returnData.reduce(function(a, b) {
                    return a + parseFloat(b.value);
                }, 0);
            },
            lastReturnDate: function() {
                return this.returnData.reduce(function(prevDate, curItem) {
                    var curDate = new Date(curItem.date);
                    return (prevDate > curDate) ? prevDate : curDate;
                }, 0);
            },
            totalInterest: function() {
                var interest = this.interest / 100;
                var lastReturnDate = this.lastReturnDate;
                var borrowInterest = 0;
                borrowInterest = this.borrowData.reduce(function(prev, curItem) {
                    var days = (lastReturnDate - new Date(curItem.date)) / (24 * 3600 * 1000);
                    var rowInterest = curItem.value * interest * days / 365;
                    return prev + rowInterest;
                }, 0);
                var returnInterest = 0;
                returnInterest = this.returnData.reduce(function(prev, curItem) {
                    var days = (lastReturnDate - new Date(curItem.date)) / (24 * 3600 * 1000);
                    var rowInterest = curItem.value * interest * days / 365;
                    return prev + rowInterest;
                }, 0);
                return (borrowInterest - returnInterest).toFixed(2);
            }
        },
        methods: {
            changeRow: function(mode, type, row) {
                //mode =  add | del
                //type = borrow | return
                //row the row to be deal with
                var dataArr = [];
                if (type === 'borrow') {
                    dataArr = this.borrowData;
                } else if (type === 'return') {
                    dataArr = this.returnData;
                }
                if (mode === 'add') {
                    // var today = new Date();
                    // var dateStr =
                    var newRow = {
                        date: date2str(new Date()),
                        value: 0
                    };
                    dataArr.push(newRow);
                } else if (mode === 'del') {
                    dataArr.splice(dataArr.indexOf(row), 1);
                }
            },
            plot: function() {
                var borrow = [];
                for (var i = 0, len = this.borrowData.length; i < len; i++) {
                    var row = this.borrowData[i];
                    borrow.push({
                        date: new Date(row.date),
                        value: row.value
                    });
                }
                var returnArr = [];
                for (var i = 0, len = this.returnData.length; i < len; i++) {
                    var row = this.returnData[i];
                    returnArr.push({
                        date: new Date(row.date),
                        value: row.value
                    });
                }
                var canvasElem = document.getElementsByTagName('canvas')[0];
                plotDateChart(canvasElem, borrow, returnArr);
            }
        }
    });
})();
