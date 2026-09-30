<template>
  <Layout>
    <template #doc-after>
      <!-- after vitepress' "last updated" footer -->
      <PostFooter />
      <Comment />
    </template>
    <template #doc-before>
      <RollBack placement="top" />
    </template>
    <template #aside-top>
      <RollBack />
    </template>
  </Layout>

  <Copyright />
</template>
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Comment from '@components/Comment.vue'
import Copyright from '@components/Copyright.vue'
import PostFooter from '@components/PostFooter.vue'
import RollBack from '@components/RollBack.vue'
import { trackListPage } from '@theme/list-page'
const { Layout } = DefaultTheme

import { onMounted, onUnmounted } from 'vue'

trackListPage()

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
