/**
 * /skills.json: danh sách skill dạng máy đọc được, để AI (Claude…) chọn skill phù hợp cho một dự án.
 * Xuất tĩnh lúc build.
 */
import { COLLECTIONS } from '@/data/collections';
import { CATEGORIES, CHECKED_AT, LICENSE_INFO, SKILLS, skillUrl } from '@/data/skills';

export const dynamic = 'force-static';

export function GET() {
  const body = {
    name: 'Kho Skill',
    description:
      'Danh mục AI Skills (SKILL.md) cho Claude và các AI agent, mô tả tiếng Việt. Dùng để đề xuất skill nên cài cho một dự án.',
    checkedAt: CHECKED_AT,
    categories: CATEGORIES.map(({ id, label }) => ({ id, label })),
    skills: SKILLS.map((s) => ({
      slug: s.slug,
      name: s.name,
      title: s.title,
      summary: s.summary,
      useWhen: s.useWhen,
      category: s.category,
      source: s.source,
      repo: s.repo || null,
      url: s.repo ? skillUrl(s) : null,
      license: s.license,
      licenseNote: LICENSE_INFO[s.license].note,
      install: s.install,
      ...(s.includes ? { includes: s.includes } : {}),
    })),
    collections: COLLECTIONS.map(({ slug, title, description, skills }) => ({ slug, title, description, skills })),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
