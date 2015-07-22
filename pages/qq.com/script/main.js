$(document).ready(function  (argument) {
	console.log('ready to work');
	$('#search_dropdown').hover(function() {
		$('#search form>ul>li>ul').css('display', 'block');
		$('#search form>ul').css('border', '1px solid blue');

	}, function() {
		$('#search form>ul>li>ul').css('display', 'none');
	});

	$('#my_star').change(function()
	{
		var pos = $('#my_star').val()*50;
		

		$('.star_pic').css('background-position', '0 '+pos+'px');
	});

})