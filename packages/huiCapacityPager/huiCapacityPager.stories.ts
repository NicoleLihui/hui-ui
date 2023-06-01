import HuiCapacityPager from './index.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { userEvent, within } from '@storybook/testing-library'
import { expect } from '@storybook/jest'
// More on how to set up stories at: https://storybook.js.org/docs/7.0/vue/writing-stories/introduction
const meta: Meta<typeof HuiCapacityPager> = {
  title: 'hui-ui/HuiCapacityPager',
  component: HuiCapacityPager,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['slide', 'scroll'] },
    'onPage-change': { action: 'page-change' },
  },
}

export default meta

type Story = StoryObj<typeof HuiCapacityPager>
//👇 The ListTemplate construct will be spread to the existing stories.
export const desc: Story = {
  render: args => ({
    components: { HuiCapacityPager },
    setup() {
      function onPageChange(current) {
        console.log('请求数据', current)
      }
      return {
        args,
        onPageChange,
      }
    },
    template: `<HuiCapacityPager v-bind="args" @page-change="onPageChange" />`,
  }),
  args: {
    total: 100,
    currentPage: 1,
    pageSize: 20,
    capacity: 100,
  },
  play: async () => {
    function sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    const activeNumber = await document.querySelector('.is-active')?.innerHTML
    const nextBtn = await document.querySelector('.next')
    if (nextBtn) await userEvent.click(nextBtn)
    sleep(100)
    const activeNumberNext = await document.querySelector('.is-active')?.innerHTML
    if (activeNumberNext) expect(Number(activeNumber)).toEqual(Number(activeNumberNext) - 1)
  },
}
