# 时间的颜色 jQuery 插件 
## 功能
产生一个会随着时间变化颜色的时钟, 有六种变色方式
## demo
[demo](http://xiaosang.net/plug_in/colorful_time/index.html)
## 下载和安装
[github下载地址](https://github.com/holynova/colorful_time_plug_in)
## 使用方法
1. 加载插件js文件

2. 给时钟创建一个容器, 并设定容器宽高
```
var $container = $('foo');

```
3. 在脚本中运行
```
$container.colorfulTime({
    fontSize:14px,
    mode:3
})
//或者完全采用默认参数
$container.colorfulTime()
```
## 参数设置
|参数|描述|默认值|
|-----|-----|-----|
|fontSize|时间的字体大小|容器高度的三分之一|
|mode|变色模式|0|

#### 6种变色模式

时分秒分别对应hsl色彩模式的色相\饱和度\明度

|mode|色相h|饱和度s|明度l|
|-----|-----|-----|-----|
|0|seconds|minutes|hours|
|1|seconds|hours|minutes|
|2|minutes|seconds|hours|
|3|minutes|hours|seconds|
|4|hours|seconds|minutes|
|5|hours|minutes|seconds|

