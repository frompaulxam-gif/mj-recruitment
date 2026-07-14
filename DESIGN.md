# Design

Colorway: **green, white, black** (matches the real MJ Recruit logo: black "MJ" box, RECRUIT wordmark, green "Hospitality specialists" tag).
Color strategy: Committed. Green carries CTAs, selected states and the worker door; white and black do the architecture. Photos on dark surfaces are grayscale so the green pops; the About food-van photo stays in colour on white.

## Color (OKLCH only)

```css
:root {
  --bg:        oklch(1 0 0);              /* pure white */
  --surface:   oklch(0.965 0.002 170);
  --ink:       oklch(0.17 0 0);
  --muted:     oklch(0.44 0 0);
  --brand:     oklch(0.55 0.12 165);      /* PRIMARY green, carries WHITE text */
  --brand-soft:oklch(0.95 0.025 165);
  --brand-deep:oklch(0.44 0.10 168);      /* green links/labels on white */
  --brand-bright:oklch(0.74 0.11 165);    /* green accents on dark */
  --navy:      oklch(0.20 0 0);           /* badge black */
  --tarmac:    oklch(0.13 0 0);           /* dark sections / footer / app header */
  --ok:        oklch(0.55 0.12 150);
  --warn:      oklch(0.58 0.16 30);
}
```

Rules: green fills carry WHITE text (saturated mid-tone). Black fills carry white text. Green text on white uses --brand-deep only. No gradients on text, no side-stripe borders, and NO EM DASHES in any user-facing copy (Paul standing rule).

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

- **Logo lockup (.mark):** black "MJ" box + RECRUIT wordmark + green "Hospitality specialists" small tag, recreating the real logo in CSS. `.mark-inverse` (white box) on dark surfaces.
- **Pill toggles** for staff selection (recognition over recall) — tap to toggle, green = selected, steering-wheel badge = driver.
- **WhatsApp preview bubble:** dark green-on-dark chat mock matching WA dark mode, monospace-free, with copy button.
- **Stat strip:** plain numbers with Barlow Condensed, no hero-metric card grid.

## Motion

- Entrances: one orchestrated hero reveal (clip + fade, 500ms ease-out-quint), content visible by default underneath.
- App: list items animate on toggle (120ms transform), sheet slides 240ms ease-out-expo.
- `prefers-reduced-motion`: all transitions → opacity 150ms or none.

## Imagery

- Festival/event photography only if URLs verified; otherwise custom SVG scene (dawn field, amber sky band) — never colored-div placeholders, never fake client logos (clients named in text).
