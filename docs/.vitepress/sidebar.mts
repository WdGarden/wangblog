import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 需要忽略的目录或文件
const IGNORE = ['.vitepress', 'node_modules', '.DS_Store', 'public', 'fonts']

/**
 * 文件夹名称映射表
 */
export const folderNameMap: Record<string, string> = {
  articles: '文章',
  Index: '介绍',
}

/**
 * 递归扫描目录，生成侧边栏配置
 */
export function generateSidebar(dir = '', basePath = dir): any[] {
  const fullPath = path.join(__dirname, '../', dir)
  if (!fs.existsSync(fullPath)) return []

  const entries = fs.readdirSync(fullPath, { withFileTypes: true })

  // 分离目录和 Markdown 文件（排除 index.md）
  const directories = entries.filter(
    e => e.isDirectory() && !IGNORE.includes(e.name)
  )
  const files = entries.filter(
    e => e.isFile() && e.name.endsWith('.md') && e.name !== 'index.md'
  )

  // ------------------- 处理目录（生成可折叠分组） -------------------
  const dirItems: any[] = []
  for (const dirEntry of directories) {
    const dirName = dirEntry.name
    const subDir = path.join(dir, dirName)
    const subItems = generateSidebar(subDir, path.join(basePath, dirName))
    if (subItems.length > 0) {
      // 获取目录的创建时间（毫秒时间戳）
      const stat = fs.statSync(path.join(fullPath, dirName))
      const createTime = stat.birthtimeMs
      const displayText = folderNameMap[dirName] || dirName
      dirItems.push({
        text: displayText,
        collapsible: true,
        collapsed: true,
        items: subItems,
        createTime,
      })
    }
  }

  // 按目录创建时间升序排序（老的在上，新的在下）
  dirItems.sort((a, b) => a.createTime - b.createTime)

  // ------------------- 处理 Markdown 文件（生成文章链接，并按日期排序） -------------------
  const fileItems: any[] = []
  for (const file of files) {
    const filePath = path.join(fullPath, file.name)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(fileContent)
    const fileName = file.name.replace(/\.md$/, '')
    const link = '/' + path.join(basePath, fileName).replace(/\\/g, '/')
    const date = data.date ? new Date(data.date) : null
    fileItems.push({
      text: fileName,
      link,
      date,
    })
  }

  // 按文章日期降序排序（新的在上，旧的在下）
  fileItems.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return b.date.getTime() - a.date.getTime()
  })

  // 组合结果：先目录分组（按创建时间升序），再文章链接（按日期降序）
  const result = [...dirItems, ...fileItems.map(({ text, link }) => ({ text, link }))]

  return result
}