<template>
  <div
    v-for="yearGroup in data"
    :key="yearGroup.year"
  >
    <div class="year">
      {{ yearGroup.year }}
    </div>
    <ul>
      <li
        v-for="(article, index) in yearGroup.posts"
        :key="index"
      >
        <div class="article">
          <a :href="withBase(article.regularPath)">{{ article.frontMatter.title }}</a>
          <div class="date">{{ article.frontMatter.date.slice(5) }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { withBase } from 'vitepress'
import { computed } from 'vue'
import { data as posts } from '@theme/data/posts.data.ts'
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
.year {
  padding: 16px 0 0 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.vp-doc a:hover {
  text-decoration: none;
}

.article .date {
  width: 4rem;
}
</style>
