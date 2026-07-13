# Design

Mood: **"6:30am festival load-in — hi-vis amber against dark tarmac, graft and daylight."**
Color strategy: **Committed** — amber carries 30–40% of the brand surface; white and near-black do the architecture.

## Color (OKLCH only)

```css
:root {
  --bg:        oklch(1 0 0);              /* pure white */
  --surface:   oklch(0.955 0.004 91);     /* light panel */
  --ink:       oklch(0.18 0.012 80);      /* near-black, warm */
  --muted:     oklch(0.44 0.012 80);      /* secondary text, ≥4.5:1 on bg */
  --amber:     oklch(0.85 0.16 91);       /* PRIMARY — hi-vis amber, carries INK text */
  --amber-deep:oklch(0.55 0.115 75);      /* amber for small text/links on white */
  --navy:      oklch(0.30 0.06 262);      /* ACCENT — pre-dawn navy, carries WHITE text */
  --tarmac:    oklch(0.16 0.012 262);     /* dark sections / footer / app header */
  --tarmac-2:  oklch(0.22 0.015 262);     /* raised surface on tarmac */
  --ok:        oklch(0.55 0.12 150);      /* success */
  --warn:      oklch(0.58 0.16 30);       /* error/warning */
}
```

Rules: amber fills → ink text (hi-vis). Navy/tarmac fills → white text. Amber never used for body text on white (use --amber-deep, and only for links/labels ≥ 3:1). No gradients on text. No side-stripe borders.

## Typography

- **Barlow Condensed** (600/700) — display & headings, tight leading, often uppercase for wayfinding labels. Road-sign DNA.
- **Barlow** (400/500/600) — body, forms, UI.
- Loaded via Google Fonts. Body 16–18px, line-height 1.55, max 70ch.
- Scale ratio ≥1.25; hero clamp max ≤ 5.5rem; letter-spacing floor -0.02em.
- `text-wrap: balance` on headings.

## Layout

- Marketing: full-width bands alternating white / tarmac / amber; asymmetric hero; generous `clamp()` spacing.
- App (/app): single column ≤ 480px content width, sticky bottom action bar, thumb-reach controls.
- Radius: 10px controls, 16px cards/sheets. Borders 1px oklch(0.87 0.005 91) on white; oklch(0.30 0.02 262) on tarmac.

## Components

- **Chevron mark:** MJ wordmark sits in an amber road-chevron block (pure CSS/SVG, no image logo).
- **Pill toggles** for staff selection (recognition over recall) — tap to toggle, amber = selected, steering-wheel badge = driver.
- **WhatsApp preview bubble:** dark green-on-dark chat mock matching WA dark mode, monospace-free, with copy button.
- **Stat strip:** plain numbers with Barlow Condensed, no hero-metric card grid.

## Motion

- Entrances: one orchestrated hero reveal (clip + fade, 500ms ease-out-quint), content visible by default underneath.
- App: list items animate on toggle (120ms transform), sheet slides 240ms ease-out-expo.
- `prefers-reduced-motion`: all transitions → opacity 150ms or none.

## Imagery

- Festival/event photography only if URLs verified; otherwise custom SVG scene (dawn field, amber sky band) — never colored-div placeholders, never fake client logos (clients named in text).
