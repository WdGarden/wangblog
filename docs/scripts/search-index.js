// scripts/search-index.js
import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'

export function searchIndexPlugin() {
  return {
    name: 'vite-plugin-search-index',
    apply: 'build',          // 只在构建时运行
    async closeBundle() {
      const docsDir = path.resolve(process.cwd(), 'docs')
      const files = await glob('**/*.md', {
        cwd: docsDir,
        ignore: ['node_modules/**', '.vitepress/**', 'public/**']
      })

      const index = files.map(file => {
        const fullPath = path.join(docsDir, file)
        let content = fs.readFileSync(fullPath, 'utf-8')

        // 移除 frontmatter (--- 之间的内容)
        content = content.replace(/^---[\s\S]*?---\n/, '')
        // 移除代码块和HTML标签（简单清理，保证搜索质量）
        content = content.replace(/```[\s\S]*?```/g, '')
                         .replace(/<[^>]*>/g, '')

        // 提取标题（第一个 # 标题）
        const titleMatch = content.match(/^#\s+(.+)/m)
        const title = titleMatch ? titleMatch[1].trim() : path.basename(file, '.md')

        // 提取内容摘要（前200个字符）
        const excerpt = content.slice(0, 200).replace(/\s+/g, ' ').trim()

        return {
          title,
          path: file.replace(/\.md$/, ''), // 文件路径，用于跳转
          excerpt,
        }
      })

      // 确保 dist 目录存在
      const outDir = path.resolve(process.cwd(), 'docs/.vitepress/dist')
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true })
      }

      // 写入索引文件
      fs.writeFileSync(
        path.join(outDir, 'search-index.json'),
        JSON.stringify(index, null, 2)
      )
      console.log(`✅ 搜索索引已生成，共 ${index.length} 篇文章`)
    }
  }
}