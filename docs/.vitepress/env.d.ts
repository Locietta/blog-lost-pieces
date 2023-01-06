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