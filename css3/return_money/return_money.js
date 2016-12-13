$(function() {
    // console.log('ready');
    init();
    bindEvents();
    calculateInterest();

    function init() {
        initBorrow();
        initReturn();
        initInterest();
    }

    function bindEvents() {
        $('.borrow-form').on('click', '.btn-add', function() {
            addBorrowRow();
            refreshBorrowSum();
            refreshReturnPercent();
            refreshReturnSum();
        }).on('click', '.btn-del', function() {
            var $tr = $(this).parents('tr.row');
            $tr.remove();
            refreshBorrowIndex();
            refreshBorrowSum();
            refreshReturnPercent();
            refreshReturnSum();
            calculateInterest();
        }).on('change', 'input', function() {
            refreshBorrowSum();
            refreshReturnPercent();
            refreshReturnSum();
        });
        $('.return-form').on('click', '.btn-add', function() {
            addReturnRow();
            refreshReturnSum();
        }).on('click', '.btn-del', function() {
            $(this).parents('tr.row').remove();
            refreshReturnIndex();
            refreshReturnSum();
            calculateInterest();
        }).on('change', 'input', function() {
            refreshReturnSum();
        }).on('change', 'input[type="number"]', function() {
            var $tr = $(this).parents('tr.row');
            var totalBorrow = parseFloat($('.borrow-form tr.sum td:eq(2)').html());
            var value = $(this).val();
            var percent = (value / totalBorrow * 100).toFixed(2) + '%';
            $tr.children('td:eq(3)').html(percent);
        });
        $('.interest-form').on('change', 'input', refreshInterest).on('change', 'select', refreshInterest);
        //重新计算利息
        $('.wrapper').on('change', 'select', calculateInterest)
            .on('change', 'input', calculateInterest)
            .on('click', '.btn-add', calculateInterest)
            .on('focus', 'input', function() {
                $(this).select();
            });
        // console.log($('.wrapper .btn-del').length);
    }

    function initInterest() {
        refreshInterest();
    }

    function initBorrow() {
        var N = 1;
        var htmlStr = '';
        var today = new Date();
        for (var i = 0; i < N; i++) {
            addBorrowRow(today, 0);
            // addBorrowRow(new Date(2015, randBetween(1, 12), randBetween(1, 28)), (i + 1) * 10000);
        }
        refreshBorrowSum();
    }

    function refreshInterest() {
        var base = $('.interest-form select').val();
        var ratio = $('.interest-form input[type = "number"]').val();
        var interest = (parseFloat(base) * parseFloat(ratio)).toFixed(2) + '%';
        // console.log(interest);
        $('.interest-form tbody tr td:eq(2)').html(interest);
    }

    function initReturn() {
        var N = 1;
        var htmlStr = '';
        var today = new Date();
        for (var i = 0; i < N; i++) {
            // addReturnRow(new Date(2016, randBetween(1, 12), randBetween(1, 28)), (i + 1) * 10000);
            addReturnRow(today, 0);
        }
        refreshReturnSum();
    }

    function addBorrowRow(date, value) {
        date = date || new Date();
        value = value || 0;
        var $sum = $('.borrow-form tbody tr.sum');
        var index = $('.borrow-form tbody tr.row').length + 1;
        var $tr = $(getBorrowRow(index, date, value));
        $tr.insertBefore($sum);
    }

    function addReturnRow(date, value) {
        date = date || new Date();
        value = value || 0;
        var $sum = $('.return-form tbody tr.sum');
        var index = $('.return-form tbody tr.row').length + 1;
        var $tr = $(getReturnRow(index, date, value));
        var totalReturn = parseFloat($('.borrow-form tr.sum td:eq(2)').html());
        $tr.children('td:eq(3)').html((value / totalReturn * 100).toFixed(2) + '%');
        $tr.insertBefore($sum);
    }
    // function delBorrowRow($row) {}
    function getBorrowRow(index, date, value) {
        index = index || 1;
        date = date || new Date();
        if (typeof value === 'undefined') {
            value = 0;
        }
        return '<tr class = "row"><td>' + index +
            '</td><td><input type="date" value = "' + date2str(date) +
            '"></td><td><input type="number" value="' + value.toFixed(2) +
            '"></td><td><input type="button" class = "btn-del" value="x"></td>></tr>'
    }

    function getReturnRow(index, date, value) {
        index = index || 1;
        date = date || new Date();
        if (typeof value === 'undefined') {
            value = 0;
        }
        return '<tr class="row"><td>' + index +
            '</td><td><input type="date" value="' + date2str(date) +
            '"></td><td><input type="number" value="' + value.toFixed(2) +
            '"></td><td>还款百分比</td><td><input type="button" class = "btn-del" value="x"></td></tr>';
    }

    function refreshBorrowIndex() {
        $('.borrow-form tr.row').each(function(index, elem) {
            $(elem).children('td:first').html(index + 1);
        })
    }

    function refreshReturnIndex() {
        $('.return-form tr.row').each(function(index, elem) {
            $(elem).children('td:first').html(index + 1);
        })
    }

    function refreshReturnPercent() {
        var totalBorrow = parseFloat($('.borrow-form tr.sum td:eq(2)').html());
        $('.return-form tr.row').each(function(index, elem) {
            var value = parseFloat($(elem).find('input[type="number"]').val());
            var percent = (value / totalBorrow * 100).toFixed(2) + '%';
            $(elem).children('td:eq(3)').html(percent);
        });
    }

    function refreshBorrowSum() {
        var total = 0;
        $('.borrow-form input[type="number"]').each(function() {
            total += parseFloat($(this).val());
        });
        $('.borrow-form tr.sum td:eq(2)').html(total.toFixed(2));
    }

    function refreshReturnSum() {
        var total = 0;
        $('.return-form input[type="number"]').each(function() {
            total += parseFloat($(this).val());
        });
        $('.return-form tr.sum td:eq(2)').html(total.toFixed(2));
        var totalBorrow = parseFloat($('.borrow-form tr.sum td:eq(2)').html());
        var totalPercent = (total / totalBorrow * 100).toFixed(2) + '%';
        $('.return-form tr.sum td:eq(3)').html(totalPercent);
        //最晚一笔还款的时间
    }

    function calculateInterest() {
        var interestRate = parseFloat($('.interest-form tbody td:last').html());
        var borrowData = [];
        $('.borrow-form tbody tr.row').each(function(index, elem) {
            var row = {};
            row.date = new Date($(elem).find('input[type="date"]').val());
            row.value = parseFloat($(elem).find('input[type="number"]').val());
            borrowData.push(row);
        });
        var returnData = [];
        var lastReturnDate = new Date(0);
        $('.return-form tbody tr.row').each(function(index, elem) {
            var row = {};
            row.date = new Date($(elem).find('input[type="date"]').val());
            if (row.date > lastReturnDate) {
                lastReturnDate = row.date;
            }
            row.value = parseFloat($(elem).find('input[type="number"]').val());
            returnData.push(row);
        });
        var borrowInterest = 0;
        for (var i = 0, len = borrowData.length; i < len; i++) {
            var interest = borrowData[i].value * interestRate / 100 * (lastReturnDate - borrowData[i].date) / (1000 * 3600 * 24) / 365;
            borrowInterest += interest;
        }
        var returnInterest = 0;
        for (var i = 0, len = returnData.length; i < len; i++) {
            var interest = returnData[i].value * interestRate / 100 * (lastReturnDate - returnData[i].date) / (1000 * 3600 * 24) / 365;
            returnInterest += interest;
        }
        console.log(borrowData.length, returnData.length);
        $('.result span.last-return-date').html(lastReturnDate.toLocaleDateString());
        console.log(borrowInterest, returnInterest);
        $('.result span.total-interest').html((-returnInterest + borrowInterest).toFixed(2));
        // $('.result span.all').html((-returnInterest + borrowInterest).toFixed(2));
    }

    function date2str(date) {
        return date.getFullYear() + '-' +
            toDouble(date.getMonth() + 1) + '-' +
            toDouble(date.getDate());
    }

    function toDouble(num) {
        return num > 9 ? '' + num : '0' + num;
    }

    function randBetween(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }
});
