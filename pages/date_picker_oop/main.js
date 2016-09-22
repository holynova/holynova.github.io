$('document').ready(function() {
    var t1 = new DatePicker(document.querySelector('.box1'), 'box1');
    var t2 = new DatePicker(document.querySelector('.box2'), 'box2');

    // console.log(t1.id);
    t1.render();
    t2.render();
    $(document).click(function() {
        console.log('t1 = %s,t2 = %s', t1.date, t2.date);
    });
});
