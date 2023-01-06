<template>
    <div class="comments">
        <component v-if="showComment" :is="'script'" src="https://giscus.app/client.js" 
            :data-repo="'Locietta/blog-lost-pieces'" 
            :data-repo-id="'R_kgDOH-URKw'"
            :data-category="'Announcements'"
            :data-category-id="'DIC_kwDOH-URK84CTZKy'" 
            :data-mapping="'pathname'"
            data-reactions-enabled="1" data-emit-metadata="0"
            :data-input-position="'top'" :data-theme="isDark ? 'dark' : 'light'"
            :data-lang="'en'" crossorigin="anonymous"
            :data-loading="'lazy'" async>
        </component>
    </div>
</template>

<script lang="ts" setup>
import { useData, useRoute } from 'vitepress'
import { ref, watch } from 'vue'

const { isDark } = useData()

const route = useRoute()
const showComment = ref(true)
watch(
    () => route.path,
    () => {
        showComment.value = false
        setTimeout(() => {
            showComment.value = true
        }, 150)
    }
)
</script>
<style scoped>
.comments {
    padding-top: 1.0625rem;
    width: 100%;
    text-align: center;
}
</style>