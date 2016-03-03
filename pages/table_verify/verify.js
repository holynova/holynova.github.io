window.addEventListener('load',window_load_handler,false);
function window_load_handler()
{
	verify_init();

	var my_form = document.getElementById('my_form')
	var input_phone = document.getElementById('input_phone');
	var input_passwd = document.getElementById('input_passwd');

	// my_form.addEventListener('focus',function(e){
	// 	console.log('焦点在：'+e.target); 

	// },false);

	
	input_handler(input_phone);
	input_handler(input_passwd);
	input_handler(document.getElementById('input_submit'));



}


//输入处理函数，包括焦点获得、焦点失去、验证、错误提示等
function input_handler(elem){
	if(elem)
	{
		elem.addEventListener('focus',function(e){
			get_focus(this);
		},false);
		elem.addEventListener('blur',function(e){
			lost_focus(this);
		},false);
	}
}

function get_focus(elem){
	console.log(elem.id + " get focus!!")
	elem.style.fontSize = '1.5em';
}

function lost_focus(elem){
	console.log(elem.id + " lost focus!!")
	elem.style.fontSize = '0.8em';
	var span = elem.nextSibling;

	if(verify(elem))
	{
		console.log(elem.id +' verify succeed');
		span.style.color = "green";
		span.textContent = 'ok';
		elem.style.color = 'black';

	}
	else
	{
		console.log(elem.id +' verify failed');
		span.style.color = "red";
		span.textContent = '错误：请查看输入提示';
		elem.style.color = 'red';
	}


}


function verify_init()
{
	console.log('verify.js is ready');
}



function verify(elem){
	var regex_phone = /^[0-9]{11}$/;
	var regex_passwd = /^[a-zA-Z]{4,}$/;
	if(elem.id  == 'input_phone')
	{
		// return (regex_phone.exec(elem.value) == null)? false:true;
		return regex_phone.test(elem.value);
	}
	else if(elem.id == 'input_passwd')
	{
		// return (regex_passwd.exec(elem.value) == null)? false:true;
		return regex_passwd.test(elem.value);


	}

}

function show_verify(){

}

