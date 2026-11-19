'use client';

/**
 * Tab "Duyệt" (chỉ khi `npm run dev`): lấy skill mới từ GitHub, chọn repo muốn thêm,
 * rồi chép lệnh để Claude Code viết mô tả tiếng Việt và thêm vào src/data/skills.ts.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Candidate, DiscoverJob } from '@/lib/candidates.server';
import { formatDate, formatStars } from '@/data/stars';

const PROMPT = 'Thêm các skill được đánh dấu [x] trong data/candidates.md vào src/data/skills.ts';
const KIND_LABEL = { skill: 'Bộ skill', app: 'Phần mềm kèm skill' } as const;
// Giấy phép bắt buộc chia sẻ lại mã nguồn phần sửa đổi: hiện cảnh báo để cân nhắc.
const COPYLEFT = /^(A?GPL|LGPL|MPL|EUPL|CC-BY-SA|OSL)/i;

type KindFilter = 'all' | 'skill' | 'app';
type StatusFilter = 'all' | 'picked' | 'unpicked';
type SortOrder = 'stars' | 'pushed' | 'skills';

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
  return data;
}

export default function ReviewBoard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [job, setJob] = useState<DiscoverJob | null>(null);
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<KindFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortOrder>('stars');
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const say = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  }, []);

  const loadCandidates = useCallback(async () => {
    try {
      const res = await fetch('/api/duyet', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCandidates(data.candidates);
      setSelected(new Set(data.selected));
      setGeneratedAt(data.generatedAt);
    } catch (e) {
      say('Không tải được danh sách: ' + (e as Error).message);
    } finally {
      setLoaded(true);
    }
  }, [say]);

  // Lần đầu: tải danh sách và xem có đang quét dở không.
  useEffect(() => {
    loadCandidates();
    fetch('/api/duyet/discover', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      // Không ghi đè nếu người dùng đã bấm "Lấy skill mới" trước khi câu trả lời này về.
      .then((j) => j && setJob((cur) => cur ?? j))
      .catch(() => {});
  }, [loadCandidates]);

  // Đang quét: hỏi tiến trình mỗi 1,5 giây; xong thì tải lại danh sách.
  const running = job?.running ?? false;
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(async () => {
      try {
        const next: DiscoverJob = await (await fetch('/api/duyet/discover', { cache: 'no-store' })).json();
        setJob(next);
        if (!next.running) {
          await loadCandidates();
          const last = [...next.log].reverse().find((l) => l.startsWith('Xong') || l.startsWith('✗'));
          say(next.exitCode === 0 ? last ?? 'Đã lấy xong.' : 'Lấy skill không thành công, xem nhật ký bên dưới.');
        }
      } catch {
        // Mạng chập chờn: thử lại ở lần sau.
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [running, loadCandidates, say]);

  const startDiscover = async () => {
    try {
      setJob(await postJson<DiscoverJob>('/api/duyet/discover', {}));
    } catch (e) {
      say('Không bắt đầu được: ' + (e as Error).message);
    }
  };

  const toggle = async (repo: string) => {
    if (busy.has(repo)) return;
    const next = !selected.has(repo);
    setBusy((b) => new Set(b).add(repo));
    // Đổi ngay trên giao diện; lỗi thì hoàn lại.
    setSelected((s) => {
      const n = new Set(s);
      if (next) n.add(repo);
      else n.delete(repo);
      return n;
    });
    try {
      const data = await postJson<{ selected: string[] }>('/api/duyet', { repo, selected: next });
      setSelected(new Set(data.selected));
    } catch (e) {
      setSelected((s) => {
        const n = new Set(s);
        if (next) n.delete(repo);
        else n.add(repo);
        return n;
      });
      say('Không lưu được: ' + (e as Error).message);
    } finally {
      setBusy((b) => {
        const n = new Set(b);
        n.delete(repo);
        return n;
      });
    }
  };

  const copyPrompt = async () => {
    if (!selected.size) return say('Chưa chọn repo nào.');
    try {
      await navigator.clipboard.writeText(PROMPT);
      say(`Đã chép lệnh. Dán vào Claude Code để thêm ${selected.size} repo đã chọn.`);
    } catch {
      say('Không chép được, hãy gõ: ' + PROMPT);
    }
  };

  const visible = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = candidates.filter((c) => {
      if (kind !== 'all' && c.kind !== kind) return false;
      const picked = selected.has(c.repo);
      if (status === 'picked' && !picked) return false;
      if (status === 'unpicked' && picked) return false;
      if (!words.length) return true;
      const text = [c.repo, c.description, c.license, ...c.skills.flatMap((s) => [s.name, s.description, s.path])]
        .join(' ')
        .toLowerCase();
      return words.every((w) => text.includes(w));
    });
    const by: Record<SortOrder, (a: Candidate, b: Candidate) => number> = {
      stars: (a, b) => b.stars - a.stars,
      pushed: (a, b) => b.pushedAt.localeCompare(a.pushedAt),
      skills: (a, b) => b.skillCount - a.skillCount,
    };
    return list.sort(by[sort]);
  }, [candidates, selected, q, kind, status, sort]);

  const lastLine = job?.log[job.log.length - 1];

  return (
    <div className="container review">
      <header className="review-head">
        <span className="eyebrow">🔒 Chỉ hiện khi chạy trên máy (npm run dev)</span>
        <h1>Duyệt skill mới</h1>
        <p className="lead">
          Lấy skill mới từ GitHub, bấm <b>Chọn</b> ở repo muốn thêm, rồi chép lệnh dán vào Claude Code để viết mô tả
          tiếng Việt. Tab này không có trên trang deploy.
        </p>
      </header>

      {/* ── Lấy skill mới ── */}
      <section className="panel review-discover" aria-labelledby="h-discover">
        <div className="review-discover-row">
          <div>
            <h2 id="h-discover">Lấy skill mới từ GitHub</h2>
            <p className="review-muted" aria-live="polite">
              {running
                ? `Đang quét… ${lastLine ?? ''}`
                : generatedAt
                  ? `Danh sách hiện tại tạo lúc ${new Date(generatedAt).toLocaleString('vi-VN')}.`
                  : 'Chưa có danh sách. Bấm nút để quét lần đầu.'}
            </p>
          </div>
          <button type="button" className="btn accent" onClick={startDiscover} disabled={running}>
            {running ? (
              <>
                <span className="spinner" aria-hidden="true" /> Đang lấy…
              </>
            ) : (
              '🔍 Lấy skill mới'
            )}
          </button>
        </div>
        {job && job.log.length > 0 && (
          <details className="review-log" open={running}>
            <summary>Nhật ký lần quét {job.startedAt ? new Date(job.startedAt).toLocaleTimeString('vi-VN') : ''}</summary>
            <pre>{job.log.join('\n')}</pre>
          </details>
        )}
      </section>

      {/* ── Bộ lọc ── */}
      <div className="review-toolbar">
        <input
          className="review-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm repo, tên skill, mô tả…"
          aria-label="Tìm ứng viên"
        />
        <div className="review-chips" role="group" aria-label="Loại repo">
          {(
            [
              ['all', 'Tất cả'],
              ['skill', 'Bộ skill'],
              ['app', 'Phần mềm kèm skill'],
            ] as [KindFilter, string][]
          ).map(([v, label]) => (
            <button key={v} type="button" className="chip" aria-pressed={kind === v} onClick={() => setKind(v)}>
              {label}
            </button>
          ))}
        </div>
        <div className="review-chips" role="group" aria-label="Trạng thái">
          {(
            [
              ['all', 'Mọi trạng thái'],
              ['picked', 'Đã chọn'],
              ['unpicked', 'Chưa chọn'],
            ] as [StatusFilter, string][]
          ).map(([v, label]) => (
            <button key={v} type="button" className="chip" aria-pressed={status === v} onClick={() => setStatus(v)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="result-line">
        <p aria-live="polite">
          Đang hiện {visible.length} / {candidates.length} repo · <b>{selected.size} đã chọn</b>
        </p>
        <div className="review-result-actions">
          <label className="sort">
            <span>Sắp xếp</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortOrder)}>
              <option value="stars">Nhiều sao nhất</option>
              <option value="pushed">Mới cập nhật</option>
              <option value="skills">Nhiều skill nhất</option>
            </select>
          </label>
          <button type="button" className="btn accent" onClick={copyPrompt}>
            Sao chép lệnh cho Claude Code
          </button>
        </div>
      </div>

      {/* ── Danh sách ── */}
      <div className="rows">
        {visible.map((c, i) => {
          const owner = c.repo.split('/')[0];
          const picked = selected.has(c.repo);
          const copyleft = COPYLEFT.test(c.license);
          return (
            <article key={c.repo} className={`row ${picked ? 'is-picked' : ''}`}>
              <div className="row-lead">
                <span className="row-num" aria-hidden="true">
                  {i + 1}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="row-avatar"
                  src={`https://github.com/${owner}.png?size=88`}
                  alt={`Ảnh đại diện GitHub của ${owner}`}
                  width={44}
                  height={44}
                  loading="lazy"
                />
              </div>
              <div className="row-main">
                <h3 className="row-title">
                  <a href={`https://github.com/${c.repo}`} target="_blank" rel="noopener noreferrer">
                    {c.repo.split('/')[1]}
                  </a>
                </h3>
                <span className="code-name row-name">{c.repo}</span>
                {c.description && <p className="row-summary">{c.description}</p>}
                <details className="row-when">
                  <summary>
                    Xem {c.skills.length} skill{c.skillCount > c.skills.length ? ` (trên tổng ${c.skillCount})` : ''}
                  </summary>
                  <ul className="review-skills">
                    {c.skills.map((s) => (
                      <li key={s.path}>
                        <code>{s.name || '(không có name)'}</code>
                        <span className="review-path">{s.path}</span>
                        {s.description && <p>{s.description}</p>}
                      </li>
                    ))}
                  </ul>
                  {c.treeTruncated && <p className="review-muted">⚠ Repo quá lớn, có thể còn SKILL.md chưa liệt kê.</p>}
                </details>
                <div className="row-tags">
                  <span className="badge cat" title={`${c.stars.toLocaleString('vi-VN')} sao`}>
                    ★ {formatStars(c.stars)}
                  </span>
                  <span
                    className={`badge ${copyleft ? 'warn' : 'ok'}`}
                    title={copyleft ? 'Giấy phép copyleft: phải chia sẻ mã nguồn phần sửa đổi' : undefined}
                  >
                    {copyleft ? `⚠ ${c.license}` : c.license}
                  </span>
                  <span className={`badge ${c.kind === 'app' ? 'official' : 'community'}`}>{KIND_LABEL[c.kind]}</span>
                  <span className="badge cat">{c.skillCount} skill</span>
                  <span className="badge cat">Cập nhật {formatDate(c.pushedAt)}</span>
                </div>
              </div>
              <div className="row-actions">
                <button
                  type="button"
                  className={`btn ghost save-btn ${picked ? 'is-saved' : ''}`}
                  aria-pressed={picked}
                  disabled={busy.has(c.repo)}
                  onClick={() => toggle(c.repo)}
                >
                  {picked ? '✓ Đã chọn' : 'Chọn'}
                </button>
                <a className="btn ghost" href={`https://github.com/${c.repo}`} target="_blank" rel="noopener noreferrer">
                  Xem GitHub ↗
                </a>
              </div>
            </article>
          );
        })}
        {loaded && visible.length === 0 && (
          <div className="empty">
            <p>
              {candidates.length === 0
                ? 'Chưa có ứng viên. Bấm “🔍 Lấy skill mới” ở trên.'
                : 'Không có repo nào khớp bộ lọc.'}
            </p>
          </div>
        )}
      </div>

      <div className={`review-toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}
