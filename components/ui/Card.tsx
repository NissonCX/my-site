import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'glass';
  animate?: boolean;
}

export function Card({
  hover = false,
  variant = 'default',
  animate = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        {
          'bg-surface border border-border/50': variant === 'default',
          'bg-surface shadow-elevated': variant === 'elevated',
          'bg-surface/70 backdrop-blur-sm border border-border/30': variant === 'glass',
        },
        {
          'hover:translate-y-[-4px] hover:shadow-elevated transition-all duration-500': hover,
          'animate-slide-up opacity-0': animate,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}