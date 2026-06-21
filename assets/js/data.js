/* =========================================================
   Sup'Maine — TRIP DATA
   ---------------------------------------------------------
   "AS & MB Maine (+ Montréal) Adventure" — June 19–28, 2026
   NYC → Portland → Acadia → Montréal → Hudson Valley → NYC

   Built from the user's trip starter doc. This is also the
   schema the AI fills later (see the Plan tab).

   ⚠️ Ratings/prices/hours are best-effort and approximate —
   marked with "~". CONFIRM before you rely on them, especially
   reservations and seasonal hours. Items flagged 🔖 still need
   booking. Stays show the city only — paste the real Airbnb
   address into 'address' when you have it (Calendar isn't
   connected — see the note in chat).

   SCHEMA (per place):
   id, day, time, name, emoji, category(eat|sight|activity|
   coffee|drive|stay|shop), rating, ratingSource, price,
   address, why(<b> ok), todo, facts[], tip, photo, mapsQuery
   ========================================================= */

window.SUP_MAINE_TRIP = {
  isSample: false,

  trip: {
    title: "AS & MB Maine Adventure 🦞",
    dates: "Jun 19–28, 2026",
    base: "NYC → Portland → Acadia → Montréal → Hudson Valley",
    travelers: "AS & MB",
    vibe: "Coast, lighthouses, lobster, café-hopping & a Montréal food bender",
    blurb: "Ten days up the New England coast into Québec and back down the Hudson Valley. Tap any spot for the why, the facts, and a one-tap address to drop into Waze."
  },

  // Inferred from the itinerary — refine it via the prompt in the Profile tab.
  profile: {
    name: "AS & MB",
    summary: "Two travelers chasing great food, coastal scenery, cafés, markets and a little antiquing. Comfortable with long scenic drives and a flexible plan. (This is inferred — run the Profile prompt to make it yours.)",
    loves: ["Standout restaurants & oyster bars", "Coastal views + lighthouses", "Café and market crawls", "Antiques & indie shops", "A scenic drive"],
    avoids: ["Over-packed days", "Tourist traps with no payoff"],
    pace: "One or two anchor activities a day, room to wander",
    diet: "No known restrictions — update me",
    budget: "Mid-range, happy to splurge on a great meal",
    notes: "iPhone users, drive with Waze. Lodging + most dinners are booked (pulled from Google Calendar). Two dinner nights are still open: Jun 23 (Acadia) and Jun 26 (Montréal)."
  },

  days: [
    { id: "d1",  date: "Fri Jun 19", iso: "2026-06-19", lat: 43.6591, lon: -70.2568, label: "NYC → Portland",        subtitle: "The long drive north, Portsmouth pit-stop, settle into the Old Port" },
    { id: "d2",  date: "Sat Jun 20", iso: "2026-06-20", lat: 43.6591, lon: -70.2568, label: "Southern Maine coast",  subtitle: "Cape Elizabeth lighthouses, Kennebunkport, Ogunquit" },
    { id: "d3",  date: "Sun Jun 21", iso: "2026-06-21", lat: 43.6591, lon: -70.2568, label: "Portland flex day",     subtitle: "Peaks Island, a sail, or a brewery crawl — your call" },
    { id: "d4",  date: "Mon Jun 22", iso: "2026-06-22", lat: 44.3876, lon: -68.2039, label: "Portland → Acadia",     subtitle: "Camden lunch on the way, Cadillac sunset to land it" },
    { id: "d5",  date: "Tue Jun 23", iso: "2026-06-23", lat: 44.3876, lon: -68.2039, label: "Full Acadia day",       subtitle: "Ocean Path, Jordan Pond popovers, the Beehive if you're brave" },
    { id: "d6",  date: "Wed Jun 24", iso: "2026-06-24", lat: 45.5019, lon: -73.5674, label: "Acadia → Montréal",     subtitle: "Bangor coffee, Burlington lunch, cross into Québec" },
    { id: "d7",  date: "Thu Jun 25", iso: "2026-06-25", lat: 45.5019, lon: -73.5674, label: "Mile End & the Plateau",subtitle: "Bagels, Jean-Talon Market, cafés and bookstores" },
    { id: "d8",  date: "Fri Jun 26", iso: "2026-06-26", lat: 45.5019, lon: -73.5674, label: "Mount Royal & Old MTL", subtitle: "The mountain, the old city, Atwater Market, cocktails" },
    { id: "d9",  date: "Sat Jun 27", iso: "2026-06-27", lat: 42.2528, lon: -73.7907, label: "Montréal → Hudson Valley", subtitle: "Drive south, Hudson antiques on Warren St, dinner at Serre" },
    { id: "d10", date: "Sun Jun 28", iso: "2026-06-28", lat: 42.2528, lon: -73.7907, label: "Hudson Valley → NYC",   subtitle: "Coffee, a slow morning, roll home" }
  ],

  places: [
    /* ---------------- DAY 1 — NYC → Portland ---------------- */
    {
      id: "p101", day: "d1", time: "Morning", name: "Drive: NYC → Portland", emoji: "🚗",
      category: "drive", rating: "", ratingSource: "", price: "",
      address: "Portland, ME", mapsQuery: "Portland Maine",
      why: "The <b>kickoff haul</b> — ~5.5–6 hrs up I-95 into Maine.",
      todo: "Get an early start to beat summer-Friday traffic out of the city. Break it up in Portsmouth.",
      facts: ["~5.5–6 hrs without stops.", "Friday afternoon I-95 backs up — leave early or late.", "Tolls through CT/MA/NH/ME — have E-ZPass."],
      tip: "Use Waze for the live I-95 backups; the Hampton, NH tolls clog up midday."
    },
    {
      id: "p102", day: "d1", time: "Lunch", name: "Coffee / lunch stop — Portsmouth, NH", emoji: "⚓",
      category: "eat", slot: true, searchQuery: "coffee and lunch Market Square Portsmouth NH",
      why: "A <b>handsome harbor town</b> at the halfway mark — perfect leg-stretch. Pick a real spot below, or search the square.",
      facts: ["One of the oldest towns in the US (settled 1623).", "Walkable brick downtown around Market Square.", "~1 hr south of Portland."],
      tip: "Metered street parking around Market Square — bring a few quarters.",
      options: [
        { name: "Popovers on the Square", address: "8 Congress St, Portsmouth, NH 03801", rating: 4.4, price: "$$", note: "Market Square cafe + the namesake popovers" },
        { name: "The Goods", address: "29 Vaughan Mall, Portsmouth, NH 03801", rating: 4.6, price: "$", note: "Great coffee + breakfast wraps" }
      ]
    },
    {
      id: "p103", day: "d1", time: "3:00p", name: "✅ Stay — Morrill Mansion (Portland)", emoji: "🛏️",
      category: "stay", checkIn: "2026-06-19", checkOut: "2026-06-22", rating: "", ratingSource: "", price: "",
      address: "249 Vaughan St, Portland, ME 04102", mapsQuery: "249 Vaughan St Portland ME",
      why: "Your <b>base for 3 nights</b> (Jun 19–22) in the West End, walk to the Old Port.",
      todo: "Self check-in (front door C2490 → Room 2, bedroom code 1592), drop bags, grab your parking spot off Brackett St, then dinner at Ladyfish.",
      codes: [
        { label: "Front door", value: "C2490" },
        { label: "Bedroom · Room 2", value: "1592", sub: "enter, then turn the deadbolt" },
        { label: "Wi-Fi", value: "Morrill Mansion", sub: "pw: Portland" }
      ],
      facts: [
        "🛏️ Room 2, 2nd floor. Brick building, green trim & gold doors, corner of Brackett & Vaughan.",
        "🅿️ One off-street spot (compact car) — entrance around on Brackett St, park inside the white lines, unassigned.",
        "Check-in Fri Jun 19, 3–10 PM · Checkout Mon Jun 22, 10 AM.",
        "Hosts Katrina & Mark live a block away — message for towels/TP/trash. Host +1 978-270-2354 · Conf HMPN9HPQ2M."
      ],
      tip: "Parking spot fits a compact only — stay inside the white lines so other guests can move around."
    },
    {
      id: "p104", day: "d1", time: "7:00p", name: "✅ Dinner — Ladyfish", emoji: "🐟",
      category: "eat", needsConfirm: true, rating: 4.6, ratingSource: "Google ~", price: "$$$",
      address: "425 Fore St, Portland, ME 04101",
      why: "<b>Joyful, unfussy Maine seafood</b> from the Mr. Tuna team — a perfect first night.",
      todo: "Go for the scallops-in-a-blanket, tuna carpaccio, steamed buns with uni butter, and lobster frites.",
      facts: ["Summer pop-up (May–Oct) in the old Bar Futo space.", "Chef Christine Lau, ex–Kimika (NYC, Beard semifinalist).", "Playful seafood with Chinese, Italian & Latin touches.", "Small plates — portions run dainty, prices are not."],
      tip: "⚠️ Reservation is marked TENTATIVE (7 PM) — confirm it. Ends ~8:30 PM."
    },

    /* ---------------- DAY 2 — Southern Maine coast ---------------- */
    {
      id: "p200", day: "d2", time: "9:30a", name: "Tandem Coffee + Bakery", emoji: "☕",
      category: "coffee", rating: 4.6, ratingSource: "Google ~", price: "$$",
      address: "742 Congress St, Portland, ME 04102", mapsQuery: "Tandem Coffee + Bakery, 742 Congress St, Portland ME",
      why: "<b>Beloved Portland roaster</b> with famously good pastries — the right way to kick off today.",
      todo: "Grab a morning bun + a drip and roll out.",
      facts: ["Cult-favorite morning buns.", "Two Portland locations."],
      tip: "Heading there now — eat the bun warm. ☕"
    },
    {
      id: "p201", day: "d2", time: "11:00a", name: "Portland Head Light", emoji: "🗼",
      category: "sight", rating: 4.8, ratingSource: "Google ~", price: "Free park",
      address: "12 Captain Strout Cir, Cape Elizabeth, ME 04107",
      why: "The <b>most-photographed lighthouse in America</b>, and it earns it.",
      todo: "Walk the Fort Williams Park cliff paths, get the postcard shot, peek at the keeper's-house museum.",
      facts: ["Commissioned by George Washington; lit 1791 — Maine's oldest lighthouse.", "Sits in 90-acre Fort Williams Park (free entry).", "Lot fills by mid-morning in summer."],
      tip: "Go early for soft light and easy parking; museum is a few bucks, cash."
    },
    {
      id: "p202", day: "d2", time: "12:30p", name: "Two Lights State Park", emoji: "🌊",
      category: "activity", rating: 4.8, ratingSource: "Google ~", price: "$",
      address: "7 Tower Dr, Cape Elizabeth, ME 04107",
      why: "Rugged rocky headland — <b>big-ocean drama</b>, easy access, right by the lobster shack.",
      todo: "Scramble the rocks, watch the surf, then grab a roll next door.",
      facts: ["Small day-use fee.", "Edward Hopper painted these rocks.", "Named for its two historic light towers."],
      tip: "Pair it with lunch at The Lobster Shack a 2-min drive away."
    },
    {
      id: "p203", day: "d2", time: "1:30p", name: "The Lobster Shack at Two Lights", emoji: "🦞",
      category: "eat", rating: 4.5, ratingSource: "Google ~", price: "$$",
      address: "225 Two Lights Rd, Cape Elizabeth, ME 04107",
      why: "Picnic tables on a cliff. <b>Lobster + Atlantic view</b> = peak Maine.",
      todo: "Lobster roll or a whole steamer, eat it on the rocks over the ocean.",
      facts: ["Operating since the 1920s.", "Seasonal, order-at-the-window.", "Cash and card."],
      tip: "Windy days, hold your napkins — and your roll."
    },
    {
      id: "p203b", day: "d2", time: "12:30p", name: "🦞 Bite Into Maine (lunch!)", emoji: "🦞",
      category: "eat", rating: 4.8, ratingSource: "Google ~", price: "$$",
      address: "1000 Shore Rd, Cape Elizabeth, ME 04107", mapsQuery: "Bite Into Maine food truck Fort Williams Cape Elizabeth",
      why: "<b>The IYKYK lobster roll, zero detour</b> — a food truck parked at Fort Williams, right where you're already seeing Portland Head Light.",
      todo: "Try the Connecticut-style (warm, buttered) or go wild — wasabi, curry, picnic-style.",
      facts: ["Truck sits at Fort Williams Park by the lighthouse.", "Creative lobster-roll styles you won't find elsewhere.", "Seasonal; eat it on the lawn."],
      tip: "No detour at all — fold it into your Portland Head Light stop."
    },
    {
      id: "p204", day: "d2", time: "3:30p", name: "Kennebunkport (Dock Square)", emoji: "⛵",
      category: "activity", rating: 4.7, ratingSource: "Google ~", price: "",
      address: "Dock Square, Kennebunkport, ME 04046", mapsQuery: "Dock Square Kennebunkport ME",
      why: "Postcard <b>seaside village</b> — boutiques, boats and Bush-family lore.",
      todo: "Wander Dock Square's shops, stroll out toward Walker's Point, grab an ice cream.",
      facts: ["Walker's Point is the Bush family compound (view from Ocean Ave).", "Very walkable, very summery.", "Parking is tight midday — circle or use a lot."],
      tip: "Drive Ocean Avenue for the mansion-and-sea views."
    },
    {
      id: "p205", day: "d2", time: "5:30p", name: "Ogunquit — Marginal Way", emoji: "🪨",
      category: "activity", rating: 4.9, ratingSource: "Google ~", price: "Free",
      address: "Marginal Way, Ogunquit, ME 03907", mapsQuery: "Marginal Way Ogunquit ME",
      why: "A <b>1.25-mi cliff-walk</b> over the sea — arguably the prettiest paved stroll in Maine.",
      todo: "Walk Marginal Way to Perkins Cove, browse the cove, then head back to Portland for dinner.",
      facts: ["Paved, mostly flat, benches the whole way.", "Connects downtown Ogunquit to Perkins Cove.", "Sunset here is unreal."],
      tip: "Start at the Perkins Cove end if you want easier parking."
    },
    {
      id: "p206", day: "d2", time: "7:15p", name: "✅ Dinner — Twelve", emoji: "🍽️",
      category: "eat", rating: 4.7, ratingSource: "Google ~", price: "$$$$",
      address: "115 Thames St, Portland, ME 04101",
      why: "Portland's <b>fine-dining showpiece</b> — pedigree kitchen, restored maritime room.",
      todo: "Settle in for the tasting menu (or à la carte). Trust the kitchen and the pairings.",
      facts: ["Chefs Colin Wyatt (ex–Eleven Madison Park) & Daniel Gorlas (ex–Per Se).", "Housed in a historic brick maritime building, rebuilt brick by brick.", "Tasting menus ~$80 (3-course) / ~$100 (5-course) + à la carte.", "The splurge night of the trip."],
      tip: "Reservation booked for 7:15 PM (ends ~9 PM). Alt if plans change: Eventide Oyster Co. (no-res, 86 Middle St)."
    },

    /* ---------------- DAY 3 — Portland flex day ---------------- */
    {
      id: "p300", day: "d3", time: "8:00a", name: "Standard Baking Co.", emoji: "🥐",
      category: "coffee", rating: 4.7, ratingSource: "Google ~", price: "$",
      address: "75 Commercial St, Portland, ME 04101", mapsQuery: "Standard Baking Co, 75 Commercial St, Portland ME",
      why: "<b>Best bakery on the waterfront</b> — croissants, morning buns and proper bread.",
      todo: "Get the <b>spicy egg danish</b> and the <b>plum & almond tart</b> — plus a coffee for the waterfront walk.",
      facts: ["Below the Fore Street restaurant on Commercial St.", "Gets busy early; pastries are the move.", "Cash-friendly, quick in-and-out."],
      tip: "Grab extras for the Peaks Island ferry."
    },
    {
      id: "p301", day: "d3", time: "9:00a", name: "Tandem Coffee + Bakery", emoji: "☕",
      category: "coffee", rating: 4.7, ratingSource: "Google ~", price: "$$",
      address: "742 Congress St, Portland, ME 04102",
      why: "Cult-favorite coffee + <b>biscuits worth a detour</b>.",
      todo: "Cortado + a fresh biscuit on the old-gas-station patio before the day's plan.",
      facts: ["In a converted 1960s gas station.", "Biscuits sell out — mornings best.", "Roasts its own beans across town."],
      tip: "Grab extra biscuits for the ferry or the boat."
    },
    {
      id: "p309", day: "d3", time: "8:30a", name: "☕ Coffee roasters — Portland", emoji: "☕",
      category: "coffee", slot: true, searchQuery: "coffee roaster Portland Maine",
      why: "Portland is a <b>serious coffee-roasting town</b> — go beyond Tandem for beans + a cup.",
      facts: ["Punches way above its weight for specialty coffee.", "Most roasters open ~7–8 AM; some close mid-afternoon."],
      tip: "Anna hasn't done Speckled Ax — worth a wood-roasted cup even if it's not your favorite.",
      options: [
        { name: "Speckled Ax (wood-roasted)", address: "567 Congress St, Portland, ME 04101", rating: 4.6, price: "$", note: "Rare wood-fired roaster — Anna hasn't been" },
        { name: "Coffee By Design (roastery)", address: "1 Diamond St, Portland, ME 04101", rating: 4.5, price: "$", note: "OG Portland roaster — East Bayside HQ & cupping room (India St location closed)" }
      ]
    },
    {
      id: "p302", day: "d3", time: "10:30a", name: "Peaks Island ferry (Casco Bay Lines)", emoji: "⛴️",
      category: "activity", rating: 4.7, ratingSource: "Google ~", price: "$",
      address: "56 Commercial St, Portland, ME 04101", mapsQuery: "Casco Bay Lines ferry terminal Portland",
      why: "A <b>20-min ferry</b> to a bike-around island — easy escape from the mainland.",
      todo: "Ferry over, rent bikes, loop the island (~4 mi), snack at the wharf, ferry back.",
      facts: ["Casco Bay Lines runs frequent boats from the Old Port.", "Island loop is flat and ~1 hr by bike.", "Bring a layer — it's breezy on the water."],
      tip: "Check the return ferry times before you settle in for a long lunch."
    },
    {
      id: "p303", day: "d3", time: "6:00p", name: "⭐ Portland Schooner Co. — Sunset Sail", emoji: "⛵",
      category: "activity", rating: 4.7, ratingSource: "Google ~554", price: "$75/adult",
      address: "Maine State Pier, 56 Commercial St, Portland, ME 04101", mapsQuery: "Portland Schooner Company Maine State Pier",
      why: "<b>Wine at sunset under sail</b> on a 1924 wooden windjammer — exactly Anna's thing.",
      todo: "BYOB: bring a bottle + cheese. ~2-hr sail past Portland Head Light, Fort Gorges & seals. Help hoist the sails if you like.",
      facts: ["Historic schooners Bagheera (1924) / Wendameen (1912), on the National Register.", "BYOB — no bar aboard; bring wine, beer, a picnic.", "~2 hrs; departs the Maine State Pier (past Gate 5).", "Calm, protected water; all ages; not narrated."],
      tip: "⚠️ Conflicts with your 7 PM Wayside dinner — the 6 PM sail ends ~8 PM. Take the 3:30 PM sail (or shift dinner) to do both. Arrive 30 min early for a bow-rail seat; book ~weeks ahead, it sells out.",
      photo: "https://images.unsplash.com/photo-1502209524164-acea936639a2?auto=format&fit=crop&w=1200&q=60"
    },
    {
      id: "p307", day: "d3", time: "1:00p", alt: true, name: "Lucky Catch — Lobster Boat Cruise", emoji: "🦞",
      category: "activity", rating: 4.6, ratingSource: "Yelp ~261", price: "$60/adult",
      address: "Long Wharf, 170 Commercial St, Portland, ME 04101", mapsQuery: "Lucky Catch Cruises Long Wharf Portland",
      why: "<b>Hands-on working lobster boat</b> — haul the traps, then eat your catch.",
      todo: "Haul, measure & band lobsters; see Portland Head Light, Fort Gorges, Seal Rocks. Buy your lobster at boat price and walk it to Portland Lobster Co. to cook.",
      facts: ["80–90 min on a real lobster boat.", "⚠️ Sunday Jun 21 = catch-and-release DEMO (Maine bars Sunday hauling in summer).", "No bar aboard.", "Small boat — books up fast."],
      tip: "Sit near the guide — engine noise can drown the narration."
    },
    {
      id: "p308", day: "d3", time: "Evening", alt: true, name: "Casco Bay Lines — Sunset Run", emoji: "⛴️",
      category: "activity", rating: 4.5, ratingSource: "Google ~", price: "~$25–30",
      address: "Maine State Pier, 56 Commercial St, Portland, ME 04101", mapsQuery: "Casco Bay Lines Maine State Pier Portland",
      why: "The <b>cheapest, longest, most relaxed</b> time on the water — low-key twilight ferry.",
      todo: "2.5–3 hr loop of inner Casco Bay islands + the Portland skyline at twilight. Bring a picnic.",
      facts: ["Large passenger ferry — 2.5–3 hrs.", "Fares rose Jun 19–20, 2026 — confirm the rate.", "⚠️ Alcohol generally prohibited on scheduled service — confirm before bringing wine.", "Narration only with 10+ passengers."],
      tip: "Bring layers + a thermos. Good pick if you'd rather chill than actively sail."
    },
    {
      id: "p304", day: "d3", time: "Afternoon", name: "Old Port brewery crawl", emoji: "🍺",
      category: "activity", rating: 4.6, ratingSource: "Google ~", price: "$$",
      address: "Industrial Way, Portland, ME 04103", mapsQuery: "Allagash Brewing Portland Maine",
      why: "Portland is a <b>serious beer town</b> — the East Bayside 'yeast bayside' cluster is walkable.",
      todo: "Hit Allagash, Austin Street, Battery Steele or Rising Tide — all close together.",
      facts: ["Allagash offers free tours/tastings (check schedule).", "Many taprooms cluster on Industrial Way & East Bayside.", "Rideshare between clusters if you're tasting."],
      tip: "Don't drive between tastings — Portland's compact, grab a Lyft."
    },
    {
      id: "p305", day: "d3", time: "5:30p", name: "Longfellow Hotel bar", emoji: "🍸",
      category: "eat", rating: 4.6, ratingSource: "Google ~", price: "$$$",
      address: "759 Congress St, Portland, ME 04102", mapsQuery: "Longfellow Hotel Portland Maine bar",
      why: "Stylish hotel <b>cocktail bar</b> — a polished start to the last Portland night.",
      todo: "Pre-dinner cocktails, then walk to dinner (Scales or Twelve if you want the splurge).",
      facts: ["Newer boutique hotel on Congress St.", "Strong cocktail program.", "Easy walk to the Arts District restaurants."],
      tip: "Good plan B for a rainy flex day too."
    },
    {
      id: "p306", day: "d3", time: "7:00p", name: "✅ Dinner — Wayside Tavern", emoji: "🍷",
      category: "eat", needsConfirm: true, rating: 4.5, ratingSource: "Google ~", price: "$$$",
      address: "747 Congress St, Portland, ME 04102",
      why: "<b>Cozy European-inspired tavern</b> in the West End — comfort done right.",
      todo: "Lean into the pastas, beer-battered cod cheeks, and the eggplant terrine with housemade mozzarella.",
      facts: ["Mostly Italian & French; deep greens, gold and Victorian wood.", "Portland Press Herald called it 'a winner, with something for everyone.'", "Neighborhood feel, attentive service.", "A block from the Longfellow Hotel bar — good pre-dinner cocktail."],
      tip: "⚠️ Reservation marked TENTATIVE (Sun 7 PM) — confirm it (hours vary by day). Alt: Scales, 68 Commercial St, on the water."
    },
    {
      id: "p320", day: "d2", time: "Evening", name: "Blyth & Burroughs", emoji: "🍸",
      category: "activity", done: true, rating: "", ratingSource: "", price: "$$$",
      address: "14 Market St, Portland, ME 04101", mapsQuery: "Blyth & Burroughs, 14 Market St, Portland ME",
      why: "<b>Hidden speakeasy cocktail bar</b> in the Old Port — the secret-door, craft-cocktail spot you hope to stumble into.",
      todo: "", facts: ["Tucked-away speakeasy vibe.", "Inventive, well-made craft cocktails."], tip: "Amazing — total find. 💛"
    },
    {
      id: "p321", day: "d2", time: "Evening", name: "Mount Desert Ice Cream", emoji: "🍦",
      category: "eat", done: true, rating: "", ratingSource: "", price: "$",
      address: "51 Exchange St, Portland, ME 04101", mapsQuery: "Mount Desert Ice Cream, 51 Exchange St, Portland ME",
      why: "<b>Cult Maine ice cream</b> (born in Bar Harbor) — wildly creative small-batch flavors.",
      todo: "", facts: ["Known for adventurous, churned-daily flavors.", "Old Port location on Exchange St."], tip: "So good. 💛"
    },
    {
      id: "p310", day: "d2", time: "Afternoon", name: "Soleil", emoji: "🎁",
      category: "shop", done: true, rating: "", ratingSource: "", price: "",
      address: "550 Congress St, Portland, ME 04101", mapsQuery: "Soleil, 550 Congress St, Portland ME",
      why: "<b>Cheery home-goods & gift shop</b> in the Arts District — you two loved it. ✨",
      todo: "", facts: [], tip: "Visited — so cute. 💛"
    },
    {
      id: "p311", day: "d2", time: "Afternoon", name: "Electric Buddhas", emoji: "🎵",
      category: "shop", done: true, rating: "", ratingSource: "", price: "",
      address: "556 Congress St, Portland, ME 04101", mapsQuery: "Electric Buddhas, 556 Congress St, Portland ME",
      why: "<b>Vinyl record shop</b> right next to Soleil — flip the crates, good finds.",
      todo: "", facts: [], tip: "Visited — so cute. 💛"
    },
    {
      id: "p312", day: "d2", time: "Afternoon", name: "September", emoji: "👗",
      category: "shop", done: true, rating: "", ratingSource: "", price: "",
      address: "19 Pleasant St, Portland, ME 04101", mapsQuery: "September, 19 Pleasant St, Portland ME",
      why: "<b>Where Anna got the dress.</b> 👗 A lovely little Portland boutique.",
      todo: "", facts: [], tip: "Dress acquired. 💛"
    },
    {
      id: "p313", day: "d2", time: "Afternoon", name: "Ember", emoji: "🏺",
      category: "shop", done: true, rating: "", ratingSource: "", price: "",
      address: "5 South St, Portland, ME 04101", mapsQuery: "Ember, 5 South St, Portland ME",
      why: "<b>Joint shop from Campfire Pottery & Mulxiply</b> — handmade ceramics, jewelry, and emerging makers.",
      todo: "", facts: [], tip: "This is where you spotted the Campfire plates. 💛"
    },
    {
      id: "p314", day: "d2", time: "To buy", name: "Campfire Pottery — plates (order online)", emoji: "🍽️",
      category: "shop", rating: "", ratingSource: "", price: "",
      why: "<b>Order the plates online</b> when you're home — same makers as Ember. <a href=\"https://campfirepottery.com\" target=\"_blank\" rel=\"noopener\">Shop campfirepottery.com →</a>",
      todo: "Pick the plates (sandstone is the classic) and ship them home.",
      facts: ["Handmade in Gray, Maine.", "Plates, bowls, mugs in earthy tones."],
      tip: "Check the ✓ once you've ordered."
    },
    {
      id: "p315", day: "d2", time: "Afternoon", name: "Onggi", emoji: "🫙",
      category: "eat", done: true, rating: "", ratingSource: "", price: "$$",
      address: "131 Washington Ave, Portland, ME 04101", mapsQuery: "Onggi, 131 Washington Ave, Portland ME",
      why: "<b>Fermentation market & café</b> on Washington Ave — funky ferments, Asian pantry gems, little lunch.",
      todo: "", facts: ["A James Beard-nominated specialty shop.", "Right next to Root Wild."], tip: "So good. 💛"
    },
    {
      id: "p316", day: "d2", time: "Afternoon", name: "Root Wild Kombucha", emoji: "🍵",
      category: "activity", done: true, rating: "", ratingSource: "", price: "$$",
      address: "135 Washington Ave, Portland, ME 04101", mapsQuery: "Root Wild Kombucha, 135 Washington Ave, Portland ME",
      why: "<b>Kombucha & tea-beer taproom</b> — organic, foraged ingredients, dog-friendly patio energy.",
      todo: "", facts: ["Licensed brewery doing kombucha + tea-infused beers.", "A few doors from Onggi."], tip: "So good. 💛"
    },
    {
      id: "p318", day: "d2", time: "Afternoon", name: "The Post Supply", emoji: "🕯️",
      category: "shop", done: true, rating: "", ratingSource: "", price: "$$",
      address: "65 Washington Ave, Portland, ME 04101", mapsQuery: "The Post Supply, 65 Washington Ave, Portland ME",
      why: "<b>Amazing</b> home-goods & gift shop — candles, decor, unique finds. You loved it. 💛",
      todo: "", facts: ["Same Washington Ave strip as Sissle, Onggi & Root Wild.", "Closed Tuesdays."], tip: ""
    },
    {
      id: "p317", day: "d2", time: "Afternoon", name: "Sissle & Daughters Cheesemongers & Grocers", emoji: "🧀",
      category: "shop", done: true, rating: "", ratingSource: "", price: "$$",
      address: "107 Washington Ave, Portland, ME 04101", mapsQuery: "Sissle & Daughters, 107 Washington Ave, Portland ME",
      why: "<b>Absolutely loved it</b> — cheesemonger & grocer with stellar cheese, charcuterie, wine & gourmet bits.",
      todo: "", facts: ["Founded 2018 by Mary Chapman & Will Sissle.", "Same Washington Ave strip as Onggi & Root Wild."], tip: "Got cheese & such — so good. 🧀💛"
    },

    /* ---------------- DAY 4 — Portland → Acadia ---------------- */
    {
      id: "p401", day: "d4", time: "Morning", name: "Drive: Portland → Acadia", emoji: "🚗",
      category: "drive", rating: "", ratingSource: "", price: "",
      address: "Bar Harbor, ME 04609", mapsQuery: "Bar Harbor Maine",
      why: "The <b>coastal run Down East</b> — ~3–3.5 hrs with a Camden stop baked in.",
      todo: "Roll up Route 1 / I-295, lunch in Camden, arrive Bar Harbor mid-afternoon.",
      facts: ["~3–3.5 hrs Portland → Bar Harbor.", "Summer bottleneck at Wiscasset's bridge.", "Lobster pounds and farm stands the whole way."],
      tip: "Waze around the Wiscasset backup; it's the worst pinch point on Route 1."
    },
    {
      id: "p402", day: "d4", time: "12:30p", name: "Lunch stop — Camden", emoji: "🏔️",
      category: "eat", slot: true, searchQuery: "lunch Camden Maine harbor",
      why: "<b>Where the mountains meet the sea</b> — the prettiest stop on the drive. Grab lunch by the harbor.",
      facts: ["Classic windjammer schooner harbor + walkable downtown.", "Mt. Battie's auto road gives a big view in ~20 min.", "Camden Hills State Park is right here."],
      tip: "Short on time? Drive up Mt. Battie for the view, then a quick harbor-side bite.",
      options: [
        { name: "The Waterfront Restaurant", address: "40 Bayview St, Camden, ME 04843", rating: 4.4, price: "$$$", note: "Harborside seafood + lobster stew" },
        { name: "Peter Ott's on the Water", address: "16 Bay View St, Camden, ME 04843", rating: 4.5, price: "$$", note: "Lobster rolls, harbor views" },
        { name: "Camden Deli", address: "37 Main St, Camden, ME 04843", rating: 4.4, price: "$", note: "Casual sandwiches over the harbor" }
      ]
    },
    {
      id: "p402b", day: "d4", time: "11:45a", alt: true, name: "🦞 McLoons Lobster Shack (hidden wharf)", emoji: "🦞",
      category: "eat", rating: 4.7, ratingSource: "Google ~", price: "$$",
      address: "315 Island Rd, South Thomaston, ME 04858", mapsQuery: "McLoons Lobster Shack South Thomaston ME",
      why: "<b>The IYKYK midcoast lobster roll</b> — a working wharf near Rockland, ~5 min off Route 1 and right before Camden.",
      todo: "Order at the shack window, grab a picnic table over the water, lobster roll + a whoopie pie.",
      facts: ["On a real working lobster wharf in Spruce Head.", "Seasonal (summer); order-at-window.", "~5 min detour off Route 1 — basically on the way to Camden."],
      tip: "Beat the noon rush — tables fill fast on a sunny day. Swap this for the Camden lunch slot."
    },
    {
      id: "p402c", day: "d4", time: "11:30a", alt: true, name: "🦞 Five Islands Lobster Co. (off the beaten path)", emoji: "🦞",
      category: "eat", rating: 4.7, ratingSource: "Google ~", price: "$$",
      address: "1447 Five Islands Rd, Georgetown, ME 04548", mapsQuery: "Five Islands Lobster Co Georgetown ME",
      why: "<b>Order off the dock, eat over the water</b> — the full hidden-gem experience, ~20 min down a peninsula off Route 1 near Bath.",
      todo: "Lobster roll or a boiled lobster on the wharf; BYOB and watch the boats unload.",
      facts: ["On a working dock in Georgetown — true off-the-beaten-path.", "~20 min out-and-back off Route 1.", "Seasonal; BYOB; cash-friendly."],
      tip: "It's a detour, not on the way — leave Portland a touch earlier and make it an early lunch."
    },
    {
      id: "p402d", day: "d4", time: "12:00p", alt: true, name: "🦞 Red's Eats (Wiscasset)", emoji: "🦞",
      category: "eat", rating: 4.5, ratingSource: "Google ~", price: "$$$",
      address: "41 Water St, Wiscasset, ME 04578", mapsQuery: "Red's Eats Wiscasset ME",
      why: "<b>Maine's most famous lobster roll</b> — a whole lobster's worth of meat, right on Route 1 in Wiscasset.",
      todo: "Get the lobster roll (butter or mayo on the side). Brace for the line.",
      facts: ["Iconic roadside shack, directly on Route 1 — no detour.", "⚠️ Lines run 45–90 min on summer afternoons.", "Seasonal; cash & card."],
      tip: "⚠️ The wait is the catch. If the line's brutal, Sprague's is right across the street with the same view and a fraction of the wait."
    },
    {
      id: "p402e", day: "d4", time: "12:00p", alt: true, name: "🦞 Sprague's Lobster (Wiscasset)", emoji: "🦞",
      category: "eat", rating: 4.6, ratingSource: "Google ~", price: "$$",
      address: "22 Main St, Wiscasset, ME 04578", mapsQuery: "Sprague's Lobster Wiscasset ME",
      why: "<b>The savvy Wiscasset pick</b> — same Route 1 spot, on the Sheepscot River, a fraction of Red's line.",
      todo: "Order at the window, take a picnic table over the water, lobster roll + onion rings.",
      facts: ["Right by the bridge on Route 1 — waterfront picnic tables.", "Much shorter wait than Red's across the street.", "Seasonal; order-at-window."],
      tip: "The locals' move when Red's line is out the door — basically on the way, no detour."
    },
    {
      id: "p402f", day: "d4", time: "2:30p", alt: true, name: "🦞 Trenton Bridge Lobster Pound", emoji: "🦞",
      category: "eat", rating: 4.7, ratingSource: "Google ~", price: "$$",
      address: "1237 Bar Harbor Rd, Trenton, ME 04605", mapsQuery: "Trenton Bridge Lobster Pound Trenton ME",
      why: "<b>Classic boiled-in-seawater pound</b> right on Rte 3 at the gateway to Mount Desert Island — the last stop before Bar Harbor.",
      todo: "Watch them boil in the wood-fired pots; get a whole lobster on the picnic tables. Easy arrival-day or departure-day stop.",
      facts: ["Iconic red-and-white striped pound, family-run since 1956.", "Right on Rte 3 — on the way INTO Bar Harbor (Day 4) or OUT toward Bangor (Day 6).", "Seasonal; cash & card."],
      tip: "Great low-effort dinner the night you arrive, or a send-off lobster on the drive out to Montréal."
    },
    {
      id: "p405", day: "d4", time: "3:00p", name: "🥃 Luce Spirits (Rockland)", emoji: "🥃",
      category: "activity", rating: "", ratingSource: "", price: "$$",
      address: "474 Main St, Rockland, ME 04841", mapsQuery: "Luce Spirits, 474 Main St, Rockland ME",
      why: "<b>Maine-made spirits tasting room</b> in downtown Rockland — a fun midcoast stop, right on the Acadia drive.",
      todo: "Pull off in Rockland for a tasting flight, then carry on up Route 1 toward Bar Harbor.",
      facts: ["Downtown Rockland, on Route 1 (~1h30 from Portland, ~1h45 to Bar Harbor).", "Open Mondays ~3–8 PM (hours vary — worth a quick confirm)."],
      tip: "Time it ~3 PM so you still make Cadillac sunset. One taster drives. 🥃"
    },
    {
      id: "p403", day: "d4", time: "3:00p", name: "✅ Stay — Lafayette Inn (Bar Harbor)", emoji: "🛏️",
      category: "stay", checkIn: "2026-06-22", checkOut: "2026-06-24", rating: "", ratingSource: "", price: "",
      address: "12 Roberts Ave, Bar Harbor, ME 04609",
      why: "The <b>Look Nook (unit #1)</b> — your Acadia base for 2 nights (Jun 22–24), walk to the waterfront.",
      todo: "Park, enter the Inn (front-door code), shoes off in the entryway, then your room is the first door on the right at the top of the stairs.",
      codes: [
        { label: "Front door · Inn", value: "1290" },
        { label: "Private room", value: "2703", sub: "after the code, turn the knob counter-clockwise to open the deadbolt" },
        { label: "Wi-Fi", value: "Lafayette Fast Wifi", sub: "pw: livingthedream" }
      ],
      facts: [
        "🛏️ Look Nook, unit #1 — 2nd floor of the light-blue Inn with the yellow door, 5th house on the left. Your room is the first door on the right at the top of the stairs.",
        "🅿️ Park in any of the 3 spaces in front of the building, right of the front porch. DON'T take the furthest-left spot (reserved for Captains Quarters). Leave room for other guests.",
        "🅿️ Overflow: 1 Roberts Square, ~100 ft down the street — first & last space on your right, signed 'Reserved Parking for Lafayette Inn.'",
        "👟 Shoes off in the entryway. 🔥 Living-room fireplace is for show — don't use it.",
        "💡 Bedside outlets are on the room's main light switch — pull the light-switch cord to kill the lights but keep the outlets powered.",
        "Check-in 3 PM · Checkout 10 AM. Early check-in / late checkout $35 if available — just ask.",
        "Confirmation HM3RM32X8D · Host Brian +1 207-266-8310.",
        "A few blocks from Agamont Park & the town pier."
      ],
      tip: "Codes & address only show with your share code set. Need more time? Ask Brian — early/late is $35 if open."
    },
    {
      id: "p404", day: "d4", time: "3:30p", name: "Cadillac Mountain sunset", emoji: "🌄",
      category: "sight", rating: 4.8, ratingSource: "Google ~", price: "$$ park + 🔖",
      address: "Cadillac Summit Rd, Bar Harbor, ME 04609",
      why: "Tallest peak on the US Atlantic coast — <b>360° sunset over island and sea</b>.",
      todo: "Enter at your 3:30 PM reserved slot, walk the summit loop, then stay up top for the sunset light.",
      facts: ["✅ Vehicle reservation booked — 3:30 PM summit-road entry.", "1,530 ft — highest point on the Eastern Seaboard.", "Inside Acadia NP — park pass needed."],
      tip: "Your timed entry is 3:30 PM — once you're up, you can linger through sunset."
    },

    /* ---------------- DAY 5 — Full Acadia day ---------------- */
    {
      id: "p500", day: "d5", time: "8:30a", name: "⏰ Lulu Lobster Boat Ride", emoji: "🦞",
      category: "activity", rating: 4.9, ratingSource: "Tripadvisor ~", price: "$97.52 (booked)",
      address: "55 West St, Bar Harbor, ME 04609", mapsQuery: "Lulu Lobster Boat Ride, 55 West St, Bar Harbor ME",
      why: "<b>⏰ 8:30 AM SHARP — be at the dock early or you miss the boat (no refunds, no waiting).</b> Two hours on a real Down East lobster boat: trap-hauling demo, seals, ospreys & Egg Rock Light.",
      todo: "Get to the Harborside Hotel dock by ~8:10 AM to check in. Bring a layer — it's cooler on the water.",
      facts: ["✅ Booked — departs 8:30 AM from 55 West St (Harborside Hotel & Marina dock).", "~1 hr 45 min on the water aboard the 'Lulu.'", "Captain hauls lobster traps and explains the trade; watch for seals & eagles."],
      tip: "⚠️ Set an alarm — this is the one hard time today. Park/walk early; West St gets tight in the morning."
    },
    {
      id: "p501", day: "d5", time: "10:45a", name: "Ocean Path (Sand Beach → Otter Cliff)", emoji: "🥾",
      category: "activity", rating: 4.9, ratingSource: "Google ~", price: "Park pass",
      address: "Ocean Path Trailhead, Park Loop Rd, Bar Harbor, ME 04609", mapsQuery: "Sand Beach Acadia Ocean Path",
      why: "The <b>greatest-hits coastal walk</b> — Thunder Hole, Otter Cliff, crashing surf.",
      todo: "Walk the flat 2-mi (each way) path from Sand Beach to Otter Cliff; time Thunder Hole near rising tide.",
      facts: ["Mostly flat, follows the Park Loop coastline.", "Thunder Hole booms best ~2 hrs before high tide.", "Park Loop Rd is largely one-way — plan your loop."],
      tip: "Head here straight off the Lulu dock (~10:15 back). Sand Beach lot fills midday, so go right after the boat."
    },
    {
      id: "p502", day: "d5", time: "11:00a", name: "Beehive Trail (optional, brave)", emoji: "🧗",
      category: "activity", rating: 4.8, ratingSource: "Google ~", price: "Park pass",
      address: "Bowl Trailhead, Park Loop Rd, Bar Harbor, ME 04609", mapsQuery: "Beehive Trail Acadia",
      why: "Iron-rung <b>cliff scramble</b> with a huge payoff view — Acadia's adrenaline classic.",
      todo: "Climb the rungs up the Beehive (~1.5 hrs loop). Not for fear-of-heights — take the Bowl trail instead.",
      facts: ["Exposed iron rungs and ladders; one-way up.", "Skip in rain — rock gets slick.", "Descend via the Bowl for an easier, calmer loop."],
      tip: "Not into exposure? The Bowl pond loop is a gentle, gorgeous alternative."
    },
    {
      id: "p503", day: "d5", time: "1:00p", name: "Jordan Pond House (popovers)", emoji: "🫖",
      category: "eat", rating: 4.4, ratingSource: "Google ~", price: "$$ + 🔖",
      address: "2928 Park Loop Rd, Seal Harbor, ME 04675",
      why: "<b>Popovers + jam</b> on the lawn with a mountain-mirror pond view.",
      todo: "Do the flat 3.3-mi pond loop, then earn your popovers on the lawn.",
      facts: ["Popover tradition is over a century old.", "Only restaurant inside Acadia — 🔖 reserve ahead.", "Trailhead for one of the park's easiest scenic loops."],
      tip: "Book a lawn table in advance; walk-ins wait in summer."
    },
    {
      id: "p504", day: "d5", time: "4:00p", name: "Bar Harbor waterfront + Shore Path", emoji: "🌅",
      category: "activity", rating: 4.7, ratingSource: "Google ~", price: "Free",
      address: "Agamont Park, 1 Main St, Bar Harbor, ME 04609", mapsQuery: "Agamont Park Bar Harbor",
      why: "Easy <b>town-and-sea stroll</b> to wind down — Shore Path + ice cream.",
      todo: "Walk the Shore Path from Agamont Park, browse town shops, grab a cone.",
      facts: ["At low tide a sandbar to Bar Island appears (check the tide chart).", "Flat, scenic, ~30–45 min.", "Town is packed with ice cream & souvenirs."],
      tip: "Time the Bar Island sandbar with low tide — it vanishes as the tide comes in."
    },
    {
      id: "p505", day: "d5", time: "7:30p", name: "🍽️ Dinner — Bar Harbor (open night)", emoji: "🦞",
      category: "eat", slot: true, searchQuery: "lobster dinner Bar Harbor Maine",
      why: "Last Maine night and <b>no reservation yet</b> — go full lobster. Pick one below or search the town.",
      facts: ["No booking on the calendar — put your name in early.", "Lobster pounds do the messy-bib whole-lobster version.", "Downtown Bar Harbor is walkable for dinner + ice cream."],
      tip: "One of two open dinner nights — tell me your pick and I'll lock it in.",
      options: [
        { name: "Side Street Cafe", address: "49 Rodick St, Bar Harbor, ME 04609", rating: 4.5, price: "$$", note: "Casual; famous lobster mac & cheese" },
        { name: "Stewman's Lobster Pound", address: "35 West St, Bar Harbor, ME 04609", rating: 4.3, price: "$$$", note: "Waterfront whole-lobster dinners" },
        { name: "Geddy's", address: "19 Main St, Bar Harbor, ME 04609", rating: 4.3, price: "$$", note: "Lively downtown classic" }
      ]
    },
    {
      id: "p506", day: "d5", time: "8:45p", name: "🍫 Ben & Bill's Chocolate Emporium", emoji: "🍫",
      category: "eat", rating: 4.6, ratingSource: "Google ~", price: "$",
      address: "66 Main St, Bar Harbor, ME 04609", mapsQuery: "Ben & Bill's Chocolate Emporium Bar Harbor",
      why: "Bar Harbor institution — <b>handmade chocolates + ~50 ice cream flavors</b>, the perfect after-dinner stroll.",
      todo: "Walk Main St after dinner for a hand-dipped cone or fresh fudge. Yes, the lobster ice cream is real if you're brave.",
      facts: ["Open since 1990; the smell of roasting nuts hits you at the door.", "Famous for the (genuine) lobster ice cream.", "Open late in summer — good last stop of the night."],
      tip: "Lobster ice cream is the dare; the chocolate-dipped everything is the safe win."
    },
    {
      id: "p507", day: "d5", time: "1:00p", name: "⭐ Bar Harbor Whale Watch", emoji: "🐋",
      category: "activity", rating: 4.7, ratingSource: "Tripadvisor 2600+", price: "$84/adult",
      address: "1 West St, Bar Harbor, ME 04609", mapsQuery: "Bar Harbor Whale Watch Co West St",
      why: "The <b>real ocean-wildlife adventure</b> — humpbacks & puffins on a fast catamaran.",
      todo: "3–3.5 hr run 20–50 mi offshore for whales, porpoises, seals & seabirds. College of the Atlantic naturalists narrate.",
      facts: ["112-ft jet-powered catamaran (Friendship V) — fast & stable.", "June: usually one departure (~10 AM or 1 PM) — confirm time.", "Galley + Atlantic Brewing Co. beer — CASH only.", "No whales sighted = rebook voucher (good 3 yrs)."],
      tip: "⚠️ It's 3–3.5 hrs — it'll eat much of your Acadia hiking day; book the earliest, calmest slot. Warm waterproof layers + cash; arrive up to 1 hr early for parking.",
      photo: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1200&q=60"
    },
    {
      id: "p508", day: "d5", time: "6:30p", name: "⭐ Schooner Margaret Todd — Sunset Sail", emoji: "⛵",
      category: "activity", rating: 4.3, ratingSource: "mixed ~", price: "$58/adult",
      address: "Bar Harbor Inn Pier, 1 Newport Dr, Bar Harbor, ME 04609", mapsQuery: "Margaret Todd schooner Bar Harbor Inn Pier",
      why: "Bar Harbor's <b>iconic four red-sail schooner</b> at golden hour, with live folk music.",
      todo: "90–120 min sail of Frenchman Bay — Egg Rock Light, the Porcupine Islands, seals & eagles. Beer/wine sold aboard.",
      facts: ["151-ft four-masted schooner with rust-red sails.", "Departs 6:30 PM; sunset's ~8:21 PM so it ends near dusk.", "Beer/wine sold aboard — NOT BYOB for alcohol.", "Wind-dependent — on calm nights it may motor, not sail."],
      tip: "Board early (45 min before) for a rail seat; breezy evenings are far better. Sells out — book ahead. Pairs with your open dinner night (eat after)."
    },
    {
      id: "p509", day: "d5", time: "4:00p", alt: true, name: "Acadian Boat Tours (nature/lighthouse)", emoji: "🦭",
      category: "activity", rating: 4.5, ratingSource: "Tripadvisor ~", price: "$42–66",
      address: "Atlantic Oceanside Hotel, 119 Eden St, Bar Harbor, ME 04609", mapsQuery: "Acadian Boat Tours Atlantic Oceanside Bar Harbor",
      why: "<b>Flexible, well-narrated nature cruise</b> — the fun substitute now that Diver Ed is closed.",
      todo: "2-hr nature/sunset cruise (or 3.5-hr puffin/lighthouse trip): Egg Rock Light, Frenchman Bay, seals, eagles, porpoises.",
      facts: ["⚠️ Diver Ed's Dive-In Theater is CLOSED for 2026 (returns 2027) — don't book it.", "Heated cabin + snack bar; free on-site parking.", "Nature $42–51 · Puffin/Lighthouse $66.", "Top-10% Travelers' Choice."],
      tip: "If the evening wind is under ~8 kn, this sunset cruise beats Margaret Todd (which may not actually sail). Lower deck if motion-sensitive."
    },
    {
      id: "p510", day: "d5", time: "8:00a", alt: true, name: "🍓 Blue Hill / Deer Isle jam-loop detour", emoji: "🫙",
      category: "shop", rating: "", ratingSource: "", price: "",
      address: "598 Sunshine Rd, Deer Isle, ME 04627", mapsQuery: "Nervous Nellies Deer Isle Maine",
      why: "<b>The peninsula jam-and-coffee run</b> — trade part of today's Acadia hiking for Deer Isle.",
      todo: "A loose morning loop: Caterpillar Hill view → 44 North coffee → Nervous Nellie's jams → Stonington harbor, back by mid-afternoon for Ocean Path + Cadillac sunset.",
      facts: ["~1.5 hrs each way from Bar Harbor (down Rte 15).", "Nellie's is Tue–Sat 11–5 — Tuesday works.", "All the cluster spots are tappable below."],
      tip: "Excited about jams? This is the day to do it. Tap the spots in this section for addresses; verify limited-day spots (Tinder Hearth, El El Frijoles) before you rely on them."
    },
    {
      id: "p511", day: "d5", time: "8:30a", alt: true, name: "Caterpillar Hill Scenic Overlook", emoji: "🏞️",
      category: "sight", rating: 4.8, ratingSource: "Google ~", price: "Free",
      address: "ME-15, Sedgwick, ME 04676", mapsQuery: "Caterpillar Hill Scenic Overlook Sedgwick Maine",
      why: "<b>Jaw-dropping free pullover</b> over Penobscot Bay & the islands on the way down.",
      todo: "Pull over for the view (and blueberry barrens in summer); 5-minute stop.",
      facts: ["Right on Route 15 heading toward Deer Isle.", "One of the best roadside views in Maine."],
      tip: "Great quick stretch-your-legs stop en route to the jams."
    },
    {
      id: "p512", day: "d5", time: "9:30a", alt: true, name: "44 North Coffee (Deer Isle roaster)", emoji: "☕",
      category: "coffee", rating: 4.7, ratingSource: "Google ~", price: "$",
      address: "7 Main St, Deer Isle, ME 04627", mapsQuery: "44 North Coffee Deer Isle",
      why: "<b>Among the best coffee in Maine</b> — a real island roaster, minutes from Nellie's.",
      todo: "Grab a pour-over + a bag of beans before the jam stop.",
      facts: ["Roasts its own; café in Deer Isle village.", "Tiny — order and go."],
      tip: "Perfect pairing with Nervous Nellie's just up the road."
    },
    {
      id: "p513", day: "d5", time: "10:30a", alt: true, name: "Nervous Nellie's Jams & Jellies", emoji: "🫙",
      category: "shop", rating: 4.7, ratingSource: "Google ~", price: "$",
      address: "598 Sunshine Rd, Deer Isle, ME 04627", mapsQuery: "Nervous Nellies Jams Jellies Deer Isle",
      why: "<b>Whimsical jam farm + folk-art sculpture village</b> — gloriously weird Maine, and the reason for the loop.",
      todo: "Taste & buy small-batch jams/jellies, then wander Peter Beerits's free sculpture village + gallery in the woods.",
      facts: ["Jam studio + sculpture village + gallery on Deer Isle.", "Seasonal: mid-May–Oct, Tue–Sat 11–5 (closed Sun & Mon).", "Opens 11 — time the loop so you arrive after."],
      tip: "⚠️ Confirm it's open in 2026 (one listing showed temporarily closed). Tuesday is your only open day on this trip."
    },
    {
      id: "p514", day: "d5", time: "12:00p", alt: true, name: "Stonington harbor", emoji: "🦞",
      category: "activity", rating: 4.8, ratingSource: "Google ~", price: "Free",
      address: "Main St, Stonington, ME 04681", mapsQuery: "Stonington Maine harbor downtown",
      why: "Maine's most photogenic <b>working lobster harbor</b> — galleries, boats, island views at the tip.",
      todo: "Wander Main St galleries + the waterfront. Lunch here, or save room for a peninsula bite on the way back.",
      facts: ["Busiest lobster port in Maine.", "Aragosta at Goose Cove (300 Goose Cove Rd) = a tasting-menu splurge if you want dinner down here."],
      tip: "This is the turnaround point — head back to Bar Harbor for afternoon Acadia after."
    },
    {
      id: "p515", day: "d5", time: "Lunch", alt: true, name: "Tinder Hearth (wood-fired bakery)", emoji: "🍕",
      category: "eat", rating: 4.8, ratingSource: "Google ~", price: "$$",
      address: "1452 Coastal Rd, Brooksville, ME 04617", mapsQuery: "Tinder Hearth Brooksville Maine",
      why: "Cult <b>wood-fired bread & pizza</b> — people plan whole trips around it.",
      todo: "Grab bread/pastries by day; pizza nights need advance tickets/reservations.",
      facts: ["On the Blue Hill peninsula, on the way in/out.", "Limited days & hours; pizza nights sell out."],
      tip: "⚠️ Check the schedule and book ahead — it's not a walk-in-anytime spot."
    },
    {
      id: "p516", day: "d5", time: "Lunch", alt: true, name: "El El Frijoles (Mexican, in a barn)", emoji: "🌮",
      category: "eat", rating: 4.7, ratingSource: "Google ~", price: "$$",
      address: "41 Caterpillar Hill Rd, Sargentville, ME 04673", mapsQuery: "El El Frijoles Sargentville Maine",
      why: "Beloved scratch-made <b>Mexican-Maine</b> in a converted barn — a peninsula institution.",
      todo: "Lobster taco or burrito with local ingredients; right by Caterpillar Hill.",
      facts: ["Open since 2007; everything made daily.", "Seasonal + limited days — check before going."],
      tip: "⚠️ Verify open days/hours; it's a great lunch if the timing lines up."
    },

    /* ---------------- DAY 6 — Acadia → Montréal ---------------- */
    {
      id: "p601", day: "d6", time: "Morning", name: "Drive: Acadia → Montréal", emoji: "🚗",
      category: "drive", rating: "", ratingSource: "", price: "",
      address: "Montréal, QC, Canada", mapsQuery: "Montreal Quebec Canada",
      why: "The <b>big international leg</b> — ~6.5–7 hrs across Maine & Vermont into Québec.",
      todo: "Coffee in Bangor, lunch + shops in Burlington, cross the border to Montréal by evening.",
      facts: ["~6.5–7 hrs total.", "🛂 PASSPORTS required — border crossing into Canada.", "Phones: enable a Canada roaming plan or you'll lose Waze/Maps."],
      tip: "Check passport expiry NOW, and set up an international data plan before you cross."
    },
    {
      id: "p602", day: "d6", time: "9:30a", name: "Coffee stop — Bangor", emoji: "☕",
      category: "coffee", slot: true, searchQuery: "coffee downtown Bangor Maine",
      why: "<b>Caffeine + leg-stretch</b> on the way out of Maine — pick a real café below.",
      facts: ["~1 hr from Bar Harbor.", "Stephen King's hometown — the gothic mansion is here.", "Paul Bunyan statue photo op if you're feeling silly."],
      tip: "'Tandem' is Portland-only — in Bangor, Chimera is the local roaster pick.",
      options: [
        { name: "Chimera Coffee", address: "24 Broad St, Bangor, ME 04401", rating: 4.7, price: "$", note: "Local roaster in West Market Square" },
        { name: "Bagel Central", address: "33 Central St, Bangor, ME 04401", rating: 4.5, price: "$", note: "Classic Bangor breakfast + bagels" }
      ]
    },
    {
      id: "p602b", day: "d6", time: "10:30a", alt: true, name: "🦞 Eagles Nest (Brewer) — last Maine lobster", emoji: "🦞",
      category: "eat", rating: 4.6, ratingSource: "Google ~", price: "$$",
      address: "1016 Wilson St, Brewer, ME 04412", mapsQuery: "Eagles Nest Restaurant Brewer ME",
      why: "<b>A big, well-priced lobster roll</b> just across the river from Bangor — a fitting last-bite of Maine before the long haul to Montréal.",
      todo: "Grab a lobster roll to-go (or an early lunch) right off Route 1A as you leave Bangor.",
      facts: ["In Brewer, ~10 min from downtown Bangor — basically on the way out.", "Known for generous lobster rolls at fair prices.", "Roadside spot; quick in-and-out."],
      tip: "Last easy lobster before you cross into Canada — Québec lobster won't be the same."
    },
    {
      id: "p603", day: "d6", time: "12:30p", name: "Burlington, VT — waterfront + lunch", emoji: "🏞️",
      category: "activity", rating: 4.7, ratingSource: "Google ~", price: "$$",
      address: "Church Street Marketplace, Burlington, VT 05401", mapsQuery: "Church Street Marketplace Burlington VT",
      why: "Lakeside college town — <b>Lake Champlain views</b> + a pedestrian shopping street.",
      todo: "Stroll Church Street, lunch, then a quick lake-front walk before the border.",
      facts: ["Church Street Marketplace is a car-free shopping promenade.", "Waterfront has big Lake Champlain + Adirondack views.", "~1.5 hrs to the Montréal border."],
      tip: "Last US stop — top off gas (cheaper than Canada) before crossing."
    },
    {
      id: "p604", day: "d6", time: "1:30p", name: "Honey Road (Burlington)", emoji: "🍯",
      category: "eat", rating: 4.7, ratingSource: "Google ~", price: "$$$",
      address: "156 Church St, Burlington, VT 05401",
      why: "<b>James Beard–honored</b> eastern-Med small plates right on Church Street.",
      todo: "Mezze + kebabs for a memorable road lunch (or dinner if you time it later).",
      facts: ["Repeat James Beard nominee/winner kitchen.", "Small plates, great for sharing.", "Busy — call ahead or aim off-peak."],
      tip: "If it's full, Onyx Tonics (126 College St) is a lovely little wine bar nearby."
    },
    {
      id: "p605", day: "d6", time: "Afternoon", name: "Onyx Tonics (wine bar)", emoji: "🍷",
      category: "eat", rating: 4.7, ratingSource: "Google ~", price: "$$",
      address: "126 College St, Burlington, VT 05401",
      why: "Tiny, <b>thoughtful natural-wine bar</b> — a classy Burlington pit-stop.",
      todo: "A glass and a snack before the final push north (driver sticks to coffee!).",
      facts: ["Intimate, by-the-glass focused.", "Walkable from Church Street.", "Great if Honey Road has a wait."],
      tip: "Whoever's driving stays dry — Canada's limits are strict and the border is next."
    },
    {
      id: "p606", day: "d6", time: "5:00p", name: "✅ Stay — Elegant 1BR (Montréal)", emoji: "🛏️",
      category: "stay", checkIn: "2026-06-24", checkOut: "2026-06-27", rating: "", ratingSource: "", price: "",
      address: "366 Rue Mayor, Montréal, QC H3A 1N8", mapsQuery: "366 Rue Mayor Montreal",
      why: "Your <b>base for 3 nights</b> (Jun 24–27), downtown and walkable to restaurants.",
      todo: "Check in at 5 PM, then head to Verdun for the Beba reservation.",
      facts: ["Confirmation HM3RH8M3MS.", "Check-in Jun 24, 5 PM · Checkout Jun 27, 11 AM.", "Walk to restaurants; central near McGill / Quartier des Spectacles.", "Host phone +1 514-600-2644."],
      tip: "Montréal street-parking signs are strict (and bilingual) — read them twice."
    },
    {
      id: "p607", day: "d6", time: "8:00p", name: "✅ Dinner — Beba", emoji: "🇦🇷",
      category: "eat", needsConfirm: true, rating: 4.7, ratingSource: "Michelin ~", price: "$$$",
      address: "3900 Rue Éthel, Verdun, QC H4G 1S4",
      why: "Intimate <b>Argentine-Jewish</b> cooking in Verdun — a true Montréal favorite.",
      todo: "Share across the menu and DON'T skip the signature flan. Lean on the wine list.",
      facts: ["By brothers Ari & Pablo Schor (Argentine-Jewish heritage).", "Michelin Guide 'good cooking' nod.", "Tiny 28-seat room with an open kitchen.", "Seasonal, shareable plates — inventive without pretension."],
      tip: "⚠️ Reservation marked TENTATIVE (8 PM, ends ~9:30) — confirm it. ~15 min from your Airbnb."
    },

    /* ---------------- DAY 7 — Mile End & Plateau ---------------- */
    {
      id: "p701", day: "d7", time: "9:00a", name: "St-Viateur Bagel", emoji: "🥯",
      category: "eat", rating: 4.7, ratingSource: "Google ~", price: "$",
      address: "263 Rue Saint-Viateur O, Montréal, QC H2V 1Y1",
      why: "<b>Montréal-style bagels</b> — wood-fired, hand-rolled, honey-boiled. A rite of passage.",
      todo: "Get them hot from the oven, sesame, with cream cheese. Eat one in the car immediately.",
      facts: ["Open since 1957, 24/7.", "Sweeter, denser, smaller than NYC bagels.", "Cash is king at the original counter."],
      tip: "Fairmount Bagel (a block over) is the eternal rival — do a taste-off."
    },
    {
      id: "p707", day: "d7", time: "8:45a", alt: true, name: "🥯 Mile End bagel tour (top 3–5)", emoji: "🥯",
      category: "activity", rating: "", ratingSource: "", price: "$",
      address: "263 Rue Saint-Viateur O, Montréal, QC H2V 1Y1", mapsQuery: "St-Viateur Bagel Montreal",
      why: "<b>Walk the Mile End bagel circuit</b> and taste-test for the best Montréal bagel.",
      todo: "St-Viateur + Fairmount (a block apart), then wander for a few more. Sesame, hot, split one each.",
      facts: ["St-Viateur: 263 Rue Saint-Viateur O.", "Fairmount: 74 Av Fairmount O.", "🗣️ Rec from the owner of September (Portland)."],
      tip: "Go hungry and share so you can try the top 3–5."
    },
    {
      id: "p705", day: "d7", time: "12:00p", name: "Kahwa Café (best sandwich)", emoji: "🥪",
      category: "eat", rating: 4.6, ratingSource: "Google ~", price: "$",
      address: "331 Av du Mont-Royal E, Montréal, QC", mapsQuery: "Kahwa Cafe, 331 Av du Mont-Royal E, Montreal",
      why: "<b>Local pick for the best sandwich in town</b> — Mediterranean subs on bread baked on-site.",
      todo: "Try the chicken panko or the merguez. The bread's the secret.",
      facts: ["In the Plateau, on Av du Mont-Royal E.", "🗣️ Rec from the owner of September (Portland)."],
      tip: "Great quick lunch between Mile End and Jean-Talon."
    },
    {
      id: "p706", day: "d8", time: "12:30p", alt: true, name: "L'Express (French bistro)", emoji: "🍷",
      category: "eat", rating: 4.6, ratingSource: "Google ~", price: "$$$",
      address: "3927 Rue Saint-Denis, Montréal, QC H2W 2M4", mapsQuery: "L'Express, 3927 Saint-Denis, Montreal",
      why: "<b>Quintessential Parisian-style bistro</b> — timeless, buzzy, open all day.",
      todo: "Steak frites is the move — great for lunch.",
      facts: ["A Montréal classic since 1980.", "🗣️ Rec from the owner of September (Portland)."],
      tip: "Good for a steak-frites lunch — or use it for the open last-night dinner (reserve for dinner)."
    },
    {
      id: "p702", day: "d7", time: "10:30a", name: "Mile End — cafés & wander", emoji: "🎨",
      category: "coffee", slot: true, searchQuery: "cafe Mile End Montreal",
      why: "Montréal's <b>artsy café-and-bookshop neighborhood</b> — pure wander territory. Grab a coffee, then drift.",
      facts: ["Historic Jewish & artist quarter; Leonard Cohen's old turf.", "Dense with cafés, record stores, boutiques & murals.", "A 'no plan' block — follow your nose."],
      tip: "Run the venue prompt to add more Mile End cafés here.",
      options: [
        { name: "Café Olimpico", address: "124 Rue Saint-Viateur O, Montréal, QC H2T 2L4", rating: 4.5, price: "$", note: "Landmark Italian espresso bar (since 1970)" },
        { name: "Dispatch Coffee (roaster)", address: "4021 Boul. Saint-Laurent, Montréal, QC H2W 1Y5", rating: 4.5, price: "$", note: "Mile End roastery — single-origin, roasts on-site" }
      ]
    },
    {
      id: "p703", day: "d7", time: "1:00p", name: "Jean-Talon Market", emoji: "🍓",
      category: "activity", rating: 4.7, ratingSource: "Google ~", price: "$$",
      address: "7070 Av. Henri-Julien, Montréal, QC H2S 3S3",
      why: "One of North America's <b>great open-air markets</b> — Québec produce, cheese, cider.",
      todo: "Graze: fresh berries, Québec cheeses, charcuterie, a cider. Build a picnic.",
      facts: ["Open year-round; biggest in summer.", "In Little Italy, north of the Plateau.", "Stalls of local farmers + specialty shops."],
      tip: "Come hungry and graze rather than sit-down — it's a tasting crawl."
    },
    {
      id: "p704", day: "d7", time: "7:30p", name: "✅ Dinner — Limbo", emoji: "🍷",
      category: "eat", needsConfirm: true, rating: 4.7, ratingSource: "Google ~", price: "$$$",
      address: "45 Av. Mozart O, Montréal, QC H2S 1C1",
      why: "Little Italy's <b>buzzy new natural-wine room</b> — French-Italian-British, veg-forward.",
      todo: "Consider the chef's tasting (~CAD$95); let the natural-wine list lead. Organic veg are the stars.",
      facts: ["Chef Harrison Shewchuk (with alums of Pichai & Pumpui).", "Wildly good 'zero-zero' natural wine list (curated by Henri of Pichai).", "Reviewers compare it to Michelin-starred rooms.", "Seasonal slushies (rosé-rhubarb) if it's warm."],
      tip: "Reservation booked 7:30 PM (ends ~9). Alt nearby: Vin Mon Lapin (150 Saint-Zotique E)."
    },

    /* ---------------- DAY 8 — Mount Royal & Old Montréal ---------------- */
    {
      id: "p801", day: "d8", time: "9:30a", name: "Mount Royal (Parc du Mont-Royal)", emoji: "⛰️",
      category: "activity", rating: 4.8, ratingSource: "Google ~", price: "Free",
      address: "Voie Camillien-Houde, Montréal, QC H3H 1A1", mapsQuery: "Mount Royal Chalet Lookout Montreal",
      why: "The <b>green mountain in the middle of the city</b> — climb for the classic skyline lookout.",
      todo: "Walk up to the Kondiaronk Belvedere (the chalet lookout) for the postcard skyline.",
      facts: ["Designed by Frederick Law Olmsted (of Central Park).", "Belvedere = the iconic downtown view.", "The city's name comes from this 'Mont Réal'."],
      tip: "Drive or walk to the chalet lookout; weekends have Tam-Tams drum circles at the base."
    },
    {
      id: "p802", day: "d8", time: "12:00p", name: "Atwater Market", emoji: "🧀",
      category: "activity", rating: 4.7, ratingSource: "Google ~", price: "$$",
      address: "138 Av. Atwater, Montréal, QC H4C 2G3",
      why: "The <b>canal-side market</b> — cheesemongers, bakeries, and a lovely waterway walk.",
      todo: "Lunch from the stalls, grab cheese + bread, walk the Lachine Canal path.",
      facts: ["Art Deco hall on the Lachine Canal.", "Top maître-fromager (cheese) shops.", "Bike/boat rentals along the canal."],
      tip: "Pair with a canal stroll or rent bikes for a flat, scenic ride."
    },
    {
      id: "p803", day: "d8", time: "3:00p", name: "Old Montréal (Vieux-Montréal)", emoji: "🏛️",
      category: "sight", rating: 4.8, ratingSource: "Google ~", price: "",
      address: "Place Jacques-Cartier, Montréal, QC H2Y 3B9", mapsQuery: "Old Montreal Place Jacques-Cartier",
      why: "<b>Cobblestoned old city</b> — Europe-in-North-America, anchored by Notre-Dame Basilica.",
      todo: "Wander cobblestone streets, see Notre-Dame Basilica, stroll the Old Port waterfront.",
      facts: ["Notre-Dame Basilica's interior is jaw-dropping (small entry fee).", "Place Jacques-Cartier is the lively heart.", "Touristy but genuinely beautiful."],
      tip: "Book Notre-Dame tickets online to skip the line; evening light on the cobbles is magic."
    },
    {
      id: "p804", day: "d8", time: "8:00p", name: "🍽️ Dinner + cocktails — last MTL night (open)", emoji: "🍸",
      category: "eat", slot: true, searchQuery: "best dinner Plateau Mile End Montreal",
      why: "Your <b>second open dinner night</b> — make the last Québec night count, then cocktails nearby.",
      facts: ["No reservation on the calendar yet for tonight.", "Joe Beef books weeks ahead — set an alarm when bookings open.", "Plateau & Mile End are dense with bars; last call runs late."],
      tip: "Tell me your pick and I'll lock it in as a confirmed dinner.",
      options: [
        { name: "Joe Beef", address: "2491 Rue Notre-Dame O, Montréal, QC H3J 1N6", rating: 4.6, price: "$$$$", note: "Legendary; books weeks out" },
        { name: "Vin Mon Lapin", address: "150 Rue Saint-Zotique E, Montréal, QC H2S 1K7", rating: 4.7, price: "$$$", note: "Small plates + natural wine" },
        { name: "Damas", address: "1201 Av. Van Horne, Montréal, QC H2V 1K4", rating: 4.6, price: "$$$$", note: "Upscale Syrian" }
      ]
    },

    /* ---------------- DAY 9 — Montréal → Hudson Valley ---------------- */
    {
      id: "p901", day: "d9", time: "Morning", name: "Drive: Montréal → Hudson Valley", emoji: "🚗",
      category: "drive", rating: "", ratingSource: "", price: "",
      address: "612 River Rd, Schodack Landing, NY 12156", mapsQuery: "Schodack Landing NY",
      why: "<b>Back into the US</b> and down to the Hudson Valley — ~5–5.5 hrs.",
      todo: "Cross the border (passports again!), drive south to your Schodack Landing homestead.",
      facts: ["~5–5.5 hrs.", "🛂 Border crossing back into the US.", "I-87 (the Northway/Thruway) most of the way — tolls.", "Schodack Landing is ~25 min north of Hudson."],
      tip: "Declare any cheese/wine/maple you're bringing back; have passports ready up top."
    },
    {
      id: "p902", day: "d9", time: "Afternoon", name: "Hudson — Warren St antiques", emoji: "🪑",
      category: "shop", rating: 4.6, ratingSource: "Google ~", price: "$$",
      address: "Warren St, Hudson, NY 12534", mapsQuery: "Warren Street Hudson NY antiques",
      why: "The Hudson Valley's <b>antiquing big-leagues</b> — a mile of shops, galleries and makers.",
      todo: "Stroll Warren St's antiques and design shops before dinner at Serre (also on Warren).",
      facts: ["Warren St runs the length of downtown Hudson.", "Catskill (across the river) is a quieter alt.", "~25 min south of your Schodack Landing stay."],
      tip: "Park once on Warren St and do it on foot — dinner's right here too."
    },
    {
      id: "p903", day: "d9", time: "5:00p", name: "✅ Stay — Schodack Landing Homestead", emoji: "🛏️",
      category: "stay", checkIn: "2026-06-27", checkOut: "2026-06-28", rating: "", ratingSource: "", price: "",
      address: "612 River Rd, Schodack Landing, NY 12156",
      why: "Your <b>final night</b> (Jun 27–28) — a historic homestead on the river, ~25 min north of Hudson.",
      todo: "Check in at 5 PM, then drive down to Hudson for dinner at Serre.",
      facts: ["Confirmation HMBAAYYX3J.", "Check-in Jun 27, 5 PM · Checkout Jun 28, 11 AM.", "~25 min from Hudson / Warren St.", "Host phone +1 234-241-2179."],
      tip: "Tap Copy address for Waze; it's a rural road, so download offline maps just in case."
    },
    {
      id: "p904", day: "d9", time: "7:00p", name: "✅ Dinner — Serre (at The Maker)", emoji: "🪴",
      category: "eat", rating: 4.5, ratingSource: "Google ~", price: "$$$$",
      address: "306 Warren St, Hudson, NY 12534",
      why: "<b>French cuisine through a modern lens</b> in The Maker Hotel's glass-roofed greenhouse room.",
      todo: "Dinner in the conservatory; look for the lamb crepinette and raw red prawns. A grand last-night meal.",
      facts: ["'Serre' = greenhouse in French — the glass-roofed former Conservatory at The Maker.", "Executive chef Jonas Offenbach; rebranded as Serre in spring 2026.", "Inside The Maker Hotel — gorgeous bar for a nightcap.", "~25 min south of your Schodack Landing stay."],
      tip: "Reservation booked 7:00 PM (ends ~8:30). Have a drink at The Maker's bar after."
    },

    /* ---------------- DAY 10 — Hudson Valley → NYC ---------------- */
    {
      id: "p1001", day: "d10", time: "9:30a", name: "☕ Slow morning + coffee (Hudson)", emoji: "☕",
      category: "coffee", slot: true, searchQuery: "coffee roaster Hudson NY Warren Street",
      why: "<b>Ease into the last day</b> — good coffee on Warren St, no rush.",
      facts: ["Warren St has the cafés & bakeries.", "Sunday mornings are quiet and pretty.", "~25 min from your Schodack Landing stay."],
      tip: "Beat Sunday-evening NYC return traffic by leaving by early afternoon.",
      options: [
        { name: "Supernatural Coffee + Bakery", address: "527 Warren St, Hudson, NY 12534", rating: 4.6, price: "$", note: "Curated small-batch roasts + great pastries" }
      ]
    },
    {
      id: "p1002", day: "d10", time: "1:00p", name: "Drive: Hudson Valley → NYC", emoji: "🏙️",
      category: "drive", rating: "", ratingSource: "", price: "",
      address: "New York, NY", mapsQuery: "New York City",
      why: "The <b>final stretch</b> home — ~2.5–3 hrs down the Thruway from Schodack Landing.",
      todo: "Roll back to the city. Trip complete. 🦞",
      facts: ["~2.5–3 hrs from Schodack Landing.", "Sunday-evening backups near the city — leave earlier if you can.", "Return the rental with a full tank if applicable."],
      tip: "That's a wrap — Sup'Maine signing off. Add anything you loved for next time."
    }
  ]
};

/* =========================================================
   CANNED ANSWERS — hardcoded concierge replies
   ---------------------------------------------------------
   The "Ask Sup'Maine" concierge checks these FIRST. If your
   question matches one (any trigger word/phrase appears in it,
   case-insensitive), it answers INSTANTLY — no network, no
   cost, works fully offline. If nothing matches, it falls
   through to the live Claude proxy as usual.

   To add your own, copy a block:
     {
       triggers: ["phrase one", "another phrase"],  // lowercase
       answer: "**Bold** with markdown, \n for new lines.",
       additions: [ { ...place object... } ]   // optional — shows an "➕ Add to my trip" button
     }
   First match wins, so put more specific entries higher up.
   ========================================================= */
window.SUP_MAINE_CANNED = [
  {
    triggers: ["two hours north", "2 hours north", "coffee on the way home", "coffee on the drive home", "stop on the way home", "halfway home"],
    answer: "About two hours north of NYC drops you right in the **Hudson Valley** — a perfect coffee-and-stretch break on the drive home.\n\nMy pick: **Rough Draft Bar & Books** in Kingston's historic Stockade District — a cozy café-bookstore combo right off Thruway Exit 19. If you'd rather a pure coffee-and-pastry hit, **Outdated: An Antique Café** is another Kingston favorite.\n\nWant it on your itinerary? Tap below. 🦞",
    additions: [
      { day: "d10", time: "2:00p", name: "Rough Draft Bar & Books", emoji: "☕", category: "coffee", rating: 4.7, ratingSource: "Google", price: "$$", address: "82 John St, Kingston, NY 12401", why: "<b>Charming café-bookstore</b> in Kingston's Stockade District — great coffee plus a place to browse and recharge, right off Thruway Exit 19.", todo: "Grab a pour-over and a pastry, then wander the bookshelves before hitting the road.", facts: ["In Kingston's walkable Stockade District.", "Just off NY Thruway Exit 19 — an easy detour home."], tip: "Pop next door to see the colonial-era stone houses while your coffee cools.", mapsQuery: "Rough Draft Bar & Books, 82 John St, Kingston, NY" }
    ]
  },
  {
    triggers: ["best coffee in portland", "coffee roaster in portland", "portland coffee"],
    answer: "Portland's coffee scene punches way up. The classics:\n\n• **Tandem Coffee + Bakery** (East End, 742 Congress St) — beloved roaster, incredible morning buns.\n• **Speckled Ax** (567 Congress St) — wood-roasted beans, downtown.\n• **Coffee By Design** (1 Diamond St) — the OG Portland roastery.\n\nAll three are already kicking around your Portland days — want me to lock one to a morning?",
    additions: null
  }
];
