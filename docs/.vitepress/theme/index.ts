// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'          // 导入你的自定义布局
import { setupFireworks } from './fireworks'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,                                   // 使用自定义布局覆盖默认布局
  enhanceApp({ app }) {
    if (typeof window !== 'undefined') {
      setupFireworks()
    }
  }
}