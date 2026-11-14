# OASIS: design system (red rebuild)

The previous grey "lab door" pass is preserved on branch `backup/grey-redesign`.

## Brief

- **Subject:** OASIS, the esports and game development club of NMIT, Bengaluru.
- **Audience:** NMIT students deciding whether to join, plus recruiters and other colleges
  looking at what the club has built and won.
- **Job:** a single landing page that tells the club's story in order: what we do, who we are and
  what we've run, what we've built, who's in it, and how to join.
- **Assets:** the club logo (gold wordmark with a shooting-star arc, on red). It is a colour and
  motif reference only and is **not** shipped. No copyrighted game characters.
- **Constraints:** matte red ground and gold as the brand pair. A real 3D game controller in the
  hero that drives the "what we do" carousel. Mock content for now (`mock: true` in `src/data`).
  Easter eggs are deferred. Native cursor stays.
- **Reference feel (from the owner):** therechabite.com.au and secure-the-unknown.cyera.com, for
  their bold field colour, theatrical scroll storytelling and confident motion. Not their content.

## Concepts

| | A. Press start (material) | B. The star's path (name / logo) | C. Save files (process) |
|---|---|---|---|
| Idea | The site is played, not browsed: one controller in your hands, each chapter a level. | The logo's shooting star draws one gold trajectory through the whole story. | The club's history as save slots you load one by one. |
| Anchor | The club plays and makes games, and a controller is the object both halves share. | The real OASIS logo: a star trailing a gold arc. | Clubs keep records year to year, like save files. |
| Signature | The 3D controller is the remote: its D-pad and face buttons drive the hero carousel. | A gold arc draws itself down the page and the star lands on each chapter. | Loading a slot fills a progress bar and opens that year. |
| Emotion | You picked it up and it answered. | Momentum, a launch. | Nostalgia. |
| Screenshot | A matte red controller floating over a giant ESPORTS word. | A gold arc slicing across a red page. | A grid of save slots. |
| O / F / Fe / P | 4 / 5 / 4 / 2 | 4 / 4 / 4 / 2 | 3 / 3 / 5 / 3 |

**Pick A.** It answers the owner's own request (the controller as the hero toy), it is specific to
a gaming club, and it produces a full rule system: levels, a HUD, button-press motion and a
"press A" finale. **Steal from B** for the event history: the logo's gold arc becomes the
timeline line, and the star rides its tip.

Genericness test. The generic version is a dark neon esports skin (black, RGB glow, glitch type)
or a template with a red hero. What we changed: matte red as a *material*, not a glow; no neon,
no glitch, no gradients. Gold is the only accent, used like foil stamping. The 3D object does a
job (it is the navigation), so it isn't decoration.

## Concept card

```
Idea:        OASIS is played, not browsed. One controller, five levels.
Metaphor:    a console title screen that runs into a game's level select
Signature:   the 3D controller drives the "what we do" carousel (D-pad = prev/next, A = open)
Emotion:     you picked it up and it answered
Motion verb: press and snap (a quick press-in, then a crisp slide that settles)
Screenshot:  a matte red controller floating over a giant gold-edged ESPORTS
```

## Story (one page, five levels)

| Level | Section | Layout family | What it says |
|---|---|---|---|
| Title | Hero: controller + "what we do" carousel | Scene + carousel | The four things OASIS does, played with the controller |
| 1 | Who we are | Statement | One manifesto paragraph, set big |
| 2 | Event history ("Save files") | Sticky narrative + gold arc timeline | Every event the club has run, newest first |
| 3 | Projects ("Cartridges") | Index list + cursor preview | Games and tools members built |
| 4 | Members ("Player select") | Roster grid + detail panel | The people, as a character select |
| Finale | Join ("Press A") | Poster / footer as finale | One action |

A fixed HUD (top right) shows the current level, and the controller's D-pad works as a level
jump once the hero is passed.

## System

### Palette

Taken from the logo (red field, gold mark), polished down to a matte finish.

| Role | Hex | Use | Contrast |
|---|---|---|---|
| `ground` | `#A3161D` | matte red, the main field | n/a |
| `ground-deep` | `#6E0D12` | event history, alternating depth | n/a |
| `void` | `#1C0507` | player select, the curtain | n/a |
| `ink` | `#F7ECDA` | bone: body and UI text | 6.5:1 on ground |
| `muted` | `#F0D3C4` | secondary text | 5.5:1 on ground |
| `gold` | `#C8A15A` | display type, lines, star (large only on `ground`) | 3.3:1 on ground, 4.6:1 on deep |
| `line` | `rgba(247,236,218,0.2)` | hairlines | n/a |

Rule: gold is never small text on `ground`. Small gold appears only on `ground-deep` or `void`.
The finale inverts to a gold field with `ground-deep` text (4.6:1).

Matte finish: a fixed, very fine film-grain overlay (an SVG noise tile at 4 to 6% opacity) and a
soft top-light vignette. No gloss, no gradients on type.

### Type

| Role | Family | Source | Notes |
|---|---|---|---|
| Display | Unbounded 700/800 | Google | wide and rounded, echoes the logo's chunky letterforms; tracking -0.04em at mega |
| Text | Instrument Sans 400/500/600 | Google | 17 px body, 1.5 leading |
| HUD | Martian Mono 400/500 | Google | 12 to 13 px labels that carry real information (level, dates, engine) |

Scale: `--t-mega clamp(3.5rem, 1rem + 13vw, 15rem)`, `--t-xl clamp(2.4rem, 1.2rem + 4.4vw, 6rem)`,
`--t-l clamp(1.6rem, 1.2rem + 1.6vw, 2.75rem)`, body 1.0625rem.

### Grid, shape, motion

- 12 columns, gutter `clamp(1.25rem, 4vw, 2.5rem)`, content max 80rem. Text hangs from columns 1
  and 7.
- **Radius:** 6px on the controller-derived UI (buttons, tiles), 0 on sections and images. The
  controller is rounded and the page is a hard field.
- **Ease:** `snap = cubic-bezier(0.2, 0.9, 0.25, 1)` for slides and reveals;
  `press = cubic-bezier(0.4, 0, 0.6, 1)` for 90 ms press-ins.
- **Durations:** press 90 ms in and 260 ms out; carousel slide 0.7 s; reveals 1.0 to 1.2 s with
  60 ms stagger; level background change 0.9 s, scrubbed.
- **Press and snap in practice:** buttons dip 2px and darken on press, then spring back. Carousel
  slides move as one strip and settle with a slight overshoot. Primary links get a gold underline
  that snaps in from the left.
- **Idle:** the controller floats and sways a few degrees, leaning toward the pointer. Its scene
  pauses off screen and is replaced by a static image under reduced motion. A Pause button sits in
  the hero because the float loops.

### 3D

React Three Fiber + drei, lazy-loaded after first paint. The controller is modelled procedurally:
an extruded rounded body, a D-pad, four face buttons, two sticks, bumpers, and a gold star
emblem. Materials are physical, roughness about 0.55 with a light clearcoat (polished matte).
Lighting is drei `Environment` with local `Lightformer`s only, so nothing is fetched. The frame
loop is driven from `gsap.ticker` (one clock). DPR is capped at 1.75, and the canvas only renders
while visible.

**Fallback** (reduced motion, no WebGL, or before load): a static SVG of the same controller with
working DOM buttons. The carousel always has accessible DOM prev/next buttons, keyboard arrows,
and swipe on touch.

## Build phases

1. **Foundation:** tokens, fonts, mock data, static page skeleton for every level, cleanup of the
   old pages and components.
2. **Hero:** the 3D controller, the controller-driven carousel, and the static fallback.
3. **Levels:** who we are, event history, projects, members, finale.
4. **Motion and continuity:** level HUD, scroll story, background changes, reveals, phone menu,
   404, OG image.
5. **QA:** production build, screenshots, audit, an outside critic, and fix passes.

## QA status (production build, awwwards shoot + audit)

- 0 console errors, 0 serious axe violations, no overflow, 0 small tap targets, every focus stop
  visible, every primary hover reacts, 0 text hidden under reduced motion. Audit: 0 FAIL, 0 WARN.
- Desktop 60 fps, throttled phone 60 fps, phone LCP 1.8 s, CLS 0. Page weight ~373 KB (JS 244 KB gz);
  three.js loads lazily after first paint.
- **Idle motion is a decision:** the pad floats and leans toward the pointer at rest. It pauses off
  screen, pauses during scroll on phones, halves its rate while scrolling on desktop, has a visible
  Pause button, and is replaced by a static SVG under reduced motion or without WebGL.
- Outside critic (fresh agent, screenshots only), scored before the final performance and
  legibility fixes: 7.35 overall (Design 7.5, Usability 7, Creativity 8, Content 6.5). It read the
  idea correctly. Its top remaining asks are content: real join/Discord links, real member photos,
  and real project images.
