---
date: 2024-10-12
title: “n到2n之间必然存在素数”的初等证明
tags:
  - math
description: 初中的时候瞎琢磨过的问题，现在捡起来看还是很有趣
---

# {{ $frontmatter.title }}

初中的时候有道比较简单的数论问题是这样的：

:::tip 命题1
对任意的正整数$n\geq 2$，总是存在素数$p$，满足$n \leq p \leq n!$.
:::

这个问题相当简单，只要考虑$n!-1$就好：它显然没有比$n$小的素因子，所以要么它自己是素数，要么有个比它小但比$n$大的素因子。

然后我就在书上翻到这样一个结论：

:::tip 命题2（伯特兰-切比雪夫定理）
对任意的正整数$n$，总是存在素数$p$，满足$n<p\leq2n$.
:::

简单尝试一下：

- $n=1$时，存在素数2，满足$1<2\leq 2$.
- $n=2$时，存在素数3，满足$2<3\leq 4$.
- $n=3$时，存在素数5，满足$3<5\leq 6$.
- $n=4$时，存在素数7，满足$4<7\leq 8$.

这结论一看就强了不少，想证明却又无从下手——当时我就拿来折磨整数竞的一个小伙伴了。

记得我和他一块想了两天没啥进展，不过他声称找到了$n<p\leq n^2$情况下的证明（~~现在想想多半不靠谱~~）。我倒是想到个耍赖的证明：

:::info “证明”
由于$2n$是一个偶数，所以由**哥德巴赫猜想**可知存在两个素数$p, q$使得$2n=p+q$.
若$n$到$2n$间不存在素数，那么这两个素数都得小于$n$，矛盾！

因此，存在满足$n\leq p \leq 2n$的素数$p$.
:::

搬出哥猜来属于是大炮打蚊子了，不过其实也没有完善地证明$n$是素数的情形——原问题可是要求目标素数严格比$n$大的。

高中的时候百度到了这个是所谓的[伯特兰-切比雪夫定理](https://en.wikipedia.org/wiki/Bertrand%27s_postulate)，巨神Erd$\text{\"o}$s在高中时就借助组合数${2n \choose n}$给出了一个初等证明。有了这个提示，时隔多年我也找出了证明:D

## 证明的框架

我们考察组合数${2n \choose n}$的标准分解

$$
{2n \choose n} =\prod_{i=1}^{k} p_i^{\alpha_i}
$$

估计素因子及其幂次的大小，可以依次得出如下结论：

- 因子$p_i^{\alpha_i}$满足上界$p_i^{\alpha_i} \leq 2n$
- 满足$p_i>\sqrt{2n}$的素因子，其指数只能是1
- 素因子$p_i$只能在$[2, \dfrac{2}{3}n]$或$(n, 2n]$中出现

从而可以把${2n \choose n}$的素因数分解写成

$$
{2n \choose n} = \prod_{p_i\leq \sqrt{2n}} p_i^{\alpha_i} \prod_{\sqrt{2n}<p_i\leq \frac{2}{3}n} p_i \prod_{n<p_i\leq 2n} p_i
$$

分别估计其它几项的大小后可知$\displaystyle \prod_{n<p_i\leq 2n} p_i$比1大，从而得出证明。

## 估计素因子$p_i$与指数$\alpha_i$的大小

### 指数的估计

为了处理阶乘的素因子，容易想到借助著名的勒让德公式。

:::tip 引理1（勒让德公式）
$n!$的素因子$p$的指数$v_p(n!)$由以下公式给出

$$
v_p(n!)=\sum_{i=1}^{\left \lfloor \log_p n \right \rfloor } \left \lfloor \dfrac{n}{p^i} \right \rfloor
$$

:::

:::info 引理1的证明

将$2, 3, \cdots, n$都写成标准分解式，那么$v_p(n!)$是这些分解式中$p$的指数的和。设指数为$r$的分解式有$n_r$个，那么

$$
\begin{aligned}
v_p(n!) &= n_1+2n_2+3n_3+\cdots = \sum_{r\geq 1} rn_r\\
&=(n_1+n_2+\cdots)+(n_2+n_3+\cdots)+(n_3+\cdots)+\cdots\\
&=\sum_{k\geq 1}\sum_{i\geq k}n_{i}\\
&=\sum_{k\geq 1}\left \lfloor \dfrac{n}{p^k} \right \rfloor
\end{aligned}
$$

最后一步是因为$\displaystyle \sum_{i\geq k}n_{i}$恰好是$2\sim n$中能被$p^k$整除的数的个数，恰好是$\left \lfloor \dfrac{n}{p^k} \right \rfloor$

:::

借助勒让德公式，我们很容易计算${2n \choose n}$素因子的指数：

$$
\begin{aligned}
v_p\left({2n \choose n}\right)&= v_p\left(\dfrac{(2n)!}{n!n!}\right)\\
&=\sum_{k=1}^{\left\lfloor \log_{p}2n \right\rfloor} \left( \left\lfloor \dfrac{2n}{p^k} \right\rfloor - 2\left\lfloor \dfrac{n}{p^k} \right\rfloor \right)\\
&=\sum_{k=1}^{\left\lfloor \log_{p}2n \right\rfloor} \left\lfloor 2\left\{\dfrac{n}{p^k}\right\} \right\rfloor\\
&\leq \sum_{k=1}^{\left\lfloor \log_{p}2n \right\rfloor} 1\\
&=\left\lfloor \log_{p}2n \right\rfloor \leq \log_{p}2n
\end{aligned}
$$

因此对于$p_i^{\alpha_i}$来说，有

:::warning 结论1

$$
p_i^{\alpha_i} \leq p_i^{\log_{p_i}2n} = 2n \tag{1}
$$

:::info 推论
显然如果$p_i>\sqrt{2n}$，那么其指数$\alpha_i$只能是1，否则与$(1)$矛盾。
:::

### $p_i$大小的估计

:::warning 结论2
$\displaystyle {2n \choose n}$的素因子$p_i\notin \left(\dfrac{2n}{3}, n\right]$
:::

如若不然，存在素因子$p_i\in \left(\dfrac{2n}{3}, n\right]$，那么$p_i\leq n< 2p_i\leq 2n < 3p_i$. 考虑$p_i$这个因子在$\displaystyle {2n \choose n} = \dfrac{(2n)!}{n!n!}$的分子和分母中出现的次数：

- 分母：$p_i$作为$n!$的因数出现1次，两个$n!$共计2次
- 分子：$p_i$和$2p_i$作为$(2n)!$的因数出现2次

$p_i$的其他倍数都比$2n$大，因此它在分子和分母的指数都是2，刚好抵消，于是$p_i$不是$\displaystyle {2n \choose n}$的因数，矛盾！

## 区间$(n, 2n]$中素数的个数

$n\geq 5$时，$\sqrt{2n}<\dfrac{2n}{3}$，此时可以把${2n \choose n}$的素因数分解写成

$$
{2n \choose n} = \prod_{p_i\leq \sqrt{2n}} p_i^{\alpha_i} \prod_{\sqrt{2n}<p_i\leq \frac{2}{3}n} p_i \prod_{n<p_i\leq 2n} p_i
$$

设$(n, 2n]$中素数的个数为$\omega(n)$，我们对最后一项做一点粗暴的放缩，把$\omega(n)$代到上面的式子里面，就能得到：

$$
{2n \choose n} \leq \prod_{p_i\leq \sqrt{2n}} p_i^{\alpha_i} \prod_{\sqrt{2n}<p_i\leq \frac{2}{3}n} p_i \ \cdot (2n)^{\omega(n)} \tag{2}
$$

接下来只要对二项式系数以及不等式右侧的两个乘积进行放缩，就能得到$\omega(n)$的取值范围了。只要证明$\omega(n)>0$就算胜利！

> 但是计算还挺复杂的就是了

### 估算二项式系数$\displaystyle {2n \choose n}$

观察$(2)$式的不等号方向，显然我们需要二项式系数的一个下界。这里可以简单地用数学归纳法证明：

$$
{2n \choose n}>\dfrac{4^n}{n}
$$

不过借助[Wallis乘积](https://en.wikipedia.org/wiki/Wallis_product)的性质可以给出${2n \choose n}$的最优估计：

:::tip 引理2

$$
\dfrac{4^n}{\sqrt{\pi\left(n+\frac{1}{2}\right)}} \leq {2n \choose n} \leq \dfrac{4^n}{\sqrt{\pi n}}
$$

:::info 推论

$$
{2n \choose n} \sim \dfrac{4^n}{\sqrt{\pi n}}, \quad n\to \infty
$$

:::

考虑**Wallis乘积**$I_n$:

$$
\begin{aligned}

I_n &= \int_0^\frac{\pi}{2} \sin^n \theta \mathrm{d}\theta\\
&=\begin{cases}
  \dfrac{(2k)!!}{(2k+1)!!}, & n=2k+1\\
  \dfrac{(2k-1)!!}{(2k)!!}\cdot\dfrac{\pi}{2}, & n=2k
\end{cases}
\end{aligned}


$$

:::warning Wallis乘积的性质

- $I_{n+1}\leq I_n$
- $I_n = \dfrac{n-1}{n} I_{n-2}$
- $I_nI_{n+1} = \dfrac{\pi}{2(n+1)}$

:::

这些性质的证明都很简单，这里略去不表。容易发现

$$
\begin{aligned}

{2n \choose n} &= \dfrac{(2n)!}{n!n!} = \dfrac{(2n)!}{(2n)!!(2n)!!} \cdot 4^n\\
&=\dfrac{(2n-1)!!}{(2n)!!}\cdot 4^n \\
&=\dfrac{2^{2n+1}}{\pi} I_{2n} 

\end{aligned} \tag{3}
$$

由Wallis乘积的性质，可以估计$I_{2n}$的大小

$$
\begin{gather*}
\dfrac{\pi}{2(2n+1)}=I_{2n}I_{2n+1}\leq I^2_{2n} \leq I_{2n-1}I_{2n}=\dfrac{\pi}{4n}\\
\sqrt{\dfrac{\pi}{2(2n+1)}}\leq I_{2n}\leq \sqrt{\dfrac{\pi}{4n}}
\end{gather*}
$$

回代到$(3)$中，就得到

$$
\dfrac{4^n}{\sqrt{\pi\left(n+\frac{1}{2}\right)}} \leq {2n \choose n} \leq \dfrac{4^n}{\sqrt{\pi n}}
$$

### 估算$\displaystyle \prod_{p_i\leq \sqrt{2n}} p_i^{\alpha_i}$

我们已经知道$p_i^{\alpha_i} \leq 2n$，算$[1, \sqrt{2n}]$里全是素数，可以得到

$$
\prod_{p_i\leq \sqrt{2n}} p_i^{\alpha_i} \leq (2n)^{\sqrt{2n}}
$$

当然这么放缩也太宽松了，如果把$[1, n]$间的素数个数记为$\pi(n)$，那么显然有

$$
\prod_{p_i\leq \sqrt{2n}} p_i^{\alpha_i} \leq (2n)^{\pi(\sqrt{2n})}
$$

于是问题转换为寻找素数计数函数$\pi(n)$的一个上界。

:::tip 引理3
$\pi(n)\leq \dfrac{n}{3} + 2$
:::

:::info 引理3的证明
证明很容易。

任取自然数$n\geq5$，模6余2, 4, 6的是2的倍数，余3的是3的倍数，因此素数只能余1或者5，最多只占总数的$\dfrac{1}{3}$，再加上比5小的两个素数，于是就有$\pi(n)\leq \dfrac{n}{3} + 2$
:::

> 有很多更严密的上界，但对这个问题来讲这已经足够了。（由素数定理$\pi(x)\sim \frac{x}{\ln x}$，所以紧上界应与$\frac{n}{\ln n}$同阶）

### 估算$\displaystyle\prod_{\sqrt{2n}<p_i\leq \frac{2}{3}n} p_i$

这一项的估计相对复杂许多，我们考虑$n$以下所有素数的乘积函数$\displaystyle P(n)=\prod_{p_i\leq n} p_i$，那么

$$
\prod_{\sqrt{2n}<p_i\leq \frac{2}{3}n} p_i = \dfrac{P\left(\dfrac{2n}{3}\right)}{P(\sqrt{2n})}
$$

我们来寻找$P(n)$的取值范围。

首先考虑二项式系数$\displaystyle {2n-1 \choose n}=\dfrac{(2n-1)\cdot(2n-2)\cdots (n+1)\cdot n}{n\cdot(n-1)\cdots 2\cdot 1}$. 分子部分的因式分解中$n+1$到$2n-1$间的素数至少都出现了一次，且不会被分母抵消。所以这个组合数必然比$n+1$到$2n-1$间的素数乘积要大，从而得到：

$$
{2n-1 \choose n} \geq \dfrac{P(2n-1)}{P(n)}
$$

而由于$\displaystyle {2n-1 \choose n}=\dfrac{(2n-1)!}{n!(n-1)!}=\dfrac{1}{2}\dfrac{(2n)!}{n!n!}=\dfrac{1}{2}{2n \choose n}$，所以

$$
\begin{aligned}
  2^{2n} &= (1+1)^{2n} = \sum_{i=0}^{2n} {2n \choose i} \\
  &\geq {2n \choose n} + {2n \choose n+1} \\
  &= 2 {2n \choose n} = 4 {2n-1 \choose n} \\
  &\geq 4\cdot\dfrac{P(2n-1)}{P(n)}
\end{aligned}
$$

也就是

:::warning 素数乘积的递推关系

$$
\dfrac{P(2n-1)}{P(n)} \leq 2^{2n-2}
$$

:::

利用这个递推估计，我们可以使用第二数学归纳法来证明：

:::tip 引理4（素数乘积的上界）
对任意自然数$n\geq 3$，有

$$
P(n)< 2^{2n-3}
$$

:::

:::info 引理4的证明
对于$n=3, 4$，有$P(3)=P(4)=2\times 3=6 < 2^3$.
归纳假设对满足$3\leq n\leq 2k-2\ (k\geq 3)$的$n$，命题也成立，那么
$$
\begin{aligned}
P(2k-1)&=P(k)\cdot \dfrac{P(2k-1)}{P(k)}\\
&<2^{2k-3}\cdot 2^{2k-2}\\
&= 2^{2(2k-1)-3}
\end{aligned}
$$
也就是$n=2k-1$的情形成立。考虑$n=2k$的情形，$2k$显然不是素数，因此

$$
P(2k)=P(2k-1)< 2^{2(2k-1)-3} < 2^{2(2k)-3}
$$

即$n=2k$时也成立。进而由数学归纳法可知原命题对$n\geq3$成立。

:::

现在我们回到对$\displaystyle\prod_{\sqrt{2n}<p_i\leq \frac{2}{3}n} p_i$的估计，对$n\geq 5$我们有

$$
\begin{aligned}
\prod_{\sqrt{2n}<p_i\leq \frac{2}{3}n} p_i &= \dfrac{P\left(\dfrac{2n}{3}\right)}{P(\sqrt{2n})}\\
&< \dfrac{2^{\frac{4}{3}n-3}}{P(3)}\\
&<2^{\frac{4}{3}n-5}
\end{aligned}
$$

### 估计$\omega(n)$

现在我们把前面得到的不等式估计回代到$(2)$中

$$
\begin{aligned}
  \dfrac{4^n}{\sqrt{\pi(n+\frac{1}{2})}} &\leq {2n \choose n} \leq \prod_{p_i\leq \sqrt{2n}} p_i^{\alpha_i} \prod_{\sqrt{2n}<p_i\leq \frac{2}{3}n} p_i \ \cdot (2n)^{\omega(n)}\\
  &<(2n)^{\frac{\sqrt{2n}}{3}+2}\cdot 2^{\frac{4}{3}n-5}\cdot (2n)^{\omega(n)}
\end{aligned}
$$

整理之后可以得到

$$
\begin{aligned}
  
\omega(n)&>\left[\dfrac{2n\ln 2}{3}+\dfrac{11}{2}\ln 2-\dfrac{\ln \pi}{2}\right]\dfrac{1}{\ln 2n}-\dfrac{\sqrt{2n}}{3}-\dfrac{\ln(2n+1)}{2\ln 2n}-2\\
&>\left[\dfrac{2n\ln 2}{3}+\dfrac{11}{2}\ln 2-\dfrac{\ln \pi}{2}\right]\dfrac{1}{\ln 2n}-\dfrac{\sqrt{2n}}{3}-\dfrac{\ln(4n)}{2\ln 2n}-2\\
&=\dfrac{2n\ln2}{3\ln 2n}-\dfrac{\sqrt{2n}}{3}+\left[5\ln 2-\dfrac{\ln \pi}{2}\right]\dfrac{1}{\ln 2n}-\dfrac{5}{2}
\end{aligned}\tag{*}
$$

现在需要估计不等式右边的下界，我们令$t=\sqrt{2n}$，考察$f(t)=\dfrac{t^2 \ln 2}{2\ln t}-t$. 直接求导：

$$
\begin{gather*}
f'(t) = \dfrac{x\ln 2}{\ln x}-\dfrac{x\ln 2}{2\ln^2 x}-1\\
f''(t) = \dfrac{\ln 2}{2}\cdot \dfrac{1}{\ln t} \left[\left(\dfrac{1}{\ln t}-\dfrac{3}{4}\right)^2+\dfrac{7}{16}\right]>0
\end{gather*}
$$

可见$f'(t)$单增，而不难算出$f'(e^2)>\dfrac{1}{2}>0$，所以显然$f(t)$在$t\to \infty$时发散到正无穷，因此由

$$
\begin{aligned}
\omega(n)&>\dfrac{1}{3}f(\sqrt{2n})+\left[5\ln 2-\dfrac{\ln \pi}{2}\right]\dfrac{1}{\ln 2n}-\dfrac{5}{2}\\
&>\dfrac{1}{3}f(\sqrt{2n})-\dfrac{5}{2}
\end{aligned}
$$

可知在$n$充分大时，必有$\omega(n)>0$。具体地，取$\sqrt{2n}>12$，即$n>72$时，有

$$
\omega(n)>\dfrac{1}{3}f(12)-\dfrac{5}{2}=\dfrac{8.08}{3}-\dfrac{5}{2}>0
$$

当$n\leq 72$时，考虑素数序列$2, 3, 5, 7, 13, 23, 43$，显然不管$n$取什么，在$(n, 2n]$间必然存在序列中的数。

综上，我们就证明了

:::tip 定理1 (Betrand-Chebyshev)
对任意的正整数$n$，总是存在素数$p$，满足$n<p\leq2n$.
:::

由$f(\sqrt{2n})$发散到正无穷的事实，我们还得到以下定理

:::tip 定理2 (Erd$\text{\"o}$s)
对任意的$k\in \mathbb{N}$，存在$N\in \mathbb{N}$，使得对任意$n\in\mathbb{N}$，只要$n>N$，那么在$(n, 2n]$上至少有$k$个素数。
:::
