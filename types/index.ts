// 个人信息类型
export interface Personal {
  name: string;
  title: string;        // 身份标签，如"Java后端工程师"
  bio: string;          // 一句话介绍
  education: string;    // 学历信息
  avatar: string;
  email: string;
  location: string;
}

// 项目类型
export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  coverImage: string;
  featured: boolean;    // 是否精选
}

// 技术栈类型
export interface Skill {
  name: string;
  category: SkillCategory;
  icon?: string;
  level?: SkillLevel;
}

export type SkillCategory = 'language' | 'framework' | 'database' | 'tool' | 'other';
export type SkillLevel = 'expert' | 'proficient' | 'familiar';

// 图片类型
export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  src: string;
  date?: string;
  location?: string;
  category?: string;  // 分类，如'风景'、'校园'、'生活'等
}

// 文章类型
export interface Note {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;      // Markdown内容
  date: string;
  tags: string[];
  coverImage?: string;
}

// 工作经历类型
export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  status?: string;
  featured?: boolean;
  description: string;
}

// 导航类型
export interface NavItem {
  label: string;
  path: string;
}

// 社交链接类型
export interface SocialLink {
  name: string;
  url: string;
  icon: SocialIcon;
  username?: string;    // 显示的用户名，如微信号
}

export type SocialIcon = 'github' | 'email' | 'qq' | 'wechat' | 'twitter' | 'linkedin' | 'blog';
