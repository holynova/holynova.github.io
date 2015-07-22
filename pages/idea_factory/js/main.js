//主脚本
//2015年4月13日
var food_items;
var method_items;

$(document).ready(function(){
  //alert('ready to work');
  var str='标签 搞怪,模仿周杰伦;搞怪           \n五毛,,,,小品;;;幽默,;   笑星 搞笑\n 歌手特质 韩国\r 快乐女声 网络歌手 澳门歌手 影视歌三栖 广东歌手 性感 古典 主持 创作歌手 加油好男儿';
  var str1='立春、雨水、惊蛰、春分、清明、谷雨、立夏、小满、芒种、夏至、小暑、大暑、立秋、处暑、白露、秋分、寒露、霜降、立冬、小雪、大雪、冬至、小寒、大寒';
  var str2='甲子。乙丑。丙寅。丁卯。戊辰。己巳。庚午。辛未。壬申。癸酉。甲戌。乙亥。丙子。丁丑。戊寅。己卯。庚辰。辛巳。壬午。癸未 甲申。乙酉。丙戌。丁亥。戊子。己丑。庚寅。辛卯。壬辰。癸巳 甲午。乙未。丙申。丁酉。戊戌。己亥。庚子。辛丑。壬寅。癸卯 甲辰。乙巳。丙午。丁未。戊申。己酉。庚戌。辛亥。壬子。癸丑 甲寅。乙卯。丙辰。丁巳。戊午。己未。庚申。辛酉。壬戌。癸亥。';
  $('#food').val(str1);
  $('#method').val(str2);
  //alert($('#food').val());
  
  
});

$('#btn_make_label').click(function(){
  food_items = split($('#food').val());
  method_items = split($('#method').val());
  $('#food_labels').empty();
  $('#method_labels').empty();
  
  if(food_items)
  {
    for(i=0;i<food_items.length;i++)
    {
      $('#food_labels').append('<p><span class="label label-primary">'+food_items[i]+'</span></p>');
    }
  }
  if(method_items)
  {
    for(i=0;i<method_items.length;i++)
    {
      $('#method_labels').append('<p><span class="label label-success">'+method_items[i]+'</span></p>');
    }
  }
});

//生成创意按钮处理函数
$('#btn_make_idea').click(function(){
  var num_food = food_items.length;
  var num_method = method_items.length;
  var num_idea = $('#input_result_num').val();
 
  //alert(num_idea);
  
  if(num_idea < 0)
    num_idea = 100;
  
  $('#idea_labels').empty();
  for(i=0;i<num_idea;i++)
  {
    var str = i;
    str += ":[";
    for(var cnt=0;cnt<$('#input_food_num').val();cnt++)
    {
      str += food_items[parseInt(Math.random()*num_food)];
      str += " ";
    }
    str += '] + [';
    for(var cnt=0;cnt<$('#input_method_num').val();cnt++)
    {
      str += method_items[parseInt(Math.random()*num_method)];
      str += " ";
    }  
    str+=']';
    //console.log(i&":"&food_items[Math.random()*num_food]&"+"&method_items[Math.random()*num_method]);
    //console.log(i & ":" & Math.random()*num_food);
    console.log(str);
    $('#idea_labels').append('<p><span class="label label-warning">'+str+'</span></p>');
    
    
  }
 
});




function split(text)
{
  //var format_text = text.replace(/[，。？：；‘’！“”—……、]|(－{2})|(（）)|(【】)|({})|(《》)|[-,.?:;'"!`]|(-{2})|(/.{3})|(/(/))|(/[/])|({})/g,' ').replace(/\n/g,' ').replace(/ +/g,' ');
  var format_text = text.replace(/[，。？：；‘’！“”—……、]|[-,.?:;'"!`]/g,' ').replace(/[\n\r]/g,' ').replace(/ +/g,' ');
  var labels = format_text.split(' ');
  if(labels.length <= 0)
  {
    alert('有地方没填完整');
    return false;
    
  }  
  return labels;  
}
