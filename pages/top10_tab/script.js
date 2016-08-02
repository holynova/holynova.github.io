window.onload = function(){
	var movies = document.getElementById('content').getElementsByTagName('li');
	var content = document.getElementById('content');
	EventUtil.addHandler(content,'mouseover',show_detailed_movie);
	EventUtil.addHandler(content,'mouseout',hide_detailed_movie);
	function show_detailed_movie(){
		var target = event.target || event.srcElement;
		var tag = target.tagName.toUpperCase();
		console.log(event.type+' '+target.className+' '+target);
		if(tag == 'A' || tag == 'IMG' || tag == 'DIV') {
			var img = target.getElementsByTagName('img')[0];
			if(get_style(img,'display') == 'none'){
				img.style.display = 'inline-block';
			}
		}
	}
	function hide_detailed_movie(){
		var target = event.target || event.srcElement;
		var tag = target.tagName.toUpperCase();
		console.log(event.type+' '+target.className+' '+target);
		if(tag == 'A' || tag == 'IMG' || tag == 'DIV') {
			var img = target.getElementsByTagName('img')[0];
			if(get_style(img,'display') != 'none'){
				img.style.display = 'none';
			}
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
