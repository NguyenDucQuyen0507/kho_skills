/**
 * /og.png: ảnh xem trước chung khi chia sẻ link (trang không có ảnh riêng).
 * Dùng route có đuôi .png thay cho file opengraph-image: trang bật trailingSlash nên địa chỉ không đuôi
 * bị chuyển hướng sang ".../" và Vercel trả về sai loại file, Facebook/Zalo có thể không hiện ảnh.
 */
import { SKILLS } from '@/data/skills';
import { ogImage } from '@/lib/og';

export const dynamic = 'force-static';

export function GET() {
  return ogImage({
    tag: `${SKILLS.length} skill`,
    title: 'Danh mục AI Skills tiếng Việt',
    text: 'Skill cho Claude và các AI agent: mô tả tiếng Việt, lệnh cài, giấy phép đã kiểm tra. Mô tả dự án để được gợi ý skill phù hợp.',
    footLeft: 'Miễn phí · Số sao cập nhật hằng tuần',
  });
}
