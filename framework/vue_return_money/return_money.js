var date = new Date();
var curYear = date.getFullYear(),
    curMonth = date.getMonth() + 1,
    curDate = date.getDate();

function genArr(min, max, step) {
    if (typeof min === 'undefined') min = 0;
    if (typeof max === 'undefined') max = 100;
    if (typeof step === 'undefined') step = 1;
    var arr = [];
    for (var i = min; i <= max; i += step) {
        arr.push(i);
    }
    return arr;
}
var years = genArr(curYear - 10, curYear + 10),
    months = genArr(1, 12),
    dates = genArr(1, 31);
var vm = new Vue({
    el: '#my-app',
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
        baseInterest: 4.35,
        ratio: 2.0,
        borrowRowOrigin: {
            years: years,
            months: months,
            dates: dates,
            curYear: curYear,
            curMonth: curMonth,
            curDate: curDate
        }
    },
    computed: {
        interest: function() {
            return this.baseInterest * this.ratio;
        },
        borrowRows: function() {
            var N = 10;
            var arr = []
            for (var i = 0; i < N; i++) {
                var row = {
                    num: i + 1,
                    year: 1,
                    month: 1,
                    date: 1,
                    money: 1
                };
                arr.push(row);
            }
            return arr;
        }
    }
});
