'use client';

/**
 * "Đã lưu" và "Đã xem" lưu trong localStorage của trình duyệt.
 * Mọi lần đọc/ghi đều bọc try/catch (chế độ ẩn danh, bị chặn cookie…): lỗi thì coi như rỗng.
 * Chỉ đọc sau khi mount (useEffect) để HTML render sẵn và lần render đầu ở client giống nhau.
 */
import { useCallback, useEffect, useState } from 'react';

const KEYS = { saved: 'kho-skill:saved', viewed: 'kho-skill:viewed' } as const;
export type ListKind = keyof typeof KEYS;

const CHANGE_EVENT = 'kho-skill:storage';

function read(kind: ListKind): string[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(KEYS[kind]) ?? '[]');
    return Array.isArray(value) ? value.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function write(kind: ListKind, slugs: string[]) {
  try {
    window.localStorage.setItem(KEYS[kind], JSON.stringify(slugs));
  } catch {
    // Không ghi được thì thôi: trạng thái vẫn đúng trong phiên hiện tại.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Tập slug đã lưu / đã xem. `ready` = đã đọc xong localStorage (false ở lần render đầu). */
export function useSlugSet(kind: ListKind) {
  const [slugs, setSlugs] = useState<Set<string>>(() => new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setSlugs(new Set(read(kind)));
    sync();
    setReady(true);
    // Đồng bộ giữa các component trên cùng trang và giữa các tab.
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [kind]);

  const toggle = useCallback(
    (slug: string) => {
      const next = new Set(read(kind));
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      setSlugs(next);
      write(kind, [...next]);
    },
    [kind],
  );

  return { slugs, ready, toggle };
}

export function markViewed(slug: string) {
  const viewed = read('viewed');
  if (!viewed.includes(slug)) write('viewed', [...viewed, slug]);
}
