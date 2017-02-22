# 日期选择器jQuery插件
## 功能和特点
- 日期选择器
- 可以鼠标点选
- 快速定位：在输入框内按```yyyy-MM-dd```格式输入，全键盘操作
- 代码控制：可在脚本内用js操作改变日期
- 12个月快速翻页，20年范围快速选择
## demo
[demo]()
## 下载
[github下载链接]()
## 使用方法
1. 引入文件
```
<link rel="stylesheet" type="text/css" href="jquery.date_picker.css">
<script src='jquery.date_picker.js'></script>
```
2. html中创建一个容器
```
<div id ='foo'></div>
```
3.在脚本中初始化
```
var $container = $('#foo');
var picker = $box.datePicker(options);
```

## options选项设置

name | desc | default value
---|---|---
initDate |the initial date| today
dateChangeCallback |日期发生人为更改时,执行这个回调函数 |null
animateDuration|动画效果的时长(ms)|250

## 函数用法

```
//回调函数
//回调函数的形参是从控件传回的date
var $container = $('#foo');
var picker = $box.datePicker({
    dateChangeCallback:foo
});
//比如：回调函数在控制台中打印当前控件时间
function foo(date){
    console.log(date.toLocaleString());
}

//脚本中获取当前控件日期
var inputDate = picker.getDate();
```

