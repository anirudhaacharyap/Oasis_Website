---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

## Scope
Home page (`/`), the single landing page. Mode: **Persuade**. Build path: code-led (no image generation in this harness).

## Audience, job, action
NMIT students deciding whether to join, plus sponsors and partners, with equal weight. Two exits:
- **Recruitment:** https://oasis-rec.vercel.app
- **Partner contact:** placeholder

Proof: the five real domains and the wordmark. Everything in `src/data` is mock and stays marked.

## Direction contract
THESIS: OASIS is played, not browsed. The first screen IS the club's wordmark, printed as a sheet of halftone ink dots that reacts to your hand: dots warm up and scatter under the cursor, then cool and settle home. It refuses the category defaults of a dark neon esports skin, a 3D object fighting the copy, and a hero carousel of tabs.

OWN-WORLD:
- **Hero:** a flat warm black `#0B0A0B` with the poster's retro print filter (grain plus a faint halftone). No gradients.
- **Below the hero:** the bands alternate ink `#1E181E` and brand red `#AD0013`, cream `#F2EADB` type, with signal red `#E5323A` only for heat and large display type.
- **Gold:** only where something is earned.
- **Type:** Archivo expanded and condensed, plus one retro script.
- **Shape:** square print corners.

STORY: in one screen the visitor meets OASIS, plays with it, and leaves through "Pick your spawn point" (recruitment) or "Partner with us". Below, they learn who we are, what we have run and built, and who is in it. They pick a domain at Join with the controller.

FIRST VIEWPORT:
- **Centre:** the OASIS wordmark built from halftone dots, centred and huge (about 78vw, slightly above centre), cream on black.
- **The star:** its dots glint, and a heat wave rides its arc every ~6s.
- **Below the logo, left:** the script "Gaming & Game Dev" and one line ("NMIT's esports and game development club, Bengaluru").
- **Below the logo, right:** "Pick your spawn point" (red, primary) and "Partner with us" (ghost).
- **Cursor:** a thermal reticle replaces the cursor inside the hero only.
- Nothing overlaps the logo.

FORM: pinned by the owner. `seed: none (pinned)`. Quote: "go with A… Huge is a good idea… when they hover through it, they get some crazy very buttery smooth animations", "go with black… don't go with some brownish gradient", "go with a custom cursor… only for the hero section".
- **Signature interaction:** halftone dots scatter from the cursor on springs, heat cream to red to signal by speed, then cool and settle with a slight overshoot.
- **Motion grammar:** heat and settle. Springs for anything the hand touches, ease-out `cubic-bezier(0.23,1,0.32,1)`, one clock, composite-only, exits faster than entries. The intro is the dots assembling, about 1.1s. The scroll exit is the dots drifting apart and cooling.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Partner contact channel: placeholder.
- Discord and socials: placeholders.
- Real events, projects, members and photos: mock.
