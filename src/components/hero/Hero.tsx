import { site } from "@/data/site";
import Arcade from "@/components/arcade/Arcade";
import styles from "./Hero.module.css";

/**
 * Title screen: the OASIS arcade. Five machines spell the name on their CRTs; hit one and it
 * changes channel. Text lives only in the band under the row.
 */
export default function Hero() {
    return (
        <section id="play" className={`level ${styles.hero}`} aria-labelledby="hero-title">
            <h1 id="hero-title" className="sr-only">
                {site.name}, {site.college}&rsquo;s esports and game dev club
            </h1>
            <div className={styles.word}>
                <Arcade />
            </div>

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
