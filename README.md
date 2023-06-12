# Lost Pieces

![build](https://img.shields.io/github/actions/workflow/status/Locietta/blog-lost-pieces/build.yml?branch=main)

My blog powered by [Vitepress](https://vitepress.vuejs.org/), for notes and life records ...

拿Vitepress搭的个人博客，魔改了[airene的主题](https://github.com/airene/vitepress-blog-pure)，我也不懂前端，所以很多东西都是能用就行。

目前支持的所有feature可参考https://blog.locietta.xyz/posts/test

主要的改动：
* 使用TS，类型标注全覆盖
* 改用giscus作为评论系统，具体见下文
* 使用KaTeX支持数学公式渲染
* 支持嵌入tweet，用法是`<Tweet id="<推特id>" />`或者`<Tweet url="推特url" />`
* 一个图片对比控件，图形学/图像处理的结果展示还是需要这么个东西
* 一些针对light/dark模式的琐碎样式改动

作为个人博客的话反正也不需要太多花里胡哨的功能，这样就挺好。

### 关于评论

改用了基于discussion的giscus来做评论，好处是不会污染issue，同时还能支持楼中楼回复。

用法上，在`.vitepress/config.ts`里指定`themeConfig: { comment: true }`就可以开启所有页面的评论，也可以在各个文章的frontmatter里覆盖全局设置。

需要在`giscusConfig`中填入必要的配置后才能使用评论相关功能，具体可参考https://giscus.app/zh-CN