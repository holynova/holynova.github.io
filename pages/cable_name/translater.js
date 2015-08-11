var dic =[{
	"ZR":"阻燃",
	"ZA":"A类阻燃",
	"ZB":"B类阻燃",
	"ZC":"C类阻燃",
	"FY":"防白蚁"
},
{
	"V":"聚氯乙烯绝缘",
	"YJ":"交联聚乙烯绝缘",
	"E":"乙丙橡胶绝缘",
	"EY":"硬乙丙橡胶绝缘"
},
{
	"T":"铜导体",
	"L":"铝导体"
},
{
	"D":"铜带屏蔽",
	"S":"铜丝屏蔽"

},
{
	"V":"聚氯乙烯护套",
	"Y":"聚乙烯护套",
	"F":"弹性体护套",
	"A":"金属箔复合护套",
	"Q":"铅护套",
	"LW":"皱纹铝护套"
},
{
	"0":"无铠装",
	"2":"双钢带铠装",
	"3":"细圆钢丝铠装",
	"4":"粗圆钢丝铠装",
	"6":"非磁性金属带铠装",
	"7":"非磁性金属丝铠装"
},
{
	"2":"聚氯乙烯外护套",
	"3":"聚乙烯外护套",
	"4":"弹性体外护套"

},
{
	"Z":"纵向阻水结构"
}];


$(document).ready(function() {
	init();
	$('.btn_go').click(translate);
	$('input#cable_type').change(translate);
});


function init()
{
	$('#cable_type').val('fy -ZR- 10kv Yjy23 3*630');
	// console.log('ready to work');

}



function translate()
{
	var input = $('#cable_type').val().toUpperCase().replace(/KV/g,'千伏');
	// var input = $('#cable_type').val().replace(/\s+/g,'').toUpperCase().replace(/KV/g,'千伏');
	var full_result = input;
	console.log(input);
	var length = input.length;
	var arr_group_name = ['前缀','绝缘材料','导体','金属屏蔽','内护套','铠装','外护套','后缀'];
	var pointer = 0;//指示查找位置的游标
	var arr_result = new Array(8);
	var arr_branch=new Array(8);

	for(var i=0;i<8;i++)
	{
		arr_result[i] = '';
		arr_branch[i] = '';
	}

	//查找必须选项
	for(var group=1; group<=6;group++)
	{
		
		console.log('开始查找 '+ arr_group_name[group]);
		//遍历一个group中的所有词,其中位置最靠前的就是要找的,所以取position的最小值
		var min_position = 99999;
		var min_key ='';
		for(key in dic[group])
		{
			var position = input.indexOf(key,pointer);
			// console.log("尝试在["+input+']中查找['+key+"]结果是"+position);
			if(position>-1)
			{

				//加一个特例 找导体的时候 如果找到L 要看看是不是紧接着就是LW  如果是 就算没找到
				if((group == 2) && (key =='L') && input.slice(position, position+2) =='LW')
				{

				}
				else
				{
					if(position<min_position)
					{
						min_position = position;
						min_key = key;
					}
				}
			}
			
		}
		//如果遍历完了找到了
		if(min_position != 99999)
		{
			pointer = min_position + min_key.length;
			arr_branch[group] = min_key; 
			arr_result[group] = dic[group][min_key];
			console.log('key='+min_key+'     pointer='+pointer +'    group='+arr_group_name[group]);
			
			var left = full_result.slice(0,min_position);
			var right =full_result.slice(min_position, full_result.length);
			full_result = left + right.replace(min_key,arr_result[group]+',');
			
		}


	}
	//查找非必须选项
	pointer = 0;
	group =0;
	for(key in dic[0])
	{
		var position = input.indexOf(key,pointer);
		if(position>-1)
		{
			console.log('key='+key+'     pointer='+pointer +'    group='+arr_group_name[group]);

			arr_result[0] += dic[0][key]+' ';
			arr_branch[group] += key+' ';
			full_result = full_result.replace(key,dic[0][key]);

		}

	}
	var result='';
	// var full_result = input;
	//结果处理,找空的,有默认值就补上,没有就报错
	for(var cnt_group=0; cnt_group<8; cnt_group++)
	{
		if(arr_result[cnt_group] == '')
		{
			if(cnt_group == 2)
			{
				arr_branch[cnt_group] ='默认';
				arr_result[cnt_group] = '铜导体';
			}
			else if(cnt_group == 3)//默认铜带屏蔽
			{
				if((input.indexOf('LW')>0) || (input.indexOf('110KV')>0) || (input.indexOf('220KV')>0) ||(input.indexOf('66KV')>0))
				{
					//是高压电缆 不存在铜带屏蔽或铜丝屏蔽
					arr_branch[cnt_group] = '高压电缆无单独的金属屏蔽'
				}
				else
				{
					arr_branch[cnt_group] ='默认';
					arr_result[cnt_group] ='铜带屏蔽';
				}
			}
			else
			{
				// arr_branch[cnt_group] ='未找到';
				// arr_result[cnt_group] = arr_group_name[cnt_group]+':未找到';
			}
		}
		result += arr_result[cnt_group] +',';
		// full_result.replace(arr_branch[cnt_group],arr_result[cnt_group]);
	}


	
	$('#output').text(full_result+'电缆');

	//显示解释部分
	var explain='<dl>';
	for(var cnt_group=0; cnt_group<7; cnt_group++)
	{
		explain +='<dt>'+arr_group_name[cnt_group]+"</dt><dd>「"+arr_branch[cnt_group]+'」'+arr_result[cnt_group]+'</dd>';
	}
	explain +='</dl>';
	$('.explain').empty();
	$('.explain').append(explain);

}
