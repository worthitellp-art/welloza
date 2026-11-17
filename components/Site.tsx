import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Motion } from "@/components/Motion";
import { contact, icons, type IconName } from "@/lib/data";

const wa = `https://wa.me/${contact.phones[0].wa}?text=${encodeURIComponent(
  "Hello Werroza Ceramic, I am interested in your tiles collection.",
)}`;

// Fixed elements must sit outside #smooth-content: its transform would otherwise make them scroll with the page.
export function Site({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <Motion />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main id="main">{children}</main>
          <Footer />
        </div>
      </div>

      <a className="float-wa" href={wa} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.979-.276-.1-.476-.15-.676.15-.2.301-.777.979-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.799-1.5-1.787-1.675-2.088-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.175.201-.301.301-.501.101-.2.05-.376-.025-.526-.075-.15-.676-1.63-.927-2.232-.244-.587-.492-.507-.676-.516l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.229 3.11.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.38.197 1.899.12.579-.087 1.78-.727 2.031-1.43.251-.702.251-1.304.175-1.43-.075-.125-.276-.201-.577-.351zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.94.55 3.75 1.51 5.29L2 22l4.83-1.5c1.48.88 3.2 1.38 5.21 1.38 5.53 0 10.02-4.49 10.02-10.02C22.06 6.49 17.57 2 12.04 2z" />
        </svg>
        <span>Need Help ?</span>
      </a>
      <a className="totop" href="#top" aria-label="Back to top">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </a>
    </>
  );
}

export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function PageHeader({ title, trail = [] }: { title: string; trail?: { label: string; href: string }[] }) {
  return (
    <section className="page-hdr">
      <h1 className="text-anim">{title}</h1>
      <nav aria-label="Breadcrumb">
        <ol className="crumbs">
          <li>
            <Link href="/">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z" />
              </svg>
              Home
            </Link>
          </li>
          {trail.map((t) => (
            <li key={t.href}>
              <Link href={t.href}>{t.label}</Link>
            </li>
          ))}
          <li aria-current="page">{title}</li>
        </ol>
      </nav>
    </section>
  );
}
