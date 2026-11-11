import Reveal from "@/components/Reveal";
import PixelIcon from "@/components/ui/PixelIcon";
import SampleBadge from "@/components/ui/SampleBadge";
import { accentColors, site } from "@/data/site";
import { stats } from "@/data/stats";

export default function Origin() {
    return (
        <section id="about" className="bg-cloud py-20 md:py-28">
            <div className="mx-auto max-w-6xl px-6">
                <p className="eyebrow">Who we are</p>
                <h2 className="section-title mt-4 max-w-3xl text-balance text-3xl md:text-4xl">
                    A club for players and people who make games
                </h2>
                <p className="mt-6 max-w-2xl text-lg text-ink-soft">
                    Scrims, game jams, workshops and LAN nights fill the semester at {site.college}. Beginners are welcome. You do not need a rank, or a finished game, to show up.
                </p>

                <Reveal className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
                    {stats.map((stat) => {
                        const colors = accentColors[stat.accent];
                        return (
                            <article key={stat.label} data-reveal className="pixel-card p-5">
                                <div className="flex items-start justify-between gap-2">
                                    <PixelIcon name={stat.icon} color={colors.fill} size={36} />
                                    <SampleBadge show={stat.sample} />
                                </div>
                                <p className="mt-4 font-pixel text-2xl text-ink">
                                    {stat.sample ? "—" : `${stat.value}${stat.suffix ?? ""}`}
                                </p>
                                <p className="mt-2 text-sm text-ink-soft">{stat.label}</p>
                            </article>
                        );
                    })}
                </Reveal>
                <p className="mt-6 max-w-2xl text-sm text-ink-soft">
                    Counts stay blank until the club confirms them. Sample entries are marked so they are never published as fact.
                </p>
            </div>
        </section>
    );
}
