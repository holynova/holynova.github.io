window.onload = function() {
    // initTable(new Date());
    // initTable
    var today = new Date(),
        pickedDate = new Date(),
        shownMonth = pickedDate.getMonth(),
        shownYear = pickedDate.getFullYear(),
        oInfo = document.querySelector('p.info'),
        prevMonth = document.querySelector('.prev-month'),
        nextMonth = document.querySelector('.next-month'),
        oDatePicker = document.querySelector('.date-picker'),
        oInputYear = document.querySelector('.input-year'),
        oInputMonth = document.querySelector('.input-month');

    showBox(pickedDate.getFullYear(), pickedDate.getMonth());
    EventUtil.addHandler(oDatePicker, 'click', clickHandler);
    // EventUtil.addHandler(oDatePicker,'changed')

    function clickHandler(event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        if (target.className === 'prev-month') {
            shownMonth--;
            if (shownMonth === -1) {
                shownMonth = 11;
                shownYear--;
            }
            showBox(shownYear, shownMonth);
            return false;
        } else if (target.className === 'next-month') {
            shownMonth++;
            if (shownMonth === 12) {
                shownMonth = 0;
                shownYear++;
            }
            showBox(shownYear, shownMonth);
            return false;
        } else if (target.tagName.toLowerCase() === 'td') {
            if (target.className === 'not-current-month') {

            } else {
                pickedDate.setFullYear(shownYear);
                pickedDate.setMonth(shownMonth);
                pickedDate.setDate(parseInt(event.target.innerHTML));
                showBox(shownYear, shownMonth);
                target.className = 'choosen';

            }
        }
    }

    function showBox(year, month) {
        var dateCells = document.querySelectorAll('.date-picker table tbody td'),
            date = new Date(year, month, 1),
            today = new Date();
        shownMonth = month;
        shownYear = year;
        oInfo.innerHTML = dateToStr(pickedDate);
        oInputYear.value = year;
        oInputMonth.value = month + 1;

        // curMonth.innerHTML = year + '年' + (month + 1) + "月";
        date.setDate(-5); //从上个月开始找,找到第一个星期一
        while (date.getDay() !== 1) {
            toTomorrow(date);
        }
        for (var i = 0; i < dateCells.length; i++) {
            dateCells[i].innerHTML = date.getDate();
            dateCells[i].className = date.getMonth() !== month ? 'not-current-month' : '';
            toTomorrow(date);
        }
    }
};

function dateToStr(date) {
    var weekdays = '日一二三四五六'
    return date.getFullYear() + '年' + (date.getMonth() + 1) + "月" + date.getDate() + "日 周" + weekdays.charAt(date.getDay());
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
