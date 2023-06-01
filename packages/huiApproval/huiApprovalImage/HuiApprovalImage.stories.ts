import HuiApprovalImage from './index.vue'
import { modelJson, historyData, nodeInfo } from './static/data.js'
import type { Meta, StoryObj } from '@storybook/vue3'
import { userEvent, within, queryHelpers } from '@storybook/testing-library'
import { expect } from '@storybook/jest'

const meta: Meta<typeof HuiApprovalImage> = {
  title: 'hui-ui/HuiFlow/HuiApprovalImage',
  component: HuiApprovalImage,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  argTypes: {
    approvalHistoryArray: { control: 'array' },
    modelJsonData: { control: 'object' },
    nodeInfo: { control: 'object' },
  },
}
export default meta

type Story = StoryObj<typeof HuiApprovalImage>
export const primary: Story = {
  render: args => ({
    components: { HuiApprovalImage },
    setup() {
      return {
        args,
      }
    },
    template: `
    <HuiApprovalImage v-bind="args">
    </HuiApprovalImage>
    `,
  }),
  args: {
    approvalHistoryArray: historyData,
    modelJsonData: modelJson,
    nodeInfo: nodeInfo,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tableInexistence = canvas.queryByDisplayValue('当前任务耗时')
    expect(tableInexistence).toBeNull()
    const node = await canvas.queryByText(/申请/i)
    if (node) userEvent.click(node)
    await sleep(1000)
    const tableExistence = canvas.queryAllByRole('table')
    console.log(tableExistence[0])
    expect(tableExistence[0]).toBeDefined()
    await sleep(1000)
    const svgTag = queryHelpers.queryAllByAttribute.bind(null, 'name')
    const tag = svgTag(document.body, 'canvas-overlay')
    if (tag) userEvent.click(tag[0])
    await sleep(1000)
    const tableInexistencenow = canvas.queryByDisplayValue('当前任务耗时')
    expect(tableInexistencenow).toBeNull()
  },
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
