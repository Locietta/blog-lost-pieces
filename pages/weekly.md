---
lastUpdated: false
sidebar: false
aside: false
comment: false
not_append_title: true
---

## 每周（？）更新的废话

<script setup lang="ts">
import { data as weekly } from '@theme/data/weekly.data.ts'
</script>

<!-- use v-for to generate the weekly list -->

<ul>
  <li v-for="item in weekly" :key="item">
    <a :href="`/weekly/${item}`">{{ item }}</a>
  </li>
</ul>
