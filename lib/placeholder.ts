// 生成渐变占位图 SVG
export function generatePlaceholder(width: number, height: number, seed: string): string {
  // 根据 seed 生成不同的渐变色
  const hues = [
    [210, 270], // 蓝紫
    [150, 200], // 青绿
    [0, 50],    // 红橙
    [30, 80],   // 橙黄
    [180, 240], // 蓝绿
  ];

  const index = seed.length % hues.length;
  const [hueStart, hueEnd] = hues[index];

  const gradient1 = `hsl(${hueStart}, 70%, 80%)`;
  const gradient2 = `hsl(${hueEnd}, 70%, 90%)`;

  // 生成 SVG 占位图
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${gradient1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${gradient2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad-${seed})" />
      <text x="50%" y="50%" font-family="system-ui" font-size="24" fill="rgba(0,0,0,0.2)" text-anchor="middle" dominant-baseline="middle">
        ${seed}
      </text>
    </svg>
  `)}`;
}

// 项目封面占位图
export function getProjectPlaceholder(projectName: string): string {
  return generatePlaceholder(800, 500, projectName.substring(0, 2).toUpperCase());
}

// 画廊图片占位图
export function getGalleryPlaceholder(title: string): string {
  return generatePlaceholder(600, 450, title.substring(0, 1));
}

// 头像占位图
export function getAvatarPlaceholder(name: string): string {
  return generatePlaceholder(200, 200, name.charAt(0).toUpperCase());
}

// 文章封面占位图
export function getNotePlaceholder(title: string): string {
  return generatePlaceholder(800, 450, title.substring(0, 2).toUpperCase());
}
