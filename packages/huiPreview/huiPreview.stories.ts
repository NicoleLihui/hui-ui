import HuiPreview from './index.vue'
import { userEvent, within, fireEvent, waitFor } from '@storybook/testing-library'
import { Meta, StoryFn } from '@storybook/vue3'

export default {
  title: 'hui-ui/HuiPreview',
  component: HuiPreview,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'boolean' },
    onClosed: { action: 'closed' },
  },
} as Meta<typeof HuiPreview>

export const Perview: StoryFn<typeof HuiPreview> = args => ({
  components: { HuiPreview },
  setup() {
    const show = ref<boolean>(true)
    return {
      args,
      show,
    }
  },
  template: `
    <HuiPreview
      v-bind="args"
    />`,
})
Perview.args = {
  modelValue: true,
  // showDownload: true,
  initialIndex: 0,
  previewList: [
    {
      fileName: '文件1.jpg',
      id: 3260,
      previewUrl: 'http://img95.699pic.com/photo/50038/1181.jpg_wh300.jpg',
    },
    {
      fileName: '图片2.jpg',
      id: 3261,
      previewUrl: 'http://img3.redocn.com/tupian/20160118/qingshanlvshuidexianjingsheyingbeijingtu_5774069.jpg',
    },
    {
      fileName: '3333333333333333.pdf',
      id: 3261,
      previewUrl: 'http://img3.redocn.com/tupian/20160118/qingshanlvshuidexianjingsheyingbeijingtu_5774069.jpg',
    },
  ],
}

Perview.play = async () => {
  const left = document.querySelector('.hui-preview-arrow__prev')
  const right = document.querySelector('.hui-preview-arrow__next')
  await sleep(500)
  userEvent.click(left!)
  await sleep(1500)
  userEvent.click(right!)
  await sleep(1500)
  userEvent.click(right!)
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
