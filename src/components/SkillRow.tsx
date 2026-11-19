'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { categoryOf, type Skill } from '@/data/skills';
import { formatDate, formatStars, isSharedRepo, starsOf } from '@/data/stars';
import { useSlugSet } from '@/lib/storage';
import { LicenseBadge, SourceBadge, StaleBadge } from './Badges';
import { SaveButton } from './SaveButton';

export function Avatar({ skill }: { skill: Skill }) {
  const owner = skill.repo.split('/')[0];
  if (skill.source === 'kho-skill' || !owner) {
    return (
      <span className="row-avatar logo-mark" role="img" aria-label="Logo Kho Skill">
        ⌘
      </span>
    );
  }
  return (
    // Ảnh tĩnh từ GitHub, trang xuất tĩnh nên không dùng next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="row-avatar"
      src={`https://github.com/${owner}.png?size=88`}
      alt={`Ảnh đại diện GitHub của ${owner}`}
      width={44}
      height={44}
      loading="lazy"
    />
  );
}

function CopyInstallButton({ skill }: { skill: Skill }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const first = skill.install[0];
  if (!first) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(first.commands.join('\n'));
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard bị chặn (http, iframe): người dùng vẫn chép tay được ở trang chi tiết.
    }
  };

  return (
    <button type="button" className="btn" onClick={copy} title={`${first.label}: ${first.commands.join(' ; ')}`}>
      {copied ? 'Đã chép ✓' : 'Sao chép lệnh cài'}
    </button>
  );
}

export function SkillRow({
  skill,
  index,
  saved,
  onToggleSave,
}: {
  skill: Skill;
  index: number;
  saved: boolean;
  onToggleSave: (slug: string) => void;
}) {
  const cat = categoryOf(skill.category);
  const stars = starsOf(skill);

  return (
    <article className="row">
      <div className="row-lead">
        <span className="row-num" aria-hidden="true">
          {index}
        </span>
        <Avatar skill={skill} />
      </div>

      <div className="row-main">
        <h3 className="row-title">
          <Link href={`/skills/${skill.slug}/`}>{skill.title}</Link>
        </h3>
        <span className="code-name row-name">{skill.name}</span>
        <p className="row-summary">{skill.summary}</p>
        <details className="row-when">
          <summary>Khi nào nên dùng</summary>
          <ul>
            {skill.useWhen.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </details>
        <div className="row-tags">
          <span className="badge cat">
            {cat.emoji} {cat.label}
          </span>
          <SourceBadge skill={skill} />
          <LicenseBadge skill={skill} />
          {stars && (
            <>
              <span
                className="badge cat"
                title={isSharedRepo(skill) ? 'Số sao của cả repo anthropics/skills' : `${stars.stars.toLocaleString('vi-VN')} sao trên GitHub`}
              >
                ★ {formatStars(stars.stars)}
              </span>
              <span className="badge cat">Cập nhật {formatDate(stars.pushedAt)}</span>
            </>
          )}
          <StaleBadge skill={skill} />
        </div>
      </div>

      <div className="row-actions">
        <CopyInstallButton skill={skill} />
        <SaveButton slug={skill.slug} saved={saved} onToggle={onToggleSave} />
      </div>
    </article>
  );
}

/** Danh sách skill có nút lưu; dùng ở trang bộ skill (trang chủ dùng Catalog). */
export default function SkillList({ skills }: { skills: Skill[] }) {
  const { slugs, toggle } = useSlugSet('saved');
  return (
    <div className="rows">
      {skills.map((s, i) => (
        <SkillRow key={s.slug} skill={s} index={i + 1} saved={slugs.has(s.slug)} onToggleSave={toggle} />
      ))}
    </div>
  );
}
