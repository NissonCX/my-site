import Link from 'next/link';
import { SocialLinks } from "@/components/home/SocialLinks";
import { personal, socialLinks } from '@/data';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="max-w-5xl mx-auto px-6 py-12 text-center">
        {/* Logo - Serif */}
        <p className="font-serif text-lg text-foreground mb-3">
          {personal.name}
        </p>

        {/* Social Links */}
          <div className="flex justify-center mb-6">
            <SocialLinks links={socialLinks} />
          </div>

        {/* Copyright - Mono */}
        <p className="font-mono text-xs text-hint">
          © {new Date().getFullYear()} · Built with{' '}
          <Link
            href="https://nextjs.org"
            target="_blank"
            className="hover:text-accent transition-colors duration-500"
          >
            Next.js
          </Link>
          {' '}&{' '}
          <Link
            href="https://tailwindcss.com"
            target="_blank"
            className="hover:text-accent transition-colors duration-500"
          >
            Tailwind
          </Link>
        </p>
      </div>
    </footer>
  );
}

// 社交图标组件
