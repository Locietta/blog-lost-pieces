declare interface Window {
  twttr: any
}

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

type NavItem = NavItemWithLink | NavItemWithChildren

type NavItemWithLink = {
  text: string
  link: string
  activeMatch?: string
}

interface NavItemWithChildren {
  text?: string
  items: NavItemWithLink[]
  activeMatch?: string
}

interface SocialLink {
  icon: SocialLinkIcon
  link: string
}

type SocialLinkIcon =
  | 'discord'
  | 'facebook'
  | 'github'
  | 'instagram'
  | 'linkedin'
  | 'mastodon'
  | 'slack'
  | 'twitter'
  | 'youtube'
  | { svg: string }

interface Outline {
  /**
   * The levels of headings to be displayed in the outline.
   * Single number means only headings of that level will be displayed.
   * If a tuple is passed, the first number is the minimum level and the second number is the maximum level.
   * `'deep'` is same as `[2, 6]`, which means all headings from `<h2>` to `<h6>` will be displayed.
   *
   * @default 2
   */
  level?: number | [number, number] | 'deep'

  /**
   * The title to be displayed on the outline.
   *
   * @default 'On this page'
   */
  label?: string
}

type LoiaThemeConfig = {
  posts: Post[]
  pageSize: number
  website: string
  logo: string
  comment?: boolean
  giscusConfig: {
    repo: string
    repoId: string
    category: string
    categoryId: string
  }

  nav: NavItem[]
  socialLinks: SocialLink[]
  outline: Outline | Outline['level'] | false
}
