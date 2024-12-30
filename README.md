# Lost Pieces

![build](https://img.shields.io/github/actions/workflow/status/Locietta/blog-lost-pieces/build.yml?branch=main)

My blog powered by [Vitepress](https://vitepress.vuejs.org/), for notes and life records ...

拿Vitepress搭的个人博客，很久以前拿[airene的主题](https://github.com/airene/vitepress-blog-pure)和默认主题混了混魔改的。前端不是很懂，所以很多东西都是能用就行。C++写多了，有点类型强迫症，所以基本上能标都标了，尽量追求`.vue`和`.ts`文件里每个变量都能正确给出基于类型的语法提示。

目前支持的所有feature可参考[测试显示效果](https://blog.locietta.xyz/posts/test)。作为个人博客的话反正也不需要太多花里胡哨的功能，这样就挺好。

### 目录结构

和airene的差不多，就是把posts之类的都移到了`pages`下，方便统一管理。

```
├── .vitepress
│   ├── config.ts     // 主题配置文件
│   ├── ...
│
│
└── pages
    ├── about.md
    ├── archives.md
    ├── tags.md
    ├── posts         // 存放博客文章
    └── public        // [可选]
       ├── L_32x32.ico
       └── favicon.ico
```

### Post格式参考

```yaml
---
date: 文章发布日期，格式为YYYY-MM-DD
title: 文章标题
tags: # 文章标签
  - math
  - 概率
description: 文章简介，在主页显示
# 其他可选字段
lastUpdated: 是否显示最后更新时间（默认true）
not_append_title: 是否禁用自动添加标题（默认false）
comment: 是否开启评论（默认true）
sidebar: 是否显示右侧的目录（默认true）
---

<!-- # 不用手写标题，会自动用frontmatter里的title生成，除非手动设置not_append_title: true -->

<!-- 内容 -->

```

### 关于评论

使用基于Github discussion的giscus来做评论，好处是不会污染issue，同时还能支持楼中楼回复。

用法上，在`.vitepress/config.ts`里指定`themeConfig: { comment: true }`就可以开启所有页面的评论，也可以在各个文章的frontmatter里手动设置`comment: false`覆盖全局设置（[about.md](./about.md)是个例子）。

需要在`.vitepress/config.ts`中的主题设置里的`giscusConfig`条目中填入必要的配置并启用相关仓库的discussion后才能使用评论相关功能，具体可参考https://giscus.app/zh-CN

切换夜间模式的时候会自动刷新评论组件。
