import { hasMockContent, isPlaceholderUrl, levels } from "@/lib/content";
import { site } from "@/data/site";
import SpawnSelect from "./SpawnSelect";
import FooterMark from "./FooterMark";
import styles from "./Finale.module.css";

export default function Finale() {
    const emailReal = !isPlaceholderUrl(site.links.email);

    return (
        <section id="join" className={`level tone-red ${styles.finale}`} aria-labelledby="join-title">
            <div className={`wrap ${styles.inner}`}>
                <div className={styles.main}>
                    <h2 id="join-title" className={`display t-xl ${styles.title}`}>Pick your spawn point</h2>
                    <SpawnSelect />
                </div>

                <div className={styles.lower}>
                    <div className={styles.poster}>
                        <p className={styles.enough}>Enough played, getting bro.</p>
                        <p className={styles.time}>
                            <span className={styles.timeLead}>It&rsquo;s time to</span>
                            <span className={`script ${styles.play}`}>play.</span>
                        </p>
                    </div>

                    <div className={styles.partner}>
                        <h3 className={`display ${styles.partnerTitle}`}>Partner with OASIS</h3>
                        <p className={styles.partnerText}>
                            Sponsors and other colleges: run an event with us or back a tournament, and put your name
                            in front of the whole campus.
                        </p>
                        {emailReal ? (
                            <a className="snap-link" data-lock="Partner contact" data-lock-auto href={`mailto:${site.links.email}`}>
                                {site.links.email}
                            </a>
                        ) : (
                            <p className={styles.soon}>Partner contact coming soon</p>
                        )}
                    </div>
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
        <footer className={`tone-ink ${styles.footer}`}>
            <div className={`wrap ${styles.footInner}`}>
                <div className={styles.cols}>
                    <div className={styles.col}>
                        <p className={styles.tag}>{site.tagline}</p>
                        <p>{site.college}</p>
                        <p>{site.city}</p>
                        {emailReal && (
                            <p>
                                <a className="snap-link" href={`mailto:${site.links.email}`}>
                                    {site.links.email}
                                </a>
                            </p>
                        )}
                    </div>

                    <nav className={styles.col} aria-label="Sections">
                        <p className="label">Sections</p>
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
                        <p className="label">Socials</p>
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

                {/* The last frame of the page: the wordmark the title broke apart, printed whole again. */}
                <FooterMark />

                <div className={styles.bottom}>
                    <p>
                        &copy; {new Date().getFullYear()} {site.name}, {site.college}
                    </p>
                    {hasMockContent() && <p className="label">Preview build: some content is placeholder</p>}
                </div>
            </div>
        </footer>
    );
}
