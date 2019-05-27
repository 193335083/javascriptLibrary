# javascript library
javascript 库
   
说明：兼容全平台浏览器（包括IE6,7,8）。   

## 使用例子：

``` html
$(function () {
    $(windows).hover(function() {
        $(dom).html('hello word')
    }, function (){
        $(dom).html('hi')
    })
})
```
---
	 
## javascript library 方法   
   
| 方法名 | 说明 |
|---|---|
| html | 设置一个dom的html |
| text | 获取text和设置 |
| ge | 获取某一个节点，返回对象 |
| attr | 获取节点的属性和设置 |
| index |  获取节点索引  |
| opacity |  设置节点元素的透明度   |
| first |   获取第一个节点，返回对象   |
| last |   获取最后一个节点，返回对象  |
| eq |   获取指定节点，返回Base  |
| find |   子节点选择  |
| css |   设置css  |
| addClass |  添加class   |
| removeClass | 移除class |
| value | 设置表单字段内容和获取 |
| length | 获取节点数组的长度 |
| bind | 设置绑定事件 |
| form | 设置获取表单字段 |
| addRule | 在link文件里添加css |
| removeRule | link文件里删除css |
| hover | 鼠标移入移出方法 |
| show | 设置显示 |
| center | 区块居中 |
| lock | 锁屏功能 |
| unlock | 解除锁屏 |
| resize | 触发浏览器变化事件 |
| hide | 设置隐藏 |
| click | 触发click |
| animate | 动画 |
| toggle | 切换  |
| next | 获取下一个节点 |
| prev |获取上一个节点  |
| extend | 插件入口 |

---

## toogle，extend，animate使用教程
``` html
    // toogle
	$(dom).toggle(function (){
	    // Code ...
	},function(){
	    // Code ...
	})
	
	// extend
	// 单独文件需要在html里加载
	$().extend('extend-Name', function() {
	})
	
	// animate
    $(dom).animate({
        attr : '', animate名，如width，，height，top,left等等
        target : 0, // 目标位置
        start: 150, // 起始位置
        t : 30, // 毫秒一次
        step : 10, // 一次速度
        speed: 10, // 缓冲速度 默认缓冲速度为6
        type: 1, // 0标识均速 1标识缓冲
        fn : function () { // 完成执行
        }
    })
    
    // animate同时执行
    $(dom).next().animate({
        mul: {  // 目标
            height : 150,
            opacity : 100
        },
        start: 150,
        t : 30,
        step : 10,
        speed: 10,
        type: 1,
        fn : function () {
        }
    })
```
---

---
## 更新历史说明：   
v1.0.0   
* 初次提交   



   
