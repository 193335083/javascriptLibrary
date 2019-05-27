// 调用
var $ = function(args) {
	return new Base(args)
}

// 库
function Base(args) {
	// 用来存储获取到的节点
	// 不能放在外面，会导致公有化
	this.elements = []
	// 是否是this?
	if(typeof args == 'object') { // undefined是对象
		if(args != undefined) {
			this.elements[0] = args
		}
	} else if(typeof args == 'string') {
		if(args.indexOf(' ') != -1) {
			var elements = args.split(' '),
				childElement = [], // 临时保持元素节点
				node = [document] // 存储父节点
			for(var i = 0; i < elements.length; i++) {
				switch(elements[i].charAt(0)) {
					case '#':
						childElement = [] // 清空节点, 存储子节点
						childElement.push(this.getId(elements[i].substring(1)))
						node = childElement // 存储节点，以便下次查找
						break
					case '.':
						childElement = [] // 清空节点, 存储子节点
						for(var j = 0; j < node.length; j++) {
							temps = this.getClass(elements[i].substring(1), node[j])
							for(var k = 0; k < temps.length; k++) {
								childElement.push(temps[k])
							}
						}
						node = childElement // 存储节点，以便下次查找
						break
					default:
						childElement = [] // 清空节点, 存储子节点
						for(var j = 0; j < node.length; j++) {
							temps = this.getTagName(elements[i], node[j])
							for(var k = 0; k < temps.length; k++) {
								childElement.push(temps[k])
							}
						}
						node = childElement // 存储节点，以便下次查找
				}
			}
			this.elements = childElement
		} else {
			switch(args.charAt(0)) {
				case '#':
					this.elements.push(this.getId(args.substring(1)))
					break
				case '.':
					this.elements = this.getClass(args.substring(1))
					break
				default:
					this.elements = this.getTagName(args)
			}
		}
	} else if (typeof args == 'function') {
		this.ready(args)
	}

}

// DOM加载
Base.prototype.ready = function (fn) {
	addDomloaded(fn)
}

// 获取id
Base.prototype.getId = function(id) {
	return document.getElementById(id)
}

// 获取元素节点
Base.prototype.getTagName = function(tag, parentNode) {
	var node = null
	var temps = []
	if(parentNode != undefined) {
		node = parentNode
	} else {
		node = document
	}
	var tags = node.getElementsByTagName(tag)
	for(var i = 0; i < tags.length; i++) {
		temps.push(tags[i])
	}
	return temps
}

// 获取class节点
Base.prototype.getClass = function(className, parentNode) {
	// ie8不支持getElementsByClassName
	var node = null
	var temps = []
	if(parentNode != undefined) {
		node = parentNode
	} else {
		node = document
	}
	var all = node.getElementsByTagName('*')
	for(var i = 0; i < all.length; i++) {
		if ((new RegExp('(\\s|^)' +className +'(\\s|$)')).test(all[i].className)) {
			temps.push(all[i])
		}
	}
	return temps
}

// 获取某一个节点，返回对象
Base.prototype.ge = function(num) {
	return this.elements[num]
}

//获取节点的属性
Base.prototype.attr = function (attr, value) {
	for(var i = 0; i < this.elements.length; i++) {
		if (arguments.length == 1) {
			return this.elements[i].getAttribute(attr)
		} else if (arguments.length == 2){
			this.elements[i].setAttribute(attr, value)
		}
	}
	return this
}

//获取节点索引
Base.prototype.index = function () {
	var children = this.elements[0].parentNode.children
	for(var i = 0; i < children.length; i++) {
		if (this.elements[0] == children[i]) {
			return i
		} 
	}
}

//设置节点元素的透明度
Base.prototype.opacity = function (num) {
	for(var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.opacity = num / 100
		this.elements[i].style.filter = 'alpha(opacity=' + num + ')'
	}
}

// 获取第一个节点，返回对象
Base.prototype.first = function () {
	return this.elements[0]
}

// 获取最后一个节点，返回对象
Base.prototype.last = function () {
	return this.elements[this.elements.length - 1]
}

// 获取指定节点，返回Base
Base.prototype.eq = function(num) {
	var element = this.elements[num]
	this.elements = []
	this.elements[0] = element
	return this
}

// 子节点选择
Base.prototype.find = function(str) {
	var childElements = []
	for(var i = 0; i < this.elements.length; i++) {
		switch(str.charAt(0)) {
			case '#':
				childElements.push(this.getId(str.substring(1)))
				break
			case '.':
				var temps = this.getClass(str.substring(1), this.elements[i])
				for(var j = 0; j < temps.length; j++) {
					childElements.push(temps[j])
				}
				break
			default:
				var temps = this.getTagName(str, this.elements[i])
				for(var j = 0; j < temps.length; j++) {
					childElements.push(temps[j])
				}
		}
	}
	this.elements = childElements
	return this
}

// 设置css
Base.prototype.css = function(attr, value) {
	for(var i = 0; i < this.elements.length; i++) {
		if(arguments.length == 1) {
			return getStyle(this.elements[i], attr) + 'px'
		}
		this.elements[i].style[attr] = value
	}
	return this
}

// 添加class
Base.prototype.addClass = function(className) {
	for(var i = 0; i < this.elements.length; i++) {
		// 防止二次添加
		if(!hasClass(this.elements[i], className)) {
			this.elements[i].className += ' ' + className
		}
	}
	return this
}

// 移除class
Base.prototype.removeClass = function(className) {
	for(var i = 0; i < this.elements.length; i++) {
		// 查找是否有该class
		if(hasClass(this.elements[i], className)) {
			this.elements[i].className = this.elements[i].className.replace(new RegExp(className), '')
		}
	}
	return this
}

// 设置表单字段内容获取
Base.prototype.value = function (str) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (arguments.length == 0) {
			return this.elements[i].value
		}
		this.elements[i].value = str
	}
	return this
}

// 获取text
Base.prototype.text = function (str) {
	for (var i = 0; i < this.elements.length; i ++) {
	var element = this.elements[i]
		if (arguments.length == 0) {
			return (typeof element.textContent == 'string') ? element.textContent : element.innerText
		}
			return (typeof element.textContent == 'string') ? element.textContent = str : element.innerText = str 
		}
	return this
}

// 获取节点数组的长度
Base.prototype.length = function () {
	return this.elements.length
}

//设置绑定事件
Base.prototype.bind = function (event, fn) {
	for (var i = 0; i < this.elements.length; i ++) {
		addEvent(this.elements[i], event, fn)
	}
	return this
}

//设置获取表单字段
Base.prototype.form = function (name) {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i] = this.elements[i][name]
	}
	return this
}

// 在link文件里添加css
Base.prototype.addRule = function(num, selectorText, cssText, position) {
	var sheet = document.styleSheets[num]
	insertRule(sheet, selectorText, cssText, position)
	return this
}

// link文件里删除css
Base.prototype.removeRule = function(num, index) {
	var sheet = document.styleSheets[num]
	deleteRule(sheet, index)
	return this
}

// 设置html
Base.prototype.html = function(str) {
	for(var i = 0; i < this.elements.length; i++) {
		if(arguments.length == 0) {
			return this.elements[i].innerHTML
		}
		this.elements[i].innerHTML = str
	}
	return this
}

//鼠标移入移出方法
Base.prototype.hover = function(over, out) {
	for(var i = 0; i < this.elements.length; i++) {
		addEvent(this.elements[i], 'mouseover', over)
		addEvent(this.elements[i], 'mouseout', out)
	}
	return this
}

// 设置显示
Base.prototype.show = function() {
	for(var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display = 'block'
	}
	return this
}

// 区块居中
Base.prototype.center = function(width, height) {
	var top = (getInner().height - height) / 2 + getScroll().top
	var left = (getInner().width - width) / 2 + getScroll().left
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].style.top = top + 'px'
		this.elements[i].style.left = left + 'px'
	}
	return this
}

// 锁屏功能
Base.prototype.lock = function() {
	for(var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.width = getInner().width + getScroll().left + 'px'
		this.elements[i].style.height = getInner().height + getScroll().top + 'px'
		this.elements[i].style.display = 'block'
		addEvent(this.elements[i],'selectstart',predef)
		addEvent(this.elements[i],'mousedown',predef)
		addEvent(this.elements[i],'mouseup', predef)
	}
	fixedScroll.left = getScroll().left
	fixedScroll.top = getScroll().top
	document.body.style.overflow = 'hidden'
	addEvent(window, 'scroll', fixedScroll)
	return this
}

// 解除锁屏
Base.prototype.unlock = function() {
	for(var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display = 'none'
		removeEvent(this.elements[i], 'mousedown', predef)
		removeEvent(this.elements[i], 'mouseup', predef)
		removeEvent(this.elements[i], 'selectstart', predef)
	}
	removeEvent(window, 'scroll', fixedScroll)
	document.body.style.overflow = 'auto'
	return this
}

// 触发浏览器变化事件
Base.prototype.resize = function (fn) {
	for (var i = 0; i < this.elements.length; i ++) {
		var element = this.elements[i];
		addEvent(window, 'resize', function () {
			fn();
			if (element.offsetLeft > getInner().width + getScroll().left - element.offsetWidth) {
				element.style.left = getInner().width + getScroll().left - element.offsetWidth + 'px';
				if (element.offsetLeft <= 0 + getScroll().left) {
					element.style.left = getScroll().left + 'px'
				}
			}
			if (element.offsetTop > getInner().height + getScroll().top - element.offsetHeight) {
				element.style.top = getInner().height + getScroll().top - element.offsetHeight + 'px';
				if (element.offsetTop <= 0 + getScroll().top) {
					element.style.top = getScroll().top + 'px'
				}
			}
		});
	}
	return this;
}

// 设置隐藏
Base.prototype.hide = function() {
	for(var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display = 'none'
	}
	return this
}

// 触发click
Base.prototype.click = function(fn) {
	for(var i = 0; i < this.elements.length; i++) {
		this.elements[i].onclick = fn
	}
	return this
}

// 动画
// 参数只有letf和top
Base.prototype.animate = function (obj) {
	for (var i = 0; i < this.elements.length; i++) {
		var element = this.elements[i],
			attr = obj.attr == 'x' ? 'left': obj.attr == 'y' ? 'top' : obj.attr == 'w' ? 'width' : obj.attr == 'h' ? 'height' : obj.attr == 'o' ? 'opacity' : obj.attr != undefined ? obj.attr : 'left' ,  // 可选 x轴，y轴 和透明度默认left
			start = obj.start != undefined ? obj.start : attr == 'opacity' ? getStyle(element, attr) * 100 : getStyle(element, attr), // 可选 默认为css起始位置
			step = obj.step != undefined ? obj.step : 10,// 可选 每次移动长度，默认为10
			target = obj.target, // 目标位置
			alter = obj.alter,  // 增量
			t = obj.t != undefined ? obj.t : 30, // 可选 默认50毫秒执行一次
			speed = obj.speed != undefined ? obj.speed : 6,  // 可选， 默认缓冲速度为6
			type = obj.type == 0 ? 'constant' : obj.type == 1 ? 'buffer' : 'buffer', // 可选 0标识均速 1标识缓冲
			mul = obj.mul,
			_this = this
		// 判断增量存在并且目标量不存在 ，从start加alter
		// 判断增量并且目标量存在 ，则以目标量为主
		// 目标量和增量都不存在，则报错
		if (alter != undefined && target == undefined) {
			// 从start位置增加alter
			target = alter + start
		} else if (alter == undefined && target == undefined && mul == undefined){
			throw new Error('alter增量或target目标量必选传一个')
		}
		
		// 起始位置
		if (attr == 'opacity') {
			element.style.opacity = parseFloat(start / 100)
			element.style.filter ='alpha(opacity='+ start +')'
		} else {
			element.style[attr] = start + 'px'
		}

		// 如果当前位置大于要移动位置，为负数
		if (getStyle(element, attr) > target) {
			step = -step
		}
		
		if (mul == undefined) {
			mul = {}
			mul[attr] = target
		}
 
		// 停止上一次的定时器
		clearInterval(element.timer)
		// 全局time
		element.timer = setInterval(function (){
			//动画是否全部执行完毕
			var judge = true
			
			for (var i in mul) {
				attr = i == 'x' ? 'left' : i == 'y' ? 'top' : i == 'w' ? 'width' : i == 'h' ? 'height' : i == 'o' ? 'opacity' : i != undefined ? i : 'left'
				target = mul[i]
				
				// 缓冲
				if (type == 'buffer') {
					step = attr == 'opacity' ? (target - getStyle(element, attr) * 100) / speed : (target - getStyle(element, attr)) / speed
					step = step > 0 ? Math.ceil(step) : Math.floor(step)
				}
				
				// 设置透明度
				if (attr == 'opacity') {
					if (step == 0){
						_this.setOpacity()
						
					}else if (Math.abs(getStyle(element, attr) * 100 - target) <= step && step > 0) {
						_this.setOpacity()
						
					} else if (Math.abs(getStyle(element, attr) * 100 - target) <= Math.abs(step) && step < 0) {
						_this.setOpacity()
	
					} else {
						var temp = parseFloat(getStyle(element, attr) * 100)
						element.style.opacity = parseInt(temp + step) / 100
						element.style.filter ='alpha(opacity='+ parseInt(temp + step) +')'
					}
					if (parseInt(target) != parseInt(parseFloat(getStyle(element, attr)) * 100)) {
						judge = false
					}
				// 设置长度和移动等
				} else {
					if (step == 0){
						_this.setTarget()
						
					}else if (Math.abs( getStyle(element, attr) - target ) <= step && step > 0) {
						_this.setTarget()
						
					} else if (Math.abs( getStyle(element, attr) - target ) <= Math.abs(step) && step < 0) {
						_this.setTarget()
						
					} else {
						element.style[attr] = (getStyle(element, attr) + step) + 'px'
					}
					if (parseInt(target) != parseInt(getStyle(element, attr))) {
						judge = false
					}
				}
			}
			// 都执行完毕
			if (judge) {
				clearInterval(element.timer)
				if (obj.fn != undefined) {
					obj.fn()
				}
			}
		}, t)
		//长度或移动达到目标值
		this.setTarget = function () {
			element.style[attr] = target + 'px'
	
		}
		// 透明度到达目标值
		this.setOpacity = function () {
			element.style.opacity = parseInt(target) / 100
			element.style.filter ='alpha(opacity='+ parseInt(target) +')'
		}
	}
	return this
}

// 切换 
Base.prototype.toggle = function (){
	for (var i = 0; i < this.elements.length; i++) {
		(function (element, args){
			var count = 0
			addEvent(element, 'click', function (){
				args[count++ % args.length].call(this)
			})
		})(this.elements[i], arguments)
	}
	return this
}

// 获取下一个节点
Base.prototype.next = function () {
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i] = this.elements[i].nextSibling
		if (this.elements[i] == null) {
			throw new Error('找不到下一个同级元素')
		}
		if (this.elements[i].nodeType == 3) {
			this.next()
		}
	}
	return this
}

// 获取上一个节点
Base.prototype.prev = function () {
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i] = this.elements[i].previousSibling
		if (this.elements[i] == null) {
			throw new Error('找不到上一个同级元素')
		}
		if (this.elements[i].nodeType == 3) {
			this.prev()
		}
	}
	return this
}

// 插件入口
Base.prototype.extend = function(name, fn) {
	Base.prototype[name] = fn
}

// 计数器
addEvent.index = {}


// 浏览器事件绑定
function addEvent(obj, type, fn) {
	if(typeof obj.addEventListener != 'undefined') { // 火狐谷歌
		obj.addEventListener(type, fn, false)
	} else { // 旧版ie 自定义绑定事件
		// 创建一个事件
		if(!obj.events) {
			obj.events = {}
		}

		// 第一次执行时执行
		if(!obj.events[type]) {
			// 创建一个存放事件的函数数组
			obj.events[type] = []
			// 创建一个分类计数器
			addEvent.index[type] = 0
			//同一个注册函数进行屏蔽，不添加到计数器中
		} else if(addEvent.equal(obj.events[type], fn)) {
			return false
		}
		// 第二次用计数器存储
		obj.events[type][addEvent.index[type]++] = fn
		// 执行所有事件处理函数
		obj['on' + type] = addEvent.exec
	}
}

//执行事件处理函数
addEvent.exec = function(event) {
	// ie在event里加上preventDefault和stopPropagation事件
	var e = event || addEvent.fixEvent(window.event)
	var es = this.events[e.type]
	for(var i in es) {
		es[i].call(this, e)
	}
}

// 兼容ie阻止默认行为和冒泡
addEvent.fixEvent = function(event) {
	// IE阻止默认行为
	event.preventDefault = addEvent.fixEvent.preventDefault
	// IE取消冒泡
	event.stopPropagation = addEvent.fixEvent.stopPropagation
	// IE元素
	event.target = event.srcElement
	return event
}

//IE阻止默认行为
addEvent.fixEvent.preventDefault = function() {
	this.returnValue = false
}

//IE取消冒泡
addEvent.fixEvent.stopPropagation = function() {
	this.cancelBubble = true
}

//同一个注册函数进行屏蔽
addEvent.equal = function(es, fn) {
	for(var i in es) {
		if(es[i] == fn) return true
	}
	return false
}

// 删除绑定事件
function removeEvent(obj, type, fn) {
	if(typeof obj.removeEventListener != 'undefined') { // 火狐谷歌
		obj.removeEventListener(type, fn, false)
	} else if(typeof obj.detachEvent != 'undefined') { // 旧版Ie浏览器
		if(obj.events != undefined) {
			for(var i in obj.events[type]) {
				if(obj.events[type][i] == fn) {
					delete obj.events[type][i]
				}
			}
		}
	}
}

// 浏览器获取视口大小
function getInner() {
	if(typeof window.innerWidth != 'undefined') {
		return {
			width: window.innerWidth,
			height: window.innerHeight
		}
	} else {
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		}
	}
}

// 浏览器获取Style
function getStyle(element, attr) {
	var value = ''
	if(typeof window.getComputedStyle != 'undefined') { // 火狐谷歌
		value =  window.getComputedStyle(element, null)[attr]
	} else if(typeof element.currentStyle != 'undeinfed') { // 旧版Ie浏览器
		value = element.currentStyle[attr]
	}
	return parseFloat(value)
}

// 判断class是否存在
function hasClass(element, className) {
	return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

// 在link文件里添加css规则
function insertRule(sheet, selectorText, cssText, position) {
	if(typeof sheet.insertRule != 'undefined') { // 火狐谷歌
		sheet.insertRule(selectorText + '{' + cssText + '}', position)
	} else if(typeof sheet.addRule != 'undefined') { // 旧版Ie浏览器
		sheet.addRule(selectorText, cssText, position)
	}
}

// link文件里删除css规则
function deleteRule(sheet, index) {
	if(typeof sheet.insertRule != 'undefined') { // 火狐谷歌
		sheet.deleteRule(index)
	} else if(typeof sheet.addRule != 'undefined') { // 旧版Ie浏览器
		sheet.removeRule(index)
	}
}

// 获取event对象
function getEvent(event) {
	return event || window.event
}

// 阻止默认行为
function preDef(event) {
	var e = getEvent(event)
	if(typeof e.preventDefault != 'undefined') { // 火狐谷歌
		e.preventDefault()
	} else { // 旧版Ie浏览器
		e.returnValue = false
	}
}

// 删除前后空格
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '')
}

// 滚动条清零
function scrllTop() {
	document.body.scrollTop = 0
	document.documentElement.scrollTop = 0
}

// DOM加载
function addDomloaded(fn) {
	var isReady = false
	var timer = null
	// 旧版浏览器准备
	this.doReady = function () {
		// 停止
		if (timer) {
			clearInterval(timer)
		}
		// 出错退出
		if (isReady) {
			clearInterval(timer)
			return false
		}
		isReady = true
		fn()
	}
	
	if(document.addEventListener) { // 新版浏览器
		addEvent(document, 'DOMContentLoaded', function() {
			fn()
			removeEvent(document, 'DOMContentLoaded', arguments.callee)
		})
	} else { // 旧版浏览器
		timer = null
		timer = setInterval(function () {
			try {
				document.documentElement.doScroll('left')
				this.doReady()
			} catch (e) {
				console.log(e)
			}
		}, 1)
	}
}

// 获取一个元素到顶点位置
function offsetTop (element) {
	var top = element.offsetTop
	var parent = element.offsetParent
	while (parent != null) {
		top += parent.offsetTop
		parent = parent.offsetParent
	}
	return top
}

// 获取滚动条位置
function getScroll () {
	return {
		top: document.documentElement.scrollTop || document.body.scrollTop,
		left: document.documentElement.scrollLeft || document.documentElement.scrollLeft
	}
}

//某一个值是否存在某一个数组中
function inArray(array, value) {
	for (var i in array) {
		if (array[i] === value) return true
	}
	return false;
}

//禁止选择文本 
function predef (e) {
	e.preventDefault()
}

//获取某一个节点的上一个节点的索引
function prevIndex (current, parent) {
	var length = parent.children.length - 1
	if (current == 0) return length
	return parseInt(current) - 1
}

//获取某一个节点的下一个节点的索引
function nextIndex (current, parent) {
	var length = parent.children.length - 1
	if (current == length) return 0
	return parseInt(current) + 1
}

//滚动条定位
function fixedScroll () {
	setTimeout(function () {
		window.scrollTo(fixedScroll.left, fixedScroll.top);
	}, 100)
}