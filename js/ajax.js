/**
 *******  method 请求方法							(string)    *********
 *******  url 请求链接 								(string)   	*********
 *******  data 发送数据   				     	(Object)    *********
 *******  async false/true 异步 同步  	(boolean)   *********
 *******  success 成功  函数    				(function)	*********
 **/

// ajax请求
function ajax(obj) {
	// ajax 请求兼容
	var xhr = (function() {
		if (typeof window.XMLHttpRequest !== 'undefined') {
			return new XMLHttpRequest()
		} else if (typeof window.ActiveXObject !== 'undefined') {
			var versions = [
				'MSXML2.XMLHttp.6.0',
				'MSXML2.XMLHttp.3.0',
				'MSXML2.XMLHttp'
			]
			for (var i = 0; i < versions.length; i++) {
				try {
					return new ActiveXObject(versions[i])
				} catch (e) {
					// 错误跳过
				}
			}
		} else {
			throw new Error('您的浏览器不支持')
		}
	})()

	// 编码
	obj.data = (function(data) {
		var arr = []
		for (var item in data) {
			arr.push(encodeURIComponent(item) + '=' + encodeURIComponent(data[item]))
		}
		return arr.join('&')
	})(obj.data)

	if (obj.method === 'get') {
		obj.url += obj.url.indexOf('?') === -1 ? '?' + obj.data : '&' + obj.data
	}

	// 异步执行
	if (obj.async === true) {
		xhr.onreadystatechange = function() {
			/***
				0: 请求未初始化
				1: 服务器连接已建立
				2: 请求已接收
				3: 请求处理中
				4: 请求已完成，且响应已就绪
			***/
			if (xhr.readyState === 4) {
				callback()
			}
		}
	}
	// 请求准备
	xhr.open(obj.method, obj.url, obj.async)
	// 判断请求方法
	if (obj.method === 'get') {
		// get
		xhr.send()
	} else {
		// post
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
		xhr.send(obj.data)
	}

	// 同步
	if (obj.async === false) {
		callback()
	}

	// 判断是否正确请求和获取数据
	function callback() {
		if (xhr.status === 200) {
			obj.success(xhr.responseText)
		} else {
			throw new Error('请求错误端口：' + xhr.status + ';' + '错误数据:' + xhr.statusText)
		}
	}
}
