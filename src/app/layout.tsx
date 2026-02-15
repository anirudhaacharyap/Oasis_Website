import type { Metadata } from "next";
import "./globals.css";

import PixelTrail from "@/components/PixelTrail";
import KonamiCode from "@/components/KonamiCode";

export const metadata: Metadata = {
  title: "OASIS — Esports & Game Dev Club | NMIT",
  description:
    "The official Esports & Game Development Club of NMIT. Join the adventure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <PixelTrail />
        <KonamiCode />
      </body>
    </html>
  );
}
