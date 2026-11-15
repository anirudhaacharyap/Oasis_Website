# OASIS website — notes for design

Hey. The site is up, and I am not happy with how it looks. It came out white and washed out, like a blank template with the club name dropped on it. It does not feel like OASIS.

You already know the club: the theme, the colors, and the pages. Use that. Do not try to match the current site. I need a Figma design I can build from.

This is the esports and game development club at NMIT. The site is for students who play, students who make games, and anyone curious enough to show up. Beginners are welcome. Nobody needs a rank or a finished game.

The site has to do four things:

- Make someone feel they have landed in the club, in the first screen.
- Show what we actually do: game dev, esports, community, workshops.
- Show what is happening: events, results, the people, photos.
- Give a clear way to join, and a clear way into Discord, once those links exist.

## What I want it to feel like

Playful, loud enough to be a gaming club, and still easy to read. Someone should want to poke the page, then be able to find the next event without hunting.

Body text has to stay readable. Display type can be more game-like. Phone and desktop both matter. Most people will open this on a phone.

## Home

The first screen is the OASIS name. That is the interaction. Five letters, each one its own target. Hover, tap, or keyboard focus should change that letter: color, lift, or whatever fits the club look. Keep the letters focusable.

Under the name, one short line: esports and game dev club, NMIT. Then one cue to scroll into the page. Do not put a paragraph, a join button, or a photo on top of the name. The name is the screen.

On the home page, the navigation can stay hidden over that first screen and come in once the person scrolls. On every other page it stays visible. Phone needs a menu.

After the hero, the home page is short. These blocks, in this order:

1. **Who we are.** A club for players and people who make games. Scrims, game jams, workshops, and LAN nights at NMIT. Leave room for a few numbers (members, events, titles). Those numbers stay blank until the club confirms them. Do not design fake counts as if they are real.
2. **What we do.** Four cards.
   - Game dev: Unity, Unreal, Godot. Mechanics, physics, storytelling. Small projects people actually ship. Links toward game jams.
   - Esports: Valorant, BGMI, and whatever else we run. Scrims, coaching, inter-college tournaments. Links toward results.
   - Community: LAN nights, watch parties, Discord. Links toward the gallery.
   - Workshops: engines, level design, pixel art, streaming setups. Links toward the schedule.
3. **What's next.** Up to three upcoming events, plus a link to the full events page. If nothing is scheduled, the block should still look finished and say so.
4. **Sponsors and college partners.** A row of slots. Only real partners go here. Empty slots should look empty, not like brands we invented.
5. **Join.** “Come play, or come build.” One line on tournaments, jams, and workshops through the semester. Two actions when the links exist: join form, and Discord. Until they exist, the block should say they are coming, not point at a dead button.

## Events

Title along the lines of “This semester.” Two groups: Upcoming and Past.

Each event needs a name, date, place, and the kind of thing it is (tournament, jam, workshop, LAN). Upcoming events get a register action. Past events get a recap when one exists. Sample entries must be visibly marked as samples, so a reviewer never reads them as club history.

## Achievements

Nav label: Wins.

Results grouped by year. Each one is a placement, an award, or a released game, with room for a link to proof (bracket, certificate, post). If there is no proof yet, the card still holds the result and does not pretend a link is there.

## Team

Two groups: faculty coordinator, then the core committee.

Each person: photo or a monogram if there is no photo, name, role, and an optional link (Instagram or LinkedIn). Sample names stay marked until the real committee is in.

## Gallery

Photos from LAN nights, jams, brackets, and workshops. Albums the person can filter, including All. A tile with no photo yet should say the photo is coming, not show a broken image.

## Shared pieces

Design these once and reuse them:

- Navigation and footer. Footer repeats the page links and the socials we actually have: Instagram, Discord, LinkedIn, YouTube. Drop any we do not use.
- Buttons, event cards, person cards, stat slots, partner slots, photo tiles.
- A “sample” mark, for anything that is still placeholder copy.
- Empty states: no upcoming event, no photo, no partner, no confirmed number.

## Please leave these out

- Copyrighted game characters. No Mario, Pikachu, Pac-Man, or anything else we do not own. Original club art only. Prat, the club mascot, can stay, be redrawn, or sit out if it fights the design.
- Invented stats, invented sponsors, and invented trophies. Design the slots. I will fill them with real ones.
- A long pinned homepage. The story is the short home above, then its own page for events, wins, team, and gallery.

## What I need back

A Figma file with:

- Desktop and phone frames for home, events, achievements, team, and gallery.
- The home hero in its resting state, with one letter in its hover or pressed state, and the page after scroll with the nav visible.
- Phone menu open.
- The color and type styles from the club identity, named and ready to reuse.
- A short note on how the OASIS letters should behave.

Copy can stay rough. I care about the structure, the hierarchy, and the look. Once this feels like the club, I will build it.
