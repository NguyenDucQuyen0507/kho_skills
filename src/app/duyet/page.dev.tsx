/** Tab "Duyệt": chỉ là trang khi chạy `npm run dev` (xem pageExtensions trong next.config.ts). */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { reviewEnabled } from '@/app/api/duyet/guard';
import ReviewBoard from '@/components/ReviewBoard';

export const metadata: Metadata = {
  title: 'Duyệt skill mới',
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  // `npm run dev:lan` (mở cho điện thoại trong mạng) tắt hẳn tab này.
  if (!reviewEnabled()) notFound();
  return <ReviewBoard />;
}
