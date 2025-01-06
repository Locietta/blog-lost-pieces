<template>
  <NConfigProvider
    abstract
    inline-theme-disabled
    :theme="isDark ? darkTheme : lightTheme"
  >
    <Layout>
      <template #doc-after>
        <Comment />
      </template>
      <template #aside-top>
        <RollBack />
      </template>
    </Layout>

    <Copyright />
  </NConfigProvider>
</template>
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Comment from './Comment.vue'
import Copyright from './Copyright.vue'
import RollBack from './RollBack.vue'
const { Layout } = DefaultTheme

import { NConfigProvider, darkTheme, lightTheme } from 'naive-ui'
import { useData } from 'vitepress'
const { isDark } = useData()
</script>
