import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import CopyCode from '@/components/CopyCode';
import { LicenseBadge, SourceBadge, StaleBadge } from '@/components/Badges';
import DetailSaveButton from '@/components/SaveButton';
import { LICENSE_INFO, SKILLS, categoryOf, skillUrl } from '@/data/skills';
import { formatDate, formatStars, isSharedRepo, starsOf, timeAgo } from '@/data/stars';
import { JsonLd, absUrl, breadcrumb, pageMeta } from '@/lib/seo';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return SKILLS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const skill = SKILLS.find((s) => s.slug === slug);
  if (!skill) return {};
  return pageMeta({
    title: `${skill.title} (${skill.name})`,
    description: skill.summary,
    path: `/skills/${skill.slug}/`,
    image: `/skills/${skill.slug}/og.png`, // tạo bởi og.png/route.tsx cùng thư mục
  });
}

export default async function SkillPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const skill = SKILLS.find((s) => s.slug === slug);
  if (!skill) notFound();

  const cat = categoryOf(skill.category);
  const license = LICENSE_INFO[skill.license];
  const stars = starsOf(skill);
  // Skills written by Kho Skill are hosted here, so show their full SKILL.md.
  const rawContent = skill.rawFile
    ? readFileSync(path.join(process.cwd(), 'public', skill.rawFile), 'utf8')
    : null;
  const related = SKILLS.filter((s) => s.category === skill.category && s.slug !== skill.slug).slice(0, 4);

  const pagePath = `/skills/${skill.slug}/`;
  const source = skillUrl(skill);
  const jsonLd = [
    breadcrumb([
      { name: 'Danh mục', path: '/' },
      { name: skill.title, path: pagePath },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: skill.title,
      alternateName: skill.name,
      description: skill.summary,
      url: absUrl(pagePath),
      codeRepository: source.startsWith('http') ? source : absUrl(source),
      inLanguage: 'vi',
      genre: cat.label,
      keywords: skill.tags.join(', '),
      author: { '@type': skill.source === 'official' ? 'Organization' : 'Person', name: skill.author },
      ...(skill.license !== 'none' && skill.license !== 'check-repo'
        ? { license: `https://spdx.org/licenses/${skill.license}.html` }
        : {}),
    },
  ];

  return (
    <div className="container">
      <JsonLd data={jsonLd} />
      <nav className="breadcrumb" aria-label="Đường dẫn">
        <Link href="/">Danh mục</Link> / {cat.label}
      </nav>

      <div className="detail">
        <article>
          <SourceBadge skill={skill} />
          <h1>{skill.title}</h1>
          <span className="code-name">{skill.name}</span>
          <p className="lead">{skill.summary}</p>

          <h2>Khi nào nên dùng</h2>
          <ul className="use">
            {skill.useWhen.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>

          {skill.includes && (
            <>
              <h2>Gồm các skill</h2>
              <div className="includes">
                {skill.includes.map((i) => (
                  <code key={i}>{i}</code>
                ))}
              </div>
            </>
          )}

          <h2>Cách cài</h2>
          {skill.install.map((block) => (
            <div className="install-block" key={block.label}>
              <div className="install-label">{block.label}</div>
              <CopyCode code={block.commands.join('\n')} />
            </div>
          ))}
          {rawContent && (
            <>
              <h2>Nội dung SKILL.md</h2>
              <CopyCode code={rawContent} wrap />
            </>
          )}
          <p className="note">
            {skill.source === 'kho-skill'
              ? 'Skill do Kho Skill viết và chia sẻ miễn phí (MIT). Sao chép nội dung hoặc tải file SKILL.md, đặt vào thư mục skill như hướng dẫn.'
              : skill.source === 'official'
              ? 'Trên Claude.ai, các skill mẫu này đã có sẵn cho gói trả phí. Bạn cũng có thể tải thư mục skill về và tải lên trong phần Skills.'
              : 'Lệnh lấy từ README của tác giả. Hãy đọc README gốc trước khi cài, vì cách cài có thể thay đổi theo phiên bản.'}{' '}
            <Link href="/skill-la-gi/#cach-cai">Xem hướng dẫn cài chung</Link>
          </p>
        </article>

        <aside className="side">
          <div className="panel">
            <h3>Thông tin</h3>
            <dl className="meta">
              <div>
                <dt>Tác giả</dt>
                <dd>{skill.author}</dd>
              </div>
              <div>
                <dt>Nhóm</dt>
                <dd>
                  {cat.emoji} {cat.label}
                </dd>
              </div>
              {skill.skillCount && (
                <div>
                  <dt>Số skill</dt>
                  <dd>{skill.skillCount}</dd>
                </div>
              )}
              {stars && (
                <>
                  <div>
                    <dt>Sao GitHub</dt>
                    <dd title={stars.stars.toLocaleString('vi-VN')}>
                      ★ {formatStars(stars.stars)}
                      {isSharedRepo(skill) && <small className="meta-note">số sao của cả repo</small>}
                    </dd>
                  </div>
                  <div>
                    <dt>Cập nhật gần nhất</dt>
                    <dd>
                      <time dateTime={stars.pushedAt} title={formatDate(stars.pushedAt)}>
                        {timeAgo(stars.pushedAt)}
                      </time>
                      <StaleBadge skill={skill} />
                    </dd>
                  </div>
                </>
              )}
              <div>
                <dt>Giấy phép</dt>
                <dd>
                  <LicenseBadge skill={skill} />
                </dd>
              </div>
            </dl>
            <p className="license-note">{license.note}</p>
            <p className="detail-actions">
              <DetailSaveButton slug={skill.slug} />
              {skill.rawFile ? (
                <a className="btn" href={skill.rawFile} download="SKILL.md">
                  Tải file SKILL.md ↓
                </a>
              ) : (
                <a className="btn" href={skillUrl(skill)} target="_blank" rel="noopener noreferrer">
                  Xem mã nguồn trên GitHub ↗
                </a>
              )}
            </p>
          </div>

          {related.length > 0 && (
            <div className="panel">
              <h3>Cùng nhóm</h3>
              <div className="related">
                {related.map((r) => (
                  <Link key={r.slug} href={`/skills/${r.slug}/`}>
                    {r.title}
                    <small>{r.name}</small>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
