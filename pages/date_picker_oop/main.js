$(document).ready(function() {
    var myPickers = [];
    $('p').text('str');
    $('ul li.date').each(function() {
        var myPicker = new DatePicker(this, '');
        myPickers.push(myPicker);
        myPicker.render();
    });
    var str = '';
    $('ul li.date date-input').each(function() {
        var $me = $(this);
        $(this).on('click', function() {
            var str = '';
            for (var i = 0; i < myPickers.length; i++) {
                str += (i + 1) + ":" + $me.val();
            }
            $('p').text('changed');
        })
    });
});
