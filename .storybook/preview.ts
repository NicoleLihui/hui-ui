import { useArgs } from '@storybook/client-api'
import '@styles/reset.scss' // 增加全局样式
import '@styles/index.scss' // 组件样式
import '@/assets/font/iconfont.js' // 引入图标库
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { setup } from '@storybook/vue3'
import FormMakingV3 from '../src/statics/formmaker/dist/form-making-v3.es.js'
import '../src/statics/formmaker/dist/index.css'
import $bus from '../packages/utils/bus'
setup(app => {
  app.use(FormMakingV3)
  app.config.globalProperties.$bus = $bus
})
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    expanded: true, // 展开所有参数信息
  },
}

// set decorators for all the stories for all components
export const decorators = [
  (story, context) => {
    // 处理v-model在controls不生效的问题
    const [_, updateArgs] = useArgs()
    return story({ ...context, updateArgs })
  },
  story => ({
    components: { story, ElConfigProvider },
    data() {
      return {
        zIndex: 3000,
        locale: zhCn,
      }
    },
    template: `<div style="margin: 0.5em;">
      <el-config-provider :z-index="zIndex" :locale="locale">
        <story/>
      </el-config-provider>
    </div>`,
  }),
]
