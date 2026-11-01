import data from "@/lib/catalogues.json";

export type Catalogue = (typeof data)[number];

export const catalogues: Catalogue[] = data;

export const pageImage = (slug: string, page: number, thumb = false) =>
  `/catalogues/${slug}/${String(page).padStart(3, "0")}${thumb ? "-t" : ""}.webp`;
