import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/site';

export const dynamic = 'force-static';

/** /robots.txt: cho mọi công cụ tìm kiếm vào và chỉ đường tới sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
