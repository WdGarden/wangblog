<script setup>
import { ref, provide,computed  } from 'vue'
import DefaultTheme from 'vitepress/theme'
import PageMeta from './components/PageMeta.vue'
import { useData ,useRoute } from 'vitepress'
import MusicPlayer from './components/MusicPlayer.vue' // 导入

const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()


// 判断是否为图库相关页面（不显示 PageMeta）
const isGalleryPage = computed(() => route.path.startsWith('/gallery/'))

// 侧边栏显示状态
const sidebarOpen = ref(true)
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// 提供给后代组件使用
provide('sidebar', {
  open: sidebarOpen,
  toggle: toggleSidebar
})
</script>

<template>
  <div class="custom-layout" :class="{ 'sidebar-hidden': !sidebarOpen }">
    <Layout>
       <template #nav-bar-content-after>
        <MusicPlayer />
      </template>
      <!-- 只在非图库页面显示 PageMeta -->
      <template v-if="!isGalleryPage" #doc-before>
        <PageMeta />
      </template>
    </Layout>
      <MusicPlayer />
  </div>
</template>

<style>
/* 隐藏侧边栏时的样式 */
.sidebar-hidden .VPSidebar {
  display: none !important;
}

.sidebar-hidden .VPContent {
  margin-left: 0 !important;
  width: 100% !important;

}

/* 可选：添加平滑过渡效果 */
.VPSidebar,
.VPContent {
  transition: all 1.8s ease;
}

</style>