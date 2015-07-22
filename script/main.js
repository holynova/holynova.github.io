$(document).ready(function() {
	init();
	$('ul>a').each(function(){
		$(this).on('click',function(){
			$(this).siblings('li').toggle('fast');
		});
	});
});



function init()
{
	console.log("ready to work");	
	$('li').hide();
}

