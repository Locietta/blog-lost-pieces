import { globby } from 'globby'
import fs from 'fs-extra'
import path from 'path'

async function getWeeklyNames() {
  const paths = await globby(['pages/weekly/**.md'], {
    ignore: ['node_modules', 'README.md'],
  })

  return paths
    .filter((item) => item.includes('weekly/'))
    .map((item) => {
      return path.basename(item).replace('.md', '')
    })
}

export async function generateWeeklyArchivePage() {
  let page = `
---
lastUpdated: false
sidebar: false
comment: false
---

## 每周更新的废话
`.trim()
  page += '\n\n'

  const weeklyPosts = await getWeeklyNames()
  weeklyPosts.forEach((item) => {
    page += `* [${item}](/weekly/${item})\n`
  })

  const paths = path.resolve('./pages') + '/weekly.md'
  await fs.writeFile(paths, page)
}
