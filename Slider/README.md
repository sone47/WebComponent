# Slider

响应式滑动组件，其中必须添加两张以上的图。

## Usage

```javascript
var list = [{
  height: 241,
  width: 115,
  img: '1.png'
},{
  height: 287,
  width: 172,
  img: '2.png'
},{
  height: 296,
  width: 253,
  img: '3.png'
}];

new Slider({
  wrap: document.getElementById('canvas'),
  list: list,
  width: window.innerWidth,
  height: 200
});
```

| 参数名    | 参数类型           | 参数意义                                     |
| ------ | -------------- | ---------------------------------------- |
| wrap   | Element Object | 包裹组件中所有HTML元素的                           |
| list   | Array          | 图片数组，其中item为Object，包含图片路径img，图片宽度img，图片高度height |
| width  | Number         | 组件宽度                                     |
| height | Number         | 组件高度                                     |

以上所有参数都是必须的。