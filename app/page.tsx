'use client';

import { personal, socialLinks, latestNotes, projects, galleryImages } from '@/data';
import { SocialLinks } from '@/components/home/SocialLinks';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { LatestNotes } from '@/components/home/LatestNotes';
import { GalleryPreview } from '@/components/home/GalleryPreview';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      
      {/* 分割线 */}
      <div className="divider max-w-6xl mx-auto opacity-30 my-10" />

      {/* 确保这些组件存在并完整引入了 */}
      <FeaturedProjects />
      
      <div className="divider max-w-6xl mx-auto opacity-30 my-10" />
      
      <LatestNotes />
      
      <div className="divider max-w-6xl mx-auto opacity-30 my-10" />
      
      <GalleryPreview />
    </main>
  );
}
