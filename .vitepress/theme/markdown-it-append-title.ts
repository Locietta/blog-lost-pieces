///  Append title in frontmatter to markdown content before markdown-it parsing

import type MarkdownIt from 'markdown-it'
import matter from 'gray-matter'

export default function appendTitlePlugin(md: MarkdownIt) {
  const old_render = md.render
  md.render = (src, env) => {
    const { data, content } = matter(src)
    if (data.not_append_title) return old_render(src, env)

    if (data.title) {
      src = `# ${data.title}\n\n${content}`
    }
    return old_render(src, env)
  }
}
