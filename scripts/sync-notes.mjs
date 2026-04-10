import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_SOURCE_DIR = '/Users/nissoncx/workplace/docx/hyperchainIntern/实习经历/技术笔记';
const TARGET_DIR = path.resolve(process.cwd(), 'content/notes');

const CATEGORY_TAG_MAP = {
  '01-认证登录': '认证登录',
  '02-数据库': '数据库',
  '03-功能模块': '功能模块',
  '04-安全加密': '安全加密',
  '05-设计模式': '设计模式',
};

function parseArgs(argv) {
  const args = { source: DEFAULT_SOURCE_DIR, clean: true };

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === '--source' && argv[i + 1]) {
      args.source = path.resolve(argv[i + 1]);
      i += 1;
    } else if (current === '--no-clean') {
      args.clean = false;
    }
  }

  return args;
}

async function collectMarkdownFiles(dir, root = dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(fullPath, root)));
      continue;
    }

    if (!entry.name.toLowerCase().endsWith('.md')) continue;
    if (entry.name.toLowerCase() === 'readme.md') continue;

    files.push({
      fullPath,
      relativePath: path.relative(root, fullPath),
    });
  }

  return files;
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildUniqueSlug(base, used) {
  let slug = base || 'note';
  let index = 2;
  while (used.has(slug)) {
    slug = `${base}-${index}`;
    index += 1;
  }
  used.add(slug);
  return slug;
}

function stripMarkdown(value) {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/^[-*•]\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function readTitle(raw, fallbackTitle) {
  const match = raw.match(/^#\s+(.+)$/m);
  if (match?.[1]) return match[1].trim();
  return fallbackTitle;
}

function readDate(raw, fallbackDate) {
  const learnedDate = raw.match(/\*\*学习时间\*\*:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/);
  if (learnedDate?.[1]) return learnedDate[1];
  return fallbackDate;
}

function readSummary(raw) {
  const coreIssue = raw.match(/\*\*核心问题\*\*:\s*(.+)/);
  if (coreIssue?.[1]) {
    return stripMarkdown(coreIssue[1].trim());
  }

  const withoutCodeBlocks = raw
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '');

  const candidate = withoutCodeBlocks
    .replace(/^#\s+.+$/m, '')
    .split('\n')
    .map((line) => line.trim().replace(/^#+\s*/, ''))
    .find((line) => {
      if (line.length === 0 || line === '---' || line.startsWith('**')) return false;
      if (line.startsWith('|')) return false;
      if (/^[一二三四五六七八九十]+、/.test(line)) return false;
      if (/^\d+(\.\d+)+/.test(line)) return false;
      return true;
    });

  if (!candidate) return '实习技术笔记';
  const plain = stripMarkdown(candidate);
  return plain.length > 120 ? `${plain.slice(0, 120)}...` : plain;
}

function escapeYamlText(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function normalizeBody(raw) {
  const withoutTopHeading = raw.replace(/^#\s+.+\n*/m, '').trim();
  return `${withoutTopHeading}\n`;
}

function buildTags(relativePath) {
  const [folder] = relativePath.split(path.sep);
  const categoryTag = CATEGORY_TAG_MAP[folder] ?? '技术笔记';
  return ['实习经历', categoryTag];
}

function formatFrontmatter({ title, slug, summary, date, tags, source }) {
  const tagsYaml = tags.map((tag) => `  - "${escapeYamlText(tag)}"`).join('\n');
  return [
    '---',
    `title: "${escapeYamlText(title)}"`,
    `slug: "${escapeYamlText(slug)}"`,
    `summary: "${escapeYamlText(summary)}"`,
    `date: "${escapeYamlText(date)}"`,
    'tags:',
    tagsYaml,
    `source: "${escapeYamlText(source)}"`,
    '---',
    '',
  ].join('\n');
}

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function clearMarkdownFiles(dirPath) {
  await ensureDir(dirPath);
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
      .map((entry) => fs.unlink(path.join(dirPath, entry.name)))
  );
}

async function main() {
  const { source, clean } = parseArgs(process.argv.slice(2));

  const sourceStat = await fs.stat(source).catch(() => null);
  if (!sourceStat || !sourceStat.isDirectory()) {
    throw new Error(`源目录不存在: ${source}`);
  }

  const markdownFiles = await collectMarkdownFiles(source);
  if (markdownFiles.length === 0) {
    throw new Error(`源目录中没有可导入的 Markdown 文件: ${source}`);
  }

  if (clean) {
    await clearMarkdownFiles(TARGET_DIR);
  } else {
    await ensureDir(TARGET_DIR);
  }

  const usedSlugs = new Set();

  for (const file of markdownFiles) {
    const raw = await fs.readFile(file.fullPath, 'utf8');
    const fileStat = await fs.stat(file.fullPath);
    const fallbackTitle = path.basename(file.fullPath, '.md');
    const title = readTitle(raw, fallbackTitle);
    const fallbackDate = new Date(fileStat.mtimeMs).toISOString().slice(0, 10);
    const date = readDate(raw, fallbackDate);
    const summary = readSummary(raw);
    const tags = buildTags(file.relativePath);
    const folder = file.relativePath.split(path.sep)[0] ?? 'note';
    const baseSlug = slugify(`${folder}-${fallbackTitle}`);
    const slug = buildUniqueSlug(baseSlug, usedSlugs);
    const frontmatter = formatFrontmatter({
      title,
      slug,
      summary,
      date,
      tags,
      source: toPosixPath(file.relativePath),
    });

    const outputPath = path.join(TARGET_DIR, `${slug}.md`);
    const body = normalizeBody(raw);
    await fs.writeFile(outputPath, `${frontmatter}${body}`, 'utf8');
  }

  console.log(
    `✅ 同步完成：${markdownFiles.length} 篇\n源目录: ${source}\n目标目录: ${TARGET_DIR}\n模式: ${clean ? 'clean sync' : 'incremental sync'}`
  );
}

main().catch((error) => {
  console.error(`❌ 同步失败: ${error.message}`);
  process.exitCode = 1;
});
