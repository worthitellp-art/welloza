import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { z } from "zod";
import type { TileCard } from "@/components/TileBrowser";
import { categories, colours, designs, slug, withScene, type Category } from "@/lib/data";
import staticTiles from "@/lib/tiles.json";

export type Tile = {
  catalogue?: string;
  id: string;
  name: string;
  category: Category;
  collection: string;
  colour: string;
  finish: string;
  image: string;
  room: string | null;
  uploaded: boolean;
};

type TileRow = {
  id: string;
  name: string;
  category: Category;
  collection: string;
  colour: string;
  finish: string;
  image_key: string;
  room_key: string | null;
};

export const tileFields = z.strictObject({
  name: z.string().trim().min(2, "Enter the tile name.").max(80),
  category: z.enum(Object.keys(categories) as [Category, ...Category[]], "Choose a category."),
  collection: z.string().trim().min(2, "Enter the collection.").max(60),
  colour: z.enum(colours, "Choose a colour."),
  finish: z.string().trim().min(2, "Enter the finish.").max(40),
});

// The 44 original Infinite designs have their own images and are not in the seed PDFs.
const originalTiles: Tile[] = designs.map((d) => ({
  id: `infinite-${slug(d.name)}`,
  name: d.name,
  category: "marble-glossy",
  collection: "Infinite",
  colour: d.colour,
  finish: "Glossy",
  image: `/images/designs/${slug(d.name)}.jpg`,
  room: withScene.has(d.name) ? `/images/scene-${slug(d.name)}.jpg` : null,
  uploaded: false,
}));

export const catalogueTiles = [...(staticTiles as Tile[]), ...originalTiles];

export const toCard = ({ id, name, category, collection, colour, finish, image }: Tile): TileCard => ({
  id, name, category, collection, colour, finish, image,
});

export async function getBindings() {
  const { env } = await getCloudflareContext({ async: true });
  return { db: env.DB, bucket: env.UPLOADS };
}

export async function uploadedTiles(): Promise<Tile[]> {
  const { db } = await getBindings();
  const { results } = await db
    .prepare(
      "SELECT id, name, category, collection, colour, finish, image_key, room_key FROM tiles ORDER BY created_at DESC LIMIT 1000",
    )
    .all<TileRow>();
  return results.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    collection: r.collection,
    colour: r.colour,
    finish: r.finish,
    image: `/uploads/${r.image_key}`,
    room: r.room_key && `/uploads/${r.room_key}`,
    uploaded: true,
  }));
}

export async function hiddenIds() {
  const { db } = await getBindings();
  const { results } = await db.prepare("SELECT id FROM hidden_tiles LIMIT 5000").all<{ id: string }>();
  return new Set(results.map((r) => r.id));
}

// Every public tile page needs this list, so it is kept briefly per Worker instead of querying D1 per request.
const CACHE_MS = 30_000;
let cached: { at: number; tiles: Tile[] } | null = null;

export function clearTileCache() {
  cached = null;
}

// A database outage must not take the catalogue down, so visitors still get the built-in tiles.
export async function visibleTiles(): Promise<Tile[]> {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.tiles;
  try {
    const [uploaded, hidden] = await Promise.all([uploadedTiles(), hiddenIds()]);
    const tiles = [...uploaded, ...catalogueTiles.filter((t) => !hidden.has(t.id))];
    cached = { at: Date.now(), tiles };
    return tiles;
  } catch (err) {
    console.error("Could not load uploaded tiles", err);
    return catalogueTiles;
  }
}
