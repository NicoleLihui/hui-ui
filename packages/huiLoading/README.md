# HuiLoading 组件

## 组件用途

> 加载数据时显示动效，这个动效是全局的。

## 组件使用

### 组件参数说明

| 参数名      | 类型    | 是否必须 | 说明                              | 默认值                |
| ----------- | ------- | -------- | --------------------------------- | --------------------- |
| show        | Boolean | Y        | 是否展示 Loading                  | false                 |
| loadingImg  | Boolean | N        | 是否展示 Loading 加载图标         | true                  |
| loadingText | String  | N        | 显示在加载图标下方的加载文案      | 正努力加载，请稍后... |
| effect      | String  | N        | 默认提供的主题，可选值 dark/light | light                 |

### 组件使用案例

```js
<HuiLoading :show="true" :loadingText="'正努力加载，你可以选择用这个时间冥想、摸鱼、网上冲浪...'" :effect="'dark'" />
```
