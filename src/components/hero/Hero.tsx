import { site } from "@/data/site";
import HeroStage from "./HeroStage";
import styles from "./Hero.module.css";

/** Title screen: the controller drives the "what we do" carousel. */
export default function Hero() {
    return (
        <section id="play" className={`level tone-ground ${styles.hero}`} aria-label="Title screen">
            <HeroStage
                heading={
                    <h1 className={styles.h1}>
                        <span className={styles.h1Name}>{site.name}</span> is {site.college}&rsquo;s esports and game dev club, in{" "}
                        {site.city}.
                    </h1>
                }
            />
        </section>
    );
}
