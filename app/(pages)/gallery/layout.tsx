import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '生活记录',
  description: 'NissonCX 的生活记录相册，记录日常生活中的美好瞬间',
  keywords: ['生活记录', '摄影', '旅行', '校园生活', 'NissonCX'],
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}