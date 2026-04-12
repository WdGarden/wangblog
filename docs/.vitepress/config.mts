import { defineConfig } from 'vitepress'
import { generateSidebar, folderNameMap } from './sidebar.mts'
import { SearchPlugin } from 'vitepress-plugin-search'
import fs from 'fs'
import path from 'path'

// ========== 工具函数 ==========

/**
 * 将文件名转换为标题（例如 "my-article" -> "My Article"）
 */
const fileNameToTitle = (fileName: string) => {
  return fileName
    .replace(/\.md$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

// 需要排除的目录（不生成侧边栏分组）
const excludeDirs = ['.vitepress', 'node_modules', 'dist', 'theme', 'scripts', 'fonts']

/**
 * 动态生成侧边栏（基于 articles 目录）
 */
const getSidebar = () => {
  const docsDir = path.resolve(__dirname, '../articles')
  const dirs = fs.readdirSync(docsDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !excludeDirs.includes(d.name))
    .map(d => d.name)

  return dirs.map(dir => ({
    text: folderNameMap[dir] || dir,
    collapsible: true,
    collapsed: true,
    items: generateSidebar(`articles/${dir}`, `articles/${dir}`)
  }))
}

// ========== VitePress 配置 ==========
export default defineConfig({
  base: '/',
  title: '我的博客',
  titleTemplate: false,   // 禁用标题后缀
  description: '记录学习与生活',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],

  // ----- 构建钩子：自动为所有页面注入默认 frontmatter（不含 lastUpdated）-----
  async transformPageData(pageData) {
  if (!pageData.filePath) return pageData

  const filePath = pageData.filePath
  const fileName = path.basename(filePath, '.md')

  // 获取 Git 首次提交时间（作为创建日期）
  let firstCommitTime = null
  try {
    // 注意：--follow 会跟踪文件重命名，获取最早的提交
    const gitLog = execSync(
      `git log --follow --format=%aI -- "${filePath}" | tail -1`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).trim()
    if (gitLog) {
      firstCommitTime = gitLog.slice(0, 10) // 取 YYYY-MM-DD
    }
  } catch (e) {
    // 文件尚未提交或 Git 命令失败，忽略
  }

  const formatYMD = (date: string | null) => {
    if (!date) return null
    return date.slice(0, 10)
  }

  const defaultFrontmatter: any = {
    title: fileNameToTitle(fileName),
    author: 'itwangc',
    original: true,
    date: firstCommitTime || new Date().toISOString().slice(0, 10),
  }

  pageData.frontmatter = {
    ...defaultFrontmatter,
    ...pageData.frontmatter
  }

  return pageData
},

  // ----- Vite 配置（搜索插件）-----
  vite: {
    plugins: [
      SearchPlugin({
        tokenize: 'full',
        previewLength: 62,
        placeholder: '搜索文档',
      })
    ],
  },

  // ----- Markdown 配置（字数统计）-----
  markdown: {
    config(md) {
      const originalParse = md.parse
      md.parse = function (src, env) {
        const cleanText = src
          .replace(/^---[\s\S]*?---\n/, '')
          .replace(/```[\s\S]*?```/g, '')
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, '')

        const chineseChars = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length
        const otherChars = cleanText.length - chineseChars
        const wordCount = chineseChars + Math.round(otherChars * 0.5)

        if (!env.frontmatter) env.frontmatter = {}
        env.frontmatter.wordCount = wordCount

        return originalParse.call(this, src, env)
      }
    },
    anchor: {
      permalink: false
    }
  },

  // ----- 主题配置（默认主题）-----
  themeConfig: {
    lastUpdated: {
      text: '最近更新',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    logo: {
      light: '/images/logo.png',
      dark: '/images/moon.jpg',
      alt: '博客 Logo'
    },
    siteTitle: false,

    // 导航栏菜单
    nav: [
      { text: '首页', link: '/' },
      {
        text: '运维',
        items: [
          { text: 'IT硬件知识', link: '/knowledge/hardware' }
        ]
      },
      { text: '生活', link: '/articles/' },
      { text: '编程', link: '/coding/' },
      { text: '友链', link: '/links' },
    ],

    // 侧边栏
    sidebar: getSidebar(),

    // 右侧大纲
    outline: {
      label: '目录',
      level: [2, 3],
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