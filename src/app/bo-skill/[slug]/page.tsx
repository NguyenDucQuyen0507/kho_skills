import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SkillList from '@/components/SkillRow';
import { COLLECTIONS, skillsOf } from '@/data/collections';
import { JsonLd, absUrl, breadcrumb, pageMeta } from '@/lib/seo';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = COLLECTIONS.find((x) => x.slug === slug);
  if (!c) return {};
  return pageMeta({ title: `Bộ skill: ${c.title}`, description: c.description, path: `/bo-skill/${c.slug}/` });
}

export default async function CollectionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) notFound();
  const skills = skillsOf(collection);
  const others = COLLECTIONS.filter((c) => c.slug !== slug);

  const jsonLd = [
    breadcrumb([
      { name: 'Danh mục', path: '/' },
      { name: `Bộ skill: ${collection.title}`, path: `/bo-skill/${collection.slug}/` },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Bộ skill: ${collection.title}`,
      description: collection.description,
      itemListElement: skills.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: s.title,
        url: absUrl(`/skills/${s.slug}/`),
      })),
    },
  ];

  return (
    <div className="container">
      <JsonLd data={jsonLd} />
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
