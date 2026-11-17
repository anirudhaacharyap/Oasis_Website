"use client";

import { useEffect } from "react";
import { forceJackpot } from "@/components/arcade/game";
import { scrollToLevel } from "@/lib/scroll";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/**
 * The cheat code. Up, up, down, down, left, right, left, right, B, A rigs the arcade: every machine
 * tunes to the same symbol and the five screens play the jackpot. From further down the page it
 * takes you back to the title screen first.
 */
export default function KonamiCode() {
    useEffect(() => {
        let step = 0;
        let timer: number | undefined;
        const onKey = (e: KeyboardEvent) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            step = key === KONAMI[step] ? step + 1 : key === KONAMI[0] ? 1 : 0;
            if (step < KONAMI.length) return;
            step = 0;
            const hero = document.getElementById("play");
            const away = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.5 : false;
            if (away) scrollToLevel("play");
            window.clearTimeout(timer);
            timer = window.setTimeout(forceJackpot, away ? 1100 : 0);
        };
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.clearTimeout(timer);
        };
    }, []);

    return null;
}
