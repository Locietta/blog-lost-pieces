/// convert !!text!! to <Spoiler>text</Spoiler>

import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mts'
import type StateInline from 'markdown-it/lib/rules_inline/state_inline.mts'

export default function spoiler_plugin(md: MarkdownIt) {
  const spoiler_rule = (state: StateInline, silent: boolean): boolean => {
    const start = state.pos
    // Quick check for the opening delimiter
    if (state.src.slice(start, start + 2) !== '!!') {
      return false
    }

    let end = -1
    // Find the closing delimiter.  Iterate to handle escaped delimiters.
    for (let i = start + 2; i < state.src.length - 1; i++) {
      if (state.src.slice(i, i + 2) === '!!') {
        end = i
        break
      }
    }

    if (end === -1) {
      return false
    }

    if (!silent) {
      const token = state.push('spoiler', '', 0)
      token.content = state.src.slice(start + 2, end)
    }

    state.pos = end + 2
    return true
  }
  md.inline.ruler.push('spoiler', spoiler_rule)
  md.renderer.rules.shade = (tokens: Token[], idx: number) => {
    return `<Spoiler>${tokens[idx].content}</Spoiler>`
  }
}
