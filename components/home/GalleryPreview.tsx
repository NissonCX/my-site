'use client';

import Link from 'next/link';
import { featuredGalleryImages } from '@/data';
import { SectionTitle } from '@/components/layout';
import { GalleryCard } from '@/components/cards';
import { ImageModal, useImageModal } from '@/components/ui';

export function GalleryPreview() {
  const { isOpen, currentImage, open, close } = useImageModal();

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="生活记录"
          subtitle="记录日常生活中的美好瞬间"
        />

        {/* 瀑布流布局 */}
        <div className="mt-12 columns-2 md:columns-3 gap-4 space-y-4">
          {featuredGalleryImages.map((image, index) => (
            <div
              key={image.id}
              className="break-inside-avoid"
            >
              <GalleryCard
                image={image}
                index={index}
                onClick={() => open(image.src, image.title, image.description)}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-secondary hover:bg-border hover:text-foreground transition-colors text-sm font-medium cursor-pointer"
          >
            查看更多照片
            <svg
              className="w-4 h-4 ml-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* 图片大图弹窗 */}
      <ImageModal
        src={currentImage?.src || ''}
        title={currentImage?.title || ''}
        description={currentImage?.description}
        isOpen={isOpen}
        onClose={close}
      />
    </section>
  );
}