/// TS fork of https://github.com/Antonio-Laguna/markdown-it-image-figures
import type MarkdownIt from 'markdown-it'

/// markdown-it parser types
import type Token from 'markdown-it/lib/token.mts'
import type StateCore from 'markdown-it/lib/rules_core/state_core.mts'

export type FigureOption = {
  dataType: boolean

  // set true to use the title text in <figcaption> block after image,
  // if title doesn't exist, fallback to use the alt text.
  // set "title" to use only the title text
  // set "alt" to use only the alt text
  // E.g.: ![This is an alt](fig.png "This is a title")
  figcaption: boolean | 'title' | 'alt'

  tabindex: boolean
  link: boolean
  copyAttrs: boolean | string | RegExp
  lazy: boolean
  removeSrc: boolean
  classes: string
  async: boolean
}

function removeAttributeFromList(attrs: [string, string][], attribute: string) {
  const arr = Array.isArray(attrs) ? attrs : []

  return arr.filter(([k]) => k !== attribute)
}

// pre-confition: image.attrs!
function removeAttributeFromImage(image: Token, attribute: string) {
  if (image) {
    image.attrs = removeAttributeFromList(image.attrs!, attribute)
  }
}

/// Caption tokens for the image, built without parsing markdown again: a nested
/// md.parseInline() would re-run every core rule, including other plugins'.
/// - title: plain text (as in CommonMark), removed from the image
/// - alt: markdown-it already parsed it inline into the image's children
function findCaption(
  state: StateCore,
  captionType: FigureOption['figcaption'],
  image: Token,
  linked: boolean,
): Token[] {
  if (captionType !== 'alt') {
    const title = image.attrGet('title')
    if (title) {
      removeAttributeFromImage(image, 'title')
      const text = new state.Token('text', '', 0)
      text.content = title
      return [text]
    }
    if (captionType === 'title') return []
  }

  const children = image.children ?? []
  // the image renders its alt from these; move them to the caption, so screen readers
  // don't read the same text twice. A linked image keeps them as the link's name.
  if (!linked) image.children = []
  return children
}

export default function imageFiguresPlugin(md: MarkdownIt, options: FigureOption) {
  options = options || {}

  function imageFigures(state: StateCore) {
    // reset tabIndex on md.render()
    let tabIndex = 1

    // do not process first and last token
    for (let i = 1, l = state.tokens.length; i < l - 1; ++i) {
      // the loop bounds guarantee the previous and next tokens exist
      const prev = state.tokens[i - 1]!
      const token = state.tokens[i]!
      const next = state.tokens[i + 1]!

      if (token.type !== 'inline') {
        continue
      }
      // children: image alone, or link_open -> image -> link_close
      if (!token.children || (token.children.length !== 1 && token.children.length !== 3)) {
        continue
      }
      // one child, should be img
      if (token.children.length === 1 && token.children[0]!.type !== 'image') {
        continue
      }
      // three children, should be image enclosed in link
      if (token.children.length === 3) {
        const [childA, childB, childC] = token.children as [Token, Token, Token]
        const isEnclosed =
          childA.type !== 'link_open' || childB.type !== 'image' || childC.type !== 'link_close'

        if (isEnclosed) {
          continue
        }
      }
      // prev token is paragraph open
      if (prev.type !== 'paragraph_open') {
        continue
      }
      // next token is paragraph close
      if (next.type !== 'paragraph_close') {
        continue
      }

      // We have inline token containing an image only.
      // Previous token is paragraph open.
      // Next token is paragraph close.
      // Lets replace the paragraph tokens with figure tokens.
      const figure = prev
      figure.type = 'figure_open'
      figure.tag = 'figure'
      next.type = 'figure_close'
      next.tag = 'figure'

      if (options.dataType) {
        figure.attrPush(['data-type', 'image'])
      }
      let image: Token

      if (options.link && token.children.length === 1) {
        image = token.children[0]!
        const link = new state.Token('link_open', 'a', 1)
        link.attrPush(['href', image.attrGet('src')!])

        token.children.unshift(link)
        token.children.push(new state.Token('link_close', 'a', -1))
      }

      // for linked images, image is one off
      image = token.children[token.children.length === 1 ? 0 : 1]!

      // image.attrs must present
      if (!image.attrs) continue

      if (options.figcaption) {
        const linked = token.children[0]?.type === 'link_open'
        const caption = findCaption(state, options.figcaption, image, linked)

        if (caption.length > 0) {
          token.children.push(
            new state.Token('figcaption_open', 'figcaption', 1),
            ...caption,
            new state.Token('figcaption_close', 'figcaption', -1),
          )
          removeAttributeFromImage(image, 'title')
        }
      }

      if (options.copyAttrs) {
        const f = options.copyAttrs === true ? '' : options.copyAttrs
        // Copying so any further changes aren't duplicated
        figure.attrs = image.attrs.filter(([k]) => k.match(f)).slice(0)
      }

      if (options.tabindex) {
        // add a tabindex property
        // you could use this with css-tricks.com/expanding-images-html5
        figure.attrPush(['tabindex', tabIndex.toString()])
        tabIndex++
      }

      if (options.lazy) {
        const hasLoading = image.attrs.some(([attribute]) => attribute === 'loading')

        if (!hasLoading) {
          image.attrs.push(['loading', 'lazy'])
        }
      }

      if (options.async) {
        const hasDecoding = image.attrs.some(([attribute]) => attribute === 'decoding')

        if (!hasDecoding) {
          image.attrs.push(['decoding', 'async'])
        }
      }

      if (options.classes && typeof options.classes === 'string') {
        const classAttr = image.attrs.find(([k]) => k === 'class')

        if (classAttr) {
          classAttr[1] = `${classAttr[1]} ${options.classes}`
        } else {
          image.attrs.push(['class', options.classes])
        }
      }

      if (options.removeSrc) {
        const src = image.attrs.find(([k]) => k === 'src')!
        image.attrs.push(['data-src', src[1]])
        removeAttributeFromImage(image, 'src')
      }
    }
  }

  md.core.ruler.before('linkify', 'image_figures', imageFigures)
}
