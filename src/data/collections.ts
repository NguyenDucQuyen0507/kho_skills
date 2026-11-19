/**
 * Bộ skill theo dự án: gom sẵn những skill hay dùng cùng nhau cho một loại việc.
 * `skills` là danh sách slug trong src/data/skills.ts. Slug sai sẽ làm build báo lỗi.
 */
import { SKILLS, type Skill } from './skills';

export interface Collection {
  slug: string;
  title: string;
  emoji: string;
  description: string;
  skills: string[];
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'web-react',
    title: 'Web / dashboard React',
    emoji: '🌐',
    description: 'Dựng giao diện đẹp, có quy trình làm việc rõ ràng và tự kiểm thử trên trình duyệt thật.',
    skills: ['frontend-design', 'webapp-testing', 'playwright-skill', 'superpowers'],
  },
  {
    slug: 'du-an-dai-ngay',
    title: 'Dự án dài nhiều ngày',
    emoji: '🧠',
    description: 'Giữ mạch công việc qua nhiều phiên: ghi lại tiến độ, bàn giao cho phiên sau, làm theo kế hoạch.',
    skills: ['session-handoff', 'superpowers', 'session-log'],
  },
  {
    slug: 'bao-cao-tai-lieu',
    title: 'Báo cáo & tài liệu',
    emoji: '📄',
    description: 'Soạn báo cáo, xuất Word, PDF, Excel và cùng AI viết tài liệu dài có cấu trúc.',
    skills: ['docx', 'pdf', 'xlsx', 'doc-coauthoring'],
  },
  {
    slug: 'app-di-dong',
    title: 'App di động',
    emoji: '📱',
    description: 'Làm app React Native với Expo và điều khiển trình giả lập iOS để chạy thử, chụp màn hình.',
    skills: ['expo-skills', 'ios-simulator-skill'],
  },
  {
    slug: 'bao-mat',
    title: 'Rà soát bảo mật',
    emoji: '🛡️',
    description: 'Tìm lỗ hổng và rà soát mã nguồn theo phương pháp của đội bảo mật chuyên nghiệp.',
    skills: ['trailofbits-skills'],
  },
];

// Kiểm tra dữ liệu ngay khi module được nạp: sai slug thì build dừng với thông báo rõ ràng.
(() => {
  const known = new Set(SKILLS.map((s) => s.slug));
  const seen = new Set<string>();
  const errors: string[] = [];
  for (const c of COLLECTIONS) {
    if (seen.has(c.slug)) errors.push(`Bộ "${c.slug}" bị trùng slug.`);
    seen.add(c.slug);
    for (const s of c.skills) {
      if (!known.has(s)) errors.push(`Bộ "${c.slug}" có skill "${s}" không tồn tại trong SKILLS.`);
    }
  }
  if (errors.length) throw new Error(`[collections.ts] Dữ liệu bộ skill sai:\n- ${errors.join('\n- ')}`);
})();

export function skillsOf(c: Collection): Skill[] {
  return c.skills.map((slug) => SKILLS.find((s) => s.slug === slug)!);
}
