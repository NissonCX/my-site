import { Metadata } from 'next';
import { personal, socialLinks, skills, workExperiences } from '@/data';
import { SocialLinks } from "@/components/home/SocialLinks";
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: '关于我',
  description: '了解 NissonCX 的技术方向、实习经历和联系方式',
  keywords: ['NissonCX', 'Java 后端开发', 'Agent 开发', '重庆大学', '字节跳动', '个人简介'],
};

export default function AboutPage() {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-2xl mx-auto px-6 md:px-12">
        {/* Profile */}
        <div className="text-center mb-16">
          {/* Avatar */}
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-elevated bg-muted mb-6">
            <img
              src={personal.avatar}
              alt={personal.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name - Serif */}
          <h1 className="font-serif text-3xl text-foreground">{personal.name}</h1>

          {/* Title - Mono */}
          <p className="font-mono text-xs text-hint tracking-wide mt-2 uppercase">
            {personal.title}
          </p>

          {/* Bio - Sans */}
          <p className="text-body text-secondary mt-4 max-w-md mx-auto leading-relaxed">
            {personal.bio}
          </p>

          {/* Location */}
          <p className="font-mono text-xs text-hint mt-3 flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {personal.location}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface text-foreground text-xs font-mono">
              🎓 {personal.education}
            </p>
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              🚀 字节跳动（懂车帝）后端开发实习（即将入职）
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Skills */}
        <div className="mb-12">
          <h2 className="font-serif text-lg text-foreground text-center mb-6">技术方向</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className="tag"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Work Experience */}
        <div className="mb-12">
          <h2 className="font-serif text-lg text-foreground text-center mb-6">工作经历（重点展示）</h2>
          <div className="space-y-4">
            {workExperiences.map((exp) => (
              <article
                key={exp.id}
                className={cn(
                  'rounded-xl border p-5',
                  exp.featured
                    ? 'border-accent/40 bg-accent/5 shadow-elevated'
                    : 'border-border/40 bg-surface/60'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-base text-foreground">
                      {exp.company}
                      {exp.featured && (
                        <span className="ml-2 align-middle inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-mono text-accent">
                          重点
                        </span>
                      )}
                    </h3>
                    <p className="text-body-sm text-secondary mt-1">{exp.role}</p>
                  </div>
                  <span className="font-mono text-xs text-hint">{exp.period}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {exp.location && <span className="tag">{exp.location}</span>}
                  {exp.status && <span className="tag">{exp.status}</span>}
                </div>

                <p className="text-body-sm text-secondary mt-3 leading-relaxed">
                  {exp.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Interests */}
        <div className="mb-12">
          <h2 className="font-serif text-lg text-foreground text-center mb-6">兴趣爱好</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {['巴塞罗那 / 梅西', '校园足球', 'Multi-Agent 折腾', 'LinuxDo 社区', '技术写作与分享'].map((interest) => (
              <span key={interest} className="tag">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Contact */}
        <div className="text-center">
          <h2 className="font-serif text-lg text-foreground mb-6">联系方式</h2>
            <div className="flex justify-center">
              <SocialLinks links={socialLinks} />
            </div>

          <p className="font-mono text-xs text-hint mt-4">
            欢迎技术交流、学术探讨或内推机会
          </p>
        </div>

        {/* Personal Statement */}
        <div className="mt-16 text-center">
          <p className="text-body-sm text-secondary max-w-md mx-auto leading-relaxed">
            重庆大学计算机科学与技术本科在读，曾在杭州趣链科技担任 Java 后端开发实习，即将入职字节跳动（懂车帝）后端开发实习。
            保持后端主线的同时，持续探索 Agent 开发、多智能体协作与工程效率工具。
          </p>
        </div>
      </div>
    </section>
  );
}

// Social Icon Component
