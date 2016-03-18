window.addEventListener('load',window_load_handler,false);
function window_load_handler(){
	init();
	init_editer();
	set_bold();
	// set_italic();
	// frames['rich_edit'].document.designMode = 'on';

	// var rich_edit = document.getElementById('rich_edit');
	// rich_edit.innerHTML = 'content has been changed';
	// rich_edit.contentEditable = "true";
	// console.log(rich_edit.contentEditable);
	// var is_execed = document.execCommand('italic',false,null);
	// console.log(is_execed);
	// console.log(document.queryCommandEnabled('italic'));
}
function init(){
	console.log('rich_edit.js ready to work');
}

function init_editer(){

	var ifr = document.getElementById("editor");
	var doc = ifr.contentDocument || ifr.contentWindow.document; // W3C || IE
	doc.designMode = "on";
	doc.contentEditable = true;
	doc.write('<html><head><style>body{ margin:3px; word-wrap:break-word; word-break: break-all; }</style></head><body>GoodNessEditor</body></html>');
	// alert(doc.body.innerHTML);
	// doc.execCommand('italic',false,null);

}

function set_bold(){
	var win=document.getElementById("editor").contentWindow; 
	win.document.execCommand('bold',false,null);
	win.focus();
}
function set_italic(){
	var win=document.getElementById("editor").contentWindow; 
	win.document.execCommand('italic',false,null);
	win.focus();
}

