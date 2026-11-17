import { site } from "@/data/site";
import HeroArt from "./HeroArt";
import styles from "./Hero.module.css";

/**
 * Title screen: OASIS itself. The wordmark is a sheet of halftone ink dots that warms and
 * scatters under your hand, then settles home. Text lives only in the band under the logo.
 */
export default function Hero() {
    return (
        <section id="play" className={`level ${styles.hero}`} aria-labelledby="hero-title">
            <h1 id="hero-title" className={styles.word}>
                <span className="sr-only">
                    {site.name}, {site.college}&rsquo;s esports and game dev club
                </span>
                <HeroArt />
            </h1>

            <div className={styles.foot}>
                <div className={styles.say} data-intro style={{ ["--i" as string]: 3 }}>
                    <p className={`script ${styles.script}`} aria-hidden="true">
                        Gaming &amp; Game Dev
                    </p>
                    <p className={styles.line}>
                        {site.college}&rsquo;s esports and game development club, {site.city}. We play, and we build.
                    </p>
                </div>
                <div className={styles.ctas} data-intro style={{ ["--i" as string]: 4 }}>
                    <a className="btn btn--red" data-lock="Pick your spawn point" data-lock-auto href={site.links.join} target="_blank" rel="noopener noreferrer">
                        Pick your spawn point
                        <svg className="arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                            <path d="M4 10 10 4M5 4h5v5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                        <span className="sr-only">(opens the recruitment site)</span>
                    </a>
                    <a className="btn btn--ghost" data-lock="Partner with us" data-lock-auto href="#join">
                        Partner with us
                    </a>
                </div>
            </div>
        </section>
    );
}
