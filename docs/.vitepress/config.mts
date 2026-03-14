import { defineConfig } from 'vitepress'

export default defineConfig({
  base:'/viteblog/',
  title: '我的博客',
  description: '记录学习与生活',

  themeConfig: {
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

    sidebar: [
      {
        text: '随写编年',
        items: [
          { text: '年终总结', link: '/posts/year-end-summary' },
          { text: '2012年', link: '/posts/2012' },
          { text: '2013年', link: '/posts/2013' },
          { text: '2014年', link: '/posts/2014' },
          { text: '2015年', link: '/posts/2015' },
          { text: '2016年', link: '/posts/2016' },
          { text: '2017年', link: '/posts/2017' },
          { text: '2018年', link: '/posts/2018' },
          { text: '2019年', link: '/posts/2019' },
          { text: '2020年', link: '/posts/2020' },
          { text: '2021年', link: '/posts/2021' },
          { text: '2022年', link: '/posts/2022' },
          { text: '2023年', link: '/posts/2023' },
          { text: '2024年', link: '/posts/2024' },
          { text: '2025年', link: '/posts/2025' },
        ]
      },
      {
        text: '家人物语',
        items: [
          { text: '追忆青春', link: '/family/youth' },
          { text: '父亲的朋友圈', link: '/family/father' },
          { text: '电影音乐', link: '/family/movies' },
          { text: '效率工具', link: '/family/tools' },
        ]
      }
    ],
    search: {
      provider: 'local'
    },
     // 右侧大纲显示层级（可选）
     outline: {
      level: [2, 3]  // 显示 h2 和 h3 标题
    },

    // 上一页/下一页链接（可选）
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    socialLinks: [
      { icon: 'github', link: 'https://gitee.com/你的用户名' }
    ]
  }
})