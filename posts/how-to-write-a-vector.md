---
date: 2023-01-27
title: C++踩坑：当你想要写一个vector
tags:
  - C/C++
description: 变长数组容器，结合我现在对C++的一些理解来写写看。
---

# {{ $frontmatter.title }}

变长数组容器是个常见的需求，`std::vector`则是其在 C++标准库中的实现。唔...如果我想自己写一个呢？自己造轮子也是 C++程序员的传统嘛。

:::details 折叠起来的都可以先略过 QAQ
短短几个月间，经历了被这道题面试和用这道题面试别人的神奇经历，感觉是得写写笔记 XD

只是中间咕咕了好久...
:::

用到的示例代码在[Locietta/loia_vector](https://github.com/Locietta/loia_vector)中可以找到。

:::danger WIP
还在施工中，现在就写了一小部分，猴年马月能写好吧（大概）

接下来开写c with class的部分，然后是模板和一些魔法。大概还得讨论realloc, iterator/ranges, trivally-copyable, 强异常安全之类的话题，结合一些C++20/23的语法。希望这么多东西都能缝合进这篇文章里(X)

:::

## 如果我们回到 C...

好吧，如果你是一个只使用纯 C 的程序员，当你想要一个变长数组的时候，你会怎么做？

如果你事先知道需要多长的数组，那么这很简单：

```c
int n = input(); // length is input or calculated elsewhere
int *p_arr = malloc(n * sizeof(int));
```

**但如果你并不知道呢？**

### 一个极其简陋的实现

很多时候，我们不知道数组最后会有多长，但是希望可以直接向数组中加入元素，同时可以自动扩张分配的内存。按照这个朴素的想法我们可以写出这样的代码：

```c
int n = 0;          // array size
int *p_arr = NULL;  // array pointer

void push_back(int x) { // add an element to the end of array
    int *p_old = p_arr;
    p_arr = malloc((n + 1) * sizeof(int));
    memcpy(p_arr, p_old, n * sizeof(int));
    p_arr[n++] = x;
    free(p_old);
}
```

好吧，这当然槽点很多<Shade><del>（又不是不能用）</del></Shade>，需要我们做出改进。

第一个问题是：每增加一个元素，我们就不得不重新分配一次内存，然后把原来的内容拷贝到新分配的地方。这样反复分配然后拷贝效率实在太低了，不能忍。

### 数组动态扩容的时间复杂度

分配拷贝开销太大，那就一次多分配点！一次分配原来的长度加上$M$个元素的空间，这样要连续插入$M$个元素后才会重新分配一次。

这样确实比原来要好一些，**但不够好**。

来仔细思考一下这个数组扩容问题的时间开销，考虑插入$N=kM$个元素到空数组的 **均摊时间复杂度(Amortized Time Complexity)**。

每插入$M$个元素，开销是$M$次 int 赋值，1 次分配内存和将原有的数组拷贝到新分配内存中。其中分配内存的开销与分配空间大小基本无关，记为$A$，一次 int 赋值所需的时间视为 1，那么单次插入的均摊时间是：

$$
\begin{aligned}
T_a(N) &= \dfrac{T(N)}{N} = \dfrac{T(kM)}{kM}\\
       &= \dfrac{kM + kA + \displaystyle \sum_{i=1}^{k-1} iM}{kM}\\
       &= \dfrac{k+1}{2}+\dfrac{A}{M}\\
       &= \dfrac{1}{2M}\,N + \dfrac{A}{M} + \dfrac{1}{2}\\
       &= \Theta(N)
\end{aligned}
$$

可以看到每次插入的开销是均摊$\Theta(N)$，这并不好。但从计算过程中我们可以看出，这是因为每次多分配的元素个数$M$是个固定的常量，所以消不掉时间复杂度分子上的$N$。**那是不是只要每次多分配的元素个数$M$会随当前数组长度$N$变化就好了呢?**

来试试看，我们简单取$M=\alpha N$，考虑$N=(\alpha+1)^k$，稍作计算：

$$
\begin{aligned}
    T_a(N) &= \dfrac{T(N)}{N} =\dfrac{N+kA+\displaystyle \sum_{i=0}^{k-1}(\alpha+1)^i}{N}\\
    &=1+ \dfrac{kA+\dfrac{(1+\alpha)^k-1}{\alpha}}{N}\\
    &= 1 + \dfrac{1}{\alpha}+\dfrac{1}{N}\left(A\log_{\alpha+1}N-\dfrac{1}{\alpha}\right)\\
    &= \Theta(1)
\end{aligned}
$$

可以看到这样的选择确实起到了作用，将插入的开销降到了常数均摊时间，pretty good.

:::details Q: 其他分配策略？
也许你会想有没有更好的$M=f(N)$？（也许是个愚蠢的问题）

emmm 答案是**没有**。由于插入至少需要一次赋值，插入元素的均摊开销最少也得是$\Theta(1)$。当然还有别的$f(N)$也能达到均摊$\Theta(1)$开销，不过没有必要引入比$f(N)=\alpha N$更复杂的函数啦！
:::

### 数组扩容的系数

经过前面的一同分析，我们知道扩容时额外分配的空间大小应该与当前的数组大小成正比。换句话说，**数组扩容应当遵循指数增长的策略**。但是问题来了：应该怎么选择这个系数呢？

为了方便，我们记指数增长的系数为$K=1+\alpha$. 一个当前容量为$C$的数组，扩容一次后容量变为$KC$，扩容两次后容量变为$K^2C$，以此类推。

单从时间复杂度来看，$K$越大那么均摊开销越小<Shade>虽然都是$\Theta(1)$</Shade>。但是如果$K$太大的话，大数组重新分配后就容易有很多内存浪费。所以说，$K$的取值既不能太大，也不能太小。

简单的想法是取$K=2$. 乍一看似乎挺合适，既方便计算又不太大，<Shade hover="问就是历史包袱">这也是目前 GCC 的 GNU STL 中采用的系数</Shade>。但如果使用$K=2$作为增长系数的话，**每次新分配的空间总是要大于之前所有已分配的空间之和**，这意味着内存分配器不能重用之前分配的内存。这导致更差的空间局部性和更多的内存碎片，影响程序的整体性能。

为了使分配器有机会重用之前的内存，那么$K$需要满足：

$$
\begin{aligned}
1+K+\cdots+K^{n-2}&\geq K^n,\ \forall n\in \mathbb{N}\\
\dfrac{1}{K^2}\sum_{i=0}^{n-2}\dfrac{1}{K^i}&\geq 1,\ \forall n\in \mathbb{N}
\end{aligned}
$$

注意我们需要先分配新的内存，然后才能释放掉旧的内存，因此左边需要去掉$\displaystyle K^{n-1}$这一项。

要使上面的不等式对任意$n\in \mathbb{N}$恒成立，则$\displaystyle \sup \left\{  \dfrac{1}{K^2}\sum_{i=0}^{n-2}\dfrac{1}{K^i} \right\} = \dfrac{1}{K(K-1)}\geq 1$，进而$1 \lt K \le \dfrac{1+\sqrt 5}{2}$. 在这个范围内，为了方便计算一般取$K=1.5$

> [MSVC STL](https://github.com/microsoft/STL/blob/79e80412313b86f9d0f382ad91470292ea2c303c/stl/inc/vector#L1968)和 Facebook 的[Folly(FBVector)](https://github.com/facebook/folly/blob/main/folly/docs/FBVector.md)所采用的就是$K=1.5$

### 性能改善了一点的实现

经过一通分析，现在我们来重写之前的实现。注意因为多了预分配内存的步骤，所以现在我们的数组占用内存大小和实际使用的大小是不一样的，我们分别用`capacity`和`size`来表示。经过一番周折，我们不难写出下面的代码：

```c
int capacity = 0;   // allocated memory size
int size = 0;       // array size
int *p_arr = NULL;  // array pointer

void push_back(int x) {
    if (size == capacity) {
        // corner case: when capacity is 0/1
        int new_capacity = capacity > 1 ? (capacity + capacity / 2) : capacity + 1;
        int *new_arr = malloc(sizeof(int) * new_capacity);
        memcpy(new_arr, p_arr, sizeof(int) * capacity);
        free(p_arr);
        p_arr = new_arr;
        capacity = new_capacity;
    }
    p_arr[size++] = x;
}
```

现在性能上好多了，不会再插入一个元素就要傻乎乎地搬运所有旧数据，但是...？

### 我不想看见全局变量！

是的，我不想看见全局变量！

现在的`push_back`函数采用了三个全局变量来存放动态数组的状态，这除了设计模式意味上的不好以外，还意味着同时只能有一个全局的动态数组。不过也不难修改——只需要把这些状态装到一个结构体里面，然后传递给`push_back`就好 👇

```cpp
typedef struct vector {
    int size, capacity;
    int *arr;
} vector;

void push_back(vector *self, int x) {
    if (self->size == self->capacity) {
        int new_capacity = self->capacity > 1 ? (self->capacity + self->capacity / 2) : self->capacity + 1;
        int *new_arr = malloc(sizeof(int) * new_capacity);
        memcpy(new_arr, self->arr, sizeof(int) * self->capacity);
        free(self->arr);
        self->arr = new_arr;
        self->capacity = new_capacity;
    }
    self->arr[self->size++] = x;
}

#define vector_init() ((vector){.size = 0, .capacity = 0, .arr = NULL})
#define vector_destroy(v) free((v).arr)

int main(int argc, const char *argv[]) {
    vector v;
    v = vector_init();

    for (int i = 0; i < 100; ++i) push_back(&v, i);
    for (int i = 0; i < 100; ++i) printf("%d ",v.arr[i]);

    vector_destroy(v);
}
```

现在我们把整个实现包到了一个结构体里面。为了便于初始化 vector 和清理，还定义了`vector_init`和`vector_destroy`这两个宏，似乎一切都很完整了。

### 整型溢出

好吧，还有一件事：**`size`和`capacity`会不会溢出？**

我们随手指定这两个量都是`int`类型，这其实是有问题的。因为 64 位环境下有可能出现超出`INT_MAX`大小的数组，使用`int`将无法处理。因此这里首先应该将类型改为`size_t`。

**那这样之后还会溢出吗？**

考虑到分配的内存大小是指数增长的，所以还是容易溢出，尤其是 32 位下。所以我们还需要一些修修补补：

```cpp
typedef struct vector {
    size_t size, capacity;
    int *arr;
} vector;

size_t calc_new_capacity(size_t old_capacity, size_t new_size) {
    if (old_capacity > SIZE_MAX - old_capacity / 2) return SIZE_MAX;
    const size_t new_capacity = old_capacity + old_capacity / 2;
    if (new_capacity < new_size) return new_size;
    return new_capacity;
}

void push_back(vector *self, int x) {
    if (self->size == self->capacity) {
        const size_t new_capacity = calc_new_capacity(self->capacity, self->size + 1);
        int *new_arr = malloc(sizeof(int) * new_capacity);
        memcpy(new_arr, self->arr, sizeof(int) * self->size);
        free(self->arr);
        self->arr = new_arr;
        self->capacity = new_capacity;
    }
    self->arr[self->size++] = x;
}
```

:::details Off Topic: 64 位下不会溢出？
**TL;DR: 64 位系统下，在`size_t`溢出之前，你会先 OOM.** <Shade hover="可喜可贺">可喜可贺</Shade>

虽说理论上内存扩张几百次之后就会溢出，但问题是现在并不存在能用完64位地址空间的内存——既没有能够用上 64 位全部寻址空间这么大的物理内存，又没有可以把 64 位全用来寻址虚拟内存的操作系统。常见的 64 位系统使用四级/五级页表，事实上只能寻址 48/57 位虚拟内存。

:::

### 补上`pop_back`和`reserve`的实现~

`pop_back`很简单，只要`size--`就好，并不需要回收内存。`reserve`的实现则和`push_back`中重分配内存的部分类似。

```cpp
void pop_back(vector *self) {
    assert(self->size && "pop element on empty array!");
    self->size--;
}

void reserve(vector *self, size_t new_capacity) {
    if (new_capacity <= self->capacity) return; // `reserve` never shrinks

    int *new_arr = malloc(sizeof(int) * new_capacity);
    memcpy(new_arr, self->arr, sizeof(int) * self->size);
    free(self->arr);
    self->arr = new_arr;
    self->capacity = new_capacity;
}
```

给空的数组`pop_back`是作死行为，所以加个断言<Shade>但这救不了坚持release模式调试的人</Shade>。标准规定`std::vector`这种情况下触发UB，不要求检查。

:::details 纯C部分的完整代码

反正可以折叠，就全贴在这啦~

```cpp
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct vector {
    size_t size, capacity;
    int *arr;
} vector;

/// Geometrically increase capacity
size_t calc_new_capacity(size_t old_capacity, size_t new_size) {
    if (old_capacity > SIZE_MAX - old_capacity / 2) return SIZE_MAX;
    const size_t new_capacity = old_capacity + old_capacity / 2;
    if (new_capacity < new_size) return new_size;
    return new_capacity;
}

/// Add an element at the end
void push_back(vector *self, int x) {
    if (self->size == self->capacity) {
        const size_t new_capacity = calc_new_capacity(self->capacity, self->size + 1);
        int *new_arr = malloc(sizeof(int) * new_capacity);
        memcpy(new_arr, self->arr, sizeof(int) * self->size);
        free(self->arr);
        self->arr = new_arr;
        self->capacity = new_capacity;
    }
    self->arr[self->size++] = x;
}

/// Remove and element from the end
void pop_back(vector *self) {
    assert(self->size); // don't `pop_back` on an empty array
    self->size--;
}

/// Reserve more capacity to git rid of reallocation when `push_back`
void reserve(vector *self, size_t new_capacity) {
    if (new_capacity <= self->capacity) return; // `reserve` never shrinks

    int *new_arr = malloc(sizeof(int) * new_capacity);
    memcpy(new_arr, self->arr, sizeof(int) * self->size);
    free(self->arr);
    self->arr = new_arr;
    self->capacity = new_capacity;
}

#define vector_init() ((vector){.size = 0, .capacity = 0, .arr = NULL})
#define vector_destroy(v) free((v).arr)

int main(int argc, const char *argv[]) {
    vector v;
    v = vector_init(); // ctor

    reserve(&v, 1000);

    for (int i = 0; i < 1000; ++i) push_back(&v, i);
    for (int i = 0; i < v.size; ++i) printf("%d ", v.arr[i]);
    for (int i = 0; i < 300; ++i) pop_back(&v);

    printf("\nsize: %zu, capacity: %zu\n", v.size, v.capacity);

    vector_destroy(v); // dtor
}
```
:::

## 欢迎来到 C with Class



### ctor/dtor与RAII

<!-- :::details Q: 为啥不用 realloc？
**TL;DR: 这个简陋的例子里能用，但之后会遇到其他问题。所以为了一致性这里先不用，留到后文讨论。**

`realloc`作为一个 C 标准库的函数，管的太多，在C++的应用场景下不太灵活，这在一些稍复杂的场景下会造成一些困难。

最主要的困难是`realloc`在原地扩容失败后，会自动重新分配空间并**按位拷贝**内存。这一点在 C 中没有问题（因为 C 中不存在不能直接拷贝的类型），但在 C++中就不太行了，像各种class并不能随便拷贝。
更多的问题参见[知乎：C++ vector 的 push_back 扩容机制为什么不考虑在尾元素后面的空间申请内存?](https://www.zhihu.com/question/384869006/answer/1130101522)。

此外STL容器的标准分配器也没有提供`Reallocate`方法，因此`std::vector`设计上就是扩容时需要强制拷贝的。

当然，这个`int`数组的例子当然完全可以用`realloc`（性能还会更好），不过为了一致性，这里还是使用`malloc`，后面再来讨论`realloc`。
::: -->
