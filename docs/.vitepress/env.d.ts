declare module '@neilsustc/markdown-it-katex' {
  import type { KatexOptions } from 'katex'
  import type { MarkdownIt } from 'markdown-it'
  export default function (md: MarkdownIt, options: KatexOptions): void
}
