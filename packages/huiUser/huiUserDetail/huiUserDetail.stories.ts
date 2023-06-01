import { within, userEvent } from '@storybook/testing-library'
import HuiUserDetail from './index.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect } from '@storybook/jest'
import OrgData from '@packages/huiOrganize/data.json'
import { depart, departByOrgId, mdmUserByDeptId, organiz, slurUser } from '@packages/huiPerson/data'
import { ElTabPane, ElButton } from 'element-plus'
// More on how to set up stories at: https://storybook.js.org/docs/7.0/vue/writing-stories/introduction
const meta: Meta<typeof HuiUserDetail> = {
  title: 'hui-ui/HuiUser/HuiUserDetail',
  component: HuiUserDetail,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  argTypes: {
    urlPrefix: { control: 'text' },
    userCode: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof HuiUserDetail>
//👇 The ListTemplate construct will be spread to the existing stories.
export const desc: Story = {
  render: args => ({
    components: { HuiUserDetail, ElTabPane, ElButton },
    setup() {
      const state = reactive({
        selectedRoles: [] as any[],
      })
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

      const departApi = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(depart)
            // reject({message: '加载失败'})
          }, 300)
        })
      }
      const organizApi = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(organiz)
            // reject({message: '加载失败'})
          }, 300)
        })
      }
      const slurUserApi = (params: any) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (params.lastPage === 3) {
              resolve([])
            } else {
              resolve(slurUser)
            }
            // reject({message: '加载失败'})
          }, 300)
        })
      }
      const departByOrgIdApi = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(departByOrgId)
            // reject({message: '加载失败'})
          }, 300)
        })
      }
      const mdmUserByDeptIdApi = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mdmUserByDeptId)
            // reject({message: '加载失败'})
          }, 300)
        })
      }
      const huiPersonProps = {
        departApi,
        organizApi,
        slurUserApi,
        departByOrgIdApi,
        mdmUserByDeptIdApi,
      }
      const onClick = (data: any) => {
        console.log(data)
      }

      const setRoles = (data: any[]) => {
        state.selectedRoles = data
      }
      return {
        ...toRefs(state),
        args,
        huiOrganizeProps,
        huiPersonProps,
        onClick,
        setRoles,
      }
    },
    template: `
      <div style="height: 600px; background: #eee; padding: 10px;">
        <HuiUserDetail
          v-bind="args"
          :organize-props="huiOrganizeProps"
          :person-props="huiPersonProps"
          @onRoleChecked="setRoles"
        >
          <template #default="data">
            <el-tab-pane label="项目" name="project">
              项目内容
              <el-button @click="onClick(data)">操作</el-button>
              <el-button type="primary" :disabled="selectedRoles.length !== 1">授权</el-button>
            </el-tab-pane>
          </template>
        </HuiUserDetail>
      </div>
    `,
  }),
  args: {
    urlPrefix: 'http://10.10.20.13:19101/base',
    userCode: 'anruizhi', // 状态：正常使用
    // userCode: 'dengtianjie' // 状态：停用
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await sleep(2000)

    // 添加角色
    const addBtn = canvas.getAllByText(/添加角色/)
    await userEvent.click(addBtn[0])

    sleep(500)
    const role = document.querySelector('.el-dialog .role-list .el-radio')!
    await userEvent.click(role)

    const confirmBtn = document.querySelector('[aria-label=授权角色] .el-dialog__footer .el-button--primary')!
    await sleep(300)
    await userEvent.unhover(role)
    await userEvent.click(confirmBtn)

    await sleep(500)
    const message = document.querySelector('.el-message--success .el-message__content')
    expect(message?.innerHTML === '绑定成功').toBeTruthy()

    const authBtn = document.querySelector('.auth-org .header-content .el-button--primary')
    expect(authBtn?.hasAttribute('disabled')).toBeTruthy()
    // 选中角色
    const roleText = document.querySelector('.role-list-content .role-list .role-info>span')?.innerHTML || ''

    const roleItem = canvas.getAllByText(roleText)
    await userEvent.click(roleItem[0])
    expect(authBtn?.getAttribute('disabled')).toBeFalsy()

    await sleep(500)
    const trs = document.querySelectorAll('.el-table tbody>tr')
    expect(Array.from(trs).every(i => i.innerHTML.includes(roleText))).toBeTruthy()

    const input = await canvas.findByPlaceholderText(/请输入组织名称/)
    await userEvent.type(input, 'XX公司')
    await userEvent.click(canvas.getAllByText(/查询/)[0])

    const trs1 = document.querySelectorAll('.el-table tbody>tr')
    expect(Array.from(trs1).every(i => i.innerHTML.includes('XX公司'))).toBeTruthy()
  },
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
