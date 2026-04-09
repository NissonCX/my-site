import { cn } from '@/lib/utils';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Tag({
  variant = 'default',
  size = 'sm',
  className,
  children
}: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-mono rounded-full',
        'transition-all duration-300',
        {
          'px-2.5 py-1 text-xs': size === 'sm',
          'px-3 py-1.5 text-sm': size === 'md',
        },
        {
          'bg-muted text-secondary hover:bg-border': variant === 'default',
          'bg-transparent border border-border text-hint hover:border-accent/50 hover:text-accent': variant === 'outline',
        },
        className
      )}
    >
      {children}
    </span>
  );
}