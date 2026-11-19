'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { NEEDS } from '@/data/needs';
import { combinedInstall, detectNeeds, recommend } from '@/lib/recommend';
import { useSlugSet } from '@/lib/storage';
import CopyCode from './CopyCode';
import { SkillRow } from './SkillRow';

const EXAMPLES = [
  'Trang admin quản lý bán hàng bằng React: đăng nhập phân quyền, bảng đơn hàng, biểu đồ doanh thu, xuất Excel',
  'App đặt lịch khám bằng React Native, làm trong nhiều tuần',
  'Website giới thiệu công ty, cần chuẩn SEO và giao diện đẹp',
  'Chatbot AI trả lời khách hàng, backend Node.js và PostgreSQL',
  'Viết báo cáo tuần bằng Word và làm slide thuyết trình',
];

const TOP = 6; // số skill trong nhóm "Nên cài trước"
const MORE = 8;

/** Đọc ?mo-ta=…&them=…&bo=… để mở sẵn kết quả (chia sẻ link, hoặc dự án khác dẫn sang). */
function readUrl() {
  const p = new URLSearchParams(window.location.search);
  const list = (k: string) => new Set((p.get(k) ?? '').split(',').filter(Boolean));
  return { text: p.get('mo-ta') ?? '', added: list('them'), removed: list('bo') };
}

export default function ProjectAdvisor() {
  const [text, setText] = useState('');
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [origin, setOrigin] = useState('https://<địa chỉ trang>');
  const [copied, setCopied] = useState(false);
  const loaded = useRef(false);
  const { slugs: saved, toggle } = useSlugSet('saved');

  useEffect(() => {
    const u = readUrl();
    setText(u.text);
    setAdded(u.added);
    setRemoved(u.removed);
    setOrigin(window.location.origin);
    loaded.current = true;
  }, []);

  // Ghi lại vào địa chỉ trang để chia sẻ được (không tạo thêm lịch sử trình duyệt).
  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(() => {
      const p = new URLSearchParams();
      if (text.trim()) p.set('mo-ta', text.trim());
      if (added.size) p.set('them', [...added].join(','));
      if (removed.size) p.set('bo', [...removed].join(','));
      const q = p.toString();
      window.history.replaceState(null, '', q ? `?${q}` : window.location.pathname);
    }, 400);
    return () => clearTimeout(t);
  }, [text, added, removed]);

  const detected = useMemo(() => detectNeeds(text), [text]);
  const detectedIds = useMemo(() => new Set(detected.map((d) => d.need.id)), [detected]);
  const selected = useMemo(() => {
    const ids = detected.map((d) => d.need.id).filter((id) => !removed.has(id));
    for (const n of NEEDS) if (added.has(n.id) && !ids.includes(n.id)) ids.push(n.id);
    return ids;
  }, [detected, added, removed]);
  const results = useMemo(() => recommend(selected, text), [selected, text]);
  const top = results.slice(0, TOP);
  const more = results.slice(TOP, TOP + MORE);
  const install = useMemo(() => combinedInstall(top.map((r) => r.skill)), [top]);

  const toggleNeed = (id: string) => {
    const on = selected.includes(id);
    const flip = (set: Set<string>, add: boolean) => {
      const next = new Set(set);
      if (add) next.add(id);
      else next.delete(id);
      return next;
    };
    if (on) {
      setAdded((s) => flip(s, false));
      if (detectedIds.has(id)) setRemoved((s) => flip(s, true));
    } else {
      setRemoved((s) => flip(s, false));
      if (!detectedIds.has(id)) setAdded((s) => flip(s, true));
    }
  };

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(install);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard bị chặn: lệnh từng skill vẫn chép được ở mỗi dòng.
    }
  };

  const wordsOf = (id: string) => detected.find((d) => d.need.id === id)?.words ?? [];
  const others = NEEDS.filter((n) => !selected.includes(n.id));
  const hasInput = text.trim() !== '' || selected.length > 0;

  const aiPrompt = `Đọc danh sách skill tại ${origin}/skills.json. Dự án của tôi: "${text.trim() || '<mô tả dự án>'}". Xem thêm mã nguồn dự án hiện tại nếu có, rồi đề xuất những skill nên cài, kèm lý do và lệnh cài.`;

  return (
    <div className="advisor">
      <div className="advisor-input">
        <label htmlFor="mo-ta" className="field-label">
          Dự án của bạn làm gì, dùng công nghệ gì, cần những tính năng nào?
        </label>
        <textarea
          id="mo-ta"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Ví dụ: Trang admin quản lý kho bằng Next.js, có đăng nhập, bảng tồn kho, biểu đồ nhập xuất và xuất báo cáo Excel. Làm trong vài tháng."
        />
        <div className="try-row">
          <span className="try-label" id="vi-du">
            Ví dụ:
          </span>
          <div className="try-chips" role="group" aria-labelledby="vi-du">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                className="chip"
                onClick={() => {
                  setText(ex);
                  setAdded(new Set());
                  setRemoved(new Set());
                }}
              >
                {ex.split(/[:,]/)[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="advisor-needs" aria-labelledby="nhu-cau">
        <h2 id="nhu-cau">Nhu cầu của dự án</h2>
        {selected.length > 0 ? (
          <p className="advisor-muted">Bấm vào một nhu cầu để bỏ nếu không đúng, hoặc thêm nhu cầu bên dưới.</p>
        ) : (
          <p className="advisor-muted">
            {text.trim()
              ? 'Chưa nhận ra nhu cầu nào. Thử ghi rõ hơn: dùng công nghệ gì (React, Node.js, app di động…), có tính năng gì (đăng nhập, biểu đồ, xuất Excel…), hoặc chọn nhu cầu bên dưới.'
              : 'Gõ mô tả ở trên, nhu cầu sẽ hiện ra ở đây. Hoặc chọn thẳng nhu cầu bên dưới.'}
          </p>
        )}
        {selected.length > 0 && (
          <div className="advisor-chips" role="group" aria-label="Nhu cầu đã chọn">
            {selected.map((id) => {
              const n = NEEDS.find((x) => x.id === id)!;
              const words = wordsOf(id);
              return (
                <button
                  key={id}
                  type="button"
                  className="chip"
                  aria-pressed="true"
                  onClick={() => toggleNeed(id)}
                  title={words.length ? `Nhận ra từ: ${words.join(', ')}` : 'Bạn tự thêm'}
                >
                  {n.emoji} {n.label} <span aria-hidden="true">✕</span>
                  <span className="sr-only">(bấm để bỏ)</span>
                </button>
              );
            })}
          </div>
        )}
        <button type="button" className="advisor-more-btn" aria-expanded={showAll} onClick={() => setShowAll((v) => !v)}>
          {showAll ? '− Ẩn danh sách nhu cầu' : `+ Thêm nhu cầu (${others.length})`}
        </button>
        {showAll && (
          <div className="advisor-chips" role="group" aria-label="Thêm nhu cầu">
            {others.map((n) => (
              <button key={n.id} type="button" className="chip" aria-pressed="false" onClick={() => toggleNeed(n.id)}>
                {n.emoji} {n.label}
              </button>
            ))}
          </div>
        )}
      </section>

      {results.length > 0 && (
        <section className="advisor-results" aria-labelledby="nen-cai">
          <div className="advisor-results-head">
            <h2 id="nen-cai">Nên cài trước</h2>
            {install && (
              <button type="button" className="btn accent" onClick={copyInstall}>
                {copied ? 'Đã chép ✓' : `Chép lệnh cài ${top.length} skill này`}
              </button>
            )}
          </div>
          <AdviceList items={top} start={1} saved={saved} onToggleSave={toggle} />

          {more.length > 0 && (
            <>
              <h2 className="advisor-subhead">Có thể cân nhắc thêm</h2>
              <AdviceList items={more} start={TOP + 1} saved={saved} onToggleSave={toggle} />
            </>
          )}
        </section>
      )}

      {hasInput && (
        <section className="advisor-ai" aria-labelledby="nho-ai">
          <h2 id="nho-ai">Muốn chọn kỹ hơn? Nhờ AI xem cả mã nguồn</h2>
          <p className="advisor-muted">
            Gợi ý ở trên dựa vào từ khóa trong mô tả. Mở Claude Code trong thư mục dự án và dán câu dưới đây: AI sẽ đọc danh sách skill
            của Kho Skill cùng mã nguồn thật của bạn để chọn sát hơn.
          </p>
          <CopyCode wrap code={aiPrompt} />
        </section>
      )}
    </div>
  );
}

function AdviceList({
  items,
  start,
  saved,
  onToggleSave,
}: {
  items: ReturnType<typeof recommend>;
  start: number;
  saved: Set<string>;
  onToggleSave: (slug: string) => void;
}) {
  return (
    <div className="rows">
      {items.map((r, i) => (
        <div className="advice" key={r.skill.slug}>
          <ul className="advice-why" aria-label={`Vì sao gợi ý ${r.skill.title}`}>
            {r.reasons.map((x) => (
              <li key={x.need.id}>
                <span className="advice-need">
                  {x.need.emoji} {x.need.label}:
                </span>{' '}
                {x.why}
              </li>
            ))}
          </ul>
          <SkillRow skill={r.skill} index={start + i} saved={saved.has(r.skill.slug)} onToggleSave={onToggleSave} />
        </div>
      ))}
    </div>
  );
}
