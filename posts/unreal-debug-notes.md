---
date: 2023-07-15
title: 编译和调试Unreal引擎
tags:
  - Unreal
  - Graphics
description: 最近需要调试UE5引擎代码以及测试相关Pass的性能，把流程什么的记下来，或许能帮到有缘人()
---

::: info 杂谈
最近需要调试UE5引擎代码以及测试相关Pass的性能，把流程什么的记下来，或许能帮到有缘人（）
:::

## 获取UE源代码

> 首先，你得有代码才能编译和调试对吧。

Unreal引擎免费提供其源代码，你需要首先注册个Epic账号，然后绑定你的GitHub账号。简单申请后，你的Github账号会被拉入EpicGames组织，然后就能访问到UE引擎源代码啦：https://github.com/EpicGames/UnrealEngine

官方的相关文档：[下载虚幻引擎源代码](https://docs.unrealengine.com/5.2/zh-CN/downloading-unreal-engine-source-code/)

## 编译

基本上照着仓库的README操作就行：首先运行Setup.bat下载非代码资源，然后运行GenerateProjectFiles.bat生成VS工程文件，最后编译。

我这里提一些小的注意事项：

* 如果不想用VS打开编译（UE用VS打开太吃内存了，UE编译流程会根据可用内存大小限制编译核心数的）可以直接使用命令行来编译↓
```powershell
Engine\Build\BatchFiles\Build.bat -Target="UnrealEditor Win64 Development" -Target="ShaderCompileWorker Win64 Development -Quiet" -WaitMutex -FromMsBuild
Engine\Build\BatchFiles\Build.bat -Target="UnrealEditor Win64 Debug" -Target="ShaderCompileWorker Win64 Development -Quiet" -WaitMutex -FromMsBuild # 如果你想逐行调试
```
* 另外要检查下VS有没有安装incredibuild，如果安装了那么要么禁用要么卸载。因为会限制编译用的核心数，并且莫名增大IO开销，使本就不迅速的UE编译雪上加霜。（如果你确实有集群可用那就当我没说）
> 实际上可以手动修改生成的VS工程里面和XGE有关的设置关掉分布式编译，但相对比较麻烦

UE的编译相当缓慢，初次全量编译在我的12700K+64G机器上花了4个小时左右，请做好准备，留出一段空余时间。

## 调试

### CPU代码

CPU代码的调试没啥可说的，直接打开VS用调试模式启动就好。不过注意Development模式编译的代码因为带了一些优化，所以可能会出现调试代码行上下乱跳以及各种变量被优化掉看不到值的情况。

你当然也可以使用windbg之类的第三方调试器来调试，但会比较麻烦，这里我没有尝试。

### GPU代码

一般主要是用[renderdoc](https://renderdoc.org/)来截帧，然后在pipeline status里选择shader代码编辑调试。

#### 如何用renderdoc截取一帧

由于UE编辑器打开项目是启动一个子进程然后结束选择项目的进程，所以需要在用renderdoc启动的时候勾选**捕获子进程**选项。

![勾选"capture child process"](https://s2.loli.net/2023/07/16/uSNP5xlW183gdrc.png)

打开并启动项目后按F12截帧即可。不过要注意有时候截取焦点会在UI窗口而不是实际的项目渲染窗口，这时候需要按F11切换焦点。

> 似乎有个UE的renderdoc插件，但我用那个插件没成功过，你也可以自己试试

#### 调试shader代码

通过上述流程直接截取的rdc可以看到各个draw call的输入输出，但此时应该还不能编辑和逐行调试shader代码。为了能进行shader调试，需要打开`Engine\Config\ConsoleVariables.ini`，取消如下几行的注释👇

![关闭shader编译优化，添加调试信息](https://s2.loli.net/2023/07/16/KVMBxqDzRrH8Ewy.png)

改完之后，重启UE项目会看到shader重编。等重编结束后再用renderdoc截取到的帧就可以编辑shader并调试啦！

## 性能Profile

如果想要测试UE中某个函数或者某个Pass的耗时，可以借助[Unreal Insights工具](https://docs.unrealengine.com/5.2/zh-CN/unreal-insights-in-unreal-engine/)。

> 以前好像还有个profileGPU命令可以看GPU耗时，在5.x被Unreal Insights涵盖了

![Unreal Insights 设置面板](https://s2.loli.net/2023/07/16/rDQN1vMig6H4kUs.png)

如上图，在我使用的5.2.x版本该工具被集成在编辑器的右下角。点击“追踪”按钮即可打开相关设置面板，它的右边有开始追踪和保存追踪快照的快捷按钮，在“通道”选项下可以选择记录哪些类型的事件。

这里我们想要跟踪Pass性能，因此需要勾选GPU通道。录制完Trace数据后，可以选择“Unreal Insights（会话浏览器）”选择录制好的快照打开分析窗口，然后就可以在分析窗口的右侧看到各个事件的耗时、调用次数等数据。

![性能分析窗口界面](https://s2.loli.net/2023/07/16/FROngkubPDSAjGs.png)


但是，我们怎么知道这里的各个事件名称对应的是源代码的那一部分呢？这里就简单说明下CPU和GPU事件的名字对应的源代码标记。

> 详细的Trace系统代码编写仍然建议查阅官方文档：[Trace开发者指南](https://docs.unrealengine.com/5.2/zh-CN/developer-guide-to-tracing-in-unreal-engine/)

### CPU事件标记

在UE源代码中以`TRACE_CPUPROFILER_EVENT_SCOPE`宏来标记，测量该宏所在作用域的耗时。

![CPU事件标记](https://s2.loli.net/2023/07/16/gnOQ3NqI1ei9WtM.png)

### GPU事件标记

在UE源代码中以`RDG_RHI_GPU_STAT_SCOPE`宏来标记，和CPU事件类似，它会统计宏所在作用域的全部Pass耗时之和。

与CPU标记不同的是，需要在使用该标记的文件开头使用`DECLARE_GPU_STAT`宏来声明GPU事件。

![GPU事件标记](https://s2.loli.net/2023/07/16/XenZGBMcosRviEb.png)

### 添加一个事件标记

很多时候我们想要测试的部分Pass并没有被UE标记GPU事件，因此不能被Insights捕获（比如我想测试UE5里头DFAO的性能）。这种情况下，我们只能修改UE的源代码手动把事件标记添加进去了。

仿照前两节CPU/GPU事件标记的写法，在想要的位置放置`XXX_SCOPE`宏，如果是GPU事件别忘了补充`DECLARE_GPU_STAT`，最后重新编译UE代码即可。

需要注意的是要测试GPU性能的话，不要忘了把之前shader调试的选项重新关掉，不然测的是debug模式的性能，没啥用。至于CPU性能，UE官方发布的引擎二进制也是Development编译的，所以直接拿Development编译的引擎测性能就行。

![关掉shader调试选项](https://s2.loli.net/2023/07/16/N3L8HJx17CPkZI2.png)

如此操作后重新录制Trace数据就可以在Insights里看到自己添加的事件性能数据啦~

![我加了个DFAO的Trace事件](https://s2.loli.net/2023/07/16/DnW3rwLKuOx5Vfb.png)
