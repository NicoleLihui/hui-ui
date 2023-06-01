import { App } from 'vue'
import { isValidKey } from '@packages/utils/is'
import '../src/assets/font/iconfont.js' // 引入图标库
import * as components from './components'
export * from './components'

export default {
  install: (app: App) => {
    for (let comp in components) {
      if (isValidKey(comp, components)) {
        app.use(components[comp])
      }
    }
  },
}
