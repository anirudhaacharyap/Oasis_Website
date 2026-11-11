import { site } from "@/data/site";
import { isPlaceholderUrl } from "@/lib/content";

export default function Victory() {
    const joinReady = !isPlaceholderUrl(site.links.join);
    const discordReady = !isPlaceholderUrl(site.links.discord);

    return (
        <section id="join" className="relative overflow-hidden bg-sky py-20 md:py-28">
            <div className="mx-auto max-w-6xl px-6">
                <p className="eyebrow">Join</p>
                <h2 className="section-title mt-4 max-w-3xl text-balance text-3xl md:text-4xl">Come play, or come build</h2>
                <p className="mt-6 max-w-xl text-lg text-ink-soft">
                    Tournaments, game jams and workshops run through the semester at {site.college}. Bring a laptop, a controller, or just curiosity.
                </p>

                {joinReady || discordReady ? (
                    <div className="mt-8 flex flex-wrap gap-3">
                        {joinReady && (
                            <a href={site.links.join} target="_blank" rel="noopener noreferrer" className="pixel-btn">
                                JOIN FORM
                            </a>
                        )}
                        {discordReady && (
                            <a href={site.links.discord} target="_blank" rel="noopener noreferrer" className="pixel-btn pixel-btn-ghost">
                                DISCORD
                            </a>
                        )}
                    </div>
                ) : (
                    <p className="mt-8 max-w-xl text-ink">
                        The join form and Discord invite are not published yet. They will show up here as soon as the club adds them.
                    </p>
                )}
            </div>
            <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-2"
                style={{ background: "linear-gradient(90deg, #F6B6C8, #C9C3F5, #9FA8FF, #9EE6CF, #FFF1A8)" }}
            />
        </section>
    );
}
