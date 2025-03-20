/**
 * Fork and edited from https://github.com/mdit-plugins/mdit-plugins/blob/main/packages/img-size/src/plugin.ts
 */

import type { PluginSimple } from 'markdown-it'
import type { RuleInline } from 'markdown-it/lib/parser_inline.mjs'
import type Token from 'markdown-it/lib/token.mjs'

export interface MarkdownReference {
  href: string
  title?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ImgSizeEnv extends Record<any, any> {
  references?: Record<string, MarkdownReference>
}

//
// Parse image size
//
const parseNumber = (
  str: string,
  pos: number,
  max: number,
): { ok: boolean; pos: number; value: string } => {
  let char: string
  const start = pos
  const result = {
    ok: false,
    pos: pos,
    value: '',
  }

  char = str.charAt(pos)

  while ((pos < max && /\d/.test(char)) || char === '%') char = str.charAt(++pos)

  result.ok = true
  result.pos = pos
  result.value = str.slice(start, pos)

  return result
}

const parseImageSize = (
  str: string,
  pos: number,
  max: number,
): { ok: boolean; pos: number; percent: string } => {
  const result = {
    ok: false,
    pos: 0,
    percent: '',
  }

  if (pos >= max) return result

  if (str.charAt(pos) !== '=') return result

  pos++

  // size must follow = without any white spaces
  // =50% or =50 (will add % automatically)
  const char = str.charAt(pos)

  if (!/\d/.test(char)) return result

  // parse percent
  const percentResult = parseNumber(str, pos, max)

  if (!percentResult.ok) return result

  pos = percentResult.pos

  // Add % if not present
  let percent = percentResult.value
  if (!percent.endsWith('%')) {
    percent += '%'
  }

  result.percent = percent
  result.pos = pos
  result.ok = true

  return result
}

const imgSizeRule: RuleInline = (state, silent) => {
  const env = state.env as ImgSizeEnv
  const oldPos = state.pos
  const max = state.posMax

  if (state.src.charAt(state.pos) !== '!' || state.src.charAt(state.pos + 1) !== '[') return false

  const labelStart = state.pos + 2
  const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false)

  // parser failed to find ']', so it's not a valid link
  if (labelEnd < 0) return false

  let pos = labelEnd + 1
  let char: string

  let href = ''
  let title = ''
  let percent = ''

  if (pos < max && state.src.charAt(pos) === '(') {
    //
    // Inline link
    //

    // [link](  <href>  "title"  )
    //        ^^ skipping these spaces
    pos++

    while (pos < max) {
      char = state.src.charAt(pos)
      if (char !== ' ' && char !== '\t') break
      pos++
    }

    if (pos >= max) return false

    // [link](  <href>  "title"  )
    //          ^^^^^^ parsing link destination
    let res

    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax)

    if (res.ok) {
      href = state.md.normalizeLink(res.str)

      if (state.md.validateLink(href)) pos = res.pos
      else href = ''
    }

    // [link](  <href>  "title"  )
    //                ^^ skipping these spaces
    const start = pos

    for (; pos < max; pos++) {
      char = state.src.charAt(pos)
      if (char !== ' ' && char !== '\t') break
    }

    // [link](  <href>  "title"  )
    //                  ^^^^^^^ parsing link title
    res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax)

    if (pos < max && start !== pos && res.ok) {
      title = res.str
      pos = res.pos

      // [link](  <href>  "title"  )
      //                         ^^ skipping these spaces
      for (; pos < max; pos++) {
        char = state.src.charAt(pos)
        if (char !== ' ' && char !== '\t') break
      }
    } else {
      title = ''
    }

    // [link](  <href>  "title" =percent%  )
    //                          ^^^^ parsing image size
    if (pos - 1 >= 0) {
      char = state.src.charAt(pos - 1)

      // there must be at least one white spaces
      // between previous field and the size
      if (char === ' ') {
        res = parseImageSize(state.src, pos, state.posMax)
        if (res.ok) {
          percent = res.percent
          pos = res.pos

          // [link](  <href>  "title" =percent%  )
          //                                   ^^ skipping these spaces
          for (; pos < max; pos++) {
            char = state.src.charAt(pos)
            if (char !== ' ' && char !== '\n') break
          }
        }
      }
    }

    if (pos >= max || state.src.charAt(pos) !== ')') {
      state.pos = oldPos

      return false
    }
    pos++
  } else {
    let label = ''

    //
    // Link reference
    //
    if (typeof env.references === 'undefined') return false

    // [foo]  [bar]
    //      ^^ optional whitespace (can include newlines)
    for (; pos < max; pos++) {
      char = state.src.charAt(pos)
      if (char !== ' ' && char !== '\t') break
    }

    if (pos < max && state.src.charAt(pos) === '[') {
      const start = pos + 1

      pos = state.md.helpers.parseLinkLabel(state, pos)

      if (pos >= 0) label = state.src.slice(start, pos++)
      else pos = labelEnd + 1
    } else {
      pos = labelEnd + 1
    }

    // covers label === '' and label === undefined
    // (collapsed reference link and shortcut reference link respectively)
    if (!label) label = state.src.slice(labelStart, labelEnd)

    const ref = env.references[state.md.utils.normalizeReference(label)]

    if (!ref) {
      state.pos = oldPos

      return false
    }

    href = ref.href
    title = ref.title ?? ''
  }

  //
  // We found the end of the link, and know for a fact it's a valid link;
  // so all that's left to do is to call tokenizer.
  //
  if (!silent) {
    state.pos = labelStart
    state.posMax = labelEnd

    const content = state.src.slice(labelStart, labelEnd)
    const tokens: Token[] = []

    state.md.inline.parse(content, state.md, state.env, tokens)

    const token = state.push('image', 'img', 0)

    token.attrs = [
      ['src', href],
      ['alt', ''],
    ] as [string, string][]
    if (title) token.attrs.push(['title', title])
    if (percent) {
      token.attrs.push(['style', `width:${percent};`])
      token.attrs.push(['height', 'auto'])
    }

    token.children = tokens
    token.content = content
  }

  state.pos = pos
  state.posMax = max

  return true
}

const imgSize: PluginSimple = (md) => {
  md.inline.ruler.before('emphasis', 'image', imgSizeRule)
}

export default imgSize
