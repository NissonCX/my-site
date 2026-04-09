import { Note } from '@/types';

export const notes: Note[] = [
  {
    id: '1',
    slug: 'spring-cloud-nacos-config',
    title: 'Spring Cloud Nacos 配置中心最佳实践',
    summary: '详解 Nacos 配置中心的使用方式，包括配置管理、动态刷新、多环境隔离等核心功能',
    content: `
## 前言

Nacos 作为 Spring Cloud Alibaba 的核心组件，提供了配置管理和服务发现两大功能。本文重点介绍配置管理的最佳实践。

## 配置管理基础

### 1. 配置数据结构

Nacos 采用 Data ID + Group + Namespace 的三层结构：

- **Data ID**: 配置文件的唯一标识，如 \`application.yaml\`
- **Group**: 配置分组，默认为 \`DEFAULT_GROUP\`
- **Namespace**: 命名空间，用于多环境隔离

### 2. 动态配置刷新

使用 \`@RefreshScope\` 注解实现配置动态刷新：

\`\`\`java
@RefreshScope
@RestController
public class ConfigController {

    @Value("\${app.config.value}")
    private String configValue;

    @GetMapping("/config")
    public String getConfig() {
        return configValue;
    }
}
\`\`\`

## 最佳实践

1. **多环境隔离**：使用不同 Namespace 区分开发、测试、生产环境
2. **配置分组**：按业务模块分组，便于管理
3. **灰度发布**：利用配置版本管理，实现安全发布
4. **权限控制**：启用 ACL，保障配置安全

## 总结

Nacos 配置中心为微服务架构提供了强大的配置管理能力，合理使用可以显著提升系统的可维护性。
    `,
    date: '2025-03-15',
    tags: ['Spring Cloud', 'Nacos', '微服务'],
  },
  {
    id: '2',
    slug: 'langchain4j-rag-intro',
    title: 'LangChain4j 构建 RAG 应用入门指南',
    summary: '从零开始学习 LangChain4j，构建基于 RAG 的智能问答系统，包含向量检索和对话生成',
    content: `
## 什么是 RAG

RAG（Retrieval-Augmented Generation）是一种结合检索和生成的人工智能应用架构：

1. **检索阶段**：从知识库中检索相关文档
2. **生成阶段**：基于检索内容生成回答

## LangChain4j 简介

LangChain4j 是 Java 生态的 LangChain 实现，提供了：

- 多种 AI 模型集成（OpenAI、智谱 AI、通义千问等）
- 向量数据库支持（Milvus、Pinecone 等）
- RAG 流程编排
- Prompt 模板管理

## 架构设计

\`\`\`
用户提问 → 向量检索 → 文档排序 → Prompt 组装 → AI 生成 → 返回答案
\`\`\`

## 核心代码示例

\`\`\`java
// 配置向量存储
EmbeddingStore<TextSegment> embeddingStore = MilvusEmbeddingStore.builder()
    .host("localhost")
    .port(19530)
    .collectionName("knowledge")
    .build();

// 配置嵌入模型
EmbeddingModel embeddingModel = ZhipuAiEmbeddingModel.builder()
    .apiKey(apiKey)
    .build();

// 构建检索器
ContentRetriever retriever = EmbeddingStoreContentRetriever.builder()
    .embeddingStore(embeddingStore)
    .embeddingModel(embeddingModel)
    .maxResults(3)
    .build();

// 构建智能助手
AiService assistant = AiServices.builder(Assistant.class)
    .chatLanguageModel(chatModel)
    .contentRetriever(retriever)
    .build();
\`\`\`

## 总结

LangChain4j 为 Java 开发者提供了便捷的 AI 应用开发方式，RAG 架构可以显著提升 AI 应用的准确性和可靠性。
    `,
    date: '2025-02-20',
    tags: ['LangChain4j', 'RAG', 'AI', 'Java'],
    coverImage: '/images/projects/ai-qa.png',
  },
  {
    id: '3',
    slug: 'mybatis-plus-optimization',
    title: 'MyBatis-Plus 性能优化实践',
    summary: '分享 MyBatis-Plus 在高并发场景下的性能优化策略，包括批量操作、缓存配置、SQL优化等',
    content: `
## 引言

MyBatis-Plus 是 MyBatis 的增强工具，在保持 MyBatis 灵活性的同时，提供了更多便捷功能。本文分享一些性能优化实践。

## 1. 扙量操作优化

使用 \`saveBatch\` 批量插入，避免逐条插入的性能问题：

\`\`\`java
// 批量插入，每批次 1000 条
userService.saveBatch(userList, 1000);
\`\`\`

## 2. 缓存配置

启用二级缓存，减少重复查询：

\`\`\`java
@CacheNamespace
public interface UserMapper extends BaseMapper<User> {
}
\`\`\`

## 3. 分页优化

使用分页插件避免全表扫描：

\`\`\`java
@Configuration
public class MybatisConfig {
    @Bean
    public MybatisPlusInterceptor paginationInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
\`\`\`

## 4. SQL 优化建议

- 避免 \`SELECT *\`，只查询需要的字段
- 合理使用索引，确保查询条件命中索引
- 复杂查询考虑拆分，避免大 SQL

## 总结

性能优化需要从多个维度考虑，MyBatis-Plus 提供了丰富的工具，合理使用可以显著提升系统性能。
    `,
    date: '2025-01-10',
    tags: ['MyBatis', '数据库', '性能优化'],
  },
  {
    id: '4',
    slug: 'first-personal-site',
    title: '我的第一个个人网站',
    summary: '记录使用 Next.js 和 Tailwind CSS 搭建个人网站的过程，分享技术选型和设计思路',
    content: `
## 项目背景

一直想有一个属于自己的个人主页，可以展示技术能力、项目作品和生活记录。这次终于动手实现了。

## 技术选型

### 前端框架

选择 **Next.js** 作为前端框架：
- App Router 架构，更现代的路由方案
- 原生支持 SSR 和 SSG
- Vercel 一键部署，非常方便

### 样式方案

选择 **Tailwind CSS**：
- Utility-first，开发效率高
- 响应式设计友好
- 不需要维护单独的 CSS 文件

### 部署方案

第一阶段采用 **Vercel** 海外托管：
- 免费、稳定、快速
- 自动 CI/CD
- 支持自定义域名

后续考虑迁移到国内服务器，优化国内访问速度。

## 设计思路

整体风格：
- **极简主义**：克制设计，不做过度装饰
- **高级感**：充足的留白，清晰的视觉层级
- **个人品牌**：通过配色和排版体现个人风格

## 实现过程

1. 项目初始化：使用 \`create-next-app\` 快速搭建
2. 目录结构：按页面和组件清晰划分
3. Mock 数据：先实现静态数据，后续可接入 CMS
4. 组件开发：先公共组件，再页面组件
5. UI 优化：反复调整细节，打磨视觉效果

## 总结

这是一个很好的学习项目，让我深入了解了 Next.js 和现代前端开发流程。后续会继续优化和扩展功能。
    `,
    date: '2025-04-09',
    tags: ['Next.js', 'Tailwind CSS', '个人项目'],
    coverImage: '/images/projects/personal-site.png',
  },
];

export const latestNotes = notes.slice(0, 3);