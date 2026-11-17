import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow, PageHeader, Site } from "@/components/Site";
import { catalogues, pageImage } from "@/lib/catalogues";

export const metadata: Metadata = {
  title: "E-Catalogue | Werroza Ceramic",
  description: `Browse all ${catalogues.length} Werroza Ceramic tile catalogues online, page by page, or download the full PDF.`,
};

export default function ECataloguePage() {
  return (
    <Site>
      <PageHeader title="E-Catalogue" />
      <section className="sec ecat" aria-labelledby="ecat-title">
        <div className="sec-head center">
          <p className="sub-title" data-anim="up" data-delay=".3">
            Explore Our Collection
          </p>
          <h2 id="ecat-title" className="title-highlight">
            Browse Our <br />
            Catalogue
          </h2>
        </div>
        <ul className="ecat-grid">
          {catalogues.map((c, i) => (
            <li key={c.slug} data-anim="up" data-delay={0.1 + (i % 3) * 0.1}>
              <Link href={`/collections/${c.slug}`}>
                <Image
                  src={pageImage(c.slug, 1)}
                  alt=""
                  width={c.width}
                  height={c.height}
                  sizes="(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw"
                  priority={i < 3}
                  unoptimized
                />
                <b>{c.title}</b>
                <span>Werroza Ceramic &middot; {c.pages} pages</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="center" data-anim="up">
          <a className="btn" href="/welloza-catalogue.pdf" target="_blank" rel="noopener">
            <span className="btn-text">
              <span>Download PDF (24 MB)</span>
            </span>
            <span className="btn-icon">
              <Arrow />
            </span>
          </a>
        </p>
      </section>
    </Site>
  );
}
