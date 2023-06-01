import HuiTable from './index.vue'
import { tableData, tableColumns, tableConfig } from './static/data'
import { userEvent, within } from '@storybook/testing-library'
import { Meta, StoryObj } from '@storybook/vue3'

export default {
  title: 'hui-ui/HuiTable',
  component: HuiTable,
  tags: ['autodocs'],
  argTypes: {
    isLock: { control: 'boolean' },
    onSelectionChange: { action: 'selection-change' },
    onCurrentChange: { action: 'current-change' },
    onSelectRows: { action: 'select-rows' },
    onSelectAll: { action: 'select-all' },
    onRowClick: { action: 'row-click' },
    onCellClick: { action: 'cell-click' },
    onRowDbClick: { action: 'row-db-click' },
    onCommand: { action: 'command' },
  },
} as Meta<typeof HuiTable>

export const table: StoryObj<typeof HuiTable> = {
  render: args => ({
    components: { HuiTable },
    setup() {
      args
      function onSelectionChange(rows: any): void {
        console.log('选项发生变化', rows)
      }
      function onCurrentChange(row: any): void {
        console.log('单选选项发生变化', row)
      }
      function onSelectRows(selection: any, row: any): void {
        console.log('多选选项发生变化', selection, row)
      }
      function onSelectAll(selection: any): void {
        console.log('全选时', selection)
      }
      function onRowClick(row: any): void {
        console.log('点击行', row)
      }
      function onCellClick(row: any): void {
        console.log('点击单元格', row)
      }
      function onRowDbClick(row: any): void {
        console.log('双击某行', row)
      }
      function onCommand(command: string, row: any): void {
        console.log('操作按钮', command, row)
      }
      return {
        args,
        onSelectionChange,
        onCurrentChange,
        onSelectRows,
        onSelectAll,
        onRowClick,
        onCellClick,
        onRowDbClick,
        onCommand,
      }
    },
    template: `
      <HuiTable
        v-bind="args"
        @selection-change="onSelectionChange"
        @current-change="onCurrentChange"
        @select-rows="onSelectRows"
        @select-all="onSelectAll"
        @row-click="onRowClick"
        @cell-click="onCellClick"
        @row-db-click="onRowDbClick"
        @command="onCommand"
      ></HuiTable>`,
  }),
  args: {
    tableData: tableData,
    columns: tableColumns,
    options: tableConfig,
    isLock: true,
  },
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

table.play = async ({ canvasElement, argTypes, args }) => {
  const canvas = within(canvasElement)
  await userEvent.click(canvas.getAllByText(/删除/)[0])
  // 测试弹窗
  const btnArr = canvas.queryAllByRole('button')
  const showDialogBtn = btnArr.find(itemBtn => {
    return itemBtn.className.indexOf('table-dialog-btn') >= 0
  })
  await userEvent.click(showDialogBtn as HTMLElement)
  await sleep(400)
  const cancelBtn = canvas.queryAllByText('取 消')
  if (cancelBtn[0]) await userEvent.click(cancelBtn[0])
  // 测试锁定列
  const firstLineArr = canvas.queryAllByText(/姓名/)
  const lock = firstLineArr[0]
  if (lock) {
    await userEvent.click(lock) // 锁定
    await userEvent.click(lock) // 解锁
  }
}
