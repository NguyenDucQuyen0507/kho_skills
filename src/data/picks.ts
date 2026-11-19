/**
 * "Nên cài trước": những skill Kho Skill gợi ý cài đầu tiên, theo đúng thứ tự hiển thị.
 * `slug` lấy từ src/data/skills.ts. Slug sai sẽ làm build báo lỗi.
 */
import { SKILLS, type Skill } from './skills';

export interface Pick {
  slug: string;
  reason: string;
}

export const PICKS: Pick[] = [
  { slug: 'session-handoff', reason: 'Đỡ tốn token và không mất mạch khi dự án kéo dài nhiều phiên.' },
  { slug: 'superpowers', reason: 'Giúp AI làm việc có quy trình: kế hoạch, test, kiểm chứng trước khi báo xong.' },
  { slug: 'skill-creator', reason: 'Tự viết skill cho cách làm việc của riêng bạn.' },
  { slug: 'frontend-design', reason: 'Giao diện AI tạo ra bớt đại trà, có chủ đích hơn.' },
  { slug: 'playwright-skill', reason: 'Tự kiểm tra web trên nhiều kích thước màn hình.' },
  { slug: 'pdf', reason: 'Đọc, gộp, tách, điền form PDF, việc văn phòng gặp hằng ngày.' },
  { slug: 'xlsx', reason: 'Làm sạch dữ liệu và lập bảng tính có công thức.' },
  { slug: 'trailofbits-skills', reason: 'Rà soát bảo mật trước khi đưa sản phẩm lên mạng.' },
];

// Kiểm tra ngay khi module được nạp: slug sai hoặc trùng thì build dừng với thông báo rõ ràng.
(() => {
  const known = new Set(SKILLS.map((s) => s.slug));
  const seen = new Set<string>();
  const errors: string[] = [];
  for (const p of PICKS) {
    if (!known.has(p.slug)) errors.push(`"${p.slug}" không tồn tại trong SKILLS.`);
    if (seen.has(p.slug)) errors.push(`"${p.slug}" bị lặp.`);
    seen.add(p.slug);
  }
  if (errors.length) throw new Error(`[picks.ts] Danh sách "Nên cài trước" sai:\n- ${errors.join('\n- ')}`);
})();

export const PICKED_SKILLS: { skill: Skill; reason: string }[] = PICKS.map((p) => ({
  skill: SKILLS.find((s) => s.slug === p.slug)!,
  reason: p.reason,
}));
