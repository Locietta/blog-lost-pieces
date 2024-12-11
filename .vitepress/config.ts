import { defineConfigWithTheme } from 'vitepress'
import mk from './theme/markdown-it-katex'
import img_fig from './theme/markdown-it-img-figure'
import { getPosts, generatePaginationPages, generateWeeklyArchivePage } from './theme/server_utils'
import custom_components from './theme/custom_component'

export default async () => {
  const pageSize = 6
  await generatePaginationPages(pageSize)
  await generateWeeklyArchivePage()

  return defineConfigWithTheme<LoiaThemeConfig>({
    title: "Lost Pieces - Locietta's Blog",
    description: 'Life Record & Tech Share',
    markdown: {
      theme: { light: 'light-plus', dark: 'dark-plus' },
      // math: true,
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
        { text: 'Archives', link: '/archives' },
        { text: 'Tags', link: '/tags' },
        { text: 'About', link: '/about' },
        {
          text: 'External',
          items: [
            { text: 'Github', link: 'https://github.com/Locietta' },
            { text: 'Zhihu', link: 'https://www.zhihu.com/people/wang-ling-xin-94' }
          ]
        }
      ],
      outline: {
        level: [2, 3],
        label: '目录'
      },

      socialLinks: [{ icon: 'github', link: 'https://github.com/Locietta/blog-lost-pieces' }]
    },
    srcExclude: ['README.md'],
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => custom_components.includes(tag)
        }
      }
    },
    vite: {
      build: {
        rollupOptions: {
          onwarn: (warning, warn) => {
            // Module level directives cause errors when bundled, "use client" was ignored
            // https://stackoverflow.com/a/76694634/21554202
            if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
              return
            }
            warn(warning)
          }
        }
      },
      ssr: {
        // workaround for:
        // * react-tweet: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".css"
        // * veaury: SyntaxError: Named export 'applyPureReactInVue' not found.
        // https://github.com/antfu/vite-ssg/issues/156#issuecomment-1208009117
        noExternal: ['react-tweet', 'veaury']
      }
    }
  })
}
