<template>
  <a
    v-if="isPosts"
    class="rollback-btn"
    :class="placement"
    :href="lastListPage"
  >
    <HiMiniArrowUturnLeft class="icon" />
    回到上一页
  </a>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { HiMiniArrowUturnLeft } from 'vue-icons-plus/hi2'
import { useLastListPage } from '@theme/list-page'

withDefaults(
  defineProps<{
    /// `aside`: button above the outline, `top`: compact link above the title,
    /// shown only on screens where vitepress hides the aside
    placement?: 'aside' | 'top'
  }>(),
  { placement: 'aside' },
)

const route = useRoute()
const isPosts = computed(() => route.path.startsWith('/posts'))
const lastListPage = useLastListPage()
</script>
<style scoped>
.rollback-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  height: 34px;
  padding: 0 14px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  transition:
    color 0.2s,
    border-color 0.2s;
}

.rollback-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.rollback-btn.top {
  height: auto;
  margin-bottom: 0.75rem;
  padding: 0;
  border: none;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.5rem;
}

/* same breakpoint where vitepress shows the aside */
@media (min-width: 1280px) {
  .rollback-btn.top {
    display: none;
  }
}

.icon {
  width: 16px;
  height: 16px;
}
</style>
