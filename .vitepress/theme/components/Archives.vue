<template>
  <div
    v-for="yearList in data"
    :key="yearList[0].frontMatter.date"
  >
    <div class="year">
      {{ yearList[0].frontMatter.date.split('-')[0] }}
    </div>
    <a
      v-for="(article, index) in yearList"
      :key="index"
      :href="withBase(article.regularPath)"
      class="article"
    >
      <div class="title">
        <div class="title-o"></div>
        {{ article.frontMatter.title }}
      </div>
      <div class="date">{{ article.frontMatter.date.slice(5) }}</div>
    </a>
  </div>
</template>

<script lang="ts" setup>
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { useYearSort } from '../functions'

const { theme } = useData<LoiaThemeConfig>()
const data = computed(() => useYearSort(theme.value.posts))
</script>

<style scoped>
.year {
  padding: 16px 0 8px 0;
  font-size: 1.2rem;
  font-weight: 600;
}
</style>
