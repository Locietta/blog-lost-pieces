type Post = {
  frontMatter: {
    date: string
    update?: string
    title: string
    tags?: string[]
    description?: string
    disableComment?: boolean
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

type LoiaThemeConfig = {
  posts: Post[]
  pageSize: number
  website: string
  logo: string

  nav: NavItem[]
  socialLinks: SocialLink[]
}
