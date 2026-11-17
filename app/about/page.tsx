import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow, Icon, PageHeader, Site } from "@/components/Site";
import { catalogues, pageImage } from "@/lib/catalogues";
import { applications, categories, slug } from "@/lib/data";
import { catalogueTiles } from "@/lib/tiles";

export const metadata: Metadata = {
  title: "About Us | Werroza Ceramic",
  description:
    "Werroza Ceramic makes 600 × 1200 mm marble, glossy, decor and fullbody tiles in Morbi, Gujarat, for homes, showrooms and commercial spaces.",
};

const marquee: [string, string][] = [
  ["Design Excellence", "Onyx Natural"],
  ["Marble Elegance", "Lasa Bianco"],
  ["Glossy Brilliance", "Opal Cloud"],
  ["Modern Craftsmanship", "Leaves Brown"],
  ["Premium Excellence", "Massina Elite"],
];

const services = [
  ...Object.entries(categories).map(([value, label]) => ({ label, href: `/tiles/${value}` })),
  { label: "Complete E-Catalogues", href: "/e-catalogue" },
];

const fmt = new Intl.NumberFormat("en-IN");

export default function AboutPage() {
  const designs = catalogueTiles.length;
  const pages = catalogues.reduce((n, c) => n + c.pages, 0);

  return (
    <Site>
      <PageHeader title="About Us" />

      <section className="sec intro-about" aria-labelledby="purpose-title">
        <div className="wrap intro-about-grid">
          <div className="intro-about-side">
            <p className="sub-title" data-anim="up" data-delay=".3">
              Purpose Driven Craftsmanship
            </p>
            <div className="intro-about-img parallax" data-anim="left" data-delay=".3">
              <Image src={pageImage("glossy-1", 7)} alt="Glossy Werroza tiles in a living room" fill sizes="(min-width: 1000px) 40vw, 100vw" unoptimized data-speed="auto" />
            </div>
          </div>
          <div>
            <h2 id="purpose-title" className="title-highlight big">
              Inspired By Modern Living, We Craft Large Format Tiles That Deliver Style, Strength And Lasting Beauty.
            </h2>
            <p className="desc" data-anim="up" data-delay=".4">
              At Werroza Ceramic, every tile begins with a commitment to quality, design and everyday performance. We
              work from Morbi, the heart of India&apos;s ceramic industry, making 600 &times; 1200 mm slabs for walls and
              floors.
            </p>
            <p className="desc" data-anim="up" data-delay=".4">
              From soft marble veining to bold decor and hard-wearing fullbody surfaces, each collection is pressed,
              printed and finished for a consistent shade, a clean edge and a surface that is easy to live with.
            </p>
            <div className="funfacts" data-anim="up" data-delay=".6">
              <div>
                <p className="big">
                  <span data-count={designs}>{fmt.format(designs)}</span>+
                </p>
                <p>Tile designs across marble, glossy, decor and fullbody.</p>
              </div>
              <div>
                <p className="big">
                  <span data-count={catalogues.length}>{catalogues.length}</span>
                </p>
                <p>Complete collections, each with its own catalogue.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="marquee gx" aria-label="What we stand for">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1 || undefined}>
              {marquee.map(([text, tile]) => (
                <li key={text}>
                  <span className="marquee-text">{text}</span>
                  <Image src={`/images/designs/${slug(tile)}.jpg`} alt="" width={180} height={80} unoptimized />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      <section className="sec know gx" aria-labelledby="know-title">
        <div className="wrap">
          <div className="split-head">
            <p className="sub-title" data-anim="up" data-delay=".3">
              Get To Know Us
            </p>
            <div>
              <h2 id="know-title" className="title-highlight">
                Combining Innovation And Craftsmanship For Modern Walls And Floors
              </h2>
              <div className="know-cards">
                <div>
                  <span className="know-icon">
                    <Icon name="spark" />
                  </span>
                  <h3>Our Mission</h3>
                  <p>To make large format tiles that combine beautiful design with dependable, everyday performance.</p>
                </div>
                <div>
                  <span className="know-icon">
                    <Icon name="building" />
                  </span>
                  <h3>Our Vision</h3>
                  <p>To be a trusted name in tiles for homes, showrooms and commercial projects across India and abroad.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="know-grid">
          <div className="know-banner parallax" data-anim="up" data-delay=".2">
            <Image src={pageImage("monolux", 7)} alt="" fill sizes="(min-width: 1200px) 50vw, 100vw" unoptimized data-speed="auto" />
          </div>
          <div className="know-cells">
            <div className="count-card" data-anim="up" data-delay=".3">
              <p className="count-title">Design Library</p>
              <p className="steps">01.</p>
              <p className="big">
                <span data-count={designs}>{fmt.format(designs)}</span>+
              </p>
              <p>Tile designs you can browse and filter online.</p>
            </div>
            <div className="img-card" data-anim="up" data-delay=".4">
              <Image src={pageImage("bookmatch", 7)} alt="" fill sizes="(min-width: 1200px) 25vw, 100vw" unoptimized />
            </div>
            <div className="blue-card" data-anim="up" data-delay=".5">
              <p>Premium tiles for modern walls and floors</p>
              <a className="text-btn light" href="#contact">
                <span>Contact us</span>
                <span className="btn-icon">
                  <Arrow />
                </span>
              </a>
            </div>
            <div className="count-card" data-anim="up" data-delay=".6">
              <p className="count-title">Catalogue Pages</p>
              <p className="steps">02.</p>
              <p className="big">
                <span data-count={pages}>{fmt.format(pages)}</span>
              </p>
              <p>Pages of tiles and room views across every collection.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec services" aria-labelledby="services-title">
        <div className="wrap">
          <div className="split-head">
            <p className="sub-title" data-anim="up" data-delay=".3">
              What We Offer
            </p>
            <h2 id="services-title" className="text-anim">
              Tiles For Every Room, Wall And Floor
            </h2>
          </div>
          <div className="services-grid">
            <div data-pin>
              <p className="desc">
                Werroza tiles are made for homes, showrooms and busy commercial spaces, with large formats that mean
                fewer joints and a cleaner, more open look.
              </p>
              <Link className="btn" href="/tiles" data-anim="up" data-delay=".3">
                <span className="btn-text">
                  <span>Explore More</span>
                </span>
                <span className="btn-icon">
                  <Arrow />
                </span>
              </Link>
            </div>
            <ul className="service-list">
              {services.map((s, i) => (
                <li key={s.href} data-anim="up" data-delay=".3">
                  <span className="service-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>
                    <Link href={s.href}>{s.label}</Link>
                  </h3>
                  <span className="icon-btn ghost" aria-hidden="true">
                    <Arrow />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="clients" aria-labelledby="clients-title" data-anim="up" data-delay=".4">
        <h2 id="clients-title">Made For Every Kind Of Space</h2>
        <ul>
          {applications.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>
    </Site>
  );
}
