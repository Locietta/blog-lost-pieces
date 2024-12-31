<template>
  <div
    v-if="show"
    class="comments"
  >
    <Giscus
      v-if="refreshKey"
      :repo="theme.giscusConfig.repo"
      :repo-id="theme.giscusConfig.repoId"
      :category="theme.giscusConfig.category"
      :category-id="theme.giscusConfig.categoryId"
      mapping="pathname"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      :theme="giscusTheme"
      lang="en"
      loading="lazy"
      crossorigin="anonymous"
    >
    </Giscus>
  </div>
</template>

<script lang="ts" setup>
import { useData, useRoute } from 'vitepress'
import { ref, watch, computed, nextTick } from 'vue'
import Giscus from '@giscus/vue'

const { isDark, frontmatter, theme } = useData<LoiaTheme.Config>()
const route = useRoute()

const show = computed(() => frontmatter.value.comment ?? theme.value.comment)
const giscusTheme = computed(() => (isDark.value ? 'dark' : 'light'))

const refreshKey = ref(true)

const refreshComment = () => {
  refreshKey.value = false
  nextTick(() => {
    refreshKey.value = true
  })
}

watch(() => route.path, refreshComment, { immediate: true })
</script>
<style scoped>
.comments {
  padding-top: 1.0625rem;
  width: 100%;
  text-align: center;
}
</style>
