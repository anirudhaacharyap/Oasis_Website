import type { Metadata, Viewport } from "next";
import { Press_Start_2P, Space_Grotesk } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import PixelTrail from "@/components/PixelTrail";
import KonamiCode from "@/components/KonamiCode";
import { site } from "@/data/site";

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });

const title = `${site.name}: ${site.tagline} | ${site.college}`;

/** Absolute origin for Open Graph images and canonical URLs. */
function siteUrl() {
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
    // Preview deploys should advertise their own URL. Production uses the project domain.
    if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
}

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s | ${site.name}` },
    description: site.description,
    openGraph: {
        title,
        description: site.description,
        siteName: site.name,
        type: "website",
        locale: "en_IN",
        images: [{ url: "/assets/prat-mascot.png", alt: "Prat, the OASIS mascot" }],
    },
    twitter: {
        card: "summary_large_image",
        title,
        description: site.description,
        images: ["/assets/prat-mascot.png"],
    },
};

export const viewport: Viewport = {
    themeColor: "#D9EEFB",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${pixel.variable} ${grotesk.variable}`}>
            <body className="antialiased">
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] pixel-btn"
                >
                    Skip to content
                </a>
                <Navbar />
                {children}
                <Footer />
                <SmoothScroll />
                <PixelTrail />
                <KonamiCode />
            </body>
        </html>
    );
}
