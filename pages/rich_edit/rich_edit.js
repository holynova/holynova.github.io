window.addEventListener('load', window_load_handler, false);

function window_load_handler()
{
	init();
	init_editer();
	btn_handler();
	drop_down_handler();
}

function drop_down_handler()
{
	// document.body.addEventListener('')
	var font_size_select = document.getElementById('font_size_select');
	font_size_select.addEventListener('change', function(event)
	{
		switch (event.target.id.toLowerCase())
		{
			case "font_size_select":
				var selected;
				selected = font_size_select.options[font_size_select.selectedIndex];
				font_size = selected.value;
				// console.log('font_size = ' + font_size);
				// console.log('selected index = '+ font_size_select.selectedIndex );
				var win = document.getElementById('editor').contentWindow;
				win.document.execCommand('fontsize', false, font_size);
				// win.focus();
				break;
			default:
				break;
		}
	}, false);
}

function btn_handler()
{
	document.body.addEventListener('click', function(event)
	{
		// console.log(event.target.id.toLowerCase());
		var order = '';
		var ifr = document.getElementById("editor");
		var doc = ifr.contentDocument || ifr.contentWindow.document; // W3C || IE
		var win = ifr.contentWindow;

		switch (event.target.id.toLowerCase())
		{
			case "btn_bold":
				order = 'bold';
				break;
			case "btn_italic":
				order = 'italic';
				break;
			case "btn_underline":
				order = 'underline';
				break;
			case "btn_align_left":
				order = 'justifyleft';
				break;
			case "btn_align_center":
				order = 'justifycenter';
				break;
			case "btn_align_right":
				order = 'justifyright';
				break;

			case "btn_clear_style":

				break;
			case "btn_clear":
				doc.body.innerHTML = '';
				win.focus();

				break;
			case 'btn_preview':
				var preview_area = document.getElementById('preview');
				preview_area.innerHTML = doc.body.innerHTML;
				break;

			default:
				break;
		}
		if (order)
		{
			win.document.execCommand(order);
			win.focus();
		}
	}, false);
}

function init()
{
	// console.log('rich_edit.js ready to work');
}

function init_editer()
{

	var ifr = document.getElementById("editor");
	var doc = ifr.contentDocument || ifr.contentWindow.document; // W3C || IE
	doc.designMode = "on";
	doc.write('<html><head><style>body{ margin:3px;background-color:white; word-wrap:break-word; word-break: break-all; }</style></head><body>iframe 中的网页</body></html>');
}