import HuiProTable from './index.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { Request } from '@packages/huiRequest/index'
import { userEvent, within } from '@storybook/testing-library'
import { expect } from '@storybook/jest'
// More on how to set up stories at: https://storybook.js.org/docs/7.0/vue/writing-stories/introduction
const meta: Meta<typeof HuiProTable> = {
  title: 'hui-ui/HuiProTable',
  component: HuiProTable,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  argTypes: {},
}

export default meta

type Story = StoryObj<typeof HuiProTable>
//👇 The ListTemplate construct will be spread to the existing stories.
export const desc: Story = {
  render: args => ({
    components: { HuiProTable },
    setup() {
      function onMultiCommand(command, rows) {
        console.log('根据按钮的command来批量操作选中的行数据', command, rows)
      }
      function onsSearchFormReset() {
        console.log('需要在这里reset插槽中的表单')
      }
      return {
        args,
        onMultiCommand,
        onsSearchFormReset,
      }
    },
    template: `<HuiProTable v-bind="args" @multiCommand="onMultiCommand" @searchFormReset="onsSearchFormReset" />`,
  }),
  args: {
    request: requestTableData,
    paramsData: [
      {
        type: 'selection',
        prop: 'selection',
        label: '多选',
        width: '50',
        align: 'center',
      },
      {
        prop: 'name',
        label: '项目名称',
        minWidth: 200,
        format: function (row) {
          return `<span style="cursor: pointer; color: #5270E7;">${row.name ? row.name : ''}</span>`
        },
        sortable: true,
        searchType: 'input',
        searchable: true, // 是否作为查询项
        searchValue: '111', // 默认展示的数据
      },
      {
        prop: 'projCode',
        label: '项目编号',
        minWidth: 150,
        sortable: true,
        searchType: 'input',
        searchable: true, // 是否作为查询项
        searchValue: '111121', // 默认展示的数据
      },
      {
        prop: 'ranking',
        label: '项目级别',
        minWidth: 150,
        sortable: true,
        searchType: 'select',
        searchable: true, // 是否作为查询项
        searchValue: '1', // 默认展示的数据
        valueOptions: [
          { label: 'A', value: '1' },
          { label: 'B', value: '2' },
        ],
      },
      {
        prop: 'state',
        label: '项目状态',
        minWidth: 140,
        sortable: true,
      },
      {
        prop: 'types',
        label: '项目类别',
        minWidth: 140,
        sortable: true,
      },
      {
        prop: 'projPhase',
        label: '项目介入阶段',
        minWidth: 170,
        sortable: true,
      },
      {
        prop: 'progress',
        label: '项目阶段',
        minWidth: 150,
        sortable: true,
      },
      {
        prop: 'duration',
        label: '历时',
        minWidth: 150,
        sortable: true,
      },
      {
        prop: 'investManager',
        label: '项目经理',
        minWidth: 140,
        sortable: true,
        searchType: 'person',
        searchable: true, // 是否作为查询项
      },
      {
        prop: 'chargingBody',
        label: '政府主管部门',
        minWidth: 170,
        sortable: true,
        searchType: 'organize',
        searchable: true,
      },
      {
        prop: 'governmentProcurementMode',
        label: '政府采购方式',
        minWidth: 160,
        sortable: true,
      },
      {
        prop: 'investModel',
        label: '投资模式',
        minWidth: 150,
        sortable: true,
      },
      {
        prop: 'estimatedWholeScale',
        label: '项目总规模（万吨/日）',
        minWidth: 220,
        sortable: true,
      },
      {
        prop: 'shortTermWholeScale',
        label: '近期总规模（万吨/日）',
        minWidth: 220,
        sortable: true,
      },
      {
        prop: 'projInvestSum',
        label: '项目总投资(万元)',
        minWidth: 180,
        sortable: true,
      },
      {
        prop: 'gmtCreateTime',
        label: '创建时间',
        minWidth: 180,
        sortable: true,
        searchType: 'date',
        searchable: true, // 是否作为查询项
        searchOptions: {
          format: 'YYYY/MM/DD',
          type: 'daterange',
        },
      },
      {
        prop: 'comprehensiveInvestSum',
        label: '综合类投资额(万元)',
        minWidth: 200,
        sortable: true,
      },
      {
        prop: 'comprehensiveRevenue',
        label: '综合类年营收(万元)',
        minWidth: 200,
        sortable: true,
      },
      {
        prop: 'attributionUnit',
        label: '归属单位',
        minWidth: 150,
        sortable: true,
      },
      {
        prop: 'gmtUpdateTime',
        label: '进展情况更新',
        minWidth: 170,
        sortable: true,
      },
      {
        prop: 'estimatedSignTime',
        label: '预计签约时间',
        minWidth: 170,
        sortable: true,
      },
      {
        prop: 'overdue',
        label: '项目逾期',
        minWidth: 140,
        sortable: true,
      },
      {
        prop: 'signTime',
        label: '签约日期',
        minWidth: 140,
        sortable: true,
      },
    ],
    multiOptions: [
      {
        name: '编辑项目',
        command: 'edit',
        type: 'info',
        disabled: false,
      },
      {
        name: '删除项目',
        command: 'delete',
        type: 'danger',
        disabled: false,
      },
      {
        name: '新增项目',
        command: 'add',
        type: 'primary',
        disabled: false,
        children: [
          {
            name: '新增国际项目',
            command: 'addGlobal',
            type: 'primary',
          },
          {
            name: '新增农村项目',
            command: 'addcoutry',
            type: 'primary',
          },
        ],
      },
    ],
    proTableId: 'testTable68',
    title: '高级列表',
  },
  play: async ({ canvasElement }) => {
    function sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    const canvas = within(canvasElement)
    // 先清空其他查询项
    const allSearchInputs = await canvas.findAllByPlaceholderText(/请输入/)
    const allSearchSelects = await canvas.findAllByPlaceholderText(/请选择/)
    function clearValue(arr: HTMLElement[]) {
      arr.forEach(async input => {
        await userEvent.hover(input)
        sleep(10)
        const parentNode = input.parentNode
        if (parentNode) {
          const clearBtn = await parentNode.querySelector('.el-icon')
          if (clearBtn) await userEvent.click(clearBtn)
        }
      })
    }
    await clearValue(allSearchInputs)
    await clearValue(allSearchSelects)
    sleep(10)
    // 先清除弹窗
    const dialogShow = await document.querySelector('.el-dialog__headerbtn')
    if (dialogShow) await userEvent.click(dialogShow)
    sleep(10)
    // 用户在项目名称查询项中输入"河北"
    const inputSearch = await canvas.findByPlaceholderText(/请输入项目名称/)
    await userEvent.type(inputSearch, '河北')
    await userEvent.click(await canvas.findByText(/查询/))
    const trs = document.querySelectorAll('.el-table tbody>tr')
    expect(Array.from(trs).every(i => i.innerHTML.includes('河北'))).toBeTruthy()
    const clearBtnInput = await inputSearch.parentNode?.querySelector('.el-icon')
    sleep(10)
    const dialogShow2 = await document.querySelector('.el-dialog__headerbtn')
    if (dialogShow2) await userEvent.click(dialogShow2)
    if (clearBtnInput) userEvent.click(clearBtnInput)
    sleep(10)
    await userEvent.click(await canvas.findByText(/查询/))
  },
}

async function getTableData(params) {
  const request = new Request({
    baseURL: 'http://investment-gateway-test.HUI.net.cn',
    withCredentials: true,
    headers: {
      Authorization:
        'Bearer ' +
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsib2F1dGgyLXJlc291cmNlIl0sInVzZXJfbmFtZSI6IndhbmdmZWkwMTIiLCJzY29wZSI6WyJhbGwiXSwicm9sZXMiOltdLCJleHAiOjE2ODUwMDg0ODgsInJlc291cmNlX2lkcyI6WyJvYXV0aDItcmVzb3VyY2UiXSwidXNlcklkIjoid2FuZ2ZlaTAxMiIsImp0aSI6ImIxODIxNTcwLTk3NmEtNGE5OS05MmUyLTcxZTVhMjQwNTE3NiIsImNsaWVudF9pZCI6ImJld2dfaW52ZXN0bWVudF9hcHBsaWNhdGlvbiIsInVzZXJuYW1lIjoid2FuZ2ZlaTAxMiJ9.JraCs96hLa1fYGpUyi8PyuvrndeYvjyw05baNshRNaDcCzN7VKj0L5866ylatDsRDMpZVakPAKoHFiqV3og3WPUoVXE2mOnmKVtQWpwngykUHvcKXc30IMihYEfAZLBT5NSEu8egPlid7nPD0M93e7zIQnlN3t98gnynyzroKjMVZDvLI1wQvwdheC8Gt9IFp0W6bjB2Ej-lW7cvpGZh8hVzLX8d1He-l8VKHzGifhkl_i-HfEDh32MoleT48TllBP2XRrI0R8Zwoos48PP8yWtCDQHLAR19uKvrCJ80AHp0yzBj_DH1gSZjcjz-k_yo3dX83UwD0RLuH30yYPQKXg',
    },
    requestOptions: { repeatRequestCancel: true, loading: true }, // 初始化时给一个初始值, 可以在任意的实例中再修改这个配置
    tokenKey: 'HUI_investment',
  })
  params.pageNum = params.currentPage
  const response = await request.get('/core/projectBaseInfo/manager/projects', { params: params })
  if (response.success) {
    const { data } = response
    const result = {
      current: data.current,
      total: data.total,
      records: data.records,
    }
    Promise.resolve(result)
  } else {
    Promise.resolve(false)
  }
}
async function requestTableData(params) {
  return await getTableData(params)
}
