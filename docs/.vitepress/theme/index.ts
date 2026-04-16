// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'
import mediumZoom from 'medium-zoom'
import GalleryList from './components/GalleryList.vue'
import { setupFireworks } from './fireworks'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  setup() {
    const router = useRouter()
    const initZoom = () => {
      // 只对详情页内的图片网格启用缩放，避免影响相册封面
      const images = document.querySelectorAll('.image-grid img')
      if (images.length) {
        mediumZoom(images, { background: 'var(--vp-c-bg)' })
      }
    }
    onMounted(initZoom)
    router.onAfterRouteChange = initZoom
  },
  enhanceApp({ app }) {
    app.component('GalleryList', GalleryList)
    if (typeof window !== 'undefined') {
      setupFireworks()
    }
  }
}