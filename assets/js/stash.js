/* =========================================================
   Sup'Maine — THE STASH  (local searchable backup list)
   ---------------------------------------------------------
   A big, hand-curated list of BACKUP options along the route:
   coffee, restaurants, activities, sights, shopping, etc.

   The "Ask Sup'Maine" concierge searches this list LOCALLY —
   instantly, offline, and for $0 — before ever touching the
   paid API. Ask "coffee in Bar Harbor" or "rainy day Acadia"
   or "bookstore in Hudson" and it pulls matches straight from
   here, each with a one-tap "➕ Add" to your itinerary.

   The live AI is only used when the stash has nothing good.
   So: the bigger and better this list, the less you spend. 🦞

   ---------------------------------------------------------
   SCHEMA (per entry):
   {
     name:     "Tandem Coffee + Bakery",      // required
     city:     "Portland",                    // town/area — used for search
     day:      "d2",                            // optional default itinerary day if added
     category: "coffee",  // coffee|eat|sight|activity|shop|drive|stay
     tags:     ["roaster","pastries","east end","breakfast"], // search keywords
     rating:   4.6, ratingSource: "Google", price: "$$",
     address:  "742 Congress St, Portland, ME 04102",   // full street address
     why:      "Beloved roaster, incredible morning buns.",  // <b> ok
     todo:     "Grab a morning bun + drip.",
     facts:    ["Cult-favorite pastries.", "Lines move fast."],
     tip:      "Go early on weekends.",
     emoji:    "☕",
     mapsQuery:"Tandem Coffee + Bakery, Portland ME"
   }

   To grow it, paste the GENERATION PROMPT at the bottom of this
   file into another Claude/ChatGPT, then drop the array it gives
   you in below (replacing or extending these examples).
   ========================================================= */
window.SUP_MAINE_STASH = [
  {
    name: "Tandem Coffee + Bakery", city: "Portland", day: "d2", category: "coffee",
    tags: ["roaster", "pastries", "east end", "breakfast", "morning bun"],
    rating: 4.6, ratingSource: "Google", price: "$$",
    address: "742 Congress St, Portland, ME 04102",
    why: "<b>Beloved Portland roaster</b> with famously good pastries.",
    todo: "Grab a morning bun + a drip coffee.", facts: ["Cult-favorite morning buns.", "Two locations in town."],
    tip: "Weekend lines move fast — worth the wait.", emoji: "☕",
    mapsQuery: "Tandem Coffee + Bakery, 742 Congress St, Portland ME"
  },
  {
    name: "Eventide Oyster Co.", city: "Portland", day: "d2", category: "eat",
    tags: ["oysters", "seafood", "lobster roll", "dinner", "lunch", "raw bar"],
    rating: 4.6, ratingSource: "Google", price: "$$$",
    address: "86 Middle St, Portland, ME 04101",
    why: "<b>Iconic Portland raw bar</b> — the brown-butter lobster roll is a rite of passage.",
    todo: "Order oysters + the brown-butter lobster roll.", facts: ["No reservations — expect a wait.", "James Beard award winner."],
    tip: "Go at an off hour to beat the line.", emoji: "🦪",
    mapsQuery: "Eventide Oyster Co, Portland ME"
  },
  {
    name: "Jordan Pond House", city: "Acadia", day: "d4", category: "activity",
    tags: ["popovers", "acadia", "national park", "tea", "hike", "view", "rainy day backup"],
    rating: 4.4, ratingSource: "Google", price: "$$",
    address: "2928 Park Loop Rd, Seal Harbor, ME 04675",
    why: "<b>Popovers with a view</b> of the Bubbles — an Acadia tradition.",
    todo: "Tea + popovers on the lawn, then the easy Jordan Pond loop.", facts: ["In Acadia National Park.", "The flat pond loop is ~3.3 mi."],
    tip: "Reserve a lawn table in summer.", emoji: "🥞",
    mapsQuery: "Jordan Pond House, Acadia"
  }
];

/* =========================================================
   GENERATION PROMPT  (paste into another Claude / ChatGPT)
   ---------------------------------------------------------
You are helping me stock a backup-options list for a road trip.

TRIP: NYC → Portland ME → Acadia/Bar Harbor → Montréal → Hudson Valley
(Kingston/Hudson NY) → NYC, June 19–28 2026. Two travelers who like
great coffee, seafood, good food generally, scenic stops, indie
bookstores/shops, and a rainy-day backup or two per area.

Give me the LARGEST useful list of REAL, currently-operating places as
a single JSON array I can paste into a file. For EACH place use exactly
this schema (no extra keys, valid JSON, double quotes):

{ "name":"", "city":"", "category":"coffee|eat|sight|activity|shop",
  "tags":["lowercase","search","keywords"], "rating":4.5,
  "ratingSource":"Google", "price":"$|$$|$$$", "address":"<full street address>",
  "why":"one tight sentence", "todo":"one short suggestion",
  "facts":["short fact","short fact"], "tip":"one short tip", "emoji":"",
  "mapsQuery":"Name, City State" }

Rules:
- Only real places you're confident exist; include the full street address.
- Cover every stop above. Aim for ~8–15 coffee, ~10–15 eat, plus a good
  mix of activity, sight, and shop per area, and tag rainy-day options
  with "rainy day backup".
- Keep why/todo/tip to ONE sentence each. Output ONLY the JSON array.
   ========================================================= */
