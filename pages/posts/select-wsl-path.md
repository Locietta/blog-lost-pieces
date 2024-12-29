---
date: 2020-10-08
title: 自定义WSL的安装位置，别再装到C盘啦
tags:
  - windows
  - wsl
  - 配置
description: 自定义WSL安装路径，适用于WSL1和WSL2
---

> 为了用 docker,今天才决定更新到 win10 2004
>
> 打算另外装一个 WSL2 的发行版折腾 docker 和 GPU，发现之前装 WSL 到非系统盘的教程找不到了。现在网上也没找到有这方面的东西，干脆自己写一个留作记录吧~

**WSL(Windows Subsystem for Linux)** 是 win10 的一项十分强大的功能。WSL 让我们可以像使用普通的软件一样直接使用 Linux 的功能。配合微软的 Windows Terminal，拥有比通常的虚拟机更方便的启动方式（告别需要重启切换的双系统方案吧）。在 WSL2 更新之后，WSL 支持了 GPU、图形界面和 docker 等各种功能，速度也有了不小提升。

但是有一个大问题：在 Microsoft Store 下载的 WSL 发行版会自动安装到**C 盘**，**不能手动选择安装位置**。

如果你不是只有一个 C 盘的话，基本上 WSL 里装不了什么东西，C 盘就满了。所以我们需要想办法把它装到其它盘去。

> 有一个办法是找到安装的 WSL 的位置，然后用`mklink`命令打洞到其他盘，不过这里我们采用其它的办法

### 那么究竟怎么办呢

其实也很简单，微软提供了一个手动下载 WSL 发行版的网址：[手动下载适用于 Linux 的 Windows 子系统发行版包](https://docs.microsoft.com/zh-cn/windows/wsl/install-manual)

![从这里下载WSL发行版的话，可以绕开MS Store的自动安装](https://user-images.githubusercontent.com/53137814/95477899-6f8d5600-09bb-11eb-8a7a-e82623072efd.png)

选择想要的发行版下载后，可以得到一个后缀名为`.appx`的文件 ↓

![以ubuntu-20.04为例](https://user-images.githubusercontent.com/53137814/95479008-db23f300-09bc-11eb-80c9-7efe9cdaaa77.png)

把它的后缀改为`.zip`，然后解压到想要安装 WSL 的目录下，我们可以得到一些文件

![看到那个ubuntu2004.exe没有~](https://user-images.githubusercontent.com/53137814/95479968-edeaf780-09bd-11eb-8a4d-96e5c3f46383.png)

双击红框框出的那个 ubuntu.exe（其他发行版的话也有类似的程序）,等待一段时间就成功安装到当前目录啦~

> 需要注意的是安装目录的磁盘不能开**压缩内容以便节省磁盘空间**选项，否则会报错`0xc03a001a`
>
> 可以右键`文件夹-->属性-->常规-->高级`找到并关闭这个选项
> ![开了压缩功能的文件夹右上角会有两个蓝色的小箭头](https://user-images.githubusercontent.com/53137814/95481467-9fd6f380-09bf-11eb-943a-0d43587215e3.png)
