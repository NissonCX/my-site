'use client';

import { useState } from 'react';
import { personal, socialLinks } from '@/data';
import { Button } from '@/components/ui';
import { SocialLinks } from '@/components/home/SocialLinks';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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

            {/* 介绍段落（融合自我介绍与Vibe Coding特质） */}
            <div className="space-y-6 text-base md:text-lg text-secondary leading-relaxed max-w-xl mx-auto md:mx-0">
              <p className="font-medium text-foreground tracking-wide">
                重庆大学 CS 本科在读 · 趣链科技研发实习
              </p>
              <p>
                一个热衷于技术细节的“全干”爱好者。从深入 <b>Java微服务架构</b> 起步，到如今积极在这个多智能体 (Multi-Agent) 时代探索 <b>AI 全栈与 Vibe Coding</b>，也曾专为 OpenClaw 撰写 Skill。我喜欢享受让 AI 开始真正干活的过程。
              </p>
              <p className="flex items-center justify-center md:justify-start text-sm font-mono text-blue-500/80 dark:text-blue-400 mt-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mr-2" />
                正在寻找暑期大厂实习
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
                  偏爱巴塞罗那，坚定传控理念。<br/>是<span className={cn("transition-colors duration-500", hoverState === 'barca' ? "text-[#A50044] font-bold" : "")}>理想主义者</span>，也是殉道者。<span className={cn("transition-colors duration-500", hoverState === 'barca' ? "text-[#004D98] font-bold" : "")}>梅西</span>则是足球的本身。
                </p>
              </div>

              {/* 音乐段落 (纵贯线) */}
              <div 
                className="relative group cursor-default transition-transform duration-500"
                onMouseEnter={() => setHoverState('music')}
                onMouseLeave={() => setHoverState('default')}
              >
                <p className="font-serif text-[15px] leading-relaxed text-secondary transition-colors duration-500 italic">
                  “出发了不要管那路在哪，迎风向前是唯一的方法。”
                  <span className={cn("block mt-2 text-xs font-sans not-italic font-medium transition-colors duration-500 uppercase tracking-widest", hoverState === 'music' ? "text-amber-500" : "text-hint")}>
                    — 纵贯线乐队《公路》
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
