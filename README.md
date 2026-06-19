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

## Live AI ("Ask Sup'Maine") 🤖

The **Ask** tab is a live concierge that knows your itinerary, uses **web search**
for real current places, and can drop new stops straight into your trip. It calls
a tiny serverless proxy (`api/ask.js`) that holds your Claude API key — the key
**never** lives in the browser.

**Deploy the proxy (Vercel, ~3 min):**
1. Import this repo at [vercel.com/new](https://vercel.com/new).
2. Add an env var **`ANTHROPIC_API_KEY`** (from console.anthropic.com).
   Optional: `SUPMAINE_MODEL` (default `claude-opus-4-8`; use `claude-sonnet-4-6`
   for cheaper production), `SUPMAINE_WEB_SEARCH=off` to disable live search,
   `SUPMAINE_TOKEN` to require a shared access token.
3. Deploy. Your endpoint is `https://<your-app>.vercel.app/api/ask`.

**Point the app at it:** open **Ask → ⚙️ Connection** and paste that URL
(and the token if you set one). If you host the *whole app* on Vercel instead of
GitHub Pages, leave the URL blank — it uses the same-origin `/api/ask`.

The proxy adds CORS headers, so the GitHub Pages site can call your Vercel
function cross-origin. Heads-up: an open endpoint can be hit by anyone who learns
the URL — set `SUPMAINE_TOKEN` (and the matching token in the app) for personal use.

## Roadmap

1. ~~**Live Claude API**~~ ✅ shipped — the **Ask** tab + `api/ask.js` proxy.
2. **Google Places** — real photos, live ratings, and hours.
3. **Saved trips / sharing**, map view, and per-day driving directions.

> ⚠️ Ratings, prices and hours in the sample data are **best-effort and
> approximate** (marked `~`). Confirm before relying on them — especially
> reservations and the 🔖 items still to book.
