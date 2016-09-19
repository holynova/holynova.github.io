window.onload = function() {
    var today = new Date(),
        pickedDate = new Date(),
        oInfo = document.querySelector('.info'),
        prevMonth = document.querySelector('.prev-month'),
        nextMonth = document.querySelector('.next-month'),
        oDatePicker = document.querySelector('.date-picker'),
        oPickYear = document.querySelector('.pick-year'),
        oPickMonth = document.querySelector('.pick-month'),
        dateCells = document.querySelectorAll('.date-picker table tbody td');
    showBox(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate());
    EventUtil.addHandler(oDatePicker, 'click', clickHandler);

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

        } else if (target.className === 'to-today' && target.tagName.toUpperCase() === 'A') {
            today = new Date();
            showBox(today.getFullYear(), today.getMonth(), today.getDate());

        } else if (hasClass(target, 'pick-year')) {
            showYearMask();

        } else if (hasClass(target, 'pick-month')) {
            showMonthMask();
        }
    }

    function showYearMask() {
        var yearMask = document.querySelector('.mask.year'),
            yearCells = yearMask.querySelectorAll('ul li a'),
            cntYear = pickedDate.getFullYear() - 6;
        for (var i = 0; i < yearCells.length; i++) {
            yearCells[i].innerHTML = cntYear++;
        }
        yearMask.style.display = 'block';


    }

    function showMonthMask() {
        var monthMask = document.querySelector('.mask.month');
        monthMask.style.display = 'block';

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
    }

    function setChoosen(date) {
        for (var i = 0; i < dateCells.length; i++) {
            var cell = dateCells[i],
                cellDate = cell.myDate;
            if (date.getFullYear() == cellDate.getFullYear() &&
                date.getMonth() == cellDate.getMonth() &&
                date.getDate() == cellDate.getDate()) {
                cell.className += ' choosen';

            } else {
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
