import { Metadata } from 'next';
import { notes } from '@/data';
import { NoteCard } from '@/components/cards';

export const metadata: Metadata = {
  title: '随笔文章',
  description: 'NissonCX 的技术思考与生活感悟，记录学习历程和技术探索',
  keywords: ['技术博客', 'Java 教程', '后端开发', '技术分享', 'NissonCX'],
};

export default function NotesPage() {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16">
          <p className="font-mono text-xs text-hint tracking-widest uppercase mb-2">Notes</p>
          <h1 className="text-title">随笔文章</h1>
          <div className="divider-subtle mt-6" />
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, index) => (
            <NoteCard key={note.id} note={note} index={index} />
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 text-center">
          <p className="font-mono text-xs text-hint">
            更多文章持续更新中
          </p>
        </div>
      </div>
    </section>
  );
}