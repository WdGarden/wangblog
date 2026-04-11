
import { defineConfig } from 'vitepress'
import { generateSidebar, folderNameMap } from './sidebar.mts'
import { SearchPlugin } from 'vitepress-plugin-search'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'


// ========== 工具函数 ==========

/**
 * 将文件名转换为标题（例如 "my-article" -> "My Article"）
 * 注意：对中文文件名无效，但博客文章文件名建议使用英文。
 */
const fileNameToTitle = (fileName: string) => {
  return fileName
    .replace(/\.md$/, '')                // 去掉 .md 后缀
    .replace(/[-_]/g, ' ')               // 连字符/下划线替换为空格
    .replace(/\b\w/g, (c) => c.toUpperCase()) // 每个单词首字母大写
}

// 需要排除的目录（不生成侧边栏分组）
const excludeDirs = ['.vitepress', 'node_modules', 'dist', 'theme', 'scripts', 'fonts']

/**
 * 动态生成侧边栏（基于 articles 目录）
 * 扫描 docs/articles 下的一级目录，为每个目录生成一个可折叠分组，
 * 并调用 generateSidebar 递归生成子目录和文章链接。
 */
const getSidebar = () => {
  const docsDir = path.resolve(__dirname, '../articles')
  const dirs = fs.readdirSync(docsDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !excludeDirs.includes(d.name))
    .map(d => d.name)

  return dirs.map(dir => ({
    text: folderNameMap[dir] || dir,              // 优先使用映射中文名
    collapsible: true,
    collapsed: true,
    items: generateSidebar(`articles/${dir}`, `articles/${dir}`)
  }))
}

// ========== VitePress 配置 ==========
export default defineConfig({
  // ----- 基础配置 -----
  base: '/',                      // 站点基础路径（部署到根路径）
  title: '我的博客',              // 浏览器标签页标题
  description: '记录学习与生活',  // SEO 描述
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]], // 网站图标

  // ----- 构建钩子：自动为所有页面注入默认 frontmatter -----
async transformPageData(pageData, { siteConfig }) {
  if (!pageData.filePath) return pageData

  const filePath = pageData.filePath
  const fileName = path.basename(filePath, '.md')

  // 获取文件的 Git 最后提交时间（独立于全局提交）
  let lastCommitTime = null
  try {
    // 注意：filePath 是相对于项目根目录的路径（例如 docs/articles/xxx.md）
    const gitLog = execSync(
      `git log -1 --format=%aI -- "${filePath}"`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).trim()
    if (gitLog) {
      lastCommitTime = gitLog
    }
  } catch (e) {
    // 文件未被 Git 跟踪或没有提交记录，忽略
  }

  // 获取文件创建时间（用于 date）
  let birthtime = null
  try {
    const stats = fs.statSync(filePath)
    birthtime = stats.birthtime
  } catch (e) {}

  const formatYMD = (date: Date | null) => {
    if (!date) return null
    return date.toISOString().slice(0, 10)
  }

  const defaultFrontmatter: any = {
    title: fileNameToTitle(fileName),
    author: 'itwangc',
    original: true,
    date: birthtime ? formatYMD(birthtime) : new Date().toISOString().slice(0, 10),
    // lastUpdated: lastCommitTime || new Date().toISOString()  // 优先使用 Git 时间
  }

  pageData.frontmatter = {
    ...defaultFrontmatter,
    ...pageData.frontmatter
  }

  return pageData
},
  // ----- Vite 配置（用于插件）-----
  vite: {
    plugins: [
      SearchPlugin({
        tokenize: 'full',        // 支持中文分词
        previewLength: 62,
        placeholder: '搜索文档',
      })
    ],
  },

  // ----- Markdown 配置（扩展解析器）-----
  markdown: {
    config(md) {
      const originalParse = md.parse
      // 重写 parse 方法，在解析时统计中文字数
      md.parse = function (src, env) {
        const cleanText = src
          .replace(/^---[\s\S]*?---\n/, '') // 移除 frontmatter
          .replace(/```[\s\S]*?```/g, '')   // 移除代码块
          .replace(/<[^>]*>/g, '')           // 移除 HTML 标签
          .replace(/\s+/g, '')               // 移除空白

        const chineseChars = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length
        const otherChars = cleanText.length - chineseChars
        const wordCount = chineseChars + Math.round(otherChars * 0.5)

        if (!env.frontmatter) env.frontmatter = {}
        env.frontmatter.wordCount = wordCount // 将字数注入 frontmatter

        return originalParse.call(this, src, env)
      }
    },
    anchor: {
      permalink: false   // 关闭标题悬停时的 # 链接符号
    }
  },
 lastUpdated: true, // string | boolean
  // ----- 主题配置（默认主题）-----
  themeConfig: {
    // 导航栏 Logo（支持亮色/暗色模式）
    logo: {
      light: '/images/logo.png',
      dark: '/images/moon.jpg',
      alt: '博客 Logo'
    },
    siteTitle: false,  // 只显示 Logo，不显示文字标题
    
 lastUpdatedText: "最后更新", // string
    // 导航栏菜单（支持下拉）
    nav: [
      { text: '首页', link: '/' },
      {
        text: '运维',
        items: [
          { text: 'IT硬件知识', link: '/knowledge/hardware' }
          // 可继续添加更多子项
        ]
      },
      { text: '生活', link: '/articles/' },
      { text: '编程', link: '/coding/' },
      { text: '友链', link: '/links' },
    ],

    // 侧边栏（目前全局共用 articles 目录的侧边栏）
    // 提示：如需为 /knowledge/ 等目录配置独立侧边栏，可将 sidebar 改为对象形式。
    sidebar: getSidebar(),

    // 右侧大纲（目录）
    outline: {
      label: '目录',
      level: [2, 3],      // 显示 h2 和 h3 标题
    },

    // 页脚
    footer: {
      message: 'Copyright © 2026-present WdGarden',
      copyright: 'MIT Licensed | Copyright © 2026-present WdGarden'
    },

    // 文档上下页文本
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/WdGarden/' }
    ]
  }
})