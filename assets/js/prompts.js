/* =========================================================
   Sup'Maine — prompt templates
   These power the "bring-your-own-AI" flow until the live
   Claude API is wired in. Both are plain globals used by app.js.
   ========================================================= */

/* A short prompt the user pastes into Claude/ChatGPT to generate
   their traveler profile. Hard-hitting, quick, copy-pasteable. */
var PROFILE_PROMPT =
"You're helping build my traveler profile for a trip-planning app called Sup'Maine.\n" +
"Ask me these quick questions ONE AT A TIME, then at the end output a tight profile.\n\n" +
"1. Who's going (names + how we travel together)?\n" +
"2. Trip pace — packed days or slow mornings?\n" +
"3. Food: cuisines you love, hard nos, dietary stuff, splurge-worthy or casual?\n" +
"4. Vibe you want: nature, cities, art, nightlife, history, shopping — rank top 3.\n" +
"5. Dealbreakers / things you avoid (crowds, early wake-ups, long hikes, etc.)?\n" +
"6. Budget feel (shoestring / mid / treat-yourself) and where you'd splurge?\n" +
"7. Mobility or logistics notes (driving, kids, accessibility, etc.)?\n\n" +
"After my answers, output a profile in THIS exact shape (valid JSON, nothing else):\n" +
'{\n' +
'  "name": "",\n' +
'  "summary": "2-3 sentence vibe",\n' +
'  "loves": ["", "", ""],\n' +
'  "avoids": ["", ""],\n' +
'  "pace": "",\n' +
'  "diet": "",\n' +
'  "budget": "",\n' +
'  "notes": ""\n' +
'}';

/* Builds the trip-generation prompt from the user's inputs.
   The AI is told to return JSON matching Sup'Maine's exact schema,
   so the result can be pasted straight back into the Plan tab. */
function buildTripPrompt(input) {
  input = input || {};
  var dates = [input.start, input.end].filter(Boolean).join(" – ") || "(tell me your dates)";
  var base = input.base || "(home base / region)";
  var notes = input.notes || "(no extra notes)";
  var booked = input.booked || "(nothing booked yet — plan freely)";
  var profile = input.profile || "(paste your traveler profile)";

  return (
"You are a sharp, slightly playful travel planner for an app called Sup'Maine.\n" +
"Plan a trip and return ONLY a JSON object (no prose, no code fences) matching the schema below.\n\n" +
"=== MY TRIP ===\n" +
"Dates: " + dates + "\n" +
"Home base / region: " + base + "\n" +
"Notes / must-dos: " + notes + "\n\n" +
"=== ALREADY BOOKED + HOW I'M GETTING AROUND ===\n" +
booked + "\n\n" +
"=== MY PROFILE ===\n" +
profile + "\n\n" +
"=== RULES ===\n" +
"- Treat everything under ALREADY BOOKED as FIXED. Build the plan around those\n" +
"  dates, cities, times and reservations — never move or replace them, and DON'T\n" +
"  suggest alternative lodging when a stay is already booked.\n" +
"- Respect how I'm getting around (driving, train, etc.): keep routing and drive\n" +
"  times sensible, and add 'drive' cards between far-apart stops.\n" +
"- TRANSPORT CHECK: if I only gave a one-way flight/train OUT, flag that I still\n" +
"  need to book the RETURN (and vice-versa). If I'm driving, assume a round-trip\n" +
"  back to my start unless I said otherwise. Surface any missing leg as a card.\n" +
"- LODGING CHECK: every night from the start date to the end date needs somewhere\n" +
"  to sleep. Flag ANY night with no accommodation as a 'stay' card titled\n" +
"  '⚠️ No lodging — <date>' (a friend's couch is fine, but it must be listed).\n" +
"- WEATHER: in the trip 'blurb', note the typical weather/what to pack for these\n" +
"  dates and region.\n" +
"- Fill the GAPS: open days, activities, coffee, shopping, and dinners on nights\n" +
"  with no reservation. Flag anything that still needs booking.\n" +
"- Plan day by day. Each day gets a short evocative label + subtitle.\n" +
"- For every place give a REAL street address (for one-tap copy into Waze/Maps).\n" +
"- 'why' = one punchy line on why it's worth it (you may use <b>bold</b> on the hook).\n" +
"- 'todo' = what to actually do/order there.\n" +
"- 'facts' = 2-4 quick, hard-hitting facts (history, must-knows, timing/crowds).\n" +
"- Add 'tip' for insider notes, 'rating' (number 0-5) + 'ratingSource', 'price' ($-$$$$).\n" +
"- Prioritize great food (with ratings), efficient routing, and the profile's vibe.\n" +
"- Categories must be one of: eat, sight, activity, coffee, drive, stay, shop.\n" +
"- Pick a fitting emoji per place. Leave 'photo' as \"\" (the app fills photos later).\n\n" +
"=== RETURN EXACTLY THIS SHAPE ===\n" +
'{\n' +
'  "trip": { "title": "", "dates": "", "base": "", "travelers": "", "vibe": "", "blurb": "" },\n' +
'  "profile": { "name": "", "summary": "", "loves": [], "avoids": [], "pace": "", "diet": "", "budget": "", "notes": "" },\n' +
'  "days": [ { "id": "d1", "date": "Fri Jun 19", "label": "", "subtitle": "" } ],\n' +
'  "places": [\n' +
'    {\n' +
'      "id": "p1", "day": "d1", "time": "10:00a", "name": "", "emoji": "📍",\n' +
'      "category": "eat", "rating": 4.6, "ratingSource": "Google", "price": "$$",\n' +
'      "address": "", "why": "", "todo": "", "facts": ["",""], "tip": "", "photo": "",\n' +
'      "mapsQuery": ""\n' +
'    }\n' +
'  ]\n' +
'}'
  );
}
