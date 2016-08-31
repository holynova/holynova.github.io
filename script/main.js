var speed_in_ms = 500;
$(document).ready(function() {
    init();
    $('ul>a').each(function() {
        $(this).on('click', function() {
            // var lis = $(this).siblings('li');
            if ($(this).siblings('li').is(':hidden')) {
                $('li').hide(speed_in_ms);
                $(this).siblings('li').show(speed_in_ms);
            } else {
                $(this).siblings('li').hide(speed_in_ms);
            }
        });
    });
});

function init() {
    // console.log("ready to work");
    $('li').hide();
}
