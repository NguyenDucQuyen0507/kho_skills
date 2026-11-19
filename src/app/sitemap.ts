import type { MetadataRoute } from 'next';
import { COLLECTIONS } from '@/data/collections';
import { SITE_URL, SUGGEST_ENABLED } from '@/data/site';
import { CHECKED_AT, SKILLS } from '@/data/skills';

export const dynamic = 'force-static';

/** /sitemap.xml: mọi trang công khai, để Google tìm thấy đủ. Thêm trang mới thì thêm vào đây. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(CHECKED_AT);
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    priority,
  });
  return [
    page('/', 1),
    page('/goi-y/', 0.9),
    page('/skill-la-gi/', 0.8),
    ...(SUGGEST_ENABLED ? [page('/de-xuat/', 0.3)] : []),
    ...COLLECTIONS.map((c) => page(`/bo-skill/${c.slug}/`, 0.7)),
    ...SKILLS.map((s) => page(`/skills/${s.slug}/`, 0.8)),
  ];
}
