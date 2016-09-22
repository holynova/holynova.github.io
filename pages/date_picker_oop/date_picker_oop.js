var DatePicker = function(parentEl, id) {
    // this.id = 'datepicker' + new Date().getTime() + 0;
    this.id = '' + id + new Date().getTime();
    this.parentEl = parentEl;
    this.date = new Date();
    var me = this;
    this.genDatePicker = function() {
        this.updateDateBox(me.date);
        this.updateInput(me.date);
        // events
        var id = me.id;
        var idStr = '.date-picker-wrapper#' + id + " ";
        var pickedDate = me.date;
        var datePicker = $(idStr + '.picker.date-picker');
        // console.log(datePicker);
        datePicker.on('click', function(event) {
            var $target = $(event.target);
            // console.log($target);
            if ($target.hasClass('cur-year')) {
                this.updateYearBox(pickedDate);
                $(idStr + '.box.year-box').show();
            } else if ($target.hasClass('cur-month')) {
                this.updateMonthBox(pickedDate);
                $(idStr + '.box.month-box').show();
            } else if ($target.hasClass('prev-year')) {
                pickedDate.setFullYear(pickedDate.getFullYear() - 1);
                this.update(pickedDate);
            } else if ($target.hasClass('next-year')) {
                pickedDate.setFullYear(pickedDate.getFullYear() + 1);
                this.update(pickedDate);
            } else if ($target.hasClass('prev-month')) {
                pickedDate.setMonth(pickedDate.getMonth() - 1);
                this.update(pickedDate);
            } else if ($target.hasClass('next-month')) {
                pickedDate.setMonth(pickedDate.getMonth() + 1);
                this.update(pickedDate);
            }

        });

        var $dateCells = $(idStr + '.date-cells table tbody td');
        $dateCells.each(function() {
            $(this).on('click', function(event) {
                pickedDate.setTime(event.target.myDate.getTime());
                this.chooseDate(pickedDate);
                this.updateInput(pickedDate);
                $(idStr + '.date-box').hide();
            })
        });

        var $yearPicker = $(idStr + '.year-box .year-picker'),
            $yearCells = $(idStr + '.year-box .year-cells table td');
        $yearPicker.on('click', function(event) {
            var $target = $(event.target);
            if ($target.hasClass('prev')) {
                pickedDate.setFullYear(pickedDate.getFullYear() - 10);
                this.updateYearBox(pickedDate);
                this.updateInput(pickedDate);
            } else if ($target.hasClass('next')) {
                pickedDate.setFullYear(pickedDate.getFullYear() + 10);
                this.updateYearBox(pickedDate);
                this.updateInput(pickedDate);
            }

        });
        $yearCells.each(function() {
            $(this).on('click', function(event) {
                pickedDate.setFullYear(parseInt($(event.target).text()));
                this.update(pickedDate);
                $(idStr + '.year-box').hide(300);
            });
        });

        $(idStr + '.month-box .month-cells table td').each(function() {
            $(this).on('click', function(event) {
                pickedDate.setMonth(parseInt($(event.target).text()) - 1);
                this.update(pickedDate);
                $(idStr + '.month-box').hide(300);
            });
        });
        $(idStr + '.date-input').on('change', function() {
            $(this).val();
            var ms = Date.parse($(this).val());
            if (!isNaN(ms)) {
                pickedDate.setTime(ms);
                $(idStr + '.month-box').hide();
                $(idStr + '.year-box').hide();
                this.update(pickedDate);
            }

        });
        $(idStr + '.date-input').click(function() {
            this.update(pickedDate);
            $(idStr + '.date-box').show();
        });
        $(idStr + 'span.btn-today').on('click', function() {
            pickedDate.setTime(new Date().getTime());
            this.update(pickedDate);
        });
        $(idStr + 'document').click();

    };

    this.render = function() {
        me.parentEl.innerHTML =
            '<div class="date-picker-wrapper" id="' + me.id + '"><input type="text" class="date-input" value="请选择日期"><div class="date-box box"><div class="date-picker picker"><span class="prev-year">&lt&lt</span><span class="prev-month">&lt</span><span class="cur-year">2016年</span><span class="cur-month">1月</span><span class="next-month">&gt</span><span class="next-year">&gt&gt</span></div><div class="date-cells cells"><table><thead><tr><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div><div class="today"><span class="btn-today">TODAY</span></div></div><div class="year-box box"><div class="year-picker picker"><span class="prev">&lt</span><span class="cur">data</span><span class="next">&gt</span></div><div class="year-cells cells"><table><tbody><tr><td>data</td><td>data</td><td>data</td></tr><tr><td>data</td><td>data</td><td>data</td></tr><tr><td>data</td><td>data</td><td>data</td></tr><tr><td>data</td></tr></tbody></table></div></div><div class="month-box box"><div class="month-picker picker"><span>1月</span></div><div class="month-cells cells"><table><tbody><tr><td>1月</td><td>2月</td><td>3月</td></tr><tr><td>4月</td><td>5月</td><td>6月</td></tr><tr><td>7月</td><td>8月</td><td>9月</td></tr><tr><td>10月</td><td>11月</td><td>12月</td></tr></tbody></table></div></div></div>';
        me.genDatePicker();
    };

}

DatePicker.prototype = {
    update: function(date) {
        this.updateDateBox(date);
        this.updateInput(date);
    },
    updateDateBox: function(date) {
        this.updateDatePicker(date);
        this.updateDateCells(date);
        this.chooseDate(date);
    },
    updateDatePicker: function(date) {
        $(idStr + '.date-picker .cur-year').text(date.getFullYear() + '年');
        $(idStr + '.date-picker .cur-month').text((date.getMonth() + 1) + "月");
    },
    updateDateCells: function(date) {
        var tempDate = new Date(date.getTime());
        //从上个月开始找,找到第一个星期一
        tempDate.setDate(-5);
        while (tempDate.getDay() !== 1) {
            this.toTomorrow(tempDate);
        }
        var $dateCells = $(idStr + '.date-cells table tbody td');
        $dateCells.each(function() {
            $(this).text(tempDate.getDate());
            $(this).myDate = new Date(tempDate.getTime());
            this.myDate = new Date(tempDate.getTime());
            $(this).removeClass('not-this-month');
            if (this.myDate.getMonth() !== date.getMonth()) {
                $(this).addClass('not-this-month');
            }
            this.toTomorrow(tempDate);
        });
    },
    chooseDate: function(date) {
        $(idStr + '.date-cells table tbody td').each(function() {
            $(this).removeClass('choosen');
            if (this.myDate.getFullYear() === date.getFullYear() &&
                this.myDate.getMonth() === date.getMonth() &&
                this.myDate.getDate() === date.getDate()) {
                $(this).addClass('choosen');
            }
        });

    },
    chooseYear: function(date) {
        $(idStr + '.year-cells table tbody td').each(function() {
            $(this).removeClass('choosen');
            if (parseInt($(this).text()) === date.getFullYear()) {
                $(this).addClass('choosen');
            }
        });
    },
    chooseMonth: function(date) {
        var $monthCells = $('.month-cells table tbody td');
        $monthCells.removeClass('choosen');
        $monthCells.eq(date.getMonth()).addClass('choosen');
    },
    updateYearBox: function(date) {
        this.updateYearPicker(date);
        this.updateYearCells(date);
        this.chooseYear(date);
    },
    updateYearPicker: function(date) {
        $(idStr + '.year-picker span.cur').text(date.getFullYear());
    },
    updateYearCells: function(date) {
        var cntYear = Math.floor(date.getFullYear() / 10) * 10;
        $(idStr + '.year-cells table td').each(function() {
            $(this).text(cntYear++);
        });
    },
    updateMonthBox: function(date) {
        this.updateMonthPicker(date);
        this.chooseMonth(date);
    },
    updateMonthPicker: function(date) {
        $(idStr + '.month-picker span').text((date.getMonth() + 1) + "月");
    },
    updateInput: function(date) {
        $(idStr + '.date-input').val(this.dateToStr(date));
    },
    dateToStr: function(date) {
        return date.getFullYear() + '-' + this.to2Bit(date.getMonth() + 1) + "-" + this.to2Bit(date.getDate());
    },
    to2Bit: function(n) {
        return n < 10 ? '0' + n : n;
    },
    toTomorrow: function(date) {
        return date.setTime(date.getTime() + 86400000);
    }
};

// DatePicker.prototype = {
//     // template: '<div class="date-picker-wrapper" id="' + this.id + '"><input type="text" class="date-input" value="2016-5-5"><div class="date-box box"><div class="date-picker picker"><span class="prev-year">&lt&lt</span><span class="prev-month">&lt</span><span class="cur-year">2016年</span><span class="cur-month">1月</span><span class="next-month">&gt</span><span class="next-year">&gt&gt</span></div><div class="date-cells cells"><table><thead><tr><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div><div class="today"><span class="btn-today">TODAY</span></div></div><!-- //////////////////////////////////////////////////// --><div class="year-box box"><div class="year-picker picker"><span class="prev">&lt</span><span class="cur">data</span><span class="next">&gt</span></div><div class="year-cells cells"><table><tbody><tr><td>data</td><td>data</td><td>data</td></tr><tr><td>data</td><td>data</td><td>data</td></tr><tr><td>data</td><td>data</td><td>data</td></tr><tr><td>data</td></tr></tbody></table></div></div><!-- //////////////////////////////////////////////////// --><div class="month-box box"><div class="month-picker picker"><span>1月</span></div><div class="month-cells cells"><table><tbody><tr><td>1月</td><td>2月</td><td>3月</td></tr><tr><td>4月</td><td>5月</td><td>6月</td></tr><tr><td>7月</td><td>8月</td><td>9月</td></tr><tr><td>10月</td><td>11月</td><td>12月</td></tr></tbody></table></div></div></div>',

//     render: function(id) {
//         this.parentEl.innerHTML =
//             '<div class="date-picker-wrapper" id="' + id + '"><input type="text" class="date-input" value="2016-5-5"><div class="date-box box"><div class="date-picker picker"><span class="prev-year">&lt&lt</span><span class="prev-month">&lt</span><span class="cur-year">2016年</span><span class="cur-month">1月</span><span class="next-month">&gt</span><span class="next-year">&gt&gt</span></div><div class="date-cells cells"><table><thead><tr><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div><div class="today"><span class="btn-today">TODAY</span></div></div><div class="year-box box"><div class="year-picker picker"><span class="prev">&lt</span><span class="cur">data</span><span class="next">&gt</span></div><div class="year-cells cells"><table><tbody><tr><td>data</td><td>data</td><td>data</td></tr><tr><td>data</td><td>data</td><td>data</td></tr><tr><td>data</td><td>data</td><td>data</td></tr><tr><td>data</td></tr></tbody></table></div></div><div class="month-box box"><div class="month-picker picker"><span>1月</span></div><div class="month-cells cells"><table><tbody><tr><td>1月</td><td>2月</td><td>3月</td></tr><tr><td>4月</td><td>5月</td><td>6月</td></tr><tr><td>7月</td><td>8月</td><td>9月</td></tr><tr><td>10月</td><td>11月</td><td>12月</td></tr></tbody></table></div></div></div>';
//     },
// };
