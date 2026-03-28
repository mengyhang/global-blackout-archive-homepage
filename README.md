# 全球大停电事故档案库

> **铭记黑暗，守护光明** / Light fades. Memory endures.

上海交通大学电力系统安全分析课程组出品，献礼上海交通大学建校 **130 周年**。

以客观、翔实的档案视角，系统整理全球历史上 13 次重大停电事故，深入分析其成因、影响与应对举措，为公众提供一个可查阅、可学习、可反思的知识平台。

## 在线访问

**网站地址**：[global-blackout-archive-homepage.pages.dev](https://global-blackout-archive-homepage.pages.dev)

## 技术栈

| 层级 | 技术 | 职责 |
|------|------|------|
| 框架 | **Astro** | 静态站点生成，默认零 JS 开销 |
| UI 组件 | **React** | 交互组件开发 |
| 样式 | **Tailwind CSS** | 原子化 CSS，自由定制视觉设计 |
| 动画/叙事 | **GSAP + ScrollTrigger** | 滚动驱动叙事，全屏逐幕切换 |
| 地理可视化 | **Natural Earth + SVG** | 真实海岸线数据，太平洋居中投影 |

## 快速开始

### 环境要求

- Node.js >= 22

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

开发服务器地址：`http://localhost:4321`

## 项目结构

```
src/
├── components/
│   ├── HeroScene.tsx        # 入场引导（SJTU献礼）+ 光点粒子 + Slogan
│   ├── EmpathyScene.tsx     # 停电共情体验（灯光闪烁 → 屏幕变暗 → 统计数字）
│   ├── GlobalMapScene.tsx   # 全球停电地图（Natural Earth 海岸线 + 时间轴）
│   ├── FiveActsScene.tsx    # 五幕故事导览容器
│   ├── ActSection.tsx       # 单幕组件（全屏 pin + scrub 滚动驱动）
│   ├── EventCard.tsx        # 停电事件卡片（档案风格）
│   ├── FinaleScene.tsx      # 尾声（光明回归 + 校庆收束 + 档案入口）
│   ├── AmbientParticles.tsx # 全局浮动光粒子（场景自适应亮度）
│   ├── ScrollProgress.tsx   # 右侧滚动进度指示器
│   └── ScrollRefresh.tsx    # ScrollTrigger 多 pin 位置校准器
├── data/
│   ├── blackouts.ts         # 13 次停电事件数据 + 五幕定义
│   └── worldCoastline.ts    # 简化世界海岸线 SVG 路径（备用）
├── layouts/
│   └── MainLayout.astro     # 基础 HTML 布局
├── pages/
│   └── index.astro          # 首页入口
└── styles/
    └── global.css           # 全局样式、卡片样式、噪点纹理
```

## 叙事结构

首页是一个连续的滚动驱动叙事体验，以**五幕剧**结构展开：

| 幕 | 主题 | 收录事件 |
|----|------|----------|
| 第一幕 · 脆弱与觉醒 | 人类第一次直面电网的脆弱 | 1965 北美大停电、1977 纽约大停电 |
| 第二幕 · 自然之力 | 自然面前，电网渺小如纸 | 1989 魁北克、2012 印度、2016 南澳大利亚 |
| 第三幕 · 连锁崩塌 | 牵一发而动全身 | 2003 美加、2003 意大利、2006 欧洲 |
| 第四幕 · 新时代，新威胁 | 网络攻击、极端气候、制度缺陷 | 2015 乌克兰、2019 阿根廷、2019 英国、2021 德州 |
| 第五幕 · 此刻 | 故事还没有结束 | 2025 伊比利亚半岛 |

**双线叙事**：
- **明线**：60 年全球大停电编年史
- **暗线**：上海交通大学电气学科发展脉络（1896 — 2026），幕间以克制的文字串联

## 部署

构建产物为纯静态文件，可部署到任意静态托管平台。当前使用 **Cloudflare Pages**，推送到 `main` 分支自动构建部署。

```bash
# 构建输出目录
dist/
```

## 致谢

上海交通大学 电气工程学院

电力系统安全分析课程组

