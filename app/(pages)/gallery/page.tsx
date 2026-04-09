'use client';

import { useState } from 'react';
import { galleryImages, galleryCategories } from '@/data';
import { GalleryImage } from '@/types';
import { cn } from '@/lib/utils';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12">
          <p className="font-mono text-xs text-hint tracking-widest uppercase mb-2">Gallery</p>
          <h1 className="text-title">生活记录</h1>
          <div className="divider-subtle mt-6" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {galleryCategories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={cn(
                'px-4 py-2 rounded-full font-sans text-sm transition-all duration-500 cursor-pointer',
                selectedCategory === category.key
                  ? 'bg-accent text-white'
                  : 'bg-muted text-secondary hover:bg-border'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="break-inside-avoid group cursor-pointer animate-slide-up opacity-0"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative overflow-hidden rounded-xl bg-muted">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />

              </div>
            </div>
          ))}
        </div>

        {/* Count */}
        <div className="mt-12 text-center">
          <p className="font-mono text-xs text-hint">
            共 {filteredImages.length} 张照片
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors duration-500 cursor-pointer"
            >
              <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="relative rounded-xl overflow-hidden bg-muted">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>

            {/* Info */}
            <div className="mt-6 text-center">
              <p className="font-serif text-xl text-foreground">{selectedImage.title}</p>
              <p className="text-body-sm text-secondary mt-2">{selectedImage.description}</p>
              <div className="flex items-center justify-center gap-4 mt-3 font-mono text-xs text-hint">
                {selectedImage.date && (
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {selectedImage.date}
                  </span>
                )}
                {selectedImage.location && (
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {selectedImage.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}