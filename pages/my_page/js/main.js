//2015年4月17日
//词频统计脚本

$(document).ready(init);
function init()
{
  //alert('ready');
  var str = '禁幄低张，雕栏巧护，就中独占残春。客华淡伫，绰约俱见天真。待得群花过後，一番风露晓妆新。妖娆艳态，妒风笑月，长［歹带］东君。东城边，南陌上，正日烘池馆，竞走香轮。绮筵散日，谁人可继芳尘？更好明光宫殿，几枝先近日边匀，金尊倒，拚了尽烛，不管黄昏。';
  var str1 = 'zzddxxdgadljgaldighijkabcdefghijklmn';
  $('#in_text').val(str1);
  $('#input_char_num').val('1');
  
}

$('#btn_go').click(char_frequency);

function char_frequency()
{
  //过滤标点
  var in_str = $('#in_text').val();
  var char_num = $('#input_char_num').val();
  var dict = new Array();
  //alert(char_num);
  in_str = in_str.replace(/[，。？：；‘’！“”—……、［］]|[-,.?:;'"!`]/g,'').replace(/[\n\r]/g,'').replace(/ /g,'');
  //var branch_str;
  $('#result_labels').empty();
  for(var i=0;i<in_str.length + 1 - char_num;i++)
  {
    //alert(char_num);
    temp = parseInt(i)+parseInt(char_num);
    branch_str = in_str.slice(i,temp);
    if(dict[branch_str] == null)
    {
      dict[branch_str] = 1;
      console.log(branch_str+'new');
    }
    else
    {
      dict[branch_str] += 1;
      
      console.log(branch_str+'+1');
    }
    dict.sort(function(a,b){
      return a.val - b.val;
    });
    
  } 
  //dict.sort();
  for(key in dict)
  {
    $('#result_labels').append('<p>'+key+'->'+dict[key]+'</p>');
  }    
  
  //排序
  
  //输出结果
  return false;
  
}
//字典排序

function dict_sort(a,b)
{
  return dict[b]-dict[a];
}


