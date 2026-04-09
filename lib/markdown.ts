import { remark } from 'remark';
import html from 'remark-html';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

export async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(html, { sanitize: false })
    .use(rehypeHighlight as any)
    .process(markdown);
  return result.toString();
}
