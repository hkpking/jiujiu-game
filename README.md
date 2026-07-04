# 九九乘法口诀在线小游戏

这是一个面向小朋友的九九乘法口诀在线小游戏，使用单文件 HTML 实现，无需后端服务，浏览器打开即可运行。

## 功能

- 练习模式
- 60 秒挑战模式
- 1～5 入门、1～9 标准、缺数挑战
- 自动计分、连击加分、最高分记录
- 错题本复盘
- 内置九九乘法口诀表
- 适配 iPhone Safari 和手机竖屏

## 本地运行

直接打开：

```text
index.html
```

## Netlify 部署

当前项目是纯静态站点，Netlify 设置如下：

```text
Build command：留空
Publish directory：.
```

如果通过 Netlify 连接 GitHub 仓库，选择本仓库 `hkpking/jiujiu-game`，默认分支选择 `main`。

## GitHub Pages 部署

也可以使用 GitHub Pages：

1. 进入仓库 Settings
2. 打开 Pages
3. Source 选择 `Deploy from a branch`
4. Branch 选择 `main`
5. Folder 选择 `/root`

发布后通常可以通过以下地址访问：

```text
https://hkpking.github.io/jiujiu-game/
```
