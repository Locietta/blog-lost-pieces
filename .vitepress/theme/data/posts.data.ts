import { createContentLoader } from 'vitepress'

import type { Post } from '.vitepress/theme'

export declare const data: Post[]

export default createContentLoader('posts/*.md', {
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter }) => {
        const date = frontmatter.date ? new Date(frontmatter.date) : new Date()

        frontmatter.date = date.toISOString().split('T')[0]
        frontmatter.title = frontmatter.title || '无标题'

        return { frontMatter: frontmatter as Post['frontMatter'], regularPath: url }
      })
      .sort((a: Post, b: Post) => {
        return a.frontMatter.date > b.frontMatter.date ? -1 : 1
      })
  },
})
