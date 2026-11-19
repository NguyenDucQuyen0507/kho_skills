/**
 * Gợi ý skill từ mô tả dự án, chạy hoàn toàn trên trình duyệt (trang tĩnh, không gọi máy chủ).
 * Dữ liệu nhu cầu nằm ở src/data/needs.ts.
 */
import { NEEDS, type Need } from '@/data/needs';
import { SKILLS, normalize, type Skill } from '@/data/skills';

/** Bỏ dấu, viết thường, chỉ giữ chữ và số, bọc khoảng trắng hai đầu để so khớp trọn từ. */
export function prepare(raw: string): string {
  // "AI" viết hoa là trí tuệ nhân tạo; "ai" viết thường thường là đại từ ("cho ai dùng").
  const withAi = raw.replace(/(^|[^\p{L}\p{N}])AI(?=$|[^\p{L}\p{N}])/gu, '$1 tri tue nhan tao ');
  const words = normalize(withAi).replace(/[^a-z0-9]+/g, ' ').trim();
  return words ? ` ${words} ` : ' ';
}

interface KeywordEntry {
  phrase: string; // dạng " cum tu "
  needs: { id: string; weight: number }[];
}

/** Gom từ khóa của mọi nhu cầu, cụm dài xếp trước để được khớp trước. */
const KEYWORDS: KeywordEntry[] = (() => {
  const map = new Map<string, KeywordEntry>();
  const add = (kw: string, id: string, weight: number) => {
    const phrase = prepare(kw);
    if (phrase.trim() === '') return;
    const e = map.get(phrase) ?? { phrase, needs: [] };
    if (!e.needs.some((n) => n.id === id)) e.needs.push({ id, weight });
    map.set(phrase, e);
  };
  for (const n of NEEDS) {
    n.keywords.forEach((k) => add(k, n.id, 1));
    n.weak?.forEach((k) => add(k, n.id, 0.5));
  }
  return [...map.values()].sort(
    (a, b) => b.phrase.split(' ').length - a.phrase.split(' ').length || b.phrase.length - a.phrase.length,
  );
})();

const NEED_BY_ID = new Map(NEEDS.map((n) => [n.id, n]));

export interface DetectedNeed {
  need: Need;
  score: number;
  words: string[]; // từ khóa đã khớp (không dấu), để hiện "vì bạn nhắc tới…"
}

/** Nhận ra nhu cầu trong mô tả. Mỗi cụm từ chỉ được tính một lần (cụm dài "ăn" trước cụm ngắn). */
export function detectNeeds(raw: string): DetectedNeed[] {
  let text = prepare(raw);
  const found = new Map<string, { score: number; words: Set<string> }>();
  for (const { phrase, needs } of KEYWORDS) {
    let hit = false;
    while (text.includes(phrase)) {
      text = text.replace(phrase, ' | ');
      hit = true;
    }
    if (!hit) continue;
    for (const { id, weight } of needs) {
      const f = found.get(id) ?? { score: 0, words: new Set<string>() };
      f.score += weight;
      f.words.add(phrase.trim());
      found.set(id, f);
    }
  }
  return [...found.entries()]
    .filter(([, f]) => f.score >= 1)
    .map(([id, f]) => ({ need: NEED_BY_ID.get(id)!, score: f.score, words: [...f.words] }))
    .sort((a, b) => b.score - a.score || NEEDS.indexOf(a.need) - NEEDS.indexOf(b.need));
}

export interface Recommendation {
  skill: Skill;
  score: number;
  reasons: { need: Need; why: string }[];
  tags: string[]; // tag của skill trùng với chữ trong mô tả
}

// Tag quá chung, trùng ý với nhu cầu: không cộng điểm riêng.
const GENERIC_TAGS = new Set(['thiet ke', 'giao dien', 'viet', 'hoc', 'api', 'mau', 'test', 'ui', 'ux', 'skill', 'tai lieu', 'du lieu']);
const SKILL_TAGS = SKILLS.map((s) => ({
  skill: s,
  tags: s.tags.map((t) => ({ tag: t, phrase: prepare(t) })).filter((t) => t.phrase.trim().length >= 3 && !GENERIC_TAGS.has(t.phrase.trim())),
}));

/**
 * Chấm điểm skill theo các nhu cầu đã chọn: skill đứng đầu danh sách của một nhu cầu được nhiều điểm hơn,
 * hợp nhiều nhu cầu thì cộng dồn. Tag trùng chữ trong mô tả được cộng thêm điểm.
 */
export function recommend(needIds: string[], raw: string): Recommendation[] {
  const text = prepare(raw);
  const bySlug = new Map<string, Recommendation>();
  const get = (skill: Skill) => {
    let r = bySlug.get(skill.slug);
    if (!r) bySlug.set(skill.slug, (r = { skill, score: 0, reasons: [], tags: [] }));
    return r;
  };
  const skillBySlug = new Map(SKILLS.map((s) => [s.slug, s]));

  for (const id of needIds) {
    const need = NEED_BY_ID.get(id);
    if (!need) continue;
    need.skills.forEach(([slug, why], i) => {
      const r = get(skillBySlug.get(slug)!);
      r.score += ([3, 2.25, 1.5][i] ?? 1) * (need.boost ?? 1);
      r.reasons.push({ need, why });
    });
  }

  // Tag chỉ dùng để xếp lại thứ tự trong các skill đã hợp nhu cầu, không tự kéo skill mới vào
  // (tránh nhầm như "đặt lịch" thành skill Google Calendar).
  if (text.trim()) {
    for (const { skill, tags } of SKILL_TAGS) {
      const r = bySlug.get(skill.slug);
      if (!r) continue;
      const hit = tags.filter((t) => text.includes(t.phrase)).map((t) => t.tag);
      if (!hit.length) continue;
      r.score += Math.min(hit.length, 2);
      r.tags = hit;
    }
  }

  return [...bySlug.values()].sort((a, b) => b.score - a.score || b.reasons.length - a.reasons.length);
}

/** Lệnh cài gộp cho nhiều skill (lấy cách cài đầu tiên của mỗi skill, bỏ dòng trùng như marketplace add). */
export function combinedInstall(skills: Skill[]): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of skills) {
    const first = s.install[0];
    if (!first) continue;
    const lines = first.commands.filter((c) => !seen.has(c));
    if (!lines.length) continue;
    lines.forEach((c) => seen.add(c));
    out.push(`# ${s.title} (${first.label})`, ...lines, '');
  }
  return out.join('\n').trim();
}
