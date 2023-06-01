import { within, userEvent } from '@storybook/testing-library'
import HuiUserManagement from './index.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect } from '@storybook/jest'
import OrgData from '@packages/huiOrganize/data.json'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/vue/writing-stories/introduction
const meta: Meta<typeof HuiUserManagement> = {
  title: 'hui-ui/HuiUser/HuiUserManagement',
  component: HuiUserManagement,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  argTypes: {
    urlPrefix: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof HuiUserManagement>
//👇 The ListTemplate construct will be spread to the existing stories.
export const desc: Story = {
  render: args => ({
    components: { HuiUserManagement },
    setup() {
      const orgDeptTreeApi = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(OrgData)
          }, 500)
        })
      }

      const huiOrganizeProps = {
        orgDeptTreeApi,
      }
      const detailMethod = (row: any) => {
        console.log('跳转到详情页', row)
      }
      return {
        args,
        huiOrganizeProps,
        detailMethod,
      }
    },
    template: `
      <div style="height: 600px; background: #eee">
        <HuiUserManagement
          v-bind="args"
          :organize-props="huiOrganizeProps"
          :detail-method="detailMethod"
        />
      </div>
    `,
  }),
  args: {
    urlPrefix: 'http://10.10.20.13:19101/base',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await sleep(2000)

    const userInput = await canvas.getByLabelText(/用户/)
    await userEvent.type(userInput, '安')

    const roleSelect = await document.querySelector('.search-form .el-select')!
    await userEvent.click(roleSelect)
    const options = document.querySelectorAll('.el-select-dropdown__list .el-select-dropdown__item')
    await userEvent.click(options[0])
    await userEvent.click(options[1])
    await sleep(500)
    await userEvent.click(canvas.getAllByText(/查询/)[0])

    await sleep(1000)

    const trs = document.querySelectorAll('.el-table tbody>tr')
    expect(Array.from(trs).every(i => i.innerHTML.includes('安'))).toBeTruthy()

    await sleep(2000)
    await userEvent.click(canvas.getAllByText(/重置/)[0])
  },
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
