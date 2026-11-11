import Link from "next/link";
import { site } from "@/data/site";
import { isPlaceholderUrl } from "@/lib/content";

const PAGES = [
    { label: "About", href: "/#about" },
    { label: "Events", href: "/events" },
    { label: "Achievements", href: "/achievements" },
    { label: "Team", href: "/team" },
    { label: "Gallery", href: "/gallery" },
    { label: "Join", href: "/#join" },
];

export default function Footer() {
    const socials = site.socials.filter((social) => !isPlaceholderUrl(social.url));
    const emailReady = !isPlaceholderUrl(site.links.email);

    return (
        <footer className="relative bg-ink text-white">
            <div
                aria-hidden="true"
                className="h-2"
                style={{ background: "linear-gradient(90deg, #F6B6C8, #C9C3F5, #9FA8FF, #9EE6CF, #FFF1A8)" }}
            />
            <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
                <div>
                    <p className="font-pixel text-2xl tracking-widest">{site.name}</p>
                    <p className="mt-3 text-white/80">
                        {site.tagline}, {site.college}
                    </p>
                    {emailReady ? (
                        <a href={`mailto:${site.links.email}`} className="mt-5 inline-block text-accent-mint underline underline-offset-4">
                            {site.links.email}
                        </a>
                    ) : (
                        <p className="mt-5 text-white/70">Email coming soon</p>
                    )}
                </div>

                <nav aria-label="Footer">
                    <p className="font-pixel text-[10px] tracking-widest text-accent-lavender mb-4">PAGES</p>
                    <ul className="space-y-2">
                        {PAGES.map((p) => (
                            <li key={p.href}>
                                <Link href={p.href} className="text-white/85 hover:text-white">
                                    {p.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <p className="font-pixel text-[10px] tracking-widest text-accent-lavender mb-4">FOLLOW</p>
                    {socials.length === 0 ? (
                        <p className="text-white/70">Social links coming soon</p>
                    ) : (
                        <ul className="space-y-2">
                            {socials.map((s) => (
                                <li key={s.label}>
                                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white">
                                        {s.label} ↗
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="border-t border-white/15">
                <p className="mx-auto max-w-6xl px-6 py-5 font-pixel text-[9px] tracking-wider text-white/60">
                    © {new Date().getFullYear()} {site.name}, {site.college} {site.tagline.toUpperCase()}
                </p>
            </div>
        </footer>
    );
}
