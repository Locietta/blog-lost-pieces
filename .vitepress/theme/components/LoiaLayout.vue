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
import Comment from '@components/Comment.vue'
import Copyright from '@components/Copyright.vue'
import RollBack from '@components/RollBack.vue'
const { Layout } = DefaultTheme

import { NConfigProvider, darkTheme, lightTheme } from 'naive-ui'
import { useData } from 'vitepress'
import { onMounted, onUnmounted } from 'vue'
const { isDark } = useData()

/// mark overflowing equations, part of solution to https://github.com/KaTeX/KaTeX/issues/1983

const markOverflowingEquations = () => {
  document.querySelectorAll('.katex-display').forEach((elem) => {
    if (elem.scrollWidth > elem.clientWidth) {
      elem.classList.add('has-scroll')
    } else {
      elem.classList.remove('has-scroll')
    }
  })
}

onMounted(() => {
  markOverflowingEquations()
  window.addEventListener('resize', markOverflowingEquations)
})

onUnmounted(() => {
  window.removeEventListener('resize', markOverflowingEquations)
})
</script>
