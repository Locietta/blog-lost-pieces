<template>
  <PageHeader
    title="归档"
    :subtitle="`共 ${posts.length} 篇文章`"
  />
  <section
    v-for="yearGroup in data"
    :key="yearGroup.year"
    class="year-group"
  >
    <h2 class="year">
      {{ yearGroup.year }}
      <span class="year-count">{{ yearGroup.posts.length }}</span>
    </h2>
    <PostRows
      :posts="yearGroup.posts"
      date-format="month-day"
    />
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { data as posts } from '@theme/data/posts.data.ts'
import PageHeader from '@components/PageHeader.vue'
import PostRows from '@components/PostRows.vue'
import type { Post } from '@/theme'

type YearGroup = {
  year: string
  posts: Post[]
}

function groupByYear(posts: Post[]) {
  const data: YearGroup[] = []
  let currentGroup: YearGroup | undefined = undefined

  posts.forEach((post) => {
    const date = post.frontMatter.date
    if (!date) return

    const year = date.split('-')[0] ?? ''
    if (year !== currentGroup?.year) {
      currentGroup = { year, posts: [] }
      data.push(currentGroup)
    }

    currentGroup.posts.push(post)
  })

  return data
}
const data = computed(() => groupByYear(posts))
</script>

<style scoped>
.year-group {
  margin-top: 1.5rem;
}

.year {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 2rem;
  letter-spacing: -0.01em;
}

.year-count {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
