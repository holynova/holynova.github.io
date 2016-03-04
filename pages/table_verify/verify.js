window.addEventListener('load', window_load_handler, false);

function window_load_handler()
{
	page_init();
	var my_form = document.getElementById('my_form');
	my_form.addEventListener('focus', function(e)
	{
		var elem = e.target;
		if (elem.tagName.toUpperCase() == 'INPUT')
		{
			elem.style.fontSize = '1.5em';
			if (elem.type == 'text' || elem.type == "password")
			{
				elem.select();
			}
		}

	}, true);


	my_form.addEventListener('blur', function(e)
	{
		blur_handler(e);
	}, true);


	var submit_btn = document.querySelector('input[type="submit"]');
	submit_btn.addEventListener('click', function(e)
	{
		verify_form();
		e.preventDefault();
		var result_str = '';
		var result_bgc = '';
		if (is_error)
		{
			result_str += '<h3>错误！</h3><p>填写有错误，请根据提示补充完整。</p>';
			result_bgc = '#ea6153';
		}
		else
		{
			var phone = document.getElementById('input_phone').value;
			var passwd = document.getElementById('input_passwd').value;
			result_str += '<h3>注册成功！</h3><p>手机号：' + phone + '</p><p>密码：' + passwd + '</p>';
			result_bgc = '#2ecc71';
		}
		var result = document.getElementById('result');
		result.innerHTML = result_str;
		result.style.backgroundColor = result_bgc;


	}, false);

	document.getElementById('input_phone').focus();
	// document.getElementById('input_phone').blur();
	// document.getElementById('input_phone').focus();


}

function blur_handler(event)
{
	var elem = event.target;
	if (elem.tagName.toUpperCase() == 'INPUT')
	{
		elem.style.fontSize = '0.8em';
		verify_form();
	}
	console.log('is_error = ' + is_error);
}

function verify_form()
{
	var input_nodes = document.querySelectorAll('div#my_form form input');
	is_error = false;
	for (var i = 0, max = input_nodes.length; i < max; i++)
	{
		var input_node = input_nodes[i];
		if (input_node.type.toUpperCase() == "TEXT" || input_node.type.toUpperCase() == "PASSWORD")
		{
			if (verify_elem_and_show(input_node) != 0)
			{
				is_error = true;
			}
		}
	}
}
function page_init()
{
	console.log('verify.js is ready');
	//全局变量 整个表单是否有错误
	is_error = false;
}



function verify_elem_and_show(elem)
{

	var error_code = 1;
	var regex_phone = /^[0-9]{11}$/;
	switch (elem.id)
	{
		case 'input_phone':
			if (elem.value == '')
			{
				error_code = 1;
			}
			else if (regex_phone.test(elem.value))
			{
				error_code = 0;
			}
			else
			{
				error_code = 3;
			}
			break;

		case "input_passwd":
		case 'input_passwd_again':
			error_code = verify_passwd(elem);

		default:
			break;

	}
	show_error(elem, error_code);
	return error_code;

}

function verify_passwd(elem)
{
	var error_code = 1;
	var regex_passwd = /^[a-zA-Z0-9]{4,}$/;
	if (elem.value == '')
	{
		error_code = 1;
	}
	else
	{
		error_code = regex_passwd.test(elem.value) ? 0 : 3;
	}

	if (error_code == 0)
	{
		var passwd = document.getElementById('input_passwd').value;
		var passwd_again = document.getElementById('input_passwd_again').value;
		if (passwd != passwd_again)
		{
			error_code = 2;
		}

	}
	return error_code;
}


function show_error(elem, error_code)
{
	var error_dic = {
		0: "正确",
		1: '错误：空值',
		2: '错误：密码前后不一致',
		3: '错误，请查看输入规则',

	}
	var span = elem.nextSibling;
	span.textContent = error_dic[error_code]
	span.style.color = error_code == 0 ? 'green' : 'red';

}