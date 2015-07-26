jQuery(document).ready(function($) {
	init();

	$('.tab_head').on('click','li',function(){
		$(this).siblings('li').removeClass('on');
		$(this).addClass('on');
		$('.tab_body li').css('display', 'none');
		//取得序号
		var this_index = $(this).index();
		$('.tab_body li:eq('+this_index+')').css('display', 'block');
		// $('tab_body li').index(this_index).css('display', 'block');
		// $(this).parent().siblings('.tab_body').find('li:eq('+$(this).index()+')').css('display', 'block');

	});
});

function init()
{
	console.log('ready to work');
	var default_on = $('.tab_head li.on').index();
	$('.tab_body li:eq('+default_on+')').css('display', 'block');

}