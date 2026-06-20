// Sup'Maine — private lodging details (Vercel serverless + Vercel KV).
// Addresses and door/wifi codes for the places you're STAYING are sensitive,
// so they never ship in the public app bundle. They live here, behind the
// shared trip "code": you only get them back if you present the right code.
//   GET  /api/private?code=as-mb-maine            -> { stays: { <id>: {...} } }
//   POST /api/private  { code, stays }            -> merges by id, saves, returns merged
//
// Uses the same KV store as /api/expenses (one-time connect in the Vercel
// dashboard adds KV_REST_API_URL / KV_REST_API_TOKEN).

const { createClient } = require("@vercel/kv");

// Find the REST URL/token no matter what the Vercel/Upstash integration named them.
function pickEnv(re) {
  for (var k in process.env) { if (re.test(k) && process.env[k]) return process.env[k]; }
  return null;
}
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL ||
  pickEnv(/REST_API_URL$/) || pickEnv(/REDIS_REST_URL$/);
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN ||
  pickEnv(/REST_API_TOKEN$/) || pickEnv(/REDIS_REST_TOKEN$/);
const kv = createClient({ url: KV_URL, token: KV_TOKEN });

function cleanCode(c) {
  return String(c || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
}
// stays: map of placeId -> { address, codes, facts, updatedAt }; keep the newer per id.
function mergeStays(a, b) {
  a = a || {}; b = b || {}; const out = {};
  Object.keys(a).forEach(function (k) { out[k] = a[k]; });
  Object.keys(b).forEach(function (k) {
    const bv = b[k] || {}, ov = out[k] || {};
    if (!out[k] || (bv.updatedAt || 0) >= (ov.updatedAt || 0)) out[k] = b[k];
  });
  return out;
}
function asDoc(stored) {
  stored = stored || {};
  return { stays: stored.stays || {} };
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // never let a browser/proxy cache private lodging data
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (!KV_URL || !KV_TOKEN) {
    var present = Object.keys(process.env).filter(function (k) { return /KV|REDIS|UPSTASH|STORAGE/i.test(k); });
    res.status(500).json({
      error: "Private store not connected",
      hint: "Create an Upstash/KV store, connect it to this project, then Redeploy.",
      sawUrl: !!KV_URL, sawToken: !!KV_TOKEN, envFound: present
    });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    body = body || {};
    const code = cleanCode((req.query && req.query.code) || body.code);
    if (!code) { res.status(400).json({ error: "Missing trip code" }); return; }
    const key = "priv:" + code;

    if (req.method === "GET") {
      res.status(200).json(asDoc(await kv.get(key)));
      return;
    }
    if (req.method === "POST") {
      const stored = asDoc(await kv.get(key));
      const merged = { stays: mergeStays(stored.stays, (body.stays && typeof body.stays === "object") ? body.stays : {}) };
      await kv.set(key, merged);
      res.status(200).json(merged);
      return;
    }
    res.status(405).json({ error: "Use GET or POST" });
  } catch (e) {
    const msg = String((e && e.message) || "Private store error");
    res.status(500).json({ error: msg, hint: "Connect a Vercel KV store to this project and redeploy." });
  }
};
