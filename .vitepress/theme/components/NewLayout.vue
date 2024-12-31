<template>
  <Layout>
    <template #doc-after>
      <Comment />
    </template>
    <template #aside-top>
      <RollBack />
    </template>
  </Layout>

  <Copyright />
</template>
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Comment from './Comment.vue'
import Copyright from './Copyright.vue'
import RollBack from './RollBack.vue'
const { Layout } = DefaultTheme
</script>
