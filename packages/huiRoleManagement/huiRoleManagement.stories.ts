import { within, userEvent } from '@storybook/testing-library'
import HuiRoleManagement from './index.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect } from '@storybook/jest'
import { depart, departByOrgId, mdmUserByDeptId, organiz, slurUser } from '@packages/huiPerson/data'
import OrgData from '@packages/huiOrganize/data.json'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/vue/writing-stories/introduction
const meta: Meta<typeof HuiRoleManagement> = {
  title: 'hui-ui/HuiRoleManagement',
  component: HuiRoleManagement,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  argTypes: {
    urlPrefix: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof HuiRoleManagement>
//👇 The ListTemplate construct will be spread to the existing stories.
export const desc: Story = {
  render: args => ({
    components: { HuiRoleManagement },
    setup() {
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
      const orgDeptTreeApi = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(OrgData)
          }, 500)
        })
      }
      const huiPersonProps = {
        departApi,
        organizApi,
        slurUserApi,
        departByOrgIdApi,
        mdmUserByDeptIdApi,
      }
      const huiOrganizeProps = {
        orgDeptTreeApi,
      }
      const roleUserActions = [
        {
          name: '项目',
          command: 'addProject',
          type: 'primary',
          method: (row: any) => {
            console.log('currRow', row)
          },
        },
      ]
      return {
        args,
        huiPersonProps,
        huiOrganizeProps,
        roleUserActions,
      }
    },
    template: `
      <div style="height: 700px; background: #eee; width: 100%; overflow: auto">
        <HuiRoleManagement
          v-bind="args"
          :person-props="huiPersonProps"
          :organize-props="huiOrganizeProps"
          :role-user-actions="roleUserActions"
        />
      </div>`,
  }),
  args: {
    urlPrefix: 'http://10.10.20.13:19101/base',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await sleep(1000)

    const searchInput = await canvas.findByPlaceholderText(/请输入角色名称/)
    await userEvent.type(searchInput, '管理员')
    await userEvent.click(canvas.getAllByText(/查询/)[0])

    await sleep(500)
    const listDom = document.querySelectorAll('.role-list>li')
    expect(Array.from(listDom).every(i => i.innerHTML.includes('管理员'))).toBe(true)

    await userEvent.hover(searchInput)
    const clearBtn = document.querySelector('.role-list-content .search-form .el-input__suffix-inner .el-icon')
    expect(clearBtn).toBeTruthy()
    if (clearBtn) {
      await userEvent.click(clearBtn!)
      await new Promise(res => {
        setTimeout(() => {
          const listDom = document.querySelectorAll('.role-list>li')
          expect(Array.from(listDom).some(i => !i.innerHTML.includes('管理员'))).toBe(true)
          res(true)
        }, 1000)
      })
    }

    await sleep(1000)
    // 选择角色
    const roleText = (document.querySelector('.role-list>li .el-checkbox__label') as any)?.innerText

    const listItemCheckbox = (await canvas.findAllByLabelText(roleText || '管理员'))[0].parentElement

    await userEvent.click(listItemCheckbox!)
    expect(canvas.getAllByText(/关联员工/)[0].innerHTML.includes(roleText)).toBeTruthy()

    expect(canvas.getAllByText(/关联员工/)[1].parentElement?.getAttribute('disabled')).toBeFalsy()

    await sleep(3000)
    const trs = document.querySelectorAll('.el-table tbody>tr')

    expect(Array.from(trs).every(i => i.innerHTML.includes(roleText))).toBeTruthy()

    // 批量删除
    const batchDelBtn = canvas.getAllByText(/批量删除/)[0].parentElement!
    expect(batchDelBtn?.getAttribute('disabled')).toBeFalsy()

    // 取消选中
    await userEvent.click(listItemCheckbox!)

    // 编辑角色
    const editBtn = document.querySelector('.role-list>li')?.childNodes[1]

    await userEvent.click(editBtn as Element)

    expect(document.querySelector('.hui-role-edit-dialog')).toBeTruthy()
    expect((canvas.getByLabelText('角色名称') as any).value === roleText).toBeTruthy()

    const confirmBtn = canvas.getAllByText(/确认/)[0]
    await userEvent.click(confirmBtn)

    await sleep(500)
    const message = document.querySelector('.el-message--success .el-message__content')
    expect(message?.innerHTML === '编辑成功').toBeTruthy()

    await sleep(3000)
    // 删除角色
    const delBtn = document.querySelector('.role-list>li')?.childNodes[2]

    await userEvent.click(delBtn as Element)

    const tipMessage = document.querySelector('.el-message-box')
    expect(tipMessage).toBeTruthy()

    const cancelBtn = document.querySelector('.el-message-box__btns .el-button')

    await userEvent.click(cancelBtn!)

    // 展开角色详情
    const detailBtn = document.querySelector('.role-list>li')?.childNodes[3]

    await userEvent.click(detailBtn as Element)
    await sleep(400)
    expect((detailBtn?.nextSibling as any).offsetHeight > 0).toBeTruthy()
    await sleep(200)
    await userEvent.click(detailBtn as Element)

    await sleep(500)
    await userEvent.type(canvas.getByLabelText('用户'), '王浩菲')
    await userEvent.click(document.querySelector('.role-user-list .search-form .el-button--primary')!)

    await sleep(1000)
    const trs1 = document.querySelectorAll('.el-table tbody>tr')
    expect(Array.from(trs1).every(i => i.innerHTML.includes('王浩菲'))).toBeTruthy()
  },
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
