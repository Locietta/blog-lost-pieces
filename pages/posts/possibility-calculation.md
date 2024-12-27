---
date: 2024-04-03
title: 游戏王MD中的概率问题（一）：n连后手问题
tags:
  - math
  - 概率
description: 怎么玩MD老是后手...我要成为游戏王（划掉）概率论糕手！
---

# {{ $frontmatter.title }}

## 前言

:::info 游戏王的先后手差距
游戏王/YGO是一个先后手差距非常大的卡牌游戏，先攻玩家如果在第一回合不受干扰的话往往就直接意味着胜利。

虽然有各种各样的“手坑”让后手玩家可以在先手玩家的第一回合进行干扰，然而作用有限：

- 先手玩家可以无效它们
- 即使受到少量干扰，1卡动多补点的现代卡组仍然能做大场
- 先手玩家也能使用手坑来干扰后手玩家（点名批评增殖的G）

因此即使先手少抽1张牌并且没有战斗阶段，先手仍然有着巨大的优势，以致于硬币的正反很大程度上左右最终的胜负。
:::

![心肺骤停](https://s2.loli.net/2024/04/28/dHTUECXtWiOeVc6.png)

在一个抛硬币决定先后的游戏里喜提n连硬币反面概率有多大呢？~~是谁11连后手跑来算概率~~

> 改成猜拳决定先后的话概率上是没什么区别的，还是会有倒霉蛋喜提10+连后手。

算是（久违地）引起了我整点数学的兴趣。由此顺便联想到了不少相关的概率问题（某卡组升段/掉段的概率、bo3连胜制的胜率、...），零零碎碎算了不少内容最终成了这篇文章。

由于篇幅问题，以及大量的公式，本文已被拆分以改善加载速度。系列文章如下：

* [（一）](./possibility-calculation.md)：本文，计算了硬币出现$n$连反面的投掷次数期望和概率
* [（二）](./possibility-calculation-2.md)：计算了MD天梯升降小段的期望局数和升段概率，与Bo2及衍生赛制Bo∞的期望局数和双方胜率

## TL;DR

> 这篇文章的主要计算结果都在这里，如果你对冗长的计算没什么兴趣也许可以不看之后的计算。~~结果就已经挺冗长了~~

本文主要利用**生成函数**讨论了出现$n$连硬币正面的期望投掷次数和概率。主要计算结果如下：

设单次硬币正面概率为$p$，那么为了出现连续$n$次硬币，期望的抛硬币次数是

$$
E(m)=\dfrac{1-p^n}{p^n(1-p)}
$$

抛了$m$次硬币，有连续$n$次正面的概率是

$$
P(Z_m \geq n) = \sum_{j=1}^{\lfloor \frac{m}{n} \rfloor } \binom{m-nj}{j-1}(p-1)^{j-1}p^{nj}\left[p+\dfrac{(1+m-nj)(1-p)}{j}\right]
$$

当$m\gg n$且$n$充分大时，

$$
P(Z_m \geq n) \sim 1-\mathrm{e}^{(m+1)(p-1)p^n}
$$

## 抛多少次硬币会出现连续n次正面？

首先我们想知道大概抛多少次硬币会出现连续$n$次正面，换句话说，想要知道出现连续$n$次正面所需要的投掷次数的**期望**。

抛一枚硬币，记正面的概率为$p$. 记恰好$m$次投掷硬币获得$n$次连续正面的概率为$P_{m, n}$

显然有，$P_{n, n} = p^{n}$ 以及 $P_{m, n} = 0\ (m < n)$

对于$m>n$，即前$n$次没能投出全正面的情形。我们考虑首次出现反面时的投掷次数$i$，不难得到递推式：

$$
\begin{equation}
P_{m, n} = \sum_{i=1}^n p^{i-1}(1-p)P_{m-i, n}
\end{equation}
$$

考虑数列$\{P_{m, n}\}_m$的**生成函数**：

$$
\begin{aligned}
G_n(x) &= \sum_{i=0}^{\infty} P_{i, n} x^{i}\\
&=\sum_{i=1}^{\infty} P_{i, n} x^{i}\quad (\text{for } n\geq 1) \\
\end{aligned}\tag{2}
$$

综合$(1)$和$(2)$可以得到：

$$
\begin{aligned}
G_n(x) [1-(1-p)x-p(1-p)x^2-\cdots-p^{n-1}(1-p)x^n] = P_{n, n} x^n = p^{n}x^n
\end{aligned}\tag{3}
$$

于是，

$$
G_n(x) \left[1 - (1-p) x \dfrac{1-p^{n}x^{n}}{1-px}\right] = p^nx^n
$$

$$
G_n(x) = \boxed{\dfrac{(1-px)p^nx^n}{1-x+(1-p)p^{n}x^{n+1}}} \tag{4}
$$

所以使得连续$n$次出现正面需要的投掷次数期望为$E_n = G'_n(1) = \boxed{\dfrac{1-p^n}{p^n(1-p)} }$

方差则为

$$
\begin{aligned}
D_n &= G''(1)+G'(1)-[G'(1)]^2 \\
&= \dfrac{2[(n+1)p^{n+1}-p^{2n+1}+p^{2n}-(n+2)p^n+1]}{p^{2n}(1-p)^2}+\dfrac{1-p^n}{p^n(1-p)}-\left[\dfrac{1-p^n}{p^n(1-p)}\right]^2\\
&=\boxed{\dfrac{1 - (2n+1)(1-p)p^n-p^{2n+1}}{p^{2n}(1-p)^2}}
\end{aligned}
$$

:::info 你问咋算这么复杂的导数？
出门右转[Wolfram Alpha](https://www.wolframalpha.com/)，或者使用本地的Mathematica/Maple/SymPy之类的符号计算软件。
:::

对于$p=\dfrac{1}{2}$，有$G_n(x) = \dfrac{(2-x)x^n}{2^{n+1}(1-x)+x^{n+1}}$，$E_n=2^{n+1}-2$，$D_n = 2^{2n+2} - (2n+1)2^{n+1} - 2$

:::info 分析
也就是说如果硬币公平的话，平均每30把就会出现4连先手**和**4连后手。不过结果的标准差基本上和期望一样大，所以结果很不稳定，可能没啥参考价值？
:::

## 抛m次硬币连续至少n次正面的概率

比起期望，我们当然对概率本身更加感兴趣，不过这计算就繁琐了不少。

### 闭形式

记抛m次硬币出现的最长连续正面次数为$Z_m$，那么我们要求的就是$P(Z_m\geq n)$的大小。

沿用上一节的记号，我们有

$$
P(Z_m\geq n) = \sum_{i = 0}^m P_{i, n} \tag{5}
$$

也就是说，所求的就是数列$\{P_{m, n}\}_m$的前m项和。由于前面已经算出了$\{P_{m, n}\}_m$的生成函数，我们可以直接写出$P(Z_m\geq n)$的生成函数$F_n(x)$

$$
\begin{align*}
F_n(x) &= \dfrac{1}{1-x}G_n(x) \\
&= \dfrac{(1-px)p^nx^n}{(1-x)[1-x+(1-p)p^{n}x^{n+1}]} \\
&= \dfrac{1}{1-x} + \dfrac{p^nx^n-1}{1-x+(1-p)p^{n}x^{n+1}} \tag{6}
\end{align*}
$$

:::tip 定义1. （系数算子） $[x^n]f(x)$

对幂级数$\displaystyle \sum_{i=0}^{\infty} a_ix^i$以及$n\in \mathbb{Z}$ 定义

$$
[x^n]\displaystyle \sum_{i=0}^{\infty} a_ix^i = \begin{dcases}
  a_n &,if\ n\geq 0,  \\
  0 &,if\ n<0.
\end{dcases}
$$

按照定义易得以下性质：

- $[x^n]f(x)=\dfrac{f^{(n)}(0)}{\Gamma(n+1)},\quad if\ n\geq 0$
- $[x^n]x^mf(x) = [x^{n-m}]f(x)$
  :::

按照生成函数的定义，我们有

$$
\begin{align*}
P(Z_m\geq n) &= [x^m]F_n(x) = [x^m] \left(\dfrac{1}{1-x} + \dfrac{p^nx^n-1}{1-x+(1-p)p^{n}x^{n+1}}\right)\\
&= [x^m] \left(\sum_{i=0}^{\infty}x^i+(p^nx^n-1)\sum_{i=0}^{\infty}\left[x-(1-p)p^nx^{n+1}\right]^i\right)\\
&= 1 + [x^m](p^nx^n-1)\sum_{i=0}^{\infty}\left[x-(1-p)p^nx^{n+1}\right]^i\\
&=1+\left(p^n[x^{m-n}] - [x^m]\right)\sum_{i=0}^{\infty}x^i\left[1-(1-p)p^nx^{n}\right]^i\\
&=1+\left(p^n[x^{m-n}] - [x^m]\right)\sum_{i=0}^{\infty}x^i\sum_{j=0}^i \binom{i}{j}  (-1)^j (1-p)^j (px)^{nj}\\
&=1+\sum_{i=0}^{m}\left(p^n[x^{m-n-i}] - [x^{m-i}]\right)\sum_{j=0}^i \binom{i}{j}  (-1)^j (1-p)^j (px)^{nj}\\
&=1+p^n\sum_{j=0}^{\lfloor \frac{m}{n} \rfloor - 1 } \binom{m-n(j+1)}{j}(p-1)^jp^{nj} - \sum_{j=0}^{\lfloor \frac{m}{n} \rfloor } \binom{m-nj}{j}(p-1)^jp^{nj}\\
&=1+\sum_{j=0}^{\lfloor \frac{m}{n} \rfloor - 1 } \binom{m-n(j+1)}{j}(p-1)^jp^{n(j+1)} - 1 - \sum_{j=1}^{\lfloor \frac{m}{n} \rfloor } \binom{m-nj}{j}(p-1)^jp^{nj}\\
&=\sum_{j=1}^{\lfloor \frac{m}{n} \rfloor } \binom{m-nj}{j-1}(p-1)^{j-1}p^{nj} - \sum_{j=1}^{\lfloor \frac{m}{n} \rfloor } \binom{m-nj}{j}(p-1)^jp^{nj}\\
&=\sum_{j=1}^{\lfloor \frac{m}{n} \rfloor } \binom{m-nj}{j-1}(p-1)^{j-1}p^{nj}\left[1-\dfrac{m-(n+1)j + 1}{j}(p-1)\right]\\
&=\boxed{\sum_{j=1}^{\lfloor \frac{m}{n} \rfloor } \binom{m-nj}{j-1}(p-1)^{j-1}p^{nj}\left[p+\dfrac{(1+m-nj)(1-p)}{j}\right]} \tag{7}
\end{align*}
$$

### 渐进分析

从闭形式中很难看出来概率的变化趋势，为此我们还需要一个渐进估计表达式。

这一节我们将得到：当$m\gg n$且$n$充分大时，有

$$
P(Z_m \geq n) \sim 1-\mathrm{e}^{(m+1)(p-1)p^n} \tag{8}
$$

#### 亚纯估计定理

道理上来讲，生成函数实际上只是**形式幂级数**，是否收敛并不重要。但如果我们知道它是收敛乃至解析的，那么就能用上一些分析学的方法来对其系数做出估计。

:::tip 定理：亚纯生成函数的估计
设$f(z)$是一个**亚纯函数**，它在包含原点的区域$\mathfrak{R}$内除了有限个极点外是解析的.

设$R>0$是模最小极点的模，$z_0, \cdots, z_s$是$f(z)$的所有模为$R$的极点，$R'>R$是$f(z)$次小模极点的模。

那么对$\forall \varepsilon > 0$，有

$$
[z^n]f(z)=[z^n]\left(\sum_{j=0}^s pp(f;z_j)+O\left(\left(\dfrac{1}{R'}+\varepsilon\right)^n\right)\right)
$$

其中$pp(f;z_j)=\displaystyle \sum_{j=1}^r \dfrac{a_{-j} }{(z-z_j)^j}$为$f$在$r$阶极点$z_j$处**Laurent展开的主要部分**。

:::

这个定理在《发生函数论》的第5章可以找到，这里我们就不加证明直接拿来了。这个定理表明，决定函数系数的最主要因素是它的模最小极点。

进一步，如果$z_0$是$f(z)$的（其中一个）模最小极点，且它是$r$阶极点，那么它对系数的贡献为

$$
\begin{align*}
[x^n]pp(f;z_0) &= [x^n]\sum_{j=1}^r \dfrac{a_{-j}}{(z-z_0)^j} = [x^n]\sum_{j=1}^r \dfrac{(-1)^ja_{-j}}{z_0^j(1-\dfrac{z}{z_0})^j} \\
&=[x^n]\sum_{j=1}^r \dfrac{(-1)^ja_{-j}}{z_0^j}\sum_{k = 0}^{\infty} \binom{k+j-1}{k}\left(\dfrac{z}{z_0}\right)^k\\
&=[x^n]\sum_{k = 0}^{\infty}z^k\left(\sum_{j=1}^r \dfrac{(-1)^ja_{-j}}{z_0^{k+j}}\binom{k+j-1}{j-1}\right)\\
&=\sum_{j=1}^r \dfrac{(-1)^ja_{-j}}{z_0^{n+j}}\binom{n+j-1}{j-1}
\end{align*}
$$

特别地，如果$z_0$是1阶极点，那么它的贡献就是$-\dfrac{Res[f(z), z_0]}{z_0^{n+1}}$.

#### 分析极点阶数

借由亚纯估计定理，我们的思路就是分析生成函数的极点。

回到$P(Z_m \geq n)$的生成函数$(6)$，由于$\dfrac{1}{1-x}$只是单纯给各项系数加上个$1$，我们只需考虑

$$
Q_n(x) = \dfrac{1-p^nx^n}{1-x+(1-p)p^{n}x^{n+1}}
$$

:::info NOTE
$Q_n(x) = \dfrac{1}{1-x}-F_n(x) = \displaystyle \sum_{i=0}^\infty \left[1-P(Z_m \geq n)\right]x^i=\sum_{i=0}^\infty P(Z_m < n) x^i$，因此$Q_n(x)$就是$P(Z_m < n)$的生成函数，
:::

为了得到$Q_n(x)$的极点，我们考虑方程

$$
\varphi(x)\overset{def}{=}1-x+(1-p)p^{n}x^{n+1} = 0 \tag{9}
$$

的根。

首先不难发现$\varphi\left(\dfrac{1}{p}\right)=0$，但$x=\dfrac{1}{p}$是个可去奇点，并不符合要求。

进一步分析，来求极值：

$$
\varphi'(x) = (n+1)(1-p)p^nx^n-1
$$

极值点$x_m = \dfrac{1}{p}\sqrt[n]{\dfrac{1}{(n+1)(1-p)} }$，极小值

$$
\begin{align*}
\varphi(x_m) &=1-\sqrt[n]{\dfrac{1}{p^n(1-p)}\dfrac{n^n}{(n+1)^{n+1}}}\\
&=1-\sqrt[n]{\dfrac{1}{\left(\dfrac{p}{n}\right)^n(1-p)}\dfrac{1}{(n+1)^{n+1}}}\\
&\leq 1- \sqrt[n]{\dfrac{1}{\left[\left(\underbrace{\dfrac{p}{n}+\cdots+\dfrac{p}{n}}_{n}+1-p\right)/(n+1) \right]^{n+1} }\dfrac{1}{(n+1)^{n+1}}}\\
&=0
\end{align*}
$$

最后采用了均值不等式来放缩，当且仅当$p = \dfrac{n}{n+1}$时取等，此时$x_m=1+\dfrac{1}{n}$.

借助均值不等式，不难发现$1 + \dfrac{1}{n} \leq x_m$以及$\varphi(1+(1-p)p^n)>0$，$\varphi(1+\dfrac{1}{n})\leq 0$，因此方程$\varphi(x) = 0$在$(1, +\infty)$上有两个根， 它们分布在$1+1/n$的两侧， 其中一个是$1/p$。

:::details $\varphi(x)=0$的最小模根是实根
~~证明留作习题~~ 不是重点，不想啰嗦
![](https://s2.loli.net/2024/04/28/JbIXjQSD8swxiEe.png)
贴一张$n=8, p=0.6$时$\varphi(x)$在复平面上的函数值作为参考吧~

实际上其它复根的模长不小于另一个实根（提示：使用三角不等式），因此为了使用亚纯估计定理，我们只需要考虑这个函数的实根就足够了。
:::

##### (I) $p\neq\dfrac{n}{n+1}$ 时

$$
\begin{aligned}
Res[Q_n(x); x_0] &= \lim_{x\to x_0} \dfrac{1-p^nx_0^n}{\varphi'(x_0)}\\
&=\dfrac{1-p^nx_0^n}{(n+1)(1-p)p^nx_0^n-1}
\end{aligned}
$$

由亚纯估计定理可知：

$$
\begin{aligned}
P(Z_m < n) &= [x^m]Q_n(x)\\
&\sim \dfrac{1-p^nx_0^n}{1-(n+1)(1-p)p^nx_0^n} \left(\dfrac{1}{x_0}\right)^{m+1}\\
&= \dfrac{1-px_0}{(1-p)(n+1-nx_0)} \left(\dfrac{1}{x_0}\right)^{m+1}
\end{aligned} \tag{10a}
$$

##### (II) $p=\dfrac{n}{n+1}$ 时

$$
a_{-1}=\lim_{x\to x_0} \dfrac{(1-p^nx^n)(x-x_0)}{\varphi(x)} = -\dfrac{2}{(n+1)(1-p)} = -2
$$

$$
a_{-2}=\lim_{x\to x_0}\dfrac{(1-p^nx^n)(x-x_0)^2}{\varphi(x)} = \dfrac{2(1-p^nx_0^n)}{n(n+1)(1-p)p^nx_0^{n-1}} = 0
$$

因此，

$$
\begin{aligned}
P(Z_m < n) &= [x^m]Q_n(x) \sim 2 \left(\dfrac{1}{x_0}\right)^{m+1} 
\end{aligned} \tag{10b}
$$

#### 估计极点$x_0$

当$n$充分大时，总是有$p<\dfrac{n}{n+1}$，这时$1/p$不是$\varphi(x)=0$最小的实根。记最小实根为$x_0$. 注意到$\varphi\left(1+(1-p)p^n\right)>0$和$\varphi\left(1+e(1-p)p^n\right)<0$，结合前面的导数分析，我们有$1+(1-p)p^n<x_0<1+e(1-p)p^n$，因此

$$
x_0=1+\Theta\left((1-p)p^n\right)
$$

进一步，记$K=\displaystyle \lim_{n\to \infty} \dfrac{x_0-1}{(1-p)p^n} \in [1, e]$，则

$$
\begin{align*}

K&=\lim_{n\to \infty} \dfrac{x_0-1}{(1-p)p^n} =\lim_{n\to \infty}x_0^{n+1} \\
&\leq \lim_{n\to \infty} \left[1+e(1-p)p^n\right]^{n+1}\\
&= \exp\left(\lim_{n\to \infty} \ln(1+e(1-p)p^n)(n+1)\right)\\
&\leq \exp\left(\lim_{n\to \infty} e(1-p)p^n(n+1)\right)\\
&=\exp(0) = 1
\end{align*}
$$

因此，$K=1$，也就是说

$$
x_0 \sim 1+(1-p)p^n \quad (n\to \infty)
$$

将以上近似回代到$(10a)$中，有

$$
\begin{align*}
P(Z_m < n) &\sim \dfrac{1-px_0}{(1-p)(n+1-nx_0)} \left(\dfrac{1}{x_0}\right)^{m+1} \\
&\sim \left(\dfrac{1}{x_0}\right)^{m+1}\\
&= \left(\dfrac{1}{1+ (1-p)p^n}\right)^{m+1}\\
&=\left(1+ \dfrac{1-p}{p^{-n}}\right)^{-(m+1)}\\
&=\left(\left(1+ \dfrac{1-p}{p^{-n}}\right)^{p^{-n}}\right)^{-p^n(m+1)}\\
&\sim \left(\mathrm{e}^{1-p}\right)^{-p^n(m+1)}\\
&= \boxed{\mathrm{e}^{(m+1)(p-1)p^n}}
\end{align*}
$$

从而，

$$
\boxed{P(Z_m \geq n) = 1 - P(Z_m < n) \sim 1 - \mathrm{e}^{(m+1)(p-1)p^n} }\tag{8}
$$

> $\mathrm{e}$：又是我~

:::warning TODO: 误差分析
好麻烦欸，有空再整吧...~~（多半是鸽了）~~
:::
