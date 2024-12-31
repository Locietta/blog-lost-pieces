import { globby } from 'globby'
import fs from 'fs-extra'
import path from 'path'

export async function generatePaginationPages(pageSize: number) {
  // getPostMDFilePath return type is object not array
  const allPagesLength = [...(await getPostMDFilePaths())].length

  //  pagesNum
  let pagesNum =
    allPagesLength % pageSize === 0 ? allPagesLength / pageSize : allPagesLength / pageSize + 1
  pagesNum = parseInt(pagesNum.toString())

  const paths = path.resolve('./pages')
  if (allPagesLength > 0) {
    for (let i = 1; i < pagesNum + 1; i++) {
      const page = `
---
lastUpdated: false
sidebar: false
comment: false
---
<script setup>
import Page from "../.vitepress/theme/components/Page.vue";
import { data } from '../.vitepress/theme/posts.data.ts'
const posts = data.slice(${pageSize * (i - 1)},${pageSize * i})
</script>
<Page :posts="posts" :pageCurrent="${i}" :pagesNum="${pagesNum}" />
`.trim()
      const file = paths + `/page_${i}.md`
      await fs.writeFile(file, page)
    }
  }
  // rename page_1 to index for homepage
  await fs.move(paths + '/page_1.md', paths + '/index.md', { overwrite: true })
}

async function getPostMDFilePaths() {
  const paths = await globby(['pages/posts/**.md'], {
    ignore: ['node_modules', 'README.md'],
  })
  return paths.filter((item) => item.includes('posts/'))
}

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
