import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Note } from '@/types';

interface NoteFrontmatter {
  title?: string;
  slug?: string;
  summary?: string;
  date?: string;
  tags?: string[];
  coverImage?: string;
  draft?: boolean;
}

const NOTES_DIR = path.join(process.cwd(), 'content', 'notes');

function normalizeDate(value?: string): string {
  if (!value) return '1970-01-01';
  const maybeDate = value.trim();
  const timestamp = Date.parse(maybeDate);
  if (Number.isNaN(timestamp)) return '1970-01-01';
  return new Date(timestamp).toISOString().slice(0, 10);
}

function extractSummary(content: string): string {
  const text = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0 && !line.startsWith('|'));

  if (!text) return '暂无摘要';
  return text.length > 120 ? `${text.slice(0, 120)}...` : text;
}

function parseNoteFile(fileName: string): (Note & { draft?: boolean }) | null {
  const fullPath = path.join(NOTES_DIR, fileName);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data as NoteFrontmatter;
  const slug = data.slug ?? fileName.replace(/\.md$/i, '');

  if (!slug) return null;

  const note: Note & { draft?: boolean } = {
    id: slug,
    slug,
    title: data.title ?? slug,
    summary: data.summary ?? extractSummary(parsed.content),
    content: parsed.content.trim(),
    date: normalizeDate(data.date),
    tags: Array.isArray(data.tags) ? data.tags : [],
    coverImage: data.coverImage,
    draft: data.draft,
  };

  return note;
}

export function getAllNotes(options: { includeDraft?: boolean } = {}): Note[] {
  if (!fs.existsSync(NOTES_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(NOTES_DIR)
    .filter((name) => name.toLowerCase().endsWith('.md'));

  const notes = files
    .map(parseNoteFile)
    .filter((item): item is Note & { draft?: boolean } => Boolean(item))
    .filter((item) => options.includeDraft || !item.draft)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      content: item.content,
      date: item.date,
      tags: item.tags,
      coverImage: item.coverImage,
    }));

  return notes;
}

export function getLatestNotes(limit = 3): Note[] {
  return getAllNotes().slice(0, limit);
}

export function getNoteBySlug(slug: string): Note | undefined {
  return getAllNotes().find((note) => note.slug === slug);
}

export function getAllNoteSlugs(): string[] {
  return getAllNotes().map((note) => note.slug);
}
