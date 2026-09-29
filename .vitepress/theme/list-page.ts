/// Remember the last visited post list page, so posts can link back to it

import { readonly, ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'

// home (incl. `/page/n`), archives and tags
const LIST_PAGE = /^\/(page\/\d+|archives|tags)?$/

const lastListPage = ref(withBase('/'))

/// call once from the layout, which stays mounted across navigations
export function trackListPage() {
  const route = useRoute()
  watch(
    () => route.path + route.query,
    () => {
      if (LIST_PAGE.test(route.path.slice(withBase('/').length - 1))) {
        lastListPage.value = route.path + route.query
      }
    },
    { immediate: true },
  )
}

export function useLastListPage() {
  return readonly(lastListPage)
}
