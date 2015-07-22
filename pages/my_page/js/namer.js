//namer.js
//2015年4月19日
$(document).ready(init);
function init()
{
  //alert('namer.js ready');
}

$('#btn_creat_name').click(creat_name);
function creat_name()
{
  console.log('running');
  
  //alert('running');
  var boy_char="晨轩清睿宝涛华国亮新凯志明伟嘉东洪建文子云杰兴友才振辰航达鹏宇衡佳强宁丰波森学民永翔鸿海飞义生凡连良乐勇辉龙川宏谦锋双霆玉智增名进德聚军兵忠廷先江昌政君泽超信腾恒礼元磊阳月士洋欣升恩迅科富函业胜震福瀚瑞朔津韵荣为诚斌广庆成峰可健英功冬锦立正禾平旭同全豪源安顺帆向雄材利希风林奇易来咏岩启坤昊朋和纪艺昭映威奎帅星春营章高伦庭蔚益城牧钊刚洲家晗迎罡浩景珂策皓栋起棠登越盛语钧亿基理采备纶献维瑜齐凤毅谊贤逸卫万臻儒钢洁霖隆远聪耀誉继珑哲岚舜钦琛金彰亭泓蒙祥意鑫朗晟晓晔融谋宪励璟骏颜焘垒尚镇济雨蕾韬选议曦奕彦虹宣蓝冠谱泰泊跃韦怡骁俊沣骅歌畅与圣铭溓滔溪巩影锐展笑祖时略敖堂崊绍崇悦邦望尧珺然涵博淼琪群驰照传诗靖会力大山之中方仁世梓竹至充亦丞州言佚序宜";
  var girl_char="婷倩睿瑜嘉君盈男萱雨乐欣悦雯晨珺月雪秀晓然冰新淑玟萌凝文展露静智丹宁颖平佳玲彤芸莉璐云聆芝娟超香英菲涓洁萍蓉潞笑迪敏靓菁慧涵韵琳燕依妙美宜尚诗钰娜仪娇谊语彩清好睻曼蔓茜沁韶舒盛越琪霞艺函迎虹爽瑞珏桐筱苹莹名晗甜晴亭吉玉晶妍凤蒙霖希宣昕丽心可旻阳真蓝畅荣岚乔育芷姿妹姗瑾奕兰航蕾艳怡青珊才小子允加巧冉北朵多羽如帆伶采西贝其春易咏亚明秋泓伦朔哲益轩容玹津启婧晟婉常浩景茗尧雅杰媛诒翔为捷钧毓意琸靖渺渲熙微祺梦赫菡纶铭齐华菏毅瑶品梓国卿振卫叶亿娆漫兴蓓融嫒锦翰科润霏灿忆聪怿蕊谨丰丛璇议馨瀚潇莺珑俪骄骁灵忻昭金昊志辰宇安凡禾竹愉丫珂洺苒若偌珮棋淇群会维影逸娴赏霄辉莲优瑷朦涛识誉巍鑫逦湾中予卉永同州任宏卓";
  var middle_char="万川之广山士千云长巨友中见元方以仁介允公书本世正训宁让汇永石左右业归北仪白令乐处半边芒权存迈师光同先乔自任后合企庄亦齐冲羊州池防如观纪远孝声极束来伯步希谷况应辛启陆奉青尚易和征周京放肃承孟始绍经贯项城挺荣南相柏树威厚临览显星宜矩适科复重段顺修信泉叙勉律饶度庭姿音施阁济洲恢举宣觉宪语祝退既贺盈绘耕泰素载起都哲荷晋真桐桥索栗夏原殊顾致柴恩积俯途颂逢高席准效离唐资凉竞涉海阅益润悟宽朗谊陶陵预通能梦域著基桑培盛辅堂常野唯跃晚崇犁符敏悠得悉猛康鹿章竟旋望清渠添渐渔梁深惜随隆隐绩维绪绵琴堪越斯敬朝植椅惠确紫雁雅敞遇景铸锐程策筑筝傅储奥循舒然阔善羡尊道游寒裕谦疏絮登缘塘蓬蒙楚龄路照锡锦辞筹遥愈微新韵意数慈源溪滨谨静碧歌慕遮端漫赛谱增影墨镇黎稼德遵潜潮燕薪衡凝戴穗鹰彰潭澳澈澜澄鹤艾玄仲伦伊玖杉轩纬玫枢枫郁歧卓秉岳宛弥陌绅绎荔昭钦衍奕咨耘秦逊炫峻凌诺萧曼晦矫笙舶翎逸焕淳渊尉婉颇综琢壹翘棠鼎晰敦竣遂湘渤寓犀蒲楷睦瑟稚魁靖溯缤赫蔚榕熙榛豫辙儒瞻璧麟巍珍瑜瑾珞瑶理璋江河沐沛浦沪渝松柏杨柳枫桦桐镇钦锡锐钟铠铮";
  
	//var all_char=boy_char+girl_char;
  var sex=$("input[name='input_sex']:checked").val();
	var char_num = $('#input_num_char').val();
  //console.log('running');
  //alert(all_char);
  //alert(sex);
  //alert(name);
  
  
  if(char_num <= 0)
  {
    char_num = 2;
  }
  //alert(char_num);
  var final_char=[];
  if(sex=='boy')
  {
    final_char=boy_char+middle_char;
  }
  else if(sex=='girl')
  {
    final_char=girl_char+middle_char;
  }
  else if(sex=='all')
  {
    final_char=boy_char+girl_char+middle_char;
  }
  $('#ol_name').empty();
  //alert(final_char);
  
  for(var i=0;i<30;i++)
  {
    
    var name=$('#input_family_name').val();
    
    for(var j=0;j<char_num;j++)
    {
      name +=  final_char[parseInt(Math.random()*final_char.length)]; 
      //name +=;
    }
    var str = '<li class="list-group-item">\
                <div class="checkbox">\
                  <label>\
                    <input type="checkbox" name="new_name" value='+name+'>'+name+
                  '</label>\
                </div></li>';
    
    //$('#ol_name').append('<li class="list-group-item"><input type="checkbox" class="">'+name+'</li>');
    $('#ol_name').append(str);
  }
  return false;
}

$('#btn_select').click(function(){
  names = $('input[name="new_name"]:checked');
  alert(names.length);
  names.each(function(){
    alert(this.val());
  });
  return false;
});





