import type MarkdownIt from 'markdown-it'

/// markdown-it parser types
import type Token from 'markdown-it/lib/token'
import Renderer from 'markdown-it/lib/renderer'

export default function (md: MarkdownIt) {
  const default_renderer = md.renderer.rules.image

  if (!default_renderer) return

  md.renderer.rules.image = (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer): string => {
    const token = tokens[idx]
    const src = token.attrGet('src')

    if (!src) {
      return default_renderer(tokens, idx, options, env, self)
    }

    const alt = token.content
    const title = token.attrGet('title')
    const title_display = title ? title : alt

    /// ![alt](src)
    /// ![alt](src "title")

    return `
        <div class="image-div" data-caption="${alt}">
            <img src="${src}" alt="${alt}" title="${title_display}"/>
            <span class="img-caption">${title_display}</span>
        </div>`
  }
}
