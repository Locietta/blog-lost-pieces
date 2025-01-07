---
date: 2022-09-11
title: 测试显示效果
tags:
  - vitepress
  - markdown
description: 测试显示效果
---

## Vanilla Markdown Syntax

> 二级标题会出现在右侧标题导航中

content, just for test

试试中文

文字 normal

**加粗文字** **bold**

_斜体文字_ _italic_

**_加粗斜体_** **_bold italic_**

超链接：https://blog.locietta.xyz/

超链接文字：[原地 TP](/posts/test.html)

图片（SMMS 图床）：

![跑了张AI图测试图床XD](https://s2.loli.net/2023/01/14/w9AWTZ8Gs5M4iek.png)

> 跑了张 AI 图用来测试，欸嘿

![](https://s2.loli.net/2023/05/02/X3uMSOJPlYFe1CE.png)

> 测试：没有标题的图，透明背景PNG

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
  description: 'Just playing around.',
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

公式支持是在Vitepress官方支持之前做的，所以没用MathJax3，而是用的KaTeX。其实有一段时间是切到官方的MathJax3的，但是发现MathJax3占的内存比KaTeX要大，本地`pnpm dev`的时候在类似[“n到2n之间必然存在素数”的初等证明](./n-2n间存在素数.md)的巨量LaTeX编辑的场景会直接把HMR干到OOM，所以最后又切回KaTeX了。反正KaTeX渲染速度更快，包体更小，而且我更喜欢KaTeX的字体，何乐而不为呢。

$$
\begin{gather*}
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
\end{gather*}


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

test code & formula in blocks:

`cat hello.txt | rg world`

```lua
-- function is first-class member!
local _gcd = function (a, b)
  if b == 0 then
    return a
  end
  return _gcd(b, a % b)
end
-- the function who kill the bilibili server once XD
-- that's why we'd like a typed version of lua
```

Stroke's: $\int_{\Omega}\mathrm{d}\omega = \int_{\partial \Omega}\omega$

$$
\begin{aligned}
\sum_{i=0}^{n-1} \dfrac{i+1}{2^i} &= \sum_{i=0}^{n-1} \left(\dfrac{i+2}{2^{i-1}} - \dfrac{i+3}{2^i}\right)\\
&= 4 - \dfrac{n+2}{2^{n-1}}

\end{aligned}
$$

:::

::: details
verbose content, collapsed on default
:::

### 图片比较

图形学/图像处理中经常需要比较两张图片的差异，这里提供了一个图片比较的组件。

点击或者拖动来对比两张图片👇

<Compare
      before="https://marcincichocki.github.io/vue-image-compare/img/after.jpg"
      after="https://marcincichocki.github.io/vue-image-compare/img/before.jpg"
      title="看看猫猫" tag
/>

<Compare
  before="https://s2.loli.net/2023/05/29/yfjD8pLnuGWMIth.png"
  after="https://s2.loli.net/2023/05/29/aBLdwSuFf5tGTIA.png"
  title="SDF Soft Shadow vs Raytraced Soft Shadow"
  tag beforeTag="SDF" afterTag="Raytraced
  (512spp)"
/>

### Embeded Tweet

忘了为啥要支持这个了，~~但总之是支持了~~。

::: details Click Me To View Kita-Chan~
<Tweet src="1614087229701488641"/>
:::

Also test Tweet outside of blocks👇

<Tweet src="https://twitter.com/jendrikillner/status/1668265685087076356"/>

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

### 黑幕

<Shade>
猜猜我是谁？
</Shade>

<br/>

<Shade hover="真拿你没办法">
真的要看吗？
</Shade>

<br/>

::: details
<Shade>
在容器块里也有用的！
</Shade>
:::
