<template>
  <v-btn
    v-if="isPosts"
    theme="default"
    variant="outlined"
    class="rollback-btn"
    @click="rollBack"
  >
    <template #prepend><HiMiniArrowUturnLeft /></template>
    {{ '回到上一页' }}
  </v-btn>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import { HiMiniArrowUturnLeft } from 'vue-icons-plus/hi2'

const route = useRoute()
const isPosts = computed(() => route.path.startsWith('/posts'))

function rollBack() {
  if (window.history.length <= 1) {
    location.href = '/'
  } else {
    window.history.go(hashChangeCount.value)
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
.rollback-btn {
  border-style: dashed;
}
/* change color when hover on the button */
.rollback-btn:hover {
  color: var(--vp-c-brand);
}
</style>
