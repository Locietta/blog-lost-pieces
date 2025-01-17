---
title: 首页 | Home Page
lastUpdated: false
sidebar: false
aside: false
comment: false
not_append_title: true
---

<script setup lang="ts">
import Page from '@components/HomePage.vue'
import { data as posts } from '@theme/data/posts.data.ts'
import { useData } from 'vitepress'
const { theme } = useData()
const pageSize = theme.value.pageSize
</script>

<Page :posts="posts" :pageSize="pageSize" />
