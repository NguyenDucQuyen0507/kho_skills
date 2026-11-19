/**
 * Đọc/ghi danh sách ứng viên cho tab "Duyệt" (chỉ chạy khi `npm run dev`).
 * Nguồn dữ liệu: data/candidates.json (do `npm run discover` tạo) và dấu [x] trong data/candidates.md.
 * Chỉ import từ route handler (server); không dùng trong component phía trình duyệt.
 */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const JSON_FILE = path.join(ROOT, 'data/candidates.json');
const MD_FILE = path.join(ROOT, 'data/candidates.md');
const DISCOVER_SCRIPT = path.join(ROOT, 'scripts/discover-skills.mjs');

export interface CandidateSkill {
  path: string;
  name: string | null;
  description: string | null;
}
export interface Candidate {
  repo: string;
  stars: number;
  pushedAt: string;
  license: string;
  kind: 'skill' | 'app';
  description: string | null;
  skillCount: number;
  treeTruncated?: boolean;
  skills: CandidateSkill[];
}

export function hasCandidates() {
  return existsSync(JSON_FILE) && existsSync(MD_FILE);
}

export function readCandidates(): { generatedAt: string; candidates: Candidate[]; selected: string[] } {
  return {
    generatedAt: statSync(JSON_FILE).mtime.toISOString(),
    candidates: JSON.parse(readFileSync(JSON_FILE, 'utf8')),
    selected: readSelected(),
  };
}

/** Repo đang được đánh [x] trong candidates.md. */
export function readSelected(): string[] {
  const selected: string[] = [];
  for (const line of readFileSync(MD_FILE, 'utf8').split('\n')) {
    const m = line.match(/^\|\s*\[[xX]\]\s*\|\s*\[([^\]]+)\]/);
    if (m) selected.push(m[1]);
  }
  return selected;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Đổi dấu [ ] ↔ [x] của một repo trong candidates.md. Trả về false nếu không thấy repo. */
export function setSelected(repo: string, selected: boolean): boolean {
  const known = (JSON.parse(readFileSync(JSON_FILE, 'utf8')) as Candidate[]).some((c) => c.repo === repo);
  if (!known) return false;
  const md = readFileSync(MD_FILE, 'utf8');
  const re = new RegExp(`^(\\|\\s*)\\[[ xX]\\](\\s*\\|\\s*\\[${escapeRe(repo)}\\]\\()`, 'm');
  if (!re.test(md)) return false;
  writeFileSync(MD_FILE, md.replace(re, `$1[${selected ? 'x' : ' '}]$2`));
  return true;
}

// ── Chạy `discover` từ nút "Lấy skill mới" ──
// Lưu trạng thái trên globalThis để không mất khi Next nạp lại module trong lúc dev.
export interface DiscoverJob {
  running: boolean;
  startedAt: string | null;
  finishedAt: string | null;
  exitCode: number | null;
  log: string[];
}
const g = globalThis as typeof globalThis & { __khoSkillDiscover?: DiscoverJob };
const job = (g.__khoSkillDiscover ??= { running: false, startedAt: null, finishedAt: null, exitCode: null, log: [] });
const MAX_LOG = 400;

export function discoverStatus(): DiscoverJob {
  return { ...job, log: job.log.slice(-60) };
}

/** Bắt đầu quét. Đang quét thì không chạy thêm lần nữa. */
export function startDiscover(): DiscoverJob {
  if (job.running) return discoverStatus();
  Object.assign(job, { running: true, startedAt: new Date().toISOString(), finishedAt: null, exitCode: null, log: [] });

  // Chạy đúng như `npm run discover`: đọc token trong .env nếu có.
  const child = spawn(process.execPath, ['--env-file-if-exists=.env', DISCOVER_SCRIPT], { cwd: ROOT, env: process.env });
  const push = (chunk: Buffer) => {
    for (const line of chunk.toString().split('\n')) {
      if (line.trim() && !line.includes('.env not found')) job.log.push(line);
    }
    if (job.log.length > MAX_LOG) job.log.splice(0, job.log.length - MAX_LOG);
  };
  child.stdout.on('data', push);
  child.stderr.on('data', push);
  const finish = (code: number | null) => {
    if (!job.running) return;
    Object.assign(job, { running: false, finishedAt: new Date().toISOString(), exitCode: code ?? 1 });
  };
  child.on('close', finish);
  child.on('error', (e) => {
    job.log.push('✗ ' + e.message);
    finish(1);
  });
  return discoverStatus();
}
