<template>
  <div class="page-meta" v-if="hasMeta">
    <!-- 一行容器：面包屑居左，元数据居右 -->
    <div class="meta-row">
      <!-- 左侧组：按钮 + 面包屑 -->
      <div class="left-group">
        <!-- 侧边栏切换按钮 -->
        <button class="sidebar-toggle" @click="toggleSidebar" :title="sidebarOpen ? '隐藏侧边栏' : '显示侧边栏'">
          <span v-if="sidebarOpen">📖</span>
          <span v-else>📚</span>
        </button>
        <!-- 面包屑 -->
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

        <span class="meta-item" v-if="wordCount">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          {{ wordCount }}
        </span>

        <span class="original-tag" v-if="frontmatter.original">原创</span>
        <button @click="downloadPDF" class="pdf-btn">📑 PDF</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { inject } from 'vue'
import { folderNameMap } from '../../sidebar.mts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const { page, frontmatter } = useData()

// 只有文章页才显示
const hasMeta = computed(() => page.value?.relativePath && page.value.relativePath !== 'index.md')

// 字数统计（从 frontmatter 读取）
const wordCount = computed(() => {
  const count = frontmatter.value?.wordCount
  if (count === undefined) return ''
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count + ' 字'
})

// 注入侧边栏状态和方法
const { open: sidebarOpen, toggle: toggleSidebar } = inject('sidebar')

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// 生成面包屑
const breadcrumb = computed(() => {
  const path = page.value?.relativePath?.split('/') || []
  const crumbs = [{ text: '🏠', link: '/' }]

  for (let i = 0; i < path.length - 1; i++) {
    const folder = path[i]
    const displayName = folderNameMap[folder] ||
      folder.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    crumbs.push({ text: displayName, link: `/${path.slice(0, i + 1).join('/')}/` })
  }

  const fileName = path[path.length - 1]?.replace('.md', '').replace(/-/g, ' ')
  if (fileName) {
    const displayName = fileName === 'index' ? '介绍' : fileName.replace(/-/g, ' ')
    crumbs.push({ text: displayName })
  }

  return crumbs
})
// 高清 PDF 导出（修复截断与居中）
const downloadPDF = async () => {
  const element = document.querySelector('.vp-doc')
  if (!element) {
    alert('未找到文章内容，无法生成 PDF')
    return
  }

  try {
    // 1. 获取元素实际尺寸（完整内容）
    const elementWidth = element.scrollWidth
    const elementHeight = element.scrollHeight

    // 2. 截图（高清）
    const scale = 2 // 提高清晰度
    const canvas = await html2canvas(element, {
      scale: scale,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: elementWidth,
      height: elementHeight,
      windowWidth: elementWidth,
      windowHeight: elementHeight
    })

    // 3. PDF 设置（A4 纵向）
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    // 4. 计算图片在 PDF 中的宽度（撑满宽度，高度按比例）
    const imgWidth = pdfWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // 5. 分页逻辑：计算需要多少页
    let remainingHeight = imgHeight
    let currentPage = 0

    while (remainingHeight > 0) {
      // 当前页要裁剪的高度（不超过 PDF 高度）
      const pageHeight = Math.min(pdfHeight, remainingHeight)

      // 从原 canvas 中裁剪出当前页对应的部分
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = canvas.width
      pageCanvas.height = (pageHeight / imgHeight) * canvas.height
      const ctx = pageCanvas.getContext('2d')
      ctx.drawImage(
        canvas,
        0,
        (currentPage * pdfHeight / imgHeight) * canvas.height, // 源Y坐标
        canvas.width,
        pageCanvas.height,
        0,
        0,
        canvas.width,
        pageCanvas.height
      )

      const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95)

      // 水平居中计算
      const xOffset = (pdfWidth - imgWidth) / 2

      if (currentPage === 0) {
        pdf.addImage(pageImgData, 'JPEG', xOffset, 0, imgWidth, pageHeight, undefined, 'FAST')
      } else {
        pdf.addPage()
        pdf.addImage(pageImgData, 'JPEG', xOffset, 0, imgWidth, pageHeight, undefined, 'FAST')
      }

      remainingHeight -= pageHeight
      currentPage++
    }

    pdf.save('article.pdf')
  } catch (error) {
    console.error('PDF 生成失败:', error)
    alert('生成失败，请稍后重试')
  }
}
</script>

<style scoped>
.page-meta {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.sidebar-toggle span {
  font-size: 40px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.left-group {
  display: flex;
  align-items: center;
  gap: 2.0rem;
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

.pdf-btn {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.2rem 0.8rem;
  font-size: 1.05rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  white-space: nowrap;
  margin-left: 0.5rem;
}

.pdf-btn:hover {
  background-color: #f3f4f6;
  color: #2563eb;
  border-color: #2563eb;
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

  .sidebar-toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.8rem;
    padding: 0.25rem 0.5rem;
    color: #6b7280;
    transition: color 0.2s;
    line-height: 1;
    border-radius: 4px;
  }

  .sidebar-toggle:hover {
    color: #2563eb;
    background-color: rgba(37, 99, 235, 0.05);
  }

  .sidebar-toggle {
    margin-right: 0.1rem;
  }
}
</style>