import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, Site } from "@/components/Site";
import { TileBrowser } from "@/components/TileBrowser";
import { categories, isCategory } from "@/lib/data";
import { toCard, visibleTiles } from "@/lib/tiles";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};
  return {
    title: `${categories[category]} Tiles | Werroza Ceramic`,
    description: `Browse Werroza Ceramic ${categories[category]} tiles by collection, colour and finish.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  const tiles = (await visibleTiles()).filter((t) => t.category === category);

  return (
    <Site>
      <PageHeader title={categories[category]} trail={[{ label: "All Tiles", href: "/tiles" }]} />
      <div className="collection-page">
        <nav className="category-tabs" aria-label="Categories">
          {Object.entries(categories).map(([value, label]) => (
            <Link key={value} href={`/tiles/${value}`} aria-current={value === category ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <TileBrowser tiles={tiles.map(toCard)} />
      </div>
    </Site>
  );
}
