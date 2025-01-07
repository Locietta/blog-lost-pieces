<template>
  <div class="tag-container">
    <span
      v-for="(item, key) in data"
      :key="key"
      class="post-tag"
      @click="toggleTag(key.toString())"
    >
      {{ key }} <strong>{{ data[key].length }}</strong>
    </span>
  </div>
  <div class="header">{{ selectedTag }}</div>

  <ul>
    <li
      v-for="(article, index) in data[selectedTag]"
      :key="index"
    >
      <div class="article">
        <a :href="withBase(article.regularPath)">{{ article.frontMatter.title }}</a>
        <div class="date">{{ article.frontMatter.date.slice(0, 7) }}</div>
      </div>
    </li>
  </ul>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../data/posts.data'
import type { Post } from '.vitepress/theme'

const data = computed(() => {
  /// build tag -> posts map
  const collectedTagPost: Record<string, Post[]> = {}

  posts.forEach((post) => {
    post.frontMatter.tags?.forEach((tag) => {
      collectedTagPost[tag] ??= []
      collectedTagPost[tag].push(post)
    })
  })

  // Sort by the number of posts in descending order and convert back to an object
  return Object.fromEntries(
    Object.entries(collectedTagPost).sort((a, b) => b[1].length - a[1].length),
  )
})
const url = location.href.split('?')[1]
const params = new URLSearchParams(url)
const tagName = params.get('tag')

const selectedTag = ref(tagName ? tagName : '')

const toggleTag = (tag: string) => {
  selectedTag.value = tag
}
</script>
<style scoped>
.tag-container {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
}

.post-tag {
  padding: 4px 16px;
  margin: 6px 8px;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 25px;
}

.post-tag strong {
  padding-left: 0.125rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--tag-count);
}

.header {
  font-size: 2rem;
  font-weight: 600;
  margin: 1rem 0;
  text-align: center;
}

a:hover {
  text-decoration: none;
}

.article .date {
  width: 6rem;
}

@media screen and (max-width: 700px) {
  .header {
    font-size: 1.5rem;
  }
}
</style>
