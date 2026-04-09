'use client';

import { personal } from '@/data';
import { socialLinks } from '@/data';
import { SocialLinks } from '@/components/home/SocialLinks';
import { latestNotes } from '@/data';
import { projects } from '@/data';
import { galleryImages } from '@/data';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 精选照片
  const featuredPhotos = galleryImages.slice(0, 6);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - Editorial Style */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* 背景装饰 - 柔和渐变 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent-secondary/5 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-20">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* 左侧：头像 */}
            <div className="col-span-12 md:col-span-4 flex justify-center md:justify-end">
              <div
                className={`relative opacity-0 ${isVisible ? 'animate-scale-in' : ''}`}
                style={{ animationDelay: '0.2s' }}
              >
                {/* 装饰环 */}
                <div className="absolute inset-0 rounded-full border border-accent/20 scale-110" />
                <div className="absolute inset-0 rounded-full border border-accent/10 scale-125" />
                {/* 头像 */}
                <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden shadow-elevated bg-muted">
                  <img
                    src={personal.avatar}
                    alt={personal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 右侧：内容 */}
            <div className="col-span-12 md:col-span-8 space-y-6">
              {/* 身份标签 */}
              <p
                className={`font-mono text-xs text-hint tracking-widest uppercase opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: '0.3s' }}
              >
                {personal.title}
              </p>

              {/* 名字 - Serif */}
              <h1
                className={`text-hero text-foreground opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: '0.4s' }}
              >
                {personal.name}
              </h1>

              {/* 简介 */}
              <p
                className={`text-subtitle max-w-lg opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: '0.5s' }}
              >
                {personal.bio}
              </p>

              {/* CTA 按钮 */}
              <div
                className={`flex flex-wrap gap-4 pt-4 opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: '0.6s' }}
              >
                <Link href="/projects" className="btn-primary">
                  探索作品
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/about" className="btn-secondary">
                  关于我
                </Link>
              </div>

              {/* 社交链接 */}
              <div
                className={`pt-4 opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: '0.7s' }}
              >
                <SocialLinks links={socialLinks} className="-ml-3 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 分割线 */}
      <div className="divider max-w-6xl mx-auto" />

      {/* 生活碎片 Section */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="font-mono text-xs text-hint tracking-widest uppercase mb-2">Daily Life</p>
            <h2 className="text-title">生活碎片</h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {featuredPhotos.map((photo, index) => (
              <Link
                key={photo.id}
                href="/gallery"
                className={`group relative overflow-hidden rounded-xl bg-muted ${
                  index === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700"
                />
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center font-mono text-sm text-hint hover:text-accent transition-colors duration-500"
            >
              查看更多
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 分割线 */}
      <div className="divider max-w-6xl mx-auto" />

      {/* 技术笔记 Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="font-mono text-xs text-hint tracking-widest uppercase mb-2">Tech Notes</p>
            <h2 className="text-title">技术笔记</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNotes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.slug}`}
                className="group card-paper p-6"
              >
                <time className="font-mono text-xs text-hint">{note.date}</time>
                <h3 className="font-serif text-lg text-foreground mt-2 group-hover:text-accent transition-colors duration-500">
                  {note.title}
                </h3>
                <p className="text-body-sm text-secondary mt-3 line-clamp-2">
                  {note.summary}
                </p>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/notes"
              className="inline-flex items-center font-mono text-sm text-hint hover:text-accent transition-colors duration-500"
            >
              全部文章
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 分割线 */}
      <div className="divider max-w-6xl mx-auto" />

      {/* 项目作品 Section */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="font-mono text-xs text-hint tracking-widest uppercase mb-2">Projects</p>
            <h2 className="text-title">项目作品</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.filter(p => p.featured).slice(0, 2).map((project) => (
              <Link
                key={project.id}
                href="/projects"
                className="group card-paper p-8"
              >
                <h3 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors duration-500">
                  {project.name}
                </h3>
                <p className="text-body text-secondary mt-3 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center font-mono text-sm text-hint hover:text-accent transition-colors duration-500"
            >
              查看全部
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 联系 Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-xs text-hint tracking-widest uppercase mb-2">Contact</p>
          <h2 className="text-title mb-4">保持联系</h2>
          <p className="text-subtitle mb-8">
            欢迎通过以下方式与我交流
          </p>

          <div className="flex justify-center gap-4">
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-serif text-lg text-foreground mb-2">{personal.name}</p>
          <p className="font-mono text-xs text-hint">
            © {new Date().getFullYear()} · Built with Next.js & Tailwind
          </p>
        </div>
      </footer>
    </main>
  );
}

// 社交图标组件
