<script setup>
import { ref, provide } from 'vue'
import DefaultTheme from 'vitepress/theme'
import PageMeta from './components/PageMeta.vue'


const { Layout } = DefaultTheme

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

       <template #nav-bar-title-before>
        <img src="../public/images/avatar.png" alt="头像" class="nav-avatar">
      </template>
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
  transition: all 0.8s ease;
}

/* 头像样式：圆形、等比例缩小、与文字对齐 */
.nav-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  vertical-align: middle;
  margin-right: 18px; /* 与标题文字的距离 */
  margin-left: -80px;
}
</style>