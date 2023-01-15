---
date: 2022-09-11
update: 2023-01-14
title: 测试显示效果
tags:
  - vitepress
  - markdown
description: 测试显示效果
---

# {{ $frontmatter.title }}

## Vanilla Markdown Syntax

> 二级标题会出现在右侧标题导航中

content, just for test

试试中文

文字 normal

**加粗文字** **bold**

_斜体文字_ _italic_

**_加粗斜体_** **_bold italic_**

> 中文字体似乎没有对应的斜体版本...

超链接：https://blog.locietta.xyz/

超链接文字：[原地 TP](https://blog.locietta.xyz/posts/test.html)

图片（SMMS 图床）：

![跑了张AI图测试图床XD](https://s2.loli.net/2023/01/14/w9AWTZ8Gs5M4iek.png)

> 跑了张 AI 图用来测试，欸嘿

### 三级标题

#### 四级标题

> 最多支持 4 级标题

> 引用
>
> > 嵌套引用
>
> 引用

- 一
- 二
  - III
- IV
- five

1. aaaa
2. ssss
   1. dddd

> 缩进列表不会改变编号/圆点样式

### 代码块

行间代码`git init`

代码块

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Hello VitePress',
  description: 'Just playing around.'
})
```

```cpp
template <typename T, typename U = std::decay_t<decltype(*std::declval<const T &>().begin())>,
          typename std::enable_if_t<!std::is_trivially_copyable<U>::value && !std::is_trivially_copyable<T>::value, int> = 0>
void serialize(std::ostream &os, const T &val) {
    unsigned int size = val.size();
    os.write(reinterpret_cast<const char *>(&size), sizeof(size));
    for (auto &v : val) {
        serialize(os, v);
    }
}
```

### 数学公式（KaTeX）

$$
\mathbf{a} = (x_1, y_1, z_1)\\
\mathbf{b} = (x_2, y_2, z_2)\\
\mathbf{c} = (x_3, y_3, z_3)\\

\begin{aligned}

(\mathbf{a}, \mathbf{b}, \mathbf{c}) &= (\mathbf{a} \times \mathbf{b}) \cdot \mathbf{c}\\
&=
\begin{vmatrix}
 x_1 & y_1 & z_1 \\
 x_2 & y_2 & z_2 \\
 x_3 & y_3 & z_3
\end{vmatrix}
\end{aligned}
$$

$$\int_a^b f(x)\mathrm{d}x \sim F_n(X) = \dfrac{1}{n}\sum^n_{k=1}\dfrac{f(X_k)}{\color{red} PDF(X_k)}$$

$$
\begin{aligned}
E[F_n(X)] &= E\left[\frac{1}{n}\sum^n_{k=1}\dfrac{f(X_k)}{PDF(X_k)}\right]\\
&=\frac{1}{n}\sum^n_{k=1}E\left[\dfrac{f(X_k)}{PDF(X_k)}\right]\\
&=\frac{1}{n}\sum^n_{k=1}\int_a^b\dfrac{f(x)}{PDF(x)}PDF(x)\mathrm{d}x\\
&=\frac{1}{n}\sum^n_{k=1}\int_a^b f(x)\mathrm{d}x\\
&=\int_a^b f(x)\mathrm{d}x
\end{aligned}
$$

行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式
行间公式$\mathrm{e}^{i\theta} = \cos \theta + i \sin \theta$行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式

## Extended Markdown Syntax

### Github 扩展

GitHub Style 表情符号:
:100: :tada: :tea: :coffee: :smile:

Github Style 表格：

| Tables        |      Are      |                        Cool |
| ------------- | :-----------: | --------------------------: |
| col 3 is      | right-aligned |                       $1600 |
| col 2 is      |   centered    |            $e^{\pi i} = -1$ |
| zebra stripes |   are neat    | `constexpr int abs(int x);` |

### 特殊容器块

::: info
This is an info block.
:::

::: tip 提示
This is a tip.
:::

::: warning
This is a warning.
:::

:::danger 标题可以随便取
DANGER!!!
:::

::: details
verbose content, collapsed on default
:::

### Embeded Tweet

::: details Click Me To View Kita-Chan~
<Tweet>

  <blockquote class="twitter-tweet">
    <p
      lang="ja"
      dir="ltr"
    >
      喜多❤️<a
        href="https://twitter.com/hashtag/%E3%81%BC%E3%81%A3%E3%81%A1%E3%83%BB%E3%81%96%E3%83%BB%E3%82%8D%E3%81%A3%E3%81%8F?src=hash&amp;ref_src=twsrc%5Etfw"
        >#ぼっち・ざ・ろっく</a
      >
      <a href="https://t.co/xZcht5n0Pj">pic.twitter.com/xZcht5n0Pj</a>
    </p>
    &mdash; 唄茶Utacha (@Utacha0912)
    <a href="https://twitter.com/Utacha0912/status/1614087229701488641?ref_src=twsrc%5Etfw">January 14, 2023</a>
  </blockquote>
</Tweet>
:::

### 代码块扩展

```cpp{13}
template <typename T>
class Singleton {
public:
    static T &getInstance() {
        static T instance{_{}}; // Focused here! // [!code focus]
        return instance;
    }

    Singleton(const Singleton &) = delete;
    Singleton &operator=(const Singleton) = delete;

protected:
    struct _ {};
    Singleton() = default;
};
```

```cpp:line-numbers
template <typename T>
class Singleton {
public:
    static T &getInstance() {
        static T instance{_{}};
        return instance;
    }

    Singleton(const Singleton &) = delete;
    Singleton &operator=(const Singleton) = delete;

protected:
    struct _ {};
    Singleton() {}         // [!code --]
    Singleton() = default; // [!code ++]
};
```
