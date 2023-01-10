<template>
  <Layout>
    <template #doc-after>
      <Comment />
    </template>
  </Layout>

  <Copyright />
</template>
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Comment from './Comment.vue'
import Copyright from './Copyright.vue'
const { Layout } = DefaultTheme
</script>
