import { defineConfigWithTheme } from 'vitepress'
import mk from './theme/markdown-it-katex'
import img_fig from './theme/markdown-it-img-figure'
import { getPosts, generatePaginationPages } from './theme/server_utils'
import custom_components from './theme/custom_component'

export default async () => {
  const pageSize = 6
  await generatePaginationPages(pageSize)

  return defineConfigWithTheme<LoiaThemeConfig>({
    title: "Lost Pieces - Locietta's Blog",
    description: 'Life Record & Tech Share',
    markdown: {
      theme: { light: 'light-plus', dark: 'dark-plus' },
      config: (md) => {
        md.use(img_fig, {
          figcaption: true,
          lazy: true,
          async: true
        }).use(mk, {
          strict: (errorCode: string) => {
            if (errorCode == 'newLineInDisplayMode') {
              return 'ignore'
            } else {
              return 'warn'
            }
          }
        })
      }
    },
    cleanUrls: true,
    lastUpdated: true,
    base: '/',
    head: [
      ['meta', { name: 'keywords', content: "Locietta's Blog" }],
      ['meta', { name: 'author', content: 'Locietta' }],
      ['meta', { name: 'robots', content: 'all' }],
      ['link', { rel: 'icon', href: '/L_32x32.ico' }]
    ],
    themeConfig: {
      posts: await getPosts(),
      pageSize: pageSize,
      website: 'https://github.com/Locietta/blog-lost-pieces',
      logo: '/favicon.ico',
      comment: true,
      giscusConfig: {
        repo: 'Locietta/blog-lost-pieces',
        repoId: 'R_kgDOH-URKw',
        category: 'Announcements',
        categoryId: 'DIC_kwDOH-URK84CTZKy'
      },

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
    srcExclude: ['README.md'],
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => custom_components.includes(tag)
        }
      }
    }
  })
}
