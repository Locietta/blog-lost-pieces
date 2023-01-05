<script lang="ts" setup>

import Giscus from '@giscus/vue'

</script>

<template>
    <div class="comments-container">
        <Giscus id="comments" repo="Locietta/blog-lost-pieces" repoId="R_kgDOH-URKw" category="Announcements"
            categoryId="DIC_kwDOH-URK84CTZKy" mapping="pathname" reactionsEnabled="1" emitMetadata="0"
            inputPosition="top" theme="light" strict="0" loading="lazy" />
    </div>
</template>

<style>
/*global  style*/
.giscus {
    padding-top: 1.0625rem;
    max-width: inherit !important;
}
</style>