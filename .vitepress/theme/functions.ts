import type { Post } from '.vitepress/env'

export function initTags(post: Post[]) {
  const data: Record<string, Post[]> = {}
  for (let index = 0; index < post.length; index++) {
    const element = post[index]
    const tags = element.frontMatter.tags
    if (tags) {
      tags.forEach((item) => {
        if (data[item]) {
          data[item].push(element)
        } else {
          data[item] = []
          data[item].push(element)
        }
      })
    }
  }
  return data
}

export function useYearSort(post: Post[]) {
  const data: Array<Post[]> = []
  let year = '0'
  let num = -1
  for (let index = 0; index < post.length; index++) {
    const element = post[index]
    if (element.frontMatter.date) {
      const y = element.frontMatter.date.split('-')[0]
      if (y === year) {
        data[num].push(element)
      } else {
        num++
        data[num] = []
        data[num].push(element)
        year = y
      }
    }
  }
  return data
}
