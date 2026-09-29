<template>
  <div class="post-meta">
    <time
      v-if="date"
      class="meta-item"
      :datetime="date"
    >
      <HiOutlineCalendar class="icon" />
      {{ date }}
    </time>
    <span
      class="meta-item"
      :title="`约 ${words} 字`"
    >
      <HiOutlineClock class="icon" />
      约 {{ minutes }} 分钟
    </span>
    <span
      v-if="tags.length"
      class="meta-item"
    >
      <HiOutlineTag class="icon" />
      <a
        v-for="tag in tags"
        :key="tag"
        class="meta-tag"
        :href="withBase(`/tags?tag=${encodeURIComponent(tag)}`)"
        >{{ tag }}</a
      >
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { HiOutlineCalendar, HiOutlineClock, HiOutlineTag } from 'vue-icons-plus/hi2'

defineProps<{
  words: number
  minutes: number
}>()

const { frontmatter } = useData()

// yaml dates are parsed as UTC midnight, format in UTC to keep the written day
const date = computed(() => {
  const raw = frontmatter.value.date
  if (!raw) return ''
  const parsed = new Date(raw)
  return isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10)
})

const tags = computed<string[]>(() => frontmatter.value.tags ?? [])
</script>

<style scoped>
.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.25rem;
  margin: 0.75rem 0 1.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.5rem;
}

.meta-item {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
}

.icon {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
}

time.meta-item {
  font-family: var(--vp-font-family-mono);
}

.meta-tag {
  padding: 0 0.5rem;
  border-radius: 0.375rem;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.meta-tag:hover {
  color: var(--vp-c-brand-1);
}
</style>
