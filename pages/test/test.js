window.addEventListener('load', window_load_handler, false);

function window_load_handler()
{
	console.log('test.js is ready');

	my_json = [
	{
		"title": "Journey to the west",
		"authors": ["Wu Chengen"],
		year:1997,
	},
	{
		"title": "Red Building",
		"authors": ["Cao","Gao"],
		year:1998,
	},
	{
		"title": "Three Kindoms",
		"authors": ["Luo,Guanzhong"],
		"year":1997,
	}];
	// books = JSON.parse(my_json);
	books = my_json;
	for(var i=0,max=books.length;i<max;i++)
	{
		console.log('title:'+books[i].title);
		console.log('authors:'+books[i].authors);
		console.log('year:'+books[i].year);
	}

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if((xhr.status >= 200 && xhr.status <300) || xhr.status == 304)
			{
				console.log('success '+xhr.responseText);
				console.log('xhr.status = '+xhr.status+" des = "+xhr.statusText);
				document.getElementById('from_server').innerHTML = xhr.responseText;
			}
			else
			{
				console.log('request is unsuccessful xhr.status = ' +xhr.status);
			}
		}
	};

	try
	{
		xhr.open('get', 'http://localhost/test.php?name=sang&addr=china', true);
		xhr.send(null);
	}
	catch (error)
	{
		console.log(error.message);
	}

}

var make_get_url = function(url,name,value){
	url += url.indexOf('?') == -1?"?":"&";
	url += encodeURIComponent(name)+'='+encodeURIComponent(value);
	return url;
};