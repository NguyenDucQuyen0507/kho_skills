'use client';

import { useEffect } from 'react';
import { markViewed, useSlugSet } from '@/lib/storage';

/** Nút "♡ Lưu" / "♥ Đã lưu" dùng chung cho danh sách và trang chi tiết. */
export function SaveButton({
  slug,
  saved,
  onToggle,
  className = '',
}: {
  slug: string;
  saved: boolean;
  onToggle: (slug: string) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`btn ghost save-btn ${saved ? 'is-saved' : ''} ${className}`}
      aria-pressed={saved}
      onClick={() => onToggle(slug)}
    >
      {saved ? '♥ Đã lưu' : '♡ Lưu'}
    </button>
  );
}

/** Trang chi tiết: nút lưu tự quản lý trạng thái, đồng thời đánh dấu skill là "đã xem". */
export default function DetailSaveButton({ slug }: { slug: string }) {
  const { slugs, toggle } = useSlugSet('saved');
  useEffect(() => markViewed(slug), [slug]);
  return <SaveButton slug={slug} saved={slugs.has(slug)} onToggle={toggle} />;
}
