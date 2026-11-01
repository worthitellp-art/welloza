"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { colours, type Category } from "@/lib/data";

export type TileCard = {
  id: string;
  name: string;
  category: Category;
  collection: string;
  colour: string;
  finish: string;
  image: string;
};

const PAGE_SIZE = 24;
const none = { query: "", collection: "", colour: "", finish: "" };

function Select({ label, children, ...rest }: { label: string } & React.ComponentProps<"select">) {
  return (
    <div className="field">
      <label htmlFor={rest.id}>{label}</label>
      <select {...rest}>{children}</select>
    </div>
  );
}

export function TileBrowser({ tiles }: { tiles: TileCard[] }) {
  const [f, setF] = useState(none);
  const [page, setPage] = useState(1);

  const collections = useMemo(() => [...new Set(tiles.map((t) => t.collection))].sort(), [tiles]);
  const finishes = useMemo(() => [...new Set(tiles.map((t) => t.finish))].sort(), [tiles]);

  const q = useDeferredValue(f.query).trim().toLowerCase();
  const shown = tiles.filter(
    (t) =>
      (!q || t.name.toLowerCase().includes(q)) &&
      (!f.collection || t.collection === f.collection) &&
      (!f.colour || t.colour === f.colour) &&
      (!f.finish || t.finish === f.finish),
  );

  const totalPages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const update = (changes: Partial<typeof none>) => {
    setF((prev) => ({ ...prev, ...changes }));
    setPage(1);
  };
  const reset = () => update(none);
  const goTo = (next: number) => {
    setPage(next);
    document.getElementById("tile-results")?.scrollIntoView();
  };

  return (
    <div className="listing">
      <aside className="filters" aria-label="Filters">
        <div className="filters-header">
          <h2>Filters</h2>
          {(f.query || f.collection || f.colour || f.finish) && (
            <button type="button" className="clear-text" onClick={reset}>
              Reset
            </button>
          )}
        </div>
        <div className="field">
          <label htmlFor="design-search">Search</label>
          <input
            id="design-search"
            type="search"
            placeholder="Search tile by name..."
            value={f.query}
            maxLength={60}
            onChange={(e) => update({ query: e.target.value })}
          />
        </div>
        <Select id="f-collection" label="Collection" value={f.collection} onChange={(e) => update({ collection: e.target.value })}>
          <option value="">All Collections</option>
          {collections.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
        <Select id="f-colour" label="Colour" value={f.colour} onChange={(e) => update({ colour: e.target.value })}>
          <option value="">All Colours</option>
          {colours.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
        <Select id="f-finish" label="Finish" value={f.finish} onChange={(e) => update({ finish: e.target.value })}>
          <option value="">All Finishes</option>
          {finishes.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </aside>

      <div className="results" id="tile-results">
        <div className="results-header">
          <p className="count" role="status">
            {shown.length === 0 ? (
              "No tiles found"
            ) : (
              <>
                Showing <b>{start + 1}–{Math.min(start + PAGE_SIZE, shown.length)}</b> of <b>{shown.length}</b> tiles
              </>
            )}
          </p>
        </div>

        {shown.length === 0 ? (
          <div className="empty">
            <p>No tiles match these filters.</p>
            <button type="button" className="btn light" onClick={reset}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="cards">
            {shown.slice(start, start + PAGE_SIZE).map((t) => (
              <figure className="card" key={t.id}>
                <Link href={`/tiles/${t.category}/${t.id}`} prefetch={false} aria-label={`${t.name}, ${t.collection} collection`}>
                  <Image
                    src={t.image}
                    alt=""
                    width={480}
                    height={480}
                    sizes="(min-width: 1280px) 20vw, (min-width: 900px) 25vw, 50vw"
                    unoptimized
                  />
                </Link>
                <figcaption>
                  <b>{t.name}</b>
                  <span>
                    {t.collection} | {t.finish}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="pagination-wrap" aria-label="Pagination">
            <div className="page-info">
              Page <b>{current}</b> of <b>{totalPages}</b>
            </div>
            <div className="page-btns">
              <button type="button" className="page-btn nav-btn" disabled={current <= 1} onClick={() => goTo(current - 1)}>
                &larr; Prev
              </button>
              <button type="button" className="page-btn nav-btn" disabled={current >= totalPages} onClick={() => goTo(current + 1)}>
                Next &rarr;
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
