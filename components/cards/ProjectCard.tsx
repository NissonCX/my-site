import Link from 'next/link';
import { Project } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  className?: string;
  index?: number;
}

export function ProjectCard({ project, className, index = 0 }: ProjectCardProps) {
  return (
    <div
      className={cn(
        'group relative bg-surface/80 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden',
        'hover:translate-y-[-4px] hover:shadow-elevated',
        'transition-all duration-500 animate-slide-up opacity-0',
        className
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 内容 - 纯文字展示 */}
      <div className="p-8 space-y-4">
        {/* 标题 - Serif */}
        <h3 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors duration-500">
          {project.name}
        </h3>

        {/* 描述 - Sans */}
        <p className="text-body text-secondary leading-relaxed">
          {project.description}
        </p>

        {/* 技术栈 - Mono */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.techStack.map((tech) => (
            <span key={tech} className="tag">
              {tech}
            </span>
          ))}
        </div>

        {/* 链接 */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-mono text-xs text-hint hover:text-accent transition-colors duration-500"
            >
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.425-.135-.345-.72-1.425-1.23-1.71-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.05 1.77 2.745 1.275 3.42.975.105-.78.42-1.275.765-1.575-2.67-.3-5.46-1.335-5.46-5.925 0-1.32.465-2.4 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.825 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </Link>
          )}
          {project.demoUrl && (
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-mono text-xs text-accent hover:text-accent-light transition-colors duration-500"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Demo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}