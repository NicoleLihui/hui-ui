import type { Meta, StoryObj } from '@storybook/vue3'
import HuiLoading from './index.vue'
import { expect } from '@storybook/jest'
import { userEvent, within } from '@storybook/testing-library'
import { ElButton } from 'element-plus'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/vue/writing-stories/introduction
const meta: Meta<typeof HuiLoading> = {
  title: 'hui-ui/HuiLoading',
  component: HuiLoading,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  argTypes: {
    show: { control: 'boolean' },
    loadingImg: { control: 'boolean' },
    loadingText: { control: 'text' },
    effect: { control: 'select', options: ['dark', 'light'] },
  },
}

export default meta

type Story = StoryObj<typeof HuiLoading>
//👇 The ListTemplate construct will be spread to the existing stories.
export const loading: Story = {
  render: (args, { updateArgs }) => ({
    components: { HuiLoading, ElButton },
    setup() {
      return {
        args,
        showLoading: () => {
          updateArgs({ ...args, show: true })
          setTimeout(() => {
            updateArgs({ ...args, show: false })
          }, 3000)
        },
      }
    },
    template: `
    <div>这是一段文字，位于遮罩层之下。<ElButton @click="showLoading">请求接口</ElButton><HuiLoading v-bind="args" /></div>
    `,
  }),
  args: {
    show: false,
    loadingText: '拼命加载中，请休息一下...',
    loadingImg: true,
    effect: 'dark',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const controlBtn = await canvas.queryByRole('button')
    if (controlBtn) userEvent.click(controlBtn)
    const img = await canvas.findByRole('img')
    await expect(img).toHaveProperty('src')
  },
}
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
