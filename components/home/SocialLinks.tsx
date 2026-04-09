'use client';

import { useState } from 'react';
import { SocialLink } from '@/types';
import { cn } from '@/lib/utils';

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
}

// 图标映射
const iconMap: Record<string, React.ReactNode> = {
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.425-.135-.345-.72-1.425-1.23-1.71-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.05 1.77 2.745 1.275 3.42.975.105-.78.42-1.275.765-1.575-2.67-.3-5.46-1.335-5.46-5.925 0-1.32.465-2.4 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.825 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  email: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  qq: (
    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.988 0C6.113 0 1.344 4.095 1.344 9.15c0 2.213 1.05 4.256 2.8 5.869-.206 1.406-.631 2.831-.631 2.831s1.394-.131 3.263-1.013c1.65.413 3.413.619 5.213.619 5.875 0 10.644-4.095 10.644-9.15C22.632 4.095 17.863 0 11.988 0zM7.221 9.87c0-1.077.838-1.95 1.869-1.95 1.031 0 1.869.873 1.869 1.95 0 1.077-.838 1.95-1.869 1.95-1.031 0-1.869-.873-1.869-1.95zm9.556 0c0-1.077-.838-1.95-1.869-1.95-1.031 0-1.869.873-1.869 1.95 0 1.077.838 1.95 1.869 1.95 1.031 0 1.869-.873 1.869-1.95z"/>
    </svg>
  ),
  wechat: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.5c0 2.272 1.181 4.309 3.074 5.679l-.598 2.086 2.434-1.165c.936.287 1.947.447 3.001.447.231 0 .46-.013.687-.032a5.635 5.635 0 01-.436-2.212c0-3.628 3.437-6.57 7.724-6.57.394 0 .782.03 1.16.084a9.287 9.287 0 00-6.897-5.807zm-2.48 4.897a1.06 1.06 0 110 2.118 1.06 1.06 0 010-2.118zm5.481 0a1.06 1.06 0 110 2.118 1.06 1.06 0 010-2.118zm5.83 2.932c-4.099 0-7.415 2.907-7.415 6.522 0 3.615 3.316 6.522 7.415 6.522.88 0 1.723-.141 2.523-.397l2.328 1.117-.582-1.988c1.699-1.197 2.837-3.043 2.837-5.135 0-3.615-3.316-6.522-7.415-6.522zm-2.48 3.932a.909.909 0 110 1.818.909.909 0 010-1.818zm4.48 0a.909.909 0 110 1.818.909.909 0 010-1.818z" />
    </svg>
  ),
};

export function SocialLinks({ links, className }: SocialLinksProps) {
  const [showWechat, setShowWechat] = useState(false);
  const [showQQ, setShowQQ] = useState(false);

  return (
    <div className={cn('flex items-center gap-4 relative', className)}>
      {links.map((link) => {
        const isWechat = link.icon === 'wechat';
        const isQQ = link.icon === 'qq';
        const isPopupAction = isWechat || isQQ;

        return (
          <div key={link.name} className="relative flex flex-col items-center">
            {isPopupAction ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (isWechat) setShowWechat(!showWechat);
                  if (isQQ) setShowQQ(!showQQ);
                }}
                className="inline-flex items-center justify-center p-2 rounded-xl text-secondary hover:text-primary hover:bg-muted transition-colors cursor-pointer"
                title={link.name}
              >
                {iconMap[link.icon]}
              </button>
            ) : (
              <a
                href={link.url}
                target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="inline-flex items-center justify-center p-2 rounded-xl text-secondary hover:text-primary hover:bg-muted transition-colors cursor-pointer"
                title={link.username || link.name}
              >
                {iconMap[link.icon] || (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                )}
              </a>
            )}

            {/* 微信或 QQ 弹窗展示账号 */}
            {isPopupAction && ((isWechat && showWechat) || (isQQ && showQQ)) && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-surface border border-border rounded-xl shadow-elevated p-3 min-w-max animate-slide-up">
                <div className="text-sm font-sans text-foreground whitespace-nowrap text-center">
                  <span className="text-secondary text-xs block mb-1">{isWechat ? '微信号' : 'QQ号'}</span>
                  <span className="font-mono font-medium">{link.username}</span>
                </div>
                {/* 装饰性小箭头 */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-border" />
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-surface" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}