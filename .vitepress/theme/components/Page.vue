<template>
  <div
    v-for="(article, index) in posts"
    :key="index"
    class="post-list"
  >
    <div class="post-header">
      <div class="post-title">
        <a :href="withBase(article.regularPath)"> {{ article.frontMatter.title }}</a>
      </div>
      <time class="date">
        {{ article.frontMatter.date }}
      </time>
    </div>
    <p
      class="describe"
      v-html="article.frontMatter.description"
    ></p>
    <time
      v-if="article.frontMatter.update"
      class="update-date"
    >
      Updated at {{ article.frontMatter.update }}
    </time>
    <div class="post-tag">
      <span v-for="item in article.frontMatter.tags"
        ><a :href="withBase(`/pages/tags.html?tag=${item}`)"> {{ item }}</a></span
      >
    </div>
  </div>

  <div class="pagination">
    <a
      class="link"
      :class="{ active: pageCurrent === i }"
      v-for="i in pagesNum"
      :key="i"
      :href="withBase(i === 1 ? '/index.html' : `/page_${i}.html`)"
      >{{ i }}</a
    >
  </div>
</template>

<script lang="ts" setup>
import { withBase } from 'vitepress'

const props = defineProps<{
  posts: Array<Post>
  pageCurrent: number
  pagesNum: number
}>()
</script>

<style scoped>
.post-list {
  border-bottom: 1px dashed var(--c-divider);
  padding: 1rem 0 0 0;
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.post-tag span {
  display: inline-block;
  padding: 0px 7px;
  background-color: var(--tag-bg);
  margin: 0.25rem 0.5rem 0.75rem 0;
  transition: 0.4s;
  border-radius: 4px;
  cursor: pointer;
}

.post-tag span a {
  color: var(--vp-c-text-1);
  font-size: x-small;
}

.post-tag span a:hover {
  color: var(--tag-hover);
}

.vp-doc .post-title a {
  font-size: 1.0625rem;
  font-weight: 600;
  margin: 0.1rem 0;
}

.describe {
  font-size: 0.9375rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  color: #71717a;
  margin: 0.625rem 0 0.375rem;
  line-height: 1.5rem;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.link {
  display: inline-block;
  width: 28px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  border: 1px var(--c-divider-light) solid;
  border-right: none;
}

.link.active {
  background: var(--c-brand);
  color: #fff;
  border: 1px solid var(--c-brand) !important;
}

.link:first-child {
  border-bottom-left-radius: 3px;
  border-top-left-radius: 3px;
}

.link:last-child {
  border-bottom-right-radius: 3px;
  border-top-right-radius: 3px;
  border-right: 1px var(--c-divider-light) solid;
}

@media screen and (max-width: 720px) {
  .post-list {
    padding: 1rem 0 0 0;
  }

  .post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .post-title {
    font-size: 1.125rem;
    font-weight: 400;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    width: 17rem;
  }

  .describe {
    font-size: 0.9375rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    margin: 0.5rem 0 1rem;
  }

  .date {
    font-size: 0.8125rem;
  }
}
</style>
