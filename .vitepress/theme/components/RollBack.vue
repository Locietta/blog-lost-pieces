<template>
  <ClientOnly>
    <NButton
      v-if="isPosts"
      type="default"
      class="rollback-btn"
      dashed
      @click="rollBack"
    >
      <template #icon><HiMiniArrowUturnLeft /></template>
      {{ '回到上一页' }}
    </NButton>
  </ClientOnly>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import { HiMiniArrowUturnLeft } from 'vue-icons-plus/hi2'
import { NButton } from 'naive-ui'

const route = useRoute()
const isPosts = computed(() => route.path.startsWith('/posts'))

const rollBack = () => {
  if (history.length <= 1 || !document.referrer.startsWith(location.origin)) {
    // If no history or the referrer is not from the site, go to '/'
    location.href = '/'
  } else {
    // Otherwise, roll back within the site
    history.go(hashChangeCount.value)
    hashChangeCount.value = -1
  }
}

const hashChangeCount = ref(-1)
onMounted(() => {
  window.onhashchange = () => {
    hashChangeCount.value--
  }
})

onUnmounted(() => {
  window.onhashchange = null
})
</script>
<style scoped>
/* .rollback-btn {
  border-style: dashed;
} */
/* change color when hover on the button */
/* .rollback-btn:hover {
  color: var(--vp-c-brand);
} */
</style>
