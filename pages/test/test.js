window.addEventListener('load',window_load_handler,false);
function window_load_handler(){
	console.log('test.js is ready');
	str_cat('one','two','three');
	// str_cat('one','two',3);
	// str_cat('one','two',0);
	str_cat('one','two','0');

	try
	{
		str_cat('one ','two ',3);
	}
	catch(error)
	{
		console.log('Error caught:'+error.message);
	}
	finally{
		console.log('finally come here');

	}
	var arr =['sang','yi',999,'100','min'];
	str_cat_super('1','2','3','4',5,6,'7',arr,'9');

}

function str_cat(str1,str2,str3){
	var str = str1 + str2;
	if (typeof str3 === 'string')
	{
		str += str3;
	}
	else
	{
		throw new Error('str_cat(): str3 is not a string');
	}
	console.log(str);
	return str;
}

function str_cat_super(){
	var length = arguments.length;
	if(length>0)
	{	
		var result='';
		for(var i=0;i<length;i++)
		{
			if(typeof arguments[i] === "string")
			{
				result = result +arguments[i]+',';
			}
			else if(typeof arguments[i] === 'array')
			{
				result += arguments[i].join(',');	
			}
			else if(arguments[i] instanceof Array)
			{
				result += arguments[i].join(',');
				console.log('instanceof Array');
			}
		}
		console.log(result);
		return result;
	}
}