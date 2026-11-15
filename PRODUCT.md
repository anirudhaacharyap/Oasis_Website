# Product
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
- **Students deciding whether to join:** NMIT students, mostly in their 1st and 2nd year. They want to
  know what the club does, whether it's for them, and how to sign up.
- **Sponsors, partners and other colleges:** people checking the club's credibility, activity and
  reach before working with it.

When the two audiences pull in different directions, they carry **equal weight**: each gets a primary
path.

## Product Purpose
The site is OASIS's public landing page. It tells the club's story in order (what it does, who it is,
what it has run and built, who is in it) and sends visitors to act. Students go to recruitment at
https://oasis-rec.vercel.app. Sponsors and partners go to a contact path.

Success means a visitor understands within seconds that OASIS is NMIT's esports **and** game
development club, and leaves through one of those two paths.

## Positioning
OASIS is the campus club that both **plays** (competitive esports rosters) and **builds** (game
development). One community covers both halves.

## Operating Context
- OASIS is a student club at Nitte Meenakshi Institute of Technology (NMIT), Bengaluru.
- Recruitment runs on a separate site: https://oasis-rec.vercel.app.
- The club also runs posters and courses in the same red and black print identity, so the site is one
  touchpoint in a larger, consistent system.

## Capabilities and Constraints
- **Recruitment domains (real):** Operations, Esports, Sponsorship, Media & Outreach, Documentation.
- **Site shape:** a single landing page. The Next.js codebase already exists.
- **Undecided, keep as placeholders:** sponsor/contact email, Discord invite and socials. Never
  render example.com placeholder links.

## Brand Commitments
- **Name:** OASIS.
- **Wordmark:** the star arc over OASIS (`Vector.svg`, one path, brand red `#AD0013`). Ship it.
- **Identity:** red and black print, shared with the club's posters and courses.
- **Poster copy that may be reused:**
  - "Pick your spawn point"
  - "Enough played, getting bro. It's time to play."
  - "Gaming & Game Dev"
- **Gold:** allowed only as a rare hint, never as a primary brand colour.

## Evidence on Hand
- The wordmark SVG.
- The recruitment poster (a style reference only; its illustrated characters carry no meaning and
  must not be used).
- The five domains.
- **Absent:** real events, results, projects, member names and photos, and sponsors. Everything in
  `src/data` is mock (`mock: true`) and must never be presented as fact. Do not invent wins, numbers
  or partners.

## Product Principles
1. Both halves, always: every section speaks to players *and* makers.
2. Two exits: recruitment for students, contact for sponsors. Both stay easy to reach.
3. Honest until proven: placeholders stay marked, and no invented credentials.
4. One identity across print and web: the site should feel like the posters came alive.

## Accessibility & Inclusion
- WCAG AA contrast on every colour band.
- Full keyboard path, including the hero controller and carousel.
- A reduced-motion version with all content visible.
- A phone-first layout at 390px.
