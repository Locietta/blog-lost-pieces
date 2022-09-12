---
date: 2022-09-11
title: 测试
tags:
  - vitepress
  - markdown
description: 测试显示效果
---

# Hello

content, just for test

试试中文

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

行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式
行间公式$\mathrm{e}^{i\theta} = \cos \theta + i \sin \theta$行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式行间公式


文字 normal

**加粗文字** **bold**

*斜体文字* *italic*

***加粗斜体*** ***bold italic***

> 中文字体似乎没有对应的斜体版本...

## 二级标题

### 三级标题

#### 四级标题

> 最多支持4级标题

