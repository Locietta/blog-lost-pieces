<template>
  <footer
    v-if="isPost"
    class="post-footer"
    :class="{ standalone: !hasLastUpdated }"
  >
    <p
      v-if="frontmatter.license !== false"
      class="license"
    >
      © {{ year }} {{ theme.author }} · Licensed under
      <a
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        target="_blank"
        rel="license noopener noreferrer"
        >CC BY-NC-SA 4.0</a
      >
    </p>

    <div
      v-if="tags.length || related.length"
      class="footer-nav"
    >
      <div
        v-if="tags.length"
        class="footer-tags"
      >
        <HiOutlineTag class="icon" />
        <a
          v-for="tag in tags"
          :key="tag"
          class="tag-chip"
          :href="withBase(`/tags?tag=${encodeURIComponent(tag)}`)"
          >{{ tag }}</a
        >
      </div>

      <section
        v-if="related.length"
        class="related"
      >
        <h2 class="related-title">Related Posts</h2>
        <PostRows :posts="related" />
      </section>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { HiOutlineTag } from 'vue-icons-plus/hi2'
import { data as posts } from '@theme/data/posts.data'
import PostRows from '@components/PostRows.vue'

const RELATED_COUNT = 2

const { page, frontmatter, theme } = useData<LoiaTheme.Config>()

const isPost = computed(() => page.value.relativePath.startsWith('posts/'))
const tags = computed<string[]>(() => frontmatter.value.tags ?? [])

// same condition as vitepress' VPDocFooter, which renders the "last updated" line above us
const hasLastUpdated = computed(() => !!page.value.lastUpdated)

// same UTC formatting as the post header, the written day doesn't shift with timezone
const date = computed(() => {
  const parsed = new Date(frontmatter.value.date)
  return isNaN(parsed.getTime()) ? undefined : parsed
})
const year = computed(() => (date.value ?? new Date()).getUTCFullYear())

/// posts sharing the most tags, ties broken by the closest date (e.g. parts of a series)
const related = computed(() => {
  const self = '/' + page.value.relativePath.replace(/\.md$/, '')
  const time = date.value?.getTime() ?? Date.now()

  return posts
    .filter((post) => post.regularPath !== self)
    .map((post) => ({
      post,
      shared: post.frontMatter.tags?.filter((tag) => tags.value.includes(tag)).length ?? 0,
      distance: Math.abs(new Date(post.frontMatter.date).getTime() - time),
    }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared || a.distance - b.distance)
    .slice(0, RELATED_COUNT)
    .map(({ post }) => post)
})
</script>

<style scoped>
.post-footer {
  margin-bottom: 2rem;
}

/* without the "last updated" footer above, keep the same gap after the content */
.post-footer.standalone {
  margin-top: 4rem;
}

.footer-nav {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

.footer-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-2);
}

.icon {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
}

.related {
  margin-top: 1.5rem;
}

.related-title {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.5rem;
}

.license {
  margin: 0;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
  line-height: 1.5rem;
}

.license a {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  white-space: nowrap;
}

.license a:hover {
  color: var(--vp-c-brand-2);
}
</style>
