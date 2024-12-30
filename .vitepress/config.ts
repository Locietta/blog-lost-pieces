import { type DefaultTheme, defineConfigWithTheme } from 'vitepress'
import mk from './theme/markdown-it-katex'
import img_fig from './theme/markdown-it-img-figure'
import append_title from './theme/markdown-it-append-title'
import { wordless, chineseAndJapanese, type Options } from 'markdown-it-wordless'
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
      },
      miniSearch: {
        // Ref: https://github.com/lucaong/minisearch/issues/201
        //      The solution there doesn't quite make sense though, I tweaked it a bit.
        options: {
          tokenize: (text) => {
            text = text.toLowerCase()
            // TODO: better CJK tokenizer
            // NOTE: How to inject dependency (n-gram etc.) into here? `tokenize` will ignore top-level import somehow,
            // and it can't be made async which means we can't dynamic import.
            const segmenter = Intl.Segmenter && new Intl.Segmenter('zh', { granularity: 'word' })
            if (!segmenter) return [text] // firefox?
            return Array.from(segmenter.segment(text), ({ segment }) => segment)
          }
        },
        searchOptions: {
          combineWith: 'AND',
          // don't split search word, user searching "泛函" shouldn't get "广泛" or "函数"
          // XXX: This is a hack, we should probably use a better CJK tokenizer
          tokenize: (text) => [text.toLowerCase()],
          fuzzy(term) {
            // disable fuzzy search if the term contains a CJK character
            // so searching "函数式" will not contain results only matching "函数"
            const CJK_RANGE =
              '\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff'
            const CJK_WORD = new RegExp(`[${CJK_RANGE}]`)
            if (CJK_WORD.test(term)) return false
            return true
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
    lang: 'zh-CN',
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
    }
  })
}
