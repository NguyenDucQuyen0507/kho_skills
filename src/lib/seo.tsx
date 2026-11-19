/**
 * SEO dùng chung: metadata từng trang (canonical, Open Graph) và dữ liệu có cấu trúc JSON-LD.
 * Ảnh xem trước do các route og.png tạo lúc build.
 */
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/data/site';

/**
 * Metadata cho một trang. Next.js không gộp openGraph của layout với của trang (trang ghi đè hết),
 * nên mỗi trang tự khai báo đủ ở đây. `path` là đường dẫn có "/" ở cuối, ví dụ "/goi-y/".
 */
export function pageMeta({
  title,
  description,
  path,
  image = '/og.png',
}: {
  title?: string;
  description: string;
  path: string;
  /** Ảnh xem trước; mặc định là ảnh chung (src/app/og.png/route.tsx). */
  image?: string;
}): Metadata {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME}: danh mục AI Skills tiếng Việt`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'vi_VN',
      title: fullTitle,
      description,
      url: path,
      images: [{ url: image, width: 1200, height: 630, alt: `${SITE_NAME}: danh mục AI Skills tiếng Việt` }],
    },
  };
}

export const absUrl = (path: string) => `${SITE_URL}${path}`;

/** Thẻ <script type="application/ld+json">. Thay "<" để chuỗi trong dữ liệu không đóng được thẻ script. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
  );
}

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absUrl(it.path) })),
  };
}
