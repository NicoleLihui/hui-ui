import HuiPerson from './index.vue'
import { depart, organiz, slurUser, departByOrgId, mdmUserByDeptId } from './data'
import { ElButton } from 'element-plus'
import { userEvent, within } from '@storybook/testing-library'
import { Meta, StoryFn } from '@storybook/vue3'

export default {
  title: 'hui-ui/HuiPerson',
  component: HuiPerson,
  tags: ['autodocs'],
  argTypes: {
    onClosed: { action: 'closed' },
    onGetCheckedData: { action: 'getCheckedData' },
    onApiError: { action: 'apiError' },
  },
} as Meta<typeof HuiPerson>

export const person: StoryFn<typeof HuiPerson> = args => ({
  components: { HuiPerson, ElButton },
  setup() {
    const show = ref<boolean>(false)
    const departApi = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(depart)
          // reject({message: '加载失败'})
        }, 100)
      })
    }
    const organizApi = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(organiz)
          // reject({message: '加载失败'})
        }, 100)
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
        }, 100)
      })
    }
    const departByOrgIdApi = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(departByOrgId)
          // reject({message: '加载失败'})
        }, 100)
      })
    }
    const mdmUserByDeptIdApi = (params: any) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (params.deptId == '1001N6100000000M62UN') {
            resolve(mdmUserByDeptId)
          } else {
            resolve([])
          }
          // reject({message: '加载失败'})
        }, 100)
      })
    }
    const handleClose = () => {}
    return {
      args,
      show,
      departApi,
      organizApi,
      slurUserApi,
      departByOrgIdApi,
      mdmUserByDeptIdApi,
      handleClose,
    }
  },
  template: `<div>
    <ElButton type="primary" @click="show = true">选择人员</ElButton>
    <HuiPerson
      v-bind="args"
      v-model="show"
      userId="0001N610000000009054"
      :departApi="departApi"
      :organizApi="organizApi"
      :slurUserApi="slurUserApi"
      :departByOrgIdApi="departByOrgIdApi"
      :mdmUserByDeptIdApi="mdmUserByDeptIdApi"
      @closed="handleClose"
    />
  </div>`,
})

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

person.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await userEvent.click(canvas.getByText('选择人员'))
  await sleep(300)
  const dialog: HTMLElement | null = document.querySelector('.el-dialog')
  if (dialog) {
    const inDialog = within(dialog)
    await userEvent.click(inDialog.getByText('集团高管'))
    await sleep(200)
    const checkboxList: NodeListOf<HTMLElement> = document.querySelectorAll('.el-checkbox')
    await userEvent.click(checkboxList[2])
    await sleep(200)
    const seach: HTMLElement | null = inDialog.queryByPlaceholderText(/搜索/)
    seach && userEvent.type(seach, '王')
    await sleep(2000)
    const resultLit: NodeListOf<HTMLElement> = document.querySelectorAll('.popover-result-box li')
    await userEvent.click(resultLit[0])
    await sleep(500)
    await userEvent.click(inDialog.getByText('确定'))
  }
}
