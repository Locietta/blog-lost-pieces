import { DefaultTheme, defineConfigWithTheme, MarkdownOptions } from 'vitepress'
import mk from './theme/markdown-it-katex'
import img_fig from './theme/markdown-it-img-figure'
import append_title from './theme/markdown-it-append-title'
import { wordless, chineseAndJapanese, Options } from 'markdown-it-wordless'
import { getPosts, generatePaginationPages, generateWeeklyArchivePage } from './theme/server_utils'
import custom_components from './theme/custom_component'

export default async () => {
  const pageSize = 6
  await generatePaginationPages(pageSize)
  await generateWeeklyArchivePage()

  const giscusConfig: LoiaTheme.GiscusConfig = {
    repo: 'Locietta/blog-lost-pieces',
    repoId: 'R_kgDOH-URKw',
    category: 'Announcements',
    categoryId: 'DIC_kwDOH-URK84CTZKy'
  }

  const searchConfig: DefaultTheme.Config['search'] = {
    provider: 'local',
    options: {
      locales: {
        root: {
          translations: {
            button: {
              buttonText: '搜索',
              buttonAriaLabel: '搜索'
            },
            modal: {
              displayDetails: '显示详细列表',
              resetButtonTitle: '重置搜索',
              backButtonTitle: '关闭搜索',
              noResultsText: '没有结果',
              footer: {
                selectText: '选择',
                selectKeyAriaLabel: '输入',
                navigateText: '导航',
                navigateUpKeyAriaLabel: '上箭头',
                navigateDownKeyAriaLabel: '下箭头',
                closeText: '关闭',
                closeKeyAriaLabel: 'esc'
              }
            }
          }
        }
      }
    }
  }

  const themeConfig: LoiaTheme.Config = {
    posts: await getPosts(),
    pageSize: pageSize,
    website: 'https://github.com/Locietta/blog-lost-pieces',
    logo: '/favicon.ico',
    comment: true,
    giscusConfig: giscusConfig,
    search: searchConfig,
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
  }

  return defineConfigWithTheme<LoiaTheme.Config>({
    title: "Lost Pieces - Locietta's Blog",
    description: 'Life Record & Tech Share',
    base: '/',
    srcDir: 'pages',
    srcExclude: ['**/README.md'],
    cleanUrls: true,
    lastUpdated: true,
    head: [
      ['meta', { name: 'keywords', content: "Locietta's Blog" }],
      ['meta', { name: 'author', content: 'Locietta' }],
      ['meta', { name: 'robots', content: 'all' }],
      ['link', { rel: 'icon', href: '/L_32x32.ico' }]
    ],
    themeConfig: themeConfig,
    markdown: {
      theme: { light: 'light-plus', dark: 'dark-plus' },
      config: (md) => {
        md.use(img_fig, {
          figcaption: true,
          lazy: true,
          async: true
        })
          .use(mk, {
            strict: (errorCode: string) => {
              if (errorCode == 'newLineInDisplayMode') {
                return 'ignore'
              } else {
                return 'warn'
              }
            }
          })
          .use<Options>(wordless, { supportWordless: [chineseAndJapanese] })
          .use(append_title)
      }
    },
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
    },
    transformPageData(pageData, ctx) {}
  })
}
