import { createContentLoader } from 'vitepress'
import path from 'path'

export declare const data: string[]

export default createContentLoader('weekly/*.md', {
  transform(raw): string[] {
    return raw.map(({ url }) => {
      return path.basename(url).replace('.md', '')
    })
  },
})
