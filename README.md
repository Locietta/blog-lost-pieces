# Lost Pieces

![build](https://img.shields.io/github/actions/workflow/status/Locietta/blog-lost-pieces/build.yml?branch=main)

My blog powered by [Vitepress](https://vitepress.vuejs.org/), for notes and life records ...

拿Vitepress搭的个人博客，魔改了[airene的主题](https://github.com/airene/vitepress-blog-pure)，我也不懂前端，所以很多东西都是能用就行。

主要的改动：
* 改用giscus作为评论系统，评论默认开启，除非在frontmatter里指定`disableComment: true`
* 使用KaTeX支持数学公式渲染
* 使用TS，类型标注全覆盖
* 支持嵌入tweet，将Embed Tweet生成的html代码去除`<script>`标签后放入`<Tweet></Tweet>`组件中即可
* 一些针对light/dark模式的琐碎样式改动

作为个人博客的话反正也不需要太多花里胡哨的功能，这样就挺好。