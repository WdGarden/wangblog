import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '我的博客',
  description: '记录学习与生活',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/hello' }
    ],

    sidebar: [
      {
        text: '文章列表',
        items: [
          { text: '我的第一篇文章', link: '/posts/hello' },
          { text: 'API 示例', link: '/posts/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://gitee.com/你的用户名' }
    ]
  }
})