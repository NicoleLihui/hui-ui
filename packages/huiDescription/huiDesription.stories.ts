import HuiDescription from './index.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect } from '@storybook/jest'
import defaultIcon from '@/assets/images/arrow.png'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/vue/writing-stories/introduction
const meta: Meta<typeof HuiDescription> = {
  title: 'hui-ui/HuiDescription',
  component: HuiDescription,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    line: { control: 'select', options: [1, 2, 3, 4, 5] },
    bg: { control: 'text' },
    label: { control: 'text' },
    icon: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof HuiDescription>
//👇 The ListTemplate construct will be spread to the existing stories.
export const desc: Story = {
  render: args => ({
    components: { HuiDescription },
    setup() {
      return {
        args,
      }
    },
    template: `<HuiDescription v-bind="args" />`,
  }),
  args: {
    line: 4,
    content: `在项目现场，杜浩听取关于水厂经营情况与党建工作的介绍，向一线人员详细了解生产设备运行现状与出水水质情况。
    最后，杜浩对昆明区域党建工作作出指导与要求。一是要坚持党建引领，进一步提高政治站位，项目班子要切实扛起基层党建与发展的重任，
    深入贯彻落实上级党委、纪委、集团经营班子各项任务要求的政治责任，紧紧围绕经营抓党建、抓好党建促经营的方针，确保上级党组织各项要求落实到位；
    二是要勇于担当，强化责任意识，发扬党组织战斗堡垒和党员先锋模范作用。单位领导干部要靠前协调指挥，压紧压实责任。同时，在确保做好疫情防控工作的前提下，
    有序推动生产经营工作，做到疫情防控和生产经营两不误；
    三是全面做好安全生产工作。要加大对员工的安全教育力度，提高全员安全意识，加强安全隐患风险点位排查，充分运用信息化手段，做好各项安全措施，提升监督质效；`,
    label: 'icon',
    icon: `url(${defaultIcon})`,
  },
  play: async ({ canvasElement, args }) => {
    const descEl = await document.getElementsByClassName('long-text')[0]
    expect(descEl).toBeTruthy()
  },
}
