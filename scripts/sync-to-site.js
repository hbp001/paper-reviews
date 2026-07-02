// paper-reviews의 TEMPLATE.md 형식 리뷰를 ai-researchlab.github.io의
// content/surveys/ front matter 형식으로 변환한다.
// 사용법: node scripts/sync-to-site.js <출력디렉토리> <리뷰파일...>
const fs = require('fs');
const path = require('path');

function escapeYaml(value) {
  return String(value).replace(/"/g, '\\"');
}

function parseReview(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');

  const titleMatch = raw.match(/^#\s+(.+)$/m);
  if (!titleMatch) throw new Error(`${filePath}: H1 제목을 찾을 수 없습니다`);
  const title = titleMatch[1].trim();

  const arxivMatch = raw.match(/\*\*arXiv\*\*:\s*\[[^\]]*\]\((https?:\/\/arxiv\.org\/abs\/[^\s)]+)\)/);
  const authorsMatch = raw.match(/\*\*저자\*\*:\s*(.+?)\s*$/m);
  const venueMatch = raw.match(/\*\*발표\*\*:\s*(.+?)\s*$/m);
  const categoryLineMatch = raw.match(/\*\*카테고리\*\*:\s*(.+?)\s*$/m);
  const reviewerMatch = raw.match(/\*\*리뷰어\*\*:\s*@(\S+)/);
  const dateMatch = raw.match(/\*\*리뷰 날짜\*\*:\s*(\d{4}-\d{2}-\d{2})/);
  const codeMatch = raw.match(/\|\s*공식\s*코드\s*\|[^\n]*\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/);

  if (!authorsMatch) throw new Error(`${filePath}: **저자**: 항목을 찾을 수 없습니다`);
  if (!reviewerMatch) throw new Error(`${filePath}: **리뷰어**: @GitHub아이디 를 찾을 수 없습니다`);
  if (!dateMatch) throw new Error(`${filePath}: **리뷰 날짜**: YYYY-MM-DD 를 찾을 수 없습니다`);

  const tags = categoryLineMatch
    ? [...categoryLineMatch[1].matchAll(/#([\w-]+)/g)].map((m) => m[1])
    : [];
  const category = tags.length ? tags[0].charAt(0).toUpperCase() + tags[0].slice(1) : '기타';

  const yearSource = venueMatch ? venueMatch[1] : raw;
  const yearMatch = yearSource.match(/20\d{2}/);
  const year = yearMatch ? Number(yearMatch[0]) : new Date(dateMatch[1]).getFullYear();

  const summaryMatch = raw.match(/##\s*1️⃣\s*한\s*줄\s*요약\s*\n+>\s*(.+?)\s*\n/);
  const excerpt = summaryMatch ? summaryMatch[1].trim() : title;

  const bodyStart = raw.indexOf('## 1️⃣');
  if (bodyStart === -1) throw new Error(`${filePath}: "## 1️⃣ 한 줄 요약" 섹션을 찾을 수 없습니다`);
  const body = raw.slice(bodyStart).trim();

  const frontMatter = [
    '---',
    `title: "${escapeYaml(title)}"`,
    `date: ${dateMatch[1]}`,
    `category: "${escapeYaml(category)}"`,
    `year: ${year}`,
    `authors: "${escapeYaml(authorsMatch[1])}"`,
    `contribution: "${escapeYaml(excerpt)}"`,
    `reviewer: "${reviewerMatch[1]}"`,
    arxivMatch ? `paper_url: "${arxivMatch[1]}"` : null,
    codeMatch ? `code_url: "${codeMatch[1]}"` : null,
    `tags: [${tags.join(', ')}]`,
    `excerpt: "${escapeYaml(excerpt)}"`,
    '---',
    '',
    '',
  ]
    .filter((line) => line !== null)
    .join('\n');

  return `${frontMatter}${body}\n`;
}

function main() {
  const [outDir, ...files] = process.argv.slice(2);
  if (!outDir || files.length === 0) {
    console.log('동기화할 리뷰 파일이 없습니다.');
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });

  for (const file of files) {
    const base = path.basename(file);
    if (base === 'TEMPLATE.md' || base === 'README.md') continue;
    if (!fs.existsSync(file)) continue;

    const converted = parseReview(file);
    const outPath = path.join(outDir, base);
    fs.writeFileSync(outPath, converted, 'utf8');
    console.log(`변환 완료: ${file} -> ${outPath}`);
  }
}

main();
