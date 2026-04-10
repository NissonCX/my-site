import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const NOTES_DIR = path.resolve(process.cwd(), 'content/notes');
const REQUIRED_FIELDS = ['title', 'slug', 'summary', 'date', 'tags'];
const WECHAT_APP_ID_PATTERN = /\bwx[a-zA-Z0-9]{16}\b/g;
const CREDENTIAL_ASSIGNMENT_PATTERN =
  /\b(?:appId|appid|appKey|appSecret|appSecretKey|secretKey|secretId|clientSecret)\b\s*[:=]\s*["']?([A-Za-z0-9_!/+.-]{8,})["']?/gi;

function isValidDate(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isPlaceholderValue(value) {
  return /^<[^>]+>$/.test(value) || /^your[_-]/i.test(value);
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
    const content = parsed.content ?? '';

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

    const appIdMatches = content.match(WECHAT_APP_ID_PATTERN);
    if (appIdMatches?.length) {
      errors.push(`${fileName}: 检测到疑似微信 AppID，请先脱敏`);
    }

    let credentialMatch = CREDENTIAL_ASSIGNMENT_PATTERN.exec(content);
    while (credentialMatch) {
      const value = credentialMatch[1];
      if (!isPlaceholderValue(value)) {
        errors.push(`${fileName}: 检测到疑似敏感配置值未脱敏 (${credentialMatch[0].trim()})`);
      }
      credentialMatch = CREDENTIAL_ASSIGNMENT_PATTERN.exec(content);
    }
    CREDENTIAL_ASSIGNMENT_PATTERN.lastIndex = 0;
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
