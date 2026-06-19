// Sup'Maine — live AI concierge proxy (Vercel serverless function).
// Holds your ANTHROPIC_API_KEY server-side and talks to the Claude API.
// The static front-end POSTs { question, trip } here and gets back { answer }.
//
// Env vars (set in Vercel → Settings → Environment Variables):
//   ANTHROPIC_API_KEY   (required)  your Claude API key
//   SUPMAINE_MODEL      (optional)  defaults to claude-opus-4-8; use claude-sonnet-4-6 for cheaper production
//   SUPMAINE_WEB_SEARCH (optional)  "off" to disable live web search (faster/cheaper)
//   SUPMAINE_TOKEN      (optional)  if set, callers must send a matching x-supmaine-token header

const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

function buildSystem(trip) {
  let ctx = "{}";
  try { ctx = JSON.stringify(trip || {}).slice(0, 12000); } catch (e) {}
  return [
    "You are Sup'Maine's in-app travel concierge for ONE specific trip.",
    "Be warm, concise, and genuinely useful — a few tight sentences, not an essay.",
    "Recommend REAL, specific, currently-operating venues (exact names) with a one-line why and the neighborhood. Prefer spots that fit the route, the dates, and the traveler profile. Never invent places; if you used web search, prefer what you found.",
    "",
    "TRIP CONTEXT (JSON):",
    ctx,
    "",
    "If the user clearly wants to ADD stop(s) to the itinerary, end your reply with a fenced ```json code block containing an ARRAY of place objects in EXACTLY this schema, using a real 'day' id from the context:",
    '{ "day":"d1", "time":"1:00p", "name":"", "emoji":"📍", "category":"eat|sight|activity|coffee|drive|stay|shop", "rating":4.5, "ratingSource":"Google", "price":"$$", "address":"<full street address>", "why":"", "todo":"", "facts":["",""], "tip":"", "mapsQuery":"" }',
    "Only include that JSON block when proposing concrete additions WITH real street addresses; otherwise reply in prose only."
  ].join("\n");
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-supmaine-token");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Use POST" }); return; }

  if (process.env.SUPMAINE_TOKEN && req.headers["x-supmaine-token"] !== process.env.SUPMAINE_TOKEN) {
    res.status(401).json({ error: "Unauthorized — check your access token" }); return;
  }

  try {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    body = body || {};
    const question = String(body.question || "").slice(0, 2000).trim();
    if (!question) { res.status(400).json({ error: "Missing question" }); return; }

    const model = process.env.SUPMAINE_MODEL || "claude-opus-4-8";
    const tools = process.env.SUPMAINE_WEB_SEARCH === "off"
      ? undefined
      : [{ type: "web_search_20260209", name: "web_search", max_uses: 5 }];

    const messages = [{ role: "user", content: question }];
    let resp, guard = 0;
    do {
      resp = await client.messages.create({
        model: model,
        max_tokens: 1500,
        system: buildSystem(body.trip),
        messages: messages,
        tools: tools
      });
      if (resp.stop_reason === "pause_turn") messages.push({ role: "assistant", content: resp.content });
      guard++;
    } while (resp.stop_reason === "pause_turn" && guard < 4);

    const answer = (resp.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    res.status(200).json({ answer: answer, model: resp.model });
  } catch (e) {
    res.status(e && e.status ? e.status : 500).json({ error: (e && e.message) || "Server error" });
  }
};
