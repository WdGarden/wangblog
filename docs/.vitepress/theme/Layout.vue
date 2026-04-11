<script setup>
import { ref, provide } from 'vue'
import DefaultTheme from 'vitepress/theme'
import PageMeta from './components/PageMeta.vue'
import { useData } from 'vitepress'

const { Layout } = DefaultTheme
const { frontmatter } = useData()


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
      <template #doc-before>
        <PageMeta />
      </template>
    </Layout>
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