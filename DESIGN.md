---
name: OASIS
description: A printed recruitment poster you can play with. Warm ink and brand red, cream type, halftone and grain, one wordmark made of heat-reactive dots.
colors:
  ink: "#1e181e"
  ink-2: "#2a222a"
  ink-void: "#070607"
  brand-red: "#ad0013"
  red-deep: "#7c000e"
  signal: "#e5323a"
  cream: "#f2eadb"
  cream-2: "#e3d6c3"
  gold: "#c9a35b"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 1.2rem + 4.2vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 1.2rem + 1.6vw, 2.75rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.8rem)"
    fontWeight: 900
    lineHeight: 1.02
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 112"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "'wdth' 100"
  lede:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 1.05rem + 0.5vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 72"
  script:
    fontFamily: "Mr Dafoe, cursive"
    fontSize: "clamp(1.7rem, 1.1rem + 1.4vw, 2.6rem)"
    fontWeight: 400
    lineHeight: 1
rounded:
  none: "0px"
  circle: "50%"
spacing:
  gutter: "clamp(1.25rem, 4vw, 2.5rem)"
  nav: "4.5rem"
  section: "clamp(5rem, 10vw, 8rem)"
  max: "80rem"
components:
  button-primary:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "3rem"
    padding: "0 1.35rem"
  button-red:
    backgroundColor: "{colors.brand-red}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    height: "3rem"
    padding: "0 1.35rem"
  button-signal:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
  chip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "0.35rem 0.65rem"
  card-ink:
    backgroundColor: "{colors.ink-2}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "clamp(1.4rem, 2.5vw, 2rem)"
---

# Design System: OASIS

## Overview

**Creative North Star: "Press Start, Printed"**

OASIS is the club's own recruitment poster turned into a page, then made playable. The surface is warm black ink and a brand red band, split by thin rules, with cream type and a film of grain over everything. Halftone dots sit on the red fields and as a faint screen on the hero. The page is played, not browsed: the first screen is the wordmark itself, built from halftone dots that heat, scatter and settle under the hand.

The system is flat, square and printed. There are no soft cards, no rounded corners, no glow. Depth comes from alternating ink and red bands, 2px rules, and grain. Colour is rationed: cream carries text, signal red carries heat and large display type, gold appears only where something has been earned.

**Key Characteristics:**
- Ink and brand-red bands alternate below a flat near-black hero; cream type throughout.
- Archivo on its width axis (expanded for display, condensed for labels) plus one retro script (Mr Dafoe), used once per surface.
- Grain over the whole page (7% opacity), halftone on red and signal fields.
- Square corners everywhere; round shapes are drawn only as true circles.
- Motion verb is "heat and settle": springs for what the hand touches, strong ease-out for everything else.
- Mock content is always tagged "Sample data".

## Colors

A warm ink and brand-red poster palette, cream type, one gold reserved for earned moments.

### Primary
- **Brand Red** (`#ad0013`): the band colour for About, Projects and Join, the primary button fill, the scrollbar thumb, and 2px section rules. Cream on it is 6.2:1.
- **Signal Red** (`#e5323a`): heat. Large display type on ink (4.1:1, large text only), the hero script line, hover colour of the nav wordmark, hover and selection borders, the selection highlight, and the optional signal field.

### Secondary
- **Red Deep** (`#7c000e`): the far end of the red band gradient. Never text.

### Neutral
- **Ink** (`#1e181e`): the page ground, History and Members bands, the nav bar once solid, chips and the underline on red bands. Cream on ink is 15:1.
- **Ink 2** (`#2a222a`): raised surfaces on ink (history cards, popovers) and the top highlight of the ink band gradient.
- **Ink Void** (`#070607`): the hero ground only. With grain and the faint halftone on top it nets about `#0B0A0B`. Flat, no gradient.
- **Cream** (`#f2eadb`): all primary text, the default button fill, the focus ring and the cursor reticle.
- **Cream 2** (`#e3d6c3`): secondary text and labels (12:1 on ink, 5:1 on red).
- **Rules**: cream at 16% for hairlines, 38% for strong borders; brand red as a solid 2px band divider.

### Tertiary
- **Gold** (`#c9a35b`): the history timeline stroke and markers and the member-photo corner frames. Nowhere else.

### Named Rules
**The Earned Gold Rule.** Gold marks something achieved or kept: a milestone on the timeline, a framed member. It never decorates, never fills a button, never colours a heading.

**The Heat Rule.** Signal red means heat or attention (motion speed, hover, selection, the hero script). It is not a second brand fill; bands use Brand Red.

**The Cream Text Rule.** Text is cream or cream 2 on every field. No grey text, no opacity-faded copy on red; the contrast pairs above are the floor.

## Typography

**Display Font:** Archivo (variable, width axis 62 to 125), with ui-sans-serif, system-ui
**Body Font:** Archivo at width 100
**Label Font:** Archivo at width 72 (condensed)
**Script Font:** Mr Dafoe, once per surface, never in body

**Character:** A wide, black-weight poster face against a condensed, tabular label voice, with one hand-lettered script as the human signature. The width axis does the work a second family usually would.

### Hierarchy
- **Mega** (900, `clamp(3.5rem, 1rem + 13vw, 15rem)`, 0.92, wdth 125, caps): reserved for a single hero-scale word.
- **Display** (900, `clamp(2.4rem, 1.2rem + 4.2vw, 6rem)`, 0.92, -0.035em, wdth 125, caps): section titles. Max 6rem.
- **Headline** (900, `clamp(1.6rem, 1.2rem + 1.6vw, 2.75rem)`, 1.0, -0.025em, wdth 125): sub-sections.
- **Title** (900, `clamp(1.6rem, 3vw, 2.8rem)`, 1.02, -0.03em, wdth 112): project index names. Domain names in the spawn selector use wdth 125 at `clamp(1.8rem, 4.5vw, 4rem)`.
- **Lede** (400, `clamp(1.15rem, 1.05rem + 0.5vw, 1.5rem)`, 1.45, cream 2): max 62ch.
- **Body** (400, 1.0625rem, 1.55, wdth 100): max 62ch, `text-wrap: pretty`; headings `text-wrap: balance`.
- **Label** (700, 0.8rem, 0.06em, wdth 72, caps, tabular numerals, cream 2): dates, kinds, engines, counts, the "Sample data" tag. Labels carry information only.
- **Script** (Mr Dafoe 400, `clamp(1.7rem, 1.1rem + 1.4vw, 2.6rem)`, signal, rotated -3deg): the hero's "Gaming & Game Dev" line.

### Named Rules
**The Width Axis Rule.** Hierarchy is made with Archivo's width, not new families: 125 expanded for titles, 72 condensed for labels, 100 for reading.

**The One Script Rule.** Mr Dafoe appears once, in the hero, in signal red. It is a signature, not a texture.

## Layout

A single column page of full-bleed bands inside an 80rem container (`min(80rem, 100% - 2 * gutter)`), gutter `clamp(1.25rem, 4vw, 2.5rem)`. Sections breathe on `clamp(5rem, 10vw, 8rem)` of vertical padding; headers separate from content with a 2px rule. The fixed nav is 4.5rem tall and sets `scroll-padding-top`.

The hero is a three-row grid: nav, logo stage, a foot band with a hairline top rule. The wordmark is centred and huge (about 78vw), copy sits left of the foot and actions right; nothing overlaps the logo. Below 860px the hero is as tall as its content, the logo sits on top and actions stack full width. The spawn selector is a 12-column grid at 64rem: list in columns 1 to 7, the controller pad sticky in 8 to 12; below that it stacks. Project rows go from thumbnail rows (touch, narrow) to a 12-column index with a cursor-following cover preview at 1024px with fine pointer and motion allowed.

## Elevation & Depth

Flat and printed. Depth is tonal and graphic: ink versus red bands, 2px rules, halftone, and a fixed grain layer at 7% opacity over the page. There are no hard offset shadows and no glows. The only soft shadows are a blurred contact shadow under the 3D controller pad and a 1px rule under the solid nav; the nav also blurs what scrolls beneath it (10px).

### Named Rules
**The Flat Print Rule.** Surfaces never lift with shadow. Hover moves the element (2px up), never adds depth.

**The Grain Rule.** One grain layer over the whole page, normal blend, never per component.

## Shapes

Square print corners everywhere (`--radius: 0px`, applied to buttons, chips, cards, focus outlines). The single exception is shapes that are circles by nature (the `glyph` badge at 50%, reticle ring). Rules are 1px hairlines or solid 2px bands. Fields are rectangles; the poster feel comes from the straight edge.

## Components

### Buttons
- **Shape:** square (0px), 3rem minimum height, 0 1.35rem padding, Archivo 800 at wdth 110, 0.95rem, uppercase.
- **Primary:** cream on ink text (default). `button-red` is Brand Red with cream text and is the hero's "Pick your spawn point". `button-signal` is signal with ink text for use on red.
- **Ghost:** transparent with a 1.5px inset currentColor outline ("Partner with us").
- **Hover / Press:** on fine pointers lifts 2px (200ms ease-out); on press scales to 0.97 (140ms, 100ms answering) and returns. External arrows travel 3px up and right. No offset shadow.
- **Focus:** 2px cream outline, 3px offset, square.

### Labels and Chips
- **Label:** condensed caps in cream 2, the voice for dates, kinds and counts. "Sample data" tags use this voice and are required wherever mock data renders.
- **Chip:** ink fill, cream text, 700 weight, 0.35rem 0.65rem padding, square. Team lists on project rows.

### Navigation
Fixed 4.5rem bar. At the hero the nav wordmark is hidden (`visibility: hidden`) because the hero logo is the brand on screen; it appears and the bar turns solid ink with a 1px rule once the hero logo has left. The bar slides away on scroll down. Links are Archivo 500 with an underline that draws from the left (250ms in, 180ms out). Under 860px, links collapse to a "Menu" button opening a full-screen ink sheet whose rows are 900-weight wdth-125 caps with 2px red rules; it enters with a 320ms `cubic-bezier(0.32, 0.72, 0, 1)` slide.

### Domain Spawn Selector
A stacked list of the five domains as huge expanded caps with 2px ink rules between rows, on the red Join band. Selecting a row slides the name 0.3em, draws a 2px ink underline left to right (240ms) and reveals a chevron; hover nudges unselected rows 0.2em. Selection drives the controller pad at right (3D when ready, static SVG fallback), a "Player 1" label and the domain name, then one red-on-red-band call to action. A hint line swaps between pointer and touch copy.

### Project Index
Cartridge rows on the red band, separated by 2px ink rules. Each row: name (wdth 112, 900), meta, year. An ink bar fills 4px under the row on focus or expansion; rows expand with a `grid-template-rows` 0fr to 1fr transition (300ms ease-out) showing pitch, team chips and a link. Desktop with fine pointer shows a cover preview following the cursor; touch and reduced motion fall back to thumbnail rows. Press scales the name to 0.97.

### Player Select (Members)
Ink band; members framed with 14px gold corner brackets (earned) and a "Sample data" label while members are mock.

### Hero Dot Logo and Cursor
The wordmark is a sheet of halftone dots drawn in WebGL with a halftone-masked SVG print as fallback (also used for reduced motion and no WebGL). Dots are springs: stiffness 0.055, 0.84 velocity kept per 60fps frame (slight overshoot), cooling 0.955 per frame. The pointer is lerped (0.35 per frame); scatter radius is `62 + min(speed*5, 120)` px; heat is `min(1, speed*0.05)` and runs cream, red, signal. A press bursts heat outward in a 170px radius. A heat wave rides the star's arc about every 6s; the intro is the dots assembling in about 1.1s; scrolling away drifts them apart and cools them. On touch, a slow virtual pointer wanders the logo when idle.

The reticle cursor is a 28px ring with four ticks (3px gap, 5px long) that opens up to a maximum 360px diameter and matches the scatter radius over the logo, with a pulse ring on press. It exists only inside the hero, only on `(hover: hover) and (pointer: fine)` with motion allowed, and the native cursor is hidden only while it runs.

## Motion

Grammar: **heat and settle.** Springs for anything the hand touches; `cubic-bezier(0.23, 1, 0.32, 1)` ease-out (`--ease-out`) for everything else; `--ease-in-out` `cubic-bezier(0.77, 0, 0.175, 1)` is declared for on-screen moves. Press is 140ms; exits are faster than entries (underlines retract in 180ms, draw in 250ms). Composite properties only (translate, scale, opacity). Smooth scroll is Lenis with `lerp: 0.09`; anchor jumps use 1.2s with an expo-like ease-out.

Headings reveal with GSAP SplitText by line (masked lines, 0.9s `expo.out`, 0.08s stagger) under ScrollTrigger. The hero copy and panel rise once on load (`intro-rise`, 900ms, 24px translate only, 70ms stagger, so LCP paints at once).

**Reduced motion:** all CSS animation and transition durations collapse to 0.001ms; Lenis is not created; SplitText is not applied; the hero cursor is not created; the dot logo falls back to the static halftone print; the project index uses thumbnail rows without the cursor preview; the nav sheet shortens to 120ms with no travel; spawn selector transitions are removed.

### Named Rules
**The Hero-Only Cursor Rule.** The custom cursor lives in the hero and nowhere else. Every other surface keeps the native cursor.

**The Settle Rule.** Anything that heats up must cool and return home. No effect is left running or stuck in a hot state.

## Do's and Don'ts

### Do:
- **Do** alternate ink (`#1e181e`) and brand red (`#ad0013`) bands with 2px rules and keep type cream.
- **Do** keep every corner square (0px); draw circles only where the shape is a circle.
- **Do** put hierarchy in Archivo's width axis (125 titles, 112 names, 100 body, 72 labels).
- **Do** use `cubic-bezier(0.23, 1, 0.32, 1)` for state changes and 0.97 press scale at 140ms.
- **Do** tag every mock-data surface with a "Sample data" label.
- **Do** hide the nav wordmark while the hero logo is on screen.
- **Do** give every motion a reduced-motion equivalent that shows the final state.

### Don't:
- **Don't** use gold for decoration, buttons or headings; it marks earned moments.
- **Don't** add offset shadows, glows or rounded corners.
- **Don't** extend the custom cursor beyond the hero.
- **Don't** put the hero logo and nav wordmark on screen together.
- **Don't** put a gradient in the hero ground; it is flat near-black.
- **Don't** use signal red for body text on ink; it clears contrast only at large size.

## QA State (at documentation)

0 console errors; 0 serious axe violations; 60 fps on desktop and 59 fps on a throttled phone; LCP 1.6 s; CLS 0; JS 283 KB gzipped; finish review verdict "ship".
