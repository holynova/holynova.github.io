$(document).ready(function() {
    var borrowPicker = new DatePicker($('#borrow-date'));
    borrowPicker.render();
    var paybackDatePickers = [];
    $('.payback-date').each(function() {
        var picker = new DatePicker(this);
        picker.render();
        console.log(picker.date);
        paybackDatePickers.push(picker);
    });
    // setInterval(function() {
    //     // console.log(vm.payback);
    //     // console.log(vm.interest);
    //     console.log(paybackDatePickers);
    // }, 2000);

});
Vue.filter('fix', function(value) {
    return parseFloat(value).toFixed(2);
})
var vm = new Vue({
    el: '#payback-calculator',
    data: function() {
        var N = 10;
        // var paybackInputs = [];
        // for (var i = 0; i < N; i++) {
        //     var input = {};
        //     input.date = new Date();
        //     input.money = i * 111;
        //     paybackInputs.push(input);
        // }
        var input = {
            date: new Date('2016-1-1'),
            money: 1
        }
        return {
            base: 1.75,
            ratio: 2.1,
            borrowQty: 8899,
            // paybackInputs: paybackInputs
            input: input
        }
    },
    computed: {
        interest: function() {
            return parseFloat(this.base) * parseFloat(this.ratio);
        },
        // paybackRows: function() {
        //     // var rows = new Array(10);
        //     var rows = [];
        //     var N = 10;
        //     for (var i = 0; i < N; i++) {
        //         var row = {};
        //         row.num = i + 1;
        //         row.date = this.paybackInputs[i].date;
        //         row.money = this.paybackInputs[i].money;
        //         row.days = 100;
        //         row.interest = parseFloat(row.days) *
        //             parseFloat(this.base) *
        //             parseFloat(this.ratio) / 365 *
        //             parseFloat(this.money);
        //         row.per = row.money / parseFloat(this.borrowQty) * 100;
        //         rows.push(row);
        //     }
        //     // console.log(rows);
        //     return rows;
        // },
        paybackTotal: function() {
            var total = {
                money: 0,
                interest: 0,
                per: 0
            };
            // for (var i = 0; i < this.paybackRows.length; i++) {
            //     var row = this.paybackRows[i]
            //     total.money += row.money;
            //     total.interest += row.interest;
            //     total.per += row.per;
            // }
            return total;
        },
        payback: function() {
            var res = {};
            res.num = 1;
            res.date = this.input.date;
            res.money = this.input.money;
            res.days = Math.round((new Date().getTime() - this.input.date.getTime()) / (24 * 3600 * 1000));
            res.interest = res.days * this.base * this.ratio / 100 / 365 * res.money;
            res.per = res.money / this.borrowQty * 100;
            return res;
        }
    }
});
