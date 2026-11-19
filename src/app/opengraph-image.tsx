import { SKILLS } from '@/data/skills';
import { OG_SIZE, ogImage } from '@/lib/og';

export const dynamic = 'force-static';
export const alt = 'Kho Skill: danh mục AI Skills tiếng Việt';
export const size = OG_SIZE;
export const contentType = 'image/png';

/** Ảnh xem trước chung, dùng cho mọi trang không có ảnh riêng. */
export default function Image() {
  return ogImage({
    tag: `${SKILLS.length} skill`,
    title: 'Danh mục AI Skills tiếng Việt',
    text: 'Skill cho Claude và các AI agent: mô tả tiếng Việt, lệnh cài, giấy phép đã kiểm tra. Mô tả dự án để được gợi ý skill phù hợp.',
    footLeft: 'Miễn phí · Số sao cập nhật hằng tuần',
  });
}
