<template>
  <article
    v-for="article in pagePosts"
    :key="article.regularPath"
    class="post-item"
  >
    <div class="post-header">
      <h2 class="post-title">
        <a :href="withBase(article.regularPath)">{{ article.frontMatter.title }}</a>
      </h2>
      <time
        class="post-date"
        :datetime="article.frontMatter.date"
        >{{ article.frontMatter.date }}</time
      >
    </div>
    <p
      v-if="article.frontMatter.description"
      class="post-desc"
    >
      {{ article.frontMatter.description }}
    </p>
    <div
      v-if="article.frontMatter.tags?.length"
      class="post-tags"
    >
      <a
        v-for="tag in article.frontMatter.tags"
        :key="tag"
        class="tag-chip"
        :href="withBase(`/tags?tag=${encodeURIComponent(tag)}`)"
        >{{ tag }}</a
      >
    </div>
  </article>
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
/* the whole item is clickable: the title link is stretched over it */
.post-item {
  position: relative;
  margin: 0 -0.75rem;
  padding: 0.875rem 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background-color 0.2s;
}

.post-item:first-child {
  margin-top: 0.25rem;
}

.post-item:hover {
  background-color: var(--vp-c-bg-soft);
}

.post-item:has(.post-title a:focus-visible) {
  outline: 2px solid var(--vp-c-brand-1);
}

.post-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.post-title {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.625rem;
  letter-spacing: -0.01em;
}

.post-title a {
  color: var(--vp-c-brand-1);
  font-weight: inherit;
  text-decoration: none;
  transition: color 0.2s;
}

.post-title a::after {
  content: '';
  position: absolute;
  inset: 0;
}

.post-title a:focus-visible {
  outline: none;
}

.post-item:hover .post-title a {
  color: var(--vp-c-brand-2);
}

.post-date {
  flex-shrink: 0;
  color: var(--date-color);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
}

.post-desc {
  margin: 0.375rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.9375rem;
  line-height: 1.5rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.625rem;
}

/* keep tags clickable above the stretched title link */
.post-tags .tag-chip {
  position: relative;
  z-index: 1;
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
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font-weight: 500;
  text-decoration: none;
  transition:
    color 0.2s,
    border-color 0.2s,
    background-color 0.2s;
}

.pager-link:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.pager-link.active {
  color: var(--vp-c-brand-1);
  border-color: transparent;
  background-color: var(--vp-c-brand-soft);
}

@media screen and (max-width: 720px) {
  .post-title {
    font-size: 1.0625rem;
    line-height: 1.5rem;
  }

  .post-desc {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
  }
}
</style>
