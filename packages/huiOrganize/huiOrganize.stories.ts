import HuiOrganize from './index.vue'
import dataJson from './data.json'
import { ElButton } from 'element-plus'
import { userEvent, within, waitFor } from '@storybook/testing-library'
import { Meta, StoryFn } from '@storybook/vue3'

const meta: Meta<typeof HuiOrganize> = {
  title: 'hui-ui/HuiOrganize',
  component: HuiOrganize,
  tags: ['autodocs'],
  argTypes: {
    onClosed: { action: 'clicked' },
    onGetCheckedData: { action: 'clicked' },
  },
} as Meta<typeof HuiOrganize>

export default meta

export const organize: StoryFn<typeof HuiOrganize> = args => ({
  components: { HuiOrganize, ElButton },
  setup() {
    const show = ref<boolean>(false)
    const multiple = ref<boolean>(false)
    const currentNodeKey = ref<string | any>('')
    const checkedKeysData = ref<any[]>([])

    const handleShow = (isMultiple: boolean = false) => {
      multiple.value = isMultiple
      show.value = true
    }

    const orgDeptTreeApi = (params: {}) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(dataJson)
          // reject({message: '加载失败'})
        }, 500)
      })
    }
    return {
      args,
      show,
      multiple,
      currentNodeKey,
      checkedKeysData,
      handleShow,
      orgDeptTreeApi,
    }
  },
  template: `<div>
    <ElButton type="primary" @click="handleShow(false)">组织单选</ElButton>
    <ElButton type="primary" @click="handleShow(true)">组织多选</ElButton>
    <HuiOrganize
      v-bind="args"
      v-model="show"
      :multiple="multiple"
      :currentNodeKey="currentNodeKey"
      :checkedKeysData="checkedKeysData"
      :orgDeptTreeApi="orgDeptTreeApi"
    />
  </div>`,
})
organize.args = {
  title: '项目归属',
  draggable: false,
  appendToBody: true,
  includeDept: false,
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

organize.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await userEvent.click(canvas.getByText('组织多选'))
  await sleep(800)
  await waitFor(async () => {
    const dialog: HTMLElement | null = document.querySelector('.el-dialog')
    if (dialog) {
      const inDialog = within(dialog)
      await userEvent.click(inDialog.getByText('数字化创新中心'))
      await sleep(100)
      await userEvent.click(inDialog.getAllByText('只选择自己')[0])
      // await userEvent.click(inDialog.getByText('运营管理中心'));
      await sleep(500)
      await userEvent.click(inDialog.getByText('确定'))
    }
  })
}
