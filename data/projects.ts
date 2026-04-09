import { Project } from '@/types';

export const projects: Project[] = [
  {
    id: '1',
    name: 'AI 智能招聘系统 (Smart ATS)',
    description: '智能招聘管理系统：AI 简历解析、RAG 语义搜索、异步处理管道、招聘漏斗分析。基于 Spring Boot 3, 智谱AI & Milvus 构建',
    techStack: ['Java', 'Spring Boot 3', 'Milvus', '智谱AI', 'RAG'],
    githubUrl: 'https://github.com/NissonCX/smart-ats',
    demoUrl: '#',
    coverImage: '/images/projects/ai-qa.png',
    featured: true,
  },
  {
    id: '2',
    name: '虎溪锐评 - 分布式后台',
    description: '企业级本地生活服务后端系统。应对高并发秒杀、引入多级缓存、服务降级、异步消息处理的实战项目',
    techStack: ['Java', 'Spring Cloud', 'Redis', 'MySQL', 'RabbitMQ'],
    githubUrl: 'https://github.com/NissonCX/huxirating-backend',
    coverImage: '/images/projects/ecommerce.png',
    featured: true,
  },
  {
    id: '3',
    name: '个人网站 (my-site)',
    description: '使用 Next.js 和 Tailwind CSS 构建的个人主页，展示技术能力和生活记录',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    githubUrl: 'https://github.com/NissonCX/my-site',
    demoUrl: 'https://caoxu.xyz',
    coverImage: '/images/projects/personal-site.png',
    featured: true,
  },
  {
    id: '4',
    name: 'HarmonyOS 移动应用',
    description: '基于 HarmonyOS ArkTS 开发的实际项目应用终末作业，深入探索鸿蒙生态系统全场景开发',
    techStack: ['ArkTS', 'HarmonyOS', 'ArkUI'],
    githubUrl: 'https://github.com/NissonCX/CQU-HarmonyOS-APP-Dev-Final',
    coverImage: '/images/projects/harmonyos.png',
    featured: false,
  },
  {
    id: '5',
    name: 'OfferCatcher',
    description: 'AI 驱动的招聘邮件提醒工具，自动提取面试内容与时间安排并同步到 Apple Reminders',
    techStack: ['Python', 'Apple Reminders', 'AI/LLM'],
    githubUrl: 'https://github.com/NissonCX/offercatcher',
    coverImage: '/images/projects/scheduler.png',
    featured: false,
  },
  {
    id: '6',
    name: 'SteamScope',
    description: '优质的 Steam 玩家数据展示平台，提供出色的 UI 与分享卡片，并内置 Steam OpenID 认证',
    techStack: ['TypeScript', 'Vue3/React', 'Steam API'],
    githubUrl: 'https://github.com/NissonCX/SteamScope',
    coverImage: '/images/projects/dashboard.png',
    featured: false,
  },
];

export const featuredProjects = projects.filter(p => p.featured);
