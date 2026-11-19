#!/usr/bin/env node
/**
 * Tìm repo skill mới trên GitHub để duyệt tay. KHÔNG sửa src/data/skills.ts.
 *
 * Chạy:  npm run discover
 *        GITHUB_TOKEN=... npm run discover   (không token: 60 lượt gọi API/giờ; có token: 5000)
 *
 * Kết quả:
 *   data/candidates.json  dữ liệu đầy đủ
 *   data/candidates.md    bảng để duyệt: đổi [ ] thành [x] ở repo muốn thêm
 *   data/discover-cache.json  cache cây file theo repo + pushed_at, để lần chạy sau
 *                             không gọi lại API cho repo không đổi (và chạy tiếp khi hết lượt)
 *
 * Dấu [x] đã đánh trong candidates.md được giữ lại khi chạy lại.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS_FILE = path.join(ROOT, 'src/data/skills.ts');
const OUT_DIR = path.join(ROOT, 'data');
const OUT_JSON = path.join(OUT_DIR, 'candidates.json');
const OUT_MD = path.join(OUT_DIR, 'candidates.md');
const CACHE_FILE = path.join(OUT_DIR, 'discover-cache.json');

const MIN_STARS = 100;
// Mỗi truy vấn lấy PER_QUERY repo nhiều sao nhất (đã kèm điều kiện ≥ MIN_STARS sao).
// Nhóm sau nhắm vào các chủ đề còn ít skill trong Kho Skill; repo không có SKILL.md vẫn bị loại ở bước 3.
const QUERIES = [
  // Chung
  'topic:claude-skills',
  'topic:agent-skills',
  'topic:claude-code-skills',
  'topic:claude-skill',
  'topic:skill-md',
  'topic:anthropic-skills',
  'SKILL.md in:readme',
  // Văn phòng
  'claude skill pdf',
  'claude skills docx',
  'claude skill excel',
  'claude skill powerpoint',
  // Dữ liệu
  'agent skills data analysis',
  // Bảo mật
  'claude skill security',
  'claude skill pentest',
  // Trí nhớ
  'claude skill memory',
];
const PER_QUERY = 50;
const MAX_AGE_DAYS = 365;
const MAX_SKILL_FILES = 10; // số SKILL.md tối đa tải nội dung mỗi repo
const DELAY_MS = 300;

const API = 'https://api.github.com';
const HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'kho-skill-discover-script',
};
if (process.env.GITHUB_TOKEN) HEADERS.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class RateLimitError extends Error {
  constructor(message, resetAt = 0) {
    super(message);
    this.resetAt = resetAt; // mốc ms khi GitHub cấp lại lượt
  }
}

let lastCall = 0;
async function throttle() {
  const wait = lastCall + DELAY_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastCall = Date.now();
}

/** Gọi GitHub API. Hết lượt thì ném RateLimitError để dừng và ghi phần đã có. */
async function api(url) {
  await throttle();
  const res = await fetch(url.startsWith('http') ? url : API + url, { headers: HEADERS });
  const remaining = res.headers.get('x-ratelimit-remaining');
  const reset = res.headers.get('x-ratelimit-reset');
  const resetAt = reset ? new Date(+reset * 1000).toLocaleTimeString('vi-VN') : '?';

  if ((res.status === 403 || res.status === 429) && remaining === '0') {
    throw new RateLimitError(`Hết lượt gọi API (đặt lại lúc ${resetAt}).`, reset ? +reset * 1000 : 0);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${url}: ${body.slice(0, 160)}`);
  }
  const data = await res.json();
  // Còn 0 lượt sau lần gọi này: dùng nốt kết quả rồi dừng ở lần gọi kế tiếp.
  if (remaining === '0') api.exhausted = `Hết lượt gọi API (đặt lại lúc ${resetAt}).`;
  return data;
}
api.exhausted = null;

/**
 * Tìm kiếm có giới hạn riêng, đặt lại mỗi phút (10 lượt/phút khi không có token).
 * Bị chặn mà sắp được cấp lại thì chờ rồi thử lại, thay vì bỏ cuộc.
 */
async function searchApi(url, tries = 3) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await api(url);
    } catch (e) {
      const wait = e instanceof RateLimitError ? e.resetAt - Date.now() + 1500 : -1;
      if (attempt >= tries || wait < 0 || wait > 90_000) throw e;
      console.log(`… Giới hạn tìm kiếm, chờ ${Math.ceil(wait / 1000)} giây rồi thử lại (lần ${attempt + 1}/${tries}).`);
      await sleep(wait);
    }
  }
}

function guardExhausted() {
  if (api.exhausted) throw new RateLimitError(api.exhausted);
}

/** Tải file thô (raw.githubusercontent.com không tính vào giới hạn API). */
async function raw(repo, branch, filePath) {
  await throttle();
  const url = `https://raw.githubusercontent.com/${repo}/${encodeURIComponent(branch)}/${filePath
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;
  const res = await fetch(url, { headers: { 'User-Agent': HEADERS['User-Agent'] } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

/** Đọc name và description trong frontmatter YAML (đủ cho dạng key: value, chuỗi có nháy, khối | và >). */
export function parseFrontmatter(text) {
  const m = text.replace(/^﻿/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const lines = m[1].split(/\r?\n/);
  const out = {};
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rest] = kv;
    if (key !== 'name' && key !== 'description') continue;
    let value = rest.trim();
    if (/^[|>][+-]?$/.test(value)) {
      // Khối nhiều dòng: lấy các dòng thụt lề phía sau.
      const block = [];
      while (i + 1 < lines.length && (/^\s+\S/.test(lines[i + 1]) || lines[i + 1].trim() === '')) {
        block.push(lines[++i].trim());
      }
      value = value.startsWith('|') ? block.join('\n').trim() : block.join(' ').replace(/\s+/g, ' ').trim();
    } else if (/^["']/.test(value)) {
      const q = value[0];
      // Chuỗi có nháy có thể kéo sang dòng sau.
      while (!value.slice(1).includes(q) && i + 1 < lines.length) value += ' ' + lines[++i].trim();
      const end = value.lastIndexOf(q);
      value = value.slice(1, end > 0 ? end : undefined);
      if (q === '"') value = value.replace(/\\"/g, '"').replace(/\\n/g, ' ');
      else value = value.replace(/''/g, "'");
    } else {
      // Chuỗi trơn có thể nối sang các dòng thụt lề.
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1]) && !/^\s*[\w-]+:\s/.test(lines[i + 1])) {
        value += ' ' + lines[++i].trim();
      }
    }
    out[key] = value.trim();
  }
  return out;
}

function readJson(file, fallback) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

/** Repo đã đánh [x] trong candidates.md lần trước, để giữ lại khi ghi file mới. */
function readChecked() {
  if (!existsSync(OUT_MD)) return new Set();
  const checked = new Set();
  for (const line of readFileSync(OUT_MD, 'utf8').split('\n')) {
    const m = line.match(/^\|\s*\[[xX]\]\s*\|\s*\[([^\]]+)\]/);
    if (m) checked.add(m[1].toLowerCase());
  }
  return checked;
}

/**
 * Gợi ý loại repo để duyệt nhanh (không dùng để lọc):
 * "bộ skill" nếu topic/tên/mô tả nói về skill, ngược lại là phần mềm có kèm SKILL.md.
 */
function kindOf(r) {
  const topics = (r.topics ?? []).join(' ');
  const text = `${r.name} ${r.description ?? ''} ${topics}`.toLowerCase();
  return /\bskills?\b|skill\.md|agent-skills|claude-skills/.test(text) ? 'skill' : 'app';
}
const KIND_LABEL = { skill: 'Bộ skill', app: 'Phần mềm kèm skill' };

const fmtDate = (iso) => iso.slice(0, 10).split('-').reverse().join('/');
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();

function writeOutputs(candidates, meta) {
  mkdirSync(OUT_DIR, { recursive: true });
  candidates.sort((a, b) => b.stars - a.stars);
  writeFileSync(OUT_JSON, JSON.stringify(candidates, null, 2) + '\n');

  const checked = readChecked();
  const L = [];
  L.push('# Ứng viên skill mới');
  L.push('');
  L.push(`Tạo lúc ${new Date().toLocaleString('vi-VN')} bằng \`npm run discover\`. Đổi \`[ ]\` thành \`[x]\` ở repo muốn thêm, rồi nhờ Claude Code:`);
  L.push('');
  L.push('> Thêm các skill được đánh dấu [x] trong data/candidates.md vào src/data/skills.ts');
  L.push('');
  L.push(
    `Điều kiện lọc: ≥ ${MIN_STARS} sao, có license, cập nhật trong ${MAX_AGE_DAYS / 30 | 0} tháng, có ít nhất một file SKILL.md, chưa có trong Kho Skill.`,
  );
  if (meta.incomplete) {
    L.push('');
    L.push(`> ⚠ **Chưa quét hết:** ${meta.incomplete} Còn ${meta.pending.length} repo chưa kiểm tra SKILL.md; chạy lại \`npm run discover\` sau để quét tiếp (kết quả cũ được giữ trong cache).`);
  }
  L.push('');
  L.push('Cột **Loại** chỉ là gợi ý tự động: "Phần mềm kèm skill" là repo sản phẩm có SKILL.md đi kèm (không phải bộ skill dùng chung), nên xem kỹ trước khi chọn.');
  L.push('');
  L.push('| Chọn | Repo | Sao | License | Cập nhật | Loại | Số skill | Tên skill |');
  L.push('|:---:|---|---:|---|---|---|---:|---|');
  for (const c of candidates) {
    const mark = checked.has(c.repo.toLowerCase()) ? '[x]' : '[ ]';
    // Cùng một skill có thể được chép ở nhiều thư mục: chỉ hiện mỗi tên một lần.
    const names = [
      ...new Set(c.skills.map((s) => s.name || path.posix.basename(path.posix.dirname(s.path)) || s.path)),
    ];
    const more = c.skillCount > c.skills.length ? ` +${c.skillCount - c.skills.length}` : '';
    L.push(
      `| ${mark} | [${c.repo}](https://github.com/${c.repo}) | ${c.stars.toLocaleString('en-US')} | ${cell(c.license)} | ${fmtDate(c.pushedAt)} | ${KIND_LABEL[c.kind]} | ${c.skillCount} | ${cell(names.map((n) => '`' + n + '`').join(', ') + more)} |`,
    );
  }
  L.push('');
  L.push('## Chi tiết');
  for (const c of candidates) {
    L.push('');
    L.push(`### [${c.repo}](https://github.com/${c.repo})`);
    L.push('');
    L.push(`★ ${c.stars.toLocaleString('en-US')} · ${c.license} · cập nhật ${fmtDate(c.pushedAt)}${c.description ? ` · ${cell(c.description)}` : ''}`);
    L.push('');
    for (const s of c.skills) {
      L.push(`- \`${s.path}\`: **${cell(s.name) || '(không có name)'}**: ${cell(s.description) || '(không có description)'}`);
    }
    if (c.skillCount > c.skills.length) L.push(`- … và ${c.skillCount - c.skills.length} SKILL.md khác`);
    if (c.treeTruncated) L.push('- ⚠ Repo quá lớn, GitHub trả cây file không đầy đủ: có thể còn SKILL.md chưa thấy.');
  }
  L.push('');
  writeFileSync(OUT_MD, L.join('\n'));
}

/** SKILL.md nằm trong thư mục test/mẫu: thường là dữ liệu kiểm thử, không phải skill thật. */
const isFixture = (p) => /(^|\/)(tests?|__tests__|fixtures?|examples?|testdata|spec)(\/|$)/i.test(p);

/** Tìm mọi SKILL.md trong repo và đọc frontmatter của tối đa MAX_SKILL_FILES file. */
async function scanRepo(r) {
  guardExhausted();
  const tree = await api(`/repos/${r.full_name}/git/trees/${encodeURIComponent(r.default_branch)}?recursive=1`);
  const paths = tree.tree
    .filter((t) => t.type === 'blob' && /(^|\/)SKILL\.md$/.test(t.path))
    .map((t) => t.path)
    // Đưa file test/mẫu xuống cuối, rồi ưu tiên file nông (gần gốc repo), rồi theo tên.
    .sort(
      (a, b) =>
        isFixture(a) - isFixture(b) || a.split('/').length - b.split('/').length || a.localeCompare(b),
    );
  const skills = [];
  for (const p of paths.slice(0, MAX_SKILL_FILES)) {
    try {
      const fm = parseFrontmatter(await raw(r.full_name, r.default_branch, p));
      skills.push({ path: p, name: fm.name ?? null, description: fm.description ?? null });
    } catch (e) {
      skills.push({ path: p, name: null, description: null, error: e.message });
    }
  }
  return { pushedAt: r.pushed_at, skillCount: paths.length, treeTruncated: !!tree.truncated, skills };
}

async function main() {
  // Repo đã có trong Kho Skill (so không phân biệt hoa thường).
  const known = new Set(
    [...readFileSync(SKILLS_FILE, 'utf8').matchAll(/\brepo:\s*['"]([^'"]+)['"]/g)].map((m) => m[1].trim().toLowerCase()),
  );
  const cache = readJson(CACHE_FILE, {});
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  console.log(`Kho Skill đang có ${known.size} repo. ${process.env.GITHUB_TOKEN ? 'Dùng GITHUB_TOKEN.' : 'Không có GITHUB_TOKEN (60 lượt/giờ).'}`);

  let incomplete = null;
  const found = new Map();

  // 1. Tìm repo
  for (const q of QUERIES) {
    try {
      const data = await searchApi(`/search/repositories?q=${encodeURIComponent(`${q} stars:>=${MIN_STARS}`)}&sort=stars&order=desc&per_page=${PER_QUERY}`);
      console.log(`🔎 "${q}": ${data.items.length} repo (tổng ${data.total_count})`);
      for (const r of data.items) found.set(r.full_name.toLowerCase(), r);
    } catch (e) {
      if (!(e instanceof RateLimitError)) throw e;
      // Kết quả tìm kiếm thiếu thì danh sách sẽ sai lệch: giữ nguyên file cũ, không ghi đè.
      console.error(`✗ ${e.message} Không tìm được "${q}".`);
      console.error(
        `  Giữ nguyên ${path.relative(ROOT, OUT_MD)} cũ. Thử lại sau ít phút, hoặc chạy với GITHUB_TOKEN để có giới hạn cao hơn.`,
      );
      process.exit(2);
    }
  }

  // 2. Lọc bằng dữ liệu đã có trong kết quả tìm kiếm (không tốn thêm lượt gọi)
  const reasons = { known: 0, stars: 0, license: 0, stale: 0, archived: 0 };
  const eligible = [];
  for (const r of found.values()) {
    const spdx = r.license?.spdx_id;
    if (known.has(r.full_name.toLowerCase())) reasons.known++;
    else if (r.archived || r.disabled) reasons.archived++;
    else if (r.stargazers_count < MIN_STARS) reasons.stars++;
    else if (!spdx || spdx === 'NOASSERTION') reasons.license++;
    else if (new Date(r.pushed_at).getTime() < cutoff) reasons.stale++;
    else eligible.push(r);
  }
  eligible.sort((a, b) => b.stargazers_count - a.stargazers_count);
  console.log(
    `\nGộp được ${found.size} repo. Loại: ${reasons.known} đã có, ${reasons.stars} dưới ${MIN_STARS} sao, ${reasons.license} không có license, ${reasons.stale} lâu không cập nhật, ${reasons.archived} đã lưu trữ. Còn ${eligible.length} repo cần kiểm tra SKILL.md.\n`,
  );

  // 3. Với từng repo: tìm SKILL.md và đọc frontmatter
  const candidates = [];
  const pending = [];
  let noSkill = 0;
  for (const r of eligible) {
    const repo = r.full_name;
    let entry = cache[repo];
    const fresh = entry && entry.pushedAt === r.pushed_at;

    if (!fresh && !incomplete) {
      try {
        entry = await scanRepo(r);
        cache[repo] = entry;
      } catch (e) {
        if (!(e instanceof RateLimitError)) {
          console.warn(`⚠ ${repo}: ${e.message}. Bỏ qua.`);
          continue;
        }
        incomplete = e.message;
        console.warn(`⚠ ${incomplete} Dừng, ghi những gì đã có.`);
      }
    }
    // Hết lượt: repo từng quét (dù đã có commit mới) thì dùng tạm kết quả cũ; chưa quét bao giờ thì để lần sau.
    if (!entry) {
      pending.push(repo);
      continue;
    }

    if (entry.skillCount === 0) {
      noSkill++;
      console.log(`·  ${repo}: không có SKILL.md, bỏ qua`);
      continue;
    }
    console.log(`✓ ${repo}: ★ ${r.stargazers_count}, ${entry.skillCount} SKILL.md`);
    candidates.push({
      repo,
      stars: r.stargazers_count,
      pushedAt: r.pushed_at,
      license: r.license.spdx_id,
      kind: kindOf(r),
      description: r.description ?? null,
      skillCount: entry.skillCount,
      treeTruncated: entry.treeTruncated || undefined,
      skills: entry.skills.map(({ path: p, name, description }) => ({ path: p, name, description })),
    });
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2) + '\n');
  writeOutputs(candidates, { incomplete, pending });

  console.log(
    `\nXong: ${candidates.length} ứng viên, ${noSkill} repo không có SKILL.md${pending.length ? `, ${pending.length} repo chưa quét (chạy lại sau)` : ''}.`,
  );
  console.log(`Đã ghi ${path.relative(ROOT, OUT_MD)} và ${path.relative(ROOT, OUT_JSON)}.`);
}

// Chỉ chạy khi gọi trực tiếp (cho phép import parseFrontmatter để kiểm thử).
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error('✗ ' + e.message);
    process.exit(1);
  });
}
