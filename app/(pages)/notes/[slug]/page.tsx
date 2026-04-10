import { notFound } from 'next/navigation';
import Link from 'next/link';
import { markdownToHtml } from '@/lib/markdown';
import { getAllNoteSlugs, getNoteBySlug } from '@/lib/notes';

interface NoteDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getAllNoteSlugs().map((slug) => ({ slug }));
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const { slug } = await params;
  const decodedSlug = (() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  })();

  const note = getNoteBySlug(decodedSlug) ?? getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  // Content is from user's own markdown data, sanitized by markdown processor
  const contentHtml = await markdownToHtml(note.content);

  return (
    <article className="py-20 md:py-32">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        {/* Back Link */}
        <Link
          href="/notes"
          className="inline-flex items-center font-mono text-xs text-hint hover:text-accent transition-colors duration-500 mb-12"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          返回文章列表
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground tracking-tight">
            {note.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <time className="font-mono text-xs text-hint tracking-wide">{note.date}</time>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span key={tag} className="font-mono text-xs text-accent/70">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <div className="divider-subtle mt-8" />
        </header>

        {/* Article Content */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <Link
            href="/notes"
            className="font-mono text-xs text-hint hover:text-accent transition-colors duration-500"
          >
            查看更多文章
          </Link>
        </footer>
      </div>
    </article>
  );
}
