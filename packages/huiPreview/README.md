# HuiPreview 组件

## 组件用途

> 提供文件、图片的预览

## 组件使用

### 组件参数说明

| 参数名                | 类型    | 是否必须 | 说明                                         |
| --------------------- | ------- | -------- | -------------------------------------------- |
| model-value / v-model | Boolean | Y        | 是否展示预览                                 |
| previewList           | Array   | Y        | 预览数据集合，包含属性{fileName，previewUrl} |
| initialIndex          | Number  | N        | 预览元素初始化下标，默认 0                   |
| showClose             | Boolean | N        | 是否展示关闭（x）图标，默认 true             |
| showDownload          | Boolean | N        | 是否显示下载按钮，默认 true                  |
| infinite              | Boolean | N        | 是否无缝循环，默认 true                      |
| zIndex                | Number  | N        | 设置预览的 z-index，默认 100                 |
| closeOnPressEscape    | Boolean | N        | 是否通过键盘的 ESC 键关闭预览，默认 true     |

### 组件回调方法

| 方法名 | 参数 | 说明           |
| ------ | ---- | -------------- |
| closed | -    | 关闭预览后调用 |

### 组件暴露方法

| 方法名        | 说明         | 参数                            |
| ------------- | ------------ | ------------------------------- |
| setActiveItem | 手动切换图片 | 需要切换的图片的索引，从 0 开始 |

### 组件使用案例

```js
<HuiPreview v-model="show" :previewList="previewList" />
```
