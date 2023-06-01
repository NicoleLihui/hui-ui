import HuiApprovalHistory from './index.vue'
import { approvalHistoryData } from './static/templateData'
import type { Meta, StoryObj } from '@storybook/vue3'
import { userEvent, within } from '@storybook/testing-library'
import { expect } from '@storybook/jest'

const meta: Meta<typeof HuiApprovalHistory> = {
  title: 'hui-ui/HuiFlow/HuiApprovalHistory',
  component: HuiApprovalHistory,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  argTypes: {
    approvalHistoryData: { control: 'array' },
    processId: { control: 'text' },
    direction: { control: 'select', options: ['right', 'bottom'] },
    onRemoveTask: { action: 'removedTask' },
    onRemindHandler: { action: 'remindedHandler' },
  },
}
export default meta

type Story = StoryObj<typeof HuiApprovalHistory>
export const primary: Story = {
  render: args => ({
    components: { HuiApprovalHistory },
    setup() {
      return {
        args,
        onRemoveTask(data: any) {
          console.log('onRemoveTask', data)
        },
        onRemindHandler(data: any) {
          console.log('onRemindHandler', data)
        },
      }
    },
    template: `
    <HuiApprovalHistory @removeTask="onRemoveTask" @remindHandler="onRemindHandler" v-bind="args">
      <template #file="fileItem"><span>{{ fileItem.fileName }}</span></template>
    </HuiApprovalHistory>
    `,
  }),
  args: {
    approvalHistoryData: approvalHistoryData,
    processId: 'test9874566',
    direction: 'right',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByText(/自动执行/)
    await userEvent.hover(trigger)
    await userEvent.unhover(trigger)
    await userEvent.click(await canvas.findByRole('button'))
    const message = await document.getElementsByClassName('is-message-box')[0]
    await expect(message.childElementCount).toBeTruthy()
    const cancelBtn = await document.getElementsByClassName('el-message-box__headerbtn')[0]
    await userEvent.click(cancelBtn)
  },
}
