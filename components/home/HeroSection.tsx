'use client';

import { useState } from 'react';
import { personal, socialLinks } from '@/data';
import { SocialLinks } from '@/components/home/SocialLinks';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const [hoverState, setHoverState] = useState<'default' | 'barca' | 'music'>('default');

  return (
    <section className="relative py-20 md:py-32 overflow-hidden min-h-[85vh] flex items-center">
      {/* 沉浸式环境光影背景 (根据 Hover 状态无缝切换) */}
      <div className="absolute inset-0 -z-10 transition-colors duration-1000">
        {/* 默认环境光 - 更柔和 */}
        <div className={cn("absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] transition-opacity duration-1000", hoverState === 'default' ? "opacity-20 bg-accent/20" : "opacity-0")} />
        <div className={cn("absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] transition-opacity duration-1000", hoverState === 'default' ? "opacity-10 bg-accent-secondary/10" : "opacity-0")} />
        
        {/* 巴塞罗那红蓝渐变 */}
        <div className={cn("absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#004D98]/20 rounded-full blur-[120px] transition-opacity duration-1000 mix-blend-screen", hoverState === 'barca' ? "opacity-100" : "opacity-0")} />
        <div className={cn("absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#A50044]/20 rounded-full blur-[120px] transition-opacity duration-1000 mix-blend-screen", hoverState === 'barca' ? "opacity-100" : "opacity-0")} />

        {/* 音乐黑胶唱片暖琥珀色光晕 */}
        <div className={cn("absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[120px] transition-opacity duration-1000 mix-blend-screen", hoverState === 'music' ? "opacity-100" : "opacity-0")} />
        <div className={cn("absolute bottom-1/4 right-1/3 w-[700px] h-[500px] bg-orange-600/15 rounded-full blur-[120px] transition-opacity duration-1000 mix-blend-screen", hoverState === 'music' ? "opacity-100" : "opacity-0")} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16 md:gap-24">
          
          {/* 左侧：文字叙事区 */}
          <div className="flex-1 text-center md:text-left animate-slide-up opacity-0 max-w-2xl" style={{ animationFillMode: 'forwards' }}>
            
            {/* 顶栏身份标签极简重塑 */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-10">
              <span className="font-mono text-sm tracking-widest uppercase text-secondary">
                {personal.title}
              </span>
            </div>

            {/* 名字 */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-serif text-foreground tracking-tight mb-8 relative inline-block">
              {personal.name}
              <span className="absolute -top-4 -right-12 text-2xl animate-[bounce_2s_infinite]">👋</span>
            </h1>

            {/* 标志性标签 */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
              <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-foreground">
                🎓 {personal.education}
              </span>
              <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-mono text-accent">
                🚀 字节跳动（懂车帝）后端开发实习（即将入职）
              </span>
            </div>

            {/* 介绍段落 */}
            <div className="space-y-6 text-base md:text-lg text-secondary leading-relaxed max-w-xl mx-auto md:mx-0">
              <p className="font-medium text-foreground tracking-wide">
                重庆大学 CS 本科大三在读 · 前趣链科技 Java 后端开发实习
              </p>
              <p>
                虽然后端起步，但我始终是“全干”选手：主线深耕 <b>Java / Spring Boot</b>，同时持续探索 <b>Agent 开发与 Multi-Agent 协作</b>。正在系统学习 TypeScript 与 Node.js，也在持续打磨 OpenClaw 与 Claude Code 的定制 Skill。
              </p>
              <p className="flex items-center justify-center md:justify-start text-sm font-mono text-blue-500/80 dark:text-blue-400 mt-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mr-2" />
                标志性经历：即将入职字节跳动（懂车帝）后端开发实习
              </p>
            </div>

            {/* 社交链接 (恢复原有设计) */}
            <div className="mt-8 flex justify-center md:justify-start z-10 relative">
              <SocialLinks links={socialLinks} className="-ml-2" />
            </div>

            {/* 引言区域：交互光晕 */}
            <div className="mt-14 space-y-6 border-l-[1.5px] border-border pl-6 text-left">
              {/* 巴萨段落 */}
              <div 
                className="relative group cursor-default transition-transform duration-500"
                onMouseEnter={() => setHoverState('barca')}
                onMouseLeave={() => setHoverState('default')}
              >
                <p className="font-serif text-[15px] leading-relaxed text-secondary transition-colors duration-500">
                  铁杆巴塞罗那球迷，坚定传控理念。<br />
                  <span className={cn("transition-colors duration-500", hoverState === 'barca' ? "text-[#004D98] font-bold" : "")}>梅西</span>
                  是足球本身。Visca Barça!
                </p>
              </div>

              {/* 个人信条 */}
              <div 
                className="relative group cursor-default transition-transform duration-500"
                onMouseEnter={() => setHoverState('music')}
                onMouseLeave={() => setHoverState('default')}
              >
                <p className="font-serif text-[15px] leading-relaxed text-secondary transition-colors duration-500 italic">
                  “保持热爱，折腾不止，把每一个技术细节发掘到极致！”
                  <span className={cn("block mt-2 text-xs font-sans not-italic font-medium transition-colors duration-500 uppercase tracking-widest", hoverState === 'music' ? "text-amber-500" : "text-hint")}>
                    — NissonCX
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* 右侧：正常展示头像 */}
            <div 
              className="flex-shrink-0 animate-scale-in opacity-0 pt-8 md:mt-0 flex justify-center w-full md:w-auto" 
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl relative ring-1 ring-border/20 mx-auto group">
                <img
                  src={personal.avatar}
                  alt={personal.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

        </div>
      </div>
    </section>
  );
}
