///  Append title in frontmatter to markdown content before markdown-it parsing

import type MarkdownIt from 'markdown-it'
import matter from 'gray-matter'

export default function appendTitlePlugin(md: MarkdownIt) {
  const old_render = md.render
  md.render = (src, env) => {
    const { data, content } = matter(src)
    if (!data.not_append_title && data.title) {
      // Reconstruct the frontmatter and append the title to content
      const newSrc = matter.stringify(`# ${data.title}\n\n${content}`, data)
      return old_render(newSrc, env)
    }
    return old_render(src, env)
  }
}
