$(document).ready(function() {
    var myPickers = [];
    $('p').text('str');
    $('ul li.date').each(function() {
        var myPicker = new DatePicker(this, '');
        myPicker.render();
        myPickers.push(myPicker);
    });
    console.log(myPickers);
    var str = '';
    // console.log($('ul li.date .date-input').length);
    $('ul li.date .date-input').each(function() {
        var $me = $(this);
        $me.on('change', function() {
            console.log('changed');
            // $me.parents('li').silblings('span.result').html($me.value);
            /*  $('span.result').each(function() {
                  console.log(myPickers[0].date);
                  $(this).html(myPickers[0].date);
              });*/

            // myPickers[]
        });
        // $(this).on('click', function() {
        //     var str = '';
        //     for (var i = 0; i < myPickers.length; i++) {
        //         str += (i + 1) + ":" + $me.val();
        //     }
        //     $('p').text('changed');
        // })
    });
});
