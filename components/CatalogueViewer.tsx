"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { pageImage, type Catalogue } from "@/lib/catalogues";

export function CatalogueViewer({ catalogue }: { catalogue: Catalogue }) {
  const { slug, title, pages, width, height } = catalogue;
  const dialog = useRef<HTMLDialogElement>(null);
  const [page, setPage] = useState(1);

  const go = (next: number) => setPage(Math.min(pages, Math.max(1, next)));

  return (
    <>
      <ul className="pages">
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <li key={p}>
            <button
              type="button"
              aria-label={`Open page ${p} of ${pages}`}
              onClick={() => {
                setPage(p);
                dialog.current?.showModal();
              }}
            >
              <Image
                src={pageImage(slug, p, true)}
                alt={`${title}, page ${p}`}
                width={width}
                height={height}
                sizes="(min-width: 1100px) 25vw, (min-width: 700px) 33vw, 50vw"
                unoptimized
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        className="viewer"
        ref={dialog}
        aria-label={`${title} page viewer`}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(page - 1);
          if (e.key === "ArrowRight") go(page + 1);
        }}
      >
        <div className="viewer-bar">
          <span role="status">
            Page {page} of {pages}
          </span>
          <button type="button" onClick={() => go(page - 1)} disabled={page <= 1}>
            &larr; Prev
          </button>
          <button type="button" onClick={() => go(page + 1)} disabled={page >= pages}>
            Next &rarr;
          </button>
          <button type="button" onClick={() => dialog.current?.close()}>
            Close
          </button>
        </div>
        <Image
          key={page}
          src={pageImage(slug, page)}
          alt={`${title}, page ${page}`}
          width={width}
          height={height}
          sizes="100vw"
          unoptimized
        />
      </dialog>
    </>
  );
}
