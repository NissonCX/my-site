'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageModalProps {
  src: string;
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ src, title, description, isOpen, onClose }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-black/80 backdrop-blur-sm'
      )}
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 图片 */}
        <img
          src={src}
          alt={title}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />

        {/* 信息 */}
        {(title || description) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-white font-medium text-lg">{title}</h3>
            {description && (
              <p className="text-white/80 text-sm mt-1">{description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 使用 hook
export function useImageModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<{
    src: string;
    title: string;
    description?: string;
  } | null>(null);

  const open = (src: string, title: string, description?: string) => {
    setCurrentImage({ src, title, description });
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setCurrentImage(null);
  };

  return {
    isOpen,
    currentImage,
    open,
    close,
  };
}