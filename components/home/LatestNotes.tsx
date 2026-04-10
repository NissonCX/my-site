import Link from 'next/link';
import { SectionTitle } from '@/components/layout';
import { NoteCard } from '@/components/cards';
import { getLatestNotes } from '@/lib/notes';

export function LatestNotes() {
  const latestNotes = getLatestNotes();

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="最新随笔"
          subtitle="技术思考与生活感悟"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNotes.map((note, index) => (
            <NoteCard key={note.id} note={note} index={index} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/notes"
            className="inline-flex items-center text-sm text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            查看全部文章
            <svg
              className="w-4 h-4 ml-1"
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
    </section>
  );
}
