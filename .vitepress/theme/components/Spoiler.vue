<template>
  <span
    class="shade"
    :title="hover"
  >
    <slot></slot>
  </span>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    hover?: string
  }>(),
  {
    hover: '你知道的太多了',
  },
)
</script>
<style>
:root {
  --shade-bg: var(--vp-c-text-1);
  --shade-text: var(--vp-c-bg-soft);
}

.dark {
  --shade-bg: #dfdfdf; /* Bug: var(--vp-c-text-1) is not working in dark mode */
  --shade-text: var(--vp-c-bg-soft);
}
</style>
<style scoped>
.shade,
.shade a,
a .shade {
  background-color: var(--shade-bg);
  color: var(--shade-bg);
  text-shadow: none;
}
.shade:hover,
.shade:active,
.shade:hover .shade,
.shade:active .shade {
  color: var(--shade-text);
}
</style>
