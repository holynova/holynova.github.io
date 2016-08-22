window.onload = function(){
	var movie_boxs= document.querySelectorAll('#content ul li div.movie_box');
	for(var i=0; i<movie_boxs.length; i++){
		EventUtil.addHandler(movie_boxs[i],'mouseover',show_or_hide);
		EventUtil.addHandler(movie_boxs[i],'mouseout',show_or_hide);
	}
	function show_or_hide(){
		var display = '';
		if(event.type == 'mouseover'){
			remove_class(this,'brief');
			add_class(this,'full');
		}
		else if(event.type == 'mouseout' ){
			remove_class(this,'full');
			add_class(this,'brief');
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

function add_class(elem,the_class){
	 elem.className = elem.className +" "+the_class;
}


function remove_class(elem,the_class){
	var arr_class = elem.className.trim().toLowerCase().split(/\s+/);
	console.log('before:'+arr_class.join(' '));
	for(var i=arr_class.length-1; i>=0; i--){
		if(arr_class[i] == the_class.toLowerCase()){
			arr_class.pop(arr_class[i]);
		}
	}
	console.log('after:'+arr_class.join(' '));
	elem.className = arr_class.join(" ");

}

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
function get_style(element,style){
	return (element.currentStyle || getComputedStyle(element))[style];
}
