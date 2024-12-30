'use strict'

import type { KatexOptions } from 'katex'
import type MarkdownIt from 'markdown-it'
import katex from 'katex'

/// markdown-it parser types
import type { Token, StateInline, StateBlock } from 'markdown-it'

// Test if potential opening or closing delimiter
// Assumes that there is a "$" at state.src[pos]
function isValidDelim(state: StateInline, pos: number) {
  const max = state.posMax
  const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1
  const nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1

  const isPrevWhitespace = prevChar === 0x20 || prevChar === 0x09
  const isNextWhitespace = nextChar === 0x20 || nextChar === 0x09
  const isNextDigit = nextChar >= 0x30 && nextChar <= 0x39

  const can_close = !isPrevWhitespace && !isNextDigit
  const can_open = !isNextWhitespace

  return { can_open, can_close }
}

function math_inline(state: StateInline, silent: boolean) {
  const pos = state.pos
  if (state.src[pos] !== '$') {
    return false
  }

  const res = isValidDelim(state, pos)
  if (!res.can_open) {
    if (!silent) {
      state.pending += '$'
    }
    state.pos += 1
    return true
  }

  const start = pos + 1
  let match = start

  // Find the next potential closing delimiter
  while ((match = state.src.indexOf('$', match)) !== -1) {
    let escapePos = match - 1
    while (state.src[escapePos] === '\\') {
      escapePos -= 1
    }

    // Even number of escapes, potential closing delimiter found
    if ((match - escapePos) % 2 === 1) {
      break
    }
    match += 1
  }

  // No closing delimter found.  Consume $ and continue.
  if (match === -1) {
    if (!silent) {
      state.pending += '$'
    }
    state.pos = start
    return true
  }

  // Check if we have empty content, ie: $$.  Do not parse.
  if (match - start === 0) {
    if (!silent) {
      state.pending += '$$'
    }
    state.pos = start + 1
    return true
  }

  // Check for valid closing delimiter
  const closeRes = isValidDelim(state, match)
  if (!closeRes.can_close) {
    if (!silent) {
      state.pending += '$'
    }
    state.pos = start
    return true
  }

  if (!silent) {
    const token = state.push('math_inline', 'math', 0)
    token.markup = '$'
    token.content = state.src.slice(start, match)
  }

  state.pos = match + 1
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
  token.content = (firstLine && firstLine + '\n') + state.getLines(start + 1, next, state.tShift[start], true) + lastLine
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
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  })
  md.renderer.rules.math_inline = inlineRenderer
  md.renderer.rules.math_block = blockRenderer
}
