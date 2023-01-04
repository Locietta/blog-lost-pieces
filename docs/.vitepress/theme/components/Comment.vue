<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useData, useRoute } from 'vitepress'

const { frontmatter } = useData()
const giscusRef = ref()
const { path } = useRoute()

console.log(frontmatter.value.page)
console.log(path)

onMounted(() => {
    let giscus = document.createElement('script')
    giscus.async = true
    giscus.setAttribute('src', 'https://giscus.app/client.js')
    giscus.setAttribute('data-repo', 'Locietta/blog-lost-pieces')
    giscus.setAttribute('data-repo-id', 'R_kgDOH-URKw')
    giscus.setAttribute('data-category', 'Announcements')
    giscus.setAttribute('data-category-id', 'DIC_kwDOH-URK84CTZKy')
    giscus.setAttribute('data-mapping', 'pathname')
    giscus.setAttribute('data-strict', '0')
    giscus.setAttribute('data-reactions-enabled', '1')
    giscus.setAttribute('data-emit-metadata', '0')
    giscus.setAttribute('data-input-position', 'top')
    giscus.setAttribute('data-theme', 'preferred_color_scheme')
    giscus.setAttribute('data-loading', 'lazy')
    giscus.setAttribute('crossorigin', 'anonymous')
    giscusRef.value.appendChild(giscus)
})
</script>

<template>
    <div ref="giscusRef"></div>
</template>

<style>
/*global  style*/
.giscus {
    padding-top: 1.0625rem;
    max-width: inherit !important;
}
</style>
