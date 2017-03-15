var Crop = function(config) {
  var defaultConfig = {
    boxSize: 500,
    showSize: {
      'circle': [100],
      'square': [100, 200]
    }
  };

  for(let props in defaultConfig) {
  	if(config[props] === undefined) {
  		config[props] = defaultConfig[props];
  	}
  }

  this.box = config.box;
  this.img = config.img;
  this.config = config;
  this.scale = {};

  var image = new Image();
  image.src = this.img;
  image.addEventListener('load', this.init.bind(this));
};

Crop.prototype.init = function() {
  this.renderDOM();
  this.position();
  this.show();
  this.resize();
  this.move();
};

Crop.prototype.renderDOM = function() {
  var box = this.box;
  var crop = document.createElement('div');
  var preview = document.createElement('div');
  var src = this.img;
  var boxSize = this.config.boxSize;

  crop.className = 'crop';
  preview.className = 'preview';

  box.appendChild(crop);
  box.appendChild(preview);

  this.crop = crop;
  this.preview = preview;

  crop.innerHTML = '<div class="crop-container"><img src="'+ src +'" class="crop-img"></div><div class="target-box"><div class="target-container"><img src="'+ src +'" class="target"></div><div class="target-resize"></div></div>';

  box.style.cssText = 'width:' + boxSize + 'px;height:' + boxSize + 'px;';
  crop.style.cssText = 'width:' + boxSize + 'px;height:' + boxSize + 'px;';

  var {circle, square} = this.config.showSize;
  var append = '';

  circle.forEach(function (value) {
    append += `<div class="preview-frame circle-preview" style="width:${value}px;height:${value}px"><img src="${src}"></div><div class="show-size">${value}x${value}</div>`;
  });
  square.forEach(function (value) {
    append += `<div class="preview-frame square-preview" style="width:${value}px;height:${value}px"><img src="${src}"></div><div class="show-size">${value}x${value}</div>`;
  });

  preview.innerHTML = append;
};

Crop.prototype.show = function() {
  var crop = this.crop;
  var preview = this.preview;
  var image = document.getElementsByClassName('crop-img')[0];
  var showSize = this.config.showSize;

  var scale = this.scale;

  var imageWidth = parseInt(window.getComputedStyle(image).width),
      targetContainer = crop.getElementsByClassName('target-container')[0],
      targetContainerWidth= parseInt(window.getComputedStyle(targetContainer).width),
      circle = preview.getElementsByClassName('circle-preview'),
      square = preview.getElementsByClassName('square-preview');

  for(let key in showSize) {
    scale[key] = [];
    for(let i = 0; i < showSize[key].length; i++) {
      scale[key][i] = showSize[key][i]/targetContainerWidth;
    }
  }

  [].forEach.call(circle, function(value, index) {
    value.getElementsByTagName('img')[0].style.width = scale.circle[index] * imageWidth + 'px';
  });
  [].forEach.call(square, function(value, index) {
    value.getElementsByTagName('img')[0].style.width = scale.square[index] * imageWidth + 'px';
  });

  this.scale = scale;
};

Crop.prototype.position = function() {
  var crop = this.crop;
  var image = crop.getElementsByClassName('crop-img')[0];

  var cropLength = window.getComputedStyle(crop).width,
      previewPane = crop.getElementsByClassName('crop-container')[0],
      targetBox = crop.getElementsByClassName('target-box')[0],
      target = crop.getElementsByClassName('target')[0],
      imageCssStyle = window.getComputedStyle(image),
      HeightIsLonger = parseInt(imageCssStyle.height) > parseInt(imageCssStyle.width),
      imageMaxBorder = HeightIsLonger? 'height': 'width',
      moveBorder = HeightIsLonger? 'width': 'height',
      marginBorder = HeightIsLonger? 'marginLeft': 'marginTop',
      marginLength = 0;

  image.style[imageMaxBorder] = target.style[imageMaxBorder] =  cropLength;
  marginLength = (parseInt(cropLength) - parseInt(imageCssStyle[moveBorder])) / 2 + 'px';
  targetBox.style[marginBorder] = marginLength;
  previewPane.style[marginBorder] = marginLength;
};

Crop.prototype.move = function() {
  var crop = this.crop;
  var preview = this.preview;
  var targetBox = crop.getElementsByClassName('target-box')[0],
      target = crop.getElementsByClassName('target')[0],
      image = crop.getElementsByClassName('crop-img')[0],
      circle = preview.getElementsByClassName('circle-preview'),
      square = preview.getElementsByClassName('square-preview');

  var self = this,
      scale;

  targetBox.addEventListener('mousedown', mouseDownHandler);

  function mouseDownHandler(e) {
    e.preventDefault();

    scale = self.scale;

    this.left = this.left? parseInt(targetBox.style.left): 0;
    this.top = this.top? parseInt(targetBox.style.top): 0;

    targetBox.offsetX = e.clientX - this.left,
    targetBox.offsetY = e.clientY - this.top;

    targetBox.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

    function mouseMoveHandler(e) {
    e.preventDefault();

    this.left = e.clientX - targetBox.offsetX;
    this.top = e.clientY - targetBox.offsetY;

    var imageCssStyle = window.getComputedStyle(image),
        eleCssStyle = window.getComputedStyle(this),
        minLeft = 0
        maxLeft = parseInt(imageCssStyle.width) - parseInt(eleCssStyle.width),
        minTop = 0,
        maxTop = parseInt(imageCssStyle.height) - parseInt(eleCssStyle.height);

    if(this.left < minLeft) {
      this.left = minLeft;
    }
    if(this.left > maxLeft) {
      this.left = maxLeft;
    }

    if(this.top < minTop) {
      this.top = minTop;
    }
    if(this.top > maxTop) {
      this.top = maxTop;
    }
		
    targetBox.style.left = this.left + 'px';
    targetBox.style.top = this.top + 'px';
    target.style.left = -this.left + 'px';
    target.style.top = -this.top + 'px';

    for(let i = 0; i < circle.length; i ++) {
      circle[i].getElementsByTagName('img')[0].style.marginLeft = -this.left * scale.circle[i] + 'px';
      circle[i].getElementsByTagName('img')[0].style.marginTop = -this.top * scale.circle[i] + 'px';
    }
    for(let i = 0; i < square.length; i ++) {
      square[i].getElementsByTagName('img')[0].style.marginLeft = -this.left * scale.square[i] + 'px';
      square[i].getElementsByTagName('img')[0].style.marginTop = -this.top * scale.square[i] + 'px';
    }
  }

  function mouseUpHandler() {
    targetBox.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  }
};

Crop.prototype.resize = function() {
  var crop = this.crop;
  var preview = this.preview;
  var showSize = this.config.showSize;
  var targetResize = crop.getElementsByClassName('target-resize')[0],
      targetBox = crop.getElementsByClassName('target-box')[0],
      targetContainer = crop.getElementsByClassName('target-container')[0],
      image = crop.getElementsByClassName('crop-img')[0],
      circle = preview.getElementsByClassName('circle-preview'),
      square = preview.getElementsByClassName('square-preview');

  var boxCssStyle = window.getComputedStyle(targetBox);

  var self = this;

  targetResize.addEventListener('mousedown', mouseDownHandler);

  function mouseDownHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    this.left = e.clientX;
    this.top = e.clientY;
    this.width = parseInt(boxCssStyle.width);
    this.height = parseInt(boxCssStyle.height);

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

  function mouseMoveHandler(e) {
    e.preventDefault();

    var offsetX = e.clientX - targetResize.left,
        offsetY = e.clientY - targetResize.top;

    var imageCssStyle = window.getComputedStyle(image),
        imageWidth = parseInt(imageCssStyle.width),
        imageHeight = parseInt(imageCssStyle.height),
        boxLeft = parseInt(boxCssStyle.left),
        boxTop = parseInt(boxCssStyle.top),
        offsetWidth = imageWidth - parseInt(boxCssStyle.left),
        offsetHeight = imageHeight - parseInt(boxCssStyle.top),
        maxLength = offsetWidth > offsetHeight? offsetHeight: offsetWidth,
        minLength = maxLength * 0.2,
        scale = {};

    var width = targetResize.width + offsetX,
        height = targetResize.height + offsetY,
        length = 0;

    length = (width >= height? width: height);

    if(length < minLength) {
      length = minLength;
    } else if(length > maxLength) {
      length = maxLength;
    }

    for(let key in showSize) {
      scale[key] = [];
      for(let i = 0; i < showSize[key].length; i++) {
        scale[key][i] = showSize[key][i]/length;
      }
    }

    targetBox.style.width = targetBox.style.height = length + 'px';

    for(let i = 0; i < circle.length; i++) {
      let img = circle[i].getElementsByTagName('img')[0];
      img.style.width = scale.circle[i] * imageWidth + 'px';
      img.style.marginLeft = -scale.circle[i] * boxLeft + 'px';
      img.style.marginTop = -scale.circle[i] * boxTop + 'px';
    }
    for(let i = 0; i < square.length; i++) {
      let img = square[i].getElementsByTagName('img')[0];
      img.style.width = scale.square[i] * imageWidth + 'px';
      img.style.marginLeft = -scale.square[i] * boxLeft + 'px';
      img.style.marginTop = -scale.square[i] * boxTop + 'px';
    }

    self.scale = scale;
  }

  function mouseUpHandler() {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  }
};