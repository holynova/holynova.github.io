window.addEventListener('load', window_load_handler, false);

function window_load_handler(argument){
	console.log('buy_house.js is ready.');
	var btn_go = document.getElementById("btn_go");
	btn_go.addEventListener('click', btn_go_handler, false);
	// btn_go_handler();
	// btn_go.click(btn_go_handler);

}

function btn_go_handler()
{
	// event.preventDefault();
	console.log('btn_go_handler running');
	var total_price = parseFloat(document.getElementById('total_price').value);
	var area = parseFloat(document.getElementById('area').value);
	var eval_unit_price = parseFloat(document.getElementById('eval_unit_price').value);
	var contract_tax_rate = parseFloat(document.getElementById('contract_tax_rate').value);
	var business_tax_rate = parseFloat(document.getElementById('business_tax_rate').value);
	var income_tax_rate = parseFloat(document.getElementById('income_tax_rate').value);
	var agent_fee_rate = parseFloat(document.getElementById('agent_fee_rate').value);
	var down_payment_per = parseFloat(document.getElementById('down_payment_per').value);
	var others = parseFloat(document.getElementById('others').value);
	var house_found = parseFloat(document.getElementById('house_found').value);

	var inputs = document.querySelectorAll("input");
	for(var i=0,max=inputs.length;i<max;i++){
		console.log(inputs[i].id +"="+inputs[i].value);
	}
	var eval_price,eval_diff,contract_tax,business_tax,income_tax,agent_fee;
	eval_price = eval_unit_price*area/10000;
	eval_diff = total_price - eval_price;
	contract_tax = contract_tax_rate/100*eval_price;
	business_tax = business_tax_rate/100*eval_price;
	income_tax = income_tax_rate/100*eval_price;
	agent_fee = agent_fee_rate/100*total_price;
	sum_tax_fee = contract_tax+business_tax+income_tax+agent_fee;
	total_price_incld_tax = sum_tax_fee +total_price;
	others = others/10000;
	console.log("总价="+total_price_incld_tax+"= 房总价"+total_price+"+税费合计"+sum_tax_fee);
	console.log("房总价="+total_price + "=评估总价"+eval_price +"+评估外总价"+eval_diff);
	console.log("税费合计="+sum_tax_fee +"=契税"+contract_tax+"+营业税"+business_tax+"+个人所得税"+income_tax+"+中介费"+agent_fee+"+其他费用"+others);
	var str1,str2,str3
	str1="总价="+total_price_incld_tax.toFixed(2)+"<br>=房总价"+total_price.toFixed(2)+"+税费合计"+sum_tax_fee.toFixed(2);
	str2="房总价="+total_price.toFixed(2)+"<br>=评估总价"+eval_price.toFixed(2)+"+评估外总价"+eval_diff.toFixed(2);
	str3="税费合计="+sum_tax_fee.toFixed(2)+"<br>=契税"+contract_tax.toFixed(2)+"+营业税"+business_tax.toFixed(2)+"+个人所得税"+income_tax.toFixed(2)+"+中介费"+agent_fee.toFixed(2)+"+其他费用"+others.toFixed(2);
	var result_div = document.getElementById("result");
	result.innerHTML = str1 +"<hr>" +str2 +"<hr>"+str3 +"<hr>";
	return false;
}