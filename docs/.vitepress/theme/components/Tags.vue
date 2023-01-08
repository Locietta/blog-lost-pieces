<template>
  <div class="tags">
    <span
      @click="toggleTag(key.toString())"
      v-for="(item, key) in data"
      class="tag"
    >
      {{ key }} <strong>{{ data[key].length }}</strong>
    </span>
  </div>
  <div class="header">{{ selectedTag }}</div>
  <a
    :href="withBase(article.regularPath)"
    v-for="(article, index) in data[selectedTag]"
    :key="index"
    class="article"
  >
    <div class="title">
      <div class="title-o"></div>
      {{ article.frontMatter.title }}
    </div>
    <div class="date">{{ article.frontMatter.date }}</div>
  </a>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import { initTags } from '../functions'

const { theme } = useData()
const data = computed(() => initTags(theme.value.posts))
const url = location.href.split('?')[1]
const params = new URLSearchParams(url)
const tagName = params.get('tag')

let selectedTag = ref(tagName ? tagName : '')

const toggleTag = (tag: string) => {
  selectedTag.value = tag
}
</script>

<style scoped>
.tags {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 4px 16px;
  margin: 6px 8px;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 25px;
  background-color: var(--tag-bg);
  transition: 0.4s;
  border-radius: 6px;
  color: var(--tag-text);
  cursor: pointer;
}

.tag:hover {
  color: var(--tag-hover);
}

.tag strong {
  padding-left: 0.125rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--tag-count);
}

.header {
  font-size: 2rem;
  font-weight: 600;
  margin: 1rem 0;
  text-align: center;
}

@media screen and (max-width: 700px) {
  .header {
    font-size: 1.5rem;
  }

  .date {
    font-size: 0.75rem;
  }
}
</style>
