<template>
  <PageHeader
    title="Tags"
    :subtitle="`${Object.keys(data).length} tags`"
  />
  <div class="tag-container">
    <a
      v-for="(item, key) in data"
      :key="key"
      class="tag-chip tag-chip-large"
      :class="{ active: key === selectedTag }"
      :href="tagLink(key.toString())"
    >
      {{ key }} <span class="tag-count">{{ item.length }}</span>
    </a>
  </div>

  <section
    v-if="selectedTag"
    class="tag-section"
  >
    <h2 class="tag-title">
      <span class="tag-hash">#</span>{{ selectedTag }}
      <span class="tag-title-count">{{ postCount(data[selectedTag]?.length ?? 0) }}</span>
    </h2>
    <PostRows :posts="data[selectedTag] ?? []" />
  </section>
  <p
    v-else-if="mounted"
    class="tag-hint"
  >
    Pick a tag to see its posts.
  </p>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { data as posts } from '@theme/data/posts.data'
import PageHeader from '@components/PageHeader.vue'
import PostRows from '@components/PostRows.vue'
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
const postCount = (n: number) => (n === 1 ? '1 post' : `${n} posts`)

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
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-top: 1.25rem;
}

.tag-container .tag-chip-large {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.tag-count {
  color: var(--tag-count);
  font-weight: 700;
}

.tag-section {
  margin-top: 2rem;
}

.tag-title {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin: 0;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 2rem;
  letter-spacing: -0.01em;
}

.tag-hash {
  color: var(--vp-c-green-1);
}

.tag-title-count {
  margin-left: 0.25rem;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  font-weight: 500;
}

.tag-hint {
  margin-top: 2rem;
  color: var(--vp-c-text-2);
  font-size: 0.9375rem;
}
</style>
