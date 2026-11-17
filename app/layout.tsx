import type { Metadata } from "next";
import { Mona_Sans, Montserrat_Alternates, Mrs_Saint_Delafield } from "next/font/google";
import "./globals.css";

const body = Mona_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

// Closest free match to the reference site's commercial "Marble" display face.
const display = Montserrat_Alternates({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const script = Mrs_Saint_Delafield({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Werroza Ceramic | Premium 600 × 1200 mm Glossy Tiles | Morbi",
  description:
    "Werroza Ceramic (WR Ceramic) in Morbi: marble, glossy, decor and fullbody tiles for modern walls and floors. Contact: +91 63515 52618 / +91 89059 14320.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${script.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
