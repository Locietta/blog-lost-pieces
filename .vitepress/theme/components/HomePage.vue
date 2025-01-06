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

  <div class="pagination-container">
    <ClientOnly>
      <NPagination
        v-model:page="pageCurrent"
        :page-count="pagesNum"
        :page-slot="5"
        size="large"
        @update:page="onPageChange"
      ></NPagination>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { withBase } from 'vitepress'
import { ref, computed, onMounted } from 'vue'
import type { Post } from '.vitepress/env'
import { NPagination } from 'naive-ui'

const props = withDefaults(
  defineProps<{
    posts: Array<Post>
    pageSize?: number
  }>(),
  {
    pageSize: 6,
  },
)

const pagesNum = Math.ceil(props.posts.length / props.pageSize)

const pagePosts = computed(() => {
  const start = (pageCurrent.value - 1) * props.pageSize
  const end = start + props.pageSize
  return props.posts.slice(start, end)
})

const pageCurrent = ref(1)

onMounted(() => {
  const params = new URLSearchParams(location.search)
  pageCurrent.value = +(params.get('page') || 1)
})

const onPageChange = (page: number) => {
  const url = new URL(location.href)
  url.searchParams.set('page', page.toString())
  history.replaceState(null, '', url.toString()) // Update URL without adding to history

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
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

.pagination-container {
  margin-top: 0.75rem;
  display: flex;
  justify-content: center;
}

@media screen and (max-width: 720px) {
  .post-list {
    padding: 1rem 0 0 0;
  }

  .post-title {
    font-size: 1.125rem;
    font-weight: 400;
    line-clamp: 2;
    overflow: hidden;
    width: 17rem;
  }

  .describe {
    font-size: 0.9375rem;
    line-clamp: 3;
    overflow: hidden;
  }

  .date {
    font-size: 0.8125rem;
  }
}
</style>
