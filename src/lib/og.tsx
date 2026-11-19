/**
 * Khung ảnh xem trước 1200×630 (Open Graph) khi chia sẻ link lên Facebook, Zalo, X…
 * Tạo lúc build bằng next/og. Dùng font Be Vietnam Pro (giấy phép OFL, src/assets/fonts) để hiện đủ chữ có dấu.
 * Màu lấy đúng giá trị các biến trong globals.css (--bg, --ink, --muted, --line, --accent, --accent-soft, --accent-ink).
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

const C = { bg: '#ffffff', ink: '#0f172a', muted: '#64748b', line: '#e2e8f0', accent: '#2563eb', accentSoft: '#dbeafe', accentInk: '#1d4ed8' };

const font = (file: string) => readFileSync(path.join(process.cwd(), 'src/assets/fonts', file));

// Ký hiệu ⌘ giống icon trang (src/app/icon.svg).
const LOGO = `data:image/svg+xml;base64,${Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#2563eb"/><path d="M19 10v12a3 3 0 1 0 3-3H10a3 3 0 1 0 3 3V10a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
).toString('base64')}`;

/** Cắt chuỗi theo từ, thêm "…" nếu dài quá. */
export function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ') > max * 0.6 ? cut.lastIndexOf(' ') : max).replace(/[,.;:\s-]+$/, '')}…`;
}

export function ogImage({ tag, title, text, footLeft }: { tag: string; title: string; text: string; footLeft: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: C.bg,
          padding: '64px 72px',
          fontFamily: 'Be Vietnam Pro',
          borderTop: `14px solid ${C.accent}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} width={60} height={60} alt="" />
            <span style={{ fontSize: 36, fontWeight: 700, color: C.ink }}>Kho Skill</span>
          </div>
          <span
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: C.accentInk,
              background: C.accentSoft,
              padding: '10px 24px',
              borderRadius: 999,
            }}
          >
            {tag}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', gap: 24 }}>
          <div style={{ fontSize: title.length > 24 ? 60 : 72, fontWeight: 700, color: C.ink, lineHeight: 1.15 }}>{title}</div>
          <div style={{ fontSize: 32, fontWeight: 500, color: C.muted, lineHeight: 1.4 }}>{text}</div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `2px solid ${C.line}`,
            paddingTop: 28,
            fontSize: 28,
            fontWeight: 500,
          }}
        >
          <span style={{ color: C.muted }}>{footLeft}</span>
          <span style={{ color: C.accent, fontWeight: 700 }}>kho-skills.vercel.app</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Be Vietnam Pro', data: font('BeVietnamPro-Medium.ttf'), weight: 500, style: 'normal' },
        { name: 'Be Vietnam Pro', data: font('BeVietnamPro-Bold.ttf'), weight: 700, style: 'normal' },
      ],
    },
  );
}
