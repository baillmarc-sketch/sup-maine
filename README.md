# Sup'Maine 🦞

> Your silly little **pocket guide** to a very specific Maine (and nearby) trip.

A warm, Notion-ish, **iPhone-first** travel companion. Built first for the
**AS & MB Maine Adventure** (Jun 19–28, 2026): NYC → Portland → Acadia →
Montréal → Hudson Valley → NYC. Tap any spot for the *why*, quick hard-hitting
facts, ratings, and a **one-tap address to drop into Waze** (plus Maps & Waze buttons).

## Use it

It's a zero-build static site — just open `index.html`.

- **Locally:** `python3 -m http.server` in this folder, then visit the printed URL on your phone (same Wi-Fi). Running over `http(s)` enables offline mode + "Add to Home Screen".
- **Deploy:** push to GitHub Pages (Settings → Pages → deploy from this branch). No build step.
- **On your iPhone:** open it in Safari → Share → **Add to Home Screen**. Now it's a real app icon and works offline on the road.

## What's inside

| File | What it is |
|------|------------|
| `index.html` | App shell + bottom tab bar (Trip / Profile / Plan) |
| `assets/css/styles.css` | Warm paper palette, mobile-first cards |
| `assets/js/data.js` | **The trip.** Single source of truth + the AI schema |
| `assets/js/prompts.js` | The profile prompt + the trip-generation prompt |
| `assets/js/app.js` | Rendering, copy-to-clipboard, Maps/Waze links, filters |
| `sw.js`, `manifest.webmanifest` | Offline PWA bits |

## The three tabs

- **Trip** — day-by-day itinerary. Filter chips (Eats / Sights / Do / Coffee /
  Drives / Stay / Shop) + search. Tap a card to expand facts & photo. Big
  **Copy address** button + **Maps** / **Waze**.
- **Profile** — your traveler profile + a copy-paste prompt to generate one in
  Claude/ChatGPT.
- **Plan** — *bring-your-own-AI* for now: enter dates + profile → copy the
  generated prompt into Claude/ChatGPT → paste the JSON back → the whole guide
  rebuilds. Saved to your device (localStorage).

## Editing the trip

Edit `assets/js/data.js`. Each place needs an `address` (that's what Copy
copies). Photos are plain image URLs — swap in your own / Google Maps photo
links anytime. **Stays** show the city only; paste your real Airbnb addresses
into those cards so Copy → Waze works.

## Roadmap

1. **Live Claude API** — replace the copy/paste Plan flow with one button. The
   prompt in `prompts.js` already targets this exact schema. (Author with
   **Opus**; **Sonnet** for cheaper production runs.)
2. **Google Places** — real photos, live ratings, and hours.
3. **Saved trips / sharing**, map view, and per-day driving directions.

> ⚠️ Ratings, prices and hours in the sample data are **best-effort and
> approximate** (marked `~`). Confirm before relying on them — especially
> reservations and the 🔖 items still to book.
