import Link from 'next/link';
import { Note } from '@/types';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  className?: string;
  index?: number;
}

export function NoteCard({ note, className, index = 0 }: NoteCardProps) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      className={cn(
        'group block bg-surface/60 rounded-xl p-6 border border-border/30',
        'hover:border-accent/30 hover:bg-surface/80',
        'transition-all duration-500 animate-slide-up opacity-0',
        className
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 日期 - Mono */}
      <time className="font-mono text-xs text-hint tracking-wide">
        {note.date}
      </time>

      {/* 标题 - Serif */}
      <h3 className="font-serif text-lg text-foreground mt-2 group-hover:text-accent transition-colors duration-500">
        {note.title}
      </h3>

      {/* 摘要 - Sans */}
      <p className="text-body-sm text-secondary mt-3 leading-relaxed line-clamp-2">
        {note.summary}
      </p>

      {/* 标签 - Mono */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/30">
        {note.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="font-mono text-xs text-accent/70">
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}