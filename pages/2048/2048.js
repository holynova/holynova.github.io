
var data = new Array();
var score = 0;
var step = 0;
//存储是否合并过一次的信息
var join = new Array();

var container_length = 500;
var N = 2;
var box_length = 100;

var gutter_length = (container_length - box_length*N)/(1+N);

var WIN_SCORE = 2048;


$(document).ready(function() {
	init();
	new_game();
	init_join();
});

function init(){
	$(document).keyup(function(event) {
		switch (event.keyCode)
		{
			case 38:
			key_action('up');
			break;
			case 40:
			key_action('down');
			break;
			case 37:
			key_action('left');
			break;
			case 39:
			key_action('right');
			break;
			default:
			break;
		}
	});

	$('#btn_start').click(new_game);


}

function set_grid(my_N)
{
	N = my_N;
	switch(N)
	{
		case 2: box_length=220 ; break;
		case 3: box_length = 140 ; break;
		case 4: box_length = 115 ; break;
		case 5: box_length =88 ; break;
		case 6: box_length =74 ; break;
		case 7: box_length =60 ; break;
		case 8: box_length =58 ; break;
		case 9: box_length =50 ; break;
		case 10: box_length =39 ; break;
		default:break;

	}
	gutter_length = (container_length - box_length*N)/(1+N);

}
function new_game()
{
	//计算格子参数
	var grid_num = $('#input_grid_num').val();
	grid_num = parseInt(grid_num);
	if(grid_num>=2 && grid_num <=10)
		set_grid(grid_num);
	else
		set_grid(4);
	//清空画面,并生成盒子
	var $background = $('#background');
	$background.empty();
	$('#result').empty();
	for(var i=0; i<N; i++)
	{
		for(var j=0; j<N; j++)
		{
			$background.append('<div id="box'+i+j+'" class="box"></div>');
			var $box = $('#box'+i+j);
			$box.css('width',box_length+'px');
			$box.css('height',box_length+'px');
			$box.css('top',get_box_top(i,j) + 'px');
			$box.css('left',get_box_left(i,j) + 'px');

			$box.css('line-height',box_length + 'px');
			$box.css('text-align','center');
			// $box.text(i+','+j);

		}
	}

	// 全局数组生成并清零
	for(var i=0; i<N; i++)
	{
		data[i] = new Array();
		for(var j=0; j<N; j++)
		{
			data[i][j] = 0;
		}
	}
	//分数等清零
	score = 0;
	step = 0;
	renew();
	for(var i=0; i<(N/2); i++)
		new_box();



}
function get_box_left (x,y) {
	return  gutter_length + y*(gutter_length + box_length);
}


function get_box_top (x,y) {
	return	gutter_length + x*(gutter_length + box_length);
}

function new_box (){
	if(is_full())
		return false;
	//找到一个合适的位置
	var x = parseInt(Math.random()*N);
	var y = parseInt(Math.random()*N);
	var cnt = 0;
	while(cnt<50){
		if(data[x][y] == 0)
			break;
		else{
			x = parseInt(Math.random()*N);
			y = parseInt(Math.random()*N);
			cnt++;
		}

	}

	if(cnt ==50)
	{
		for(var i=0; i<N; i++)
			for(var j=0; j<N; j++)
			{
				if(data[i][j] == 0)
				{
					x=i;
					y=j;
				}
			}

		}
	//生成新格子是2或者4
	data[x][y] = Math.random()>0.5? 8:16;
	score += data[x][y];
	//生成新格子的动画
	var $box = $('#num_box' + x + y);
	$box.css('width',box_length+'px');
	$box.css('height',box_length+'px');

	$box.text(data[x][y]);
	$box.css('background-color',get_color(data[x][y]));

	// $box.animate({left:"+=20px";},'slow');
	// $box.animate({fontSize:"1em";}, 50);
	// $box.animate({fontSize:'0em'},1);
	// $box.animate({fontSize:box_length+'px'});
	// $box.animate({fontSize:'2em'},'slow',renew());

}



//判断整个地图是不是全满的
function is_full(){
	for(var i=0; i<N; i++)
		for(var j=0; j<N; j++){
			if(data[i][j] == 0)
				return false;
		}
		return true;
	}


//查到数字对应的背景颜色
function get_color(data_num){

	var color_table=new Array();
	color_table['0'] = 'white';
	// color_table['0'] = 'hsl(160,80%,80%)';
	color_table['2'] = 'hsl(150,80%,80%)';
	color_table['4'] = 'hsl(140,80%,80%)';
	color_table['8'] = 'hsl(130,80%,80%)';
	color_table['16'] = 'hsl(120,80%,80%)';
	color_table['32'] = 'hsl(110,80%,80%)';
	color_table['64'] = 'hsl(100,80%,80%)';
	color_table['128'] = 'hsl(90,80%,80%)';
	color_table['256'] = 'hsl(80,80%,80%)';
	color_table['512'] = 'hsl(70,80%,80%)';
	color_table['1024'] = 'hsl(60,80%,80%)';
	color_table['2048'] = 'hsl(50,80%,80%)';
	color_table['4096'] = 'hsl(40,80%,80%)';
	color_table['8192'] = 'hsl(30,80%,80%)';
	color_table['16384'] = 'hsl(20,80%,80%)';
	color_table['32768'] = 'hsl(10,80%,80%)';
	color_table['65536'] = 'hsl(0,80%,80%)';


	return color_table[data_num.toString()];


}

//方向按键处理函数
//输入参数 str_key 是字符串的键值
function key_action(str_key){
	var flag_is_moved = 0;
	//清零合并计数
	clear_join();


	if(str_key == 'up')
	{
		console.log('up');
		for(var j=0; j<N; j++)
		{
			
			for(var i=1 ;i<N; i++)
			{
				var r = move_box(i,j,i-1,j);

				if(r == 1)//成功合并
				{
					i = 0;
					flag_is_moved += r;

				}	
				else if(r == 2)//成功移动
				{
					i = 0;
					flag_is_moved += r;
				}
				else
				{

				}

			}

		}




	}
	else if(str_key == 'down')
	{
		console.log('down');
		for(var j=0; j<N; j++)
		{
			for(var i=N-2 ;i>=0; i--)
			{
				var r = move_box(i,j,i+1,j);

				flag_is_moved += r;
				if(r != 0)
				{
					i=N-2+1;
				}

			}

		}

	}
	else if(str_key == 'left')
	{
		console.log('left');
		for(var i=0; i<N; i++)
		{
			for(var j=1 ;j<N; j++)
			{
				var r = move_box(i,j,i,j-1);
				flag_is_moved += r;
				if(r != 0)
				{
					j = 0;
				}
			}

		}

	}
	else if(str_key == 'right')
	{
		console.log('right');
		for(var i=0; i<N; i++)
		{
			for(var j=N-2 ;j>=0; j--)
			{
				var r = move_box(i,j,i,j+1)
				flag_is_moved += r ;
				if(r != 0)
				{
					j=N-2+1;
				}
			}

		}

	}

	if(flag_is_moved != 0)//成功完成了一次移动或者合并
	{
		new_box();
		step += 1;
		if(is_gameover())
		{
			// alert('game over');
			show_gameover();
		}

	}



}

function show_gameover()
{
	// $(document).
	$('#result').text("Game Over");
}

function show_win()
{
	$('#result').text("You Win");
}


function is_gameover(){
	if(is_full())
	{
		for(var i=0; i<N-1; i++)
		{
			for(var j=0; j<N; j++)
			{
				if(data[i][j] == data[i+1][j])
					return false;
			}
		}

		for(var i=0; i<N; i++)
		{
			for(var j=0; j<N-1; j++)
			{
				if(data[i][j] == data[i][j+1])
					return false;
			}

		}
		return true;

	}
	else
		return false;
}


//移动盒子函数
//输入参数:从哪个坐标到哪个坐标
//返回值:0 什么都做不了
//返回值:1 可以合并
//返回值:2 可以移动
function move_box(fromx,fromy,tox,toy){
	var from = data[fromx][fromy];
	var to = data[tox][toy];
	if(from == 0){
		//什么都做不了
		return 0;
	}
	else if(to == 0){
		//可以移动
		move_with_animation(fromx,fromy,tox,toy);
		// setTimeout('return 2',200);
		
		return 2;
	}
	else if(from == to){
		if(join[tox][toy] == 0)
		{
		//可以合并
		join[tox][toy] = 1;
		merge_with_animation(fromx,fromy,tox,toy);
		// setTimeout('return 1',1000);

		return 1;

	}
	else
	{
		return 0;
	}
}
else{
		//什么都做不了
		// new_box();
		return 0;
	}

}


function move_with_animation(fromx,fromy,tox,toy){
	var $from = $('#num_box'+fromx+fromy);
	var $to = $('#num_box'+tox+toy);
	//data的处理
	data[tox][toy] = data[fromx][fromy];
	data[fromx][fromy] = 0;
	//移动的动画
	$from.animate({top: get_box_top(tox,toy)+'px', left:get_box_left(tox,toy)+'px'},200,function(){
		$to.css('width','0px');
		$to.css('height','0xp');
		renew();
	});

	// $.setTimeout(200);



}
function merge_with_animation(fromx,fromy,tox,toy){
	var $from = $('#num_box'+fromx+fromy);
	var $to = $('#num_box'+tox+toy);
	data[tox][toy] += data[fromx][fromy];
	data[fromx][fromy] = 0;
	//移动的动画
	$from.animate({top: get_box_top(tox,toy)+'px', left:get_box_left(tox,toy)+'px'},200,function(){
		$to.css('width','0px');
		$to.css('height','0xp');
		renew();
	});
	// $.setTimeout(200);

	if (data[tox][toy] >= WIN_SCORE)
	{
		show_win();
	}
	// // $to.css('width','0px');
	// // $to.css('height','0xp');
	// renew();

}

//刷新画面函数
function renew(){

	$('.num_box').remove();
	for(var i=0; i<N; i++)
	{
		for(var j=0; j<N; j++)
		{
			$('#background').append('<div id="num_box'+i+j+'" class="box num_box"></div>');
			var $box = $('#num_box'+i+j);
			if(data[i][j] == 0)
			{
				$box.css('width','0px');
				$box.css('height','0px');
				$box.css('left',get_box_left(i,j) +'px');
				$box.css('top',get_box_top(i,j) +'px');

			}
			else
			{
				$box.css('width',box_length+'px');
				$box.css('height',box_length+'px');
				$box.css('top',get_box_top(i,j) + 'px');
				$box.css('left',get_box_left(i,j) + 'px');
				$box.css('background-color',get_color(data[i][j]));
				$box.text(data[i][j] == 0?'':data[i][j]);

			}


			$box.css('line-height',box_length + 'px');
			$box.css('text-align','center');

		}
	}
	//刷新分数和步数
	$('#score').text(score);
	$('#num_steps').text(step);
	console.log('renew');

}

//格子显示的文字的队列
//输入参数：data中的数字
//返回值：显示的字符串
function get_string(data)
{


	var str1 ='夏商周';
	var table1 = ['夏商','商','西周','春秋战国','秦','汉','晋','南北朝','隋','唐','宋','元','明','清','民国','共和国'];

	string_table['2'] =		 	'';
	string_table['4'] =		 	'';
	string_table['8'] =		 	'';
	string_table['16'] =		 '';
	string_table['32'] =		 '';
	string_table['64'] =		 '';
	string_table['128'] =		 '';
	string_table['256'] =		 '';
	string_table['512'] =		 '';
	string_table['1024'] =		 '';
	string_table['2048'] =		 '';
	string_table['4096'] =		 '';
	string_table['8192'] =		 '';
	string_table['16384'] =		 '';
	string_table['32768'] =		 '';
	string_table['65536'] =		 '';
}


function set_string_to_show()
{

	for(var i=1;i<13;i++)
	{
		var $str = $('#my_str'+i);
		// $var str
	}

}


function init_join(){
		// 全局数组生成并清零
		for(var i=0; i<N; i++)
		{
			join[i] = new Array();
			for(var j=0; j<N; j++)
			{
				join[i][j] = 0;
			}
		}
	}

	function clear_join(){
		for(var i = 0; i < N; i++)
			for(var j = 0; j < N; j++)
				join[i][j] = 0;




		}