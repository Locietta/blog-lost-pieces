declare interface Window {
  twttr: any
}

import { DefaultTheme } from "vitepress"

declare namespace LoiaTheme {
  type Post = {
    frontMatter: {
      date: string
      lastUpdated?: boolean
      title: string
      tags?: string[]
      description?: string
      comment?: boolean
    }
    regularPath: string
  }

  type Config = DefaultTheme.Config & {
    website: string
    posts: Post[]
    pageSize: number
    comment?: boolean
    giscusConfig: {
      repo: string
      repoId: string
      category: string
      categoryId: string
    }
  }

}

export = LoiaTheme
export as namespace LoiaTheme
