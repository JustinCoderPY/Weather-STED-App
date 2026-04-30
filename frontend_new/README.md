# Tonal — Design System

A mobile-first, illustrated, poster-style weather app. Tall rounded phone screen, soft warm gradients, layered illustrated scenery (city / suburb / rural / park) that reacts to time of day and weather, one massive elegant temperature number, glass-like translucent cards underneath.

This system is the visual foundation for the **Tonal** weather app — a single mobile experience, not a web dashboard. Everything in here assumes a 390×844 (iPhone-class) viewport scrolling vertically inside one screen.

---

## Sources

- **Reference image** — `uploads/Screenshot 2026-04-30 at 10.21.40 AM.png` (poster-style mobile UV app — primary mood reference for layout, type, soft glass cards, hourly strip, and warm desert gradient).
- **Codebase (read-only)** — `Weather-STED-App/` (React + Vite frontend with existing tokens, illustrated `<Background>` SVGs, mock data, and screen scaffolds; backend is Express + OpenWeather and is not part of this design pass).
- **iOS reference zip** — `uploads/IOS_REFERENCE_ONLY.zip` (consulted only for *what functions a weather app needs* — not visual style).

The codebase already commits to a warm palette, DM Serif Display + Geist UI, and an illustrated background system across **city / suburb / rural / park** locations × **morning / day / sunset / night** times × **clear / cloudy / rain / snow / mist** conditions. The design system here lifts that foundation and re-applies it to a tall, poster-style mobile layout that mirrors the reference image rather than the existing desktop grid.

---

## Index

- `README.md` — this file
- `colors_and_type.css` — base tokens, semantic tokens, type scale
- `assets/` — illustrations, logos, icon set
- `preview/` — Design System tab cards (type, color, spacing, components, brand)
- `ui_kits/weather_app/` — UI kit: dashboard, sign in/up, location consent, saved locations sheet, settings sheet
- `SKILL.md` — Agent Skill manifest

---

## Content fundamentals

**Voice.** Calm, warm, observational. Reads like quiet weather poetry, not a forecast bulletin. Short sentences, present tense, no hype. The app speaks in second person ("see you", "where you are", "you can change this anytime") — never "I" or "we".

**Casing.** Title Case for screen titles and primary buttons. Sentence case for body, hints, secondary buttons. ALL-CAPS used only on `meta` labels (eyebrow text, step counters, footer notes) at 11px tracked +0.12em — borrowed straight from the reference's "LOS ANGELES, CA" treatment.

**Examples (lifted from the codebase, kept).**
- Welcome: *"Weather where you are."*
- Sub: *"Tonal uses your location to draw the sky around you. You can change this anytime."*
- Sign in: *"Good to see you."* / *"Sign in to pick up where you left off."*
- Sign up: *"Welcome to Tonal."* / *"A few details and you are in."*
- Footer note (consent): *"Location stays on your device"*

**Weather summaries** are plain English, capitalized as a phrase: *Overcast Clouds*, *Light Rain*, *Clear Evening*, *Snow Showers*, *Misty Morning*. Never abbreviations or codes.

**Numbers.** Temperatures show as `52°` (no F/C unless ambiguous). Times as `8 PM`, `6:20 AM` — no leading zero. Wind as `10 mph`. Humidity as `81%`.

**Emoji.** None. The brand uses illustrated SVG scenery and a small in-house line-icon set instead.

**Tone vibe.** Closer to a Moleskine weather diary than a smart-home app. Confidence comes from typography and atmosphere, not from data density.

---

## Visual foundations

**Color.** A warm paper / amber palette pulled from the reference. Cream `#fbf6ee` is the canvas, deep brown-black `#1c1410` is the ink, amber `oklch(0.74 0.13 65)` is the only true accent. Sky gradients are scene-driven and live inside the illustrated background — UI chrome never uses them. Cards are translucent cream over the illustration, not solid.

**Type.** Display: **DM Serif Display** — used at sizes from 44px (screen titles) all the way up to ~180px (hero temperature). The serif carries the entire poster mood. UI: **Geist** for everything else. Mono: **JetBrains Mono** for `meta` labels at 11px / +0.12em / uppercase only. Body sits at 15–16px, line-height 1.48.

**Spacing.** Soft, generous, rhythmic. Base unit 4px. Common values: 12 / 16 / 20 / 24 / 28 / 36 px. Screen edge padding 24px on phone. Card padding 20–28px. Vertical rhythm between cards 14–16px.

**Backgrounds.** Hand-illustrated SVG scenery, layered (sky → far layer → mid layer → near layer → weather effect → vignette). The background **is** the design — it fills the top 55–65% of the screen edge-to-edge and fades into the cream paper underneath. Never use a generic gradient or photo. Time of day drives the sky gradient stops; location drives the silhouette (city skyline / suburb cottages / rural farmhouse / park trees + mountains); weather drops in rain streaks, snow flakes, mist bands, or backlit clouds.

**Animation.** Quiet. Buttons compress to `scale(0.98)` on press (120ms ease). Sheets slide up with a 240ms cubic-bezier(0.2, 0.8, 0.2, 1). No bounces, no springs that overshoot, no parallax. Hourly strip scrolls horizontally with momentum; that's it.

**Hover / press states.** This is a touch product, so hover is minimal. Press = `scale(0.98)` + slight darken. Buttons never change color on hover. Chips and cards lift their cream alpha by ~15% on press.

**Borders.** Almost nonexistent. Glass cards use a 1px hairline at `rgba(255, 245, 225, 0.55)` — a warm cream stroke, never gray. Inputs get a 1px brown-ink stroke at 12% opacity, focus to amber.

**Shadows.** Two layers, both warm-cast: `0 18px 40px -16px rgba(40,24,10,0.32)` (ambient) + `0 4px 14px -6px rgba(40,24,10,0.18)` (contact). Inset highlight `inset 0 1px 0 rgba(255,255,255,0.5)` on glass cards to read as wet glass against the illustration. No cool/blue shadows anywhere.

**Transparency / blur.** Heavily used on lower cards over the illustrated background — `rgba(255, 248, 235, 0.42)` with `backdrop-filter: blur(18px) saturate(140%)`. Use blur only when there's an illustration behind; on solid paper screens use opaque cream cards instead.

**Corner radii.** Generous. `xs 10 / sm 14 / md 20 / lg 28 / xl 36` plus the phone shell at 44px. Buttons are full pill (999px). Chips are pill. The reference's hero card and forecast strip both sit around 28px radius — that's the default for "card".

**Cards.** Soft, translucent cream, 28px radius, 1px hairline, dual warm shadow + inset highlight. Padding 20px (compact) / 28px (hero). Title typography is DM Serif at 24–32px; body switches to Geist 14–15px.

**Layout rules.** Single 390-wide column, centered. Status bar reserved at top. Bottom safe area 24px. Content scrolls vertically. Sheets (saved locations, settings) slide up from bottom and dim the screen behind. Hourly forecast scrolls horizontally inside its card, never page-wide.

**Imagery vibe.** Warm-cast across the board — even night scenes lean dusty-purple instead of cyan. Slight grain implied through layered fills, but no actual noise texture. Flat-shaded illustration (no gradients on individual shapes), but the sky itself is gradient.

---

## Iconography

**Approach.** Custom in-house line set, ~24×24, 1.4px stroke, round caps and joins, single color (`currentColor`). Lives in `assets/icons/` as individual SVGs and is also bundled in `ui_kits/weather_app/Icons.jsx` as a React object so components can call `<Icon.Sun />`, `<Icon.Cloud />`, etc.

**Set.** Sun, Moon, Cloud, CloudSun, Rain, Mist, Wind, Drop (humidity), Eye (visibility), Sunrise, Sunset, Pin (location), Settings, Plus, Search, Trash, Check, ChevR, Menu, Lock, Mail, User, Compass, Logout. Plus a multi-color Google glyph used only on the "Continue with Google" button.

**Why custom.** The reference's pictograms (sunglasses, sunscreen) sit in soft amber circles with a hand-drawn warmth. Lucide / Heroicons feel too technical for that mood. The hand-tuned stroke set above ships with the codebase and is used as-is.

**No emoji.** No unicode dingbats. No icon font. No PNG icons. Everything is inline SVG so it inherits color and scales cleanly.

**Logos.** Tonal wordmark is the brand name set in DM Serif Display. There's no separate symbol — the typography *is* the logo.
