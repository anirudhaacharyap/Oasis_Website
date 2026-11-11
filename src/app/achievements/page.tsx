import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import SampleBadge from "@/components/ui/SampleBadge";
import { achievementsByYear } from "@/data/achievements";
import { isPlaceholderUrl } from "@/lib/content";

export const metadata: Metadata = {
    title: "Achievements",
    description: "Results from OASIS at NMIT, with space for brackets, certificates and posts as proof.",
};

export default function AchievementsPage() {
    const groups = achievementsByYear();

    return (
        <main id="main" tabIndex={-1}>
            <PageHeader
                eyebrow="Achievements"
                title="Results we can stand behind"
                intro="Placements, awards and released games. Each sample row is a slot for a real result and a link to proof."
            />
            <div className="mx-auto max-w-6xl space-y-14 px-6 py-16">
                {groups.map(([year, items]) => (
                    <section key={year} aria-labelledby={`year-${year}`}>
                        <h2 id={`year-${year}`} className="font-pixel text-lg text-ink">
                            {year}
                        </h2>
                        <ul className="mt-6 grid gap-5 md:grid-cols-2">
                            {items.map((item) => {
                                const proof = item.proofUrl && !isPlaceholderUrl(item.proofUrl) ? item.proofUrl : null;
                                return (
                                    <li key={`${item.year}-${item.title}`} className="pixel-card cv-auto p-6">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="eyebrow">{item.placement}</p>
                                            <SampleBadge show={item.sample} />
                                        </div>
                                        <h3 className="mt-3 text-balance font-pixel text-sm leading-relaxed text-ink">{item.title}</h3>
                                        <p className="mt-2 text-sm text-ink-soft">{item.event}</p>
                                        <p className="mt-3 text-ink-soft">{item.description}</p>
                                        {proof && (
                                            <a
                                                href={proof}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-block text-sm text-ink underline underline-offset-4"
                                            >
                                                Proof
                                            </a>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ))}
            </div>
        </main>
    );
}
