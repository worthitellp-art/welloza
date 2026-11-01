import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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
    <>
      <Header />
      <main className="collection-page">
        <Link className="collection-back" href="/tiles">
          &larr; All tiles
        </Link>
        <h1>{categories[category]}</h1>
        <TileBrowser tiles={tiles.map(toCard)} />
      </main>
      <Footer />
    </>
  );
}
