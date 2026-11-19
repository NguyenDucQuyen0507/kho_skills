/**
 * Repo GitHub của chính Kho Skill, dạng "owner/name" (ví dụ "ten-ban/kho-skill").
 * Nút "Gửi skill" mở trang tạo GitHub Issue điền sẵn nội dung trên repo này.
 *
 * Để trống thì trang /de-xuat/ và các nút dẫn tới nó chỉ hiện khi chạy `npm run dev`
 * (để xem thử), bản deploy sẽ ẩn hẳn cho tới khi điền repo.
 */
export const SITE_REPO = '';

export const SUGGEST_ENABLED = SITE_REPO !== '' || process.env.NODE_ENV === 'development';
