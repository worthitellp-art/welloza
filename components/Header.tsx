"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Item = { label: string; href: string };
const links: (Item | { label: string; sub: Item[] })[] = [
  { label: "Collections", href: "/#collections" },
  { label: "Tile Designs", href: "/tiles" },
  { label: "Contact", href: "#contact" },
  { label: "E-Catalogue", href: "/welloza-catalogue.pdf" },
];

export function Logo({ href = "/#top", onClick }: { href?: string; onClick?: () => void }) {
  return (
    <a className="logo" href={href} aria-label="Werroza Ceramic home" onClick={onClick}>
      <b>WERROZA</b>
      <span>CERAMIC &bull; MORBI</span>
    </a>
  );
}

export function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setSub(null);
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".has-sub")) setSub(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const close = () => {
    setOpen(false);
    setSub(null);
  };

  return (
    <header className={open ? "hdr open" : "hdr"} suppressHydrationWarning>
      <div className="bar" suppressHydrationWarning>
        <Logo onClick={close} />
        <nav className="nav" id="nav" aria-label="Main">
          <ul>
            {links.map((l) =>
              "sub" in l ? (
                <li key={l.label} className={sub === l.label ? "has-sub open" : "has-sub"}>
                  <button
                    type="button"
                    aria-expanded={sub === l.label}
                    aria-haspopup="true"
                    onClick={() => setSub((s) => (s === l.label ? null : l.label))}
                  >
                    {l.label}
                  </button>
                  <ul className="sub">
                    {l.sub.map((s) => (
                      <li key={s.href}>
                        <a href={s.href} onClick={close}>
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={l.label}>
                  <a href={l.href} onClick={close}>
                    {l.label}
                  </a>
                </li>
              ),
            )}
            <li className="nav-cta">
              <a href="/welloza-catalogue.pdf" target="_blank" rel="noopener" onClick={close}>
                E-Catalogue
              </a>
            </li>
          </ul>
        </nav>
        <div className="actions">
          <button
            type="button"
            className="icon-btn"
            aria-label="Search designs"
            onClick={() => {
              close();
              const search = document.getElementById("design-search");
              if (search) search.focus();
              else router.push("/tiles");
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>
          <a
            className="icon-btn wa-header-btn"
            href="https://wa.me/916351552618?text=Hello%20Werroza%20Ceramic%2C%20I%20am%20interested%20in%20your%20600x1200%20mm%20tiles%20collection."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp (+91 63515 52618)"
            title="Chat on WhatsApp (+91 63515 52618)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.979-.276-.1-.476-.15-.676.15-.2.301-.777.979-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.799-1.5-1.787-1.675-2.088-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.175.201-.301.301-.501.101-.2.05-.376-.025-.526-.075-.15-.676-1.63-.927-2.232-.244-.587-.492-.507-.676-.516l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.229 3.11.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.38.197 1.899.12.579-.087 1.78-.727 2.031-1.43.251-.702.251-1.304.175-1.43-.075-.125-.276-.201-.577-.351zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.94.55 3.75 1.51 5.29L2 22l4.83-1.5c1.48.88 3.2 1.38 5.21 1.38 5.53 0 10.02-4.49 10.02-10.02C22.06 6.49 17.57 2 12.04 2z" />
            </svg>
          </a>
          <a className="cta" href="/welloza-catalogue.pdf" target="_blank" rel="noopener">
            Catalogue
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
