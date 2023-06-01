import HuiDictionary from './index.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect } from '@storybook/jest'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/vue/writing-stories/introduction
const meta: Meta<typeof HuiDictionary> = {
  title: 'hui-ui/HuiDictionary',
  component: HuiDictionary,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  argTypes: {
    urlPrefix: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof HuiDictionary>
//👇 The ListTemplate construct will be spread to the existing stories.
export const desc: Story = {
  render: args => ({
    components: { HuiDictionary },
    setup() {
      return {
        args,
      }
    },
    template: `<HuiDictionary v-bind="args" />`,
  }),
  args: {
    urlPrefix: 'http://10.10.20.13:19101/base',
  },
  // play: async ({ canvasElement, args }) => {
  //   const descEl = await document.getElementsByClassName('long-text')[0]
  //   expect(descEl).toBeTruthy()
  // },
}
