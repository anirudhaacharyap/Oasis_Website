import { modes } from "@/data/modes";
import { site } from "@/data/site";
import styles from "./About.module.css";

const HIGHLIGHT = "leave with a team";

function Manifesto({ text }: { text: string }) {
    const at = text.indexOf(HIGHLIGHT);
    if (at === -1) {
        // Fall back to the last clause.
        const cut = text.lastIndexOf(",");
        if (cut === -1) return <>{text}</>;
        return (
            <>
                {text.slice(0, cut + 1)} <span className={styles.gold}>{text.slice(cut + 1).trim()}</span>
            </>
        );
    }
    return (
        <>
            {text.slice(0, at)}
            <span className={styles.gold}>{HIGHLIGHT}</span>
            {text.slice(at + HIGHLIGHT.length)}
        </>
    );
}

export default function About() {
    return (
        <section id="about" className={`level tone-ground ${styles.about}`} aria-labelledby="about-title">
            <div className="wrap">
                <div className={styles.top}>
                    <p className={`hud ${styles.label}`}>Level 1</p>
                    <h2 id="about-title" className={styles.title}>
                        Who we are
                    </h2>
                </div>

                <p className={styles.manifesto} data-reveal>
                    <Manifesto text={site.manifesto} />
                </p>

                <dl className={styles.facts} data-reveal>
                    {site.facts.map((fact) => (
                        <div key={fact.label} className={styles.fact}>
                            <dt className="hud">{fact.label}</dt>
                            <dd>{fact.value}</dd>
                        </div>
                    ))}
                </dl>

                <h3 className={`hud ${styles.index}`}>What we do</h3>
                <ul className={styles.modes}>
                    {modes.map((mode) => (
                        <li key={mode.id} className={styles.mode} data-reveal>
                            <span className={styles.disc} aria-hidden="true">
                                {mode.button}
                            </span>
                            <p className={styles.word}>{mode.word}</p>
                            <div className={styles.text}>
                                <p className={styles.line}>{mode.line}</p>
                                <ul className={styles.items}>
                                    {mode.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
