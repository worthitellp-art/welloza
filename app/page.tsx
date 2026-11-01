import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { catalogues, pageImage } from "@/lib/catalogues";
import { categories, contact, type Category } from "@/lib/data";
import { catalogueTiles } from "@/lib/tiles";

export default function Home() {
  const waUrl = (number: string) =>
    `https://wa.me/${number.replace(/[^0-9]/g, "")}?text=Hello%20Werroza%20Ceramic%2C%20I%20am%20interested%20in%20your%20600x1200%20mm%20tiles%20collection.`;

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />

      <main id="main" suppressHydrationWarning>
        <Hero />

        <section className="collections-sec" id="designs" aria-labelledby="categories-title">
          <h2 id="categories-title">Shop by Category</h2>
          <p>
            {catalogueTiles.length.toLocaleString("en-IN")} tile designs. <Link href="/tiles">Browse all tiles</Link>
          </p>
          <div className="category-cards">
            {(Object.entries(categories) as [Category, string][]).map(([value, label]) => {
              const tiles = catalogueTiles.filter((t) => t.category === value);
              return (
                <Link className="category-card" href={`/tiles/${value}`} key={value}>
                  <Image src={tiles[0].image} alt="" width={480} height={480} sizes="(min-width: 700px) 33vw, 100vw" unoptimized />
                  <b>{label}</b>
                  <span>{tiles.length.toLocaleString("en-IN")} tiles</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="collections-sec" id="collections" aria-labelledby="collections-title">
          <h2 id="collections-title">Full Catalogues</h2>
          <p>
            {catalogues.length} complete catalogues with {catalogues.reduce((n, c) => n + c.pages, 0).toLocaleString("en-IN")} pages of tiles and room views.
          </p>
          <div className="collections">
            {catalogues.map((c) => (
              <Link className="collection" href={`/collections/${c.slug}`} key={c.slug}>
                <Image
                  src={pageImage(c.slug, 1, true)}
                  alt=""
                  width={c.width}
                  height={c.height}
                  sizes="(min-width: 1100px) 25vw, (min-width: 700px) 33vw, 50vw"
                  unoptimized
                />
                <b>{c.title}</b>
                <span>{c.pages} pages</span>
              </Link>
            ))}
          </div>
        </section>

      </main>

      {/* Modern Responsive Luxury Architectural Footer */}
      <Footer />

      {/* Floating 1-Click WhatsApp Quick Action */}
      <a
        className="float-wa"
        href={waUrl(contact.phone)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Chat with Werroza Ceramic"
        title="Chat with Werroza Ceramic on WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.979-.276-.1-.476-.15-.676.15-.2.301-.777.979-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.799-1.5-1.787-1.675-2.088-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.175.201-.301.301-.501.101-.2.05-.376-.025-.526-.075-.15-.676-1.63-.927-2.232-.244-.587-.492-.507-.676-.516l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.229 3.11.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.38.197 1.899.12.579-.087 1.78-.727 2.031-1.43.251-.702.251-1.304.175-1.43-.075-.125-.276-.201-.577-.351zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.94.55 3.75 1.51 5.29L2 22l4.83-1.5c1.48.88 3.2 1.38 5.21 1.38 5.53 0 10.02-4.49 10.02-10.02C22.06 6.49 17.57 2 12.04 2z" />
        </svg>
      </a>

      <a className="totop" href="#top" aria-label="Back to top">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20V4M5 11l7-7 7 7" />
        </svg>
      </a>
    </>
  );
}
