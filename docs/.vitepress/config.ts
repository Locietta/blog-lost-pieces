import { defineConfigWithTheme } from 'vitepress'
import mk from '@neilsustc/markdown-it-katex'
import { getPosts, generatePaginationPages } from './theme/server_utils'

export default async () => {
  const pageSize = 2
  await generatePaginationPages(pageSize)

  return defineConfigWithTheme({
    title: 'Hello VitePress',
    description: 'Just playing around.',
    markdown: {
      config: (md) => {
        md.use(mk)
      }
    },
    base: '/blog-lost-pieces/',
    head: [['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.css' }]],
    themeConfig: {
      posts: await getPosts(),
      pageSize: pageSize,

      nav: [
        { text: 'Home', link: '/' },
        { text: 'Archives', link: '/pages/archives' },
        { text: 'Tags', link: '/pages/tags' },
        { text: 'About', link: '/pages/about' },
        { text: 'Github', link: 'https://github.com/Locietta' } // -- External link test
      ]
    },
    srcExclude: ['README.md']
  })
}
