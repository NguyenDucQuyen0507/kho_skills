'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { COLLECTIONS } from '@/data/collections';
import Link from 'next/link';
import { SUGGEST_ENABLED } from '@/data/site';
import { CATEGORIES, CHECKED_AT, SKILLS, categoryOf, normalize, type CategoryId, type Skill } from '@/data/skills';
import { starsOf } from '@/data/stars';
import { useSlugSet } from '@/lib/storage';
import { CollectionCards, PicksRow } from './HomeSections';
import { SkillRow } from './SkillRow';

/** Mục lọc đang chọn trong sidebar. Mỗi lúc chỉ chọn một mục. */
type FilterId = string; // 'all' | 'saved' | 'unseen' | 'own' | 'src:…' | 'col:…' | 'cat:…' | 'cat:other'
type SortOrder = 'default' | 'stars';

const DESKTOP_QUERY = '(min-width: 1024px)';

// Chỉ mục tìm kiếm không dấu, tính một lần: gồm cả "khi nào dùng" và tên nhóm để tìm theo nhu cầu.
const INDEX = SKILLS.map((s) => ({
  skill: s,
  text: normalize(
    [
      s.name,
      s.title,
      s.summary,
      s.author,
      s.repo,
      categoryOf(s.category).label,
      ...s.tags,
      ...s.useWhen,
      ...(s.includes ?? []),
    ].join(' '),
  ),
}));

// Nhóm có ít hơn 2 skill gộp vào "Khác".
const catCount = (id: CategoryId) => SKILLS.filter((s) => s.category === id).length;
const MAIN_CATS = CATEGORIES.filter((c) => catCount(c.id) >= 2);
const OTHER_CATS = new Set(CATEGORIES.filter((c) => catCount(c.id) < 2).map((c) => c.id));
const catFilterId = (id: CategoryId): FilterId => (OTHER_CATS.has(id) ? 'cat:other' : `cat:${id}`);

/** Chip "Thử ngay": hoặc điền từ khóa tìm kiếm, hoặc chọn một mục lọc. */
const TRY_CHIPS: { label: string; query?: string; filter?: FilterId }[] = [
  { label: '📄 Xuất báo cáo Word', query: 'word' },
  { label: '📑 Xử lý PDF', query: 'pdf' },
  { label: '🧪 Test website', query: 'test' },
  { label: '🧠 Nhớ tiến độ dự án', filter: 'col:du-an-dai-ngay' },
  { label: '📱 Làm app di động', filter: 'col:app-di-dong' },
  { label: '🎨 Thiết kế giao diện', filter: catFilterId('thiet-ke') },
];

interface Item {
  id: FilterId;
  label: string;
  test: (s: Skill) => boolean;
}
interface Group {
  title: string;
  items: Item[];
}

function buildGroups(saved: Set<string>, viewed: Set<string>): Group[] {
  return [
    {
      title: 'Bộ skill theo dự án',
      items: COLLECTIONS.map((c) => ({
        id: `col:${c.slug}`,
        label: `${c.emoji} ${c.title}`,
        test: (s) => c.skills.includes(s.slug),
      })),
    },
    {
      title: 'Lọc nhanh',
      items: [
        { id: 'all', label: 'Tất cả', test: () => true },
        { id: 'saved', label: '♥ Đã lưu', test: (s) => saved.has(s.slug) },
        { id: 'unseen', label: 'Chưa xem', test: (s) => !viewed.has(s.slug) },
        { id: 'own', label: '★ Kho Skill tự viết', test: (s) => s.source === 'kho-skill' },
      ],
    },
    {
      title: 'Nguồn',
      items: [
        { id: 'src:official', label: 'Chính thức (Anthropic)', test: (s) => s.source === 'official' },
        { id: 'src:community', label: 'Cộng đồng', test: (s) => s.source === 'community' },
      ],
    },
    {
      title: 'Chủ đề',
      items: [
        ...MAIN_CATS.map((c) => ({
          id: `cat:${c.id}`,
          label: `${c.emoji} ${c.label}`,
          test: (s: Skill) => s.category === c.id,
        })),
        ...(OTHER_CATS.size
          ? [{ id: 'cat:other', label: '🗂️ Khác', test: (s: Skill) => OTHER_CATS.has(s.category) }]
          : []),
      ],
    },
  ];
}

export default function Catalog() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterId>('all');
  const [sort, setSort] = useState<SortOrder>('default');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const listRef = useRef<HTMLElement>(null);

  const saved = useSlugSet('saved');
  const viewed = useSlugSet('viewed');

  const groups = useMemo(() => buildGroups(saved.slugs, viewed.slugs), [saved.slugs, viewed.slugs]);
  const items = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const active = items.find((i) => i.id === filter) ?? items.find((i) => i.id === 'all')!;
  const isFiltering = active.id !== 'all' || query.trim() !== '';

  const results = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    const list = INDEX.filter(({ skill, text }) => active.test(skill) && words.every((w) => text.includes(w))).map(
      (x) => x.skill,
    );
    // Mục không có dữ liệu sao xếp cuối; sort ổn định nên giữ thứ tự gốc khi bằng nhau.
    if (sort === 'stars') list.sort((a, b) => (starsOf(b)?.stars ?? -1) - (starsOf(a)?.stars ?? -1));
    return list;
  }, [query, active, sort]);

  const scrollToList = () => {
    // Đợi React render xong danh sách mới (các phần trên có thể vừa bị ẩn) rồi mới cuộn.
    requestAnimationFrame(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      listRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  };

  // ── Ngăn kéo bộ lọc (màn hình < 1024px) ──
  const drawerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => {
      setIsDesktop(mq.matches);
      if (mq.matches) setDrawerOpen(false);
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDrawer();
        return;
      }
      // Giữ focus trong ngăn kéo khi bấm Tab.
      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>('button:not([disabled])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen, closeDrawer]);

  const choose = (id: FilterId) => {
    setFilter(id);
    if (drawerOpen) closeDrawer();
  };

  const pickCollection = (slug: string) => {
    setFilter(`col:${slug}`);
    scrollToList();
  };

  const applyChip = (chip: (typeof TRY_CHIPS)[number]) => {
    setQuery(chip.query ?? '');
    setFilter(chip.filter ?? 'all');
    scrollToList();
  };
  const chipActive = (chip: (typeof TRY_CHIPS)[number]) =>
    chip.query ? query === chip.query && active.id === 'all' : active.id === chip.filter && query === '';

  const asDialog = drawerOpen && !isDesktop;
  const stat = (n: number, ready: boolean) => (ready ? n : '…');

  return (
    <>
      {/* ── Hero ── */}
      <section className="container hero" aria-labelledby="hero-title">
        <div className="hero-box">
          <span className="eyebrow">🇻🇳 Danh mục AI Skills bằng tiếng Việt</span>
          <h1 id="hero-title">
            Dạy AI làm việc <em>đúng cách bạn muốn</em>, bằng skill có sẵn.
          </h1>
          <p className="hero-lead">
            <strong>Ít hơn nhưng chọn kỹ, bằng tiếng Việt.</strong> Mỗi skill đều có giấy phép rõ ràng, còn được cập nhật, được
            mô tả lại bằng tiếng Việt và kèm lệnh cài sẵn để chép.
          </p>

          <form
            className="hero-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              scrollToList();
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Gõ việc bạn muốn làm: xuất báo cáo Word, test web, nhớ tiến độ dự án…"
              aria-label="Tìm skill theo việc bạn muốn làm"
            />
            <button type="submit" className="hero-search-btn">
              Tìm
            </button>
          </form>

          <p className="hero-advisor">
            Đang làm dự án và chưa biết cần skill nào?{' '}
            <Link href="/goi-y/">Mô tả dự án, Kho Skill gợi ý cho bạn →</Link>
          </p>

          <div className="try-row">
            <span className="try-label" id="try-label">
              Thử ngay:
            </span>
            <div className="try-chips" role="group" aria-labelledby="try-label">
              {TRY_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  className="chip"
                  aria-pressed={chipActive(chip)}
                  onClick={() => applyChip(chip)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <p className="hero-stats">
            {SKILLS.length} skill · {CATEGORIES.length} chủ đề · {COLLECTIONS.length} bộ theo dự án ·{' '}
            {stat(saved.slugs.size, saved.ready)} đã lưu · {stat(viewed.slugs.size, viewed.ready)} đã xem
          </p>
          <p className="hero-update">
            Cập nhật {CHECKED_AT.split('-').reverse().join('/')} · danh mục đang được bổ sung thêm
            {SUGGEST_ENABLED && (
              <>
                {' · '}
                <Link href="/de-xuat/">Gửi skill bạn biết →</Link>
              </>
            )}
          </p>
        </div>
      </section>

      {/* ── Sidebar + nội dung ── */}
      <div className="container catalog">
        {drawerOpen && <div className="drawer-backdrop" onClick={closeDrawer} aria-hidden="true" />}

        <aside
          ref={drawerRef}
          id="bo-loc"
          className={`sidebar ${drawerOpen ? 'open' : ''}`}
          aria-label="Bộ lọc"
          {...(asDialog ? { role: 'dialog', 'aria-modal': true } : {})}
        >
          <div className="drawer-head">
            <strong>Bộ lọc</strong>
            <button ref={closeRef} type="button" className="drawer-close" onClick={closeDrawer} aria-label="Đóng bộ lọc">
              ✕
            </button>
          </div>
          {groups.map((g) => (
            <div className="side-group" key={g.title} role="group" aria-label={g.title}>
              <h2 className="side-title">{g.title}</h2>
              {g.items.map((item) => {
                // Số lượng phụ thuộc localStorage chỉ hiện sau khi đọc xong, tránh lệch khi hydrate.
                const pending = (item.id === 'saved' && !saved.ready) || (item.id === 'unseen' && !viewed.ready);
                const count = SKILLS.filter(item.test).length;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="side-item"
                    aria-pressed={active.id === item.id}
                    onClick={() => choose(item.id)}
                  >
                    <span className="side-label">{item.label}</span>
                    <span className="side-count">{pending ? '·' : count}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        <div className="catalog-main">
          {!isFiltering && (
            <>
              <CollectionCards onPick={pickCollection} />
              <PicksRow />
            </>
          )}

          <section ref={listRef} id="tat-ca" className="home-section list-section" aria-labelledby="h-all">
            <div className="section-head">
              <h2 id="h-all" className="section-title">
                {isFiltering ? 'Kết quả' : 'Tất cả skill'}
              </h2>
              <button
                ref={toggleRef}
                type="button"
                className="btn ghost filter-toggle"
                aria-expanded={drawerOpen}
                aria-controls="bo-loc"
                onClick={() => setDrawerOpen(true)}
              >
                ☰ Bộ lọc
              </button>
            </div>

            <div className="result-line">
              <p aria-live="polite">
                Đang hiện {results.length} / {SKILLS.length} skill
                {active.id !== 'all' && <> · {active.label}</>}
                {query.trim() && <> · “{query.trim()}”</>}
              </p>
              <label className="sort">
                <span>Sắp xếp</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as SortOrder)}>
                  <option value="default">Mặc định</option>
                  <option value="stars">Nhiều sao nhất</option>
                </select>
              </label>
            </div>

            <div className="rows">
              {results.map((s, i) => (
                <SkillRow
                  key={s.slug}
                  skill={s}
                  index={i + 1}
                  saved={saved.slugs.has(s.slug)}
                  onToggleSave={saved.toggle}
                />
              ))}
              {results.length === 0 && (
                <div className="empty">
                  <p>
                    {active.id === 'saved' && !query
                      ? 'Bạn chưa lưu skill nào. Bấm “♡ Lưu” ở một skill để thêm vào đây.'
                      : 'Không tìm thấy skill phù hợp. Thử từ khóa ngắn hơn, hoặc chọn “Tất cả”.'}
                  </p>
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => {
                      setQuery('');
                      setFilter('all');
                    }}
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
