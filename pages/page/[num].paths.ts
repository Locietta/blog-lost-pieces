import { listedPostCount, pageSize } from '../../.vitepress/posts.ts'

/// page 1 lives at `/`, this generates `/page/2` onwards
export default {
  paths() {
    const pagesNum = Math.ceil(listedPostCount() / pageSize)
    return Array.from({ length: Math.max(pagesNum - 1, 0) }, (_, i) => ({
      params: { num: `${i + 2}` },
    }))
  },
}
