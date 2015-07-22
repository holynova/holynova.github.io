var cnt =0;

$(document).ready(function() 
{
	init();
	//------------------------
	//增加一行随即商品按键处理
	$('.btn_test').click(add_random_good);
	//------------------------
	//全选 全不选 反选按键处理
	$('.btn_select_none').on('click',function(){
		var checkboxs = $('.table_select :checkbox');
		checkboxs.prop('checked',false);
	});
	$('.btn_select_all').on('click',function(){
		var checkboxs = $('.table_select :checkbox');
		checkboxs.prop('checked',true);
	});
	$('.btn_select_reverse').on('click',function(){
		var checkboxs = $('.table_select :checkbox');
		checkboxs.each(function() {
			$(this).prop('checked',!$(this).prop('checked'));

		});
	});
	$('.btn_delete_selected').on('click',delete_selected_lines);


	//------------------------
	//商品数量增减按钮处理
	$('table').on('click','.btn_add_one',num_add_one);
	$('table').on('click','.btn_del_one',num_del_one);
	//------------------------
	//删除一行
	$('table').on('click','.btn_del_line',delete_line);
	$('#btn_sort_by_num').on('click',sort_by_num);
	
});

function init()
{
	for(var i=0;i<4;i++)
	{
		add_random_good();
	}

}
function add_random_good()
{
	var price = parseInt(Math.random()*999+1);
	var num = parseInt(Math.random()*100+1);
	var total_price = price *num;


	var a_book = '\
	<tr class="table_good">\
	<td class="table_select">\
	<input type="checkbox"  checked>\
	</td>\
	<td class="table_details">\
	<div class="pic"></div>\
	<div class="name">我是第' + cnt + '本书</div>\
	<div class="detail">\
	</div>\
	</td>\
	<td class="table_unit_price">\
	<span>'+price+'元</span>\
	</td>\
	<td class="table_num">\
	<span class="span_num">'+num+'</span>件\
	<button class="btn_add_one">+1</button>\
	<button class="btn_del_one">-1</button>\
	</td>\
	<td class="table_total">\
	合计<span class="span_total_price">'+total_price+'</span>元\
	</td>\
	<td class="table_del">\
	<button class="btn_del_line">删除</button>\
	</td>\
	</tr>\
	' 
	$('table').append(a_book);
	renew_total_line();
	cnt += 1;
	// renew_all();

}


//数量增加1
function num_add_one()
{
	var my_num_span = $(this).siblings('span');
	var num = parseInt(my_num_span.text());
	num += 1;
	my_num_span.text(num);
	renew_total_line();

	//数量变化后更新本行的总价
	var unit_price = parseInt($(this).parent('.table_num').siblings('.table_unit_price').children('span').text());
	var total_price = unit_price * num;
	$(this).parent('.table_num').siblings('.table_total').children('span').text(total_price);
	renew_total_line();

}
//数量减小1
function num_del_one()
{
	var my_num_span = $(this).siblings('span');
	var num = parseInt(my_num_span.text());
	num -= 1;
	if(num<0)
	{
		num = 0;
	}
	my_num_span.text(num);

	//数量变化后更新本行的总价
	var unit_price = parseInt($(this).parent('.table_num').siblings('.table_unit_price').children('span').text());
	var total_price = unit_price * num;
	$(this).parent('.table_num').siblings('.table_total').children('span').text(total_price);
	renew_total_line();
}


function renew_all()
{
	var all_num = $('.table_all_num span');
	var all_price = $('.table_all_price span');
	var num_array = $('.table_good .table_num span').text();
	for (var i = 0; i < num_array.length; i++)
	{
		var temp = num_array[i];
	};

}


function sort_by_price()
{

}
function sort_by_num()
{
	console.log('sort by num');
	$('.table_num span').each(function(){
		console.log($(this).index()+":"+$(this).text());
	});

}
//刷新合计这一行的数据
function renew_total_line()
{
	var all_num = 0;
	var all_price = 0;
	$('.span_num').each(function(){
		all_num += parseInt($(this).text());
	});
	
	$('.table_all_num').text('总计'+all_num+'件');
	$('.span_total_price').each(function(){
		all_price += parseInt( $(this).text());
	});
	$('.table_all_price').text('总计'+all_price+'元');
}



function delete_line()
{
	$(this).parents('.table_good').remove();
	renew_total_line();
}

function delete_selected_lines()
{
	var selected_checkboxs = $('.table_good input:checked');
	var num = selected_checkboxs.length;
	if(num == 0)
	{
		alert('没有选中任何商品');
		return false;
	}

	console.log('被选中的行数'+selected_checkboxs.length);

	if(confirm('确定删除'+selected_checkboxs.length+'行商品?'))
	{
		selected_checkboxs.parents('.table_good').remove();
		return true;
	}

}



