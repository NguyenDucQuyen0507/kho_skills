/**
 * Repo GitHub của chính Kho Skill, dạng "owner/name" (ví dụ "ten-ban/kho-skill").
 * Nút "Gửi skill" mở trang tạo GitHub Issue điền sẵn nội dung trên repo này.
 *
 * Để trống thì trang /de-xuat/ và các nút dẫn tới nó chỉ hiện khi chạy `npm run dev`
 * (để xem thử), bản deploy sẽ ẩn hẳn cho tới khi điền repo.
 */
export const SITE_REPO: string = 'NguyenDucQuyen0507/kho_skills';

export const SUGGEST_ENABLED = SITE_REPO !== '' || process.env.NODE_ENV === 'development';

/** Địa chỉ chính của trang (không có "/" ở cuối). Đổi tên miền thì chỉ cần sửa dòng này. */
export const SITE_URL = 'https://kho-skills.vercel.app';
export const SITE_NAME = 'Kho Skill';
