// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import Layout from './layouts/Layout.vue'          // 自定义布局组件（覆盖默认布局）
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'
import mediumZoom from 'medium-zoom'               // 图片点击放大插件

import { setupFireworks } from './utils/fireworks' // 点击烟花特效
import './styles/index.css'                       // 全局样式入口（已拆分）

export default {
  // 继承默认主题，保留其所有功能
  extends: DefaultTheme,

  // 使用自定义布局替换默认布局（实现侧边栏切换、插槽注入等）
  Layout,

  // setup 函数会在主题组件加载时执行，用于初始化一些全局行为
  setup() {
    const router = useRouter()

    // 初始化图片缩放（仅作用于相册详情页内的 .image-grid 图片）
    const initZoom = () => {
      const images = document.querySelectorAll('.image-grid img')
      if (images.length) {
        mediumZoom(images, { background: 'var(--vp-c-bg)' })
      }
    }

    // 组件挂载后执行一次
    onMounted(initZoom)

    // 路由切换后重新执行（因为新页面的图片还未被缩放）
    router.onAfterRouteChange = initZoom
  },

  // 增强应用：注册全局组件、挂载全局副作用（如烟花）
  enhanceApp({ app }) {
    // 仅在浏览器环境中执行（避免 SSR 时报错）
    if (typeof window !== 'undefined') {
      setupFireworks()
    }
  }
}