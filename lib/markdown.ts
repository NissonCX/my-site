import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import 'highlight.js/styles/github.css';

function stripScriptTags(htmlContent: string): string {
  return htmlContent
    .replace(/<script\b[^>]*\/>/gi, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '');
}

export async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return stripScriptTags(result.toString());
}
