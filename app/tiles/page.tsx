import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Site } from "@/components/Site";
import { TileBrowser } from "@/components/TileBrowser";
import { categories } from "@/lib/data";
import { toCard, visibleTiles } from "@/lib/tiles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Tiles | Werroza Ceramic",
  description: "Browse every Werroza Ceramic tile by collection, colour and finish.",
};

export default async function AllTilesPage() {
  const tiles = await visibleTiles();
  return (
    <Site>
      <PageHeader title="All Tiles" />
      <div className="collection-page">
        <nav className="category-tabs" aria-label="Categories">
          {Object.entries(categories).map(([value, label]) => (
            <Link key={value} href={`/tiles/${value}`}>
              {label}
            </Link>
          ))}
        </nav>
        <TileBrowser tiles={tiles.map(toCard)} />
      </div>
    </Site>
  );
}
