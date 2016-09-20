window.onload = function() {
    var today = new Date(),
        pickedDate = new Date(),
        oInfo = document.querySelector('.info'),
        prevMonth = document.querySelector('.prev-month'),
        nextMonth = document.querySelector('.next-month'),
        oDatePicker = document.querySelector('.date-picker'),
        oPickYear = document.querySelector('.pick-year'),
        oPickMonth = document.querySelector('.pick-month'),
        dateCells = document.querySelectorAll('.date-picker table tbody td'),
        oDateInput = document.querySelector('.date-input');

    var monthMask = document.querySelector('.mask.month'),
        yearMask = document.querySelector('.mask.year');
    showBox(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate());
    EventUtil.addHandler(oDatePicker, 'click', clickHandler);
    EventUtil.addHandler(oDateInput, 'focus', function() {
        oDatePicker.style.display = "block";
    })
    EventUtil.addHandler(oDateInput, 'change', inputChangeHandler);

    unitTest();

    function clickHandler(event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        // console.log(target);
        if (hasClass(target.parentNode, 'picker') && target.tagName.toUpperCase() === 'A') {
            switch (target.className) {
                case 'prev-year':
                    pickedDate.setFullYear(pickedDate.getFullYear() - 1);
                    break;
                case "next-year":
                    pickedDate.setFullYear(pickedDate.getFullYear() + 1);
                    break;
                case "prev-month":
                    pickedDate.setMonth(pickedDate.getMonth() - 1);
                    break;
                case "next-month":
                    pickedDate.setMonth(pickedDate.getMonth() + 1);
                    break;
                default:
                    break;
            }
            showBox(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate());
        }

        if (target.tagName.toLowerCase() === 'td') {
            setChoosen(target.myDate);
            oDateInput.value = dateToInputStr(pickedDate);
            oDatePicker.style.display = 'none';

        } else if (target.className === 'to-today' && target.tagName.toUpperCase() === 'A') {
            today = new Date();
            showBox(today.getFullYear(), today.getMonth(), today.getDate());
            oDateInput.value = dateToInputStr(pickedDate);
            // oDatePicker.style.display = 'none';

        } else if (hasClass(target, 'pick-year')) {
            showYearMask(pickedDate.getFullYear());
        } else if (hasClass(target, 'pick-month')) {
            showMonthMask();
        } else if (target.parentNode.parentNode === document.querySelector('.mask.month ul')) {
            // maskChooseMonth(event);
            var month = parseInt(target.innerHTML) - 1;
            pickedDate.setMonth(month);
            setChoosenMonth(month);
            monthMask.style.display = "none";
            showBox(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate());

        } else if (hasClass(target.parentNode, 'picker')) {
            if (hasClass(target, 'pageup')) {
                pickedDate.setFullYear(pickedDate.getFullYear() - 10);
                showYearMask(pickedDate.getFullYear());
                showBox(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate());

            } else if (hasClass(target, 'pagedown')) {
                pickedDate.setFullYear(pickedDate.getFullYear() + 10);
                showYearMask(pickedDate.getFullYear());
                showBox(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate());

            } else if (hasClass(target, 'mask-pick-year')) {

            }

        } else if (target.parentNode.parentNode === document.querySelector('.mask.year ul')) {
            var year = parseInt(target.innerHTML);
            pickedDate.setFullYear(year);
            setChoosenYear(year);
            yearMask.style.display = 'none';
            showBox(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate());

        }

    }

    function inputChangeHandler() {
        var ms = Date.parse(oDateInput.value);
        if (!isNaN(ms)) {
            pickedDate.setTime(ms);
            showBox(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate());
        }
    }

    function showYearMask(year) {
        var yearMask = document.querySelector('.mask.year'),
            yearCells = yearMask.querySelectorAll('ul li a'),
            cntYear = Math.floor(year / 10) * 10;
        for (var i = 0; i < 10; i++) {
            yearCells[i].innerHTML = cntYear;
            cntYear++;
        }
        yearMask.style.display = 'block';
        setChoosenYear(year);

    }

    function showMonthMask() {
        monthMask.style.display = 'block';
        monthMask.querySelector('.picker .mask-pick-month').innerHTML = (pickedDate.getMonth()) + 1 + "月";
        addClass(monthMask.querySelectorAll('ul li a')[pickedDate.getMonth()], 'choosen');

    }

    function showBox(year, month, day) {
        var date = new Date(year, month, day);

        pickedDate = new Date(year, month, day);
        oInfo.innerHTML = dateToStr(pickedDate);
        oPickYear.innerHTML = year + '年';
        oPickMonth.innerHTML = (month + 1) + '月';

        date.setDate(-5); //从上个月开始找,找到第一个星期一
        while (date.getDay() !== 1) {
            toTomorrow(date);
        }
        for (var i = 0; i < dateCells.length; i++) {
            dateCells[i].innerHTML = date.getDate();
            //每个单元格内有自定义属性myDate,存储了这个格子代表的date对象
            dateCells[i].myDate = new Date(date.getTime());
            if (date.getMonth() !== month) {
                dateCells[i].className = 'not-current-month';
            } else {
                dateCells[i].className = '';

            }
            toTomorrow(date);
        }
        setChoosen(pickedDate);
        oDateInput.value = dateToInputStr(pickedDate);

    }

    function setChoosenMonth(month) {
        var monthCells = document.querySelectorAll('.mask.month ul li a');
        for (var i = 0; i < monthCells.length; i++) {
            monthCells[i].className = '';
        }
        addClass(monthCells[month], 'choosen');
    }

    function setChoosenYear(year) {
        var yearCells = document.querySelectorAll('.mask.year ul li a');
        for (var i = 0; i < yearCells.length; i++) {
            yearCells[i].className = '';
        }
        addClass(yearCells[year % 10], 'choosen');
        document.querySelector('.mask.year .picker .mask-pick-year').innerHTML = year;

    }

    function setChoosen(date) {
        for (var i = 0; i < dateCells.length; i++) {
            var cell = dateCells[i],
                cellDate = cell.myDate;
            if (date.getFullYear() == cellDate.getFullYear() &&
                date.getMonth() == cellDate.getMonth() &&
                date.getDate() == cellDate.getDate()) {
                // cell.className += ' choosen';
                addClass(cell, 'choosen');

            } else {
                // removeClass(cell, 'choosen');
                cell.className = cell.className.replace(/choosen/g, '');
            }
        }
        pickedDate = new Date(date.getTime());
        oInfo.innerHTML = dateToStr(pickedDate);

    }
};

function dateToStr(date) {
    var weekdays = '日一二三四五六'
    return date.getFullYear() + '年' + (date.getMonth() + 1) + "月" + date.getDate() + "日 周" + weekdays.charAt(date.getDay());
}

function dateToInputStr(date) {
    return date.getFullYear() + '-' + to2Bit(date.getMonth() + 1) + "-" + to2Bit(date.getDate());
}

function to2Bit(n) {
    return n < 10 ? '0' + n : n;
}

function toTomorrow(date) {
    date.setTime(date.getTime() + 86400000);
}

//兼容IE的通用事件处理对象
EventUtil = {
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.detachEvent('on' + type, handler);
        } else {
            element['on' + type] = null;
        }
    }
};

function hasClass(el, className) {
    return RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}

function addClass(el, className) {
    if (el.className === "") {
        el.className = className;
    } else if (!hasClass(el, className)) {
        el.className += ' ' + className;
    }
}

function removeClass(el, className) {
    el.className = el.className.replace(new RegExp('^|\\b' + className + '\\b|$', 'gi'), ' ').replace(/\s+/, ' ');
}

function unitTest() {
    // var oTest = document.querySelector('.test');
    // removeClass(oTest, 'test2');
    // removeClass(oTest, 'choosen');

}
