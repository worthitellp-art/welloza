import Image from "next/image";
import Link from "next/link";
import { Arrow, Icon, Site } from "@/components/Site";
import { catalogues, pageImage } from "@/lib/catalogues";
import { categories, features, slug, trustPoints, type Category } from "@/lib/data";
import { catalogueTiles } from "@/lib/tiles";

const room = (catalogue: string, page: number) => pageImage(catalogue, page);

const heroSlides = [room("rock-aura", 11), room("glossy-1", 7), room("bookmatch", 4), room("monolux", 7)];

const categoryImages: Record<Category, string> = {
  "marble-glossy": room("pearl", 7),
  "decor-feature": room("three-d", 11),
  "fullbody-natural": room("travertino", 7),
};

const featured = ["infinite-1", "three-d", "travertino"].flatMap((s) => catalogues.filter((c) => c.slug === s));
const featureList = features.filter(([name]) => ["spark", "sun", "grip", "flask", "umbrella", "shield", "heat", "frost"].includes(name));
const slabs = ["Massina Elite", "Melvin Panda", "Lasa Brown"];
const swatches = ["Onyx Natural", "Leaves Blue", "Marbo Mix", "Opal Cloud"];
const fmt = new Intl.NumberFormat("en-IN");

function CircleLink({ href, text, label, className = "" }: { href: string; text: string; label: string; className?: string }) {
  return (
    <Link className={`circle-link ${className}`} href={href} aria-label={label}>
      <svg className="circle-text" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path id={`c-${slug(label)}`} d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
        </defs>
        <text>
          <textPath href={`#c-${slug(label)}`} textLength="488">
            {text}
          </textPath>
        </text>
      </svg>
      <Arrow />
    </Link>
  );
}

export default function Home() {
  const designs = catalogueTiles.length;

  return (
    <>
      <div className="intro" aria-hidden="true">
        <div className="intro-mark">
          <svg className="intro-word" viewBox="0 0 520 110">
            <text x="50%" y="92" textAnchor="middle">
              WERROZA
            </text>
          </svg>
          <span className="intro-script">Exquisite Tiles</span>
          <span className="intro-rule" />
        </div>
      </div>

      <Site>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-slides" aria-hidden="true">
            {heroSlides.map((src, i) => (
              <Image key={src} src={src} alt="" fill sizes="100vw" priority={i === 0} unoptimized />
            ))}
          </div>
          <h1 id="hero-title" className="hero-title text-anim" data-delay="2.4">
            Exquisite
            <br />
            Surfaces
          </h1>
        </section>

        <section className="sec about-home" aria-labelledby="about-title">
          <div className="wrap">
            <div className="split-head">
              <p className="sub-title" data-anim="up" data-delay=".3">
                About Werroza
              </p>
              <h2 id="about-title" className="title-highlight">
                Crafting Large Format Tiles In Morbi For Walls And Floors That Make Every Space Feel Complete
              </h2>
            </div>
            <div className="about-row">
              <div className="about-disc" data-anim="zoom">
                <Image src="/images/about.jpg" alt="Werroza Ceramic tiles laid in a living space" width={496} height={496} unoptimized />
              </div>
              <div className="about-items">
                <div className="about-counter">
                  <p className="big">
                    <span data-count={designs}>{fmt.format(designs)}</span>
                    <sup>+</sup>
                  </p>
                  <p>Tile designs across {catalogues.length} collections</p>
                </div>
                <div className="about-desc">
                  <p>
                    At Werroza Ceramic we bring design, technology and Morbi&apos;s tile-making craft together. Every
                    600 &times; 1200 mm slab is pressed, printed and polished for consistent shade, sharp detail and a
                    finish that lasts in homes, showrooms and commercial spaces.
                  </p>
                  <Link className="btn" href="/about" data-anim="up" data-delay=".6">
                    <span className="btn-text">
                      <span>Learn More</span>
                    </span>
                    <span className="btn-icon">
                      <Arrow />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="choose gx" aria-labelledby="choose-title">
          <div className="choose-img" data-anim="left-big" data-delay=".3">
            <Image src={room("bookmatch", 7)} alt="" fill sizes="(min-width: 1000px) 50vw, 100vw" unoptimized data-speed="auto" />
          </div>
          <div className="choose-body">
            <p className="sub-title" data-anim="up" data-delay=".3">
              Why Werroza
            </p>
            <h2 id="choose-title" className="title-highlight">
              Smart Engineering For Modern Walls And Floors
            </h2>
            <ul className="choose-list">
              {trustPoints.map(([icon, title, text], i) => (
                <li key={title} data-anim="up" data-delay={0.3 + i * 0.1}>
                  <span className="choose-icon">
                    <Icon name={icon} />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec projects" aria-labelledby="projects-title">
          <div className="sec-head center">
            <p className="sub-title" data-anim="up" data-delay=".3">
              Tile Solutions
            </p>
            <h2 id="projects-title" className="title-highlight">
              Precision Crafted Designs <br />
              That Redefine Modern Spaces
            </h2>
          </div>
          <div className="project-grid">
            {(Object.entries(categories) as [Category, string][]).map(([value, label], i) => (
              <article className="project" key={value} data-anim="up" data-delay={0.2 + i * 0.1}>
                <Link className="project-img" href={`/tiles/${value}`} tabIndex={-1} aria-hidden="true">
                  <Image src={categoryImages[value]} alt="" width={800} height={566} sizes="(min-width: 1000px) 33vw, 100vw" unoptimized />
                </Link>
                <div className="project-body">
                  <span className="tag">Werroza</span>
                  <div className="project-text">
                    <h3>
                      <Link href={`/tiles/${value}`}>{label}</Link>
                    </h3>
                    <Link className="icon-btn" href={`/tiles/${value}`} tabIndex={-1} aria-hidden="true">
                      <Arrow />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="deliver gx" aria-labelledby="deliver-title">
          <Image className="deliver-bg" src={room("three-d", 11)} alt="" fill sizes="100vw" unoptimized />
          <div className="deliver-inner">
            <h2 id="deliver-title" className="deliver-title text-anim">
              <span>Delivering</span>
              <span>
                <svg className="verified" viewBox="0 0 24 24" aria-hidden="true" data-anim="zoom" data-delay="1">
                  <path d="M12 2l2.4 1.8 3-.2.9 2.8 2.5 1.7-1 2.9 1 2.9-2.5 1.7-.9 2.8-3-.2L12 22l-2.4-1.8-3 .2-.9-2.8-2.5-1.7 1-2.9-1-2.9 2.5-1.7.9-2.8 3 .2z" />
                  <path d="M8 12l3 3 5-6" />
                </svg>
                Trusted
              </span>
              <span>Surfaces</span>
            </h2>
            <div className="deliver-slabs" aria-hidden="true">
              {slabs.map((name, i) => (
                <div className="slab" key={name} data-anim="up-big" data-delay={0.6 + i * 0.15}>
                  <Image src={`/images/designs/${slug(name)}.jpg`} alt="" width={280} height={565} unoptimized />
                </div>
              ))}
            </div>
            <div className="deliver-box">
              <ul aria-hidden="true">
                {swatches.map((name, i) => (
                  <li key={name} data-anim="left" data-delay={0.5 + i * 0.1}>
                    <Image src={`/images/designs/${slug(name)}.jpg`} alt="" width={64} height={64} unoptimized />
                  </li>
                ))}
              </ul>
              <div data-anim="left" data-delay=".9">
                <p className="deliver-count">
                  <span data-count={designs}>{fmt.format(designs)}</span>+ designs
                </p>
                <p>In {catalogues.length} complete collections</p>
              </div>
            </div>
            <CircleLink
              className="deliver-circle"
              href="/e-catalogue"
              label="Browse the e-catalogue"
              text="WERROZA • EXQUISITE TILES • MORBI • "
            />
          </div>
        </section>

        <section className="sec feats gx" aria-labelledby="feats-title">
          <div className="feat-grid">
            <div className="feat-head">
              <p className="sub-title" data-anim="up" data-delay=".3">
                Product Features
              </p>
              <h2 id="feats-title" className="title-highlight">
                Engineered For Excellence
              </h2>
            </div>
            {featureList.map(([icon, label], i) => (
              <div className="feat" key={label} data-anim="right-big" data-delay={0.2 + (i % 4) * 0.1}>
                <span className="feat-icon">
                  <Icon name={icon} />
                </span>
                <h3>{label}</h3>
              </div>
            ))}
            <div className="feat-action" data-anim="right-big" data-delay=".8">
              <CircleLink href="/tiles" label="View all tiles" text="VIEW ALL TILES • VIEW ALL TILES • " />
            </div>
          </div>
        </section>

        <section className="cta gx" aria-label="E-catalogue">
          <Image className="cta-bg" src={room("bookmatch", 4)} alt="" fill sizes="100vw" unoptimized />
          <h2 className="cta-title text-anim">
            <span>Exquisite</span>{" "}
            <span className="cta-img" data-anim="up" data-delay=".3">
              <Image src={room("glossy-1", 7)} alt="" width={260} height={130} unoptimized />
              <Link className="icon-btn" href="/e-catalogue" aria-label="Open the e-catalogue">
                <Arrow />
              </Link>
            </span>{" "}
            <span>Catalogue</span>
          </h2>
        </section>

        <section className="sec blogs" aria-labelledby="blogs-title">
          <div className="wrap">
            <div className="sec-head center">
              <p className="sub-title" data-anim="up" data-delay=".3">
                Latest Collections
              </p>
              <h2 id="blogs-title" className="title-highlight">
                Ideas, Inspiration And Collections For Every Space
              </h2>
            </div>
            <div className="blog-grid">
              {featured.map((c) => (
                <article className="blog" key={c.slug} data-anim="up" data-delay=".4">
                  <div className="blog-thumb">
                    <Link href={`/collections/${c.slug}`} tabIndex={-1} aria-hidden="true">
                      <Image src={pageImage(c.slug, 1)} alt="" width={c.width} height={c.height} sizes="(min-width: 1000px) 33vw, 100vw" unoptimized />
                    </Link>
                    <p className="blog-date">
                      <b>{c.pages}</b>
                      <span>Pages</span>
                    </p>
                  </div>
                  <div className="blog-body">
                    <h3>
                      <Link href={`/collections/${c.slug}`}>{c.title}</Link>
                    </h3>
                    <Link className="text-btn" href={`/collections/${c.slug}`} aria-label={`View the ${c.title} catalogue`}>
                      <span>View Catalogue</span>
                      <span className="btn-icon">
                        <Arrow />
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Site>
    </>
  );
}
