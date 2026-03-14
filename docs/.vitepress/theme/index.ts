// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { setupFireworks } from './fireworks'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 这里可以注册全局组件（如果需要）
    // 但烟花功能只需要在客户端执行一次
    if (typeof window !== 'undefined') {
      setupFireworks(); // 直接调用初始化函数
    }
  }
}