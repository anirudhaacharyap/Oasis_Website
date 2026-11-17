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

OASIS is the club's own recruitment poster turned into a page, then made playable. The surface is warm black ink and a brand red band, split by thin rules, with cream type and a film of grain over everything. Halftone dots sit on the red fields and as a faint screen on the hero. The page is played, not browsed: the first screen is a row of five retro 3D arcade machines whose CRTs spell OASIS; hit one and it changes channel. The logo itself lives in the top-left plate and closes the page in the footer.

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
- **Cream** (`#f2eadb`): all primary text, the default button fill, the focus ring, the crosshair and the lock frame.
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

The hero is a three-row grid: the top band (logo plate and readout), the arcade stage, a foot band with a hairline top rule. The arcade row is centred at a whole-number pixel scale, copy sits left of the foot and actions right; nothing overlaps the row. Below 860px the hero is as tall as its content, the logo sits on top and actions stack full width. The spawn selector is a 12-column grid at 64rem: list in columns 1 to 7, the controller pad sticky in 8 to 12; below that it stacks. Project rows go from thumbnail rows (touch, narrow) to a 12-column index with a cursor-following cover preview at 1024px with fine pointer and motion allowed.

## Elevation & Depth

Flat and printed. Depth is tonal and graphic: ink versus red bands, 2px rules, halftone, and a fixed grain layer at 7% opacity over the page. There are no hard offset shadows and no glows. The only soft shadows are a blurred contact shadow under the 3D controller pad and a 1px rule under the solid nav; the nav also blurs what scrolls beneath it (10px).

### Named Rules
**The Flat Print Rule.** Surfaces never lift with shadow. Hover moves the element (2px up), never adds depth.

**The Grain Rule.** One grain layer over the whole page, normal blend, never per component.

## Shapes

Square print corners everywhere (`--radius: 0px`, applied to buttons, chips, cards, focus outlines). The single exception is shapes that are circles by nature (the `glyph` badge at 50%). Rules are 1px hairlines or solid 2px bands. Fields are rectangles; the poster feel comes from the straight edge.

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

### Hero Arcade
Five pixel-art arcade machines; see "The OASIS Arcade" below. The footer keeps the halftone dot wordmark (the bookend), which still heats and scatters under the pointer.

## Motion

Grammar: **heat and settle.** Springs for anything the hand touches; `cubic-bezier(0.23, 1, 0.32, 1)` ease-out (`--ease-out`) for everything else; `--ease-in-out` `cubic-bezier(0.77, 0, 0.175, 1)` is declared for on-screen moves. Press is 140ms; exits are faster than entries (underlines retract in 180ms, draw in 250ms). Composite properties only (translate, scale, opacity). Smooth scroll is Lenis with `lerp: 0.09`; anchor jumps use 1.2s with an expo-like ease-out.

Headings reveal with GSAP SplitText by line (masked lines, 0.9s `expo.out`, 0.08s stagger) under ScrollTrigger. The hero copy and panel rise once on load (`intro-rise`, 900ms, 24px translate only, 70ms stagger, so LCP paints at once).

**Reduced motion:** all CSS animation and transition durations collapse to 0.001ms; Lenis is not created; SplitText is not applied; the arcade is the flat 2D machines, lit and still (channel changes swap with no roll, no idle flicker, no parallax, no hitmarker); the footer dot logo falls back to the static halftone print; the project index uses thumbnail rows without the cursor preview; the nav sheet shortens to 120ms with no travel; spawn selector transitions are removed.

### Named Rules
**The Native Crosshair Rule.** The cursor is a native crosshair image on fine pointers everywhere (see Aim). Nothing follows the pointer with lag.

**The Settle Rule.** Anything that heats up must cool and return home. No effect is left running or stuck in a hot state.

## Do's and Don'ts

### Do:
- **Do** alternate ink (`#1e181e`) and brand red (`#ad0013`) bands with 2px rules and keep type cream.
- **Do** keep every corner square (0px); draw circles only where the shape is a circle.
- **Do** put hierarchy in Archivo's width axis (125 titles, 112 names, 100 body, 72 labels).
- **Do** use `cubic-bezier(0.23, 1, 0.32, 1)` for state changes and 0.97 press scale at 140ms.
- **Do** tag every mock-data surface with a "Sample data" label.
- **Do** give every motion a reduced-motion equivalent that shows the final state.

### Don't:
- **Don't** use gold for decoration, buttons or headings; it marks earned moments.
- **Don't** add offset shadows, glows or rounded corners.
- **Don't** put a gradient in the hero ground; it is flat near-black.
- **Don't** use signal red for body text on ink; it clears contrast only at large size.

## QA State (at documentation)

0 console errors; 0 serious axe violations; 60 fps on desktop and 59 fps on a throttled phone; LCP 1.6 s; CLS 0; JS 283 KB gzipped; finish review verdict "ship".


## Scroll cut (cinematic pass)

### Idea

The page is one poster you scroll through. One scroll position drives the title. The word holds, then breaks apart, and the next frame is already the club's red. After that the page is normal scroll: events, cartridges, the roster, and the controller as the last shot.

### What changed

- The title pins for a short beat on a large screen (about 60% of the viewport) while the dots spread and cool. The wheel is never locked past that beat. A phone does not pin. The same break plays as the title leaves.
- The dot wordmark reads that one value (`heroBreak`). It no longer keeps its own scroll trigger.
- The heading is the wordmark on screen. The dots and the printed mark sit inside the `h1`. The name for screen readers stays a hidden span.
- The cream block in the dock scales from its left edge instead of changing width.
- The cartridge preview and the controller watch scroll on the GSAP ticker, with the dock and the smooth scroll.
- About, the roster, and the spawn frame are at least one screen. History and the cartridges stay long, because they are lists.

### Left as they were

Sample tags, the tilted script line, no loader, no per-project pages, and the dock staying down until you leave the title.

## The print run (cinematic pass 2)

The title break now powers the arcade down (see The OASIS Arcade); the dot wordmark no longer
appears in the hero. The footer's wordmark is the last frame of the page: red ink rises and cools
into the cream word as you reach the end (`FooterMark.tsx`, `reel.footBreak`).

Tried and removed at the owner's call: a live halftone wipe between sections and committed section
snapping. Forced scrolling felt like a fight, especially scrolling back up. Scrolling stays free, on
Lenis with lerp 0.07.

## Aim: crosshair, lock frame, readout (PC)

Built for fine pointers; phones get their own pass later and see none of this.

- **Crosshair:** the cursor everywhere is a native SVG cursor (`public/cursor/crosshair.svg`), so it never lags the hand. Over a lock target it swaps to `crosshair-lock.svg`: the arms tighten and the pip turns signal red. The old hero-only thermal reticle is retired.
- **Lock frame** (`src/components/Aim.tsx`): one set of four cream corner brackets that catches a target. Priority is hover, then keyboard focus-visible, then the scroll auto-lock (the `[data-lock-auto]` target nearest 55% of the screen height). The auto-lock only highlights; it never moves focus or activates anything. A new catch starts 18px wide and snaps to 6px (`back.out`); moving between targets flies the frame in 320ms `power3.out`; a click clamps the brackets in and lets go. Reduced motion: no fly, no snap.
- **Targets:** `data-lock="Name"` marks a target (the name shows in the readout); `data-lock-auto` adds it to scroll selection; `data-lock-own` means it draws its own brackets (player tiles), so the shared frame steps aside. Auto targets: the two hero CTAs (Pick your spawn point wins the tie), the selected Join domain, Apply for <domain>, and the partner email once it is real. Hover only: the Join domain rows, event links, project links.
- **Readout:** top left, on the content edge, a small ink plate: `X 0742  Y 0388` in page coordinates (Y keeps counting as you scroll), then `LOCK › TARGET` in signal red, or `SCAN › NO TARGET`. Written on the GSAP ticker, text only when it changes.

## The OASIS Arcade (hero)

Five retro arcade machines whose CRTs spell OASIS. The machines are 3D; the retro lives in the
picture, which is 26 x 20 pixels shown through a CRT shader.

- **Machines** (`src/components/arcade/cabinet.ts`): built from code. An extruded upright side profile (base, control deck, raked CRT, marquee hood) with red T-molding tubes on every edge, pixel side art, plain lit stripes on the marquee (cream, signal, cream), a CRT behind dark glass with red light spilling onto the bezel, joystick and buttons, a coin door with lit slots and a kick plate. Lambert materials with a light 4x4 Bayer dither on a 2px grid, so the shading has a retro grain. Static parts are merged per material: about ten draw calls a machine.
- **Row** (`ArcadeScene.tsx`): five machines in a straight row, each turned to face the camera so every letter reads the same; the row only leans 1.7 degrees toward the pointer. The camera fits the row to the stage from just above the screens. Rendered sharp (antialiased, pixel ratio up to 1.5).
- **CRT picture** (`tube.ts`, shared with the 2D fallback): the machine's letter (custom 10 x 13 pixel glyph, cream with a red drop), a channel change (roll, static, pop), the jackpot, and the power band. **CRT shader**: curved glass, scanlines between pixel rows, an RGB slot mask, phosphor bloom from neighbouring pixels, a slow brightness roll, vignette, red phosphor floor and a glare; the aimed machine glows hotter.
- **Hit = change channel:** the machines are real `<button>`s laid over the projected 3D boxes (Aim lock targets `Machine O`...; the middle one is the scroll auto-target). A hit shows the hitmarker, knocks the machine back on an elastic spring and changes channel to a random game symbol (star, heart, controller, cartridge, coin, bolt); 3s untouched it changes back to its letter. The HUD counts `HITS`.
- **Jackpot:** all five on the same symbol at once (honest random). Tubes flash, pixel coins rain, the symbol blinks in a strobing red border, marquees strobe, the HUD shows `JACKPOT`, a live region announces it; after 2.8s the machines return to OASIS left to right. The Konami code rigs one.
- **Boot:** three.js loads after first paint behind a blinking INSERT COIN; every shader compiles (`compileAsync`) before the first frame. Then the marquees stutter on left to right and each CRT opens from a dot to a line to the letter.
- **Exit:** the hero pin (`reel.heroBreak`) powers the row down: tubes collapse to a line then a dot left to right, marquees die right to left, the camera eases back.
- **Performance:** one clock (GSAP ticker drives `advance()`); paused offscreen and in hidden tabs; half-rate rendering while nothing moves; a tube re-uploads its 26 x 20 picture only when it changes; no allocation in the frame loop. If the page's frame interval averages over 24ms the resolution steps to 75%, then 60%, and the canvas scales up as hard pixels. Measured on a laptop RTX 3050: 60fps idle, clicking and scrolling at full resolution, and still 60fps with the CPU throttled 4x (the main thread is about 95% idle). On a machine with no GPU at all (software rendering) it steps down and runs about 24fps.
- **Fallback** (`Arcade2D.tsx`): phones (until their own pass), reduced motion and no WebGL get the same five machines as whole-pixel SVG art with the same tubes and game.
- **Logo:** the wordmark left the hero. It sits small in the top-left plate (`TopMark`, a link back to the title screen) beside the Aim readout, and closes the page as the footer bookend.

## Dock peek and the hero lock (PC)

- **Peek:** over the title screen the dock shows only the bare star glyph, centred at the bottom, in 70% cream with no tile, border or track, and one soft chevron under it stepping down (1.6s loop). It is the quietest thing on the screen on purpose. Clicking the star there starts the run (scrolls to About). Once you scroll past 55% of the hero, the star slides left and the whole bar unrolls out of it: `translate` to the dock's place and a `clip-path` opening from the star's width, 620ms `--ease-out`; rolling back up is 380ms. Keyboard focus opens the bar at once (`:has(:focus-visible)`), a mouse click does not. Phones keep the plain behaviour until their own pass.
- **Hero lock follows the crosshair:** with the crosshair on no machine, the arcade's scroll lock goes to the machine horizontally nearest the pointer (`holdNearest` in `game.ts`), so aiming past the far right holds the right machine instead of snapping to the middle one; leaving the hero keeps the last. Aim rechecks auto-targets every 100ms.

## Boot loader (PC)

The arcade's 3D has to load, so the title screen boots like a CRT (`src/components/arcade/BootLoader.tsx`, mounted in `page.tsx` outside the pinned hero).

- **Look:** full-screen ink with scanlines, a vignette and a faint flicker. A giant counter (Archivo 900, wdth 125, tabular) with a constant signal-red split; every 0.26 to 0.9s a glitch tears a random horizontal slice sideways for 60 to 130ms. A 24-block pixel progress bar (the next block glows red). Corner readouts in the HUD's voice: `OASIS // BOOT`, the club line, a blinking `INSERT COIN`, and the stage.
- **Honest progress** (`loading.ts`): page 15, fonts 20, 3D code arrived and mounted 30, every shader compiled and the first frame drawn 35. The stage line names the real step (Loading type, Loading cabinets, Warming the tubes, Ready). The counter never runs ahead of real progress, takes at least 1.2s so it reads, and leaves at 6s whatever happens (the arcade then shows INSERT COIN until it lands). A CSS failsafe hides it at 9s; no-JS never sees it.
- **Exit (about 0.75s):** a hard tear, then the tube switches off: it flares cream while squeezing to a bright line (`scaleY`, 300ms `power3.in`), the line shrinks to a dot (`scaleX`, 200ms), and the arcade behind it powers on (marquees stutter on, CRTs open) as the hero copy rises. The arcade boot and the copy's rise both wait for the loader.
- **Where:** PC-sized screens with motion allowed only. Phones (2D arcade, nothing heavy to load), reduced motion, and reloads that land below the hero skip it. Scrolling is locked while it runs. Measured cold load on the laptop GPU: 100 at about 1.9s, gone by about 2.7s.
