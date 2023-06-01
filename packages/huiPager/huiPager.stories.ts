import HuiPager from './index.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { userEvent, within } from '@storybook/testing-library'
import { expect } from '@storybook/jest'
const meta: Meta<typeof HuiPager> = {
  title: 'hui-ui/HuiPager',
  component: HuiPager,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  argTypes: {
    total: { control: 'number' },
    currentPage: { control: 'number' },
    pageSize: { control: 'select', options: [10, 20, 50, 100, 500, 1000] },
    layout: { control: 'text' },
    pageSizes: { control: 'array' },
    list: { control: 'array' },
    onCallback: { action: 'callback' },
  },
}

export default meta

type Story = StoryObj<typeof HuiPager>
//👇 The ListTemplate construct will be spread to the existing stories.
export const pager: Story = {
  render: (args, { updateArgs }) => ({
    components: { HuiPager },
    setup() {
      let currentPage = ref(1)
      let pageSize = ref(20)
      let total = ref(100)
      function onCallback(value: number) {
        return new Promise(resolve => {
          console.log('请求列表', value, currentPage.value, pageSize.value)
          resolve('列表数据')
        })
      }
      function currentPageUpdate(currentPage: number) {
        updateArgs({ ...args, currentPage })
      }
      function pageSizeUpdate(pageSize: number) {
        updateArgs({ ...args, pageSize })
      }
      return {
        args,
        currentPage,
        pageSize,
        total,
        onCallback,
        currentPageUpdate,
        pageSizeUpdate,
      }
    },
    template: `<div>
      <HuiPager v-bind="args" @update:currentPage="currentPageUpdate" @update:pageSize="pageSizeUpdate" @callback="onCallback"></HuiPager>
    </div>`,
  }),
  args: {
    currentPage: 1,
    pageSize: 20,
    total: 100,
    list: [],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const selectBtn = await canvas.queryAllByPlaceholderText(/请选择/)
    if (selectBtn && selectBtn[0]) userEvent.click(selectBtn[0])
    sleep(100)
    const selectItem = await document.querySelectorAll('.el-select-dropdown__item')
    expect(selectItem).toBeDefined()
    if (selectItem && selectItem[0]) await userEvent.click(selectItem[0])
  },
}
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
