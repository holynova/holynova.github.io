;
(function($) {
    $.fn.extend({
        //表格逐行变色
        alterBgColor: function(options) {
            //设置默认参数
            options = $.extend({
                oddRowClass: 'odd',
                evenRowClass: 'even',
                hoverRowClass: 'selected',
            }, options);
            $(this).each(function() {
                $(this).find('tbody>tr:odd').addClass(options.oddRowClass);
                $(this).find('tbody>tr:even').addClass(options.evenRowClass);
                $(this).find('tbody>tr').hover(function() {
                    $(this).toggleClass(options.hoverRowClass);
                });
            });
            return this;
        }
    });
})(jQuery);
