import fs from 'fs'
import path from 'path'

// 需要忽略的目录或文件
const IGNORE = ['.vitepress', 'node_modules', '.DS_Store', 'public']

/**
 * 文件夹名称映射表：将英文文件夹名映射为中文显示
 */
export const folderNameMap: Record<string, string> = {
  childhood: '童年',
  youth: '青年',
  family: '家庭物语',
  years: '编年体'
  // 以后如果有新目录，在这里添加映射
  // 例如: tech: '技术笔记'
}

export function generateSidebar(dir = '', basePath = dir): any[] {
  const fullPath = path.join(__dirname, '../', dir)
  if (!fs.existsSync(fullPath)) return []

  const entries = fs.readdirSync(fullPath, { withFileTypes: true })
  const directories = entries.filter(
    e => e.isDirectory() && !IGNORE.includes(e.name)
  )
  const files = entries.filter(
    e => e.isFile() && e.name.endsWith('.md') && e.name !== 'index.md'
  )

  const items: any[] = []

  // 处理目录（递归生成子分组）
  for (const dirEntry of directories) {
    const dirName = dirEntry.name
    const subDir = path.join(dir, dirName)
    const subItems = generateSidebar(subDir, path.join(basePath, dirName))
    if (subItems.length > 0) {
      // 使用映射表获取中文显示名，如果没有映射则回退为英文名
      const displayText = folderNameMap[dirName] || dirName
      items.push({
        text: displayText,
        collapsible: true,
        collapsed: true,
        items: subItems
      })
    }
  }

  // 处理 Markdown 文件
  for (const file of files) {
    const fileName = file.name.replace(/\.md$/, '')
    const link = '/' + path.join(basePath, fileName).replace(/\\/g, '/')
    console.log(`生成链接: ${link} 来自 basePath="${basePath}", fileName="${fileName}"`)
    items.push({
      text: fileName, // 这里也可以用映射，但通常文件名我们希望保留原样（或从 frontmatter 读取标题）
      link
    })
  }

  // 按文本字母顺序排序
  items.sort((a, b) => a.text.localeCompare(b.text))

  return items
}