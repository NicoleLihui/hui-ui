import HuiApprovalForm from './index.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import * as templateData from './static/data.json'
import * as nodeList from './static/nodeList.json'
import { userEvent, within } from '@storybook/testing-library'
import { expect } from '@storybook/jest'
const meta: Meta<typeof HuiApprovalForm> = {
  title: 'hui-ui/HuiFlow/HuiApprovalForm',
  component: HuiApprovalForm,
  tags: ['autodocs'],
  argTypes: {
    approvalData: { control: 'object' },
    processId: { control: 'text' },
    onGetNodeList: { action: 'getNodeList' },
    onSubmit: { action: 'submit' },
  },
}
export default meta

type Story = StoryObj<typeof HuiApprovalForm>
export const primary: Story = {
  render: args => ({
    components: { HuiApprovalForm },
    setup() {
      return {
        args,
        onSubmit(submitData: any): void {
          console.log('提交表单事件', submitData)
        },
        onGetNodeList(callback: Function): void {
          const list = JSON.parse(JSON.stringify(nodeList))
          callback(list)
        },
      }
    },
    template: `<HuiApprovalForm @submit="onSubmit" @getNodeList="onGetNodeList" v-bind="args"></HuiApprovalForm>`,
  }),
  args: {
    approvalData: JSON.parse(JSON.stringify(templateData)),
    processId: 'test123456',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByPlaceholderText(/请输入备注/), '备注')
    await userEvent.click(canvas.getAllByText(/通过/)[0])
    const errorText = await (await canvas.findByText('请填写审批意见')).innerText
    await expect(errorText).toEqual('请填写审批意见')
    await userEvent.type(await canvas.findByPlaceholderText(/请输入审批意见/), '审批意见')
    await userEvent.click(canvasElement)
    await userEvent.click(await canvas.getByText(/驳回/))
  },
}
