<template>
  <div
    v-for="(article, index) in pagePosts"
    :key="index"
    class="post-list"
  >
    <div class="post-header">
      <div class="post-title">
        <a :href="withBase(article.regularPath)"> {{ article.frontMatter.title }}</a>
      </div>
      <time class="date">
        {{ article.frontMatter.date }}
      </time>
    </div>
    <p class="describe">{{ article.frontMatter.description }}</p>
    <div>
      <span
        v-for="item in article.frontMatter.tags"
        :key="item"
        class="post-tag"
        ><a :href="withBase(`/tags?tag=${encodeURIComponent(item)}`)"> {{ item }}</a></span
      >
    </div>
  </div>

  <nav
    v-if="pagesNum > 1"
    class="pagination"
    aria-label="Pagination"
  >
    <a
      v-if="page > 1"
      class="pager-link"
      :href="pageLink(page - 1)"
      aria-label="Previous page"
      >‹</a
    >
    <template
      v-for="n in pagesNum"
      :key="n"
    >
      <span
        v-if="n === page"
        class="pager-link active"
        aria-current="page"
        >{{ n }}</span
      >
      <a
        v-else
        class="pager-link"
        :href="pageLink(n)"
        >{{ n }}</a
      >
    </template>
    <a
      v-if="page < pagesNum"
      class="pager-link"
      :href="pageLink(page + 1)"
      aria-label="Next page"
      >›</a
    >
  </nav>
</template>

<script lang="ts" setup>
import { useRouter, withBase } from 'vitepress'
import { computed, onMounted } from 'vue'
import type { Post } from '@/theme'

const props = withDefaults(
  defineProps<{
    posts: Array<Post>
    pageSize?: number
    page?: number
  }>(),
  {
    pageSize: 6,
    page: 1,
  },
)

const pagesNum = computed(() => Math.ceil(props.posts.length / props.pageSize))

const pagePosts = computed(() => {
  const start = (props.page - 1) * props.pageSize
  const end = start + props.pageSize
  return props.posts.slice(start, end)
})

const pageLink = (n: number) => withBase(n === 1 ? '/' : `/page/${n}`)

// redirect legacy `/?page=n` links to the static page routes
const router = useRouter()
onMounted(() => {
  const legacyPage = Number(new URLSearchParams(location.search).get('page'))
  if (props.page === 1 && legacyPage > 1 && legacyPage <= pagesNum.value) {
    router.go(pageLink(legacyPage), { replace: true })
  }
})
</script>

<style scoped>
.post-list {
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 1rem 0 0.25rem 0;
}

.post-header {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
}

.post-tag {
  padding: 0rem 0.75rem;
  margin: 0.25rem 0.5rem 0.75rem 0;
  a {
    font-size: x-small;
  }
}

.post-title a {
  font-size: 1.0625rem;
  font-weight: 600;
  margin: 0.1rem 0;
}

.describe {
  font-size: 0.9375rem;
  overflow: hidden;
  color: var(--vp-c-text-3);
  margin: 0.625rem 0 0.375rem;
  line-height: 1.5rem;
}

.link {
  display: inline-block;
  width: 28px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  border: 1px var(--vp-c-divider-light) solid;
  border-right: none;
}

.pagination {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.pager-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  font-weight: 500;
  text-decoration: none;
  transition:
    color 0.2s,
    border-color 0.2s;
}

.pager-link:hover,
.pager-link.active {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.date {
  white-space: nowrap;
  font-size: 0.8125rem;
}

@media screen and (max-width: 720px) {
  .post-list {
    padding: 1rem 0 0 0;
  }

  .post-header {
    gap: 0.75rem;
  }

  .post-title {
    flex: 1;
    min-width: 0;
    font-size: 1.125rem;
    font-weight: 400;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }

  .describe {
    font-size: 0.9375rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
  }
}
</style>
