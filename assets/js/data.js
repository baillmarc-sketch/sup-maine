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
    notes: "iPhone users, drive with Waze. Several dinners + Airbnbs are booked in Google Calendar (not connected here yet)."
  },

  days: [
    { id: "d1",  date: "Fri Jun 19", label: "NYC → Portland",        subtitle: "The long drive north, Portsmouth pit-stop, settle into the Old Port" },
    { id: "d2",  date: "Sat Jun 20", label: "Southern Maine coast",  subtitle: "Cape Elizabeth lighthouses, Kennebunkport, Ogunquit" },
    { id: "d3",  date: "Sun Jun 21", label: "Portland flex day",     subtitle: "Peaks Island, a sail, or a brewery crawl — your call" },
    { id: "d4",  date: "Mon Jun 22", label: "Portland → Acadia",     subtitle: "Camden lunch on the way, Cadillac sunset to land it" },
    { id: "d5",  date: "Tue Jun 23", label: "Full Acadia day",       subtitle: "Ocean Path, Jordan Pond popovers, the Beehive if you're brave" },
    { id: "d6",  date: "Wed Jun 24", label: "Acadia → Montréal",     subtitle: "Bangor coffee, Burlington lunch, cross into Québec" },
    { id: "d7",  date: "Thu Jun 25", label: "Mile End & the Plateau",subtitle: "Bagels, Jean-Talon Market, cafés and bookstores" },
    { id: "d8",  date: "Fri Jun 26", label: "Mount Royal & Old MTL", subtitle: "The mountain, the old city, Atwater Market, cocktails" },
    { id: "d9",  date: "Sat Jun 27", label: "Montréal → Hudson Valley", subtitle: "Drop into Catskill — antiques, shops, slow town energy" },
    { id: "d10", date: "Sun Jun 28", label: "Hudson Valley → NYC",   subtitle: "Coffee, a slow morning, roll home" }
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
      id: "p102", day: "d1", time: "Lunch", name: "Portsmouth, NH (coffee/lunch stop)", emoji: "⚓",
      category: "eat", rating: 4.6, ratingSource: "Google ~", price: "$$",
      address: "Market Square, Portsmouth, NH 03801", mapsQuery: "Market Square Portsmouth NH",
      why: "A <b>handsome harbor town</b> exactly at the halfway mark — perfect leg-stretch.",
      todo: "Walk Market Square, grab lunch or coffee, peek at the waterfront before the final push.",
      facts: ["One of the oldest towns in the US (settled 1623).", "Walkable brick downtown, tons of cafés.", "~1 hr south of Portland."],
      tip: "Plenty of metered street parking around Market Square; bring a few quarters."
    },
    {
      id: "p103", day: "d1", time: "Afternoon", name: "Check in — Portland Airbnb", emoji: "🛏️",
      category: "stay", rating: "", ratingSource: "", price: "",
      address: "Portland, ME  (paste your Airbnb address here)", mapsQuery: "Portland Maine",
      why: "Home base for <b>3 nights</b> (Jun 19–22) in Maine's food-and-harbor capital.",
      todo: "Drop bags, regroup, head out for dinner in the Old Port.",
      facts: ["3 nights: Jun 19–22.", "Old Port is the walkable heart for food & drinks."],
      tip: "Your exact address is in Google Calendar — paste it into this card's 'address' so Copy works."
    },
    {
      id: "p104", day: "d1", time: "8:00p", name: "Dinner — Portland (TBD / reservation?)", emoji: "🍽️",
      category: "eat", rating: "", ratingSource: "", price: "$$$",
      address: "Portland, ME", mapsQuery: "Portland Maine Old Port restaurants",
      why: "First night — <b>ease in with a great Old Port meal</b>.",
      todo: "If you booked one in Calendar, drop the name/address here. Otherwise see Eventide / Scales / Twelve below.",
      facts: ["Old Port is dense with top tables — walkable from most Airbnbs.", "Friday night = reserve ahead."],
      tip: "Check Calendar for a held reservation; if none, Scales takes bookings and is right on the water."
    },

    /* ---------------- DAY 2 — Southern Maine coast ---------------- */
    {
      id: "p201", day: "d2", time: "10:00a", name: "Portland Head Light", emoji: "🗼",
      category: "sight", rating: 4.8, ratingSource: "Google ~", price: "Free park",
      address: "12 Captain Strout Cir, Cape Elizabeth, ME 04107",
      why: "The <b>most-photographed lighthouse in America</b>, and it earns it.",
      todo: "Walk the Fort Williams Park cliff paths, get the postcard shot, peek at the keeper's-house museum.",
      facts: ["Commissioned by George Washington; lit 1791 — Maine's oldest lighthouse.", "Sits in 90-acre Fort Williams Park (free entry).", "Lot fills by mid-morning in summer."],
      tip: "Go early for soft light and easy parking; museum is a few bucks, cash."
    },
    {
      id: "p202", day: "d2", time: "11:30a", name: "Two Lights State Park", emoji: "🌊",
      category: "activity", rating: 4.8, ratingSource: "Google ~", price: "$",
      address: "7 Tower Dr, Cape Elizabeth, ME 04107",
      why: "Rugged rocky headland — <b>big-ocean drama</b>, easy access, right by the lobster shack.",
      todo: "Scramble the rocks, watch the surf, then grab a roll next door.",
      facts: ["Small day-use fee.", "Edward Hopper painted these rocks.", "Named for its two historic light towers."],
      tip: "Pair it with lunch at The Lobster Shack a 2-min drive away."
    },
    {
      id: "p203", day: "d2", time: "12:30p", name: "The Lobster Shack at Two Lights", emoji: "🦞",
      category: "eat", rating: 4.5, ratingSource: "Google ~", price: "$$",
      address: "225 Two Lights Rd, Cape Elizabeth, ME 04107",
      why: "Picnic tables on a cliff. <b>Lobster + Atlantic view</b> = peak Maine.",
      todo: "Lobster roll or a whole steamer, eat it on the rocks over the ocean.",
      facts: ["Operating since the 1920s.", "Seasonal, order-at-the-window.", "Cash and card."],
      tip: "Windy days, hold your napkins — and your roll."
    },
    {
      id: "p204", day: "d2", time: "2:30p", name: "Kennebunkport (Dock Square)", emoji: "⛵",
      category: "activity", rating: 4.7, ratingSource: "Google ~", price: "",
      address: "Dock Square, Kennebunkport, ME 04046", mapsQuery: "Dock Square Kennebunkport ME",
      why: "Postcard <b>seaside village</b> — boutiques, boats and Bush-family lore.",
      todo: "Wander Dock Square's shops, stroll out toward Walker's Point, grab an ice cream.",
      facts: ["Walker's Point is the Bush family compound (view from Ocean Ave).", "Very walkable, very summery.", "Parking is tight midday — circle or use a lot."],
      tip: "Drive Ocean Avenue for the mansion-and-sea views."
    },
    {
      id: "p205", day: "d2", time: "4:30p", name: "Ogunquit — Marginal Way", emoji: "🪨",
      category: "activity", rating: 4.9, ratingSource: "Google ~", price: "Free",
      address: "Marginal Way, Ogunquit, ME 03907", mapsQuery: "Marginal Way Ogunquit ME",
      why: "A <b>1.25-mi cliff-walk</b> over the sea — arguably the prettiest paved stroll in Maine.",
      todo: "Walk Marginal Way to Perkins Cove, browse the cove, then head back to Portland for dinner.",
      facts: ["Paved, mostly flat, benches the whole way.", "Connects downtown Ogunquit to Perkins Cove.", "Sunset here is unreal."],
      tip: "Start at the Perkins Cove end if you want easier parking."
    },
    {
      id: "p206", day: "d2", time: "8:00p", name: "Dinner — Eventide Oyster Co.", emoji: "🦪",
      category: "eat", rating: 4.6, ratingSource: "Google ~", price: "$$$",
      address: "86 Middle St, Portland, ME 04101",
      why: "The <b>brown-butter lobster roll</b> that put modern Portland on the map.",
      todo: "Lobster roll on a steamed bun + a half-dozen from the oyster ice cone.",
      facts: ["James Beard Award-winning team.", "No reservations — go early or wait.", "Tiny, buzzy; bar seats are the move for two."],
      tip: "Long line? Their oysters-to-go move fast. Swap with Scales/Twelve if you'd rather book."
    },

    /* ---------------- DAY 3 — Portland flex day ---------------- */
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
      id: "p302", day: "d3", time: "10:30a", name: "Peaks Island ferry (Casco Bay Lines)", emoji: "⛴️",
      category: "activity", rating: 4.7, ratingSource: "Google ~", price: "$",
      address: "56 Commercial St, Portland, ME 04101", mapsQuery: "Casco Bay Lines ferry terminal Portland",
      why: "A <b>20-min ferry</b> to a bike-around island — easy escape from the mainland.",
      todo: "Ferry over, rent bikes, loop the island (~4 mi), snack at the wharf, ferry back.",
      facts: ["Casco Bay Lines runs frequent boats from the Old Port.", "Island loop is flat and ~1 hr by bike.", "Bring a layer — it's breezy on the water."],
      tip: "Check the return ferry times before you settle in for a long lunch."
    },
    {
      id: "p303", day: "d3", time: "Option", name: "Sailing charter (Casco Bay)", emoji: "⛵",
      category: "activity", rating: 4.8, ratingSource: "Google ~", price: "$$$",
      address: "Maine State Pier, Portland, ME 04101", mapsQuery: "Portland Maine schooner sailing charter",
      why: "Swap the ferry for a <b>windjammer/day-sail</b> on Casco Bay. 🔖 book ahead.",
      todo: "Book a 2-hr sail (sunset sails are gorgeous) out of the Old Port piers.",
      facts: ["Several historic schooners run day sails in summer.", "Sunset trips sell out — reserve early.", "Bring a jacket; open water is cool."],
      tip: "If sailing, skip Peaks — pick one water activity so the day stays loose."
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
      id: "p306", day: "d3", time: "8:00p", name: "Dinner — Scales or Twelve", emoji: "🍽️",
      category: "eat", rating: 4.6, ratingSource: "Google ~", price: "$$$$",
      address: "68 Commercial St, Portland, ME 04101", mapsQuery: "Scales Restaurant Portland Maine",
      why: "Two heavy-hitters: <b>Scales</b> (waterfront seafood) or <b>Twelve</b> (tasting-menu splurge).",
      todo: "Scales = lively seafood on the wharf, takes reservations. Twelve = modern fine dining at 12 Thames St.",
      facts: ["Scales: 68 Commercial St, on Maine Wharf.", "Twelve: 12 Thames St — book well ahead.", "Both Friday/Saturday nights need reservations."],
      tip: "Want a special last night? Twelve. Want lively + flexible? Scales."
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
      id: "p402", day: "d4", time: "12:30p", name: "Camden lunch + harbor", emoji: "🏔️",
      category: "eat", rating: 4.7, ratingSource: "Google ~", price: "$$",
      address: "Camden Harbor, Camden, ME 04843", mapsQuery: "Camden Harbor Maine",
      why: "<b>Where the mountains meet the sea</b> — the prettiest harbor stop on the drive.",
      todo: "Lunch by the harbor, walk the windjammer docks; ambitious crew can zip up Mt. Battie.",
      facts: ["Camden Hills State Park's Mt. Battie has a drive-up summit view.", "Classic windjammer schooner harbor.", "Walkable downtown for a quick bite."],
      tip: "Short on time? Mt. Battie's auto road gives the big view in 20 minutes."
    },
    {
      id: "p403", day: "d4", time: "Afternoon", name: "Check in — Bar Harbor Airbnb", emoji: "🛏️",
      category: "stay", rating: "", ratingSource: "", price: "",
      address: "Bar Harbor, ME 04609  (paste your Airbnb address here)", mapsQuery: "Bar Harbor Maine",
      why: "Base for <b>2 nights</b> (Jun 22–24) at the doorstep of Acadia.",
      todo: "Check in, regroup, then head up Cadillac for sunset.",
      facts: ["2 nights: Jun 22–24.", "Bar Harbor town is walkable for dinner & ice cream."],
      tip: "Paste the exact Airbnb address from Calendar so Copy → Waze works."
    },
    {
      id: "p404", day: "d4", time: "Sunset", name: "Cadillac Mountain sunset", emoji: "🌄",
      category: "sight", rating: 4.8, ratingSource: "Google ~", price: "$$ park + 🔖",
      address: "Cadillac Summit Rd, Bar Harbor, ME 04609",
      why: "Tallest peak on the US Atlantic coast — <b>360° sunset over island and sea</b>.",
      todo: "Drive up ~1 hr before sunset, walk the summit loop, watch the light go.",
      facts: ["1,530 ft — highest point on the Eastern Seaboard.", "🔖 Summit-road VEHICLE RESERVATION required in season — book ahead.", "Inside Acadia NP — park pass needed."],
      tip: "Reservations sell out fast on recreation.gov — grab the sunset slot the moment you can."
    },

    /* ---------------- DAY 5 — Full Acadia day ---------------- */
    {
      id: "p501", day: "d5", time: "8:00a", name: "Ocean Path (Sand Beach → Otter Cliff)", emoji: "🥾",
      category: "activity", rating: 4.9, ratingSource: "Google ~", price: "Park pass",
      address: "Ocean Path Trailhead, Park Loop Rd, Bar Harbor, ME 04609", mapsQuery: "Sand Beach Acadia Ocean Path",
      why: "The <b>greatest-hits coastal walk</b> — Thunder Hole, Otter Cliff, crashing surf.",
      todo: "Walk the flat 2-mi (each way) path from Sand Beach to Otter Cliff; time Thunder Hole near rising tide.",
      facts: ["Mostly flat, follows the Park Loop coastline.", "Thunder Hole booms best ~2 hrs before high tide.", "Park Loop Rd is largely one-way — plan your loop."],
      tip: "Early start = parking + soft morning light at Sand Beach."
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
      id: "p505", day: "d5", time: "7:30p", name: "Lobster dinner — Bar Harbor", emoji: "🦞",
      category: "eat", rating: 4.5, ratingSource: "Google ~", price: "$$$",
      address: "Bar Harbor, ME 04609", mapsQuery: "lobster pound Bar Harbor Maine",
      why: "Last Maine night — <b>go full lobster</b>.",
      todo: "Whole steamed lobster + corn + a local ale. Side Street Cafe (lobster mac) is a reliable local pick.",
      facts: ["Side Street Cafe: 49 Rodick St — generous, casual, off the main drag.", "Lobster pounds nearby for the messy-bib version.", "Dinner gets busy — put your name in early."],
      tip: "Want the bib-and-bucket experience? Ask a local for the nearest no-frills lobster pound."
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
      id: "p602", day: "d6", time: "9:30a", name: "Bangor coffee stop", emoji: "☕",
      category: "coffee", rating: 4.5, ratingSource: "Google ~", price: "$",
      address: "Bangor, ME 04401", mapsQuery: "best coffee downtown Bangor Maine",
      why: "<b>Caffeine + leg-stretch</b> on the way out of Maine.",
      todo: "Quick downtown Bangor coffee (and a Paul Bunyan statue photo if you're feeling silly).",
      facts: ["~1 hr from Bar Harbor.", "Downtown Bangor has a few solid indie cafés.", "Stephen King's hometown — the gothic mansion is here."],
      tip: "Note: 'Tandem' is Portland-only; in Bangor just grab the best-rated downtown café."
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
      id: "p606", day: "d6", time: "Evening", name: "Check in — Montréal Airbnb", emoji: "🛏️",
      category: "stay", rating: "", ratingSource: "", price: "",
      address: "Montréal, QC  (paste your Airbnb address here)", mapsQuery: "Montreal Quebec",
      why: "Base for <b>3 nights</b> (Jun 24–27) in the best food city of the trip.",
      todo: "Check in, then a low-key first-night dinner nearby.",
      facts: ["3 nights: Jun 24–27.", "Mile End / Plateau are the dreamy walkable neighborhoods."],
      tip: "Paste the exact Airbnb address from Calendar; street parking rules in MTL are strict — check signs."
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
      id: "p702", day: "d7", time: "10:30a", name: "Mile End wander + cafés", emoji: "🎨",
      category: "coffee", rating: 4.7, ratingSource: "Google ~", price: "$$",
      address: "Avenue du Mont-Royal & Saint-Laurent, Montréal, QC", mapsQuery: "Mile End Montreal",
      why: "Montréal's <b>artsy, café-and-bookshop neighborhood</b> — pure wander territory.",
      todo: "Coffee, indie bookstores, vintage shops, murals. Let it be unstructured.",
      facts: ["Historic Jewish & artist quarter.", "Leonard Cohen's old stomping grounds.", "Dense with cafés, record stores, boutiques."],
      tip: "This is a 'no plan' block — follow your nose between cafés."
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
      id: "p704", day: "d7", time: "8:00p", name: "Dinner — Vin Mon Lapin", emoji: "🐰",
      category: "eat", rating: 4.7, ratingSource: "Google ~", price: "$$$ + 🔖",
      address: "150 Rue Saint-Zotique E, Montréal, QC H2S 1K7",
      why: "From the Joe Beef family — <b>inventive small plates + natural wine</b>, a MTL darling.",
      todo: "Sit at the counter, order across the menu, trust the wine list.",
      facts: ["🔖 Reservations essential — books out far ahead.", "Small plates, natural-wine focus.", "Consistently named among Canada's best."],
      tip: "No table? Beba (Verdun) and Damas (Syrian, Outremont) are excellent backups — book them too."
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
      id: "p804", day: "d8", time: "9:00p", name: "Cocktail bars — last MTL night", emoji: "🍸",
      category: "eat", rating: 4.7, ratingSource: "Google ~", price: "$$$",
      address: "Le Plateau-Mont-Royal, Montréal, QC", mapsQuery: "best cocktail bars Plateau Montreal",
      why: "Montréal has a <b>deep cocktail scene</b> — go out for the last night in Québec.",
      todo: "Dinner (Joe Beef on Notre-Dame O. if you snagged it 🔖), then cocktails around the Plateau/Mile End.",
      facts: ["Joe Beef: 2491 Rue Notre-Dame O — legendary, books weeks ahead.", "Plateau & Mile End are dense with bars.", "Last call is later than the US — pace yourselves."],
      tip: "Joe Beef is a reservation war — if you want it, set an alarm for the day bookings open."
    },

    /* ---------------- DAY 9 — Montréal → Hudson Valley ---------------- */
    {
      id: "p901", day: "d9", time: "Morning", name: "Drive: Montréal → Catskill", emoji: "🚗",
      category: "drive", rating: "", ratingSource: "", price: "",
      address: "Catskill, NY 12414", mapsQuery: "Catskill NY",
      why: "<b>Back into the US</b> and down to the Hudson Valley — ~5–5.5 hrs.",
      todo: "Cross the border (passports again!), drive south, arrive Catskill by afternoon.",
      facts: ["~5–5.5 hrs.", "🛂 Border crossing back into the US.", "I-87 (the Northway/Thruway) most of the way — tolls."],
      tip: "Declare any cheese/wine/maple you're bringing back; have passports ready up top."
    },
    {
      id: "p902", day: "d9", time: "Afternoon", name: "Explore Catskill + antiques", emoji: "🪑",
      category: "shop", rating: 4.5, ratingSource: "Google ~", price: "$$",
      address: "Main St, Catskill, NY 12414", mapsQuery: "Main Street Catskill NY antiques",
      why: "Sleepy <b>Hudson-River town</b> reviving with antiques, makers and galleries.",
      todo: "Browse Main St antiques and shops; if you've energy, Hudson (across the river) has the famous Warren St scene.",
      facts: ["Thomas Cole's home (Hudson River School painter) is here.", "Hudson, NY (15 min) = Warren St antiques mecca.", "Kingston & Millerton are nearby day-trip options."],
      tip: "Hudson's Warren Street is the antiquing big-leagues if Catskill feels quiet."
    },
    {
      id: "p903", day: "d9", time: "Evening", name: "Check in — Hudson Valley (Rivertown Lodge?)", emoji: "🛏️",
      category: "stay", rating: 4.6, ratingSource: "Google ~", price: "$$$",
      address: "101 Warren St, Hudson, NY 12534", mapsQuery: "Rivertown Lodge Hudson NY",
      why: "<b>1 night</b> (Jun 27–28). Rivertown Lodge & The Maker are the stylish Hudson picks. 🔖 confirm.",
      todo: "Check in, dinner in town, slow last evening of the trip.",
      facts: ["Rivertown Lodge: 101 Warren St, Hudson.", "The Maker Hotel: 302 Warren St, Hudson — gorgeous bar.", "🔖 'Hudson Valley hotel' was on your to-book list."],
      tip: "The Maker's bar is worth a drink even if you stay elsewhere; paste your actual booking address here."
    },

    /* ---------------- DAY 10 — Hudson Valley → NYC ---------------- */
    {
      id: "p1001", day: "d10", time: "9:30a", name: "Slow morning + coffee", emoji: "☕",
      category: "coffee", rating: 4.6, ratingSource: "Google ~", price: "$$",
      address: "Warren St, Hudson, NY 12534", mapsQuery: "best coffee Warren Street Hudson NY",
      why: "<b>Ease into the last day</b> — good coffee, no rush.",
      todo: "Lazy breakfast, one more wander down Warren St, then point the car south.",
      facts: ["Warren St has several good cafés & bakeries.", "Sunday mornings are quiet and pretty.", "Stock up on a last antique find."],
      tip: "Beat Sunday-evening NYC return traffic by leaving by early afternoon."
    },
    {
      id: "p1002", day: "d10", time: "1:00p", name: "Drive: Catskill → NYC", emoji: "🏙️",
      category: "drive", rating: "", ratingSource: "", price: "",
      address: "New York, NY", mapsQuery: "New York City",
      why: "The <b>final stretch</b> home — ~2.5–3 hrs down the Thruway.",
      todo: "Roll back to the city. Trip complete. 🦞",
      facts: ["~2.5–3 hrs.", "Sunday-evening backups near the city — leave earlier if you can.", "Return the rental with a full tank if applicable."],
      tip: "That's a wrap — Sup'Maine signing off. Add anything you loved for next time."
    }
  ]
};
