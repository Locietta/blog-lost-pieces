<template>
  <div
    v-for="yearList in data"
    :key="yearList[0].frontMatter.date"
  >
    <div class="year">
      {{ yearList[0].frontMatter.date.split('-')[0] }}
    </div>
    <ul>
      <li
        v-for="(article, index) in yearList"
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
import { data as posts } from '../data/posts.data'
import type { Post } from '.vitepress/theme'

function groupByYear(posts: Post[]) {
  const data: Array<Post[]> = []
  let currentYear: string | null = null

  posts.forEach((post) => {
    if (post.frontMatter.date) {
      const year = post.frontMatter.date.split('-')[0]
      if (year !== currentYear) {
        currentYear = year
        data.push([]) // Start a new group for the new year
      }
      data[data.length - 1].push(post) // Add the post to the current year's group
    }
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
