---
name: Tonal Design System
description: Design system for Tonal — a poster-style mobile weather app with warm paper colors, DM Serif Display + Geist, illustrated SVG scenery, and translucent cream glass cards. Use when designing any weather, atmospheric, or quiet observational mobile UI in this project.
---

# Tonal — Skill

You are working inside the Tonal design system. This is a single-product mobile design system; everything here serves one app's poster-style mobile experience.

## Read first

Before designing anything new, read these files in order:

1. `README.md` — content fundamentals, voice, visual foundations, iconography rules.
2. `colors_and_type.css` — token source of truth (paper, ink, amber, sky gradients, type scale, radii, shadows).
3. `ui_kits/weather_app/index.html` — the live UI kit. Contains 5 screens (Dashboard, Welcome, Sign up, Sign in, Location) plus Saved-places and Settings sheets.
4. `ui_kits/weather_app/Screens.jsx`, `Components.jsx`, `Background.jsx`, `Icons.jsx` — components to reuse, never re-build.

## Hard rules

- **Mobile only.** All designs target a 390×844 phone in a tall rounded shell. There is no tablet or desktop variant.
- **One accent.** Amber `oklch(0.74 0.13 65)` is the only chromatic accent. Don't introduce greens, blues, or red error states — use ink + amber + paper.
- **Illustration is the design.** The top 55–65% of every weather screen is hand-illustrated SVG scenery (`Background.jsx`). Never replace it with a photo, a CSS gradient alone, or a stock asset.
- **Glass over scene, opaque over paper.** Cards on top of the illustration use `rgba(255,248,235,0.42)` + `backdrop-filter: blur(18px) saturate(140%)`. Cards on solid paper use opaque cream — never blur over a flat background.
- **Type system is closed.** DM Serif Display (display only, weight 400), Geist (UI + body, 400/500/600), JetBrains Mono (meta labels, uppercase, +0.12em). No other typefaces.
- **Custom icons only.** 24×24, 1.4px stroke, round caps, `currentColor`. Use `Icon.*` from `Icons.jsx`. No emoji, no Lucide, no Heroicons, no icon fonts.
- **No cool shadows.** Shadows always cast warm: `rgba(40,24,10,...)`. Never `rgba(0,0,0,...)` or anything blue-tinted.
- **Borders are warm.** Hairlines on glass: `rgba(255,245,225,0.55)`. Hairlines on paper: `rgba(28,20,16,0.06)`. Never gray.

## Voice and copy

- Calm, observational, second-person. Read like a quiet weather diary, not a forecast bulletin.
- Title Case for screen titles + primary buttons. Sentence case elsewhere. ALL-CAPS only on `meta` labels at 11px / +0.12em.
- Weather summaries are full English phrases: *Overcast Clouds*, *Light Rain*, *Misty Morning*. Never codes or abbreviations.
- Numbers: `52°` (no F/C), `8 PM` (no leading zero), `10 mph`, `81%`.
- No emoji, ever.

## Component vocabulary (use these, don't reinvent)

- `<Hero>` — location pin + date + huge serif temperature (160px on dashboard, scales down) + condition pill + H/L stats.
- `<StatRow>` — three glass chips (humidity / wind / visibility), icon + value + label.
- `<HourlyStrip>` — horizontal scroller with `now` chip highlighted; bg is amber-warm card on the dusk band.
- `<FiveDayList>` — vertical list inside a paper card, day + icon + range bar + lo/hi.
- `<PrimaryButton>` (ink), `<AccentButton>` (amber), `<GhostButton>` (cream + hairline), `<GoogleButton>` (white + multi-color G).
- `<Sheet>` — bottom sheet, slides up 240ms cubic-bezier(0.2,0.8,0.2,1), 28px top corners, scrim `rgba(28,20,16,0.55)`.
- `<Field>` — input with cream fill, 14px radius, brown ink stroke at 12% opacity, focus to amber with 3px amber/18 halo.
- `<MetaLabel>` — JetBrains Mono 11px, uppercase, +0.12em, ink-500. Use for eyebrows, step counters, footnotes.

## When designing a new screen

1. Pick a time-of-day × location × condition combo and use `<Background>` with those props — never invent a new sky.
2. Status bar at top, content scrolls beneath, bottom nav (sun / pin / settings) at 100px reserved height.
3. Hero element first, glass stat row beneath, secondary cards on paper below the fold.
4. Padding: 24px screen edge, 14–16px between cards, 20–28px inside cards.
5. Run a quick voice check on every string before shipping. If it sounds like a forecast bulletin, rewrite.

## What not to build

- No charts beyond the simple range bar.
- No data-dense screens (radar grids, hourly tables, multi-city dashboards). This app is one place, one feeling.
- No light/dark toggle — time of day already drives the palette via the background.
- No marketing site, no admin, no settings beyond the existing sheet.

## Variations and tweaks

If the user asks for a variant of a screen, add it as a Tweak (using the `tweaks_panel.jsx` starter) inside `ui_kits/weather_app/index.html` rather than forking a new file. Keep the design system single-source.
