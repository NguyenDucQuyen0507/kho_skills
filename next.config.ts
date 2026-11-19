import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // Build: trang tĩnh, deploy được ở bất cứ đâu (Vercel, Netlify, GitHub Pages).
  // Dev: không bật 'export' để API của tab "Duyệt" ghi được file trên máy.
  output: isDev ? undefined : 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // File *.dev.tsx / *.dev.ts (tab "Duyệt" ở /duyet và API của nó) chỉ là trang khi chạy `npm run dev`.
  // Khi build chúng bị bỏ qua, nên công cụ quản trị không lọt vào trang tĩnh deploy lên mạng.
  pageExtensions: isDev ? ['dev.tsx', 'dev.ts', 'tsx', 'ts', 'jsx', 'js'] : ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;
