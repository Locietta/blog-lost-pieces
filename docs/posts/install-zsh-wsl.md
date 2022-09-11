---
date: 2020-07-30
title: 在WSL上安装并配置zsh
tags:
  - zsh
  - wsl
  - 配置
description: 一篇旧文，用于测试显示效果
---

# 在 WSL 上安装并配置 zsh

## 1 安装 zsh

```
sudo apt install zsh
```

![apt install能解决大部分的安装问题](https://user-images.githubusercontent.com/53137814/88877476-1c2eb700-d258-11ea-8e9a-cce5fd2b4aa9.png)

## 2 安装 oh-my-zsh

官方 GitHub 页面：[oh-my-zsh's GitHub repository](https://github.com/ohmyzsh/ohmyzsh)

可以通过`curl`或者`wget`来下载并安装

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

```
sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

这里我选择使用`curl`来安装：

然后发现报了一个错 👇

![SSH的证书错误](https://user-images.githubusercontent.com/53137814/88878706-11c1ec80-d25b-11ea-989d-d8cd354873d7.png)

> 之前在 win 下用 git 的时候也有过这个错误，大概是 SSL 证书一类的问题
> 之前是自签署的证书问题，这次好像是根本没有证书（

总之输入如下命令设置 git 来忽略各种证书错误：

```
git config --global http.sslverify false
```

果然就可以啦

![zsh安装完毕](https://user-images.githubusercontent.com/53137814/88879611-4a62c580-d25d-11ea-9f7d-ec4d044b427e.png)

---

安装完毕，设置 zsh 为默认的 shell，效果如下 👇

![zsh默认外观效果](https://user-images.githubusercontent.com/53137814/88879776-b34a3d80-d25d-11ea-8adb-f029edea819d.png)

emmmm....感觉不太行，需要自己配置一下皮肤

## 3 更换 zsh 皮肤

zsh 皮肤文件在`$ZSH/themes`路径下，这里有各种`.zsh-theme`文件（也就是各种各样的皮肤文件）

可以通过修改`~/.zshrc`中的`ZSH_THEME`变量的值来选择不同的皮肤（主题）

![~/.zshrc文件](https://user-images.githubusercontent.com/53137814/88912239-9891bc00-d291-11ea-94c7-ab7787640e9a.png)

当然，也可以编写自己的皮肤文件（后缀名为`.zsh-theme`的文件）将其存放到`$ZSH/themes`下，即可像其他主题一样被启用了

**zsh 主题编写参考[→ 这里 ←](https://printempw.github.io/zsh-prompt-theme-customization/)**

---

我自己写了一个 zsh 主题，现在放在 github gist 上 👉 [arcane](https://gist.github.com/Locietta/208e63a15aaf07168bfd99be1ff10bc6)

![自己编写的arcane主题的效果](https://pic4.zhimg.com/80/v2-a0233702e04c0825dc642f4207fd78c0.png)

（样式参考<del>(照搬)</del>了[大佬的 powershell 主题](https://gist.github.com/NachtgeistW/f394ca3e461edb40550a3f59445c61f2)