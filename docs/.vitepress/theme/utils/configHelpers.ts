// docs/.vitepress/utils/configHelpers.ts
import fs from 'fs'
import path from 'path'
import { generateSidebar, folderNameMap } from '../../sidebar.mjs'

// 需要排除的目录（不生成侧边栏分组）
export const excludeDirs = ['.vitepress', 'node_modules', 'dist', 'theme', 'scripts', 'fonts']

/**
 * 将文件名转换为标题（例如 "my-article" -> "My Article"）
 */
export const fileNameToTitle = (fileName: string) => {
  return fileName
    .replace(/\.md$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * 动态生成侧边栏（基于 articles 目录）
 */
export const getSidebar = () => {
  const docsDir = path.resolve(__dirname, '../../../articles')
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