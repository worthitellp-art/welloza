import Link from "next/link";
import { EnquiryForm } from "@/components/EnquiryForm";
import { catalogues } from "@/lib/catalogues";
import { categories, contact } from "@/lib/data";

const enquiry = encodeURIComponent("Hello Werroza Ceramic, I would like a price for your tiles.");
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Masayakhi Chembar, Wankaner, Morbi, Gujarat 363621, India",
)}`;

const caret = (
  <svg className="caret" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export function Footer() {
  return (
    <footer className="ftr" id="contact">
      <div className="ftr-main">
        <div className="ftr-col ftr-team" data-anim="up" data-delay=".3">
          <h2 className="text-anim">Contact Our Team.</h2>
          <EnquiryForm />
        </div>
        <div className="ftr-col" data-anim="up" data-delay=".3">
          <h3>Quick Links</h3>
          <ul>
            {Object.entries(categories).map(([value, label]) => (
              <li key={value}>
                <Link href={`/tiles/${value}`}>
                  {caret}
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/tiles">{caret}All Tiles</Link>
            </li>
            <li>
              <Link href="/about">{caret}About Us</Link>
            </li>
            <li>
              <Link href="/e-catalogue">{caret}E-Catalogue</Link>
            </li>
          </ul>
        </div>
        <div className="ftr-col" data-anim="up" data-delay=".5">
          <h3>Collections</h3>
          <ul>
            {catalogues.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`}>
                  {caret}
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="ftr-col" data-anim="up" data-delay=".7">
          <h3>Reach Us</h3>
          <ul className="ftr-contact">
            <li>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
                <span>{contact.address}</span>
              </a>
            </li>
            {contact.phones.map((p) => (
              <li key={p.number}>
                <a href={`https://wa.me/${p.wa}?text=${enquiry}`} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" />
                  </svg>
                  <span>{p.number}</span>
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${contact.email}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                <span>{contact.email}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="ftr-logo" data-anim="up-big" data-delay=".3" aria-hidden="true">
        WERROZA
      </div>

      <div className="ftr-copy">
        <p>
          &copy; {new Date().getFullYear()} <Link href="/">{contact.brand}</Link> All rights reserved
        </p>
        <ul className="ftr-social">
          <li>
            <a href={contact.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r=".6" />
              </svg>
            </a>
          </li>
          <li>
            <a href={`https://wa.me/${contact.phones[0].wa}?text=${enquiry}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 20l1.3-4A8 8 0 1112 20a8 8 0 01-4-1.1z" />
                <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 01-1.8-1.8l.8-1-1-2z" />
              </svg>
            </a>
          </li>
        </ul>
        <ul className="ftr-menu">
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/tiles">Tiles</Link>
          </li>
          <li>
            <Link href="/e-catalogue">Catalogue</Link>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </div>
      <p className="ftr-strip">Made in Morbi, Gujarat &middot; Mon to Sat, 9:00 AM to 7:30 PM IST</p>
    </footer>
  );
}
