import { defineConfig } from 'vitepress'
import { generateSidebar, folderNameMap } from './sidebar.mts'
import fs from 'fs'
import path from 'path'

// 需要排除的目录（不生成侧边栏分组）
const excludeDirs = ['.vitepress', 'public', 'node_modules', 'dist','theme','scripts','fonts']

// 动态生成 sidebar 数组
const getSidebar = () => {
  // 获取 docs 目录的绝对路径
  const docsDir = path.resolve(__dirname, '../articles')
  // 读取所有一级目录
  const dirs = fs.readdirSync(docsDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !excludeDirs.includes(d.name))
    .map(d => d.name)

  return dirs.map(dir => ({
    // 优先使用映射表中的中文名，否则显示目录原名（英文）
    text: folderNameMap[dir] || dir,
    collapsible: true,
    collapsed: true,
    items: generateSidebar(`articles/${dir}`, `articles/${dir}`)   // 递归扫描该目录下的内容
  }))
}

export default defineConfig({
  base: '/',
  title: '我的博客',
  description: '记录学习与生活',

  // ✨ 新增加的部分：用于控制 Markdown 的全局行为 ✨
  markdown: {
    config(md) {
      const originalParse = md.parse
      md.parse = function(src, env) {
      // 1. 移除 frontmatter 部分（--- 之间的内容）
      // 2. 移除代码块（``` ... ```）
      // 3. 移除 HTML 标签
      // 4. 移除空白字符
      const cleanText = src
        .replace(/^---[\s\S]*?---\n/, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, '')

      // 统计中文字符（按实际字数）
      const chineseChars = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length
      // 其他字符（英文、数字、标点）按 0.5 字估算（可根据需要调整）
      const otherChars = cleanText.length - chineseChars
      const wordCount = chineseChars + Math.round(otherChars * 0.5)

      // 将字数存入 env.frontmatter
      if (!env.frontmatter) env.frontmatter = {}
      env.frontmatter.wordCount = wordCount

      // 调用原始 parse 方法继续解析
      return originalParse.call(this, src, env)
    }
    },
    anchor: {
      // 把这个参数设为 false，悬停时的 "#" 符号就不会再出现了
      permalink: false
    }
  },

  themeConfig: {
    lastUpdated: {
      text: '最后更新', // 显示的文字
      formatOptions: { // 可选：日期格式
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '运维', link: '/ops/' },
      { text: '生活', link: '/life/' },
      { text: '编程', link: '/coding/' },
      { text: '周刊', link: '/weekly/' },
      { text: '关于', link: '/about' },
      { text: '友链', link: '/links' },
      { text: 'GitHub', link: 'https://github.com/WdGarden/' },
    ],

    // 自动生成的侧边栏
    sidebar: getSidebar(),

  
    outline: {
      label: '目录', // 自定义标题文字
      level: [2, 3], // 只显示 h2 和 h3 标题（可选）
    },
    docFooter: { prev: '上一篇', next: '下一篇' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/WdGarden/' }]
  },

})