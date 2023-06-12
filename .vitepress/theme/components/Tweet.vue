<!-- Wrapper around TweetSFC.vue -->
<template>
  <TweetSFC
    v-if="refreshKey"
    :theme="isDark ? 'dark' : 'light'"
    v-bind="$props"
  >
    <template #loading>
      <span> [[Tweet is loading...]] </span>
    </template>
    <template #error>
      <span> [[Tweet failed to load!]] </span>
    </template>
  </TweetSFC>
</template>
<script lang="ts" setup>
import TweetSFC from './TweetSFC.vue'
import { ref, watch } from 'vue'
import { useData } from 'vitepress'
const { isDark } = useData()
const refreshKey = ref(true)
const refreshComment = () => {
  refreshKey.value = false
  setTimeout(() => {
    refreshKey.value = true
  }, 100)
}

watch(isDark, refreshComment)
</script>
