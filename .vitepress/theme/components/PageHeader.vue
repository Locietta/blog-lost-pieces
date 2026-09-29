<template>
  <header class="page-header">
    <h1 class="page-title">{{ title }}</h1>
    <p
      v-if="subtitle"
      class="page-subtitle"
    >
      {{ subtitle }}
    </p>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<style scoped>
.page-header {
  padding: 1.5rem 0 0.5rem;
}

.page-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  line-height: 2.5rem;
  letter-spacing: -0.02em;
}

.page-subtitle {
  margin: 0.5rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.9375rem;
}
</style>
