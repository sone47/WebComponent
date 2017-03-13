function Drag(drag, dragable) {
	this.drag = drag;
	this.dragable = dragable;

	this.init();
	this.bindDOM();
}

Drag.prototype.init = function() {
	this.offsetX = 0;
	this.offsetY = 0;
};

Drag.prototype.bindDOM = function() {
	var self = this;

	this.dragable.onmousedown = function(e) {
		self.downHandler(self, e);
		document.onmousemove = function(e) {
			self.moveHandler(self, e);
		};
		document.onmouseup = function(e) {
			self.upHandler(self, e);
		};
	};
};

Drag.prototype.downHandler = function(self, e) {
	e.preventDefault();
	e.stopPropagation();

	var drag = self.drag;

	self.offsetX = e.pageX - drag.offsetLeft;
	self.offsetY = e.pageY - drag.offsetTop;
};

Drag.prototype.downHandler = function(self, e) {
	e.preventDefault();
	e.stopPropagation();

	var drag = self.drag;

	self.offsetX = e.pageX - drag.offsetLeft;
	self.offsetY = e.pageY - drag.offsetTop;
};

Drag.prototype.moveHandler = function(self, e) {
	e.preventDefault();
	e.stopPropagation();

	var style = window.getComputedStyle(self.drag);

	var maxX = window.innerWidth - parseInt(style.width);
	var minX = 0;
	var maxY = window.innerHeight - parseInt(style.height);
	var minY = 0;
	var left = e.pageX - self.offsetX;
	var top = e.pageY - self.offsetY;

	left > maxX && (left = maxX);
	left < minX && (left = minX);
	top > maxY && (top = maxY);
	top < minY && (top = minY);

	drag.style.left = left + 'px';
	drag.style.top = top + 'px';
};

Drag.prototype.upHandler = function(self) {
	document.onmousemove = null;
	document.onmouseup = null;
};