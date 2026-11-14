import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Game over",
    description: "That address is not part of the OASIS site.",
};

/** 404: the run ended. Continue goes back to the title screen. */
export default function NotFound() {
    return (
        <main
            id="main"
            tabIndex={-1}
            className="level tone-void"
            style={{ minHeight: "100svh", display: "grid", alignItems: "center" }}
        >
            <div className="wrap" style={{ display: "grid", gap: "1.5rem", paddingBlock: "8rem" }}>
                <p className="hud">Error 404</p>
                <h1 className="display t-xl" style={{ color: "var(--gold)" }}>
                    Game over
                </h1>
                <p className="lede">This page isn&rsquo;t part of the club. Your progress is safe.</p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                    <Link href="/" className="btn btn--gold">
                        Continue
                    </Link>
                    <span className="hud">Back to the title screen</span>
                </div>
            </div>
        </main>
    );
}
