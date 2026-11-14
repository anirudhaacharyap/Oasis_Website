import { hasMockContent, isPlaceholderUrl, levels } from "@/lib/content";
import { site } from "@/data/site";
import ControllerSVG from "@/components/hero/ControllerSVG";
import styles from "./Finale.module.css";

export default function Finale() {
    const joinReal = !isPlaceholderUrl(site.links.join);
    const discordReal = !isPlaceholderUrl(site.links.discord);

    return (
        <section id="join" className={`level tone-gold ${styles.finale}`} aria-labelledby="join-title">
            <ControllerSVG active="A" className={styles.pad} />
            <div className={`wrap ${styles.inner}`}>
                <p className={`hud ${styles.label}`}>Finale</p>
                <h2 id="join-title" className={`display ${styles.poster}`} data-reveal>
                    Press{" "}
                    <span className={styles.disc} aria-hidden="true">
                        <span>A</span>
                    </span>
                    <span className="sr-only">A</span> to join
                </h2>
                <p className={styles.invite} data-reveal>
                    Bring your squad or come alone. Scrim on a Friday, jam on a weekend, and find the people you
                    will be queuing with all semester.
                </p>
                <div className={styles.actions} data-reveal>
                    {joinReal ? (
                        <a className="btn btn--deep" href={site.links.join}>
                            <span className="glyph" aria-hidden="true">
                                <span>A</span>
                            </span>
                            Join OASIS
                        </a>
                    ) : (
                        <p className={styles.soon}>Join form opens soon</p>
                    )}
                    {discordReal ? (
                        <a className={styles.secondary} href={site.links.discord}>
                            Discord
                        </a>
                    ) : (
                        <p className={styles.soon}>Discord invite coming soon</p>
                    )}
                </div>
            </div>
        </section>
    );
}

export function SiteFooter() {
    const emailReal = !isPlaceholderUrl(site.links.email);
    const socials = site.socials.filter((social) => !isPlaceholderUrl(social.url));
    const jump = levels.filter((level) => level.id !== "play");

    return (
        <footer className={styles.footer}>
            <div className={`wrap ${styles.footInner}`}>
                <div className={styles.markBox}>
                    <p className={`display ${styles.mark}`} aria-hidden="true">
                        {site.name}
                    </p>
                </div>

                <div className={styles.cols}>
                    <div className={styles.col}>
                        <p className={styles.tag}>{site.tagline}</p>
                        <p>{site.college}</p>
                        <p>{site.city}</p>
                        {emailReal ? (
                            <p>
                                <a className="snap-link" href={`mailto:${site.links.email}`}>
                                    {site.links.email}
                                </a>
                            </p>
                        ) : (
                            <p className={styles.muted}>Email coming soon</p>
                        )}
                    </div>

                    <nav className={styles.col} aria-label="Levels">
                        <h2 className={`hud ${styles.colHead}`}>Levels</h2>
                        <ul className={styles.list}>
                            {jump.map((level) => (
                                <li key={level.id}>
                                    <a className={`snap-link ${styles.link}`} href={`#${level.id}`}>
                                        {level.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.col}>
                        <h2 className={`hud ${styles.colHead}`}>Socials</h2>
                        {socials.length > 0 ? (
                            <ul className={styles.list}>
                                {socials.map((social) => (
                                    <li key={social.label}>
                                        <a className={`snap-link ${styles.link}`} href={social.url} rel="noopener noreferrer">
                                            {social.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.muted}>Socials coming soon</p>
                        )}
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>
                        &copy; {new Date().getFullYear()} {site.name}, {site.college}
                    </p>
                    {hasMockContent() && <p className="hud">Preview build: some content is placeholder</p>}
                </div>
            </div>
        </footer>
    );
}
