import type { Metadata } from 'next';
import Link from 'next/link';
import { CHECKED_AT } from '@/data/skills';
import NavLinks from '@/components/NavLinks';
import { SITE_URL, SUGGEST_ENABLED } from '@/data/site';
import { STARS_FETCHED_AT, formatDate } from '@/data/stars';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Kho Skill: danh mục AI Skills tiếng Việt',
    template: '%s · Kho Skill',
  },
  description:
    'Danh mục AI Skills (SKILL.md) cho Claude và các AI agent, mô tả bằng tiếng Việt, kèm cách cài và giấy phép đã kiểm tra.',
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="logo">
              <span className="logo-mark" aria-hidden="true">
                ⌘
              </span>
              <span className="logo-text">Kho Skill</span>
            </Link>
            <NavLinks
              suggest={SUGGEST_ENABLED}
              review={process.env.NODE_ENV === 'development' && process.env.KHO_SKILL_REVIEW !== 'off'}
            />
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="container">
            <p>
              Kho Skill chỉ dẫn link tới mã nguồn gốc trên GitHub, không lưu trữ mã nguồn của người khác. Mô tả tiếng Việt do Kho Skill
              tự viết.
            </p>
            <p>
              Dự án cộng đồng, không liên kết với Anthropic hay tác giả các skill. Thông tin kiểm tra lần cuối ngày{' '}
              {CHECKED_AT.split('-').reverse().join('/')}.
              {STARS_FETCHED_AT && ` Số sao cập nhật ngày ${formatDate(STARS_FETCHED_AT)}.`}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
