window.onload = function(){
	var avatars = document.querySelectorAll('.user_avatar');
	var details = document.querySelectorAll('.user_detail');

	for(var i=0;i<avatars.length;i++){
		EventUtil.addHandler(avatars[i],'mouseover',show_or_hide_detail);
		EventUtil.addHandler(details[i],'mouseover',show_or_hide_detail);
		EventUtil.addHandler(avatars[i],'mouseout',show_or_hide_detail);
		EventUtil.addHandler(details[i],'mouseout',show_or_hide_detail);
	}
	function show_or_hide_detail(){
		var display = ''
		if(event.type == 'mouseover'){
			display = 'block';
		}
		else if(event.type == 'mouseout'){
			display = 'none';
		}
		if(display){
			this.parentNode.querySelector('.user_detail').style.display = display;
		}
	}

	// // 另外一种解法1------------------------------------------------
	// var user_avatars = wrapper.querySelectorAll('.user_avatar');
	// var user_details = wrapper.querySelectorAll('.user_detail');
	// for(var i=0; i<user_avatars.length; i++){
	// 	//创建块级作用域
	// 	(function(index){
	// 		user_details[i].onmouseover = user_avatars[i].onmouseover = function(){
	// 			//console.log(event.type+" "+event.target.className+" "+event.target.tagName +' block');
	// 			user_details[index].style.display = "block";
	// 		};
	// 		user_details[i].onmouseout = user_avatars[i].onmouseout = function(){
	// 			//console.log(event.type+" "+event.target.className+" "+event.target.tagName+' none');
	// 			user_details[index].style.display = 'none';
	// 		};

	// 	})(i);
	// }
	// // ------------------------------------------------


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

function get_style(element,style){
	return (element.currentStyle || getComputedStyle(element))[style];
}
