# Tonal — UI Kit

A high-fidelity, mobile-first prototype of the Tonal weather app. Single 390×844 phone shell, illustrated background, glass cards, and the five core screens from the brief:

1. **Dashboard** — hero temperature, weather summary chip, hi/lo + feels-like, glass detail row, horizontal hourly strip, 5-day forecast, sunrise/sunset cards
2. **Welcome** — full-bleed illustrated city sunset, tagline, primary/secondary CTAs
3. **Sign up** — first/last name, email, password + confirm, password requirement chips, Google button
4. **Sign in** — email/username + password, forgot password, Google button
5. **Location consent** — illustrated city scene with floating glass card

Plus two **bottom sheets** that overlay the dashboard:

- **Saved places** — Newark, New York, Jersey City, Montclair as soft cards with delete affordance
- **Settings** — °F/°C, US/metric, theme mode, account, change password, log out

## Files

- `index.html` — runnable prototype with screen switcher
- `styles.css` — UI-kit styles (imports `colors_and_type.css` from project root)
- `Icons.jsx` — line icon set + Google glyph
- `Backgrounds.jsx` — illustrated SVG scenery (city / suburb / rural / park × morning / day / sunset / night)
- `Components.jsx` — primitives: `Phone`, `StatusBar`, `Button`, `IconButton`, `Hero`, `DetailRow`, `ForecastStrip`, `FiveDay`, `BottomBar`, `Sheet`, `SavedLocations`, `Settings`
- `Screens.jsx` — assembled screens
- `mockWeather.js` — static mock data lifted from the codebase

## Notes / placeholders

- All data is static. No fetches, no auth, no persistence.
- Background reacts to `location` + `time` + `weather` props but the dashboard demo uses a fixed `city / sunset / cloudy` look matching the reference image's mood.
- Google sign-in is decorative.
