// docs/.vitepress/config.mts
import { defineConfig } from 'vitepress'
import { SearchPlugin } from 'vitepress-plugin-search'
import { execSync } from 'child_process'
import path from 'path'
import { fileNameToTitle, getSidebar } from './theme/utils/configHelpers'
import { generateSidebar } from './sidebar.mts'

export default defineConfig({
  // 基础配置
  base: '/',
  title: '我的博客',
  titleTemplate: false,
  description: '记录学习与生活',

  // 静态资源路径：直接使用根路径（文件需放在 .vitepress/public/ 下）
   head: [['link', { rel: 'icon', href: '../.vitepress/public/favicon.ico' }]],

  // 构建钩子：自动注入 frontmatter
  async transformPageData(pageData) {
    if (!pageData.filePath) return pageData

    const filePath = pageData.filePath
    const fileName = path.basename(filePath, '.md')

    // 获取 Git 首次提交时间（创建日期）
    let firstCommitTime = null
    try {
      const gitLog = execSync(
        `git log --follow --format=%aI -- "${filePath}" | tail -1`,
        { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
      ).trim()
      if (gitLog) firstCommitTime = gitLog.slice(0, 10)
    } catch (e) {}

    const defaultFrontmatter = {
      title: fileNameToTitle(fileName),
      author: 'itwangc',
      original: true,
      date: firstCommitTime || new Date().toISOString().slice(0, 10),
    }

    pageData.frontmatter = { ...defaultFrontmatter, ...pageData.frontmatter }
    return pageData
  },

  // Vite 插件配置
  vite: {
    plugins: [
      SearchPlugin({
        tokenize: 'full',
        previewLength: 62,
        placeholder: '搜索文档',
      }),
    ],
  },

  // Markdown 扩展（字数统计）
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
    anchor: { permalink: false }
  },

  // 主题配置
  themeConfig: {
    lastUpdated: {
      text: '最近更新',
      formatOptions: { dateStyle: 'full', timeStyle: 'medium' }
    },
    logo: {
      dark: '../.vitepress/public/images/logo.png',
      light: '../.vitepress/public/images/logo.png',
      alt: '博客 Logo'
    },
    siteTitle: false,

    nav: [
      { text: '首页', link: '/' },
      {
        text: '运维',
        items: [
          { text: 'IT硬件知识', link: '/knowledge/hardware/' },
          { text: 'IT软件知识', link: '/knowledge/software/' },
        ]
      },
      { text: '生活', link: '/articles/' },
      { text: '编程', link: '/coding/' },
      { text: '友链', link: '/links/' },
      { text: '图库', link: '/gallery/' }
    ],

    sidebar: {
      '/articles/': getSidebar(),
      '/links/': [
        {
          text: '常见文档处理工具',
          items: [
            { text: '在线转换工具', link: '/links#在线转换工具' },
            { text: '办公辅助', link: '/links#办公辅助' },
          ]
        }
      ],
      '/knowledge/hardware/': generateSidebar('knowledge/hardware', 'knowledge/hardware'),
      '/knowledge/software/': generateSidebar('knowledge/software', 'knowledge/software'),
    },

    outline: { label: '目录', level: [2, 3] },
    footer: {
      message: 'Copyright © 2026-present WdGarden',
      copyright: 'MIT Licensed | Copyright © 2026-present WdGarden'
    },
    docFooter: { prev: '上一篇', next: '下一篇' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/WdGarden/' }]
  }
})