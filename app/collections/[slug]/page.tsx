import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogueViewer } from "@/components/CatalogueViewer";
import { Arrow, PageHeader, Site } from "@/components/Site";
import { catalogues } from "@/lib/catalogues";
import { contact } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogues.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalogue = catalogues.find((c) => c.slug === slug);
  if (!catalogue) return {};
  return {
    title: `${catalogue.title} | Werroza Ceramic`,
    description: `Browse all ${catalogue.pages} pages of the Werroza Ceramic ${catalogue.title} catalogue.`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const catalogue = catalogues.find((c) => c.slug === slug);
  if (!catalogue) notFound();

  const enquiry = encodeURIComponent(`Hello Werroza Ceramic, I am interested in your ${catalogue.title}.`);

  return (
    <Site>
      <PageHeader title={catalogue.title} trail={[{ label: "E-Catalogue", href: "/e-catalogue" }]} />
      <div className="collection-page">
        <p>{catalogue.pages} pages. Select a page to view it full size.</p>
        <a
          className="btn"
          href={`https://wa.me/${contact.phones[0].wa}?text=${enquiry}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="btn-text">
            <span>Enquire on WhatsApp</span>
          </span>
          <span className="btn-icon">
            <Arrow />
          </span>
        </a>
        <CatalogueViewer catalogue={catalogue} />
      </div>
    </Site>
  );
}
