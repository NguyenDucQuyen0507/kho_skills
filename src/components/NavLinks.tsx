'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Mục menu nào thuộc trang hiện tại. Trang chi tiết skill và bộ skill thuộc "Danh mục". */
function isActive(href: string, path: string) {
  if (href === '/') return path === '/' || path.startsWith('/skills/') || path.startsWith('/bo-skill/');
  return path.startsWith(href);
}

export default function NavLinks({ suggest, review }: { suggest: boolean; review: boolean }) {
  const raw = usePathname() ?? '/';
  const path = raw.endsWith('/') ? raw : `${raw}/`;
  const item = (href: string, label: React.ReactNode, className?: string) => {
    const active = isActive(href, path);
    return (
      <Link href={href} className={className} aria-current={active ? 'page' : undefined}>
        {label}
      </Link>
    );
  };

  return (
    <nav className="nav" aria-label="Điều hướng chính">
      {item('/', 'Danh mục')}
      {item(
        '/goi-y/',
        <>
          <span className="nav-long">Chọn skill cho dự án</span>
          <span className="nav-short">Theo dự án</span>
        </>,
      )}
      {item('/skill-la-gi/', 'Skill là gì?')}
      {suggest && item('/de-xuat/', <>Gửi<span className="nav-cta-more"> skill</span></>, 'nav-cta')}
      {/* Tab quản trị: chỉ có khi chạy `npm run dev`, không có trên trang deploy. */}
      {review && item('/duyet/', <><span aria-hidden="true">⚙ </span>Duyệt</>, 'nav-admin')}
    </nav>
  );
}
