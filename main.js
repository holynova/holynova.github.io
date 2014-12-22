// JavaScript Document
//2014年11月29日 开机成本计算器脚本
/*
$(document).on("pageinit","#page_calculator",fuction()
{
}
*/
//变量声明部分
var cnt = 0;
//控件动作-函数映射部分
$(document).ready(main);
function main()
{
	init();
	init_bonus();
	$("#btn").click(btn_click);
	$("#btn_bonus").click(btn_bonus_click);
}

function init_bonus()
{
	$(":radio[name='product_type'][value='110']").attr("checked",true);
	$("#text_unit_price").val("99999");
	$("#text_num").val("1");
	$("#text_standerd_price").val("1000");
		
}

function btn_bonus_click()
{
	bonus_calculate();
}

function bonus_calculate()
{
	var product=$("input[name='product_type']:checked").val();
	var unit_price=Number($("#text_unit_price").val());
	var num=Number($("#text_num").val());
	var standerd_price=$("#text_standerd_price").val();
	var result="";
	var unit_bonus=1;
	
	
	if(product == "110")
	{
			if(unit_price>48500)
				unit_bonus = (unit_price-48500)/1.17*0.7+45000.0/1.17*0.06;
			else if(unit_price>38500)
				unit_bonus = (unit_price-3500)/1.17*0.05;
			else if(unit_price>30200)
				unit_bonus = (unit_price-3200)/1.17*0.035;
			else if(unit_price>25000)
				unit_bonus = (unit_price-3000)/1.17*0.02;
			else if(unit_price>=2800)
				unit_bonus = (unit_price-2800)/1.17*0.005;
			else
				unit_bonus="error";
	}
	else if(product == "220")
	{
		
	}
	else if(product == "MV")
	{
		
	}
	else if(product == "Acc")
	{
		
	}
	else
	{
		result="error";	
	}
		
	
	result = product+"附件 单价"+unit_price+"元 长度"+num+"米 出厂价"+standerd_price+"元 单个奖金="+unit_bonus;
	result = "总价"+unit_price*num + "奖金" +unit_bonus;
	$("#textarea_bonus").val(result);
	
	
	
	
}

//初始化函数
function init()
{
	$(":radio[name='voltage'][value='MV']").attr("checked",true);
	$(":radio[name='num_core'][value='3']").attr("checked",true);
}

function btn_click()
{
	cnt++;
	if(cnt%2 == 0)
		$(":radio[name='voltage'][value='HV']").attr("checked",true);
	else
		$(":radio[name='voltage'][value='MV']").attr("checked",true);
	
	$("#textarea_result").text("cnt = "+cnt);
}


//参数变化函数
function set_voltage()
{
	var my_voltage=$("input[name='voltage']:checked").val();
	if(my_voltage=="HV")
	{
		$("#text_HV_cost").attr("disabled",false);	
		$(":radio[name='num_core'][value='1']").attr("checked",true);
	}
	else
	{
		$("#text_HV_cost").attr("disabled",true);	
	}
	go();
	
	
}
function set_core()
{
	var my_core=$(":radio[name='num_core']:checked").val();
	if(my_core=="3")
	{
		$(":radio[name='voltage'][value='MV']").attr("checked",true);	
	}
}

//错误处理函数
function show_error(str)
{
	$("#textarea_result").val("填写错误:"+str);
}
//情况判断函数
//通用计算函数
function calculate()
{
	
}
function show()
{
	//alert("show()!")
}

function bonus_show()
{
	//alert("show()!")
}

function go()
{
	calculate();
	show();	
}