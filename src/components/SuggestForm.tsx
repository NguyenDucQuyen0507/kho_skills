'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SITE_REPO } from '@/data/site';
import { SKILLS } from '@/data/skills';

/** Nhận "owner/repo" hoặc link GitHub bất kỳ trong repo (…/tree/main/skills/x, .git). */
export function parseRepo(input: string): string | null {
  const s = input.trim();
  const m =
    s.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/?#].*)?$/i) ??
    s.match(/^([\w.-]+)\/([\w.-]+?)(?:\.git)?$/);
  return m ? `${m[1]}/${m[2]}` : null;
}

export default function SuggestForm() {
  const [repoInput, setRepoInput] = useState('');
  const [useFor, setUseFor] = useState('');
  const [touched, setTouched] = useState(false);

  const repo = parseRepo(repoInput);
  const existing = useMemo(
    () => (repo ? SKILLS.filter((s) => s.repo && s.repo.toLowerCase() === repo.toLowerCase()) : []),
    [repo],
  );

  const title = `Đề xuất skill: ${repo ?? ''}`;
  const body = [
    `**Repo:** https://github.com/${repo ?? ''}`,
    '',
    '**Skill này dùng để làm gì / dùng khi nào:**',
    useFor.trim() || '(chưa ghi)',
    '',
    '_Gửi từ trang Đề xuất skill của Kho Skill._',
  ].join('\n');
  const issueUrl = SITE_REPO
    ? `https://github.com/${SITE_REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    : null;

  const repoError = touched && !repo ? 'Nhập link GitHub của repo, ví dụ https://github.com/owner/ten-repo' : null;

  return (
    <form
      className="suggest-form"
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (!repo || existing.length > 0 || !issueUrl) return;
        window.open(issueUrl, '_blank', 'noopener,noreferrer');
      }}
      noValidate
    >
      <label className="field">
        <span className="field-label">Link repo GitHub</span>
        <input
          type="text"
          inputMode="url"
          value={repoInput}
          onChange={(e) => setRepoInput(e.target.value)}
          onBlur={() => repoInput && setTouched(true)}
          placeholder="https://github.com/owner/ten-repo"
          aria-invalid={!!repoError}
          aria-describedby="repo-msg"
          autoComplete="off"
          spellCheck={false}
          required
        />
      </label>
      <div id="repo-msg" aria-live="polite">
        {repoError && <p className="field-msg error">{repoError}</p>}
        {existing.length > 0 && (
          <p className="field-msg">
            Repo này đã có trong Kho Skill:{' '}
            {existing.map((s, i) => (
              <span key={s.slug}>
                {i > 0 && ', '}
                <Link href={`/skills/${s.slug}/`}>{s.title}</Link>
              </span>
            ))}
            .
          </p>
        )}
      </div>

      <label className="field">
        <span className="field-label">
          Skill này dùng để làm gì? <span className="field-hint">(không bắt buộc)</span>
        </span>
        <textarea
          value={useFor}
          onChange={(e) => setUseFor(e.target.value)}
          rows={4}
          placeholder="Ví dụ: xuất báo cáo Excel có biểu đồ, mình dùng hằng tuần và thấy ổn."
        />
      </label>

      <div className="suggest-actions">
        <button type="submit" className="btn accent" disabled={!issueUrl || existing.length > 0}>
          Gửi đề xuất trên GitHub
        </button>
        <span className="field-hint">Mở trang tạo Issue đã điền sẵn, bạn cần đăng nhập GitHub để gửi.</span>
      </div>

      {!SITE_REPO && (
        <p className="callout">
          Chưa điền <code>SITE_REPO</code> trong <code>src/data/site.ts</code> nên chưa gửi được. Trang này đang hiện vì chạy{' '}
          <code>npm run dev</code>; bản deploy sẽ ẩn trang cho tới khi điền repo.
        </p>
      )}
    </form>
  );
}
