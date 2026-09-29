/// Insert <PostMeta/> (date, reading time, tags) right after the title of each post

import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mts'
import type StateCore from 'markdown-it/lib/rules_core/state_core.mts'

// same ranges as the search tokenizer in config.ts
const CJK_CHAR =
  /[\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g
const LATIN_WORD = /[A-Za-z0-9]+(?:['’.-][A-Za-z0-9]+)*/g

// reading speed, per minute
const CJK_CHARS_PER_MIN = 300
const LATIN_WORDS_PER_MIN = 200
// formulas and code are read slower than prose, count each block as a fixed time
const SECONDS_PER_BLOCK = 10

/// count prose only: text and inline code, skipping urls, html, formulas and code blocks
function countWords(tokens: Token[]) {
  let cjk = 0
  let latin = 0
  let blocks = 0

  const countText = (text: string) => {
    cjk += text.match(CJK_CHAR)?.length ?? 0
    latin += text.replace(CJK_CHAR, ' ').match(LATIN_WORD)?.length ?? 0
  }

  for (const token of tokens) {
    if (token.type === 'fence' || token.type === 'code_block' || token.type === 'math_block') {
      blocks++
    } else if (token.type === 'inline') {
      for (const child of token.children ?? []) {
        if (child.type === 'text' || child.type === 'code_inline') countText(child.content)
      }
    }
  }

  const minutes =
    cjk / CJK_CHARS_PER_MIN + latin / LATIN_WORDS_PER_MIN + (blocks * SECONDS_PER_BLOCK) / 60
  return { words: cjk + latin, minutes: Math.max(1, Math.round(minutes)) }
}

export default function postMetaPlugin(md: MarkdownIt) {
  md.core.ruler.push('post_meta', (state: StateCore) => {
    if (!state.env?.relativePath?.startsWith('posts/')) return

    const { words, minutes } = countWords(state.tokens)
    const meta = new state.Token('html_block', '', 0)
    meta.content = `<PostMeta :words="${words}" :minutes="${minutes}" />\n`

    // after the first h1, or at the top if the post has no title
    const h1Open = state.tokens.findIndex((t) => t.type === 'heading_open' && t.tag === 'h1')
    const h1Close = state.tokens.findIndex((t, i) => i > h1Open && t.type === 'heading_close')
    state.tokens.splice(h1Open === -1 ? 0 : h1Close + 1, 0, meta)
  })
}
