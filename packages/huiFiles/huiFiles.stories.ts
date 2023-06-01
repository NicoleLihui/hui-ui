import HuiFiles from './index.vue'
import { Meta, StoryFn } from '@storybook/vue3'
import { userEvent } from '@storybook/testing-library'

export default {
  title: 'hui-ui/HuiFiles',
  component: HuiFiles,
  tags: ['autodocs'],
  argTypes: {
    'onOn-remove': { action: 'remove' },
    'onOn-download': { action: 'download' },
    'onOn-preview': { action: 'preivew' },
  },
} as Meta<typeof HuiFiles>

export const Files: StoryFn<typeof HuiFiles> = args => ({
  components: { HuiFiles },
  setup() {
    const handleFileDel = (file: any): void => {
      ElMessage.warning('触发文件删除')
    }
    return {
      args,
      handleFileDel,
    }
  },
  template: `<HuiFiles v-bind="args" @on-remove="handleFileDel" />`,
})
Files.args = {
  downloadUrl: 'http://10.10.41.3:8090/v1/baseinfo/support/datasheet',
  headers: {
    Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsib2F1dGgyLXJlc291cmNlIl0sInVzZXJfbmFtZSI6ImNhb2NoYW5nemhlbmciLCJzY29wZSI6WyJhbGwiXSwicm9sZXMiOltdLCJleHAiOjE2Nzc3NDc1NDUsInJlc291cmNlX2lkcyI6WyJvYXV0aDItcmVzb3VyY2UiXSwidXNlcklkIjoiY2FvY2hhbmd6aGVuZyIsImp0aSI6IjFlNTI3ODQyLTRlZWUtNDQ0ZC1hY2Q5LTJkZDUyMGE5ZTFjNSIsImNsaWVudF9pZCI6InByb2R1Y3REZXNpZ24iLCJ1c2VybmFtZSI6ImNhb2NoYW5nemhlbmcifQ.Aix-guzmTVasTQtFu2PZYLcPAM69sDt2z_ZneeLFiplTAQohCnjaAnvsj9IF7uoem0bSN-Ij0WjsATWR04hVGN3jwsFaLKZTvalc4l5fp-H5kpF7xm8l9p0WD1N9SKiPCnYJRfxl2BvKlfcoOf0PP98BAljVgWtEA7VYZ8WwybvpCSgPC-WYBCR5IP1-8X8Ladkz0NFDUy2WGLmkHvlnpJokebFrBy-mzMFZGC-kihzygK2JMaOJSLILY1elLD3ojaOhoecZ9Ii6s9YTSymqMTqkAM9Oo5N37rM-hlYV5ecGATMw6r0bpHZTRCXFIQRog_U6BPg_JPAf5CPC2Y-ZZw`,
  },
  readOnly: false,
  fileList: [
    { id: '1481151486157524994', name: '参数表.xlsx' },
    {
      name: '可预览图片文件.jpg',
      id: 3260,
    },
    { id: 'b1dcc843-9054-4a7f-b8ed-29bcd6f177c7', name: '第1次快反(8).pdf' },
  ],
  spliceParam: true,
  defaultProps: {
    fileId: 'id',
    fileName: 'name',
  },
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const NoUrlFiles: StoryFn<typeof HuiFiles> = args => ({
  components: { HuiFiles },
  setup() {
    const handleFileDel = (file: any): void => {
      ElMessage.warning('触发文件删除')
    }
    const handleFileDownload = (file: any): void => {
      ElMessage.warning('无url，触发回调下载')
    }
    return {
      args,
      handleFileDel,
      handleFileDownload,
    }
  },
  template: `<HuiFiles v-bind="args" @on-remove="handleFileDel" @on-download="handleFileDownload" />`,
})

NoUrlFiles.args = {
  downloadUrl: '',
  readOnly: false,
  fileList: [
    { id: '1481151486157524994', name: '参数表.xlsx' },
    { id: 'b1dcc843-9054-4a7f-b8ed-29bcd6f177c7', name: '第1次快反(8).pdf' },
  ],
  spliceParam: false,
  defaultProps: {
    fileId: 'id',
    fileName: 'name',
  },
}

Files.play = async () => {
  const deleteDom = document.querySelectorAll('.file-operate .is-delete')[0]
  await sleep(1000)
  userEvent.click(deleteDom)
}

NoUrlFiles.play = async () => {
  const downloadDom = document.querySelectorAll('.file-operate .blue')[0]
  const deleteDom = document.querySelectorAll('.file-operate .is-delete')[0]
  await sleep(1000)
  userEvent.click(downloadDom)
  await sleep(1500)
  userEvent.click(deleteDom)
}
