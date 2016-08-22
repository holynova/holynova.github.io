// 'use strict'
window.onload = function (){
	// var btnAdd = document.getElementById('wrapper').lastElementChild;
	var btnAdd = document.querySelector('#wrapper input#btn_add');
	// var aAchor = document.querySelectorAll('#wrapper ol li a');
	// var oCommentsList = document.querySelector('#wrapper ol');
	var oOl = document.querySelector('#wrapper ol');
	var oTextarea = document.querySelector('#wrapper textarea');
	var btnUp = document.querySelector('#btn_up');
	var btnDown = document.querySelector('#btn_down');
	oTextarea.focus();
	genRandomComments(5);
	updateCommentsPage();

	EventUtil.addHandler(btnUp,'click',sortComments);
	EventUtil.addHandler(btnDown,'click',sortComments);
	EventUtil.addHandler(btnAdd,'click',addNewComment);
	//绑定删除按钮点击事件
	EventUtil.addHandler(oOl,'click',commentListClick);

};
//对评论按时间排序处理函数
function sortComments (event) {
	event = event || window.event;
	var target = event.target || event.srcElement;
	if(target.id == 'btn_up'){
		gComments = gComments.sort(compareCommentTime);
	}
	else if(target.id == 'btn_down'){
		gComments = gComments.sort(compareCommentTime).reverse();

	} 
	updateCommentsPage(); 
}

function compareCommentTime(commentA,commentB){
	return commentA.time.getTime() - commentB.time.getTime();
}

function unitTest(){
	for(var i=0;i<99;i++){
		console.log(getRandomStr());
	}
}

function getDateStr(date){
	return date.getFullYear()+'-'+
		   toTwoBits((date.getMonth()+1))+'-'+
		   toTwoBits(date.getDate())+' '+
		   toTwoBits(date.getHours())+':'+
		   toTwoBits(date.getMinutes())+':'+
		   toTwoBits(date.getSeconds());
}
function toTwoBits(num){
	return Math.abs(num)<10? '0'+num:''+num;
}

//---------------------------------------------
//通用事件处理对象
EventUtil = {
	'addHandler':function(elem,eventType,handler){
		if(elem.addEventListener){
			elem.addEventListener(eventType,handler,false);
		}
		else{
			elem['on'+eventType.toLowerCase()] = handler;
		}

	},
	'removeHandler':function(elem,eventType,handler){
		if(elem.removeEventListener){
			elem.removeEventListener(eventType,handler,false);
		}
		else{
			elem['on'+eventType.toLowerCase()] = null;
		}		
	}
};

//---------------------------------------------
//获取从现在到前几天内的随机日期对象
function getRandomDate(){
	var now = new Date();
	return new Date(now.getTime()+1000*randBetween(-864000*2,0));

}
//获得随机的字符串
function getRandomStr(){
	var pool = "小院闲窗春己深,重帘未卷影沈沈,倚楼无语理瑶琴,远岫出山催薄暮,细风吹雨弄轻阴,梨花欲谢恐难禁,淡荡春光寒食天,玉炉沈水袅残烟,梦回山枕隐花钿,海燕未来人斗草,江梅已过柳生绵,黄昏疏雨湿秋千,髻子伤春慵更梳,晚风庭院落梅初,淡云来往月疏疏,玉鸭薰炉闲瑞脑,朱樱斗帐掩流苏,通犀还解辟寒无".split(',');
	var arr = [];
	for(var i=0;i<randBetween(1,10);i++){
		arr.push( pool[randBetween(0,pool.length-1)]);
	}
	return arr.join('，')+'。';
}
function randBetween(start,end){
	return start+parseInt(Math.random()*(end-start));
}
//-------------------------------------------------
//定义一条评论类
function Comment(time,content){
	this.id = new Date() +0;
	this.time = time? time:getRandomDate();
	this.content = content? content:getRandomStr();
	Comment.prototype.show = function(){
		console.log('COMMENTS: '& this.id &"-"& this.time &'  '& this.content);
	};


	Comment.prototype.toHtmlStr = function(){
		return  '<li>'+
				'<span class="time">'+
				getDateStr(this.time)+
				'</span>'+
				'<span class="content">'+
				this.content+
				'</span>'+
				'<a href="javascript:;">点击删除本条评论</a>'+
				'</li>';
	};
}

//全局变量,用来存储评论数据
var gComments = [];
//产生N条随机的评论实例,加入到全局变量中
function genRandomComments(N){
	if(N>=1){
		for(var i=0;i<N;i++){
			gComments.push(new Comment(getRandomDate(),getRandomStr()));
		}
	}
}

//根据全局变量中的数据,刷新DOM,刷新页面,并对新生成的DOM元素进行事件绑定
function updateCommentsPage(){
	var oOl = document.querySelector('#wrapper ol');
	var htmlStr = '';
	for(var i=0;i<gComments.length;i++){
		htmlStr += gComments[i].toHtmlStr();
	}
	oOl.innerHTML = htmlStr;



}

//新品论按钮点击事件的处理程序,将新的评论自动加时间戳,存到全局变量中,并刷新页面
function addNewComment(){
	var oTextarea = document.querySelector('#wrapper textarea');
	var now = new Date();
	gComments.push(new Comment(now,strEscape(oTextarea.value)));
	updateCommentsPage();
}

//将textarea中输入的数据进行转义,防止注入攻击
function strEscape(str){
	return str.replace(/</g,'&lt').replace(/>/g,'&gt');
}

//评论列表点击事件的委托处理程序,主要用来处理删除按钮
function commentListClick (event) {
	event = event || window.event;
	var target = event.target || event.srcElement;
	if(target.tagName == 'A'){
		target.parentNode.parentNode.removeChild(target.parentNode);
		updateData();
	}
}

//根据目前页面上显示的值,刷新全局变量中的数据
function updateData(){
	gComments = [];
	var oLi = document.querySelectorAll('#wrapper ol li');
	for(var i=0;i<oLi.length;i++){
		var time = new Date(oLi[i].querySelector('span.time').innerHTML);
		var content = oLi[i].querySelector('span.content').innerHTML;
		gComments.push(new Comment(time,content));

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
