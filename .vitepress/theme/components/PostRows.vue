<template>
  <ul class="post-rows">
    <li
      v-for="post in posts"
      :key="post.regularPath"
    >
      <a
        class="post-row"
        :href="withBase(post.regularPath)"
      >
        <time
          class="post-row-date"
          :datetime="post.frontMatter.date"
          >{{
            dateFormat === 'month-day' ? post.frontMatter.date.slice(5) : post.frontMatter.date
          }}</time
        >
        <span class="post-row-title">{{ post.frontMatter.title }}</span>
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'
import type { Post } from '@/theme'

withDefaults(
  defineProps<{
    posts: Post[]
    /// `month-day` when the year is already shown, e.g. in archives
    dateFormat?: 'full' | 'month-day'
  }>(),
  { dateFormat: 'full' },
)
</script>

<style scoped>
.post-rows {
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
}

.post-rows li + li {
  margin-top: 0;
}

.post-row {
  display: flex;
  align-items: baseline;
  gap: 1.25rem;
  margin: 0 -0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  color: var(--vp-c-brand-1);
  font-weight: 400;
  text-decoration: none;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.post-row:hover {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-2);
}

.post-row-date {
  flex-shrink: 0;
  color: var(--date-color);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
}

.post-row-title {
  font-weight: 600;
  line-height: 1.6;
}
</style>
