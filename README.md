# Lost Pieces

![build](https://img.shields.io/github/actions/workflow/status/Locietta/blog-lost-pieces/build.yml?branch=main)

My blog powered by [Vitepress](https://vitepress.vuejs.org/), for notes and life records ...

拿Vitepress搭的个人博客，魔改了[airene的主题](https://github.com/airene/vitepress-blog-pure)，我也不懂前端，所以很多东西都是能用就行。

主要的改动：
* 改用giscus作为评论系统，评论默认开启，除非在frontmatter里指定`disableComment: true`
* 使用katex支持数学公式渲染
* 使用TS，类型标注全覆盖

作为个人博客的话反正也不需要太多花里胡哨的功能。