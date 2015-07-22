//2015年4月17日
//词频统计脚本

$(document).ready(init);
function init()
{
  //alert('ready');
  var str = '禁幄低张，雕栏巧护，就中独占残春。客华淡伫，绰约俱见天真。待得群花过後，一番风露晓妆新。妖娆艳态，妒风笑月，长［歹带］东君。东城边，南陌上，正日烘池馆，竞走香轮。绮筵散日，谁人可继芳尘？更好明光宫殿，几枝先近日边匀，金尊倒，拚了尽烛，不管黄昏。';
  var str1 = 'kkkkcccccccccccccc正日烘池cc正日烘池馆cz正日烘zddxxdgadljgaldighijkabcdefghijklmn';
  $('#in_text').val(str);
  $('#input_char_num').val('2');
  //char_frequency();
}

$('#btn_go').click(char_frequency);

function char_frequency()
{
  //过滤标点
  var in_str = $('#in_text').val();
  var char_num = $('#input_char_num').val();
  if(char_num <= 0)
    char_num = 2;
  
  var show_num = $('#input_show_num').val();
  if(show_num <= 0)
    show_num = 100;
  var dict ={};
  //alert(char_num);
  in_str = in_str.replace(/[，。？：；‘’！“”—……、．□（）　【】［］]|[-,.?:;'"!`~/*///(/))]/g,'|').replace(/[\n\r]/g,'').replace(/ /g,'|');
  //将标点和空格替换为‘|’，用来分词。
  
  //生成短词汇，并利用标点和空格进行基本的分词。
  for(var i=0;i<in_str.length + 1 - char_num;i++)
  {
    //alert(char_num);
    temp = parseInt(i)+parseInt(char_num);
    branch_str = in_str.slice(i,temp);
    //console.log(branch_str);
    //console.log(branch_str.indexOf('|'));
    if(branch_str.indexOf('|') == -1)
    {
      
      if(dict[branch_str] == null)
        dict[branch_str] = 1;
      else
        dict[branch_str] += 1;
      
    }
    
  
  }
  var arr=[];
  for(var key in dict)
  {
      arr.push([key,dict[key]]);
  }
  arr.sort(function(a,b){
    return b[1]-a[1];
  });
//  console.log(arr);
  var max_to_show;
  if(arr.length>show_num)
    max_to_show = show_num;
  else
    max_to_show = arr.length; 
  
  //$('#output_basic').empty();
  //$('#output_basic').append('<p>个字符</p>');
  $('#result_labels').empty();
  $('#result_labels').append('<p>共【'+in_str.length+'】个字符</p>');
  $('#result_labels').append('<p>共生成【'+arr.length+'】个有效的【'+char_num+'】字词汇</p><hr/>');
  
  
  for(var i=0;i<max_to_show;i++)
  {
    $('#result_labels').append('<p>第'+(i+1)+'名【'+arr[i][0]+'】出现【'+arr[i][1]+'】次</p>');
  }
  return false;
  
}


