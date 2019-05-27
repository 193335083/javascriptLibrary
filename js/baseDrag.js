// 拖拽
$().extend('drag', function() {
	var tags = arguments
	for(var i = 0; i < this.elements.length; i++) {
		// 点击鼠标
		addEvent(this.elements[i], 'mousedown', function(e) {
			var _this = this;
			// 获取拖拽框 左边和上边的长度
			// 点击长度 - 弹框左边长度 = 点击位置到弹窗长度 
			var diffX = e.clientX - this.offsetLeft
			var diffY = e.clientY - this.offsetTop

			// 空白拖动出现异常，阻止默认行为
			if(trim(this.innerHTML).length == 0) {
				e.preventDefault()
			}
			
			// 自定义拖拽区域
			var judge = false
			for (var i = 0; i < tags.length; i++) {
				if (e.target == tags[i]) {
					judge = true
					break
				}
			}

			if(judge) {
				// 移动鼠标
				addEvent(document, 'mousemove', move)
				// 抬起鼠标
				addEvent(document, 'mouseup', up)
			} else {
				removeEvent(document, 'mousemove', move)
				removeEvent(document, 'mouseup', up)
			}

			function move(e) {
				// 当前位置小于0 则超出左边
				// 当前位置大于总长度则超出右边
				var left = e.clientX - diffX;
				var top = e.clientY - diffY;
				
				if (left < 0) {
					left = 0;
				} else if (left <= getScroll().left) {
					left = getScroll().left;
				} else if (left > getInner().width + getScroll().left - _this.offsetWidth) {
					left = getInner().width + getScroll().left - _this.offsetWidth;
				}
				
				if (top < 0) {
					top = 0;
				} else if (top <= getScroll().top) {
					top = getScroll().top;
				} else if (top > getInner().height + getScroll().top - _this.offsetHeight) {
					top = getInner().height + getScroll().top - _this.offsetHeight;
				}
				
				_this.style.left = left + 'px';
				_this.style.top = top + 'px';
				
				if (typeof _this.setCapture != 'undefined') {
					_this.setCapture();
				} 
			}

			function up(e) {
				removeEvent(document, 'mousemove', move)
				removeEvent(document, 'mouseup', up)
				// 释放鼠标
				if(typeof _this.releaseCapture != 'undefined') {
					_this.releaseCapture()
				}
			}

		})
	}
	return this
})