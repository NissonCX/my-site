import { Metadata } from 'next';
import { projects } from '@/data';
import { ProjectCard } from '@/components/cards';

export const metadata: Metadata = {
  title: '项目作品',
  description: 'NissonCX 的项目作品展示，包括 Java 后端开发、微服务架构、AI 应用等技术实践项目',
  keywords: ['Java 项目', 'Spring Boot', '微服务', '开源项目', 'NissonCX'],
};

export default function ProjectsPage() {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16">
          <p className="font-mono text-xs text-hint tracking-widest uppercase mb-2">Projects</p>
          <h1 className="text-title">项目作品</h1>
          <div className="divider-subtle mt-6" />
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 text-center">
          <p className="font-mono text-xs text-hint">
            更多项目持续更新中 · GitHub 查看最新动态
          </p>
        </div>
      </div>
    </section>
  );
}