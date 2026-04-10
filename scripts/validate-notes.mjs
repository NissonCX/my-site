import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const NOTES_DIR = path.resolve(process.cwd(), 'content/notes');
const REQUIRED_FIELDS = ['title', 'slug', 'summary', 'date', 'tags'];

function isValidDate(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

async function main() {
  const dirStat = await fs.stat(NOTES_DIR).catch(() => null);
  if (!dirStat || !dirStat.isDirectory()) {
    throw new Error(`目录不存在: ${NOTES_DIR}`);
  }

  const files = (await fs.readdir(NOTES_DIR)).filter((name) => name.toLowerCase().endsWith('.md'));
  const errors = [];
  const slugToFile = new Map();

  for (const fileName of files) {
    const fullPath = path.join(NOTES_DIR, fileName);
    const raw = await fs.readFile(fullPath, 'utf8');
    const parsed = matter(raw);
    const data = parsed.data ?? {};

    for (const field of REQUIRED_FIELDS) {
      const value = data[field];
      if (value === undefined || value === null || value === '') {
        errors.push(`${fileName}: 缺少字段 ${field}`);
      }
    }

    if (data.date && !isValidDate(data.date)) {
      errors.push(`${fileName}: date 不是合法日期 (${data.date})`);
    }

    if (data.tags && !Array.isArray(data.tags)) {
      errors.push(`${fileName}: tags 必须是数组`);
    }

    if (typeof data.slug === 'string') {
      if (slugToFile.has(data.slug)) {
        errors.push(`${fileName}: slug 与 ${slugToFile.get(data.slug)} 冲突 (${data.slug})`);
      } else {
        slugToFile.set(data.slug, fileName);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`共 ${errors.length} 个问题:\n- ${errors.join('\n- ')}`);
  }

  console.log(`✅ 校验通过：${files.length} 篇文章，字段与 slug 均合法`);
}

main().catch((error) => {
  console.error(`❌ 校验失败: ${error.message}`);
  process.exitCode = 1;
});
