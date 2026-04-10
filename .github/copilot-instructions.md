# Copilot Instructions for `my-site`

## Build, lint, and run commands
- Install dependencies: `npm install`
- Local dev server: `npm run dev`
- Production build: `npm run build`
- Run built app: `npm run start`
- Lint: `npm run lint`
- Sync external technical notes into site notes: `npm run notes:sync`
- Incremental note sync without cleaning existing notes: `npm run notes:sync:incremental`
- Validate note frontmatter and slug uniqueness: `npm run notes:validate`
- Tests: no test script or test files are currently configured, so there is no single-test command yet.

## High-level architecture
- The app uses **Next.js 16 App Router** with a route group under `app/(pages)` for inner pages (`about`, `projects`, `gallery`, `notes`) and `app/page.tsx` for the homepage.
- `app/layout.tsx` is the global shell: it defines site-wide metadata, loads fonts, and wraps all content with `ThemeProvider`, `Navbar`, and `Footer`.
- Site profile/project/gallery content is **data-driven** from `data/*.ts`, strongly typed by `types/index.ts`, and re-exported through `data/index.ts`.
- UI composition follows reusable layers:
  - Page-level sections in `components/home/*`
  - Reusable content cards in `components/cards/*`
  - Shared primitives in `components/ui/*`
- Notes are markdown-file driven under `content/notes/*.md`; parsing/querying is centralized in `lib/notes.ts`, and article HTML rendering uses `lib/markdown.ts`.
- Styling is built on **Tailwind CSS v4** plus a custom token system in `app/globals.css` (`@theme inline`, CSS variables, custom classes like `.text-title`, `.tag`, `.divider`, `.article-content`).

## Key conventions in this repository
- **Read local Next.js docs before framework changes**: use `node_modules/next/dist/docs/` (project-specific rule from `CLAUDE.md`).
- For slow client-side navigation work, follow `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.mdx` and handle the `unstable_instant` route export requirement.
- Prefer updating content in `data/*` modules for profile/project/gallery/navigation/social info, and in `content/notes/*.md` for articles.
- Keep note metadata in frontmatter (`title`, `slug`, `summary`, `date`, `tags`); use `npm run notes:validate` after note edits.
- When importing external note sources, use `npm run notes:sync` instead of manual copy/paste.
- Use path alias imports (`@/...`) and barrel exports (`data/index.ts`, `components/*/index.ts`) as the default import style.
- Use `cn` from `lib/utils.ts` for class composition instead of manual string concatenation patterns.
- Keep `'use client'` only in interactive components/pages (theme toggle, navbar interactions, gallery modal/filtering, etc.); leave static content as server components.
- UI copy and metadata are primarily Chinese; keep new copy aligned with existing language and tone.
- This codebase intentionally uses raw `<img>` elements in many components; `@next/next/no-img-element` is disabled in `eslint.config.mjs`.
- In this Next.js version, dynamic route params are implemented as `params: Promise<...>` and awaited in the page (see `app/(pages)/notes/[slug]/page.tsx`).
- Markdown rendering in `lib/markdown.ts` uses `remark-html` with `sanitize: false`; only trusted markdown sources should be rendered.
