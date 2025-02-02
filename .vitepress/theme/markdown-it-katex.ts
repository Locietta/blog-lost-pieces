'use strict'

import type MarkdownIt from 'markdown-it'
import katex, { type KatexOptions } from 'katex'

/// markdown-it parser types
import type Token from 'markdown-it/lib/token.mts'
import type StateInline from 'markdown-it/lib/rules_inline/state_inline.mts'
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mts'

function math_inline(state: StateInline, silent: boolean) {
  const src = state.src
  const pos = state.pos

  // Check for the opening '$'
  if (src[pos] !== '$') {
    return false
  }

  // Check if the next character is not whitespace
  const max = state.posMax
  const nextChar = pos + 1 <= max ? src.charCodeAt(pos + 1) : -1
  const isNextWhitespace = nextChar === 0x20 || nextChar === 0x09 // 0x20: space, 0x09: tab

  if (isNextWhitespace) {
    if (!silent) {
      state.pending += '$'
    }
    state.pos += 1
    return true
  }

  const isNextBacktick = nextChar === 0x60 // 0x60: backtick (`)
  const isGithubSyntax = isNextBacktick
  const delimiterLength = isNextBacktick ? 2 : 1
  const openDelimiter = isNextBacktick ? '$`' : '$'

  const start = pos + delimiterLength
  let endPos = start
  let escapeCount = 0

  // Find the next closing '$' that is not escaped
  while (endPos < src.length) {
    if (src[endPos] === '\\') {
      escapeCount++
    } else if (escapeCount % 2 === 0) {
      if (!isGithubSyntax && src[endPos] === '$') break
      if (
        isGithubSyntax &&
        endPos + 1 < src.length &&
        src[endPos] === '`' &&
        src[endPos + 1] === '$'
      ) {
        endPos++
        break
      }
    } else {
      escapeCount = 0
    }
    endPos++
  }

  // No closing delimiter found
  if (endPos >= src.length) {
    if (!silent) {
      state.pending += openDelimiter
    }
    state.pos = start
    return true
  }

  // Check if the previous character is not whitespace and the next character is not a digit
  const prevChar = endPos > 0 ? src.charCodeAt(endPos - 1) : -1
  const nextCharAfterEnd = endPos + 1 <= max ? src.charCodeAt(endPos + 1) : -1
  const isPrevWhitespace = prevChar === 0x20 || prevChar === 0x09 // 0x20: space, 0x09: tab
  const isNextDigit = nextCharAfterEnd >= 0x30 && nextCharAfterEnd <= 0x39 // 0x30: '0', 0x39: '9'
  if (isPrevWhitespace || isNextDigit) {
    if (!silent) {
      state.pending += openDelimiter
    }
    state.pos = start
    return true
  }

  if (!silent) {
    const token = state.push('math_inline', 'math', 0)
    token.markup = openDelimiter
    token.content = src.slice(start, isGithubSyntax ? endPos - 1 : endPos)
  }

  state.pos = endPos + 1
  return true
}

function math_block(state: StateBlock, start: number, end: number, silent: boolean): boolean {
  const startPos = state.bMarks[start] + state.tShift[start]
  const maxPos = state.eMarks[start]

  // Ensure the line is long enough and starts with "$$"
  if (startPos + 2 > maxPos || state.src.slice(startPos, startPos + 2) !== '$$') {
    return false
  }

  // Move past "$$"
  const pos = startPos + 2
  let firstLine = state.src.slice(pos, maxPos).trim()

  // If in silent mode, return early
  if (silent) {
    return true
  }

  // Check for single-line math block
  let found = firstLine.endsWith('$$')
  let lastLine = ''
  if (found) {
    firstLine = firstLine.slice(0, -2).trim() // Remove trailing "$$"
  }
  let next = start
  while (!found && ++next < end) {
    const pos = state.bMarks[next] + state.tShift[next]
    const max = state.eMarks[next]

    // Stop if the line has negative indent or is out of block scope
    if (pos < max && state.tShift[next] < state.blkIndent) {
      break
    }

    const line = state.src.slice(pos, max).trim()
    if (line.endsWith('$$')) {
      // Found closing "$$"
      lastLine = line.slice(0, -2).trim()
      found = true
    }
  }

  // Update the current line position
  state.line = next + 1

  // Create the token for the math block
  const token = state.push('math_block', 'math', 0)
  token.block = true
  token.content =
    (firstLine && firstLine + '\n') +
    state.getLines(start + 1, next, state.tShift[start], true) +
    lastLine
  token.map = [start, state.line]
  token.markup = '$$'

  return true
}

export default function math_plugin(md: MarkdownIt, options: KatexOptions = {}) {
  options = { throwOnError: false, ...options }

  // set KaTeX as the renderer for markdown-it-simplemath
  const katexInline = function (latex: string) {
    options.displayMode = false
    return katex.renderToString(latex, options)
  }

  const inlineRenderer = function (tokens: Token[], idx: number) {
    return katexInline(tokens[idx].content)
  }

  const katexBlock = function (latex: string) {
    options.displayMode = true
    return '<p>' + katex.renderToString(latex, options) + '</p>'
  }

  const blockRenderer = function (tokens: Token[], idx: number) {
    return katexBlock(tokens[idx].content) + '\n'
  }

  md.inline.ruler.after('escape', 'math_inline', math_inline)
  md.block.ruler.after('blockquote', 'math_block', math_block, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  })
  md.renderer.rules.math_inline = inlineRenderer
  md.renderer.rules.math_block = blockRenderer
}
