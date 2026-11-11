import Reveal from "@/components/Reveal";
import SampleBadge from "@/components/ui/SampleBadge";
import { partners } from "@/data/partners";
import { isPlaceholderUrl } from "@/lib/content";

function initials(name: string) {
    return name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function Collabs() {
    return (
        <section className="bg-sky-light py-20 md:py-28" aria-labelledby="partners-heading">
            <div className="mx-auto max-w-6xl px-6">
                <p className="eyebrow">Collaborations</p>
                <h2 id="partners-heading" className="section-title mt-4 max-w-3xl text-3xl md:text-4xl">
                    Sponsors and college partners
                </h2>
                <p className="mt-6 max-w-2xl text-lg text-ink-soft">
                    Only organisations the club has actually worked with belong here. The tiles below are empty slots, not partnerships.
                </p>
                <Reveal className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {partners.map((partner, index) => {
                        const href = partner.url && !isPlaceholderUrl(partner.url) ? partner.url : null;
                        const body = (
                            <>
                                <div className="flex items-start justify-between gap-2">
                                    <span
                                        aria-hidden="true"
                                        className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-ink bg-sky font-pixel text-xs text-ink"
                                    >
                                        {initials(partner.name)}
                                    </span>
                                    <SampleBadge show={partner.sample} />
                                </div>
                                <p className="mt-4 font-pixel text-[11px] leading-relaxed text-ink">{partner.name}</p>
                                <p className="mt-2 text-sm text-ink-soft">{partner.tier}</p>
                            </>
                        );
                        return href ? (
                            <a
                                key={`${partner.tier}-${index}`}
                                data-reveal
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pixel-card pixel-card-hover block p-5"
                            >
                                {body}
                            </a>
                        ) : (
                            <article key={`${partner.tier}-${index}`} data-reveal className="pixel-card p-5">
                                {body}
                            </article>
                        );
                    })}
                </Reveal>
            </div>
        </section>
    );
}
