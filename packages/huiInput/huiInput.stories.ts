import HuiInput from './index.vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import { expect } from '@storybook/jest'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/vue/writing-stories/introduction
const meta: Meta<typeof HuiInput> = {
  title: 'hui-ui/HuiInput',
  component: HuiInput,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  argTypes: {
    onValueClear: { action: 'valueClear' },
    onFocusInput: { action: 'focusInput' },
    effect: { control: 'select', options: ['dark', 'light'] },
  },
}

export default meta
const template: StoryFn<typeof HuiInput> = (args, { updateArgs }) => ({
  components: { HuiInput },
  setup() {
    return {
      args,
      onValueClear: () => {
        console.log('clear')
      },
      onFocusInput: () => {
        console.log('Inputing begin!')
      },
      handleVModelUpdate(modelValue: string) {
        updateArgs({ ...args, modelValue })
      },
    }
  },
  template:
    '<div style="width: 300px"><HuiInput @valueClear="onValueClear" @focusInput="onFocusInput" @update:modelValue="handleVModelUpdate" v-bind="args" /></div>',
})

export const Default = template.bind({})

Default.args = {
  ...Default.args,
  placeholder: '这里是占位内容',
  disabledInput: false,
}
Default.play = async () => {
  const inputEl = await document.getElementsByClassName('el-input__inner')[0]
  expect(inputEl).toBeTruthy()
}
