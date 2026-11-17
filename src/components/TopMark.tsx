import Logo from "@/components/brand/Logo";
import styles from "./TopMark.module.css";

/**
 * The club's mark, small, in the top-left corner on every screen: the logo left the hero for the
 * arcade, so this is where you learn what it looks like. It leads back to the title screen. On a
 * PC the Aim readout sits right beside it on the same plate height.
 */
export default function TopMark() {
    return (
        <a className={styles.mark} href="#play" aria-label="OASIS, back to the title screen" data-lock="OASIS">
            <Logo decorative className={styles.logo} />
        </a>
    );
}
