var DatePicker = function(parentEl) {
    this.id = 'datePicker' + new Date().getTime();
    this.parentEl = parentEl;
    this.date = new Date();
}
DatePicker.prototype = {
    getTemplate: function(id) {
        return '<div class="date-picker-wrapper" id="' + id + '"><input type="text" class="date-input" value="请选择日期"><div class="date-box box"><div class="date-picker picker"><span class="prev-year">&lt&lt</span><span class="prev-month">&lt</span><span class="cur-year">2016年</span><span class="cur-month">1月</span><span class="next-month">&gt</span><span class="next-year">&gt&gt</span></div><div class="date-cells cells"><table><thead><tr><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div><div class="today"><span class="btn-today">TODAY</span></div></div><div class="year-box box"><div class="year-picker picker"><span class="prev">&lt</span><span class="cur">data</span><span class="next">&gt</span></div><div class="year-cells cells"><table><tbody><tr><td>data</td><td>data</td><td>data</td></tr><tr><td>data</td><td>data</td><td>data</td></tr><tr><td>data</td><td>data</td><td>data</td></tr><tr><td>data</td></tr></tbody></table></div></div><div class="month-box box"><div class="month-picker picker"><span>1月</span></div><div class="month-cells cells"><table><tbody><tr><td>1月</td><td>2月</td><td>3月</td></tr><tr><td>4月</td><td>5月</td><td>6月</td></tr><tr><td>7月</td><td>8月</td><td>9月</td></tr><tr><td>10月</td><td>11月</td><td>12月</td></tr></tbody></table></div></div></div>';
    },
    update: function(date, id) {
        this.updateDateBox(date, id);
        this.updateInput(date, id);
    },
    updateDateBox: function(date, id) {
        this.updateDatePicker(date, id);
        this.updateDateCells(date, id);
        this.chooseDate(date, id);
    },
    updateDatePicker: function(date, id) {
        $('.date-picker-wrapper#' + id + " " + '.date-picker .cur-year').text(date.getFullYear() + '年');
        $('.date-picker-wrapper#' + id + " " + '.date-picker .cur-month').text((date.getMonth() + 1) + "月");
    },
    updateDateCells: function(date, id) {
        var tempDate = new Date(date.getTime());
        //从上个月开始找,找到第一个星期一
        tempDate.setDate(-5);
        while (tempDate.getDay() !== 1) {
            this.toTomorrow(tempDate);
        }
        var $dateCells = $('.date-picker-wrapper#' + id + " " + '.date-cells table tbody td');
        var me = this;
        $dateCells.each(function() {
            $(this).text(tempDate.getDate());
            $(this).myDate = new Date(tempDate.getTime());
            this.myDate = new Date(tempDate.getTime());
            $(this).removeClass('not-this-month');
            if (this.myDate.getMonth() !== date.getMonth()) {
                $(this).addClass('not-this-month');
            }
            me.toTomorrow(tempDate);
        });
    },
    chooseDate: function(date, id) {
        $('.date-picker-wrapper#' + id + " " + '.date-cells table tbody td').each(function() {
            $(this).removeClass('choosen');
            if (this.myDate.getFullYear() === date.getFullYear() &&
                this.myDate.getMonth() === date.getMonth() &&
                this.myDate.getDate() === date.getDate()) {
                $(this).addClass('choosen');
            }
        });
    },
    chooseYear: function(date, id) {
        $('.date-picker-wrapper#' + id + " " + '.year-cells table tbody td').each(function() {
            $(this).removeClass('choosen');
            if (parseInt($(this).text()) === date.getFullYear()) {
                $(this).addClass('choosen');
            }
        });
    },
    chooseMonth: function(date, id) {
        var $monthCells = $('.date-picker-wrapper#' + id + " " + '.month-cells table tbody td');
        $monthCells.removeClass('choosen');
        $monthCells.eq(date.getMonth()).addClass('choosen');
    },
    updateYearBox: function(date, id) {
        this.updateYearPicker(date, id);
        this.updateYearCells(date, id);
        this.chooseYear(date, id);
    },
    updateYearPicker: function(date, id) {
        $('.date-picker-wrapper#' + id + " " + '.year-picker span.cur').text(date.getFullYear());
    },
    updateYearCells: function(date, id) {
        var cntYear = Math.floor(date.getFullYear() / 10) * 10;
        $('.date-picker-wrapper#' + id + " " + '.year-cells table td').each(function() {
            $(this).text(cntYear++);
        });
    },
    updateMonthBox: function(date, id) {
        this.updateMonthPicker(date, id);
        this.chooseMonth(date, id);
    },
    updateMonthPicker: function(date, id) {
        $('.date-picker-wrapper#' + id + " " + '.month-picker span').text((date.getMonth() + 1) + "月");
    },
    updateInput: function(date, id) {
        $('.date-picker-wrapper#' + id + " " + '.date-input').val(this.dateToStr(date));
        //2016年11月16日添加 ,每次选择和改变后,将picker的日期属性更新
        this.date = date;
        console.log('updateInput ' + this.date);
    },
    dateToStr: function(date) {
        return date.getFullYear() + '-' + this.to2Bit(date.getMonth() + 1) + "-" + this.to2Bit(date.getDate());
    },
    to2Bit: function(n) {
        return n < 10 ? '0' + n : n;
    },
    toTomorrow: function(date) {
        return date.setTime(date.getTime() + 86400000);
    },
    bindEvents: function(pickedDate, id) {
        var me = this,
            idStr = '.date-picker-wrapper#' + id + " ",
            datePicker = $('.date-picker-wrapper#' + id + " " + '.picker.date-picker');
        me.updateDateBox(me.date, id);
        me.updateInput(me.date, id);
        datePicker.on('click', function(event) {
            var $target = $(event.target);
            if ($target.hasClass('cur-year')) {
                me.updateYearBox(pickedDate, id);
                $(idStr + '.box.year-box').slideDown(250);
            } else if ($target.hasClass('cur-month')) {
                me.updateMonthBox(pickedDate, id);
                $(idStr + '.box.month-box').slideDown(250);
            } else if ($target.hasClass('prev-year')) {
                pickedDate.setFullYear(pickedDate.getFullYear() - 1);
                me.update(pickedDate, id);
            } else if ($target.hasClass('next-year')) {
                pickedDate.setFullYear(pickedDate.getFullYear() + 1);
                me.update(pickedDate, id);
            } else if ($target.hasClass('prev-month')) {
                pickedDate.setMonth(pickedDate.getMonth() - 1);
                me.update(pickedDate, id);
            } else if ($target.hasClass('next-month')) {
                pickedDate.setMonth(pickedDate.getMonth() + 1);
                me.update(pickedDate, id);
            }
        });
        var $dateCells = $(idStr + '.date-cells table tbody td');
        $dateCells.each(function() {
            $(this).on('click', function(event) {
                pickedDate.setTime(event.target.myDate.getTime());
                me.chooseDate(pickedDate, id);
                me.updateInput(pickedDate, id);
                $(idStr + '.date-box').slideUp(250);
            })
        });
        var $yearPicker = $(idStr + '.year-box .year-picker'),
            $yearCells = $(idStr + '.year-box .year-cells table td');
        $yearPicker.on('click', function(event) {
            var $target = $(event.target);
            if ($target.hasClass('prev')) {
                pickedDate.setFullYear(pickedDate.getFullYear() - 10);
                me.updateYearBox(pickedDate, id);
                me.updateInput(pickedDate, id);
            } else if ($target.hasClass('next')) {
                pickedDate.setFullYear(pickedDate.getFullYear() + 10);
                me.updateYearBox(pickedDate, id);
                me.updateInput(pickedDate, id);
            }
        });
        $yearCells.each(function() {
            $(this).on('click', function(event) {
                pickedDate.setFullYear(parseInt($(event.target).text()));
                me.update(pickedDate, id);
                $(idStr + '.year-box').slideUp(250);
            });
        });
        $(idStr + '.month-box .month-cells table td').each(function() {
            $(this).on('click', function(event) {
                pickedDate.setMonth(parseInt($(event.target).text()) - 1);
                me.update(pickedDate, id);
                $(idStr + '.month-box').slideUp(250);
            });
        });
        $(idStr + '.date-input').on('change', function() {
            $(this).val();
            var ms = Date.parse($(this).val());
            if (!isNaN(ms)) {
                pickedDate.setTime(ms);
                $(idStr + '.month-box').slideUp(250);
                $(idStr + '.year-box').slideUp(250);
                me.update(pickedDate, id);
            }
        });
        $(idStr + '.date-input').click(function() {
            me.update(pickedDate, id);
            $(idStr + '.date-box').slideDown(250);
            $(document).on('click', clickOtherToHide);
        });
        $(idStr + 'span.btn-today').on('click', function() {
            pickedDate.setTime(new Date().getTime());
            me.update(pickedDate, id);
        });

        function clickOtherToHide() {
            var $thisDateBox = $(idStr + '.date-box');
            // console.log($(event.target) !== $thisDateBox);
            // console.log($(event.target).parents(idStr + '.date-box').length === 0);
            if ($(event.target).parents(idStr).length === 0) {
                $thisDateBox.slideUp(250);
                $(idStr + '.year-box').slideUp(250);
                $(idStr + '.month-box').slideUp(250);
                $('document').off('click', clickOtherToHide);
            }
        }
    },
    render: function() {
        $(this.parentEl).html(this.getTemplate(this.id));
        this.bindEvents(this.date, this.id);
    }
};
