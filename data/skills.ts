import { Skill } from '@/types';

export const skills: Skill[] = [
  // 语言
  { name: 'Java', category: 'language', level: 'proficient' },
  { name: 'TypeScript', category: 'language', level: 'familiar' },
  { name: 'Python', category: 'language', level: 'familiar' },
  { name: 'SQL', category: 'language', level: 'proficient' },

  // 框架
  { name: 'Spring Boot', category: 'framework', level: 'proficient' },
  { name: 'Spring Cloud Alibaba', category: 'framework', level: 'proficient' },
  { name: 'MyBatis', category: 'framework', level: 'proficient' },
  { name: 'Next.js', category: 'framework', level: 'familiar' },
  { name: 'Vue3', category: 'framework', level: 'familiar' },
  { name: 'LangChain4j', category: 'framework', level: 'familiar' },

  // 数据库
  { name: 'MySQL', category: 'database', level: 'proficient' },
  { name: 'Redis', category: 'database', level: 'proficient' },
  { name: 'Milvus', category: 'database', level: 'familiar' },

  // 工具
  { name: 'Git', category: 'tool', level: 'proficient' },
  { name: 'Docker', category: 'tool', level: 'familiar' },
  { name: 'Nacos', category: 'tool', level: 'familiar' },
  { name: 'RabbitMQ', category: 'tool', level: 'familiar' },

  // 其他
  { name: 'HarmonyOS', category: 'other', level: 'familiar' },
];

export const skillCategories = [
  { key: 'language', label: '编程语言' },
  { key: 'framework', label: '框架 & 库' },
  { key: 'database', label: '数据库' },
  { key: 'tool', label: '工具 & 中间件' },
  { key: 'other', label: '其他' },
];