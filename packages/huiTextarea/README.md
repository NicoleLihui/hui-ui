# HuiTextarea 组件

## 组件用途

> 通过鼠标或键盘输入字符，输入框为多行文本输入框，内容超出输入框可视区域，鼠标 hover 时展示提示框，提示框为输入框全部内容。

## 组件使用

### 组件参数说明

| 参数名        | 类型             | 是否必须 | 说明                                                                                  |
| ------------- | ---------------- | -------- | ------------------------------------------------------------------------------------- |
| v-model       | String / Number  | Y        | 绑定的输入框输入内容                                                                  |
| placeholder   | String           | N        | 输入框占位文本，默认为“请输入”                                                        |
| prefixIcon    | String           | N        | 输入框头部图标                                                                        |
| suffixIcon    | String           | N        | 输入框尾部图标                                                                        |
| disabledInput | Boolean          | N        | 禁用                                                                                  |
| maxLength     | Number           | N        | 最大输入长度，默认 1000 字符                                                          |
| showWordLimit | Boolean          | N        | 是否显示输入个数限制, 默认为 true                                                     |
| autoSize      | Boolean / Object | N        | 自适应内容高度，默认{ minRows: 2, maxRows: 5 }（默认为展示 2-5 行，超出部分滚动处理） |
| effect        | String           | N        | 提示框默认提供的主题，可选 dark/light                                                 |

### 组件方法

| 方法名     | 说明                    | 参数                   |
| ---------- | ----------------------- | ---------------------- |
| focusInput | 在 Input 获得焦点时触发 | event: Event           |
| input      | 在 Input 值改变时触发   | value: string / number |

### 组件使用案例

```js
<HuiTextarea v-model="formValue" @focusInput="focusAction" />
```
