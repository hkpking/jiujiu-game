# 九九乘法口诀在线小游戏 V2

这是一个面向小学二年级的 HTML 教学小游戏。V2 版本从原来的答题器重构为“乘法星球大冒险”，重点是让孩子先理解“几个几”，再通过闯关练习口诀。

## 主要功能

- 星球地图闯关
- 2、3、4、5、6～9 和混合 Boss 关
- 看图理解乘法
- 口诀补空、缺数挑战、找朋友题
- 每关 0～3 星奖励
- 徽章与贴纸
- 错题救援站
- 浏览器本地保存学习进度
- 适配 iPhone Safari 和手机竖屏

## 文件结构

- index.html：页面结构
- style.css：样式与响应式布局
- js/levels.js：关卡配置
- js/questions.js：出题逻辑
- js/storage.js：本地进度保存
- js/rewards.js：星星、徽章、解锁规则
- js/ui.js：页面渲染
- js/app.js：游戏主流程

## Netlify 部署

这是纯静态项目，无需构建。

Build command 留空，Publish directory 填 .
