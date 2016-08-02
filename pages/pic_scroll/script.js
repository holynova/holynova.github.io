window.onload = function(){

	var div_wrapper = document.getElementById('wrapper');
	var div_up = document.getElementById('up');
	var div_down = document.getElementById('down');
	var img = document.getElementsByTagName('img')[0];
	var timer = null;

	unit_test();
	function unit_test(){
		var str;
		str = get_style(div_up,'backgroundColor');
		console.log(str);
	}
	div_wrapper.addEventListener('mouseover',function(e){
		// clearInterval(timer);
		timer = setInterval(move,30);
		function move(){
			var min = -(3895-400);
			var max = 0;
			var speed = 10;
			var top = parseInt(get_style(img,'top'));
			if(e.target.id == 'up'){
				top -= speed;
				if(top <= min){
					top = min;
				}
				img.style.top = top+"px";
			}
			else if(e.target.id == 'down'){
				top += speed;
				if(top >= max){
					top = max;
				}
				img.style.top = top+"px";
			}
		}


	},false);
	div_wrapper.addEventListener('mouseout',function(e){
		clearInterval(timer);
	},false);
	



	function get_style(element,style_str){
		return (element.currentStyle || getComputedStyle(element,null))[style_str];
	}
};
