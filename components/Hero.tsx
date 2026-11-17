import Image from "next/image";
import { heroSlabs, slug } from "@/lib/data";

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="h1">
      <div className="hero-copy">
        <p className="hero-kicker">600 × 1200 mm · Made in Morbi</p>
        <span className="hero-script">Exquisite</span>
        <h1 id="h1" className="hero-title">
          Tiles
        </h1>
        <p className="hero-text">
          Marble, glossy, decor and fullbody tiles for walls and floors, made for homes, showrooms and commercial
          spaces.
        </p>
        <div className="hero-actions">
          <a className="btn" href="#designs">
            Browse tiles
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>
          <a className="btn ghost" href="#contact">
            Get in touch
          </a>
        </div>
      </div>

      <div className="slabs" aria-hidden="true">
        {heroSlabs.map((name) => (
          <div className="slab" key={name}>
            <Image src={`/images/designs/${slug(name)}.jpg`} alt="" width={560} height={1130} loading="eager" unoptimized />
          </div>
        ))}
      </div>
    </section>
  );
}
