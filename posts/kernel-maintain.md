---
date: 2023-03-05
title: WSL内核维护笔记
tags:
  - linux
  - kernel
description: 常用的命令和相关备忘之类的
---

# {{ $frontmatter.title }}

维护[自己的WSL内核](https://github.com/Locietta/xanmod-kernel-WSL2)也快一年了，前几天也拿到了第16个star<Shade>其中有一个是我自己</Shade>，把一些积累的经验整理一下放到这里罢。

![在桌面一直放个txt还是有点蠢...](https://s2.loli.net/2023/03/05/kyQW1zrMLchVs4U.png)

## 如何clone巨大仓库中指定的commit/tag

正常的流程是先`git clone`到本地，然后`git checkout`到指定的commit或者tag. 但是如果这个仓库很大（比如说linux的源码），那你就不得不把一百万个commit都给clone下来，然后才能checkout，这通常来说不是并很美妙。

关于tag，状况是类似的。`git clone xxx -b tag_name`会拉取整个代码树的，并不能起到只拉取到打了tag的那一个commit的效果。

:::details Off Topic: Linux内核开发不需要整个代码树
Linux开发依赖于邮件列表和各种patch. Patch本质上就是格式化成邮件格式的diff文件而已，只需要最近的commit然后使用`git format-patch`就可以制作patch了。把所有commit都拉下来除了浪费时间和磁盘之外并没有什么太大的意义。

但是依赖于现代代码托管平台的项目一般都需要拉取整个代码树才能开发（比如LLVM），因为PR是需要整个代码树的。
:::

因为我需要从WSL2官方的内核里提取patch，又不想把所有commit都clone下来。毕竟我只需要最新commit到我想提取的commit之间的历史就行了，前面的历史记录clone下来也没用。

在网上搜索了一圈，最后在一篇[日文博客](https://mebee.info/2021/05/09/post-33725/)中找到了解决方案。

### 解决方案

建一个空的git仓库，把remote设置为想要clone的远程仓库。

```bash
git init
git remote add origin xxx/yyy/test.git
```

然后利用`git fetch`拉取指定的commit，如果想要提取多个commit为一个patch，那么可以修改fetch的深度。

```bash
git fetch --depth 1 origin [SHA]
```

最后使用`git reset --hard FETCH_HEAD`把git仓库的`HEAD`指向拉取的commit，这样就完成啦。

## 使用patch

### 使用patch

```bash
git apply # 应用修改，但不add也不commit，需要自己写提交信息，不保留原作者信息
# 或者
git am  # 直接把commit加到代码树上，保留原作者和commit消息，但遇到合并冲突会比较麻烦
```

`git am`要是因为冲突失败了，那么先`git appy --reject`，然后手动解决冲突，删掉所有`*.rej`文件，把修改全部暂存之后，最后使用`git am --continue`完成操作。

或者直接`git am --abort`放弃掉这次操作。否则会一直处于`am`的过程中，无法进行其他git操作。


### 把多个commit合成一个patch

```bash
# 直到指定commit(不含该commit)为止，将多个commit导出为一个patch
git format-patch [SHA] --stdout > xxx.patch
```

## 内核构建

罗列常用命令：
```bash
make LLVM=1 LLVM_IAS=1 nconfig       # 打开tui配置界面（比menuconfig好看好用）
make LLVM=1 LLVM_IAS=1 savedefconfig # 从.config生成defconfig
make LLVM=1 LLVM_IAS=1 xxx_defconfig # 直接用arch/<对应架构>/config下的xxx_defconfig生成配置
make LLVM=1 LLVM_IAS=1 -j$(nproc)    # 编译

# 生成compile_commands.json给clangd用（如果你要手动改内核源码）
scripts/clang-tools/gen_compile_commands.py
# 直接命令行修改.config
scripts/config
```

如果要使用clang编译，那么configure阶段必须带着`LLVM=1 LLVM_IAS=1`，不然会变成gcc的配置...
另外如果想要开LTO，那么也必须带上，否则LTO选项在配置界面中不可见。（因为依赖于clang）
