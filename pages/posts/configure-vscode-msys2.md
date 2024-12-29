---
date: 2021-08-18
title: 给萌新的C/C++环境搭建攻略（VSCode和MSYS2）
not_append_title: true
tags:
  - vscode
  - windows
  - MSYS2
  - C/C++
  - 配置
description: 使用vscode+MSYS2在windows上搭建C/C++环境，新手向
---

![Miyu老师的光光](https://pic1.zhimg.com/v2-4198e7216b1e05c319bd739f3b0d2223_1440w.jpg?source=172ae18b)

# 给萌新的 C/C++环境搭建攻略（VSCode 和 MSYS2）

## 0. 前言

本文写给刚接触编程、希望了解一些原理的 CS**萌新**，会介绍一些基本的概念并且推荐一些方便的工具。

> - 像这句话一样写于引用块中的内容一般为补充内容，第一次阅读时可以略过。
> - 由于是面向新手的文章，所以会比较啰嗦
> - 不定期更新

本文首发于知乎：[👉 链接 👈](https://zhuanlan.zhihu.com/p/401188789)

## 1. 预备知识

- 请善用**搜索引擎**搜索不太明白的新名词是什么意思，面向[StackOverflow](https://stackoverflow.com/)/Google/Baidu 编程是不可避免的一环。

由于**VSCode 本质上是个高级记事本**，因此配置它需要一些前置知识。

### 1.1 源代码和编译

**源代码文件**是存放代码的**文本文件**，C 代码文件的后缀名一般为`.c`，C++代码文件的后缀名一般为`.cpp`，头文件的后缀名一般为`.h`，它们都是文本文件（所以可以用记事本打开编辑）。

文本文件是不能运行的，所以我们需要把写好的代码翻译成机器能够执行的形式，这个过程就被称为**编译**。用来编译代码生成可执行文件的程序被称为**编译器**，目前主流的 C/C++编译器有 MSVC(`cl.exe`)、GCC(`gcc/g++`)和 LLVM(`clang/clang++`)

> 准确地说源代码文件要变成可执行文件需要进行**预处理**、**编译**、**汇编**、**链接**等步骤，可以参阅[这篇文章](https://zhuanlan.zhihu.com/p/397319639)

### 1.2 命令行和环境变量

命令行界面就是科幻电影中常见的那种全是字符的界面，我们通过输入一些命令来执行操作。

windows 上自带的 cmd 和 powershell 就是命令行界面，可以按 Win+R 输入`cmd`或`powershell`来启动它们。启动后会有一串字符提示你现在在哪个路径下，我们可以通过`cd`命令来切换当前所在的路径。

> 小技巧：在文件管理器按 F4 会跳到路径栏，输入 cmd 并回车即可在此文件夹打开 cmd（不用再`cd`了）。
>
> - 不知为何 windows 自带的 powershell 不能这么打开
> - win11 的用户可以直接右键在当前路径打开 Windows Terminal

#### 1.2.1 在命令行界面运行程序

只要输入一个程序的相对路径或者绝对路径，就能够运行那个程序（可以不用写`.exe`）

以 powershell 启动 steam 为例：

```powershell
# powershell启动steam
cd E:\steam_main # 首先cd到steam.exe所在的文件夹
.\steam

# 或者直接使用绝对路径
E:\steam_main\steam
```

> powershell 需要`./<名字>`或者`.\<名字>`来运行当前路径下的程序，但 cmd 应直接输入`<名字>`

#### 1.2.2 path 变量

每次都需要输入程序的路径当然相当麻烦，有没有办法简化一点？

答案就是利用**path 变量**。

path 变量顾名思义，其中存放了一系列的路径。当你在命令行输入的程序不在当前目录下时，系统就会**依次**去这些路径里找有没有名字一样的程序。所以只要我们把程序的路径加入到 path 变量，就可以在任意路径下运行它啦。

例如：将`E:\steam_main`添加到 path 变量中后，就可以在任意路径下输入`steam`来启动 steam

#### 1.2.3 修改 path 变量

Win+S 搜索 path，选择**修改系统环境变量**，点开**环境变量**，然后在用户变量（只对当前用户起效）或者系统变量（对所有用户起效）中找到 path 变量，双击修改即可。

> - Windows 的环境变量有 2047 字符的最大长度限制，所以不要随便什么东西都往 path 变量塞
> - 顺便一提，windows 单个路径的长度也有 260 字符的限制（不要问我是怎么发现这一条和上一条的

### 1.3 编辑器和 IDE

**编辑器**指的是用来编辑源代码文件（文本文件）的程序，windows 自带的记事本就是一种编辑器。编辑器可以提供代码高亮、补全等功能，**但本身并不负责把代码编译成可执行文件**，所以需要和编译器搭配使用。

**集成开发环境**（**IDE**），是把编辑器、编译器和其它组件整合到一起的一整套程序。可以直接用它编写代码、编译、调试程序等等，但一般需要你先建一个工程。例如[Dev-C++](https://devcpp.gitee.io/)就是经典的 C++ IDE.

**VSCode 是一种编辑器**，因此需要我们另外下载编译器来编译代码，并且通过一些设置使 VSCode 能方便地调用编译器并运行编译出来的程序。

所以我们需要做的就是：

- 下载安装 C/C++编译器
- 下载安装 VSCode
- 设置 VSCode

## 2. 下载安装编译器

首先要下载一个编译器用来编译我们的代码。

本文使用 GCC 作为编译器，在 windows 系统上，推荐通过**MSYS2**来安装它。

### 2.1 MinGW/MinGW-w64

如果自己搜索过如何在 windows 上安装 gcc 的话，一定听说过**MinGW**。GCC 本身是 Linux 上的编译器套件，不能在 windows 上运行，而 mingw 则是 gcc 在 windows 上的移植。

最早的 mingw 项目只支持编译 32 位程序，后来分支出的 mingw-w64 项目则同时支持编译 32/64 位程序。

网上其它教程的 mingw 一般都来源于[MinGW 原项目](https://osdn.net/projects/mingw/)（gcc 版本`9.2.0-2`，只能编译 32 位程序），或者[MinGW-w64 的 SourceForge](https://sourceforge.net/projects/mingw-w64/files/)（以前可执行文件会放在这上面，但是现在只更新源代码，所以 gcc 版本停留在`8.1.0`），版本都相对比较古旧，**不推荐到这两处地方下载 mingw**。

mingw-w64 项目目前的状况比较复杂，有多个发行分支，具体可以参看[官网的下载页](https://www.mingw-w64.org/downloads/)。目前 windows 上最新、最靠谱的发行分支就是**MSYS2**（gcc 版本`12.2.0-6`）。

> 关于 mingw 和 mingw-w64 的渊源，可以看[这篇科普](https://github.com/FrankHB/pl-docs/blob/master/zh-CN/mingw-vs-mingw-v64.md#:~:text=MinGW%20%E5%92%8C%20MinGW%2DW64%20%E6%9C%89%E4%BB%80%E4%B9%88%E5%8C%BA%E5%88%AB%EF%BC%9F)

### 2.2 MSYS2

**MSYS2**(Minimal SYStem 2)是与 mingw-w64 配套的**命令行环境**，它为 windows 提供了类似 linux 的命令和**包管理器**`pacman`，可以直接在命令行查找、安装和卸载各种第三方库和开发工具。

```bash
# 比如你想要安装opencv库
pacman -Syy mingw-w64-ucrt-x86_64-opencv
```

> - `pacman`同时是 ArchLinux 的包管理器（就像 MacOS 上的`homebrew`和 Ubuntu 上的`apt`一样），具体使用办法可以查阅[ArchWiki(中文)](<https://wiki.archlinux.org/title/Pacman_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)>)
> - 实际上 MinGW 也有一个配套的**MSYS**，但它没有包管理器
> - git bash 实际上是一个**删减版的 MSYS2**，在安装文件夹下可以看到 MSYS2 的目录结构，但它也没有包管理

### 2.3 安装 MSYS2 和 mingw 编译器

#### 2.3.1 下载安装 MSYS2

安装 MSYS2 很简单，前往[MSYS2 官网](https://www.msys2.org/)下载安装程序即可。安装过程就是选安装位置，然后一直点下一步，没有什么需要特别注意的地方。

![点击图中所示位置下载MSYS2](https://pic4.zhimg.com/80/v2-77b7be8e2d0cd35e10aee95ac2713e35.png)

> 可能在这一步会遇到网络问题，访问不了官网或者下不了安装包。可以考虑去清华镜像站或者科大镜像站下载：
>
> - 清华镜像：https://mirrors.tuna.tsinghua.edu.cn/msys2/distrib/x86_64
> - 科大镜像：https://mirrors.ustc.edu.cn/msys2/distrib/
>
> 注意 windows 安装包的名字类似于`msys2-x86_64-20221028.exe`，不要下载`*.tar.xz`的，那是 Linux 的压缩包

#### 2.3.2 MSYS2 的子环境（选读）

MSYS2 实际上是由 6 个独立的子环境组成的。每个子环境会有一个单独的文件夹，和一个专门的命令行界面入口，具体区别见下图。一般来说，直接使用**UCRT64**就行。

![MSYS2包含的几个子环境](https://pic4.zhimg.com/80/v2-f00bbacc77a4113fbae255ff19c69941.png)

打开 MSYS2 的安装目录，可以看到这些子环境的位置。刚安装好 MSYS2 的话，除了 usr 文件夹以外，其它的子环境文件夹里应该还都是空的。

![MSYS2的安装目录结构](https://pic4.zhimg.com/80/v2-4f87bed7af53a014a1c626003b34d078.png)

一般来说，每个子环境下都有`bin`（含编译器的可执行文件等）/`include`（标准库和安装的第三方库头文件）/`lib`（动态库和静态库等）等文件夹，如果遇到问题可以去相应的路径查看。

> 详细解释一下几个子环境的区别：
>
> - MSYS 环境是基础环境，包含各种 linux 命令行工具（例如`pacman`等），其它子环境都继承于它。但在这个子环境里编译的程序**依赖于 MSYS2 的动态库**，因此直接把编译出来的`.exe`发给其他人的话会无法运行，需要带上`/usr/bin`文件夹下的`MSYS-2.0.dll`等依赖库才行。**一般不建议使用**。（需要完整 linux 环境的请考虑**WSL**或者虚拟机）
> - MINGW64 环境编译的程序不依赖 MSYS2，只依赖于 windows 自带的 C 语言库`msvcrt`，较为通用。
> - UCRT64 与 MINGW64 类似，但依赖于比较新的 C 语言库`ucrt`，这个库 win10/11 自带，也是目前微软家的[Visual Studio](https://visualstudio.microsoft.com/zh-hans/)使用的库，但 win7/XP 可能需要手动安装。未来将会替代 MINGW64。
> - CLANG64 环境使用 LLVM 工具链而非 GCC 工具链，所有配套环境都是基于 LLVM 的（比如这个环境里的`gcc.exe`其实是`clang.exe`的重命名）。
> - MINGW32 和 CLANG32 顾名思义，使用 32 位的 mingw/clang 工具链，如果没有特殊需求基本不用考虑，用 64 位版本就好。
>
> 最早只有 MSYS，MINGW64 和 MINGW32 三个子环境，子环境数量由于开发的需要正在增加，将来可能还会加入 CLANGARM64(可用于 Android 程序编译)

#### 2.3.3 使用 pacman 安装编译器

打开 MSYS2 命令行，输入`pacman -Syu`同步更新所有工具，然后输入`pacman -S  mingw-w64-ucrt-x86_64-toolchain`安装 mingw-w64 工具链。中间出现询问之类的一路回车就好，等待一段时间后应该就安装完毕了。

![安装mingw工具链](https://pic4.zhimg.com/80/v2-9a85c3eb240ae56afabf39b9bfc923c0.png)

安装完成后 ucrt64/bin 文件夹下应该能找到`gcc.exe`，然后将此路径**加入环境变量**。

如果一切正常，那么打开命令行，输入`gcc --version`应当能显示`gcc`的版本，MSYS2 目前的 gcc 版本是`12.1.0 Rev2`。

如果提示找不到 gcc 或者 gcc 不是批处理等错误，可以尝试关闭重开 powershell/cmd 再次尝试，如果仍然失败，那么应当是环境变量没有设置对。

![检查gcc版本](https://pic4.zhimg.com/80/v2-dc2092e5086fb4fb6e3b2fe51158953c.png)

如果没有问题，那么我们的编译器就**安装成功**啦。

### 2.4 在命令行使用 gcc（选读）

事实上，我们现在已经可以写 C/C++代码并运行了。例如，新建一个文本文件`hello.c`，内容如下

```c
#include <stdio.h>

int main(void) {
    puts("Hello, world!");
    return 0;
}
```

然后在这个路径下命令行输入`gcc hello.c -o hello`，就能生成一个`hello.exe`文件，在命令行运行它就能看到输出。（不要双击运行它，因为运行结束后默认会退出命令行界面，你就看不到输出了！）

![命令行编译运行](https://pic4.zhimg.com/80/v2-caa200da383ad6352a22643115ab2eaf.png)

简单来说，输入`gcc <源代码文件> -o <输出程序名字>`就可以将 C 代码文件编译成指定名字的可执行文件。而对于 C++代码，将 gcc 换成 g++就行。

如果你能接受使用**Notepad2**之类的轻量化编辑器加上手打命令行编译运行的话，也够应付刚入门时的各种单文件小程序了（不过缺点是不能调试）。

而在 VSCode（和各种 IDE）中，本质上就是将这里这个手动输入命令行的过程自动化了。

> 详细的 gcc 使用说明可以参考[这个](https://www.runoob.com/w3cnote/gcc-parameter-detail.html)，不过如果英文可以的话建议还是看[GNU 手册](https://gcc.gnu.org/onlinedocs/gcc-10.3.0/gcc/Option-Summary.html#Option-Summary)

## 3. 安装并配置 VSCode

### 3.1 下载安装 VSCode

去[VSCode 官网](https://code.visualstudio.com/)下载安装包，按照提示安装就行。

建议勾选在右键菜单中添加“通过 code 打开”，方便我们在指定位置打开 vscode。

![勾选“通过code打开”这两项](https://pic4.zhimg.com/80/v2-a0742a5f74ae6d764145fa0285aa1713.png)

### 3.2 VSCode 操作简介

简单介绍一下常用的 VSCode 操作。

#### 3.2.1 内置命令行

VSCode 内置了命令行，按下快捷键`` Ctrl+` ``，就可以调出内置的集成终端以便使用。VSCode 默认使用 powershell 作为终端。

#### 3.2.2 常用快捷键

- `F1/Ctrl+Shift+P`：查找运行 vscode 命令
- `Ctrl+,`：打开 vscode 设置
- `Ctrl+Shift+K`：删除整行
- `Alt+上下方向键`：移动行
- `Shift+Alt+F`：代码格式化
- 按住`Alt`用鼠标点选可以选中多处
- 按住`Shift+Alt`可以鼠标拖动多选
- `Ctrl+D`选中一个单词，`Ctrl+L`选中一整行

### 3.3 安装插件

初次进入 vscode 的话，会是全英文界面，需要安装中文插件来切换到中文，一般来说现在会在右下角弹出来，点击安装就行。

然后打开插件栏，搜索安装 C/C++和 Code Runner 插件，用来提供 C/C++代码高亮和编译运行 C/C++代码。

![安装插件](https://pic4.zhimg.com/80/v2-14af64c1944cc6be2dee8252acb2c841.png)

打开设置，**勾选 code runner 插件设置中的 run in terminal 选项**，让代码在 vscode 的集成终端里运行，这样才能在命令行输入。

### 3.4 受信任文件夹

vscode 最近的更新增加了一个信任工作区，每打开一个新的文件夹都会提示你是否信任，这个功能挺麻烦的，可以关掉。

使用`Ctrl+,`打开设置，搜索“信任”，取消勾选“启用工作区信任”，即可关掉这个功能。

## 4. 运行与调试 C/C++代码

### 4.1 单文件的运行

对于单个源文件的 C/C++代码来说，可以直接使用 code runner 来运行。只要点击右上角的小三角形，或者使用快捷键`Ctrl+Alt+N`就能编译运行 C 语言代码。

> 其实可以看到，code runner 的原理就是自动在命令行输入编译和运行的命令，和我们自己手动输入命令没有区别。
>
> 输入的命令也可以在相应的插件设置中进行修改。

![使用code runner运行C代码](https://pic4.zhimg.com/80/v2-f89550f28288cb353b79812f3555c2e0.png)

### 4.2 单文件的调试

按下 F5，依次选择 C++(GDB/LLDB)和我们 MSYS2 环境中的 gcc.exe，VSCode 会自动生成配置文件，并生成调试。

![](https://pic4.zhimg.com/80/v2-ebe3544a15810cb74c3af23768fe25d3.png)

![](https://pic4.zhimg.com/80/v2-186ac960eca266c963ac00304cedce39.png)

可以在行号的左边单击来设置断点，程序运行到断点前会自行中断。左侧可以看到此时各个变量的值，监视栏中可以输入表达式观察。

![VSCode调试界面](https://pic4.zhimg.com/80/v2-b085d9f9266995f4e6ad0f3c609d0d0f.png)

另外，目前 VSCode 支持了**条件断点**，只要右键断点，选择编辑断点即可设置中断条件，具体使用方法可以参考[VSCode 文档](https://code.visualstudio.com/docs/cpp/cpp-debug)。

![VSCode的条件断点](https://pic4.zhimg.com/80/v2-b31b3cc18ef93a4cec50ff3ee0004157.png)

**至此，可以愉快地写代码啦。**

---

下面的内容是一些工具推荐和踩坑经验，留给有**一定基础**的 C/C++**初学者**。

## 5. 踩坑经验和工具推荐

### 5.1 多文件编译和调试

读者可能会注意到上一节中我们只提了**单文件**的运行和调试，没有提到多文件的运行及调试。

这是由于用 VSCode 多文件编译，不可避免地需要涉及**C/C++编译系统**的概念，不太适合刚入门的初学者学习，这里给出几种方案和一些参考链接。

简单来说，编译系统要解决的基本问题有两个：一个是**哪些文件需要以何种方式被编译到一起**，另一个是**当某个文件被修改的时候，哪些文件需要被重新编译**。这一般需要我们编写配置文件（Makefile, CMakeLists.txt 等）来描述各个代码文件间的关系，然后相应的程序可以根据配置文件调用编译器完成编译。

> [这篇文章](https://zhuanlan.zhihu.com/p/29910215)以 make/automake 为例，讲解了编译系统是如何从脚本开始演化为现在的样子的。写的很好，只是作者已经不在知乎了。

#### 5.1.1 Make

Make 是最原始的 C/C++编译系统，语法简单，是 linux 原生的多文件编译方案。需要注意的是 mingw 项目中的 make 叫做`mingw32-make`，需要复制一份**重命名**为`make`.

> 详细的 make 指南可以查阅[这里](https://seisman.github.io/how-to-write-makefile)。

我最初多文件运行/调试使用的就是 make，可以调整 code runner 的命令行来使用 make 进行编译，调试的话则要自己调整`task.json`文件。

不建议初学者自己在 VSCode 上配置 makefile 工程，比较麻烦。我写了一个[VSCode 的 makefile 工程模板](https://github.com/Locietta/vscode-makefile-template)放到了 Github 上，感兴趣的可以查看和使用（有问题也可以直接提交 issue）。

#### 5.1.2 CMake+Ninja

当然 make 已经是相当古老的工具了，如今最为广泛使用的 C/C++编译系统是[CMake](https://cmake.org/)。CMake 的优点是可以生成其它工具和 IDE 的配置文件，便于我们编写跨平台、跨 IDE 的 C/C++工程。

VSCode 对 CMake 的集成很不错，有微软官方的[cmake-tools 插件](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cmake-tools)支持，可以不编写`launch.json`和`task.json`直接根据 cmake 当前的配置进行运行和调试。如果检测到路径中有[ninja](https://ninja-build.org/)，则会自动调用 ninja 加速编译。

在 MSYS2 中使用`pacman -S mingw-w64-ucrt-x86_64-cmake mingw-w64-ucrt-x86_64-ninja`即可在 UCRT64 环境中安装 cmake+ninja.

如果想学习 CMake，那么可以看[CMake Cook Book](https://www.bookstack.cn/read/CMake-Cookbook/README.md)和[Modern CMake for Cpp](https://github.com/xiaoweiChen/Modern-CMake-for-Cpp/releases)这两本书。（都是中文版，由同一位大佬翻译）。

> [CMake 的官方文档是出了名的烂](https://www.zhihu.com/question/276415476#:~:text=%E7%AC%AC%E4%BA%8C%EF%BC%8CCMake%E6%B2%A1%E6%9C%89,%E6%AD%A3%E7%A1%AE%E7%9A%84%E6%96%B9%E5%BC%8F%E3%80%82)，强烈不建议直接硬啃文档来学 CMake. 仅推荐必要时查阅。

#### 5.1.3 xmake

总之如果你使用了一段时间 cmake，你就会发现 cmake 用起来总是有各种各样让人不舒服的地方，由国人开发的[xmake](https://xmake.io/#/zh-cn/)可能是它的一个更好的替代。

xmake 相比 cmake 更快，集成度更高（集成了**包管理**和分布式编译等），给我的感觉就像 C/C++版本的`cargo`(rust 邪教(不))。而且也支持[直接集成使用 cmake 等其他编译系统的 C/C++项目](https://xmake.io/#/zh-cn/package/local_3rd_source_library)，减少迁移成本。

插件支持方面，vscode 上也有 xmake 的插件支持，能提供和 cmake-tools 插件类似的功能，总之推荐尝试一下。

> 唯一的问题就是用的人比较少，而 CMake 最大的优点就是大家都在用...

**一些注意事项：**

- 使用`pacman -S mingw-w64-ucrt-x86_64-xmake`可在 UCRT64 环境中安装 xmake。不过这样`xrepo`只能在 UCRT64 的 shell 里用，在外面用需要写个 wrapper 脚本
- 或者也可使用 windows 上的包管理器[scoop](https://scoop.sh/)来安装原生的 xmake，命令是`scoop install xmake`，没有上述问题
- 开始使用前需要用`xmake g --mingw=$env:MSYS2\ucrt64`设置 mingw 的路径（如果你用 cmd，那么是`xmake g --mingw=%MSYS2%\ucrt64`）
- 其他设置可以去看[xmake 官网](https://xmake.io/#/zh-cn/guide/configuration)，并善用浏览器`ctrl+f`搜索

### 5.2 第三方库的安装和使用

C/C++最让人头疼的地方之一就是如何安装和使用第三方库了，对新手来说编译一个第三方库的项目基本上是个噩梦，遇到错误往往摸不着头脑。

#### 5.2.1 第三方库的安装

本文选用 MSYS2，一个主要的考虑就是为了方便安装第三方库。只需要`pacman -Ss`搜索一下库的名字，再按搜出来的名字`pacman -S`安装就行了，大部分常用的第三方库都能找到。头文件安装在`子环境名/include`，库二进制文件则安装在`子环境名/lib`下，这两个路径是编译器的默认搜索路径。

> - 如果使用过 python，那么可以把`pacman`理解为类似于`pip`一样的东西。
> - 需要先`pacman -Ss`搜索，因为除了 MSYS 子环境，包名通常会有一个很长的前缀，和库本身的名字并不相同。例如`pacman -S cmake`安装的是 MSYS 子环境的 cmake，要安装 ming64 子环境下的 cmake，则应该是`pacman -S mingw-w64-x86_64-cmake`

#### 5.2.2 第三方库的使用

**头文件 include 错误**

因为头文件直接装在了默认搜索路径里，所以一般安装完毕后直接`#include <...>`就可以了。

但是也有例外，比如 OpenCV 的头文件是在默认路径的一个子文件夹下，是一个独立的 include 系统，这时候需要为编译器指定`-isystem <路径>`选项。

**undefined reference**

这种情况是因为编译器不知道某个库函数的实现在哪。你需要使用 gcc 的`-l`选项链接安装的库，比如`g++ a.cpp -lfmt`就是指定编译`a.cpp`的时候要链接`libfmt.a`库文件。如果不知道库文件的名字，可以去`lib`文件夹下查看。

**命令行好麻烦**

你会觉得手动书写上述命令行好麻烦，对吧？如果你使用 cmake 或者 xmake 的话，只需要使用`find_package(库)`(cmake)或者`add_requires("库")`(xmake)就行了。它们会自动帮你处理上述的两个问题的。

> - 对 cmake 来说，库的名字应该填`/share/cmake/Modules`下的`Find<库名>.cmake`所对应的名字
> - 对 xmake 来说，上述 cmake 的包可以用`add_requires("cmake::<库名>")`来找到，也可以指定其他来源，或者直接从远程下载. 可以用`xmake l find_package <库名>`来测试是否能够找到想要的库。

#### 5.3 杀毒软件

杀毒软件实时监测磁盘上的文件，会拖慢 windows 上的编译速度。特别是当项目较大，生成的文件比较多时，影响更为明显。此外，部分杀软还会将我们自己编写的程序识别为病毒。因此最好将常用的编写代码文件夹加入杀软的白名单/排除项。

> 但不管怎么样，windows 上的编译速度一般还是比 linux 上慢不少

### 5.4 其他事项

#### 5.4.1 Clang/LLVM 工具链

这部分曾经想单独开一篇文章写，现在想想似乎也没有那么多内容，就在这里简要介绍一下吧。

- `clangd`配合 vscode 上的同名插件，可以提供比 vscode 官方 C++插件更好更快的**语法高亮**支持，不过需要注意生成`compile_commands.json`。（**强烈推荐**）
- `lldb`配合 CodeLLDB 插件提供更加强大的**调试**功能（可以调试 Rust 代码，可以嵌入 python 脚本来在调试时做内存可视化），不过如果不写 rust 的话与官方插件差别不大，可酌情安装
- `clang-format`是现在通用的 C/C++**格式化**工具，vscode 的 clangd 插件和 C++官方插件都支持它，不必额外安装插件
- `clang-tidy`是一个基于 AST 的**代码规范**工具，可以自动检查出代码中性能不佳或者不合代码规范的问题，对于部分问题还可以提出修复方案。clangd 插件对其有部分支持，完整支持需要独立插件，请酌情安装

安装则只需用`pacman`把 UCRT 环境的 clang-tools-extra 和 lldb 安装上就行了。如果启用 clangd，但仍想使用官方插件的调试功能，可以在设置把官方插件的 intellisense engine 和 autocomplete 都给关掉以免冲突。

#### 5.4.2 Windows Terminal

如果你在电脑上安装了很多环境，就会发现有一大堆各种不同的命令行入口，管理起来十分不便。使用 windows terminal 可以将各种命令行界面入口整合到一起，界面也更加美观，还能改善部分命令行界面的复制粘贴体验（点名批评 MSYS2/git bash 这一系列的 shell）。

![使用windows terminal管理各种命令行入口](https://pic4.zhimg.com/80/v2-d531eff13e8f1995d0e6849a70cddfb3.png)

windows terminal 可以直接在 win10 自带的微软商店里免费下载。而在 win11 则是默认的命令行程序（但是仍然推荐去商店更新一下，因为自带的版本比较古旧，甚至没有图形化的设置界面）。

#### 5.4.3 WIN7/8

已经是 2022 年了，由于[Cygwin 即将移除 win7/win8 的支持](https://cygwin.com/pipermail/cygwin-announce/2021-October/010271.html)，MSYS2 也将紧随其后，[在 2022 年底结束对 win7/8 的支持](https://github.com/msys2/MSYS2-packages/issues/2696)（但应该仍然支持 win8.1）。

MSYS2 官方有计划为 win7/8 提供[msys2-archive 镜像](https://github.com/msys2/msys2-archive)，但相关工作似乎还没有开始。如果你还留在 win7/win8，那么你可能需要考虑 MSYS2 的替代品。使用一个更老的工具链，然后使用 xmake/conan 来管理包依赖或许是一个可行的选择。

#### 5.4.4 把`%MSYS2%/usr/bin`加入 path 变量？

**这是个危险操作**，不是很建议这么干，因为很可能遇到很多环境冲突问题。如果你需要在 cmd 里面执行 linux 的命令，考虑利用 wsl1. 如果需要在 MSYS2 的 shell 外面使用子环境的命令，那么可以新建如下`msys2.cmd`文件放到 path 变量中的路径下。

```batch
@echo off
if "%1"=="" goto noarg
%MSYS2%\msys2_shell.cmd -defterm -no-start -here -msys2 -c "%*"
goto :eof
:noarg
%MSYS2%\msys2_shell.cmd -defterm -no-start -here -msys2
```

这样一来，我们就可以在 powershell/cmd 中直接使用`msys2 <command>`来在 MSYS 子环境中运行命令，例如运行`msys2 pacman -Syyu`直接更新 msys2.

如果不给参数直接输入`msys2`则会进入 MSYS 环境，输入`exit`可以退回到原来的 shell.

> - UCRT64/MINGW64 环境的 wrapper 脚本也类似，见[我的 github 仓库](https://github.com/Locietta/useful-script/blob/master/wrappers)
>
> 如有可能，也请尽量避免将 MINGW64/UCRT64 的 bin 路径加入 path。使用专用的 shell 或者使用 wrapper 可以避免污染系统环境。

#### 5.4.5 在`pacman -Ss`中屏蔽掉不想要的子环境

打开`%MSYS2%/etc/pacman.conf`，到最下面用`#`注释掉不想要的子环境源。

```ini
# 如果不想在pacman -Ss里看到mingw32环境的包

#[mingw32]
#Include = /etc/pacman.d/mirrorlist.mingw
```

#### 5.4.6 让 pacman 优先使用国内镜像

`pacman`默认优先使用 MSYS2 官方源，在国内的速度可能比较慢，可以考虑修改配置让它优先使用国内的镜像（比如科大或者清华的）。

去`%MSYS2%\etc\pacman.d`路径下，找到`mirrorlist.<子环境>`文件，然后把其中 USTC 或者 TUNA 的链接移到最上方即可。

例如，将`Server = https://mirrors.ustc.edu.cn/msys2/mingw/ucrt64/`移到`mirrorlist.ucrt64`的最上方，即可让 UCRT64 子环境的包优先使用科大镜像下载。

## 6. 推荐的参考书和工具网站

#### 6.1 入门 C/C++的用书推荐

- C Primer Plus （C 语言的内容）
- C++ Primer Plus （C++11 及以前的内容）
- [高速上手现代 C++](https://changkun.de/modern-cpp/) （现代 C++(C++11/14/17/20)的新发展，建议配合上一本食用。本书仍在写作中，作者是国人大佬，目前[开源在 Github 上](https://github.com/changkun/modern-cpp-tutorial)）

> 如果能魔法上网，那么也可以关注油管上[Cpp Conference 的频道](https://www.youtube.com/user/CppCon/videos)，通过 Cpp 会议大牛的演讲来了解 C++.

#### 6.2 常用的工具网站

- C/C++的各种标准库函数怎么用可以查阅[cppreference](https://en.cppreference.com/w/Main_Page)或者[cppreference(中文)](https://zh.cppreference.com/w/%E9%A6%96%E9%A1%B5)。这个网站的内容基于 C 和 C++最新的标准草案内容编写，关于标准库的内容最新，也最齐全。

![cppreference](https://pic4.zhimg.com/80/v2-66e3893a58dd00da0175038d3910000c.png)

- 在线编译器网站：[compiler explorer](https://godbolt.org/). 可以在线编译 C/C++的函数，观察不同的编译器，不同的优化级别下生成的汇编代码。同时也支持 rust，haskell 等其他语言。

![compiler explorer](https://pic4.zhimg.com/80/v2-1497247a96db6ecfe71c6fa7439ba98b.png)

- 在线对比两段代码的速度：[Quick C++ Benchmark](https://quick-bench.com/q/eP40RY6zDK-eJFdSSPBINa0apTM). 基于 Google 的 benchmark 框架，需要学习 google benchmark 的语法才能使用。

![Quick C++ Benchmark](https://pic4.zhimg.com/80/v2-f01b7d805a085aee21a919be7b523c33.png)

## 结语

各种配置过程已经在虚拟机上测试过了，应当没有问题，也欢迎各位交流讨论。

**最后感谢各位耐心阅读~**

### Change Logs

#### 2022/12/16

- 补充关于 MSYS2 国内镜像相关内容
- 添加两本 CMake 学习用书，CMake 的文档太差了
- 更新了子环境 wrapper

#### 2022/06/28

- 添加 ChangeLog，替换了部分老旧链接
- 修正一些错误，重写了#5
- 考虑到 win7/8 即将结束支持，子环境选择上改为推荐 UCRT64
- 由于我已经迁移到 win11，所以增加了一些 win11 相关内容

#### 2021/11/19

- 重组和精简部分内容
- 更新 MinGW/MSYS2 历史相关
- 添加命令行使用 gcc 相关
