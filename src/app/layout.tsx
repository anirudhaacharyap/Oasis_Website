import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Martian_Mono, Unbounded } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import KonamiCode from "@/components/KonamiCode";
import Motion from "@/components/Motion";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/site-url";

const display = Unbounded({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-unbounded", display: "swap" });
const text = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-text", display: "swap" });
const mono = Martian_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-martian", display: "swap" });

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
    themeColor: "#A3161D",
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
        <html lang="en" className={`${display.variable} ${text.variable} ${mono.variable}`}>
            <body>
                <a href="#main" className="skip-link">
                    Skip to content
                </a>
                <Navbar />
                {children}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
                />
                <SmoothScroll />
                <Motion />
                <KonamiCode />
            </body>
        </html>
    );
}
