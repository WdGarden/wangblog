<script setup>
import { ref, provide, computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import PageMeta from '../components/PageMeta.vue'
import MusicPlayer from '../components/MusicPlayer.vue'

const { Layout } = DefaultTheme
const route = useRoute()

// 侧边栏显示状态（默认显示）
const sidebarOpen = ref(true)

// 切换侧边栏显示/隐藏
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// 提供给后代组件（如 PageMeta 中的切换按钮）使用
provide('sidebar', {
  open: sidebarOpen,
  toggle: toggleSidebar
})

// 判断是否为图库相关页面（用于隐藏 PageMeta 组件）
const isGalleryPage = computed(() => route.path.startsWith('/gallery/'))
</script>

<template>
  <!-- 自定义布局容器，根据侧边栏状态添加类名 -->
  <div class="custom-layout" :class="{ 'sidebar-hidden': !sidebarOpen }">
    <!-- 保留 VitePress 默认的 Layout 组件，通过插槽注入自定义内容 -->
    <Layout>
      <!-- 在导航栏内容之后插入音乐播放器（右侧区域） -->
      <template #nav-bar-content-after>
        <MusicPlayer />
      </template>

      <!-- 在文档内容之前插入文章元数据（仅非图库页面显示） -->
      <template v-if="!isGalleryPage" #doc-before>
        <PageMeta />
      </template>
    </Layout>
  </div>
</template>

