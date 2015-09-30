$(document).ready(function() {
	var id = new Date()-0;
	console.log(id);
	var my_tab = new Tab(my_data,'#my_tab');
	my_tab._init();

});


//标签对象定义
//参数：data 数据对象
var my_data =
[
{
	'id':'tab1',
	'tab_name':'李白',
	'tab_content':'<img src="2.jpg" alt="山居秋暝2">\
				<h3>望庐山瀑布</h3>\
				<p>日照香炉生紫烟，遥看瀑布挂前川。</p>\
				<p>飞流直下三千尺，疑是银河落九天。</p>'
},
{
	'id':'tab2',
	'tab_name':'杜甫',
	'tab_content':'生男埋没随百草'
},
{
	'id':'tab3',
	'tab_name':'辛弃疾',
	'tab_content':'<img src="3.jpg" alt="山居秋暝3">\
				<h3>青玉案·元夕</h3>\
				<p>东风夜放花千树。更吹落、星如雨。宝马雕车香满路。\
					凤箫声动，玉壶光转，一夜鱼龙舞。\
					</p>\
					<br>\
				<p>蛾儿雪柳黄金缕,笑语盈盈暗香去。众里寻他千百度。蓦然回首，那人却在，灯火阑珊处。</p>\
				</div>'
},
{
	'id':'tab4',
	'tab_name':'王维',
	'tab_content':'<img src="1.jpg" alt="山居秋暝1">\
				<h3>山居秋暝</h3>\
				<p>空山新雨后，天气晚来秋。</p>\
				<p>明月松间照，清泉石上流。</p>\
				<p>竹喧归浣女，莲动下渔舟。</p>\
				<p>随意春芳歇，王孙自可留。</p>'
}

];


var Tab = function(data,parent){
	this.id = new Date()-0;
	this.data = data;
	this.parent = parent;
		var wrapper_id="tab_wrapper"+this.id;
		var tabs_id = "tabs"+this.id;
		var contents_id = "contents"+this.id;


	this._init = function(){
		this._creat();
		this.tab_on(0);
		this.bind_event();

	};
	this._creat = function(){

		//生成wrapper
		$(parent).append('<div class="tab_wrapper" id="tab_wrapper'+this.id+'"></div>');
		// 生成tabs
		// 生成contents
		$('#'+wrapper_id).append('<div class="tabs" id="tabs'+this.id+'" ></div>').append('<div class="clearfix"></div>').append('<div class="contents" id="'+contents_id+'" ></div>');
		

		// 逐个生成标签和内容
		var length = this.data.length;
		for(var i=0;i<length;i++)
		{
			var me = this.data[i];
			var tab_id = me.id + "_tab_" + this.id,
				content_id = me.id +"_content_"+this.id;

			console.log(me.id);
			$('#'+tabs_id).append('<div class="tab" id="'+tab_id+'" rel='+content_id+'>'+me.tab_name+'<i class="arrow"></i></div>');
			$('#'+contents_id).append('<div class="content" id="'+content_id+'" style="display:none">'+me.tab_content+'</div>');
			
		}
		
	};
	this.tab_on = function(num){
		$('#'+wrapper_id+' .tabs').removeClass('on');
		$('#'+wrapper_id+' .tabs .tab:eq('+num+')').addClass('on');
		$('#'+wrapper_id+' .content .content').css('display', 'none');
		$('#'+wrapper_id+' .contents .content:eq('+num+')').css('display', 'block');

	};
	//点击相应函数
	this.bind_event = function(){
		var tabs =  $('#'+wrapper_id+' .tabs');
		tabs.on('click', '.tab', function() {
			var index = $(this).index();
			$(this).siblings('.tab').removeClass('on').end().addClass('on');
			$(this).parents('.tab_wrapper').find('.content').css('display', 'none');
			$('#'+$(this).attr('rel')).css('display', 'block');

		});
		
	};

}

