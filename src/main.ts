import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './polyfills'
import FormMakingV3 from './statics/formmaker/dist/form-making-v3.es.js'
import './statics/formmaker/dist/index.css'
import '@/assets/font/iconfont.js' // 引入图标库
createApp(App).use(FormMakingV3).mount('#app')
