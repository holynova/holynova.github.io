window.onload = function (){
	console.log('ready to work');
	var now = new Date();
	var seconds_to_start = 5;
	var start_time = new Date(now.getTime()+seconds_to_start*1000);
	var duration_seconds = 10;
	var end_time = new Date(start_time.getTime()+duration_seconds*1000);
	var timer = null;
	var div_countdown = document.getElementById("count_down");
	var div_tag = document.getElementById("tag");

	clearInterval(timer);
	run();
	timer = setInterval(run,1000);

	function run(){
		var now = new Date();
		// div_tag.innerHTML = '即将开始';
		if(now < start_time){
			div_countdown.innerHTML = '倒计时:'+get_diff_str(now,start_time);
		}
		else if((now - start_time)>0 && (now - start_time)<100)
		{
			div_tag.innerHTML = "正在拍卖";
			div_tag.style.backgroundColor = "#84D8CB";
			div_countdown.innerHTML = "结束倒计时:"+get_diff_str(now,end_time);

		}
		else if (now > start_time && now < end_time)
		{
			div_countdown.innerHTML = "结束倒计时:"+get_diff_str(now,end_time);
		}
		else
		{
			clearInterval(timer);
			div_tag.innerHTML = "拍卖已结束";
			div_countdown.innerHTML = "拍卖已结束";

			div_tag.style.backgroundColor = "#EAF2BF";

		}



	}


};

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
	return days+"天" + hours +"小时"+minutes+"分钟"+seconds+"秒"; 
}

