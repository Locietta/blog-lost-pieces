<template>
  <n-card
    class="link-card"
    :title="title"
    :bordered="bordered"
    embedded
    hoverable
    @click="navigateToLink"
  >
    <template
      v-if="image"
      #cover
    >
      <div class="link-card-image">
        <img
          :src="image"
          :alt="title"
          loading="lazy"
        />
      </div>
    </template>
    <div class="link-card-content">
      <div
        v-if="description"
        class="link-card-description"
      >
        {{ description }}
      </div>
      <n-tag
        v-if="showUrl"
        type="primary"
        class="link-card-url"
        round
        >{{ displayUrl }}
      </n-tag>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NTag } from 'naive-ui'

type Props = {
  title: string
  url: string
  description?: string
  image?: string
  bordered?: boolean
  showUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  image: '',
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

const navigateToLink = () => {
  window.open(props.url, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
.link-card {
  cursor: pointer;
  transition: transform 0.2s;
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin: 0 auto;
  border: 1px solid var(--vp-c-border);
  max-width: 85%;
}

.dark .link-card {
  background-color: var(--vp-c-gray-3);
}

.link-card:hover {
  transform: translateY(-1px);
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

.link-card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link-card-description {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 8px;
}

.link-card-url {
  align-self: flex-start;
  cursor: pointer;
}
</style>
