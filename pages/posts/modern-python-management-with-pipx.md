---
date: 2025-01-29
title: 现代python开发环境搭建：pipx & poetry
tags:
  - python
description: 很多时候感觉conda作为环境隔离方案还是太重量级了：很多时候每个项目需要的依赖都不尽相同，每个项目都得创建一个conda环境有点太笨重了。最近深入了解了下pipx，感觉是更好的方案。
---

## 前言

逐渐python写得也比较多了，但一直都没有好好研究python相关的开发环境应该如何搭建。最早用scoop装的python，后来转战conda，反正也是随大流。不过慢慢就觉得conda这种作为环境隔离方案还是太重量级了：很多时候每个项目需要的依赖都不尽相同，那每个项目创建一个独立的虚拟环境又有点太笨重。总体上来说，conda虚拟环境感觉不是一个很好的纯python项目的依赖解决方案，只是能自动安装python以外的依赖（nvcc/mkl之类的东西）所以还留有它的生态位。

后来感觉原生的venv有时比conda更好：依赖就安装到项目本地，也不用担心环境命名（我就都统一命名成`venv`，反正不会命名冲突）。最近狂改博客，对前端熟悉了不少，猛然发现：这不就`node_modules`么！这么一看的话，venv就有些原始了，因为本身只作为虚拟环境隔离方案来设计，横向对比`pnpm`等现代前端的包管理工具就差的有些多了。好在确实已经有人想到过这个问题，用相似的理念在venv的基础上发明了`pipx`。

挺早有接触过一些使用pipx的项目，最近感觉到conda和venv的限制之后，就觉得得深入了解一下了。

## 工具链：pipx + pyenv + poetry

用前端工具链来类比的话，pyenv就是nvm，pipx就是npx，poetry就是npm.

总之先贴官网，详细文档还是得查官网：

- pipx: https://pipx.pypa.io/stable/
- pyenv: https://github.com/pyenv/pyenv
  - windows版本fork：https://github.com/pyenv-win/pyenv-win
- poetry: https://python-poetry.org/

> Linux安装不用我教吧（），包管理器一把梭就好了。windows这边其实也差不多，不过scoop安装的pyenv有点小问题，需要处理下。

pipx官网推荐就是用scoop安装，pyenv在scoop上也有包，所以可以直接

```powershell
scoop install pipx pyenv
pipx ensurepath
```

不过scoop安装的pyenv因为shim符号链接的关系会有问题（此事在[pyenv-win/pyenv-win#449](https://github.com/pyenv-win/pyenv-win/issues/449)已有记载），需要管理员权限重新创建shim：

```powershell
sudo scoop reset pyenv
```

装完之后先用`pyenv`装个python版本：

```powershell
> pyenv install 3.13.1
:: [Info] ::  Mirror: https://www.python.org/ftp/python
:: [Installing] ::  3.13.1 ...
:: [Info] :: completed! 3.13.1
> pyenv global 3.13.1
> pipx ensurepath
Success! Added C:\Users\<username>\.local\bin to the PATH environment variable.

Consider adding shell completions for pipx. Run 'pipx completions' for instructions.

You will need to open a new terminal or re-login for the PATH changes to take effect. Alternatively, you can source
your shell's config file with e.g. 'source ~/.bashrc'.

Otherwise pipx is ready to go! ✨ 🌟 ✨
```

注意`pyenv`下载和使用的python版本号必须指定到具体的patch号，并不支持模糊指定（比如指定`3.12`就不行）.

然后可以使用`pipx`来安装`poetry`：`pipx install poetry`，这边可能会提示pipx安装路径不在PATH变量里。这是因为`pipx ensurepath`只修改用户PATH变量，需要重启电脑才能生效。（修改系统PATH变量会立即生效，不过不推荐就是了。）

```powershell
> poetry --version
Poetry (version 2.0.1)
```

pipx默认会将包下载到`C:\<username>\pipx`然后将命令链接到`C:\<username>\.local\bin`，如果担心占太多C盘空间，也可以使用`mklink /J`将相应的目录移到其他盘。

## Hello World！

用新工具链在vscode里搭个简单的hello world项目试试吧！

使用`poetry new <name>`可以直接创建一个py项目，

```powershell
> poetry new poetry-hello-world
Created package poetry_hello_world in poetry-hello-world
```

输入该命令后，会自动在`poetry_hello_world`文件夹中创建一个空项目，其目录结构如下：

```powershell
> eza -T -a poetry-hello-world
poetry-hello-world
├── poetry_hello_world
│   └── __init__.py
├── pyproject.toml
├── README.md
└── tests
    └── __init__.py
```

`pyproject.toml`是poetry的配置文件，类似于`package.json`之于npm。其内容如下：

```toml
[project]
name = "poetry-hello-world"
version = "0.1.0"
description = ""
authors = [
    {name = "Locietta",email = "locietta@gmail.com"}
]
readme = "README.md"
requires-python = ">=3.13"
dependencies = [
]


[build-system]
requires = ["poetry-core>=2.0.0,<3.0.0"]
build-backend = "poetry.core.masonry.api"
```

poetry默认会在`C:\<username>\pipx`中为项目创建虚拟环境，不过也可以用`poetry config virtualenvs.in-project true`配置为在项目本地创建虚拟环境（**推荐**，否则vscode可能找不到项目所使用的虚拟环境）.

> 和`npm`系相反，`poetry config`默认修改全局设置，要只为项目修改设置需要额外添加`--local`

总体上来说`poetry`的设计和`pnpm`等前端的包管理器很接近，一些有用的命令如下：

```powershell
# 初始化项目（生成pyproject.toml）
poetry init
# 添加依赖
poetry add [包名]
# 添加开发依赖（black/pytest之类的）
poetry add -D [包名]
# 移除依赖
poetry remove [包名]
# 安装依赖到本地
poetry install
# 在虚拟环境里运行指定命令
poetry run [命令]
# 将项目打包为wheel和tar
poetry build
# 发布wheel包
poetry publish
# 进入虚拟环境的shell
poetry shell
# 将依赖导出为requirements.txt格式
poetry export -f requirements.txt --output requirements.txt
```

基本上都很熟悉，对吧？和`pnpm`类似，在使用`add`添加依赖或者`install`安装依赖时，会将依赖包下载到项目的`.venv`文件夹下，并且如果没有`poetry.lock`存在，还会生成相应的lock文件。

这里我们以一个简单的提权脚本为例，来演示如何使用`poetry`进行依赖管理。首先在`poetry_hello_world`文件夹下创建`main.py`：

```python
import sys
import pyuac


def main():
    if not pyuac.isUserAdmin():
        try:
            pyuac.runAsAdmin(False)
            sys.exit(0)
        except Exception:
            sys.exit(1)

if __name__ == "__main__":
    main()
```

我们使用`poetry add pyuac`添加必要的依赖。`pyuac`还额外依赖`pywin32`，但打包者没有将`pywin32`添加到依赖中，所以没有自动安装上。我们得手动使用`poetry add pywin32`将其加为依赖。

poetry的依赖管理更加严格，对python标准库的依赖也得明确指出，否则会提示找不到相关module.
poetry还不够流行，这种包的开发者少标系统库依赖的情况估计不会少见，需要注意下。

关于快速运行测试，可以使用vscode python插件自带的右上角小箭头运行对应的py文件。也可以在`pyproject.toml`中设置`project.scripts`来选择需要运行的函数：

```toml
[project.scripts]
main="poetry_hello_world.main:main"
```

执行`poetry install`后就能输入`poetry run main`运行`poetry_hello_world/main.py`中的`main()`函数了

## Recap

> 本小节完全由deepseek R1生成（）

通过 `pipx`、`pyenv` 和 `poetry` 的组合，我们搭建了一套轻量、高效且符合现代开发理念的 Python 工具链。这套工具链不仅解决了传统方案（如 `conda` 和原生 `venv`）在环境隔离、依赖管理和跨版本支持上的痛点，还借鉴了前端生态的成熟设计，大幅提升了开发体验。

**工具链的核心优势**：

- **版本管理**：`pyenv` 提供了类似 `nvm` 的灵活 Python 版本切换能力，支持多版本共存且无需全局依赖。
- **工具隔离**：`pipx` 作为全局工具安装器，避免了依赖污染，同时简化了 CLI 工具的管理（如 `poetry` 的安装）。
- **项目级依赖管理**：`poetry` 通过 `pyproject.toml` 统一管理项目配置，结合精确的依赖解析和 Lock 文件机制，确保了环境复现的可靠性。其虚拟环境集成（尤其是 `in-project` 模式）与 `node_modules` 的设计异曲同工，极大降低了环境配置的心智负担。

尽管目前 `poetry` 的生态仍在发展中（例如某些第三方包对系统库的依赖标注不够完善），但其设计理念已展现出强大的生命力。随着越来越多的开发者转向 `pyproject.toml` 标准，以及社区对工具链的持续优化，这类问题将逐步得到解决。可以预见，未来 Python 生态会进一步向“开箱即用”的方向演进，而 `poetry` 及其工具链很可能成为这一趋势的核心推动者。

简而言之，如果你厌倦了笨重的环境管理和琐碎的配置，不妨拥抱这套工具链——它不仅是当下更优雅的选择，更是未来 Python 开发的基石。🚀
