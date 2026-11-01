import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { categories, contact, isCategory } from "@/lib/data";
import { visibleTiles } from "@/lib/tiles";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ category: string; id: string }> };

async function findTile(category: string, id: string) {
  return (await visibleTiles()).find((t) => t.id === id && t.category === category);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, id } = await params;
  const tile = await findTile(category, id);
  if (!tile) return {};
  return {
    title: `${tile.name} | ${tile.collection} | Werroza Ceramic`,
    description: `${tile.name} tile from the Werroza Ceramic ${tile.collection} collection, ${tile.finish} finish.`,
  };
}

export default async function TilePage({ params }: Props) {
  const { category, id } = await params;
  const tile = await findTile(category, id);
  if (!tile || !isCategory(category)) notFound();

  const enquiry = encodeURIComponent(`Hello Werroza Ceramic, I am interested in the ${tile.name} tile (${tile.collection}).`);

  return (
    <>
      <Header />
      <main className="collection-page tile-detail">
        <Link className="collection-back" href={`/tiles/${category}`}>
          &larr; {categories[category]}
        </Link>
        <div className="tile-detail-grid">
          <Image src={tile.image} alt={`${tile.name} tile`} width={1000} height={1000} sizes="(min-width: 900px) 40vw, 100vw" priority unoptimized />
          <div>
            <h1>{tile.name}</h1>
            <dl>
              <dt>Collection</dt>
              <dd>{tile.collection}</dd>
              <dt>Finish</dt>
              <dd>{tile.finish}</dd>
              <dt>Colour</dt>
              <dd>{tile.colour}</dd>
            </dl>
            <a className="btn" href={`https://wa.me/${contact.phones[0].wa}?text=${enquiry}`} target="_blank" rel="noopener noreferrer">
              Enquire on WhatsApp
            </a>
            {tile.catalogue && (
              <p>
                <Link href={`/collections/${tile.catalogue}`}>View full catalogue</Link>
              </p>
            )}
          </div>
        </div>
        {tile.room && (
          <section aria-label="Room view">
            <h2>Room view</h2>
            <Image src={tile.room} alt={`${tile.name} tile in a room`} width={1600} height={1132} sizes="100vw" unoptimized />
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
