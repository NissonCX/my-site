'use client';

import { GalleryImage } from '@/types';
import { cn } from '@/lib/utils';

interface GalleryCardProps {
  image: GalleryImage;
  onClick?: () => void;
  className?: string;
  index?: number;
}

export function GalleryCard({ image, onClick, className, index = 0 }: GalleryCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl cursor-pointer bg-muted',
        'hover:shadow-elevated transition-shadow duration-500',
        'animate-slide-up opacity-0',
        className
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={onClick}
    >
      {/* 图片 */}
      <img
        src={image.src}
        alt={image.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
      />
    </div>
  );
}