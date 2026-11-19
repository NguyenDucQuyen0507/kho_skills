import Catalog from '@/components/Catalog';
import { SITE_NAME, SITE_URL } from '@/data/site';
import { JsonLd, pageMeta } from '@/lib/seo';

const DESCRIPTION =
  'Danh mục AI Skills (SKILL.md) cho Claude và các AI agent, mô tả bằng tiếng Việt, kèm cách cài và giấy phép đã kiểm tra.';

export const metadata = pageMeta({ description: DESCRIPTION, path: '/' });

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          inLanguage: 'vi',
          description: DESCRIPTION,
        }}
      />
      <Catalog />
    </>
  );
}
