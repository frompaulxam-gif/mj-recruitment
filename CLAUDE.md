# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Pitch build for **MJ Recruitment** (event staffing agency Paul has worked for 3–4 years; supplies crews to D&J Catering, Sanjay's, venues like Donington Park / Trent Bridge / Warwick Castle). Static site, no build step, no backend. Being pitched to the owner on a Zoom call; ops coordinator **Dee** is the daily user of the run-sheet tool.

## Run

```bash
python3 -m http.server 8737 --bind 127.0.0.1   # or: preview server "mj-site" (.claude/launch.json)
```

No build, lint, or test tooling — plain HTML/CSS/JS. Verify changes in the browser at 375px width first (phone-first is a hard rule; Dee runs everything from her phone).

## Pages

- `index.html` — marketing site (brand register). Client enquiry + worker application forms are **demo-only**: JS intercepts submit and shows a success card; nothing is sent anywhere yet.
- `app.html` + `assets/app.js` — the "run sheet" calculator (product register). Builds pickup/drop-off car plans and a paste-ready WhatsApp message.
- `pitch.html` — 3-phase proposal + pricing one-pager shown at the end of the Zoom.

## Architecture

- `assets/style.css` — design tokens (OKLCH custom props) + shared components (buttons, fields, chips, seg toggles, toast). `assets/site.css` (marketing) and `assets/app.css` (app) layer on top. **PRODUCT.md and DESIGN.md at the repo root are the design source of truth** (hi-vis amber on tarmac, Barlow / Barlow Condensed, amber fills carry ink text, navy/tarmac fills carry white).
- `assets/app.js` is self-contained: demo staff list (`BASE_STAFF`, approximate area-level lat/lng), pickup points (`POINTS`, 3 core + suggestible extras like Meynell's Gorse P&R), venues, then the assignment algorithm — passengers → nearest active point, nearest free driver per point (capacity 4 + driver), overflow chains a second stop onto a car ("then onto", ≤4.5 mi), times worked back from shift start (haversine × 1.35 road factor ÷ 36 mph + buffers, floored to 5 min). Drop-off mode optionally regroups passengers by home proximity. State persists in localStorage (`mj_state`, `mj_custom_staff`).

## Domain rules (do not break)

- **The WhatsApp message format is the product.** It must match Dee's real messages exactly: `@{tag} driver {point} {time} @{tag} …`, "then onto …", "Could you all please confirm 👍 asap please." Tags include the `~` prefix where the contact isn't saved (e.g. `@~Eleanor`, but `@Nabay`, `@Laup`). WhatsApp stays the delivery channel; tools generate messages to paste, they don't replace the group.
- Frame every feature as helping Dee, never automating her away.
- Only real client/venue names on the site (D&J Catering, Sanjay's, etc.) — no invented stats or fake logos.
- Auth plan (roadmap, not yet built): phone number + one-time SMS code + 4-digit PIN. No usernames/passwords.

## Deployment

Target: GitHub Pages first (free static hosting), then point MJ's existing domain **mjevents.co.uk** (registered to them until Jan 2028; site currently dead) at it. Forms get wired to a form/email service (e.g. Formspree) once the pitch is accepted.
