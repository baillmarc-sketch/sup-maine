// Sup'Maine — shared trip sync (Vercel serverless + Vercel KV).
// Two phones using the same trip "code" share expenses, notes & check-offs.
//   GET  /api/expenses?code=as-mb-maine            -> { expenses, checks, notes }
//   POST /api/expenses  { code, expenses, checks, notes } -> merges, saves, returns merged
//
// Setup (one-time, in the Vercel dashboard):
//   Storage → create a KV (Upstash) store → connect it to this project.
//   That auto-adds KV_REST_API_URL / KV_REST_API_TOKEN env vars. Redeploy.

const { createClient } = require("@vercel/kv");

// Works whether the Vercel/Upstash integration sets KV_* or UPSTASH_* env vars.
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const kv = createClient({ url: KV_URL, token: KV_TOKEN });

function cleanCode(c) {
  return String(c || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
}
// expenses: union by id, keep most recently updated (tombstones included)
function mergeById(a, b) {
  const map = {};
  [].concat(a || [], b || []).forEach(function (e) {
    if (!e || !e.id) return;
    const cur = map[e.id];
    if (!cur || (e.updatedAt || 0) >= (cur.updatedAt || 0)) map[e.id] = e;
  });
  return Object.keys(map).map(function (k) { return map[k]; });
}
// checks/notes: maps of id -> { v, at }; keep the newer per key
function mergeMap(a, b) {
  a = a || {}; b = b || {}; const out = {};
  Object.keys(a).forEach(function (k) { out[k] = a[k]; });
  Object.keys(b).forEach(function (k) {
    const bv = b[k] || {}, ov = out[k] || {};
    if (!out[k] || (bv.at || 0) >= (ov.at || 0)) out[k] = b[k];
  });
  return out;
}
// stored value may be a legacy array (expenses only) or a {expenses,checks,notes} doc
function asDoc(stored) {
  if (Array.isArray(stored)) return { expenses: stored, checks: {}, notes: {} };
  stored = stored || {};
  return { expenses: stored.expenses || [], checks: stored.checks || {}, notes: stored.notes || {} };
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (!KV_URL || !KV_TOKEN) {
    res.status(500).json({ error: "Sync store not connected", hint: "Connect a Vercel KV / Upstash store to this project and redeploy." });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    body = body || {};
    const code = cleanCode((req.query && req.query.code) || body.code);
    if (!code) { res.status(400).json({ error: "Missing trip code" }); return; }
    const key = "exp:" + code;

    if (req.method === "GET") {
      res.status(200).json(asDoc(await kv.get(key)));
      return;
    }
    if (req.method === "POST") {
      const stored = asDoc(await kv.get(key));
      const merged = {
        expenses: mergeById(stored.expenses, Array.isArray(body.expenses) ? body.expenses : []).slice(0, 2000),
        checks: mergeMap(stored.checks, body.checks || {}),
        notes: mergeMap(stored.notes, body.notes || {})
      };
      await kv.set(key, merged);
      res.status(200).json(merged);
      return;
    }
    res.status(405).json({ error: "Use GET or POST" });
  } catch (e) {
    const msg = String((e && e.message) || "Sync error");
    res.status(500).json({ error: msg, hint: "Connect a Vercel KV store to this project and redeploy." });
  }
};
