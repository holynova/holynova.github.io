
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
//$(document).on("pageinit","#page_home",main);
//$(document).on("pageinit","#page_calculator",main);

function main()
{
	init_bonus();
	init();
	$("#text_family_name").val("李");
	$("#btn").click(btn_click);
	$("#btn_bonus").click(btn_bonus_click);
	$("#btn_name").click(btn_name_click);
	
	
}
function btn_name_click()
{
	var boy_char="晨轩清睿宝涛华国亮新凯志明伟嘉东洪建文子云杰兴友才振辰航达鹏宇衡佳强宁丰波森学民永翔鸿海飞义生凡连良乐勇辉龙川宏谦锋双霆玉智增名进德聚军兵忠廷先江昌政君泽超信腾恒礼元磊阳月士洋欣升恩迅科富函业胜震福瀚瑞朔津韵荣为诚斌广庆成峰可健英功冬锦立正禾平旭同全豪源安顺帆向雄材利希风林奇易来咏岩启坤昊朋和纪艺昭映威奎帅星春营章高伦庭蔚益城牧钊刚洲家晗迎罡浩景珂策皓栋起棠登越盛语钧亿基理采备纶献维瑜齐凤毅谊贤逸卫万臻儒钢洁霖隆远聪耀誉继珑哲岚舜钦琛金彰亭泓蒙祥意鑫朗晟晓晔融谋宪励璟骏颜焘垒尚镇济雨蕾韬选议曦奕彦虹宣蓝冠谱泰泊跃韦怡骁俊沣骅歌畅与圣铭溓滔溪巩影锐展笑祖时略敖堂崊绍崇悦邦望尧珺然涵博淼琪群驰照传诗靖会力大山之中方仁世梓竹至充亦丞州言佚序宜";
	var girl_char="婷倩睿瑜嘉君盈男萱雨乐欣悦雯晨珺月雪秀晓然冰新淑玟萌凝文展露静智丹宁颖平佳玲彤芸莉璐云聆芝娟超香英菲涓洁萍蓉潞笑迪敏靓菁慧涵韵琳燕依妙美宜尚诗钰娜仪娇谊语彩清好睻曼蔓茜沁韶舒盛越琪霞艺函迎虹爽瑞珏桐筱苹莹名晗甜晴亭吉玉晶妍凤蒙霖希宣昕丽心可旻阳真蓝畅荣岚乔育芷姿妹姗瑾奕兰航蕾艳怡青珊才小子允加巧冉北朵多羽如帆伶采西贝其春易咏亚明秋泓伦朔哲益轩容玹津启婧晟婉常浩景茗尧雅杰媛诒翔为捷钧毓意琸靖渺渲熙微祺梦赫菡纶铭齐华菏毅瑶品梓国卿振卫叶亿娆漫兴蓓融嫒锦翰科润霏灿忆聪怿蕊谨丰丛璇议馨瀚潇莺珑俪骄骁灵忻昭金昊志辰宇安凡禾竹愉丫珂洺苒若偌珮棋淇群会维影逸娴赏霄辉莲优瑷朦涛识誉巍鑫逦湾中予卉永同州任宏卓";
	var sex=$("input[name='sex']:checked").val();
	var num_of_char=$("#range_num_of_char").val();
	var num_of_name=$("#range_num_of_name").val();
	var family_name=$("#text_family_name").val();
	var result_name="";
	//清空显示区
	$(".new_name").remove();
	
	for(cnt_name=0;cnt_name<num_of_name;cnt_name++)
	{
		one_name=family_name;
		for(cnt_char=0;cnt_char<num_of_char;cnt_char++)
		{
			if(sex=="boy")
				one_name += boy_char[parseInt(Math.random()*boy_char.length,10)];
			else if(sex=="girl")
				one_name += girl_char[parseInt(Math.random()*girl_char.length,10)];
			else
			{
				if(	parseInt(Math.random()*girl_char.length,10)%2 == 0)
					one_name += boy_char[parseInt(Math.random()*boy_char.length,10)];
				else
					one_name += girl_char[parseInt(Math.random()*girl_char.length,10)];			
			}
		}	
		if(cnt_name%2 ==0)
		{
			$("#ol_name_left").append("<li class='new_name'>" + one_name + "</li>").listview('refresh');
			
		}
		else
		{
			$("#ol_name_right").append("<li class='new_name'>" + one_name + "</li>").listview('refresh');
		}
		//$("ol").append("<li>hello</li>").listview('refresh');
		
		//$("#ol_name").append("<li>张三</li>");//.trigger("creat");
	
	}
	//$("#textarea_name").text(result_name);
	
	

}

function init_bonus()
{
	$(":radio[name='product_type'][value='220']").attr("checked",true);
	//$(":radio[name='voltage'][value='MV']").attr("checked",true);
	
	$("#text_unit_price").val("99999");
	$("#text_num").val("1");
	$("#text_standerd_price").val("1000");
	
	$(":radio[name='voltage'][value='HV']").attr("checked",true);
	$(":radio[name='num_core'][value='1']").attr("checked",true);

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
			$("#text_standerd_price").text("仅中压附件有出厂价");
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
			if(unit_price>124500)
				unit_bonus = (unit_price-124500)/1.17*0.7+115000.0/1.17*0.08;
			else if(unit_price>111000)
				unit_bonus = (unit_price-9000)/1.17*0.06;
			else if(unit_price>98500)
				unit_bonus = (unit_price-8500)/1.17*0.04;
			else if(unit_price>88000)
				unit_bonus = (unit_price-8000)/1.17*0.03;
			else if(unit_price>=7500)
				unit_bonus = (unit_price-7500)/1.17*0.015;
			else
				unit_bonus="error";
		
	}
	else if(product == "MV_acc")
	{
		if(unit_price >= standerd_price)
			unit_bonus = (unit_price - standerd_price)*0.65 + standerd_price/1.17*0.05;
		else if(unit_price > 0)
			unit_bonus = unit_price/1.17*0.03;
		else
			unit_bonus = "error";
	}
	else if(product == "acc")
	{
		unit_bonus = unit_price/1.17*0.3/100;
	}
	else
	{
		result="error";	
	}
		
	
	result = product+"附件 单价"+unit_price+"元 长度"+num+"米 出厂价"+standerd_price+"元 单个奖金="+unit_bonus;
	result += "总价"+unit_price*num + "奖金" +unit_bonus;
	$("#textarea_bonus").val(result);
	
	
	
	
}

//初始化函数
function init()
{
	
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