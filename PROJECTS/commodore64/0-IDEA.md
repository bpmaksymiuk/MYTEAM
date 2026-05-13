# Commodore 64 — Project Idea

## Product Name

C64 Online — A browser-based Commodore 64 experience

## One-Line Pitch

Bring the Commodore 64 to the modern web: a faithful, in-browser C64 emulator with
a curated library of classic public-domain games and demos, playable instantly without
downloads or plugins.

## Problem

Millions of people grew up with the Commodore 64 — the best-selling personal computer
of all time. Today, accessing that experience requires technical setup: finding a native
emulator, sourcing disk images, configuring joystick mappings, and dealing with platform
compatibility. There is no authoritative, zero-friction, browser-native home for C64
nostalgia and education.

## Solution

A web application that embeds a JavaScript-based C64 emulator core (e.g. js64 or
similar open-source engine) wrapped in a polished, accessible UI. Users arrive at the
site, pick a title from a curated public-domain library, and are playing within seconds.
No account required for basic play. Optional sign-in unlocks save states, custom key
mappings, and a personal favourites shelf.

## Core Features

1. **Instant Play** — click a title, the emulator boots, the game starts. Zero install.
2. **Curated Library** — a hand-picked collection of public-domain and open-licensed C64
   software organised by genre (action, adventure, sports, demos, educational).
3. **Authentic Feel** — scanline filter, CRT bezel option, authentic SID chip audio via
   Web Audio API, configurable colour palette (VICE defaults or warm CRT variant).
4. **Control Options** — keyboard mapping editor, gamepad API support (USB controllers),
   on-screen virtual joystick for mobile.
5. **Save States** — optional sign-in allows named save slots persisted per user per title.
6. **Demo Scene Showcase** — a dedicated section for C64 demoscene productions with
   creator credits and release year.

## Stretch Goals

- BASIC prompt mode: drop into a BASIC interpreter session, write and run programs.
- Side-by-side "code view" showing the running assembly or BASIC listing.
- Upload your own `.d64` / `.prg` / `.tap` image (subject to content policy).
- Shareable run links: encode a mini save-state in a URL for sharing a specific game
  moment.

## Audience

- Adults who owned or used a C64 in the 1980s–90s seeking nostalgia.
- Students and hobbyists interested in retro computing history.
- Demoscene fans and 8-bit art enthusiasts.
- Educators teaching early computing concepts using authentic period hardware context.

## Technical Notes

- Frontend: modern SPA (React or similar) hosted statically.
- Emulator core: existing open-source JS/WASM C64 engine integrated as a module.
- Auth: lightweight JWT-based optional sign-in for save states only.
- Storage: save states stored server-side (SQLite/Postgres) for signed-in users;
  anonymous users may use browser localStorage.
- All software in the library must be explicitly public-domain or open-licensed.

## Success Criteria

- A user can go from landing page to playing a game in under 10 seconds on a desktop
  browser with a broadband connection.
- At least 25 curated titles available at launch across at least 4 genres.
- Emulator passes audio and visual accuracy checks for the top 10 titles in the library.
- Save and restore a save state completes without data loss.
- Site is fully keyboard-navigable and meets WCAG 2.1 AA for all chrome UI elements.
