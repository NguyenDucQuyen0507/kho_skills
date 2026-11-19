'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { COLLECTIONS, skillsOf } from '@/data/collections';
import { PICKED_SKILLS } from '@/data/picks';
import { formatStars, isSharedRepo, starsOf } from '@/data/stars';
import { Avatar } from './SkillRow';

/** (a) Thẻ lớn cho từng bộ skill theo dự án. Bấm thẻ = chọn bộ đó trong sidebar. */
export function CollectionCards({ onPick }: { onPick: (slug: string) => void }) {
  return (
    <section className="home-section" aria-labelledby="h-bo-skill">
      <h2 id="h-bo-skill" className="section-title">
        Bộ skill theo dự án
      </h2>
      <div className="col-grid">
        {COLLECTIONS.map((c) => (
          <button key={c.slug} type="button" className="col-card" onClick={() => onPick(c.slug)}>
            <span className="col-emoji" aria-hidden="true">
              {c.emoji}
            </span>
            <span className="col-title">{c.title}</span>
            <span className="col-desc">{c.description}</span>
            <span className="col-count">{c.skills.length} skill</span>
            <span className="col-names">{skillsOf(c).map((s) => s.name).join(' · ')}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/** (b) Hàng cuộn ngang "Nên cài trước", có nút ‹ › trên desktop. */
export function PicksRow() {
  const scroller = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const updateEdge = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    updateEdge();
    window.addEventListener('resize', updateEdge);
    return () => window.removeEventListener('resize', updateEdge);
  }, [updateEdge]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section className="home-section" aria-labelledby="h-picks">
      <div className="section-head">
        <h2 id="h-picks" className="section-title">
          Nên cài trước
        </h2>
        <div className="picks-nav">
          <button type="button" className="icon-btn" onClick={() => scrollBy(-1)} disabled={edge.start} aria-label="Cuộn sang trái">
            ‹
          </button>
          <button type="button" className="icon-btn" onClick={() => scrollBy(1)} disabled={edge.end} aria-label="Cuộn sang phải">
            ›
          </button>
        </div>
      </div>
      <ul ref={scroller} className="picks" aria-label="Nên cài trước: các skill gợi ý, cuộn ngang" onScroll={updateEdge}>
        {PICKED_SKILLS.map(({ skill, reason }) => {
          const stars = starsOf(skill);
          return (
            <li key={skill.slug}>
              <Link href={`/skills/${skill.slug}/`} className="pick-card">
                <Avatar skill={skill} />
                <span className="pick-title">{skill.title}</span>
                <span className="pick-name">{skill.name}</span>
                <span className="pick-reason">{reason}</span>
                {stars && (
                  <span
                    className="pick-stars"
                    title={isSharedRepo(skill) ? 'Số sao của cả repo anthropics/skills' : undefined}
                  >
                    ★ {formatStars(stars.stars)}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
