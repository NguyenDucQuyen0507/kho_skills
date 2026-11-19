#!/usr/bin/env node
/**
 * Cập nhật số sao GitHub và ngày push gần nhất cho các repo trong src/data/skills.ts.
 * Chạy: npm run stars   (tùy chọn: GITHUB_TOKEN=... để tăng giới hạn gọi API)
 * Repo nào lỗi thì giữ giá trị cũ trong stars.json và in cảnh báo.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS_FILE = path.join(root, 'src/data/skills.ts');
const OUT_FILE = path.join(root, 'src/data/stars.json');

// Lấy mọi giá trị `repo: '...'` (kể cả trong helper official()), bỏ chuỗi rỗng, loại trùng.
const source = readFileSync(SKILLS_FILE, 'utf8');
const repos = [...new Set([...source.matchAll(/\brepo:\s*['"]([^'"]*)['"]/g)].map((m) => m[1].trim()))].filter(
  (r) => /^[\w.-]+\/[\w.-]+$/.test(r),
);

let previous = { fetchedAt: null, repos: {} };
if (existsSync(OUT_FILE)) {
  try {
    previous = JSON.parse(readFileSync(OUT_FILE, 'utf8'));
  } catch {
    console.warn(`⚠ Không đọc được ${path.relative(root, OUT_FILE)}, sẽ tạo mới.`);
  }
}

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'kho-skill-stars-script',
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const result = {};
let ok = 0;
let failed = 0;

for (const repo of repos) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) {
      const remaining = res.headers.get('x-ratelimit-remaining');
      const reason = res.status === 403 && remaining === '0' ? 'hết lượt gọi API (rate limit)' : `HTTP ${res.status}`;
      throw new Error(reason);
    }
    const data = await res.json();
    result[repo] = { stars: data.stargazers_count, pushedAt: data.pushed_at };
    ok++;
    console.log(`✓ ${repo}: ★ ${data.stargazers_count}`);
  } catch (err) {
    failed++;
    const old = previous.repos?.[repo];
    if (old) result[repo] = old;
    console.warn(`⚠ ${repo}: ${err.message}. ${old ? 'Giữ giá trị cũ.' : 'Chưa có dữ liệu cũ, bỏ qua.'}`);
  }
}

const out = {
  // Chỉ đổi ngày khi lấy được ít nhất một repo mới.
  fetchedAt: ok > 0 ? new Date().toISOString() : previous.fetchedAt,
  repos: result,
};
writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + '\n');
console.log(`\nXong: ${ok} thành công, ${failed} lỗi, ${repos.length} repo. Đã ghi ${path.relative(root, OUT_FILE)}.`);
