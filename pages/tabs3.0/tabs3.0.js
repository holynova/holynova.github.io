
$(document).ready(function() {
	$('.tabs .tab').click(function(event) {
	var me = $(this);
	me.addClass('on').siblings('.tab').removeClass('on');
	
	// $('.content').hide().removeClass('fadeIn animated');
	$('.content').hide();
	var rel = me.attr('rel');
	console.log(rel);
	// $("#"+rel).show().addClass('fadeIn animated');
	$("#"+rel).show();


	});
});