import HuiUpload from './index.vue'
import { userEvent } from '@storybook/testing-library'
import { Meta, StoryFn } from '@storybook/vue3'

export default {
  title: 'hui-ui/HuiUpload',
  component: HuiUpload,
  tags: ['autodocs'],
  argTypes: {
    'onOn-success': { action: 'on-success' },
    'onOn-error': { action: 'on-error' },
  },
} as Meta<typeof HuiUpload>

export const Upload: StoryFn<typeof HuiUpload> = args => ({
  components: { HuiUpload },
  setup() {
    const uploadRef = ref()
    function handleSuccess(file: any): void {
      console.log('file', file)
    }
    function handleError() {
      console.log('error')
    }
    function handleRemove(file: any) {
      uploadRef.value.handleRemoveFile(file)
    }
    return {
      args,
      uploadRef,
      handleSuccess,
      handleError,
      handleRemove,
    }
  },
  template: `
    <HuiUpload
      ref="uploadRef"
      v-bind="args"
      @on-success="handleSuccess"
      @on-error="handleError"
      @on-remove="handleRemove"
    />`,
})
Upload.args = {
  showTips: true,
  drag: false,
  action: 'http://10.10.41.3:8090/v1/baseinfo/attachedFile/upload',
  headers: {
    Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsib2F1dGgyLXJlc291cmNlIl0sInVzZXJfbmFtZSI6ImNhb2NoYW5nemhlbmciLCJzY29wZSI6WyJhbGwiXSwicm9sZXMiOltdLCJleHAiOjE2Nzg5ODU3MTAsInJlc291cmNlX2lkcyI6WyJvYXV0aDItcmVzb3VyY2UiXSwidXNlcklkIjoiY2FvY2hhbmd6aGVuZyIsImp0aSI6IjdiMWM2YThjLThhMGQtNGZhZi1iMDYyLWI3NDA2MTE4N2Q5MCIsImNsaWVudF9pZCI6InByb2R1Y3REZXNpZ24iLCJ1c2VybmFtZSI6ImNhb2NoYW5nemhlbmcifQ.bKAfhJ8myh6x0UjwpmcfoGCGnZoYWc2tqqc-GASZtHVZ0v_V2mjxJF-t-S6dcEwSJv6qZVahcYfAK4Ac04MgOh9OvFYg-gZ_g8M7M07aXppQUSaknB3PCKfPTYgSSrogATT_cu9LvCxTBxSgC0fWWmFYelyBHGSyK4kO5rbbCwX0XkkuZcYs7TbOCDXKf-73sLCjL-ZankhmAI4IG1TTqkkHn9eaFH7YBTJQlsd3SSF608Po9IxeWN9LpeZAjpnCWVUS3-OMQolY89fwY9zvvA5pSvyMIuAijgANtmdnl_K54fKwu25OvgqDzSWPXKNPM7hVFVeb_ZIfV2BrqN0NOQ`,
  },
  data: {
    // createBy: '1391313700000002304',
    // productMemberId: '1473886507654123522',
    // releaseStatus: '',
    // type: 'IMAGE',
    // templateWorkbookId: '1481151565908021250',
  },
  label: '上传附件',
  limit: 3,
  fileList: [
    {
      name: '文件名1',
      uid: 123,
      status: 'success',
    },
    {
      name: '文件名2',
      uid: 234,
      status: 'success',
    },
  ],
}
Upload.play = async () => {
  await sleep(500)
  const file = new File(['问号'], 'TempFiles/问号.png', { type: 'image/png' })
  const input: HTMLInputElement | null = document.querySelector('input')
  await userEvent.upload(input!, file)
}
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
