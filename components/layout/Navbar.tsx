'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { navigation } from '@/data';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-4 left-0 right-0 z-40 max-w-5xl mx-auto px-4 transition-all duration-500',
        scrolled ? 'top-2' : 'top-4'
      )}
    >
      <nav
        className={cn(
          'bg-surface/70 backdrop-blur-xl rounded-full border px-4 py-2.5 transition-all duration-500',
          scrolled
            ? 'border-border shadow-elevated'
            : 'border-border/50'
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo - Serif */}
          <Link
            href="/"
            className="font-serif text-lg tracking-tight text-foreground hover:text-accent transition-colors duration-500"
          >
            NissonCX
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    'relative px-4 py-2 text-sm font-sans transition-colors duration-500 cursor-pointer',
                    isActive
                      ? 'text-accent'
                      : 'text-secondary hover:text-foreground'
                  )}
                >
                  {item.label}
                  {/* 下划线动画 */}
                  <span
                    className={cn(
                      'absolute bottom-0.5 left-4 right-4 h-px bg-accent transition-all duration-500',
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    )}
                    style={{ transformOrigin: 'left' }}
                  />
                </Link>
              );
            })}
            {/* Theme Toggle */}
            <div className="ml-2 pl-2 border-l border-border">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-secondary hover:text-foreground hover:bg-muted transition-colors duration-500 cursor-pointer"
              aria-label="菜单"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 mt-2 border-t border-border/50 animate-slide-in">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'px-4 py-2.5 rounded-full text-sm font-sans transition-colors duration-500 cursor-pointer',
                      isActive
                        ? 'text-accent bg-accent/10'
                        : 'text-secondary hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}