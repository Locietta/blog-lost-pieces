<template>
  <div class="tag-container">
    <a
      v-for="(item, key) in data"
      :key="key"
      class="post-tag"
      :class="{ active: key === selectedTag }"
      :href="tagLink(key.toString())"
    >
      {{ key }} <strong>{{ item.length }}</strong>
    </a>
  </div>
  <div
    v-if="selectedTag"
    class="header"
  >
    {{ selectedTag }}
  </div>

  <ul v-if="selectedTag">
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
import { computed, onMounted, ref } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { data as posts } from '@theme/data/posts.data'
import type { Post } from '@/theme'

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
const tagLink = (tag: string) => withBase(`/tags?tag=${encodeURIComponent(tag)}`)

// Tag links are handled by the vitepress router, which keeps `route.query` in sync
// (including back/forward). Read it only after mount so SSR and hydration match.
const route = useRoute()
const mounted = ref(false)
onMounted(() => (mounted.value = true))

const selectedTag = computed(() =>
  mounted.value ? (new URLSearchParams(route.query).get('tag') ?? '') : '',
)
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
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.post-tag:hover,
.post-tag.active {
  color: var(--tag-hover);
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
  white-space: nowrap;
  width: 6rem;
}

@media screen and (max-width: 700px) {
  .header {
    font-size: 1.5rem;
  }
}
</style>
