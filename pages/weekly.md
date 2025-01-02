---
lastUpdated: false
sidebar: false
comment: false
---

## 每周（？）更新的废话

<script setup lang="ts">
import { data as weekly } from '../.vitepress/theme/data/weekly.data.ts'
</script>

<!-- use v-for to generate the weekly list -->

<ul>
  <li v-for="item in weekly" :key="item">
    <a :href="`/weekly/${item}`">{{ item }}</a>
  </li>
</ul>
