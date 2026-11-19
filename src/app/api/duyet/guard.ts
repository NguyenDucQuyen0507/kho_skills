/**
 * Bảo vệ API của tab "Duyệt" (chỉ có khi `npm run dev`).
 *
 * Giới hạn "chỉ máy này" nằm ở mạng: `npm run dev` chỉ nghe ở 127.0.0.1, máy khác trong mạng không vào được.
 * (Không kiểm tra IP qua x-forwarded-for: next dev giữ nguyên giá trị máy gửi tự khai, nên giả được.)
 * `npm run dev:lan` mở cho mạng LAN để thử trên điện thoại, khi đó tab Duyệt bị tắt hẳn.
 *
 * Ở đây chặn thêm trang web khác đang mở trong trình duyệt gửi yêu cầu hộ (CSRF):
 * yêu cầu ghi phải đến từ chính trang /duyet (Origin trùng host) và ở dạng JSON.
 */
export const reviewEnabled = () => process.env.KHO_SKILL_REVIEW !== 'off';

export function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

/** Trả về Response lỗi nếu tab Duyệt đang tắt, hoặc null nếu được phép. */
export function rejectIfDisabled(): Response | null {
  return reviewEnabled() ? null : json({ error: 'Tab Duyệt đang tắt (npm run dev:lan). Chạy npm run dev để duyệt.' }, 403);
}

export function rejectUnsafeWrite(req: Request): Response | null {
  const disabled = rejectIfDisabled();
  if (disabled) return disabled;
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  let originHost = '';
  try {
    originHost = origin ? new URL(origin).host : '';
  } catch {
    // Origin hỏng: coi như không hợp lệ.
  }
  if (!originHost || originHost !== host) return json({ error: 'Origin không hợp lệ' }, 403);
  if (!(req.headers.get('content-type') ?? '').startsWith('application/json')) {
    return json({ error: 'Cần Content-Type: application/json' }, 415);
  }
  return null;
}
