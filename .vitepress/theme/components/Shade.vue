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
    hover: '你知道的太多了'
  }
)
</script>
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
