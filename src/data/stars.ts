/**
 * Số sao GitHub và ngày push gần nhất, lấy bằng `npm run stars` (scripts/update-stars.mjs).
 */
import data from './stars.json';
import type { Skill } from './skills';

type RepoStars = { stars: number; pushedAt: string };

const REPOS = data.repos as Record<string, RepoStars>;

export const STARS_FETCHED_AT: string | null = data.fetchedAt;

/** Repo không push quá ngần này ngày thì coi là "lâu chưa cập nhật". */
const STALE_DAYS = 365;
const DAY = 24 * 60 * 60 * 1000;
/**
 * Mốc so sánh = lúc lấy số sao, không phải Date.now(): trang tĩnh render ở server và client
 * phải ra cùng kết quả (tránh lỗi hydration), và "3 ngày trước" khớp với dữ liệu đã lấy.
 */
const REF_NOW = data.fetchedAt ? new Date(data.fetchedAt).getTime() : Date.now();

export function starsOf(skill: Skill): RepoStars | null {
  return (skill.repo && REPOS[skill.repo]) || null;
}

/** Repo dùng chung cho nhiều skill (vd. anthropics/skills): số sao là của cả repo. */
export function isSharedRepo(skill: Skill): boolean {
  return skill.source === 'official';
}

/** 999 → "999", 12345 → "12.3k", 1200000 → "1.2M". */
export function formatStars(n: number): string {
  const short = (v: number) => (v >= 100 ? Math.round(v).toString() : v.toFixed(1).replace(/\.0$/, ''));
  if (n >= 999_950) return `${short(n / 1_000_000)}M`;
  if (n >= 1000) return `${short(n / 1000)}k`;
  return String(n);
}

/** "hôm nay", "3 ngày trước", "2 tháng trước", "1 năm trước". */
export function timeAgo(iso: string, now = REF_NOW): string {
  const days = Math.floor((now - new Date(iso).getTime()) / DAY);
  if (days < 1) return 'hôm nay';
  if (days < 30) return `${days} ngày trước`;
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}

export function isStale(iso: string, now = REF_NOW): boolean {
  return now - new Date(iso).getTime() > STALE_DAYS * DAY;
}

/** "2026-11-18T..." → "18/11/2026". */
export function formatDate(iso: string): string {
  return iso.slice(0, 10).split('-').reverse().join('/');
}
