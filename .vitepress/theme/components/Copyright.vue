<template>
  <div class="site-footer">
    MIT Licensed | Copyright © 2021-{{ year }} <a :href="website">{{ webTitle }}</a
    ><br />
    Powered by
    <a
      target="_blank"
      href="https://vitepress.dev/"
      >VitePress</a
    >
  </div>
</template>
<script lang="ts" setup>
import { useData } from 'vitepress'

const { site, theme } = useData<LoiaTheme.Config>()
const website = theme.value.website
const webTitle = site.value.title
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  width: 100%;
  padding: 1.5rem 1.5rem 2rem;
  border-top: 1px solid var(--vp-c-gutter);
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
  line-height: 1.75;
  text-align: center;
}

.site-footer a {
  color: var(--vp-c-text-1);
  font-weight: 500;
  transition: color 0.2s;
}

.site-footer a:hover {
  color: var(--vp-c-brand-1);
}
</style>
