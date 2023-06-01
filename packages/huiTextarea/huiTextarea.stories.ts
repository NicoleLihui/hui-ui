import HuiTextarea from './index.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect } from '@storybook/jest'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/vue/writing-stories/introduction
const meta: Meta<typeof HuiTextarea> = {
  title: 'hui-ui/HuiTextarea',
  component: HuiTextarea,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  argTypes: {
    onFocusInput: { action: 'focusInput' },
    effect: { control: 'select', options: ['dark', 'light'] },
  },
}

export default meta

type Story = StoryObj<typeof HuiTextarea>
//👇 The ListTemplate construct will be spread to the existing stories.
export const textarea: Story = {
  render: (args, { updateArgs }) => ({
    components: { HuiTextarea },
    setup() {
      return {
        args,
        onFocusInput: () => {
          console.log('Inputing begin!')
        },
        handleVModelUpdate(modelValue: string) {
          updateArgs({ ...args, modelValue })
        },
      }
    },
    template: `<div style="width: 300px">
      <HuiTextarea @focusInput="onFocusInput" @update:modelValue="handleVModelUpdate" v-bind="args" />
    </div>`,
  }),
  args: {
    modelValue: '',
    placeholder: '这里是占位内容',
    disabledInput: false,
  },
  play: async () => {
    const inputEl = await document.getElementsByClassName('el-textarea__inner')[0]
    expect(inputEl).toBeTruthy()
  },
}
