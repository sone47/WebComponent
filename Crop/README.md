# Crop

## Usage

```javascript
new Crop({
  box: document.getElementById('crop-demo-box'),
  img: './avatar.jpg',
  boxSize: 500,
  showSize: {
    circle: [100],
    square: [100, 200]
  }
});
```

| 参数名      | 参数类型           | 参数意义                                 |
| -------- | -------------- | ------------------------------------ |
| **box**  | Element Object | 盛放所有内容的容器                            |
| **img**  | String         | 裁切图片路径                               |
| boxSize  | Number         | 盒子大小，不包含预览图部分                        |
| showSize | Object         | 其中有circle和square两个参数，均为数组，数组里是预览部分大小 |

粗体字表示必须的参数。