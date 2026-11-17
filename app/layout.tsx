import type { Metadata } from "next";
import { Inter, Lexend, Mrs_Saint_Delafield } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const display = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["200", "300", "600"],
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
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${display.variable} ${script.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
