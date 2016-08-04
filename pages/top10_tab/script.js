window.onload = function(){
	var movie_boxs= document.querySelectorAll('#content ul li div.movie_box');
	for(var i=0; i<movie_boxs.length; i++){
		EventUtil.addHandler(movie_boxs[i],'mouseover',show_or_hide);
		EventUtil.addHandler(movie_boxs[i],'mouseout',show_or_hide);
	}
	function show_or_hide(){
		var display = '';
		if(event.type == 'mouseover'){
			display = 'inline-block';
		}
		else if(event.type == 'mouseout' ){
			display = 'none';
		}
		if(display){
			this.querySelectorAll('img')[0].style.display = display;
		}
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
// function nodes_to_array(nodes){
// 	var arr = [];
// 	try{
// 		arr = Array.prototype.slice.call(nodes);
// 	}
// 	catch(ex){
// 		//奇葩浏览器IE专用代码
// 		for(var i=0;i<nodes.length;i++){
// 			arr.push(nodes[i]);
// 		}
// 	}
// 	return arr;
// }
// function get_style(element,style){
// 	return (element.currentStyle || getComputedStyle(element))[style];
// }
