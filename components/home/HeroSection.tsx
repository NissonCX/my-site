import { personal } from '@/data';
import { Button } from '@/components/ui';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-cta/5 rounded-full blur-3xl" />
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* 文字信息 */}
          <div className="flex-1 text-center md:text-left animate-slide-up opacity-0 stagger-1">
            {/* 身份标签 */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
              {personal.title}
            </div>

            {/* 名字 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight font-heading">
              你好，我是
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary-light to-cta bg-clip-text text-transparent">
                {personal.name}
              </span>
            </h1>

            {/* 一句话介绍 */}
            <p className="mt-6 text-lg md:text-xl text-secondary max-w-lg leading-relaxed">
              {personal.bio}
            </p>

            {/* 按钮 */}
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
              <Link href="/projects">
                <Button variant="primary" size="lg">
                  <span>查看项目</span>
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" size="lg">
                  了解更多
                </Button>
              </Link>
            </div>
          </div>

          {/* 头像区域 */}
          <div className="flex-shrink-0 relative animate-scale-in opacity-0 stagger-2">
            {/* 装饰环 */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-cta rounded-full blur-2xl opacity-20 scale-110" />
            <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-primary/20 to-cta/10 p-1">
              <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                {personal.avatar ? (
                   
                  <img
                    src={personal.avatar}
                    alt={personal.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-primary to-cta bg-clip-text text-transparent font-heading">
                    {personal.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}