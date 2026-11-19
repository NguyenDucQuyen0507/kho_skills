import { LICENSE_INFO, type Skill } from '@/data/skills';
import { isStale, starsOf } from '@/data/stars';

export function SourceBadge({ skill }: { skill: Skill }) {
  if (skill.source === 'official') return <span className="badge official">Chính thức · Anthropic</span>;
  if (skill.source === 'kho-skill') return <span className="badge own">★ Kho Skill tự viết</span>;
  return <span className="badge community">Cộng đồng</span>;
}

export function LicenseBadge({ skill }: { skill: Skill }) {
  const info = LICENSE_INFO[skill.license];
  return <span className={`badge ${info.ok ? 'ok' : 'warn'}`}>{info.ok ? info.label : `⚠ ${info.label}`}</span>;
}

export function StaleBadge({ skill }: { skill: Skill }) {
  const info = starsOf(skill);
  if (!info || !isStale(info.pushedAt)) return null;
  return <span className="badge warn">Lâu chưa cập nhật</span>;
}
