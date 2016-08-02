window.onload = function(){
	timer = null;

	//定义节日数据结构
	var Festival = function(name,month,day){
		this.name = name;
		this.month = month;
		this.day = day;
	};
	
	//全局变量festivals
	festivals = []
	festivals = [
	new Festival('元旦',1,1),
	new Festival('劳动节',5,1),
	new Festival('儿童节',6,1),
	new Festival('国庆节',10,1),
	new Festival('我生日',10,18),]
	//生成下拉菜单option选项
	var selecter = document.getElementById('select_festivals');
	for(var i = 0; i<festivals.length; i++){
		var item = festivals[i];
		// console.log(item.name+"是"+item.month+"月"+item.day+"日");
		var option = document.createElement('option');
		option.setAttribute('value',i);
		option.text = item.name;
		// console.log(item.name);
		// option.firstChild.data = item.name;
		selecter.appendChild(option);
	}
	change_fest();
	selecter.addEventListener('change',change_fest,false);
	unit_test();


	// var test_selecter = document.getElementById('test_select');
	// var test_options = test_selecter.getElementsByTagName('option');

}

function change_fest(){
	var spans = document.getElementsByTagName('span');
	var span_fest = spans[0];
	var span_date = spans[1];
	var fest_index = document.getElementById('select_festivals').value;
	next_fest = get_next_fest(festivals[fest_index].month,festivals[fest_index].day)
	span_fest.innerHTML = festivals[fest_index].name;
	span_date.innerHTML = "("+date_to_str(next_fest)+")";

	clearInterval(timer);
	renew_countdown();
	timer = setInterval(renew_countdown,1000);
}
function renew_countdown(){
	var o_time = wrapper.getElementsByTagName('p')[1];
	o_time.innerHTML = get_countdown_str(next_fest);	

}

function unit_test(){
	// console.log(get_next_fest(10,1));
	// console.log(get_next_fest(5,1));
	// str = date_to_str(new Date());
	// console.log(str);
}
function date_to_str(date){
	//将一个date对象转换成日期字符串
	return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
}
function get_next_fest(month,day){
	//找到下一个节日,返回一个Date对象
	//如果今年还没过,那就返回今年
	//如果今年过了,返回明年
	var now = new Date();
	var this_year = now.getFullYear();
	var fest_this_year = new Date(this_year,month-1,day);
	return fest_this_year >= now? fest_this_year:new Date(this_year+1,month-1,day);

}

function get_countdown_str(o_target_date){
	// 获取当前时间到目标时间的倒计时数据
	// 返回一个倒计时字符串
	var o_now = new Date();
	// console.log(temp);


	diff = parseInt((o_target_date.getTime() - o_now.getTime())/1000);
	days = parseInt(diff/(24*3600));
	diff = diff%(24*3600);
	hours = parseInt(diff/3600);
	diff = diff%3600;
	minutes = parseInt(diff/60);
	seconds = diff%60
	return days+"天"+hours+"小时"+minutes+"分钟"+seconds+"秒";

}

