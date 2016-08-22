window.onload = function (argument) {
	// body...

	var btnAdd = document.querySelector('#wrapper div.web_add a');
	// var aBtnEdit = document.querySelectorAll('#wrapper div.web_show ul li span.edit');
	var oUl = document.querySelector('#wrapper div.web_show ul');
	var oWebName = document.getElementById('web_name');
	var oWebURL = document.getElementById('web_url');
	var oWebShow = document.querySelector('#wrapper div.web_show');
	//全局变量,用来存储正在被编辑的li中的a标签
	var oEditingAnchor = null;
	EventUtil.addEvent(btnAdd,'click',addWeb);
	EventUtil.addEvent(oWebShow,'click',webShowHandler);

	function addWeb(){
		// console.log('edit
		if(this.innerHTML == '添加'){
			if(oWebURL.value && oWebName.value){
				var newItem = document.createElement('li');
				newItem.innerHTML = '<a href="'+inputEscaping(oWebURL.value)+'" title="">'+inputEscaping(oWebName.value)+'</a>'+
				'<span class="edit"></span>'+
				'<span class="delete"></span>';
				oUl.appendChild(newItem);
				oWebName.focus();
			}
			else{
				alert('名称和网址没填完整');
			}
		}
		else if(this.innerHTML == '修改'){
			oEditingAnchor.href = oWebURL.value;
			oEditingAnchor.innerHTML = oWebName.value;
			oWebName.value = '';
			oWebURL.value = '';
			oWebName.focus();
			oEditingAnchor.parentNode.style.backgroundColor = '#fff';
			oEditingAnchor = null;
			this.innerHTML ='添加';
		}
	}
	function webShowHandler(event){
		// console.log(window.event.type);
		event = event || window.event;
		
		var tar = event.target || event.srcElement;

		if(tar.className == 'edit'){
			if(oEditingAnchor){
			oEditingAnchor.parentNode.style.backgroundColor = '#fff';
			}
			var anchor = tar.previousElementSibling;
			var href = anchor.href;
			var text = anchor.innerHTML;
			// console.log('edit '+value);
			oWebName.value =  text;
			oWebURL.value = href;
			btnAdd.innerHTML = '修改';

			oEditingAnchor = anchor;
			oEditingAnchor.parentNode.style.backgroundColor = "#E7F6CD";
			oWebName.focus();

		}
		else if(tar.className == 'delete'){
			if(oEditingAnchor && tar.parentNode == oEditingAnchor.parentNode){
				btnAdd.innerHTML = '添加';
				oWebName.value = '';
				oWebURL.value = '';
				oWebName.focus();
			}
			tar.parentNode.parentNode.removeChild(tar.parentNode);
		}
	}
}
//input输入进来的内容进行转义,防止注入攻击
function inputEscaping(str){
	return str.replace(/</g, '&lt').replace(/>/g, '&gt');
}

EventUtil = {
	'addEvent':function(elem,event,handler){
		if(elem.addEventListener){
			elem.addEventListener(event,handler,false);
		}
		else{
			elem['on'+event] = handler;
		}
	}, 
};

