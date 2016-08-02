window.onload = function () {
	// alert('ready to work');

	var now = new Date();
	var start_date = new Date(now.getTime()+1000*5);
	var end_date = new Date(start_date.getTime()+1000*10);
	var timer = null;
	var count_down = document.getElementById('count_down');
	var tag_state = document.getElementById('tag_state');
	var input_start = document.getElementById('input_start');
	var input_end = document.getElementById('input_end');
	var btn_settime = document.getElementById('btn_set_time');
	input_start.value = get_date_str(start_date);
	input_end.value = get_date_str(end_date);

	show_date();
	run();
	btn_settime.addEventListener('click',set_time,false);

	timer = setInterval(run,1000);
	function run(){
		var now = new Date();
		if(now<start_date){
			count_down.innerHTML = get_diff_str(now,start_date);
			tag_state.innerHTML = '即将开始';
			tag_state.style.backgroundColor = "#8AA3D8";

		}
		else if(now >= start_date && now < end_date){
			count_down.innerHTML = get_diff_str(now,end_date);
			tag_state.innerHTML = '正在竞拍';
			tag_state.style.backgroundColor = "#60DA62";

		}
		else if(now > end_date){
			tag_state.innerHTML = '拍卖结束';
			tag_state.style.backgroundColor = "#ccc";
		}
	}

	function get_diff_str(date1,date2){
		//比较两个Date的时间差,返回一个描述时间差的字符串
		ms = date2.getTime() - date1.getTime();
		s = parseInt(ms/1000);
		days = parseInt(s/87600);
		s %= 87600;
		hours = parseInt(s/3600);
		s %= 3600;
		minutes = parseInt(s/60);
		seconds = s%60;
		return days+"天" + 
		to_two_bit_str(hours) +"小时"+
		to_two_bit_str(minutes)+"分钟"+
		to_two_bit_str(seconds)+"秒"; 
	}
	function show_date(argument) {
		var obj_show_date =  document.getElementById('show_date').getElementsByTagName("p");
		var obj_start = obj_show_date[0];
		var obj_end = obj_show_date[1];
		obj_start.innerHTML = "开始时间:" + get_date_str(start_date);
		obj_end.innerHTML = "结束时间:" + get_date_str(end_date);

	}

	function set_time(){
		// alert('set_time');
		
		start = Date.parse(input_start.value);
		end = Date.parse(input_end.value);
		// alert(start);
		if (!start || !end){
			alert('日期输入有错误');

		}
		else{
			start_date = new Date(start);
			end_date = new Date(end);
			// alert(start_date);
			show_date();
			run();  
			
		}


	}




}

function to_two_bit_str(n){
	return n<10? '0'+ n:n;
}
function get_date_str(date){
	return date.getFullYear()+"-"+
	(date.getMonth()+1)+"-"+
	date.getDate()+" "+
	// date.toLocaleDString
	date.toLocaleTimeString("chinese",{hour12:false});
}