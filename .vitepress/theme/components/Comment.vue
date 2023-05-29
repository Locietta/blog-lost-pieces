<template>
  <div
    v-if="show"
    class="comments"
  >
    <component
      :is="'script'"
      v-if="refreshKey"
      src="https://giscus.app/client.js"
      :data-repo="theme.giscusConfig.repo"
      :data-repo-id="theme.giscusConfig.repoId"
      :data-category="theme.giscusConfig.category"
      :data-category-id="theme.giscusConfig.categoryId"
      :data-mapping="'pathname'"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      :data-input-position="'top'"
      :data-theme="isDark ? 'dark' : 'light'"
      :data-lang="'en'"
      crossorigin="anonymous"
      :data-loading="'lazy'"
      async
    >
    </component>
  </div>
</template>

<script lang="ts" setup>
import { useData, useRoute } from 'vitepress'
import { ref, watch, computed } from 'vue'

const { isDark, frontmatter, theme } = useData<LoiaThemeConfig>()
const route = useRoute()

const show = computed(() => frontmatter.value.comment ?? theme.value.comment)

const refreshKey = ref(true)

const refreshComment = () => {
  refreshKey.value = false
  setTimeout(() => {
    refreshKey.value = true
  }, 150)
}

watch(() => route.path, refreshComment)
watch(isDark, refreshComment)
</script>
<style scoped>
.comments {
  padding-top: 1.0625rem;
  width: 100%;
  text-align: center;
}
</style>
