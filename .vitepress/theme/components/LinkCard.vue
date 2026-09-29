<template>
  <a
    class="link-card"
    :class="{ bordered }"
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div
      v-if="image"
      class="link-card-image"
    >
      <img
        :src="image"
        :alt="title"
        loading="lazy"
      />
    </div>
    <div class="link-card-body">
      <div class="link-card-title">{{ title }}</div>
      <div class="link-card-content">
        <div class="link-card-main">
          <div
            v-if="description"
            class="link-card-description"
          >
            {{ description }}
          </div>
          <span
            v-if="showUrl"
            class="link-card-url"
            >{{ displayUrl }}</span
          >
        </div>
        <div
          v-if="iconImage"
          class="link-card-icon"
        >
          <img
            :src="iconImage"
            :alt="`${title} icon`"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  title: string
  url: string
  description?: string
  image?: string
  iconImage?: string
  bordered?: boolean
  showUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  image: '',
  iconImage: '',
  bordered: true,
  showUrl: true,
})

const displayUrl = computed(() => {
  try {
    const url = new URL(props.url)
    return url.hostname
  } catch {
    return props.url
  }
})
</script>

<style scoped>
.link-card {
  display: block;
  max-width: 85%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  color: var(--vp-c-text-1);
  font-weight: normal;
  text-decoration: none;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.link-card.bordered {
  border: 1px solid var(--vp-c-border);
}

.dark .link-card {
  background-color: var(--vp-c-gray-3);
}

.link-card:hover {
  color: var(--vp-c-text-1);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.link-card-image {
  height: 160px;
  overflow: hidden;
}

.link-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.link-card-body {
  padding: 18px 24px 24px;
}

.link-card-title {
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
}

.link-card-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.link-card-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.link-card-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.link-card-icon img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.link-card-description {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 8px;
}

.link-card-url {
  align-self: flex-start;
  padding: 0 12px;
  border-radius: 999px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.8125rem;
  line-height: 26px;
}
</style>
