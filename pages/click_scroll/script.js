window.onload = function(){
	// var up = document.getElementById('up').getElementsByTagName('a')[0];
	// var down = document.getElementById('down').getElementsByTagName('a')[0];
	// var wrapper = document.getElementById('wrapper');
	var ul = document.getElementById('content').getElementsByTagName('ul')[0];
	// var ul = document.getElementById('content').getElementsByTagName('ul')[0];
	var timer = null;
	var ul_height = parseInt(get_style(ul,'height'));
	var content_height = parseInt(get_style(document.getElementById('content'),'height'));

	wrapper.addEventListener('mousedown',run,false);
	function run(event){
		var min_top = content_height - ul_height;
		var max_top = 0;

		clearInterval(timer);
		timer = setInterval(scroll,30);
		function scroll(){
			var top = parseInt(get_style(ul,'top'));
			if(event.target.id == 'up_a'){
				top -= 20;
				if(top <= min_top){
					top = min_top;
				}

			}else if(event.target.id == 'down_a'){
				top += 20;
				if(top>= max_top){
					top = max_top;
				}
			}
			ul.style.top = top +'px';
		}

	}
	wrapper.addEventListener('mouseup',function(){
		clearInterval(timer);
	},false);
	function get_style(element,style_str){
		return (element.currentStyle||getComputedStyle(element,false))[style_str];
	}
};