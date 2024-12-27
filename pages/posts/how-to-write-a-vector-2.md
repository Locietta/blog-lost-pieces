---
date: 2023-10-04
title: C++踩坑：当你想要写一个vector（二）
tags:
  - C/C++
description: 变长数组容器，结合我现在对C++的一些理解来写写看。
---

# {{ $frontmatter.title }}

:::tip 关于代码
用到的示例代码在[Locietta/loia_vector](https://github.com/Locietta/loia_vector)中可以找到。
:::


:::danger WIP
还在施工中，猴年马月能写好吧（大概）

这部分在我本地已经放了很久了，一直都是这种半成品的样子，主要是大改博客结构之后把改过的part1给上传了，结果dead link不能通过CI，所以干脆把part2也放上来先。

:::


## 前情提要

在[当你想要写一个vector（一）](./how-to-write-a-vector.md)中，我们已经完成了一个纯C版本的变长`int`数组。

:::details 如果你忘记了，那么这是纯 C 部分的完整代码

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

而现在，我们终于要踏入C++的世界了！

### 真正开始之前：什么，C代码不能过编？！

我相信大家已经在各种地方听到很多遍“C++完全兼容C”，“C++是C语言的超集”之类的话。虽然是老生常谈，但时至今日，**C++虽然很多地方和C语言兼容，但绝非C语言的超集**。

总而言之，如果你兴冲冲地把之前的代码文件后缀名从`.c`给改成了`.cpp`，你就会发现C++的编译器对这一段代码并不满意：比如C++并不允许`void *`类型隐式转换到其他的指针类型，以及C++并不支持C99标准支持的结构体字面量（虽然`gcc`和`clang`支持这么写，但是MSVC的`cl`对此就不太高兴了）。

> C++标准化在C99标准之前，所以C99以后的C语言特性有不少是C++不支持的。

如果只按照C语言的经验来写C++会遇到不少类似这样的问题，还是要多注意，尽量按照C++的方式来写C++代码。

:::details 琐碎的修改
```cpp
#include <assert.h> // [!code --]
#include <stdio.h>  // [!code --]
#include <stdlib.h> // [!code --]
#include <string.h> // [!code --]
#include <cassert>  // [!code ++]
#include <cstdio>   // [!code ++]
#include <cstdlib>  // [!code ++]
#include <cstring>  // [!code ++]

typedef struct vector {      // [!code --]
struct vector {              // [!code ++]
    size_t size, capacity;
    int *arr;
} vector;                    // [!code --]
};                           // [!code ++]
...
        int *new_arr = malloc(sizeof(int) * new_capacity); // [!code --]
        int *new_arr = (int *) malloc(sizeof(int) * new_capacity); // [!code ++]
...
#define vector_init() ((vector){.size = 0, .capacity = 0, .arr = NULL}) // [!code --]
#define vector_init() (vector{.size = 0, .capacity = 0, .arr = nullptr})   // [!code ++]
...
```
* 使用`cstdio`而不是`stdio.h`没有什么明显的好处，只是为了和其他C++标准库的命名一致，属于编码风格喜好问题
* 在C++中结构体定义会自动将结构的名字也当作类型，不用多写`typedef`了
* `vector{.size=...}`这样的按成员名初始化的语法在C++20才被支持
* 关于`nullptr`：由于C++不允许`void*`隐式转换为其他指针，`NULL`只能被定义为`0`（而不是C中的`((void *)0)`），然后再在语法上开洞允许用字面量`0`给指针赋值。但这么搞参数为`NULL`的函数重载就又不对了，最后在C++11给空指针单独弄了个类型来解决这毛病。现在C++代码里尽量只写`nullptr`就好。
:::

## 生命周期与RAII

### 手动初始化和销毁有什么不好？

回顾一下纯C版本的`vector`，我们用`vector_init`初始化，用`vector_destroy`来清理。手动进行的操作有一点不好：**如果你忘记了**，就会造成灾难性的后果。如果能让编译器自动为我们插入这些初始化和清理代码就好了。

欸，等等，你可能会说：不就是成对使用初始化和清理嘛，有什么难的？但事情可能没有你想象得那么简单，来看以下例子👇

```cpp
int foo(void *data) {
    // assuming `data` is actually a `vector*`
    free(data); // leak!

    vector v = vector_init();
    // ... long tedious code

    if (some_flag) {
        // leak!
        return 1;
    } else {
        bar();
    }
    vector_destroy(v);
    return 2;
}

void bar() {
    // leak!
    longjmp(env, 1); // poor man's exception handling
    exit(1);
}
```

以上是掉坑的若干种姿势：
* 堆上的`vector`在`free`掉之前必须先调清理代码
* 代码块有多个出口时，每个出口处都要调清理代码
  > 注意不一定是函数`return`，也包括循环`break`/`continue`，以及`goto`等
* 在内层的函数调用出现`longjmp`或者`exit`一类的可以直接中断当前函数的调用
  > 这种情况下没法写清理代码

总而言之，我们总是希望变量产生时立即被初始化，否则我们没法使用；而在变量被消灭时立即进行清理，否则会造成资源的泄露。而变量的产生与消灭我们就称为这个变量的**生命周期**。

栈上变量的生命周期很明确，就是它们的作用域，由花括号来标识。变量一旦离开它们的作用域就被摧毁，生命周期随之结束。而堆上变量的生命周期从`malloc`开始，到被`free`结束。

如果能让编译器自动在变量产生时插入初始化代码，而在变量被消灭时插入清理代码，那么就能杜绝遗忘，并且能减少程序员的心智负担——不用时刻记着要清理啦。

出于这样的考虑，在C++里我们可以给结构体自定义初始化和清理代码。我们把它们叫做**构造函数**和**析构函数**，或者简称**ctor**和**dtor**.

因此那两个宏在C++中就可以被如下的写法所代替：

```cpp
struct vector {
    size_t size, capacity;
    int *arr;

    vector() : size(0), capacity(0), arr(nullptr) {}
    ~vector() { free(arr); } // safe to free a nullptr
};

int main() {
    vector v; // ctor inserted by compiler
    // ...
    // v.~vector(); // manually calling dtor
    // ...
    
    // dtor inserted by compiler
}
```

对于**栈上变量**，编译器会在变量产生的地方自动插入ctor，在变量离开作用域时自动插入dtor.

当然也可以手动调用dtor提前结束变量的生命周期，但这之后再使用这个变量就会引发未定义行为了。

而对于**堆上变量**，编译器没法直接帮我们插入ctor和dtor，因此C++加入了新的分配与释放机制：`new`和`delete`. `new`在分配完内存之后会调用对应类型的ctor，`delete`在释放内存之前会先调用对应的dtor. 这样只要我们使用`new`和`delete`，就可以正确地处理带有ctor/dtor类型的分配和释放了。

这样一来，借助构造与析构的机制，我们可以把资源的获取和释放同变量的产生与消灭绑定在一起。这也就是我们常说的**RAII(Resource Acquisition Is Initializadtion)**，所谓**资源获取就是初始化**。如果要获取某个资源，那么只需创建一个管理该资源的对象；如果要释放资源，那么只需销毁这个对象，由对象为你释放资源。这里面资源可以是内存，也可以是系统句柄、数据库链接、文件、套接字等等。

::: details 关于RAII的一点个人看法
其实我个人感觉虽然RAII里面提到了初始化，但RAII里面析构的重要性实际上是大于构造的。

像Rust实际上就没有C++这样的构造函数，而是使用类似我们纯C方案里面类似的语法来初始化一个对象。

```rust
struct Foo {
    a: u8,
    b: u32,
    c: bool,
}

let foo = Foo { a: 0, b: 1, c: false };
```

即使在C++中，也有不少人采用工厂模式而不是构造函数来初始化对象。

说到底想要自己手动添加清理代码实现析构的效果，不借助编译器基本难以做到也不便于维护。但是在变量定义的地方加个初始化就简单得多了，而且也比隐式地调用一大堆初始化代码更符合直观一些。

```cpp
// maybe tons of work in its ctor, but hard to notice at first glance
Foo foo;

// easy to see there's something happening here
Bar bar = Bar{.x = 1, .y = 2};
Bar baz = make_my_complex_bar(123, handle);
```
:::

## 异常！

