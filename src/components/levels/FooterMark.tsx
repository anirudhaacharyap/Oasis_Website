"use client";

import dynamic from "next/dynamic";
import Logo from "@/components/brand/Logo";
import { useDotsLive } from "@/components/hero/dots-live";
import styles from "./Finale.module.css";

const DotLogo = dynamic(() => import("@/components/hero/DotLogo"), { ssr: false, loading: () => null });

/**
 * The bookend of the print run. The title's wordmark broke into falling red ink at the top of the
 * page; here the same sheet of dots rises back and cools into the cream word as you reach the end.
 * Reel drives it (reel.footBreak). Reduced motion and no WebGL keep the printed mark.
 */
export default function FooterMark() {
    const live = useDotsLive();
    return (
        <div className={styles.markBox} data-foot-mark="" data-static={live ? undefined : ""} aria-hidden="true">
            <Logo className={styles.mark} decorative />
            {live && (
                <div className={styles.markDots}>
                    <DotLogo />
                </div>
            )}
        </div>
    );
}
