<template>
  <div class="page-meta" v-if="hasMeta">
    <!-- 一行容器：面包屑居左，元数据居右 -->
    <div class="meta-row">
       <!-- 左侧组：按钮 + 面包屑 -->
       <div class="left-group">
      <!-- 新增的侧边栏切换按钮 -->
      <button class="sidebar-toggle" @click="toggleSidebar" :title="sidebarOpen ? '隐藏侧边栏' : '显示侧边栏'">
        <span v-if="sidebarOpen">📖</span>
        <span v-else>📚</span>
      </button>
       <!-- 面包屑（左） -->
       <div class="breadcrumb">
        <span v-for="(item, index) in breadcrumb" :key="index">
          <RouterLink v-if="item.link" :to="item.link">{{ item.text }}</RouterLink>
          <span v-else>{{ item.text }}</span>
          <span v-if="index < breadcrumb.length - 1" class="separator"> / </span>
        </span>
      </div>
    </div>

      <!-- 元数据（右） -->
      <div class="meta-info">
        <span class="meta-item" v-if="frontmatter.author">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          作者：{{ frontmatter.author }}
        </span>

        <span class="meta-item" v-if="frontmatter.date">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {{ formatDate(frontmatter.date) }}
          
        </span>

        <span class="meta-item" v-if="wordCount !== undefined">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          {{ formatWordCount(wordCount) }}
        </span>

        <span class="original-tag" v-if="frontmatter.original">原创</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { inject } from 'vue'
import { folderNameMap } from '../../sidebar.mts'  // 根据实际路径调整

const { page, frontmatter } = useData()

// 只有文章页才显示
const hasMeta = computed(() => page.value?.relativePath && page.value.relativePath !== 'index.md')

// --- 修复字数统计逻辑 ---
const wordCount = computed(() => {
  // 优先尝试从 page.html 提取（如果有插件支持）
  let text = ''

  if (page.value.html) {
    // 去除 HTML 标签
    text = page.value.html.replace(/<[^>]*>/g, '')
  } else if (page.value.content) {
    // 降级方案：直接从 markdown 源码提取
    // 去除 frontmatter (--- ... ---), 代码块, 和 HTML 标签
    text = page.value.content
      .replace(/^---[\s\S]*?---\n/, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/<[^>]*>/g, '')
  }

  // 去除多余空白
  text = text.replace(/\s+/g, ' ').trim()
  const count = text.length

  // 返回格式化后的字符串，或者直接返回数字供模板格式化
  return count
})

// 注入侧边栏状态和方法
const { open: sidebarOpen, toggle: toggleSidebar } = inject('sidebar')

// 格式化函数：接收数字，返回 "1.2k" 或 "500 字"
const formatWordCount = (count) => {
  if (!count && count !== 0) return '0 字'
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count + ' 字'
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  // 处理 Invalid Date
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// 生成面包屑
const breadcrumb = computed(() => {
  const path = page.value?.relativePath?.split('/') || []
  const crumbs = [{ text: '🏠', link: '/' }]

  for (let i = 0; i < path.length - 1; i++) {
    const folder = path[i]
    // 优先从映射中获取中文名，否则进行首字母大写转换
    const displayName = folderNameMap[folder] ||
                        folder.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    crumbs.push({ text: displayName, link: `/${path.slice(0, i + 1).join('/')}/` })
  }

  const fileName = path[path.length - 1]?.replace('.md', '').replace(/-/g, ' ')
  if (fileName) {
    // 文件名也可以考虑映射，但通常不需要，如果文件名是英文，可以首字母大写
    crumbs.push({ text: fileName.replace(/\b\w/g, l => l.toUpperCase()) })
  }

  return crumbs
})
</script>


<style scoped>
.page-meta {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.sidebar-toggle span{
  font-size: 40px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;  /* 这个 gap 控制左右组之间的间距，可以按需调整 */
}

.left-group {
  display: flex;
  align-items: center;
  gap: 2.0rem;      /* 左组内按钮和面包屑之间无间距，如需微小间距可设 0.2rem */
}

.breadcrumb {
  font-size: 0.85rem;
  white-space: nowrap;
  overflow-x: auto;
  max-width: 90%;
}

.breadcrumb a {
  color: #6b7280;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #2563eb;
}

.separator {
  margin: 0 0.3rem;
  color: #d1d5db;
}

.meta-info {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
}

.original-tag {
  background-color: #fef3c7;
  color: #d97706;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid #fbbf24;
  white-space: nowrap;
}

/* 小屏幕适配 */
@media (max-width: 640px) {
  .meta-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .breadcrumb {
    max-width: 100%;
  }

  .meta-info {
    justify-content: flex-start;
  }
/* 按钮样式 */
.sidebar-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.8rem;        /* 从 1.2rem 增大到 1.8rem */
  padding: 0.25rem 0.5rem;   /* 增加垂直内边距，点击区域更大 */
  color: #6b7280;
  transition: color 0.2s;
  line-height: 1;
  border-radius: 4px;        /* 可选：增加圆角 */
}
.sidebar-toggle:hover {
  color: #2563eb;
  background-color: rgba(37,99,235,0.05); /* 悬停时增加背景反馈 */
}

.sidebar-toggle {
  margin-right: 0.1rem;  /* 可根据需要微调 */
}

}
</style>