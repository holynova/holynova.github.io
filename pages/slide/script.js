var pages = [
new Page('img/1.jpg','独学而无友,则孤陋而寡闻','独学而无友,则孤陋而寡闻'),
new Page('img/3.jpg','我本将心向明月,奈何明月照沟渠','我本将心向明月,奈何明月照沟渠'),
new Page('img/4.jpg','把你的心我的心串一串,串一个同心圆','把你的心我的心串一串,串一个同心圆'),
new Page('img/5.jpg','明月松间照,清泉石上流','明月松间照,清泉石上流'),
new Page('img/6.jpg','分久必合合久必分','分久必合合久必分'),
new Page('img/7.jpg','7777777','7777777'),
new Page('img/8.jpg','888888','888888'),
new Page('img/9.jpg','999999','999999'),
]


window.onload = function() {
	var left_btn = document.querySelectorAll('.left_btn')[0];
	var right_btn = document.querySelectorAll('.right_btn')[0];
	var oImg = document.querySelector('.slide img');
	var oHeader = document.querySelector('.slide .banner_foot a h2');
	var oPsg = document.querySelector('.slide .banner_foot a p');
	var oPageMark = document.querySelector('.slide .banner_foot .page_num');
	// var oPageMark = document.querySelector('.slide .banner_foot .page_num');

	var order = 0;
	var timer = null;

	EventUtil.addHandler(left_btn,'click',slide_left);
	EventUtil.addHandler(right_btn,'click',slide_right);
	init_page(0);
	var aPageMarks = nodes_to_array(document.querySelectorAll('.slide .banner_foot .page_num .page'));
	for(var i=0;i<aPageMarks.length;i++){
		EventUtil.addHandler(aPageMarks[i],'click',function(){
			// console.log(aPageMarks.indexOf(event.target.parentNode));
			order = aPageMarks.indexOf(event.target.parentNode);
			show_page(order);
		});

	}

	timer = setInterval(slide_right,3000);


	function init_page(index){
		var page_mark_html =''; 
		for(var i=0; i<pages.length; i++){
			page_mark_html += '<div class="page"><a href="#"></a></div> ';
		}
		oPageMark.innerHTML = page_mark_html;
		show_page(index);


	}
	function slide_right(){
		order = (order+1)%pages.length;
		show_page(order);
	}
	function slide_left(){
		order -= 1;
		if(order<0){
			order=pages.length-1;
		}
		show_page(order);
	}
	function show_page(index){
		oImg.src = pages[order].img;
		oHeader.innerHTML = pages[order].header;
		oPsg.innerHTML = pages[order].psg;
		var oPageMarks = document.querySelectorAll('.slide .banner_foot .page_num .page');
		for(var i=0;i<oPageMarks.length;i++){
			remove_class(oPageMarks[i],'active');
		}
		add_class(oPageMarks[index],'active');

	}
	


}
function Page(img,header,psg){
	this.img = img;
	this.header = header;
	this.psg = psg;
}


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
	for(var i=arr_class.length-1; i>=0; i--){
		if(arr_class[i] == the_class.toLowerCase()){
			arr_class.pop(arr_class[i]);
		}
	}
	elem.className = arr_class.join(" ");

}
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