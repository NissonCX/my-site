# NissonCX - 个人主页

> 一个现代化的个人主页网站，展示技术能力、项目作品与生活记录

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](https://opensource.org/licenses/MIT)

## 🌟 项目简介

这是我的个人主页网站，用于展示：

- 📌 个人信息和技术能力
- 🚀 项目作品集
- 📸 生活记录与照片
- ✍️ 技术文章与随笔

## 🛠️ 技术栈

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **部署**: [Vercel](https://vercel.com/)
- **字体**: [Geist](https://vercel.com/font)

## 📁 项目结构

```
my-site/
├── app/                 # Next.js App Router 页面
│   ├── layout.tsx       # 全局布局
│   ├── page.tsx         # 首页
│   ├── projects/        # 项目页
│   ├── gallery/         # 生活展示页
│   ├── notes/           # 文章页
│   └── about/           # 关于页
├── components/          # React 组件
│   ├── layout/          # 布局组件 (Navbar, Footer)
│   ├── home/            # 首页区块组件
│   ├── cards/           # 卡片组件
│   └── ui/              # 基础 UI 组件
├── data/                # Mock 数据
├── types/               # TypeScript 类型定义
├── lib/                 # 工具函数
└── public/              # 静态资源
```

## 🚀 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- npm、yarn 或 pnpm

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
npm run build
```

### 运行生产版本

```bash
npm run start
```

## 📦 部署

### Vercel 部署（推荐）

1. Fork 本仓库到你的 GitHub 账号
2. 在 [Vercel](https://vercel.com/) 导入项目
3. 自动识别 Next.js，一键部署

### 自定义域名

在 Vercel 项目设置中添加自定义域名 `caoxu.xyz`，然后在域名解析中添加 CNAME 记录指向 `cname.vercel-dns.com`。

## 🎨 设计理念

- **极简主义**: 克制的设计，不做过度装饰
- **高级感**: 充足的留白，清晰的视觉层级
- **响应式**: PC 端优先，移动端完美适配
- **性能优先**: 静态生成，快速加载

## 📝 内容更新

### 修改个人信息

编辑 `data/personal.ts` 文件：

```typescript
export const personal: Personal = {
  name: '你的名字',
  title: '你的职位',
  bio: '一句话介绍',
  // ...
};
```

### 添加项目

编辑 `data/projects.ts` 文件，按照现有格式添加新项目。

### 添加文章

编辑 `data/notes.ts` 文件，按照现有格式添加新文章。

### 添加图片

编辑 `data/gallery.ts` 文件，按照现有格式添加图片信息。

## 📄 License

本项目采用 [MIT License](./LICENSE) 开源协议。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Vercel](https://vercel.com/) - 部署平台
- [Geist Font](https://vercel.com/font) - 字体

---

Made with ❤️ by [NissonCX](https://github.com/NissonCX)