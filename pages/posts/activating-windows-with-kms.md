---
date: 2023-04-30
title: 用KMS激活Windows系统和Office 365
tags:
  - windows
description: 使用KMS服务器免费激活Windows和Office 365.
---

## 前言

最近各种姿势重装系统，每次装完 windows 镜像，右下角就出来一个激活正版 windows 的水印，总之很不爽。那我们就来手动激活它！<del>顺便把 Office 365 也激活了吧</del>

:::tip 盗版警告
Windows 系统的盗版与否主要是个法律问题，只要没有合适的付费授权不管以什么方式激活都是盗版。

理论上如果公司付过钱买了授权，那公司里不管以什么方式激活（包括各种 ghost 系统）微软都不会管。但还是有翻车风险，尽量就自己用用好了。
:::

<Shade>立了每月至少更新一次博客的 flag，先整理一点旧东西上来。</Shade>

## KMS 服务

通过 KMS 服务器批量激活软件是微软为企业提供的一种批量部署和激活**正版软件**的方式，企业向微软购买软件批量授权之后可以自行搭建 KMS 服务器对软件进行批量激活。

从原理上来说，KMS 激活本身就是一种正版激活方式，不是什么奇奇怪怪的第三方破解，只不过我们跳过了向微软付费这个步骤而已（逃）。

通过 KMS 方式激活的 Windows 和 Office 都能正常地进行更新，使用起来和正版没啥区别（本来就是正版激活方式嘛<Shade>只是来源非法</Shade>）。

## KMS 激活 Windows

### TL;DR

管理员打开 pwsh/cmd 输入以下命令：

```powershell
slmgr -ipk 96YNV-9X4RP-2YYKB-RMQH4-6Q72D  # 企业版VL密钥
slmgr /skms kms.loli.best                 # 公开的KMS服务器
slmgr /ato                                # 激活
```

如果操作无误的话每步都能看到弹窗提示，最后成功激活。

![开了个虚拟机试试](https://s2.loli.net/2023/05/01/TK1jMJ4Fy5XlgBL.png)

### 如果你想知道发生了啥

微软官方文档：https://learn.microsoft.com/en-us/windows/deployment/volume-activation/activate-using-key-management-service-vamt

首先，由于 KMS 激活方式**只适用于批量版(Volume/VL)系统的激活**，而正常来说普通人拿到的都是零售版(Retail/RTL)的系统，所以我们需要一个 KMS Client Key 将系统转为批量版。各个系统版本的转换密钥可以直接在[微软官方文档](https://learn.microsoft.com/en-us/windows-server/get-started/kms-client-activation-keys)查阅。

其次，你需要一个 KMS 服务器，你可以按照[微软的官方教程](https://learn.microsoft.com/en-us/windows-server/get-started/kms-create-host)/[使用 vlmcsd](https://github.com/Wind4/vlmcsd)自己搭建。也可以直接用网上公开的 KMS 服务器，公开的 KMS 服务器可以在[KMS 列表](https://www.coolhub.top/tech-articles/kms_list.html)中查阅。

KMS 服务激活一般是很安全的，毕竟是企业用的东西，但是什么第三方的基于 KMS 的激活软件（kmspico 之类的）就不一定了。官方激活只要打三行命令，就别下什么奇奇怪怪的软件啦。

::: details Off Topic: 管理员权限的 Shell
Windows Terminal 现在支持创建默认管理员的 profile 了，虽说我并不使用这个功能。

我推荐使用`gsudo`，可以打单个`sudo`提权整个 shell，或者`sudo need-eleva`来提权执行某条命令。安装只需`scoop install gsudo`.

```powershell
# 在pwsh里给单独的sudo加个su的别名，这样就和linux更像了
function su { sudo }
```

:::

## KMS 激活 Office 365

用 KMS 激活 Office 也是类似的原理，不同版本的 Office 激活脚本所在的路径不尽相同<del>，说明起来比较麻烦</del>。不过好在我们有强大的[Office Tool Plus](https://otp.landian.vip/zh-cn/)，给各个不同版本的 Office 提供了一个统一的部署&激活方式。

使用 OTP 来安装/激活 Office 现在已经十分傻瓜化了，基本上跟着作者的教程来就行：

- [OTP 部署 Office 教程](https://www.coolhub.top/archives/11)
- [OTP 激活 Office 教程](https://www.coolhub.top/archives/14)

在 OTP 中使用 KMS 激活 Office 365 基本上就是：`ctrl+shift+p`打开命令窗口，然后输入
`ospp /insLicID MondoVolume /sethst:kms.loli.best /setprt:1688 /act`

Mondo 许可证是个神奇的内部许可证，可以让你使用 Office 的全部功能。当然由于 KMS 激活的关系，需要批量版的许可证才行。

:::details 关于 Microsoft Copilot for Word
[早先是可以通过 Office365 来体验 Copilot 的](https://www.coolhub.top/archives/235)，但微软实际上并没有把 Copilot 开放给大众使用。之前大家的体验是切换到 dogfood 更新通道，然后通过一些注册表 hack 来访问 copilot 服务。

最近这个口子似乎被堵上了（悲）。不过如果只是为了copilot跑来用Office365那还是大可不必。毕竟当前只支持英文，输出质量也比较一般，相比起来Notion AI和ChatGPT还是够用的。
:::
