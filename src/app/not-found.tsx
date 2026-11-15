import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/brand/Logo";

export const metadata: Metadata = {
    title: "Game over",
    description: "That address is not part of the OASIS site.",
};

/** 404: the run ended. Continue goes back to the title screen. */
export default function NotFound() {
    return (
        <main id="main" tabIndex={-1} className="level tone-ink" style={{ minHeight: "100svh", display: "grid", alignItems: "center" }}>
            <div className="wrap" style={{ display: "grid", gap: "1.5rem", paddingBlock: "8rem", justifyItems: "start" }}>
                <Logo decorative className="nf-logo" />
                <h1 className="display t-xl" style={{ color: "var(--c-signal)", margin: 0 }}>
                    Game over
                </h1>
                <p className="lede">This page isn&rsquo;t part of the club. Your progress is safe.</p>
                <Link href="/" className="btn btn--red">
                    Continue to the title screen
                </Link>
            </div>
        </main>
    );
}
