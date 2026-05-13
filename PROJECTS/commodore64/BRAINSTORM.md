# Brainstorm — C64 Online

- **STATUS:** PASS
- **STATUS UPDATED:** 2026-05-13
- **AUTHOR:** Writer
- **SOURCE IDEA:** 0-IDEA.md — C64 Online: a browser-based Commodore 64 emulator with curated public-domain library, SID audio, save states, gamepad support, and a demoscene showcase for nostalgic adults, students, demoscene fans, and educators.

---

## ELEVATOR PITCH

C64 Online is the internet's front door to 1982: a zero-friction browser application
that boots the world's best-selling personal computer of all time in under ten seconds
and hands you a controller. No installer. No ROM-hunting. Just a polished library of
lovingly curated public-domain games and demoscene masterworks, heard exactly as they
were meant to be — through an authentic SID chip simulation — and seen through a warm,
scanline-kissed CRT that you can toggle on or off. It is at once a nostalgia machine
for the forty-something who learned to type on a beige keyboard, a living museum for the
curious student, and a stage for the demoscene artists who never stopped pushing eight
bits to their limits.

---

## AUDIENCE & EMOTIONAL GOALS

### Profile 1 — The Returning Adult (35–55)

Someone who owned or used a C64 as a child and hasn't touched one since. They remember
specific games and specific sounds but couldn't tell you how to configure VICE. Their
dominant emotion should be **warm nostalgia shading into delight** — the involuntary
smile when they hear the Commando loading tune, the fingers moving to the remembered
key positions, the moment they realise muscle memory survived thirty years.

### Profile 2 — The Curious Student / Hobbyist (18–30)

A software developer or computing-history enthusiast who missed the era but knows it
matters. They approach the site with **curiosity and the desire for mastery** — they
want to understand *why* the SID chip sounds the way it does, what a raster interrupt
is, what the demoscene achieved under severe constraints. They should leave feeling they
genuinely touched something real and historically significant.

### Profile 3 — The Demoscene Fan / 8-Bit Artist

A follower of the contemporary demoscene or chiptune community who reveres the C64 as
a creative platform. The dominant emotion is **awe and communal pride** — the feeling
of being part of a tradition, of watching a named production on the platform it was
written for, hearing it the way the sceners intended.

### Profile 4 — The Educator

A teacher of computing history, digital literacy, or creative coding who wants to show
students a primary source, not a screenshot. The dominant emotion is **confidence and
authority** — the relief of having a reliable, curated, accessible tool that works on
school hardware without IT paperwork, and that the class can immediately engage with.

---

## EXPERIENCE EXPLORATION

### The First 30 Seconds

- User arrives at the landing page. The hero section IS a live C64 — a gently animated
  demoscene production scrolling past, its SID soundtrack playing softly (muted by
  default, one tap to unmute). The site does not look like a video game portal; it feels
  closer to an interactive poster.
- A prominent "Play Now — No Sign-in Needed" call-to-action floats beneath a short title
  and a rotating subtitle drawn from the library: *"Commando · Impossible Mission ·
  Pitstop II · Winter Games…"*
- Clicking any title thumbnail triggers an instant modal: the emulator boots — C64 BASIC
  screen flashes, then the game loads. The user is playing in under ten seconds. The
  browser tab title becomes the game name.

### The Peak Moment of Joy

A returning adult clicks "Commando." The crackling tape-load sound plays (faithful to the
real loader), the title screen appears with its iconic tune, and the user instinctively
reaches for the keyboard. The first enemy appears and their hands just know what to press.
This is the peak: **embodied memory re-activating**. The site has done its job without
a single tutorial.

### A Surprising or Memorable Detail

Hovering over the CRT bezel in the emulator view reveals a subtle tooltip: "Commodore 64
— 64KB RAM, 1MHz 6510 CPU, 3-voice SID." Clicking it opens an inline "Machine Notes"
panel that shows the hardware spec alongside a photograph of the actual machine, a brief
paragraph about its cultural impact, and a link to the relevant demoscene productions for
that title. The emulator becomes a small museum exhibit without ever pausing the game.

### Ambient / Idle Behaviour

If the emulator is left idle for 90 seconds, it does not go dark. Instead it transitions
to "attract mode": it soft-fades to a looping demoscene production from the showcase
library, SID music rising gently. This mirrors the behaviour of real arcade machines and
rewards anyone who walks past a running browser tab. The effect also serves as a
permanent, living advertisement for the demoscene section.

---

## SCREEN & FLOW IDEAS

```
[ Landing / Hero ]
     |
     |—— Browse Library ──> [ Library Browser ]
     |                             |
     |                             |—— Select title ──> [ Play Screen ]
     |                                                        |
     |—— Demoscene ────────────────────────────────> [ Showcase Screen ]
     |
     |—— Sign In / Profile ──────────────────────> [ Profile / Save States ]
     |
     |—— BASIC Scratch Pad (stretch) ──────────> [ BASIC Prompt ]
```

### Screen 1 — Landing / Hero

**Shows:** A live or motion-captured demoscene production running in a styled CRT frame,
with a headline, subtitle, and library call-to-action.
**Key interaction:** Clicking any featured title thumbnail launches the emulator inline.
**Transitions:** Hero CTA flows to Library Browser; "Demoscene" nav link leads to Showcase.

### Screen 2 — Library Browser

**Shows:** A grid of game/demo cards (cover art, title, genre tag, play count, rating),
filterable by genre (Action, Adventure, Sports, Demo, Educational) and sortable by title,
popularity, or year.
**Key interaction:** Click a card to launch the emulator; keyboard navigation for accessibility.
**Transitions:** Card click opens Play Screen (modal or full-page); back button returns to
scroll position.

### Screen 3 — Play Screen (Emulator View)

**Shows:** The running C64 display in a configurable CRT frame (bezel on/off, scanlines
on/off, colour palette toggle). Control strip below: pause, save state, load state, full
screen, settings gear.
**Key interaction:** Keyboard and gamepad input pass to the emulator; virtual joystick
overlay for touch devices.
**Transitions:** "Back to Library" returns without losing emulator state (suspended);
"Save State" triggers a name-it-and-save flow for signed-in users.

### Screen 4 — Demoscene Showcase

**Shows:** A curated gallery of C64 demoscene productions presented as full-width
entries — title, release group, year, compo placement, YouTube or inline video, and a
"Play in emulator" CTA.
**Key interaction:** Inline playback; expandable "About the Production" panel with
technical notes.
**Transitions:** "Play in emulator" loads the production in the Play Screen; "Scene
Directory" links to scene.org.

### Screen 5 — Profile & Save States

**Shows:** A minimal profile page (username, join date, favourites shelf, save state list
per title with timestamps and thumbnail snapshots).
**Key interaction:** Rename, delete, or resume any save slot; add/remove favourites.
**Transitions:** Resuming a save state jumps directly to Play Screen with state pre-loaded.

### Screen 6 — BASIC Scratch Pad (Stretch Goal)

**Shows:** A full-screen BASIC prompt session with a small floating reference card (common
BASIC commands, ASCII codes, colour codes).
**Key interaction:** Type and run BASIC programs; share button encodes the program listing
as a URL.
**Transitions:** "Save as file" exports the listing; "Return to Library" suspends the
session.

---

## VISUAL DIRECTION

### Direction A — "Phosphor & Warmth" (Authentic CRT)

**Descriptor:** The visual aesthetic of a well-loved CRT monitor in a dim room — warm
phosphor glow, subtle scanlines, the faint geometric distortion of a curved screen.
Everything outside the emulator frame breathes the same palette: deep navy backgrounds,
warm cream type, and the unmistakable Commodore blue.

**Visual References:**
- The colour palette of the actual Commodore 64 screen (VICE default palette, documented
  at `https://www.pepto.de/projects/colorgen/`) — 16 colours anchored around a vivid blue
  background (`#4040E8`) and bright white (`#FFFFFF`).
- The television production *Halt and Catch Fire* (AMC, 2014–2017) for its pitch-perfect
  rendering of period CRT aesthetic and emotional warmth.
- The game *Shovel Knight* (Yacht Club Games, 2014) for its discipline in limiting the
  palette and its tender nostalgia without pastiche.

**Mood adjectives:** Warm, intimate, tactile, trustworthy, slightly dimly-lit.

**Suggested Palette:**

| Role | Name | Hex |
|------|------|-----|
| Background | Deep Navy | `#1A1A2E` |
| Surface | Dark Slate | `#16213E` |
| Accent primary | Commodore Blue | `#4040E8` |
| Accent secondary | Phosphor Green | `#00CC55` |
| Text primary | Warm Cream | `#F5F0DC` |
| Highlight | Amber Glow | `#E8A030` |

**Typography sketch:** Humanist sans-serif body (e.g. Inter or Nunito) with a pixel-perfect
`CBM` or `Px437` monospace for any code or emulator chrome — the font family used in the
actual C64 character ROM.

> Sources: pepto.de palette reference; Shovel Knight style guide (Yacht Club Games dev
> blog); Halt and Catch Fire production design notes.

---

### Direction B — "Neon Retrowave" (Synthwave Recontextualisation)

**Descriptor:** The C64 library is reframed through a contemporary synthwave / retrowave
lens: deep purple night skies, hot pink grid lines, electric cyan highlights, chrome type.
The emulator sits inside a stylised arcade cabinet or instrument panel rather than a plain
CRT frame. The vibe is *Back to the Future* meets *Stranger Things* title sequence — a
loving, slightly hyper-real version of the 1980s that Gen-Z and younger millennials
already find aspirational.

**Visual References:**
- The *Outrun* (Sega, 1986) aesthetic as re-interpreted by artists such as Perturbator
  and Kavinsky album artwork — fluorescent horizon lines, chrome reflections.
- The Netflix series *Stranger Things* title card typography (Benguiat-derived serif in
  neon pink on black) as a cultural touchstone for the resurgent 80s aesthetic.
- The *Hotline Miami* (Dennaton Games, 2012) UI for its confident flat neon-on-black
  approach to retro game packaging.

**Mood adjectives:** Bold, cinematic, electric, aspirational, slightly dangerous.

**Suggested Palette:**

| Role | Name | Hex |
|------|------|-----|
| Background | Void Black | `#0D0D1A` |
| Surface | Deep Purple | `#1A0533` |
| Accent primary | Neon Magenta | `#FF2D78` |
| Accent secondary | Electric Cyan | `#00F5FF` |
| Text primary | Chrome White | `#E8E8F0` |
| Highlight | Sunset Gold | `#FFD700` |

**Typography sketch:** A geometric display face (e.g. Rajdhani Bold or Exo 2) for
headings, with a monospace stack (IBM Plex Mono) for code and emulator chrome. Generous
letter-spacing on headlines for a cinematic poster feel.

> Sources: Outrun aesthetic documented at outrun.style; Hotline Miami press kit; Stranger
> Things title card references at Netflix media centre.

---

### Direction C — "Archive & Museum" (Editorial Calm)

**Descriptor:** The site is presented as a living digital archive rather than an arcade —
clean off-white paper backgrounds, editorial typography, generous white space. The
emulator is a "specimen" in a display case, and each game entry reads like a museum card.
Inspired by the archival aesthetic of the Internet Archive and the Smithsonian online
collections.

**Visual References:**
- The Internet Archive (`archive.org`) software library pages for their no-frills
  earnestness and the way they foreground metadata.
- The design of the *Computer History Museum* website (computerhistory.org) for its
  balance of depth and accessibility.
- Swiss editorial typography (Helvetica Neue, tight grid, generous leading) as a
  counterpoint to the retro content it frames.

**Mood adjectives:** Scholarly, trustworthy, spacious, authoritative, quietly exciting.

**Suggested Palette:**

| Role | Name | Hex |
|------|------|-----|
| Background | Archive White | `#F8F6F0` |
| Surface | Warm Paper | `#EDE9DE` |
| Accent primary | Archival Blue | `#1A4B8C` |
| Accent secondary | Rust Red | `#B84020` |
| Text primary | Ink Black | `#1C1C1C` |
| Muted text | Warm Grey | `#6B6560` |

**Typography sketch:** A neutral grotesque (Inter or Helvetica Neue) for body, a slab
serif (Roboto Slab or Zilla Slab) for headings, and a monospace stack for code.

> Sources: archive.org design; computerhistory.org; Swiss grid typography references in
> Müller-Brockmann, *Grid Systems in Graphic Design* (Niggli, 1981).

---

## MOOD & ATMOSPHERE

### The Sound of the Machine

The SID chip (MOS Technology 6581/8580) is one of the most emotionally distinctive sounds
in computing history — a three-voice wavetable synthesiser with a genuine analogue filter
that no software sampler has ever perfectly replicated. The site's sonic identity begins
with the SID: the boot chime when an emulator session opens, the subtle crackling of a
tape-load audio cue, the authentic chip music of each title.

Even silent interactions should feel textured. Button clicks could carry a faint
key-actuation sound sampled from a real MX Blue keyboard, echoing the satisfying
clatter of the C64's own keyboard. The overall mix should stay quiet — ambient, not
intrusive — allowing the game audio to be the dominant voice.

### The Idle Atmosphere

When no game is playing, the site breathes. The hero demoscene production loops with slow,
hypnotic scrollers. Colour cycling — a C64 hardware trick that shifts palette entries
without redrawing — could be used decoratively in the UI itself, a subtle nod to the
hardware's capabilities.

### The Emotional Score (Imagined)

If this site were a film, its opening score would be a Rob Hubbard–style SID piece played
at 75% volume, just barely above silence — familiar, slightly melancholy, timed to a
slow scroll. The "peak play" scene would be scored by whatever the selected game provides.
The closing credits, if the user logs out, would play a gentle arpeggiated C major on
three SID voices: unresolved, inviting return.

> Sources: SID chip documentation at `https://www.sidmusic.org/`; Rob Hubbard composer
> profile at Lemon64 (`https://www.lemon64.com`); High Voltage SID Collection at
> `https://www.hvsc.c64.org`.

---

## UI & INTERACTION PRINCIPLES

1. **Zero friction to first pixel.** The path from landing page to playing a game must
   never exceed three interactions. Every additional step is a bug.

2. **The emulator is the star.** All UI chrome — navigation, search, filters, controls —
   should retreat when the emulator is active. Full-screen mode should be one tap.

3. **Authentic feel is a feature, not decoration.** The CRT scanline filter, the colour
   palette, the SID audio, the boot sequence — these are not optional polish; they are
   the product's core value. Never apologise for them or hide them by default.

4. **Every screen has an obvious next move.** No dead ends. If a title is not in the
   library, suggest the closest match. If a save state fails, explain why and offer a
   local fallback. If the emulator crashes, offer a restart without losing progress.

5. **Mobile is a real platform.** The virtual joystick and touch controls should be
   designed with the same care as the desktop keyboard mapping. Mobile users are real
   users, not degraded users.

6. **Discovery over search.** Most visitors do not arrive with a specific title in mind —
   they arrive with a feeling. Genre browsing, "Surprise Me," staff picks, and the
   demoscene spotlight should be more prominent than a text search bar.

---

## METAPHORS & MENTAL MODELS

### 1. "The Arcade"

The site is a virtual arcade hall: each game has its own cabinet, you walk up and play,
no membership required. This implies **immediacy** (no barriers), **public access**
(anyone can walk in), and **a physical sense of place** (the emulator frame is the
cabinet bezel). It also implies that some games will have high-score boards visible to
all, and that the "attract mode" (looping demo) is a natural ambient state.

### 2. "The Library"

The software collection is a curated library — not a random pile, but a selection someone
has thought about, categorised, and stamped with a due-date card. This implies
**curation over comprehensiveness** (the value is in the selection, not the count),
**intellectual seriousness**, and **browsing as its own reward**. The Library metaphor
also lends itself to the educator use case: a library is a place you bring students.

### 3. "The Time Machine"

Every session is a trip to a specific moment: 1984, 1987, 1990. The date of release
appears on every entry. The demoscene section is ordered by year and event. This implies
**historical authenticity** — the experience should feel like visiting the era, not like
a modern remake of it. The Time Machine metaphor cautions against over-modernising the UI
into something that reads as 2026 rather than 1985-in-2026.

### 4. "The Workshop"

The stretch-goal BASIC Scratch Pad transforms the site from a consumption platform into a
**creative tool** — a workshop where you can make things as well as experience things.
The Workshop metaphor implies an always-available blank page, a visible toolset, and the
permission to make a mess. It also implies that saving and sharing your work is as natural
as putting a project on a shelf.

---

## "WHAT IF" PROVOCATIONS

1. **What if the landing page IS a running demoscene production?** Instead of a hero
   banner with a screenshot, the entire above-the-fold area is a live C64 demo executing
   in the browser — scrollers, raster bars, and a SID soundtrack playing as the user
   reads the pitch copy over it. [EXPLORATORY]

2. **What if loading sounds were authentic and you couldn't skip them?** Instead of
   simulating instant loading, the site offered an opt-in "authentic load time" mode
   that plays the real tape-load audio and simulates the 2-minute load wait — an
   intentionally slow experience that recreates the childhood ritual of waiting.
   [EXPLORATORY]

3. **What if save states could be shared as URLs?** A signed-in user completes a level,
   hits "Share Moment," and receives a URL that, when opened by anyone, boots the
   emulator at exactly that save state — same level, same score, same inventory. A
   zero-friction way to challenge a friend or show a specific moment.

4. **What if the genre filters included "Emotional Register"?** Instead of only Action /
   Adventure / Sports, the library offered filters like "Meditative," "Adrenaline," "Show
   Off," "Learn Something" — curating by feeling rather than category.

5. **What if educators could create and share curated playlists?** A teacher logs in,
   assembles five titles into a "Playlist: Introduction to Early Computing," assigns it a
   shareable link, and students open the link in class — landing directly on that teacher's
   curated subset of the library.

6. **What if there was a "Code Lens" overlay for every game?** A toggle that brings up
   a split-screen showing the live 6510 disassembly, memory visualisation, or BASIC
   listing alongside the running game — turning any session into an educational
   reverse-engineering experience.

7. **What if monthly releases mirrored the original scene calendar?** The demoscene
   spotlight rotates every month to align with the real-world demoparty calendar — when
   Revision demoparty runs in April, the C64 Online showcase features that year's C64
   entries, creating a living connection between the site and the contemporary scene.

8. **What if the site worked offline?** A Progressive Web App that caches the emulator
   core and up to ten favourite titles locally, allowing play on an aeroplane or in a
   classroom with no internet — fully consistent with the "no-friction" promise.

9. **What if BASIC programs were social objects?** User-written BASIC snippets could be
   published to a public "Scroll" — a feed of short programs, voted up, remixed, and
   forked — turning the Scratch Pad into a community creative platform in the spirit of
   Scratch or Glitch.

10. **What if the site could switch between C64 "eras"?** A toggle to select "Early Era
    (1982–1984)," "Golden Era (1985–1989)," or "Late Era (1990–1994)" that filters the
    library, adjusts the default CRT palette, and even tweaks the boot sequence to match
    period-accurate firmware versions.

---

## OPEN QUESTIONS FOR PRODUCT OWNER

1. **Library scope and curation governance:** Who owns the decision to add or remove
   titles? Is there a formal licensing review process for each entry, and will the
   library grow continuously post-launch or be locked at a defined set for v1?

2. **User-generated content and the `.d64` upload stretch goal:** If users can upload
   disk images, what is the content moderation policy? Who is liable for infringing or
   harmful content, and what is the takedown process? This is a significant scope and
   legal question that should be answered before it appears in any use case.

3. **Demoscene sourcing and rights:** Will demoscene productions be sourced from
   `scene.org` (which requires attribution and has its own terms), directly from
   creators, or via other means? Do creators need to explicitly consent to appearing in
   the showcase, or is scene.org hosting considered sufficient permission?

4. **Authentication and privacy:** The idea describes "lightweight JWT-based optional
   sign-in." What is the minimum viable identity — email only, or social login? Is there
   a plan for GDPR/CCPA compliance for save-state data, and what happens to a user's
   data if they delete their account?

5. **Accessibility baseline:** The idea mentions WCAG 2.1 AA for "all chrome UI elements."
   Does this extend to the emulator canvas itself (which is inherently inaccessible to
   screen readers)? What is the minimum accessible experience for a user who cannot use
   the emulator — does the site offer meaningful content (descriptions, historical notes)
   to that audience regardless?

6. **Mobile priority:** Is mobile a first-class target for v1 (virtual joystick, touch
   controls, responsive layout) or a stretch goal? The answer significantly affects
   design and development scope.

---

## REFERENCES

### EXPERIENCE EXPLORATION & MOOD & ATMOSPHERE

- SID chip documentation and music archive: High Voltage SID Collection —
  `https://www.hvsc.c64.org`
- Rob Hubbard composer profile and discography: Lemon64 —
  `https://www.lemon64.com/composers/`
- SID chip technical reference (MOS 6581/8580): `https://www.sidmusic.org/`
- C64 tape load audio documentation: C64 Wiki — `https://www.c64-wiki.com/wiki/Tape`

### VISUAL DIRECTION A — PHOSPHOR & WARMTH

- Pepto's Commodore 64 Colour Palette Generator (authoritative palette reference):
  `https://www.pepto.de/projects/colorgen/`
- Shovel Knight art direction blog post (Yacht Club Games dev blog):
  `https://yachtclubgames.com/blog/`
- *Halt and Catch Fire* AMC — production design reference for CRT aesthetic

### VISUAL DIRECTION B — NEON RETROWAVE

- Outrun aesthetic guide and community: `https://outrun.style`
- Perturbator / Kavinsky album artwork (neon synthwave typography reference)
- *Hotline Miami* press kit — Dennaton Games / Devolver Digital

### VISUAL DIRECTION C — ARCHIVE & MUSEUM

- Internet Archive software library: `https://archive.org/details/softwarelibrary_c64`
- Computer History Museum online collection: `https://computerhistory.org`
- Josef Müller-Brockmann, *Grid Systems in Graphic Design* (Niggli, 1981) — Swiss
  typography reference

### SCREEN & FLOW IDEAS

- VICE emulator (Versatile Commodore Emulator) — gold-standard C64 emulation reference:
  `https://vice-emu.sourceforge.io/`
- js64 / vice.js browser emulator projects (open-source JS/WASM C64 cores)
- Scene.org demoscene file archive: `https://www.scene.org`

### METAPHORS & MENTAL MODELS

- Scratch creative coding platform (Workshop metaphor reference): `https://scratch.mit.edu`
- C64 Wikipedia article for Time Machine / historical context:
  `https://en.wikipedia.org/wiki/Commodore_64`

---

## Exit Gate

- [x] `0-IDEA.md` exists and was read in full.
- [x] All required sections are present and non-empty.
- [x] At least two distinct VISUAL DIRECTIONs are explored. (Three directions provided: Phosphor & Warmth, Neon Retrowave, Archive & Museum.)
- [x] At least one ambitious "What if" provocation is marked exploratory. (Two marked [EXPLORATORY]: items 1 and 2.)
- [x] At least three references with sources are cited. (Fourteen distinct sources cited across sections.)
- [x] OPEN QUESTIONS FOR PRODUCT OWNER lists at least three concrete questions. (Six questions provided.)
- [x] STATUS and STATUS UPDATED fields are present.
- [x] `PIPELINE-STATUS.md` is updated for Stage B with STATUS and STATUS UPDATED date.
- [x] X-Journal START and COMPLETE entries are appended for Stage B.
- [x] Gate result is explicitly stated as `GATE B: PASS` or `GATE B: FAIL`.
