window.onload = function() {
    initTable(new Date());
    // initTable

    function initTable(oDate) {
        var dateCells = document.querySelectorAll('.date-picker table tbody td'),
            month = oDate.getMonth(),
            date = oDate.getDate(),
            year = oDate.getFullYear(),
            clone = new Date(year, month, date);
        clone.setDate(1);
        var weekdayOfFirst = clone.getDay() === 0 ? 7 : clone.getDay(); //每月1日是星期几 1234567没有0
        clone.setMonth((month + 1) % 12);
        clone.setDate(0);
        var numOfDays = clone.getDate(); //本月有多少天

        console.log('本月第一天是周' + weekdayOfFirst + ' 本月天数' + numOfDays);
        // var daysOfMonth = now
        var cntDay = 1;
        for (var i = weekdayOfFirst - 1; i < numOfDays + (weekdayOfFirst - 1); i++) {
            dateCells[i].innerHTML = cntDay;
            if (cntDay === date) {
                dateCells[i].className = 'today';
            } else {
                dateCells[i].className = '';
            }

            cntDay += 1;
        }
    }
};
