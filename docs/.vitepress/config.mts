import { defineConfig } from 'vitepress'
import { generateSidebar, folderNameMap } from './sidebar.mts'




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
      { text: 'GitHub', link: 'https://github.com/itwangc' },
    ],
//     search: {
//   provider: 'local',
//   options: {
//     translations: {
//       button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
//       modal: { displayDetails: '显示详情', resetButtonTitle: '重置', backButtonTitle: '返回', noResultsText: '没有结果', footer: { selectText: '选择', navigateText: '导航', closeText: '关闭' } }
//     }
//   }
// },


    // 自动生成的侧边栏
    sidebar: [
      {
        text: folderNameMap['years'] || '年份',  // 使用映射显示中文
        collapsible: true,
        collapsed: true,
        items: generateSidebar('years')  // 自动扫描 docs/years 下的内容
      },
      {
        text: folderNameMap['family'] || '家人物语',
        collapsible: true,
        collapsed: true,
        items: generateSidebar('family') // 自动扫描 docs/family 下的内容
      }
      // 如果你希望根目录（/）下也显示其他内容，可以继续添加
    ],

  
    outline: {
      label: '目录', // 自定义标题文字
      level: [2, 3], // 只显示 h2 和 h3 标题（可选）
    },
    docFooter: { prev: '上一篇', next: '下一篇' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/你的用户名' }]
  },

})