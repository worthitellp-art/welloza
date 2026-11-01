import Image from "next/image";
import { heroSlabs, slug } from "@/lib/data";

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="h1">
      <div className="hero-niche" />
      <div className="hero-floor" />

      <svg className="lamp" viewBox="0 0 480 64" aria-hidden="true">
        <line x1="20" y1="16" x2="460" y2="16" stroke="#8a7a2c" strokeWidth="3" />
        <path d="M30 0A16 16 0 0 0 30 32z" fill="#fff" />
        <path d="M450 0A16 16 0 0 1 450 32z" fill="#fff" />
        <circle cx="168" cy="16" r="16" fill="#fff" />
        <circle cx="300" cy="16" r="14" fill="#262626" stroke="#fff" strokeWidth="3" />
        {[101, 234, 368].map((x) => (
          <g key={x}>
            <line x1={x} y1="16" x2={x} y2="26" stroke="#8a7a2c" strokeWidth="2" />
            <path d={`M${x - 16} 26a16 16 0 0 0 32 0z`} fill="#fff" />
          </g>
        ))}
      </svg>

      <div className="slabs" aria-hidden="true">
        {heroSlabs.map((name) => (
          <div className="slab" key={name}>
            <Image src={`/images/designs/${slug(name)}.jpg`} alt="" width={560} height={1130} loading="eager" unoptimized />
          </div>
        ))}
      </div>

      <div className="hero-copy">
        <span className="hero-script">Exquisite</span>
        <h1 id="h1" className="hero-title">
          TILES
        </h1>
        <p className="hero-badge">Marble, Glossy, Decor &amp; Fullbody</p>
      </div>

      <a className="hero-scroll-indicator" href="#designs">
        <span className="scroll-label">Browse tiles</span>
        <svg className="scroll-chevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
