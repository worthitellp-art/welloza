import type { Metadata } from "next";
import Image from "next/image";
import { TileForm } from "@/components/TileForm";
import { SignOut } from "@/components/SignOut";
import { deleteTile, setTileHidden } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { categories } from "@/lib/data";
import { catalogueTiles, hiddenIds, uploadedTiles } from "@/lib/tiles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin | Werroza Ceramic", robots: { index: false, follow: false } };

export default async function AdminPage() {
  await requireAdmin();
  const [uploaded, hidden] = await Promise.all([uploadedTiles(), hiddenIds()]);
  const collections = Object.entries(Object.groupBy(catalogueTiles, (t) => t.collection));

  return (
    <main className="admin">
      <div className="admin-top">
        <h1>Tile admin</h1>
        <SignOut />
      </div>

      <section aria-labelledby="add-title">
        <h2 id="add-title">Upload a new tile</h2>
        <TileForm />
      </section>

      <section aria-labelledby="uploaded-title">
        <h2 id="uploaded-title">Your uploads ({uploaded.length})</h2>
        {uploaded.length === 0 && <p className="admin-note">Tiles you upload will appear here.</p>}
        <ul className="admin-list">
          {uploaded.map((t) => (
            <li key={t.id}>
              <Image src={t.image} alt="" width={96} height={96} unoptimized />
              <div>
                <b>{t.name}</b>
                <span>
                  {categories[t.category]} · {t.collection} · {t.colour} · {t.finish}
                </span>
                <details>
                  <summary>Edit</summary>
                  <TileForm tile={t} />
                </details>
              </div>
              <form action={deleteTile}>
                <input type="hidden" name="id" value={t.id} />
                <button className="admin-danger" type="submit" aria-label={`Delete ${t.name}`}>
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="catalogue-title">
        <h2 id="catalogue-title">Catalogue tiles ({catalogueTiles.length})</h2>
        <p className="admin-note">Hiding a tile removes it from the website. You can show it again at any time.</p>
        {collections.map(([collection, tiles]) => (
          <details key={collection} className="admin-group">
            <summary>
              {collection} ({tiles?.length})
            </summary>
            <ul className="admin-list">
              {tiles?.map((t) => (
                <li key={t.id}>
                  <Image src={t.image} alt="" width={96} height={96} loading="lazy" unoptimized />
                  <div>
                    <b>{t.name}</b>
                    <span>{hidden.has(t.id) ? "Hidden from website" : "Visible"}</span>
                  </div>
                  <form action={setTileHidden}>
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="hide" value={hidden.has(t.id) ? "0" : "1"} />
                    <button type="submit" aria-label={`${hidden.has(t.id) ? "Show" : "Hide"} ${t.name}`}>
                      {hidden.has(t.id) ? "Show" : "Hide"}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </section>
    </main>
  );
}
