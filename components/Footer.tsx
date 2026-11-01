import Link from "next/link";
import { categories, contact } from "@/lib/data";

const enquiry = encodeURIComponent("Hello Werroza Ceramic, I would like a price for your tiles.");
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Masayakhi Chembar, Wankaner, Morbi, Gujarat 363621, India",
)}`;

export function Footer() {
  return (
    <footer className="ftr" id="contact">
      <div className="ftr-inner">
        <div className="ftr-lead">
          <h2>Ask us for a price.</h2>
          <p>Message us on WhatsApp with the tile name and the quantity you need.</p>
          <ul className="ftr-phones">
            {contact.phones.map((p) => (
              <li key={p.number}>
                <a href={`https://wa.me/${p.wa}?text=${enquiry}`} target="_blank" rel="noopener noreferrer">
                  {p.number}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="ftr-details">
          <div>
            <h3>Tiles</h3>
            <ul>
              <li>
                <Link href="/tiles">All tiles</Link>
              </li>
              {Object.entries(categories).map(([value, label]) => (
                <li key={value}>
                  <Link href={`/tiles/${value}`}>{label}</Link>
                </li>
              ))}
              <li>
                <Link href="/#collections">Full catalogues</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <ul>
              <li>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li>
                <a href={contact.instagram.url} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="/welloza-catalogue.pdf" target="_blank" rel="noopener">
                  Download catalogue (PDF, 24 MB)
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3>Office</h3>
            <address>{contact.address}</address>
            <p>Mon to Sat, 9:00 AM to 7:30 PM IST</p>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
          </div>
        </div>

        <div className="ftr-end">
          <span>
            &copy; {new Date().getFullYear()} {contact.brand}
          </span>
          <a href="#top">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
