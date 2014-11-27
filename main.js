//Copyright:sangyimin
//2014-11-13
var voltage="HV"
var num_of_core="1"
var length = 0;
var cost_standerd=0;
var full_cost_length=100.0;
var to_zero_time =1.5;
var threshold_lenth = 0;
var MV_COST_STANDERD =7000.0;
var HV_1_THRESHOLD_LENGTH = 1000.0;
var MV_1_THRESHOLD_LENGTH = 500.0;
var MV_3_THRESHOLD_LENGTH = 300.0;
 
var result=0;


function calculate()
{
	voltage = get_radio_value("voltage");
	num_of_core = get_radio_value("num_of_core");
	length = 1*document.getElementById("input_length").value;
	if(length<=0)
	{
		document.getElementById("result_text").value = "长度错误，请修改。"
		return null;
	}
		 
	if(voltage=="HV")
	{
		cost_standerd =1* document.getElementById("HV_cost_input").value;
		threshold_lenth = HV_1_THRESHOLD_LENGTH;
		if(cost_standerd<=0)
		{
			document.getElementById("result_text").value="高压开机成本输入错误，请修改。"
			return null;
		}
	}
	else if(voltage=="MV")
	{
		cost_standerd = MV_COST_STANDERD;
		
		if(num_of_core =="1")
		{
			threshold_lenth = MV_1_THRESHOLD_LENGTH;
			
		}
		else if(num_of_core == "3")
		{
			threshold_lenth = MV_3_THRESHOLD_LENGTH;
		
		}
		else
		{
			document.getElementById("result_text").value="芯数选择错误，请修改。";
			return null;
		}
	}
	if(length<=	full_cost_length)
	{
		result = cost_standerd;	
	}
	else if(length>to_zero_time*threshold_lenth)
	{
		result = 0;	
	}
	else
	{
		result = cost_standerd*(length- to_zero_time*threshold_lenth )/(full_cost_length- to_zero_time*threshold_lenth )	
	}
	show("开机成本总额为"+result.toFixed(2)+"元\n"+"平均每米增加"+(result/length).toFixed(2)+"元");		
	
	
	
}

function get_radio_value(radio_name)
{
	var obj= document.getElementsByName(radio_name);
	if(obj!= null)
	{
		var i;
		for(i=0;i<obj.length;i++)
		{
			if(obj[i].checked)
				return obj[i].value;
		}	
	}
	return null;
}

//radio点击处理函数
function click_HV_radio()
{
	document.getElementById("HV_cost_input").disabled = false;
	document.getElementById("one_core_radio").checked = true;
	calculate();
}

function click_MV_radio()
{
	document.getElementById("HV_cost_input").disabled = true;
	calculate();
	
}
function click_one_core_radio()
{
	calculate();
	
}
function click_three_core_radio()
{
	document.getElementById("MV_radio").checked = true;
	document.getElementById("HV_cost_input").disabled = true;
	
	calculate();
	
}
function show(str)
{
	document.getElementById("result_text").value=str;
	
}





