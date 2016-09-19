var DatePicker = function(data) {
    this.id = Date.now();
    for (var key in data) {
        this.key = data.key;
    }

}

DatePicker.prototype = {
    show: function(year, month) {

    },
    init: function() {
        var now = new Date();
        creat();
        show(now.getFullYear(), now.getMonth())
    },
    creat: function() {

    }
};
