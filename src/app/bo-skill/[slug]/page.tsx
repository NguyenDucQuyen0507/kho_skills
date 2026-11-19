import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SkillList from '@/components/SkillRow';
import { COLLECTIONS, skillsOf } from '@/data/collections';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = COLLECTIONS.find((x) => x.slug === slug);
  if (!c) return {};
  return { title: `Bộ skill: ${c.title}`, description: c.description };
}

export default async function CollectionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) notFound();
  const skills = skillsOf(collection);
  const others = COLLECTIONS.filter((c) => c.slug !== slug);

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Đường dẫn">
        <Link href="/">Danh mục</Link> / Bộ skill theo dự án
      </nav>

      <header className="collection-head">
        <span className="eyebrow">
          {collection.emoji} Bộ skill · {skills.length} skill
        </span>
        <h1>{collection.title}</h1>
        <p className="lead">{collection.description}</p>
      </header>

      <SkillList skills={skills} />

      <section className="collections" aria-labelledby="bo-khac">
        <h2 id="bo-khac">Bộ khác</h2>
        <div className="chips" style={{ flexWrap: 'wrap' }}>
          {others.map((c) => (
            <Link key={c.slug} href={`/bo-skill/${c.slug}/`} className="chip" style={{ textDecoration: 'none' }}>
              {c.emoji} {c.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
