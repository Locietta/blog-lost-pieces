import { defineConfigWithTheme } from 'vitepress'
import mk from './markdown-it-katex'
import { getPosts, generatePaginationPages } from './theme/server_utils'

export default async () => {
  const pageSize = 6
  await generatePaginationPages(pageSize)

  return defineConfigWithTheme<LoiaThemeConfig>({
    title: "Lost Pieces - Locietta's Blog",
    description: 'Just playing around.',
    markdown: {
      config: (md) => {
        md.use(mk)
      }
    },
    lastUpdated: true,
    base: '/',
    head: [
      ['link', { rel: 'icon', href: '/L_32x32.ico' }],
      ['meta', { name: 'keywords', content: "Locietta's Blog" }],
      ['meta', { name: 'description', content: "Lost Pieces - Locietta's Blog" }],
      ['meta', { name: 'author', content: 'Locietta' }],
      ['meta', { name: 'robots', content: 'all' }]
    ],
    themeConfig: {
      posts: await getPosts(),
      pageSize: pageSize,
      website: 'https://github.com/Locietta/blog-lost-pieces',
      logo: '/favicon.ico',

      nav: [
        { text: 'Home', link: '/' },
        { text: 'Archives', link: '/pages/archives' },
        { text: 'Tags', link: '/pages/tags' },
        { text: 'About', link: '/pages/about' },
        {
          text: 'External',
          items: [
            { text: 'Github', link: 'https://github.com/Locietta' },
            { text: 'Zhihu', link: 'https://www.zhihu.com/people/wang-ling-xin-94' }
          ]
        }
      ],

      socialLinks: [{ icon: 'github', link: 'https://github.com/Locietta/blog-lost-pieces' }]
    },
    srcExclude: ['README.md']
  })
}
