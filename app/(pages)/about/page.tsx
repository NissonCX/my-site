import { Metadata } from 'next';
import { personal, socialLinks, skills } from '@/data';
import { SocialLinks } from "@/components/home/SocialLinks";

export const metadata: Metadata = {
  title: '关于我',
  description: '了解 NissonCX 的技术方向、个人经历和联系方式',
  keywords: ['NissonCX', 'Java 后端工程师', '重庆大学', '个人简介'],
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

        {/* Interests */}
        <div className="mb-12">
          <h2 className="font-serif text-lg text-foreground text-center mb-6">兴趣爱好</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {['阅读技术书籍', '探索新技术', '摄影', '户外运动', '音乐'].map((interest) => (
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
            欢迎交流，期待与你联系
          </p>
        </div>

        {/* Personal Statement */}
        <div className="mt-16 text-center">
          <p className="text-body-sm text-secondary max-w-md mx-auto leading-relaxed">
            我是一名热爱技术的 Java 后端工程师，专注于微服务架构和 AI 应用开发。
            在工作中不断学习新技术，追求代码质量与工程效率的提升。
          </p>
        </div>
      </div>
    </section>
  );
}

// Social Icon Component
