import type { Metadata, Viewport } from "next";
import { Archivo, Mr_Dafoe } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import KonamiCode from "@/components/KonamiCode";
import Motion from "@/components/Motion";
import Reel from "@/components/Reel";
import Aim from "@/components/Aim";
import TopMark from "@/components/TopMark";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/site-url";

// Archivo carries every voice through its width axis: expanded display, normal body, condensed labels.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
// One retro script accent, as on the club's posters ("Gaming & Game Dev").
const dafoe = Mr_Dafoe({ subsets: ["latin"], weight: "400", variable: "--font-dafoe", display: "swap" });

const title = `${site.name}: ${site.tagline} at ${site.college}, ${site.city}`;

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s | ${site.name}` },
    description: site.description,
    alternates: { canonical: "./" },
    openGraph: { title, description: site.description, siteName: site.name, type: "website", locale: "en_IN" },
    twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = {
    themeColor: "#0C0B0C",
    colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: site.name,
        description: site.description,
        url: siteUrl(),
        memberOf: { "@type": "CollegeOrUniversity", name: "Nitte Meenakshi Institute of Technology" },
    };

    return (
        <html lang="en" className={`${archivo.variable} ${dafoe.variable}`}>
            <body>
                <a href="#main" className="skip-link">
                    Skip to content
                </a>
                <TopMark />
                <Navbar />
                {children}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
                />
                <SmoothScroll />
                <Motion />
                <Reel />
                <Aim />
                <KonamiCode />
            </body>
        </html>
    );
}
