import HuiUploadSlice from './index.vue'
import { Meta, StoryFn } from '@storybook/vue3'

export default {
  title: 'hui-ui/HuiUploadSlice',
  component: HuiUploadSlice,
  tags: ['autodocs'],
  argTypes: {},
} as Meta<typeof HuiUploadSlice>

export const Upload: StoryFn<typeof HuiUploadSlice> = args => ({
  components: { HuiUploadSlice },
  setup() {
    return {
      args,
    }
  },
  template: `
    <HuiUploadSlice
      v-bind="args"
    />`,
})
Upload.args = {
  showTips: true,
  drag: false,
  headers: {
    // Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsib2F1dGgyLXJlc291cmNlIl0sInVzZXJfbmFtZSI6ImNhb2NoYW5nemhlbmciLCJzY29wZSI6WyJhbGwiXSwicm9sZXMiOltdLCJleHAiOjE2Nzg5ODU3MTAsInJlc291cmNlX2lkcyI6WyJvYXV0aDItcmVzb3VyY2UiXSwidXNlcklkIjoiY2FvY2hhbmd6aGVuZyIsImp0aSI6IjdiMWM2YThjLThhMGQtNGZhZi1iMDYyLWI3NDA2MTE4N2Q5MCIsImNsaWVudF9pZCI6InByb2R1Y3REZXNpZ24iLCJ1c2VybmFtZSI6ImNhb2NoYW5nemhlbmcifQ.bKAfhJ8myh6x0UjwpmcfoGCGnZoYWc2tqqc-GASZtHVZ0v_V2mjxJF-t-S6dcEwSJv6qZVahcYfAK4Ac04MgOh9OvFYg-gZ_g8M7M07aXppQUSaknB3PCKfPTYgSSrogATT_cu9LvCxTBxSgC0fWWmFYelyBHGSyK4kO5rbbCwX0XkkuZcYs7TbOCDXKf-73sLCjL-ZankhmAI4IG1TTqkkHn9eaFH7YBTJQlsd3SSF608Po9IxeWN9LpeZAjpnCWVUS3-OMQolY89fwY9zvvA5pSvyMIuAijgANtmdnl_K54fKwu25OvgqDzSWPXKNPM7hVFVeb_ZIfV2BrqN0NOQ`,
  },
  label: '上传附件',
  fileListApi: 'http://10.10.171.90:19102/base/file/fileList',
  fileCheckApi: 'http://10.10.171.90:19102/base/file/existFileOrFragment',
  fileChunkApi: 'http://10.10.171.90:19102/base/file/uploadFragment',
  fileDeleteApi: 'http://10.10.171.90:19102/base/file/deleteFile',
  // fileDownloadApi: 'http://10.10.171.90:19102/base/file/fileDownload',
}
