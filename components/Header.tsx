"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categories } from "@/lib/data";

type Item = { label: string; href: string };
const links: (Item | { label: string; base: string; sub: Item[] })[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Collection",
    base: "/tiles",
    sub: [
      ...Object.entries(categories).map(([value, label]) => ({ label, href: `/tiles/${value}` })),
      { label: "All Tiles", href: "/tiles" },
    ],
  },
  { label: "E-Catalogue", href: "/e-catalogue" },
  { label: "Brochure", href: "/welloza-catalogue.pdf" },
  { label: "Contact", href: "#contact" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link className={light ? "logo light" : "logo"} href="/" aria-label="Werroza Ceramic home">
      <b>WERROZA</b>
      <span>Ceramic &bull; Morbi</span>
    </Link>
  );
}

function Menu({ id, onNavigate }: { id: string; onNavigate: () => void }) {
  const pathname = usePathname();
  const [sub, setSub] = useState<string | null>(null);

  return (
    <ul>
      {links.map((l) =>
        "sub" in l ? (
          <li key={l.label} className={`has-sub${sub === l.label ? " open" : ""}${pathname.startsWith(l.base) ? " current" : ""}`}>
            <button
              type="button"
              aria-expanded={sub === l.label}
              aria-controls={`${id}-${l.base.slice(1)}`}
              onClick={() => setSub((s) => (s === l.label ? null : l.label))}
            >
              {l.label}
            </button>
            <ul className="sub" id={`${id}-${l.base.slice(1)}`}>
              {l.sub.map((s) => (
                <li key={s.href} className={pathname === s.href ? "current" : undefined}>
                  <Link href={s.href} onClick={onNavigate}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ) : (
          <li key={l.label} className={pathname === l.href ? "current" : undefined}>
            {l.href.endsWith(".pdf") ? (
              <a href={l.href} target="_blank" rel="noopener" onClick={onNavigate}>
                {l.label}
              </a>
            ) : (
              <Link href={l.href} onClick={onNavigate} aria-current={pathname === l.href ? "page" : undefined}>
                {l.label}
              </Link>
            )}
          </li>
        ),
      )}
    </ul>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    // Like the reference: the bar scrolls away, then a sticky copy slides in only when scrolling back up past 500px.
    const onScroll = () => {
      const y = window.scrollY;
      setStuck(y > 500 && y < last);
      last = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <header className={stuck ? "hdr stuck" : "hdr"}>
        <div className="hdr-bar">
          <Logo />
          <nav className="mainmenu" aria-label="Main">
            <Menu id="desk" onNavigate={close} />
          </nav>
          <button
            type="button"
            className="burger"
            aria-expanded={open}
            aria-controls="drawer"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={open ? "drawer open" : "drawer"} id="drawer" inert={!open}>
        <button type="button" className="drawer-bg" aria-label="Close menu" tabIndex={-1} onClick={close} />
        <div className="drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer-top">
            <Logo light />
            <button type="button" className="drawer-close" aria-label="Close menu" onClick={close}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav className="drawer-nav" aria-label="Mobile">
            <Menu id="mob" onNavigate={close} />
          </nav>
        </div>
      </div>
    </>
  );
}
