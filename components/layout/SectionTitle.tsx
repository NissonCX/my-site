import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionTitle({
  title,
  subtitle,
  className,
  align = 'left',
}: SectionTitleProps) {
  return (
    <div className={cn('mb-10', { 'text-center': align === 'center' }, className)}>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight font-heading">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-secondary text-base md:text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}