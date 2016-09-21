$(document).ready(function() {
    // init();
    genDatePicker(new Date(2016, 10, 11));
});

function init() {
    // console.log('ready');
    var pickedDate = new Date(1999, 8, 9);
    updateDateBox(pickedDate);
    updateYearBox(pickedDate);
    updateMonthBox(pickedDate);
}

function genDatePicker(date) {
    updateDateBox(date);
    updateInput(date);
    // events
    var pickedDate = new Date(date.getTime());
    var datePicker = $('.picker.date-picker');
    datePicker.on('click', function(event) {
        var $target = $(event.target);
        if ($target.hasClass('cur-year')) {
            updateYearBox(pickedDate);
            $('.box.year-box').show();
        } else if ($target.hasClass('cur-month')) {
            updateMonthBox(pickedDate);
            $('.box.month-box').show();
        } else if ($target.hasClass('prev-year')) {
            pickedDate.setFullYear(pickedDate.getFullYear() - 1);
            update(pickedDate);
        } else if ($target.hasClass('next-year')) {
            pickedDate.setFullYear(pickedDate.getFullYear() + 1);
            update(pickedDate);
        } else if ($target.hasClass('prev-month')) {
            pickedDate.setMonth(pickedDate.getMonth() - 1);
            update(pickedDate);
        } else if ($target.hasClass('next-month')) {
            pickedDate.setMonth(pickedDate.getMonth() + 1);
            update(pickedDate);
        }

    });

    var $dateCells = $('.date-cells table tbody td');
    $dateCells.each(function() {
        $(this).on('click', function(event) {
            pickedDate.setTime(event.target.myDate.getTime());
            chooseDate(pickedDate);
            updateInput(pickedDate);
            $('.date-box').hide();
        })
    });

    var $yearPicker = $('.year-box .year-picker'),
        $yearCells = $('.year-box .year-cells table td');
    $yearPicker.on('click', function(event) {
        var $target = $(event.target);
        if ($target.hasClass('prev')) {
            pickedDate.setFullYear(pickedDate.getFullYear() - 10);
            updateYearBox(pickedDate);
            updateInput(pickedDate);
        } else if ($target.hasClass('next')) {
            pickedDate.setFullYear(pickedDate.getFullYear() + 10);
            updateYearBox(pickedDate);
            updateInput(pickedDate);
        }

    });
    $yearCells.each(function() {
        $(this).on('click', function(event) {
            pickedDate.setFullYear(parseInt($(event.target).text()));
            update(pickedDate);
            $('.year-box').hide(300);
        });
    });

    $('.month-box .month-cells table td').each(function() {
        $(this).on('click', function(event) {
            pickedDate.setMonth(parseInt($(event.target).text()) - 1);
            update(pickedDate);
            $('.month-box').hide(300);
        });
    });
    $('.date-input').on('change', function() {
        $(this).val();
        var ms = Date.parse($(this).val());
        if (!isNaN(ms)) {
            pickedDate.setTime(ms);
            $('.month-box').hide();
            $('.year-box').hide();
            update(pickedDate);
        }

    });
    $('.date-input').click(function() {
        $('.date-box').show();
    });
    $('span.btn-today').on('click', function() {
        pickedDate.setTime(new Date().getTime());
        update(pickedDate);
    });
}

// ----------------------------------------------------------

// ----------------------------------------------------------

function update(date) {
    updateDateBox(date);
    updateInput(date);
}

function updateDateBox(date) {
    updateDatePicker(date);
    updateDateCells(date);
    chooseDate(date);
}

function updateDatePicker(date) {
    $('.date-picker .cur-year').text(date.getFullYear() + '年');
    $('.date-picker .cur-month').text((date.getMonth() + 1) + "月");
}

function updateDateCells(date) {
    var tempDate = new Date(date.getTime());
    //从上个月开始找,找到第一个星期一
    tempDate.setDate(-5);
    while (tempDate.getDay() !== 1) {
        toTomorrow(tempDate);
    }
    var $dateCells = $('.date-cells table tbody td');
    $dateCells.each(function() {
        $(this).text(tempDate.getDate());
        $(this).myDate = new Date(tempDate.getTime());
        this.myDate = new Date(tempDate.getTime());
        $(this).removeClass('not-this-month');
        if (this.myDate.getMonth() !== date.getMonth()) {
            $(this).addClass('not-this-month');
        }
        toTomorrow(tempDate);
    });
}
// ----------------------------------------------------------

function chooseDate(date) {
    $('.date-cells table tbody td').each(function() {
        $(this).removeClass('choosen');
        if (this.myDate.getFullYear() === date.getFullYear() &&
            this.myDate.getMonth() === date.getMonth() &&
            this.myDate.getDate() === date.getDate()) {
            $(this).addClass('choosen');
        }
    });

}

function chooseYear(date) {
    $('.year-cells table tbody td').each(function() {
        $(this).removeClass(('choosen'));
        if (parseInt($(this).text()) === date.getFullYear()) {
            $(this).addClass('choosen');
        }
    });
}

function chooseMonth(date) {
    var $monthCells = $('.month-cells table tbody td');
    $monthCells.removeClass('choosen');
    $monthCells.eq(date.getMonth()).addClass('choosen');
}

// ----------------------------------------------------------
function updateYearBox(date) {
    updateYearPicker(date);
    updateYearCells(date);
    chooseYear(date);
}

function updateYearPicker(date) {
    $('.year-picker span.cur').text(date.getFullYear());
}

function updateYearCells(date) {
    var cntYear = Math.floor(date.getFullYear() / 10) * 10;
    $('.year-cells table td').each(function() {
        $(this).text(cntYear++);
    });
}
// ----------------------------------------------------------
function updateMonthBox(date) {
    updateMonthPicker(date);
    chooseMonth(date);
}

function updateMonthPicker(date) {
    $('.month-picker span').text((date.getMonth() + 1) + "月");
}
// ----------------------------------------------------------
function updateInput(date) {
    $('.date-input').val(dateToStr(date));
}

function dateToStr(date) {
    return date.getFullYear() + '-' + to2Bit(date.getMonth() + 1) + "-" + to2Bit(date.getDate());
}

function to2Bit(n) {
    return n < 10 ? '0' + n : n;
}

function toTomorrow(date) {
    return date.setTime(date.getTime() + 86400000);
}

function unitTest() {
    console.log($('.wrapper'));
}
