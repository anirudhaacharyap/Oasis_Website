# 🏝️ OASIS — Gaming Club Website

A premium, cinematic landing page for **OASIS**, a college gaming club. Built with **Next.js 16**, **GSAP**, and **Tailwind CSS**, featuring pixel art aesthetics, scroll-driven animations, and interactive elements.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![GSAP](https://img.shields.io/badge/GSAP-3.x-88CE02?logo=greensock)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)

---

## 🎮 Features

### 🏠 Start Screen (Hero)
- Full-screen cinematic intro with scroll-pinned GSAP timeline
- Animated pixel-art title with letter-by-letter reveal
- Custom retro pixel cursors (default, pointer, text)
- Smooth rainbow arc decoration
- Draggable gaming characters (Mario, Pikachu, Pac-Man, Space Invader, Wizard, Robot)
- Clickable coin blocks with particle burst effects
- Konami Code easter egg (↑↑↓↓←→←→BA)
- Mouse-follow particle trail effect

### 📖 Origin Section ("Who We Are")
- Dark mode cinematic section with pinned scroll
- 7 premium animations:
  - **Parallax depth layers** — far & mid-ground moving at different scroll speeds
  - **Title clip-reveal** — "WHO WE ARE" wipes in from left-to-right
  - **Text card boot-up** — card reveals from bottom with border draw-in
  - **Color bleed glow** — pulsing glow on "OASIS" text, halos on accent words
  - **Noise texture overlay** — SVG fractalNoise grain at 3.5% opacity
  - **Scroll-linked particles** — 30 ascending particles in mint/purple/blue
  - **Horizontal gradient divider** — draws itself between title and text
- Custom mascot with idle bob animation
- Rich background decorations (pixel shapes, gaming icons, orbs, connection lines)

### ⚡ What We Do
- 4 feature cards: **Game Dev**, **Esports**, **Community**, **Workshops**
- SaaS-inspired card design with:
  - Large visual header area with grid pattern & floating pixel dots
  - Centered icon with hover scale + rotate
  - Number badge and "EXPLORE →" button
  - Colored border glow on hover
- Rich animated background:
  - Pixel clouds drifting across the viewport
  - Floating geometric shapes (squares, circles, triangles, diamonds)
  - Twinkling pixel stars
  - Gaming icons and code snippets
  - Pulsing radial glows
  - Two parallax depth layers

### 🎪 Events Section
- Scroll-animated event showcase

### 🤝 Collabs Section
- Collaboration highlights

### 🏆 Victory Section (Footer)
- Closing cinematic scroll

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework, SSR, routing |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling with custom theme |
| **GSAP + ScrollTrigger** | Scroll-driven animations, pinned timelines |
| **Custom SVG Art** | Pixel cursors, mascot, decorations |

---

## 🎨 Design System

### Theme Colors
- **Background**: `#0a0a0f` (dark), `#EAF6FF` (light sections)
- **Accent Mint**: `#9EE6CF`
- **Accent Purple/Lavender**: `#C9C3F5`
- **Accent Pink**: `#F6B6C8`
- **Accent Blue**: `#9FA8FF`
- **Accent Yellow**: `#FFF1A8`

### Fonts
- **Pixel Font**: `"Press Start 2P"` — headings, titles, buttons
- **Body Font**: `"Inter"` — descriptions, paragraphs

---

## 📁 Project Structure

```
oasis-website/
├── public/
│   └── assets/           # SVG characters, cursors, mascot
├── src/
│   ├── app/
│   │   ├── globals.css   # Theme, keyframes, custom utilities
│   │   ├── layout.tsx    # Root layout with fonts
│   │   └── page.tsx      # Main page composition
│   ├── components/
│   │   ├── scenes/       # Page sections
│   │   │   ├── StartScreen.tsx
│   │   │   ├── Origin.tsx
│   │   │   ├── WhatWeDo.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── Collabs.tsx
│   │   │   └── Victory.tsx
│   │   ├── CoinBlocks.tsx
│   │   ├── DraggableCharacter.tsx
│   │   ├── KonamiCode.tsx
│   │   ├── NavIsland.tsx
│   │   ├── PixelTrail.tsx
│   │   └── ScrollEngine.tsx
│   └── lib/
│       └── gsap.ts       # GSAP + ScrollTrigger setup
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/anirudhaacharyap/Oasis_Website.git
cd Oasis_Website

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

### Build for Production

```bash
npm run build
npm start
```

---

## 📋 Development Progress

### Milestone 1: Project Scaffolding
- [x] Next.js 16 + TypeScript + Tailwind CSS 4 setup
- [x] GSAP + ScrollTrigger integration
- [x] Custom theme with pixel art color palette
- [x] Google Fonts integration (Press Start 2P, Inter)

### Milestone 2: Start Screen (Hero)
- [x] Full-screen cinematic hero with scroll-pinned timeline
- [x] Animated pixel title with letter-by-letter reveal
- [x] Welcome text with staggered line animation
- [x] Background gradient with moving elements

### Milestone 3: Interactive Elements
- [x] Draggable gaming characters (6 SVG characters)
- [x] Clickable coin blocks with particle effects
- [x] Konami Code easter egg
- [x] Mouse-follow particle trail
- [x] Custom retro pixel cursors

### Milestone 4: Origin Section
- [x] Dark mode cinematic section
- [x] Custom mascot integration (SVG)
- [x] Rich background decorations
- [x] Text content with gaming club description

### Milestone 5: Premium Origin Animations
- [x] Parallax depth layers
- [x] Title clip-reveal wipe animation
- [x] Text card boot-up effect
- [x] Color bleed glow on accent text
- [x] Noise/grain texture overlay
- [x] Scroll-linked particle system (30 particles)
- [x] Horizontal gradient divider animation

### Milestone 6: What We Do Section
- [x] 4 feature cards (Game Dev, Esports, Community, Workshops)
- [x] SaaS-inspired card design with visual headers
- [x] Rich animated background (clouds, shapes, stars)
- [x] Parallax depth layers
- [x] Scroll-animated card reveal

### Milestone 7: Additional Sections
- [x] Events section
- [x] Collabs section
- [x] Victory / footer section

---

## 🎯 Key Animations

| Animation | Technique | Section |
|-----------|-----------|---------|
| Pinned scroll timeline | GSAP ScrollTrigger `pin: true, scrub` | All sections |
| Parallax depth | Multiple layers at different scroll speeds | Origin, WhatWeDo |
| Clip-path reveal | `clipPath: inset()` animation | Origin title |
| Boot-up effect | Bottom-to-top clipPath + border draw | Origin text card |
| Particle system | CSS `particle-drift` + GSAP fade | Origin |
| Cloud drift | CSS `fly-right` keyframes | WhatWeDo |
| Glow pulse | CSS `glow-pulse` keyframes | Origin accent text |
| Floating elements | CSS `float` keyframes | All sections |
| Drag & drop | Pointer events + state tracking | StartScreen characters |

---

## 📄 License

This project is part of the OASIS Gaming Club initiative.

---

*Built with ❤️ and lots of pixels*
