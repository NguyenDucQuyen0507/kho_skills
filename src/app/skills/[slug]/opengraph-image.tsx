import { SKILLS, categoryOf } from '@/data/skills';
import { formatStars, isSharedRepo, starsOf } from '@/data/stars';
import { OG_SIZE, clip, ogImage } from '@/lib/og';

export const alt = 'Skill trên Kho Skill';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return SKILLS.map((s) => ({ slug: s.slug }));
}

/** Ảnh xem trước riêng cho mỗi skill: tên, mô tả ngắn, nhóm, số sao. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = SKILLS.find((s) => s.slug === slug)!;
  const stars = starsOf(skill);
  const foot =
    skill.source === 'official'
      ? `${skill.name} · Skill chính thức của Anthropic`
      : skill.source === 'kho-skill'
        ? `${skill.name} · Kho Skill tự viết`
        : stars && !isSharedRepo(skill)
          ? `${skill.name} · ${formatStars(stars.stars)} sao GitHub`
          : skill.name;
  return ogImage({
    tag: categoryOf(skill.category).label,
    title: clip(skill.title, 60),
    text: clip(skill.summary, skill.title.length > 32 ? 95 : 140), // tên dài 2 dòng thì mô tả ngắn lại
    footLeft: clip(foot, 60),
  });
}
