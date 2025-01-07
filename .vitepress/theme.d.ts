import { type DefaultTheme } from 'vitepress'

declare namespace LoiaTheme {
  type Post = {
    frontMatter: {
      date: string
      lastUpdated?: boolean
      title: string
      not_append_title?: boolean
      tags?: string[]
      description?: string
      comment?: boolean
    }
    regularPath: string
  }

  type GiscusConfig = {
    repo: `${string}/${string}`
    repoId: string
    category: string
    categoryId: string
  }

  type Config = DefaultTheme.Config & {
    website: string
    pageSize?: number
    comment?: boolean
    giscusConfig: GiscusConfig
  }
}

export = LoiaTheme
export as namespace LoiaTheme
