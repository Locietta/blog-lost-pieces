import { globby } from 'globby'
import matter from 'gray-matter'
import fs from 'fs-extra'
import path from 'path'
import type { Post } from '.vitepress/env'

export async function getPosts() {
  const paths = await getPostMDFilePaths()
  const posts: Post[] = await Promise.all(
    paths.map(async (item) => {
      const content = await fs.readFile(item, 'utf-8')
      const data = matter(content).data as Post['frontMatter']

      data.date = _convertDate(data.date)

      if (!data.title) {
        data.title = '无标题'
      }

      return {
        frontMatter: data,
        regularPath: `/${item.replace('.md', '').replace('pages/', '')}`,
      }
    }),
  )
  posts.sort(_compareDate)
  return posts
}

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
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(${pageSize * (i - 1)},${pageSize * i})
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

function _convertDate(date = new Date().toString()) {
  const json_date = new Date(date).toJSON()
  return json_date.split('T')[0]
}

function _compareDate(obj1: Post, obj2: Post) {
  return obj1.frontMatter.date < obj2.frontMatter.date ? 1 : -1
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
