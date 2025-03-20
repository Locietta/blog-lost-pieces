---
date: 2025-03-05
title: 在Compute Shader上手搓一个Reduce算子
tags:
  - vulkan
  - graphics
description: 好好的CUDA不用，要写compute shader，也是自讨苦吃（）
---

## 前言

最近拿Slang和Kompute随便搭了个compute框架试试vulkan做通用计算的能力，也想看看用Slang的autodiff功能直接在vulkan里硬写一些简单的可微管线容不容易。

> 其实是有点想把实验室祖传的屎山taichi代码重构一下~~虽然感觉是遥遥无期~~

目前是简单搓了个logistic回归和mlp的demo，感觉写起来确实还是啰嗦。以及Kompute的抽象很多时候有点若智，`std::vector`和`std::shared_ptr`在函数接口上到处都是，`Tensor`不支持suballocate等等。但是要我自己写一个，暂时又懒，只好先凑合用一会了。

## 什么是Parallel Reduce

熟悉函数式编程的对**reduce**应该并不陌生：即把一组数据映射到一个数据的各种操作，比如求和、求平均、求最大值等等。在C++标准库中，就有个`std::reduce`帮助我们实现这一类算法。

:::details Off-topic: C++标准库咋这么多种reduce
除了`std::reduce`还有`std::accumulate`也可以实现reduce操作，两者的区别是后者保证按照顺序执行你提供的自定义算子。在ranges进入标准后，我们又有了`std::ranges::fold_left`，而在C++23之后又增加了好几种folding ranges. 同个语义在标准库里头有3中不同的命名，这也是C++的一个侧面...
![怎么这么多名字](https://s2.loli.net/2025/03/07/UbhE3MeNDtXun5w.png)
:::

普通的reduce操作很容易实现，其实就是简单的循环。然而如果熟悉标准库就会知道，`std::reduce`还支持传入execution_policy切换到tbb支持的多线程并行版本。欸，这问题不就来了——**怎么对reduce操作做并行化加速呢？**

说难也不难：以求和为例，画出图来其实很直接：每层利用并行计算把求和规模减半，最后合为一个。如果并行度是无穷，那么时间复杂度就是$\Theta(\log N)$

![并行求和](https://s2.loli.net/2025/03/07/nKqd5mS31vrpsYy.png =80%)

算法层面上来说，这当然没啥问题，然而常言细节是魔鬼。写一个性能良好的并行Reduce实现并不那么容易。好在总还是可以依赖前人的智慧，比如参考nv关于cuda parallel reduce的技术分享：

<LinkCard
  title="Optimizing Parallel Reduction in CUDA"
  url="https://developer.download.nvidia.com/compute/cuda/1.1-Beta/x86_website/projects/reduction/doc/reduction.pdf"
  image="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/NVIDIA_logo.svg/2560px-NVIDIA_logo.svg.png"
  description="Mark Harris"
/>

我们跟着Mark Harris讲义的思路，一步一步来优化。

## Naive Implementation

![最直接的想法](https://s2.loli.net/2025/03/17/S7Hh3aQdznlpqib.png)

首先最简单的想法就是把前面那个树状递归的过程实现出来，1和2求和，3和4求和，...，以此类推。但这么做需要注意：

- warp divergence：由于GPU的SIMT架构特点，同一个warp必须同时执行相同的指令，如果同个warp内对某个if-else的分支选择不同，那么这个warp将按BFS顺序走完所有的分支。这意味着执行分支A和分支B的耗时并非$`\max(A, B)`$而是$`A + B`$。因此如果需要使用分支，那么尽量让分支情况随线程id连续，保证同warp走同一个分支。
  > 不过需要注意的是：1. volta后的GPU实际上允许warp交错执行各分支间以减少延迟：[Independent Thread Scheduling](https://zhuanlan.zhihu.com/p/186192189)；2. 你写CUDA的话在nv分享中的那种简单warp divergence会被nvcc直接优化掉。所以究竟有没有提升需要**benchmark**
- [bank conflict](https://zhuanlan.zhihu.com/p/659142274): 为了线程组内高速访存得用共享内存（shared memory）。为了提高带宽共享内存被分为多个bank，各个bank间可以并行存取数据（这个和多通道内存条是一个原理）。但多个线程同时访问同一个bank时就只能进行串行访问了，相当于只有1个bank。因此我们得设法避免bank conflict以最大化带宽。
  > 不过如果是读取同bank上同一个word，则会触发**broadcast**或者**multicast**机制，这种情况不会串行。

![GPU上shared memory的结构](https://s2.loli.net/2025/03/17/B3Q1IvRqz8undwF.png =80%)

于是我们修改一下寻址的方式，如下图所示。新的线性编址方式不但可以避免bank conflict，同时同个线程访问的共享内存地址也固定了，cache更加友好。

![Sequential Adressing](https://s2.loli.net/2025/03/13/3OsXKWT4lHgYzJe.png)

写成shader代码长这样：

```hlsl
// reduce/shaders/reduce.slang
#define THREAD_GROUP_SIZE 256
[[vk::binding(0, 0)]] StructuredBuffer<float> source;
[[vk::binding(1, 0)]] RWStructuredBuffer<float> result;
groupshared float partial_sums[THREAD_GROUP_SIZE];

[shader("compute")]
[numthreads(THREAD_GROUP_SIZE, 1, 1)]
void main(uint3 DTid: SV_DispatchThreadID, uint3 GTid: SV_GroupThreadID) {
    uint idx = DTid.x;
    uint local_idx = GTid.x;
    uint num_elements = source.getCount();
    partial_sums[local_idx] = idx < num_elements ? source[idx] : 0.0f;

    // wait until everything is transfered from device memory to shared memory
    GroupMemoryBarrierWithGroupSync();

    for (uint offset = THREAD_GROUP_SIZE / 2; offset > 0; offset >>= 1) {
        if (local_idx < offset) {
            partial_sums[local_idx] += partial_sums[local_idx + offset];
        }
        GroupMemoryBarrierWithGroupSync();
    }

    if (local_idx == 0) {
        /// NOTE: result[0] should be zero inited
        InterlockedAdd(result[0], partial_sums[0]);
    }
}
```

:::details 思考：load数据到共享内存时的三目判断存不存在warp divergence？有多大影响？

因为只有当线程ID超出待累加的数组长度时才会有分歧，因此最多也就是最后一个warp会产生divergence. 如果数组长度恰好是线程组大小的倍数，那么就不会有divergence。

即便不然，最后一个warp产生了divergence，但由于volta架构后的**Independent Thread Scheduling**技术的存在，这种简单场景的divergence很可能没有额外开销：先执行从buffer读取数字，然后在访存的时延中写入立即数`0.0f`被交错执行，从而耗时被隐藏。

不过GPU会先执行哪个分支也不好说，但有资料显示NV的卡会选择先执行warp内多数线程选择的分支：[Control Flow Management in Modern GPUs (VII-C para. 2)](https://arxiv.org/html/2407.02944v1) 。
:::

在我的4070笔记本上，使用上述compute shader对32M个float求和用时为1.08ms.

:::details 关于GPU计时 {open}
很遗憾Nsight Compute并不能录制Vulkan的CS，而Nsight Graphics对GPGPU的支持实在不咋样，只能看个大概（也可能是我没搞懂咋用）。因此这里计时还是用的古法：

```cpp
// Measure execution time with warm-up and averaging
template <std::invocable F>
double measure_time(F &&func, int warmup_runs = 10, int measurement_runs = 30) {
    // Warm-up runs
    for (int i = 0; i < warmup_runs; ++i) {
        func();
    }

    // Measurement runs
    std::vector<float> times(measurement_runs);
    for (int i = 0; i < measurement_runs; ++i) {
        times[i] = func();
    }

    // Calculate average time
    float sum = 0.0f;
    for (const auto time : times) {
        sum += time;
    }
    return sum / measurement_runs;
}
```

用Vulkan的Timestamp功能来测量pass消耗的时间，去掉最开始几次GPU还没热身的数据多跑几次取平均。
:::

## Optimization 01: 减少Idle线程

从前面的算法示意图也可以看出来，第一层reduce开始就有一半的线程是啥事都不干的，就干了个把数据从全局内存搬到共享内存的工作然后就一直idle了。这挺浪费的，为了给这些线程找点事做，我们可以把第一层reduce直接在加载数据到共享内存的时候就顺便做了：

```hlsl
    uint local_idx = GTid.x;
    uint num_elements = source.getCount();
    uint idx = DTid.x; // [!code --]
    uint idx = Gid.x * THREAD_GROUP_SIZE * 2 + local_idx; // [!code ++]
    partial_sums[local_idx] = idx < num_elements ? source[idx] : 0.0f;
    partial_sums[local_idx] += idx + THREAD_GROUP_SIZE < num_elements ? source[idx + THREAD_GROUP_SIZE] : 0.0f;  // [!code ++]
```

这样一来逻辑上相当于把线程组大小扩大了一倍，原来那些idle的线程并没有实际分配线程，这样就节约了线程资源。同时在调用侧，我们也需要将线程组大小视为`2 * THREAD_GROUP_SIZE`来计算dispatch数。

经过这个优化，reduce 32M个float的耗时来到了0.59ms，用时削减了大半。

## Optimization 02: 递归Reduce

如果你对照NV的讲义和我上面写的shader，你会发现我在最后使用了**原子操作**把所有的结果加到了一起，而讲义中给出的示例并没有这么做。这是因为即使一遍reduce没能完全处理完数据，还剩下若干个结果需要加，那再调用一遍reduce算子就好了。

![递归调用reduce](https://s2.loli.net/2025/03/18/S8etuCRdmNUhjfM.png)

所有的reduce算子代码都是完全一样的，我们只要反复调用同一个shader就行。调用次数可以用$`\lceil\log_{\text{线程组大小}}(\text{输入长度})\rceil`$简单计算得到。

:::details Caveats: 计算Reduce次数
因为浮点精度的关系，直接使用`std::ceil(std::log(length)/std::log(group_size))`计算的话在长度`length`为2的幂次时会出问题，换用`std::log2`就神奇的不会有问题了。我自己遍历了`uint32_t`验证过这个，感兴趣可以自己试试。

因为线程组大小一般都是2的幂，更好的方法是用[std::countl_zero](https://en.cppreference.com/w/cpp/numeric/countl_zero)来做快速计算。

```cpp
/// precondition: group_size == 2^i, i>=1
constexpr uint32_t calc_reduce_times(uint32_t length, uint32_t group_size) noexcept {
    if (length <= 1) return 0;

    const uint32_t a_msb_pos = 32u - std::countl_zero(length - 1);
    const uint32_t b_msb_pos = 32u - std::countl_zero(group_size - 1);

    return (a_msb_pos + b_msb_pos - 1) / b_msb_pos; // divide and round up
}
```

这不但避免了浮点精度的毛病（估计可能也和平台有关），而且更快：[Compiler Explorer](https://godbolt.org/z/cWPTjsoTd)。
:::

shader方面的修改并不多，主要是需要修改C++侧的代码<del>（略）</del>。

```hlsl
    if (local_idx == 0) {
        /// NOTE: result[0] should be zero inited   // [!code --]
        InterlockedAdd(result[0], partial_sums[0]); // [!code --]
        result[Gid.x] = partial_sums[0];            // [!code ++]
    }
```

这样修改之后性能上其实没有发生太大的变化，32M个float求和现在总共需要0.57ms，基本在误差范围内。不过也可以理解，第一次reduce调用后问题的规模已经就已经下降到128k了，这个规模下消除原子操作加上更好的渐进复杂度带来的收益估计被启动多个Pass带来的开销抵消了。

不过改成递归调用有个其他的好处是我们不需要在调用reduce前先将输出初始化为0了，这样节省下一个clear pass，总体来看还是有些提升的.

## Optimization 03: 展开！

![图文无关](https://s2.loli.net/2025/03/18/GDh46pE1uibxRVW.png =30%)

### Loop Unroll

接下来要想进一步加速，我们把目光放到处理reduce的循环上。很容易发现其实这个循环的次数只和线程组大小有关，这种循环很容想到是不是可以展开。Slang中展开循环的方法很简单，加个`ForceUnroll`的属性就行。

```hlsl
    [[ForceUnroll]] // [!code ++]
    for (uint offset = THREAD_GROUP_SIZE / 2; offset > 0; offset >>= 1) {
        if (local_idx < offset) {
            partial_sums[local_idx] += partial_sums[local_idx + offset];
        }
        GroupMemoryBarrierWithGroupSync();
    }
```

然而这么做了之后性能基本没有变化，使用`spirv-dis`查看编译出来的spirv字节码，可以看到在spirv层面上确实发生了循环展开。因此合理猜测是NV驱动将spirv编译到sass的过程中能识别这种简单的可展开循环直接给优化掉了。

### Warp Unroll

Harris讲义中提到另一个优化点：因为GPU的指令执行是以WARP为单位的，因此同WARP内实际上是不需要同步的，可以省下`GroupMemoryBarrierWithGroupSync`的开销。关于WARP的大小，A卡一般是64，而N卡一般是32.

这样一来，我们可以进一步将代码修改为：

```hlsl
[shader("compute")]
[numthreads(THREAD_GROUP_SIZE, 1, 1)]
void main(uint3 DTid: SV_DispatchThreadID, uint3 GTid: SV_GroupThreadID, uint3 Gid: SV_GroupID) {
    uint local_idx = GTid.x;
    uint num_elements = source.getCount();
    uint idx = Gid.x * THREAD_GROUP_SIZE * 2 + local_idx;
    partial_sums[local_idx] = idx < num_elements ? source[idx] : 0.0f;
    partial_sums[local_idx] += idx + THREAD_GROUP_SIZE < num_elements ? source[idx + THREAD_GROUP_SIZE] : 0.0f;

    GroupMemoryBarrierWithGroupSync(); // wait until everything is transfered from device memory to shared memory

    [[ForceUnroll]]
    for (uint offset = THREAD_GROUP_SIZE / 2; offset > WARP_SIZE; offset >>= 1) {
        if (local_idx < offset) {
            partial_sums[local_idx] += partial_sums[local_idx + offset];
        }
        GroupMemoryBarrierWithGroupSync();
    }

    [[ForceUnroll]]
    for (uint offset = WARP_SIZE; offset > 0; offset >>= 1) {
        if (local_idx < offset) {
            partial_sums[local_idx] += partial_sums[local_idx + offset];
        }
        // No need to synchronize here,
        // as thread is already synchronized within the same warp!
    }

    if (local_idx == 0) {
        result[Gid.x] = partial_sums[0];
    }
}
```

然而结果却不尽如人意：不但性能没有太大变化，而且运算结果居然还错了！这是怎么回事呢？

### Wave Intrinsic

其实之前也提到过了，对N卡来说，在volta架构之后（也就是计算能力7.0+的卡）同warp内的线程调度方式有所变化，不再保证同时执行同个指令。也就是说，上面手动展开warp去掉同步的手法在比较新（20系以后）的N卡上就不对了。NV这个讲义年代有点太久远了，示例还在用Tesla G80，自然也就不知道未来GPU架构的变化。

> 网上的资料说A卡全系保证warp同步<del>（不过我没验证过）</del>。不过下面就介绍不用隐式warp同步的写法了，还是尽量不要这么写。

正确的使用warp的方式应当是使用[Wave Intrinsic](https://zhuanlan.zhihu.com/p/469436345)指令，来显式指明需要使用warp级别的操作。

> 这个东西有很多叫法：Wave Intrinsic是DX的说法（其实是继承了AMD wavefront编程的叫法），Vulkan的说法是[subgroup](https://www.khronos.org/blog/vulkan-subgroup-tutorial)，CUDA中则直接称为[warp级原语](https://zhuanlan.zhihu.com/p/572820783)。

> warp级别的指令进入各家API的原因是一样的：volta架构以后，隐式使用warp同步的代码全都失效。不提供warp操作的话，在shader编程里就完全无法使用GPU分warp的架构特点来写高性能代码了。

如果熟悉CUDA的话就知道，我们可以使用`__shfl_down_sync`来实现reduce操作。唯一的问题是DX12并不支持shuffle down的wave intrinsic，但好在vulkan支持相应的subgroup操作，我们可以在Slang中直接内联spirv汇编，来实现对应的wave intrinsic：

```hlsl
float WaveShuffleDown(float value, uint offset) {
    return spirv_asm {
        OpCapability GroupNonUniform;
        OpCapability GroupNonUniformShuffleRelative;
        OpExtension "SPV_KHR_shader_subgroup";

        result: $$float = OpGroupNonUniformShuffleDown Subgroup $value $offset
    };
}
```

于是reduce一个小于等于warp大小的数据，可以实现为：

```hlsl
float WarpReduce<let group_size : uint>(float sum) {
    if (group_size >= 32) sum += WaveShuffleDown(sum, 16);
    if (group_size >= 16) sum += WaveShuffleDown(sum, 8);
    if (group_size >= 8) sum += WaveShuffleDown(sum, 4);
    if (group_size >= 4) sum += WaveShuffleDown(sum, 2);
    if (group_size >= 2) sum += WaveShuffleDown(sum, 1);
    return sum;
}
```

因为可以直接使用`WaveShuffleDown`来接读取同warp内其他线程的寄存器，因此我们可以使用更少的共享内存来实现原来的算法了。

```hlsl
#define THREAD_GROUP_SIZE 256
#define WARP_SIZE 32
#define WAVE_PER_GROUP (THREAD_GROUP_SIZE / WARP_SIZE)

[[vk::binding(0, 0)]]
StructuredBuffer<float> source;

[[vk::binding(1, 0)]]
RWStructuredBuffer<float> result;

float WaveShuffleDown(float value, uint offset) {
    return spirv_asm {
        OpCapability GroupNonUniform;
        OpCapability GroupNonUniformShuffleRelative;
        OpExtension "SPV_KHR_shader_subgroup";

        result: $$float = OpGroupNonUniformShuffleDown Subgroup $value $offset
    };
}

float WarpReduce<let group_size : uint>(float sum) {
    if (group_size >= 32) sum += WaveShuffleDown(sum, 16);
    if (group_size >= 16) sum += WaveShuffleDown(sum, 8);
    if (group_size >= 8) sum += WaveShuffleDown(sum, 4);
    if (group_size >= 4) sum += WaveShuffleDown(sum, 2);
    if (group_size >= 2) sum += WaveShuffleDown(sum, 1);
    return sum;
}

groupshared float warp_level_sums[WAVE_PER_GROUP];

[shader("compute")]
[numthreads(THREAD_GROUP_SIZE, 1, 1)]
void main(uint3 DTid: SV_DispatchThreadID, uint3 GTid: SV_GroupThreadID, uint3 Gid: SV_GroupID) {
    uint local_idx = GTid.x;
    uint num_elements = source.getCount();
    uint idx = Gid.x * THREAD_GROUP_SIZE * 2 + local_idx;

    float sum = idx < num_elements ? source[idx] : 0.0f;
    sum += idx + THREAD_GROUP_SIZE < num_elements ? source[idx + THREAD_GROUP_SIZE] : 0.0f;

    uint lane_id = WaveGetLaneIndex();
    uint warp_id = local_idx / WARP_SIZE;

    sum = WarpReduce<WARP_SIZE>(sum);
    if (WaveIsFirstLane()) warp_level_sums[warp_id] = sum;
    // wait until everything is transferred from device memory to shared memory
    GroupMemoryBarrierWithGroupSync();

    sum = (local_idx < WAVE_PER_GROUP) ? warp_level_sums[lane_id] : 0.0f;

    if (warp_id == 0) sum = WarpReduce<WAVE_PER_GROUP>(sum); // Final reduce using first warp

    if (local_idx == 0) result[Gid.x] = sum;
}
```

这个版本比起之前的版本只有一点点提升，大概快了0.02ms.

不过使用`WaveShuffleDown`自己搓一个`Reduce`实际上有点舍近求远，因为实际上有个`WaveActiveSum`的wave指令可用，实际上并没有自己实现一个的必要（）。

> 对应CUDA的`__reduce_add_sync`原语，不过CUDA这边要求计算能力8.0+（30系以后）才可用。估计DX这边的更老的卡也是手动用shuffle指令软件实现的。

```hlsl
#define THREAD_GROUP_SIZE 256
#define WARP_SIZE 32
#define WAVE_PER_GROUP (THREAD_GROUP_SIZE / WARP_SIZE)

[[vk::binding(0, 0)]]
StructuredBuffer<float> source;

[[vk::binding(1, 0)]]
RWStructuredBuffer<float> result;

groupshared float warp_level_sums[WAVE_PER_GROUP];

[shader("compute")]
[numthreads(THREAD_GROUP_SIZE, 1, 1)]
void main(uint3 DTid: SV_DispatchThreadID, uint3 GTid: SV_GroupThreadID, uint3 Gid: SV_GroupID) {
    uint local_idx = GTid.x;
    uint idx = Gid.x * THREAD_GROUP_SIZE * 2 + local_idx;
    uint num_elements = source.getCount();

    float sum = idx < num_elements ? source[idx] : 0.0f;
    sum += idx + THREAD_GROUP_SIZE < num_elements ? source[idx + THREAD_GROUP_SIZE] : 0.0f;

    uint lane_id = WaveGetLaneIndex();
    uint warp_id = local_idx / WARP_SIZE;

    sum = WaveActiveSum(sum);
    if (WaveIsFirstLane()) warp_level_sums[warp_id] = sum;

    // Synchronize all threads in the group to ensure all wave reductions are visible
    GroupMemoryBarrierWithGroupSync();

    sum = (local_idx < WAVE_PER_GROUP) ? warp_level_sums[lane_id] : 0.0f;
    if (warp_id == 0) sum = WaveActiveSum(sum); // Final reduce using first warp
    if (local_idx == 0) result[Gid.x] = sum; // Write the result for the group
}
```

这一版性能上没有啥大的差别，但是结果和用shuffle down手工实现的reduce相比相对误差小了一半，也不知道底层究竟有啥区别。

> **思考**：第二次调用`WaveActiveSum`时有没有可能剩下的线程数还是比一个warp大，即有没有可能需要调用第3次`WaveActiveSum`？

## 总结

从初版的1.08ms到最终版的0.55ms，几乎提升了一倍的性能。我们应用了各种优化，有的很有效，有的不大有效果，还有的因为架构的演进不但毫无卵用还会导致错误。我们要问：**这就优化到头了吗？**

这不是个容易回答的问题，之前看到个知乎答案比较有启发：

<LinkCard
  title="CUDA 的包比自己写的 Kernel 快 10~20 倍，有什么内在机制呢？"
  iconImage="https://upload.wikimedia.org/wikipedia/commons/a/ad/Zhihu_logo.svg"
  url="https://www.zhihu.com/question/356661099/answer/2449633440"
  description="ZZZZJ的回答 - 知乎"
/>

主要的启示是：

- 借助profile工具去查看具体的带宽、寄存器、occupancy等等指标，看看离理论上限还差多少，瓶颈在何处？
  > - 如果某项资源已经接近硬件极限，例如带宽已经接近100%，就别想着改进访存了
  > - 如果不清楚瓶颈在何处，盲目地去优化，即便优化的部分提升了10倍，按照Amdahl定律很可能总体连1%的提升也没有
- 修改的代码最后被层层转译之后是有效修改吗？
  > - 如果编译后端/驱动等已经完成了相关的优化，那么自己手动去实现一遍是在做无用功

不过遗憾的是我目前仍然没搞懂咋在这种没有frame的demo程序里面用NSight Graphics抓Compute，只得用NSight System来简单弄一弄——L1命中率之类的数据是别想看了，但简单看看带宽和占用率还是可以的：

![Naive实现](https://s2.loli.net/2025/03/20/14exSNFk6LQYPyg.png)

![优化后实现](https://s2.loli.net/2025/03/20/8luGLosRvgI7jM9.png)

对比两版compute shader，可以看到最大的差别是共享内存的带宽相差了2倍。Reduce操作是典型的memory bound的算子，访存性能提升两倍基本就是最终性能提升了两倍——这也和我们前面的测试结果对的上。这也能解释为啥我们减少idle线程的那步提升最大：同样的occupancy，多了一倍的线程在工作，将带宽几乎放大了一倍。

但同样的，Mark Harris的讲义里还有个优化我们没实现——在load时不是取两个数先reduce，而是取n个数。我们基本可以预见即使实现了这个优化也不会有什么大的提升，因为DRAM基本上已经被我们跑满了，很难再在这个层面上获得性能提升。

作为思考，读者可以尝试profile最后两版优化后的compute shader，观察用shuffle指令手写的wave reduce和hlsl内建的指令之间的访存模式有什么区别。并指出上图中使用的是哪一版优化shader.
