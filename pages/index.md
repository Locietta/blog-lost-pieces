---
lastUpdated: false
sidebar: false
comment: false
---

<script setup>
import Page from "../.vitepress/theme/components/HomePage.vue";
import { data as posts } from '../.vitepress/theme/posts.data.ts'
</script>

<Page :posts="posts" :pageSize="6" />
