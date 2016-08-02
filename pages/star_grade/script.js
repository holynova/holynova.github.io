window.onload = function (){
	var my_grade = document.getElementById('my_grade')
	var stars = nodes_to_array(my_grade.getElementsByTagName('a'));
	var span = my_grade.getElementsByTagName('span')[0];
	var grade = 0;
	console.log(stars instanceof Array);
	
	EventUtil.addHandler(my_grade,'mouseover',mouseover_handler);
	EventUtil.addHandler(my_grade,'mouseout',mouseout_handler);
	EventUtil.addHandler(my_grade,'click',click_handler);
	function mouseover_handler(event){
		var target = event.target || event.srcElement;

		if(target.tagName.toUpperCase() == 'A'){
			// var index = stars.indexOf(target);
			var index = in_array(target,stars);
			for(var i=0; i<stars.length; i++){
				stars[i].className = i<=index? 'yellow':'white';
			}
			span.innerHTML = (index+1)+"分";
		}

	}

	function mouseout_handler(event){
		var target = event.target || event.srcElement;
		if(target.tagName.toUpperCase() == 'A'){
			for(var i=0; i<stars.length; i++){
				stars[i].className = i<grade? 'yellow':'white';
			}
			span.innerHTML = grade+"分";
		}
	}
	function click_handler(event){
		var target = event.target || event.srcElement;
		if(target.tagName.toUpperCase() == 'A'){
			// var index = stars.indexOf(target);
			var index = in_array(target,stars);

			grade = index+1;
		}
	}

};

function nodes_to_array(nodes){
	var arr = [];
	try{
		arr = Array.prototype.slice.call(nodes);
	}
	catch(ex){
		//奇葩浏览器IE专用代码
		for(var i=0;i<nodes.length;i++){
			arr.push(nodes[i]);
		}
	}
	return arr;
}

//兼容IE8的indexOf函数
function in_array(item,arr){
	if(Array.prototype.indexOf){
		return arr.indexOf(item);
	}
	else{
		for(var i=0; i<arr.length; i++)
		{
			if(item === arr[i]){
				return i;
			}
		}
		return -1;
	}
}
//兼容IE的通用事件处理对象
EventUtil ={
	addHandler:function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}
		else if(element.attachEvent){
			element.attachEvent('on'+type,handler);
		}
		else{
			element['on'+type] = handler;
		}
	},
	removeHandler:function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		}
		else if(element.attachEvent){
			element.detachEvent('on'+type,handler);
		}
		else{
			element['on'+type] = null;
		}
	}
};