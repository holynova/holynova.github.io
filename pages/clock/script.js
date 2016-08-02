window.onload = function (){
	
	show();
	var timer = setInterval(show,1000);

	unit_test();
	function unit_test(){
		// show();

		// console.log(parseInt(get_time_str(new Date())));
		var str = parseInt(get_time_str(new Date()).replace(/\D/g,'')).toString(16);
		console.log(str);

	}

	function show(date){
		var now = new Date();
		var date_str = get_date_str(now);
		var time_str = get_time_str(now);
		var div_time = document.getElementById('my_time');
		var time_imgs = div_time.getElementsByTagName('img');

		for(var i=0; i<time_imgs.length-2; i++){
			var char = time_str.charAt(i);
			if(char != '-'){
				time_imgs[i].src = 'img/'+time_str.charAt(i)+'.png';
			}
		}

		var div_date = document.getElementById('my_date');
		var date_imgs = div_date.getElementsByTagName('img');

		for(var i=0; i<date_imgs.length-1; i++){
			var char = date_str.charAt(i);
			if(char != '-'){
				date_imgs[i].src = 'img/'+date_str.charAt(i)+'.png';
			}
		}
		var week_imgs = 'seven,one,two,three,four,five,six'.split(',');
		var week_img = time_imgs[time_imgs.length-1];
		week_img.src = 'img/'+week_imgs[now.getDay()]+'.png';
		change_bgc(now);

	}
	function get_date_str(date){
		var year = date.getFullYear();
		var month = to_double_str(parseInt(date.getMonth())+1);
		var day = to_double_str(date.getDate());
		return year+'-'+month+'-'+day;

	}
	function get_time_str(date){
		return to_double_str(date.getHours())+'-'+
			to_double_str(date.getMinutes())+'-'+
			to_double_str(date.getSeconds());


	}
	function to_double_str(num){
		return num<10 ? '0'+num : ''+num;
	}

	function change_bgc(date){
		//0-23
		//0-59
		//0-59
		var wrapper = document.getElementById('wrapper');
		var color = parseInt(get_time_str(date).replace(/\D/g,''));
	

		wrapper.style.backgroundColor = '#'+color;
		document.getElementById('my_color').getElementsByTagName('p')[0].innerHTML ="背景颜色:#"+color;

	}
	function change_range(num,from_max,to_max){
		return parseInt(num*(to_max+1)/(from_max+1));

	}
};

