---
lastUpdated: false
sidebar: false
comment: false
---

<script setup lang="ts">
import Page from '../.vitepress/theme/components/HomePage.vue'
import { data as posts } from '../.vitepress/theme/data/posts.data.ts'
import { useData } from 'vitepress'
const { theme } = useData()
const pageSize = theme.value.pageSize
</script>

<Page :posts="posts" :pageSize="pageSize" />
