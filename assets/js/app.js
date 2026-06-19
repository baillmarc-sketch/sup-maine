/* =========================================================
   Sup'Maine — app logic
   ========================================================= */
(function () {
  "use strict";

  var VERSION = "v1.5";

  // ---- category metadata (label shown on the filter chips) ----
  var CATEGORIES = [
    { id: "all",      label: "All",        emoji: "✨" },
    { id: "eat",      label: "Eats",       emoji: "🍽️" },
    { id: "sight",    label: "Sights",     emoji: "📸" },
    { id: "activity", label: "Do",         emoji: "🥾" },
    { id: "coffee",   label: "Coffee",     emoji: "☕" },
    { id: "drive",    label: "Drives",     emoji: "🚗" },
    { id: "stay",     label: "Stay",       emoji: "🛏️" },
    { id: "shop",     label: "Shop",       emoji: "🛍️" }
  ];

  // ---- load trip: prefer a user-saved one, else the bundled sample ----
  var SAVED_KEY = "supmaine.trip.v1";
  function loadTrip() {
    try {
      var raw = localStorage.getItem(SAVED_KEY);
      if (raw) { var t = JSON.parse(raw); t.isSample = false; return t; }
    } catch (e) {}
    return window.SUP_MAINE_TRIP;
  }
  var TRIP = loadTrip();

  // ---- tiny DOM helpers ----
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ---- state ----
  var state = { view: "itinerary", filter: "all", query: "" };

  // ---- toast ----
  var toastEl = $("#toast");
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-show"); }, 1700);
  }

  // ---- copy to clipboard (with iOS-safe fallback) ----
  function copyText(text, okMsg) {
    var done = function () { toast(okMsg || "Copied!"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text, done); });
    } else {
      legacyCopy(text, done);
    }
  }
  function legacyCopy(text, cb) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.position = "absolute"; ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select(); ta.setSelectionRange(0, text.length);
    try { document.execCommand("copy"); cb(); } catch (e) { toast("Copy failed — long-press to copy"); }
    document.body.removeChild(ta);
  }

  // ---- map links ----
  function mapsUrl(p) {
    var q = encodeURIComponent(p.mapsQuery || (p.name + " " + (p.address || "")));
    return "https://www.google.com/maps/search/?api=1&query=" + q;
  }
  function wazeUrl(p) {
    var q = encodeURIComponent(p.mapsQuery || p.address || p.name);
    return "https://www.waze.com/ul?q=" + q + "&navigate=yes";
  }

  function ratingStars(r) {
    if (!r) return "";
    return "★ " + Number(r).toFixed(1);
  }

  // =====================================================
  //  DATES, STORAGE, HOUSING, WEATHER
  // =====================================================
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function isoOf(d) { return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }
  function todayISO() { return isoOf(new Date()); }
  function dayState(iso) {
    if (!iso) return "future";
    var t = todayISO();
    return iso < t ? "past" : (iso === t ? "today" : "future");
  }
  function prettyDate(iso) {
    var d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }
  // map a card's time string to minutes-since-midnight for chronological sorting
  function timeRank(t) {
    if (!t) return 9000;
    var s = String(t).toLowerCase().trim();
    var m = s.match(/^(\d{1,2})(?::(\d{2}))?\s*([ap])/);
    if (m) {
      var h = parseInt(m[1], 10) % 12, min = m[2] ? parseInt(m[2], 10) : 0;
      if (m[3] === "p") h += 12;
      return h * 60 + min;
    }
    var words = { morning: 480, breakfast: 480, lunch: 720, midday: 720, noon: 720,
      afternoon: 840, sunset: 1170, evening: 1140, dinner: 1140, night: 1200, tonight: 1200 };
    for (var k in words) { if (s.indexOf(k) > -1) return words[k]; }
    return 9000; // unknown ("Option", etc.) — sinks low but stays stable
  }
  function byTime(places) {
    return places.map(function (p, i) { return { p: p, i: i }; })
      .sort(function (a, b) { return (timeRank(a.p.time) - timeRank(b.p.time)) || (a.i - b.i); })
      .map(function (x) { return x.p; });
  }
  // each night from start (inclusive) up to end (exclusive)
  function nightsBetween(startIso, endIso) {
    var out = [];
    if (!startIso || !endIso) return out;
    var d = new Date(startIso + "T00:00:00"), end = new Date(endIso + "T00:00:00");
    while (d < end) { out.push(isoOf(d)); d.setDate(d.getDate() + 1); }
    return out;
  }

  // ---- per-device persistence: checks + notes ----
  function loadMap(k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } }
  function saveMap(k, m) { try { localStorage.setItem(k, JSON.stringify(m)); } catch (e) {} }
  function loadList(k) { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } }
  function saveList(k, a) { try { localStorage.setItem(k, JSON.stringify(a)); } catch (e) {} }
  var CHECK_KEY = "supmaine.checks.v1", NOTE_KEY = "supmaine.notes.v1", WX_KEY = "supmaine.wx.v2", PACK_KEY = "supmaine.packing.v1";
  var checks = loadMap(CHECK_KEY), notes = loadMap(NOTE_KEY), wxCache = loadMap(WX_KEY), packing = loadList(PACK_KEY);

  // ---- housing coverage: which trip nights have no stay ----
  function housingReport() {
    var isos = (TRIP.days || []).map(function (d) { return d.iso; }).filter(Boolean).sort();
    if (isos.length < 2) return { nights: [], uncovered: [], hasStays: false };
    var nights = nightsBetween(isos[0], isos[isos.length - 1]);
    var covered = {}, hasStays = false;
    (TRIP.places || []).forEach(function (p) {
      if (p.category === "stay" && p.checkIn && p.checkOut) {
        hasStays = true;
        nightsBetween(p.checkIn, p.checkOut).forEach(function (n) { covered[n] = true; });
      }
    });
    var uncovered = nights.filter(function (n) { return !covered[n]; });
    return { nights: nights, uncovered: uncovered, hasStays: hasStays };
  }

  // ---- weather (Open-Meteo, free, no key) ----
  function wxKey(lat, lon) { return Number(lat).toFixed(3) + "," + Number(lon).toFixed(3); }
  function wxEmoji(c) {
    if (c === 0) return "☀️";
    if (c <= 3) return "⛅";
    if (c === 45 || c === 48) return "🌫️";
    if (c >= 51 && c <= 57) return "🌦️";
    if (c >= 61 && c <= 67) return "🌧️";
    if (c >= 71 && c <= 77) return "🌨️";
    if (c >= 80 && c <= 82) return "🌧️";
    if (c >= 85 && c <= 86) return "🌨️";
    if (c >= 95) return "⛈️";
    return "🌡️";
  }
  function applyWx() {
    (TRIP.days || []).forEach(function (d) {
      if (d.lat == null || !d.iso) return;
      var c = wxCache[wxKey(d.lat, d.lon)];
      var w = c && c.days && c.days[d.iso];
      var span = document.querySelector('.day[data-day="' + d.id + '"] .day__wx');
      if (span && w) {
        span.textContent = wxEmoji(w.code) + " " + w.max + "°/" + w.min + "°" +
          (w.pop != null ? " · 💧" + w.pop + "%" : "");
        span.style.display = "";
      }
    });
  }
  function fetchWeather() {
    if (typeof fetch !== "function") return;
    var groups = {};
    (TRIP.days || []).forEach(function (d) {
      if (d.lat == null || !d.iso) return;
      var k = wxKey(d.lat, d.lon);
      (groups[k] = groups[k] || { lat: d.lat, lon: d.lon, dates: [] }).dates.push(d.iso);
    });
    Object.keys(groups).forEach(function (k) {
      var cached = wxCache[k];
      if (cached && (Date.now() - cached.at < 6 * 3600 * 1000)) return; // fresh enough
      var g = groups[k], dates = g.dates.sort();
      var url = "https://api.open-meteo.com/v1/forecast?latitude=" + g.lat + "&longitude=" + g.lon +
        "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit" +
        "&timezone=auto&start_date=" + dates[0] + "&end_date=" + dates[dates.length - 1];
      fetch(url).then(function (r) { return r.json(); }).then(function (j) {
        if (!j || !j.daily || !j.daily.time) return;
        var days = {}, pp = j.daily.precipitation_probability_max;
        j.daily.time.forEach(function (t, i) {
          days[t] = {
            code: j.daily.weather_code[i],
            max: Math.round(j.daily.temperature_2m_max[i]),
            min: Math.round(j.daily.temperature_2m_min[i]),
            pop: pp ? pp[i] : null
          };
        });
        wxCache[k] = { at: Date.now(), days: days };
        saveMap(WX_KEY, wxCache);
        applyWx();
      }).catch(function () {});
    });
    applyWx(); // paint whatever's already cached
  }

  // ---- misc trip helpers (now/next, costs, confirmations, day map) ----
  function stripLead(s) { var r = String(s || "").replace(/^[^\w(]+/, "").trim(); return r || String(s || ""); }
  function priceNum(p) { var m = p && p.price && String(p.price).match(/\$\s?(\d+)/); return m ? parseInt(m[1], 10) : 0; }
  function spendChecked() {
    return (TRIP.places || []).reduce(function (s, p) { return s + (checks[p.id] ? priceNum(p) : 0); }, 0);
  }
  function confirmList() {
    return (TRIP.places || []).filter(function (p) { return p.needsConfirm && !checks[p.id]; });
  }
  function computeNowNext() {
    var today = (TRIP.days || []).filter(function (d) { return d.iso === todayISO(); })[0];
    if (!today) return null;
    var ps = byTime((TRIP.places || []).filter(function (p) {
      return p.day === today.id && !p.alt && timeRank(p.time) < 9000;
    }));
    if (!ps.length) return null;
    var now = new Date(), nm = now.getHours() * 60 + now.getMinutes(), next = null, cur = null;
    for (var i = 0; i < ps.length; i++) {
      if (timeRank(ps[i].time) >= nm) { next = ps[i]; break; }
      cur = ps[i];
    }
    return { cur: cur, next: next, day: today };
  }
  function dayMapUrl(dayId) {
    var addrs = byTime((TRIP.places || []).filter(function (p) {
      return p.day === dayId && p.category !== "drive" && p.address && !p.alt && !p.options;
    })).map(function (p) { return p.address; });
    addrs = addrs.filter(function (a, i) { return i === 0 || a !== addrs[i - 1]; });
    if (addrs.length < 2) return null;
    var origin = encodeURIComponent(addrs[0]), dest = encodeURIComponent(addrs[addrs.length - 1]);
    var way = addrs.slice(1, -1).map(encodeURIComponent).join("|");
    var url = "https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=" + origin + "&destination=" + dest;
    if (way) url += "&waypoints=" + way;
    return url;
  }

  // ---- progress (done / total) + logged spend ----
  function updateProgress() {
    var pill = document.getElementById("trip-progress");
    if (pill) {
      var total = (TRIP.places || []).length;
      var done = (TRIP.places || []).filter(function (p) { return checks[p.id]; }).length;
      var pct = total ? Math.round(done / total * 100) : 0;
      var fill = pill.querySelector(".progress-pill__fill");
      var txt = pill.querySelector(".progress-pill__txt");
      if (fill) fill.style.width = pct + "%";
      if (txt) txt.textContent = "✓ " + done + "/" + total;
    }
    var costEl = document.getElementById("trip-cost");
    if (costEl) {
      var spent = spendChecked();
      if (spent > 0) {
        costEl.textContent = "💵 Logged spend: $" + spent + " (checked items with a listed price)";
        costEl.style.display = "";
      } else { costEl.style.display = "none"; }
    }
  }

  // ---- save / export: backup bundle + travel diary ----
  function buildBundle() {
    return { app: "supmaine", version: 1, savedAt: new Date().toISOString(),
             trip: TRIP, checks: checks, notes: notes };
  }
  function downloadFile(name, text, mime) {
    try {
      var blob = new Blob([text], { type: mime || "text/plain" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } catch (e) { toast("Download not supported — use Copy"); }
  }
  function diaryDays() {
    return (TRIP.days || []).map(function (day) {
      var ps = byTime((TRIP.places || []).filter(function (p) { return p.day === day.id; }));
      return { day: day, places: ps };
    }).filter(function (g) { return g.places.length; });
  }
  function buildDiaryMarkdown() {
    var t = TRIP.trip || {}, out = [];
    out.push("# " + (t.title || "My trip") + " — travel diary");
    if (t.dates || t.base) out.push("_" + [t.dates, t.base].filter(Boolean).join(" · ") + "_");
    out.push("");
    diaryDays().forEach(function (g) {
      out.push("## " + g.day.date + " — " + g.day.label);
      if (g.day.subtitle) out.push("_" + g.day.subtitle + "_");
      g.places.forEach(function (p) {
        out.push("- [" + (checks[p.id] ? "x" : " ") + "] **" + p.name + "**" + (p.time ? " (" + p.time + ")" : ""));
        if (p.address) out.push("    - 📍 " + p.address);
        if (notes[p.id]) out.push("    - 📝 " + notes[p.id]);
      });
      out.push("");
    });
    return out.join("\n");
  }
  function buildDiaryHTML() {
    var t = TRIP.trip || {}, body = "";
    diaryDays().forEach(function (g) {
      body += "<h2>" + esc(g.day.date) + " — " + esc(g.day.label) + "</h2>";
      if (g.day.subtitle) body += '<p class="sub">' + esc(g.day.subtitle) + "</p>";
      body += "<ul>";
      g.places.forEach(function (p) {
        body += "<li>" + (checks[p.id] ? "✅ " : "⬜ ") + "<b>" + esc(p.name) + "</b>" +
          (p.time ? ' <span class="t">' + esc(p.time) + "</span>" : "");
        if (p.address) body += '<div class="addr">📍 ' + esc(p.address) + "</div>";
        if (notes[p.id]) body += '<div class="note">📝 ' + esc(notes[p.id]) + "</div>";
        body += "</li>";
      });
      body += "</ul>";
    });
    return '<!doctype html><html><head><meta charset="utf-8">' +
      "<title>" + esc(t.title || "Trip") + " — diary</title>" +
      "<style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#2c2622;max-width:720px;margin:24px auto;padding:0 18px}" +
      "h1{font-size:24px;margin:0 0 2px}h2{font-size:17px;margin:22px 0 4px;border-bottom:1px solid #e7dcc6;padding-bottom:4px}" +
      ".meta{color:#6f655b;margin:0 0 10px}.sub{color:#6f655b;font-style:italic;margin:0 0 8px}" +
      "ul{list-style:none;padding:0}li{margin:0 0 10px}.t{color:#b8412b;font-size:12px;font-weight:700}" +
      ".addr{color:#444;font-size:13px;margin:2px 0 0 22px}.note{background:#fff7e6;border:1px solid #f0e0bb;border-radius:8px;padding:6px 9px;margin:4px 0 0 22px;font-size:13px}</style>" +
      "</head><body><h1>" + esc(t.title || "My trip") + "</h1>" +
      '<p class="meta">' + esc([t.dates, t.base].filter(Boolean).join(" · ")) +
      " · exported " + new Date().toLocaleDateString() + "</p>" + body + "</body></html>";
  }
  function openPrintableDiary() {
    var w = window.open("", "_blank");
    if (!w) { copyText(buildDiaryMarkdown(), "Popup blocked — diary copied instead"); return; }
    w.document.open(); w.document.write(buildDiaryHTML()); w.document.close();
    setTimeout(function () { try { w.focus(); w.print(); } catch (e) {} }, 350);
  }

  // ---- load a trip / backup from raw text (used by paste + file import) ----
  function loadFromText(raw) {
    raw = String(raw || "").replace(/^```(json)?/i, "").replace(/```\s*$/, "").trim();
    if (!raw) { toast("Nothing to load"); return false; }
    try {
      var obj = JSON.parse(raw);
      var tripObj = (obj && obj.trip && obj.trip.days) ? obj.trip : obj; // bundle vs raw trip
      if (!tripObj || !tripObj.places || !tripObj.days) throw new Error("missing days/places");
      localStorage.setItem(SAVED_KEY, JSON.stringify(tripObj));
      TRIP = tripObj; TRIP.isSample = false;
      if (obj && obj.checks) { checks = obj.checks; saveMap(CHECK_KEY, checks); }
      if (obj && obj.notes) { notes = obj.notes; saveMap(NOTE_KEY, notes); }
      applyTripMeta(); renderAll(); go("itinerary");
      toast(obj && obj.app === "supmaine" ? "Trip + notes restored! 🦞" : "Trip loaded! 🦞");
      return true;
    } catch (e) { toast("Hmm, that JSON didn't parse"); return false; }
  }

  // ---- wipe just the check-offs + notes (keep the trip) ----
  function clearMarks() {
    if (typeof window.confirm === "function" &&
        !window.confirm("Clear all your check-offs and notes? This can't be undone.")) return;
    checks = {}; notes = {};
    saveMap(CHECK_KEY, checks); saveMap(NOTE_KEY, notes);
    renderAll(); go("itinerary");
    toast("Check-offs & notes cleared");
  }

  // =====================================================
  //  ITINERARY VIEW
  // =====================================================
  function matchesFilter(p) {
    if (state.filter !== "all" && p.category !== state.filter) return false;
    if (state.query) {
      var hay = (p.name + " " + (p.address || "") + " " + (p.why || "") + " " +
                 (p.todo || "") + " " + (p.category || "")).toLowerCase();
      if (hay.indexOf(state.query) === -1) return false;
    }
    return true;
  }

  // a "pick one" slot: search-the-area link + a dropdown of specific venues
  function renderOptions(p) {
    var wrap = el("div", "slot");
    if (p.searchQuery) {
      var sa = el("a", "slot__search", "🔍 Search " + esc(p.searchQuery) + " in Maps");
      sa.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(p.searchQuery);
      sa.target = "_blank"; sa.rel = "noopener";
      sa.addEventListener("click", function (ev) { ev.stopPropagation(); });
      wrap.appendChild(sa);
    }
    var list = el("div", "slot__list is-hidden");
    p.options.forEach(function (o) {
      var row = el("div", "opt");
      var info = el("div", "opt__info");
      info.appendChild(el("div", "opt__name", esc(o.name) +
        (o.rating ? ' <span class="opt__rate">★ ' + esc(String(o.rating)) + "</span>" : "") +
        (o.price ? ' <span class="opt__price">' + esc(o.price) + "</span>" : "")));
      if (o.note) info.appendChild(el("div", "opt__note", esc(o.note)));
      if (o.address) info.appendChild(el("div", "opt__addr", esc(o.address)));
      row.appendChild(info);
      var btns = el("div", "opt__btns");
      if (o.address) {
        var cp = el("button", "opt__btn", "📋"); cp.type = "button"; cp.title = "Copy address";
        cp.addEventListener("click", function (ev) { ev.stopPropagation(); copyText(o.address, "Address copied — paste into Waze"); });
        btns.appendChild(cp);
      }
      var mp = el("a", "opt__btn", "🗺️");
      mp.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(o.mapsQuery || (o.name + " " + (o.address || "")));
      mp.target = "_blank"; mp.rel = "noopener";
      mp.addEventListener("click", function (ev) { ev.stopPropagation(); });
      btns.appendChild(mp);
      row.appendChild(btns);
      list.appendChild(row);
    });
    var label = function (open) { return open ? "▴ hide options" : ("▾ " + p.options.length + " place" + (p.options.length > 1 ? "s" : "") + " to choose from"); };
    var toggle = el("button", "slot__toggle", label(false));
    toggle.type = "button";
    toggle.addEventListener("click", function (ev) {
      ev.stopPropagation();
      var open = list.classList.toggle("is-hidden") === false;
      toggle.textContent = label(open);
    });
    wrap.appendChild(toggle);
    wrap.appendChild(list);
    return wrap;
  }

  function placeCard(p) {
    var isSlot = !!(p.options && p.options.length);
    var card = el("article", "card" + (checks[p.id] ? " is-done" : ""));
    card.setAttribute("data-id", p.id);

    // head
    var head = el("div", "card__head");
    head.appendChild(el("div", "card__emoji", esc(p.emoji || "📍")));

    var main = el("div", "card__main");
    var top = el("div", "card__toprow");
    top.appendChild(el("h3", "card__name", esc(p.name)));
    if (p.time) top.appendChild(el("span", "card__time", esc(p.time)));

    // check-off circle
    var checkBtn = el("button", "card__check" + (checks[p.id] ? " is-checked" : ""), checks[p.id] ? "✓" : "");
    checkBtn.type = "button";
    checkBtn.setAttribute("aria-label", "Mark done");
    checkBtn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (checks[p.id]) { delete checks[p.id]; } else { checks[p.id] = true; }
      saveMap(CHECK_KEY, checks);
      var on = !!checks[p.id];
      checkBtn.classList.toggle("is-checked", on);
      checkBtn.textContent = on ? "✓" : "";
      card.classList.toggle("is-done", on);
      updateProgress();
    });
    top.appendChild(checkBtn);
    main.appendChild(top);

    var meta = el("div", "card__meta");
    if (p.rating && !isSlot) meta.appendChild(el("span", "badge badge--rating", ratingStars(p.rating) +
      (p.ratingSource ? " · " + esc(p.ratingSource) : "")));
    if (p.price && !isSlot) meta.appendChild(el("span", "badge badge--price", esc(p.price)));
    var catLabel = (CATEGORIES.filter(function (c) { return c.id === p.category; })[0] || {}).label || p.category;
    if (catLabel) meta.appendChild(el("span", "badge badge--cat", esc(catLabel)));
    if (isSlot) meta.appendChild(el("span", "badge badge--pick", "Pick one · " + p.options.length));
    main.appendChild(meta);

    head.appendChild(main);
    card.appendChild(head);

    if (p.why) card.appendChild(el("p", "card__why", p.why)); // why allows <b>

    // collapsible details
    var more = el("div", "card__more");
    if (p.photo) {
      var img = el("img", "card__photo");
      img.loading = "lazy"; img.alt = esc(p.name); img.src = p.photo;
      img.onerror = function () { img.style.display = "none"; };
      more.appendChild(img);
    }
    if (p.todo) {
      more.appendChild(el("div", "section-h", "What to do"));
      more.appendChild(el("p", "card__text", esc(p.todo)));
    }
    if (p.facts && p.facts.length) {
      more.appendChild(el("div", "section-h", "Quick facts"));
      var ul = el("ul", "facts");
      p.facts.forEach(function (f) { ul.appendChild(el("li", null, esc(f))); });
      more.appendChild(ul);
    }
    if (p.tip) more.appendChild(el("div", "tipline", "<b>💡 Tip:</b> " + esc(p.tip)));
    card.appendChild(more);

    card.appendChild(el("div", "expandhint"));

    if (isSlot) {
      // pick-one slot: search link + dropdown of specific venues
      card.appendChild(renderOptions(p));
    } else {
      // single venue: Copy address + Maps + Waze
      var actions = el("div", "actions");
      var copyBtn = el("button", "act act--copy",
        '<span class="act__ico">📋</span><span>Copy address</span>');
      copyBtn.type = "button";
      copyBtn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        if (!p.address) { toast("No address on file"); return; }
        copyText(p.address, "Address copied — paste into Waze");
      });

      var mapsBtn = el("a", "act act--maps", '<span class="act__ico">🗺️</span><span>Maps</span>');
      mapsBtn.href = mapsUrl(p); mapsBtn.target = "_blank"; mapsBtn.rel = "noopener";
      mapsBtn.addEventListener("click", function (ev) { ev.stopPropagation(); });

      var wazeBtn = el("a", "act act--waze", "<span>Open Waze</span>");
      wazeBtn.href = wazeUrl(p); wazeBtn.target = "_blank"; wazeBtn.rel = "noopener";
      wazeBtn.addEventListener("click", function (ev) { ev.stopPropagation(); });

      actions.appendChild(copyBtn);
      var actRow = el("div", "actions__row");
      actRow.appendChild(mapsBtn);
      actRow.appendChild(wazeBtn);
      actions.appendChild(actRow);
      card.appendChild(actions);
    }

    // personal note (saved to this device)
    var noteBtn = el("button", "card__notebtn", notes[p.id] ? "📝 Edit note" : "📝 Add note");
    noteBtn.type = "button";
    var noteWrap = el("div", "card__note" + (notes[p.id] ? "" : " is-hidden"));
    var noteInput = el("textarea", "card__note-input");
    noteInput.rows = 2;
    noteInput.placeholder = "Your note (loved it, want to try, parking tip…)";
    noteInput.value = notes[p.id] || "";
    noteInput.addEventListener("click", function (ev) { ev.stopPropagation(); });
    noteInput.addEventListener("input", function () {
      var v = noteInput.value.trim();
      if (v) { notes[p.id] = v; } else { delete notes[p.id]; }
      saveMap(NOTE_KEY, notes);
      noteBtn.textContent = v ? "📝 Edit note" : "📝 Add note";
    });
    noteWrap.appendChild(noteInput);
    noteBtn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      noteWrap.classList.toggle("is-hidden");
      if (!noteWrap.classList.contains("is-hidden")) noteInput.focus();
    });
    card.appendChild(noteBtn);
    card.appendChild(noteWrap);

    // tap head/why to expand
    [head, card.querySelector(".card__why"), card.querySelector(".expandhint")].forEach(function (z) {
      if (z) z.addEventListener("click", function () { card.classList.toggle("is-open"); });
    });

    return card;
  }

  var didFocusScroll = false;

  function renderItinerary() {
    var root = $("#view-itinerary");
    root.innerHTML = "";
    var focusMode = state.filter === "all" && !state.query; // time-focus only when not filtering

    // ---- top banners (focus mode only) ----
    if (focusMode) {
      // now / next — live, today only
      var nn = computeNowNext();
      if (nn && (nn.cur || nn.next)) {
        var nb = el("div", "banner banner--now");
        var html = nn.next
          ? '⏱ <b>Up next:</b> ' + (nn.next.time ? esc(nn.next.time) + " · " : "") + esc(stripLead(nn.next.name))
          : "🎉 <b>That's a wrap for today</b> — nice work.";
        if (nn.cur) html += '<span class="banner__sub">Just now: ' + esc(stripLead(nn.cur.name)) + "</span>";
        nb.innerHTML = html;
        nb.addEventListener("click", function () {
          var s = document.querySelector('.day[data-day="' + nn.day.id + '"]');
          if (s) s.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        root.appendChild(nb);
      }
      // confirm tentative reservations
      var cf = confirmList();
      if (cf.length) {
        var cb = el("div", "banner banner--confirm");
        cb.innerHTML = "📞 <b>Confirm " + cf.length + " tentative reservation" + (cf.length > 1 ? "s" : "") + ":</b> " +
          cf.map(function (p) { return esc(stripLead(p.name).replace(/^Dinner — /, "")); }).join(", ") +
          ". <span class=\"banner__sub\">Verify each, then check it off to clear this.</span>";
        root.appendChild(cb);
      }
      // housing gap
      var hr = housingReport();
      if (hr.hasStays && hr.uncovered.length) {
        var n = hr.uncovered.length;
        var b = el("div", "banner banner--warn");
        b.innerHTML = "🛏️ <b>No lodging on file for " + n + " night" + (n > 1 ? "s" : "") + ":</b> " +
          hr.uncovered.map(prettyDate).join(", ") +
          ". <span class=\"banner__sub\">A friend's couch counts — just add it as a stay.</span>";
        root.appendChild(b);
      }
      // logged spend line (filled by updateProgress)
      var cost = el("div", "tripstats"); cost.id = "trip-cost"; cost.style.display = "none";
      root.appendChild(cost);
    }

    var anyShown = false, todaySec = null;
    (TRIP.days || []).forEach(function (day) {
      var dayAll = byTime((TRIP.places || [])
        .filter(function (p) { return p.day === day.id && matchesFilter(p); }));
      if (!dayAll.length) return;
      anyShown = true;

      // in focus mode, split out 'alt' options into a collapsible block
      var mains = focusMode ? dayAll.filter(function (p) { return !p.alt; }) : dayAll;
      var alts = focusMode ? dayAll.filter(function (p) { return p.alt; }) : [];
      if (!mains.length) { mains = dayAll; alts = []; } // never hide everything

      var ds = day.iso ? dayState(day.iso) : "future";
      var collapsed = focusMode && ds === "past";
      var sec = el("section", "day day--" + ds + (collapsed ? " is-collapsed" : ""));
      sec.setAttribute("data-day", day.id);

      var head = el("div", "day__head");
      head.appendChild(el("span", "day__pill", esc(day.date)));
      head.appendChild(el("h2", "day__title", esc(day.label)));
      var wx = el("span", "day__wx"); wx.style.display = "none";
      head.appendChild(wx);
      if (ds === "today") head.appendChild(el("span", "day__now", "TODAY"));
      sec.appendChild(head);
      if (day.subtitle) sec.appendChild(el("p", "day__sub", esc(day.subtitle)));

      // per-day route map
      var murl = dayMapUrl(day.id);
      if (murl) {
        var mb = el("a", "day__map", "🧭 View day route in Maps");
        mb.href = murl; mb.target = "_blank"; mb.rel = "noopener";
        mb.addEventListener("click", function (ev) { ev.stopPropagation(); });
        sec.appendChild(mb);
      }

      var body = el("div", "day__body");
      mains.forEach(function (p) { body.appendChild(placeCard(p)); });
      sec.appendChild(body);

      // alternatives (collapsed)
      if (alts.length) {
        var altLabel = function (open) { return (open ? "− hide " : "＋ ") + alts.length + " more option" + (alts.length > 1 ? "s" : ""); };
        var altWrap = el("div", "day__alts is-hidden");
        alts.forEach(function (p) { altWrap.appendChild(placeCard(p)); });
        var altBtn = el("button", "day__altbtn", altLabel(false));
        altBtn.type = "button";
        altBtn.addEventListener("click", function () {
          var open = altWrap.classList.toggle("is-hidden") === false;
          altBtn.textContent = altLabel(open);
        });
        sec.appendChild(altBtn);
        sec.appendChild(altWrap);
      }

      // past days collapse; tap the header to peek
      if (collapsed) {
        head.style.cursor = "pointer";
        head.addEventListener("click", function () { sec.classList.toggle("is-collapsed"); });
      }
      root.appendChild(sec);
      if (ds === "today") todaySec = sec;
    });

    // weather chips (async) + auto-focus today on first load
    fetchWeather();
    updateProgress();
    if (focusMode && todaySec && !didFocusScroll) {
      didFocusScroll = true;
      setTimeout(function () { todaySec.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
    }

    // places with no/unknown day still show up
    var orphan = (TRIP.places || []).filter(function (p) {
      var known = (TRIP.days || []).some(function (d) { return d.id === p.day; });
      return !known && matchesFilter(p);
    });
    if (orphan.length) {
      anyShown = true;
      var sec = el("section", "day");
      sec.appendChild(el("div", "day__head", '<h2 class="day__title">More spots</h2>'));
      orphan.forEach(function (p) { sec.appendChild(placeCard(p)); });
      root.appendChild(sec);
    }

    if (!anyShown) {
      root.appendChild(el("div", "empty",
        '<div class="empty__big">🦞</div><p>No spots match. Try another filter or clear the search.</p>'));
    }
  }

  // =====================================================
  //  PROFILE VIEW
  // =====================================================
  function renderProfile() {
    var root = $("#view-profile");
    var pr = TRIP.profile || {};
    root.innerHTML = "";

    var panel = el("section", "panel");
    panel.appendChild(el("h2", null, "🧭 " + esc(pr.name || "Traveler profile")));
    panel.appendChild(el("p", null, esc(pr.summary || "")));

    function list(title, arr) {
      if (!arr || !arr.length) return;
      panel.appendChild(el("h3", null, title));
      var ul = el("ul");
      arr.forEach(function (x) { ul.appendChild(el("li", null, esc(x))); });
      panel.appendChild(ul);
    }
    list("💚 Loves", pr.loves);
    list("🚫 Avoids", pr.avoids);

    function line(label, val) {
      if (!val) return;
      panel.appendChild(el("p", null, "<b>" + label + ":</b> " + esc(val)));
    }
    line("Pace", pr.pace);
    line("Diet", pr.diet);
    line("Budget", pr.budget);
    line("Notes", pr.notes);
    root.appendChild(panel);

    // profile-prompt generator
    var gen = el("section", "panel");
    gen.appendChild(el("h2", null, "✍️ Make your profile"));
    gen.appendChild(el("p", "muted",
      "Paste this into Claude or ChatGPT, answer honestly, and copy the result back into the Plan tab."));
    var code = el("div", "codeblock", esc(PROFILE_PROMPT));
    gen.appendChild(code);
    var cbtn = el("button", "copy-btn", "📋 Copy profile prompt");
    cbtn.addEventListener("click", function () { copyText(PROFILE_PROMPT, "Profile prompt copied!"); });
    gen.appendChild(cbtn);
    root.appendChild(gen);

    // ---- packing list ----
    var pack = el("section", "panel");
    pack.appendChild(el("h2", null, "🎒 Packing list"));
    pack.appendChild(el("p", "muted", "A quick checklist — saved on this device."));
    var list = el("div", "packlist");
    function renderPack() {
      list.innerHTML = "";
      if (!packing.length) list.appendChild(el("p", "muted", "Nothing yet — add your first item below."));
      packing.forEach(function (item, idx) {
        var row = el("div", "packrow" + (item.done ? " is-done" : ""));
        var box = el("button", "packrow__box" + (item.done ? " is-checked" : ""), item.done ? "✓" : "");
        box.type = "button";
        box.addEventListener("click", function () { packing[idx].done = !packing[idx].done; saveList(PACK_KEY, packing); renderPack(); });
        var txt = el("span", "packrow__txt", esc(item.text));
        var del = el("button", "packrow__del", "✕"); del.type = "button";
        del.addEventListener("click", function () { packing.splice(idx, 1); saveList(PACK_KEY, packing); renderPack(); });
        row.appendChild(box); row.appendChild(txt); row.appendChild(del);
        list.appendChild(row);
      });
    }
    pack.appendChild(list);
    var addRow = el("div", "packadd");
    var inp = el("input", "packadd__input"); inp.type = "text"; inp.placeholder = "Add an item (rain jacket, passports…)";
    var addBtn = el("button", "packadd__btn", "Add");
    function addItem() {
      var v = inp.value.trim(); if (!v) return;
      packing.push({ text: v, done: false }); saveList(PACK_KEY, packing); inp.value = ""; renderPack(); inp.focus();
    }
    addBtn.addEventListener("click", addItem);
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") addItem(); });
    addRow.appendChild(inp); addRow.appendChild(addBtn);
    pack.appendChild(addRow);
    renderPack();
    root.appendChild(pack);
  }

  // =====================================================
  //  PLAN VIEW (bring-your-own-AI bridge)
  // =====================================================
  function renderPlan() {
    var root = $("#view-plan");
    root.innerHTML = "";

    var intro = el("section", "panel");
    intro.appendChild(el("h2", null, "✨ Plan a new Maine trip"));
    intro.appendChild(el("p", "muted",
      "No API yet — for now you bring the AI. Fill in your trip, copy the prompt into Claude/ChatGPT, " +
      "then paste the JSON it returns. (Later this whole step becomes one button powered by the Claude API.)"));

    var ol = el("ol", "steps");
    [ "Enter your dates, home base, and paste your traveler profile.",
      "Tap “Build my prompt”, then copy it into Claude or ChatGPT.",
      "Copy the JSON it returns and paste it below.",
      "Tap “Load my trip” — Sup'Maine rebuilds your whole guide."
    ].forEach(function (s) { ol.appendChild(el("li", null, esc(s))); });
    intro.appendChild(ol);
    root.appendChild(intro);

    // inputs
    var form = el("section", "panel");
    form.innerHTML =
      '<h3>Trip basics</h3>' +
      '<div class="row2">' +
        '<div class="field"><label>Start date</label><input id="pf-start" type="text" placeholder="Jul 18"></div>' +
        '<div class="field"><label>End date</label><input id="pf-end" type="text" placeholder="Jul 21"></div>' +
      '</div>' +
      '<div class="field"><label>Home base / region</label><input id="pf-base" type="text" placeholder="Portland, exploring north"></div>' +
      '<div class="field"><label>Anything specific to include? (loose notes are fine)</label>' +
        '<textarea id="pf-notes" rows="3" placeholder="want a lobster shack, one hike, no early mornings, celebrating a birthday…"></textarea></div>' +
      '<div class="field"><label>Already booked? (stays, dinners, tours)</label>' +
        '<textarea id="pf-booked" rows="4" placeholder="Paste reservations with dates, cities & locations — plus how you\'re getting there. e.g.\nJun 19–22 Airbnb, 249 Vaughan St, Portland\nJun 20 7:15p dinner — Twelve, Portland\nDriving the whole loop (Waze)"></textarea></div>' +
      '<div class="field"><label>Your traveler profile (from the Profile tab)</label>' +
        '<textarea id="pf-profile" rows="5" placeholder="Paste the profile Claude/ChatGPT made for you…"></textarea></div>';
    var buildBtn = el("button", "btn-primary", "🧱 Build my prompt");
    form.appendChild(buildBtn);
    root.appendChild(form);

    // generated prompt
    var out = el("section", "panel is-hidden");
    out.id = "plan-out";
    out.appendChild(el("h3", null, "Your prompt"));
    out.appendChild(el("p", "muted", "Copy this into Claude or ChatGPT:"));
    var outCode = el("div", "codeblock"); outCode.id = "plan-prompt";
    out.appendChild(outCode);
    var copyP = el("button", "copy-btn", "📋 Copy prompt");
    copyP.addEventListener("click", function () { copyText($("#plan-prompt").textContent, "Prompt copied!"); });
    out.appendChild(copyP);
    root.appendChild(out);

    // paste-back
    var back = el("section", "panel");
    back.appendChild(el("h3", null, "Paste the trip JSON"));
    back.appendChild(el("p", "muted", "Paste exactly what the AI returns (the JSON object):"));
    var ta = el("textarea"); ta.id = "plan-json"; ta.rows = 6;
    ta.className = ""; ta.style.cssText = "width:100%;margin-top:8px;padding:11px;border:1px solid var(--line);border-radius:11px;background:var(--paper);font-family:ui-monospace,monospace;font-size:16px;";
    back.appendChild(ta);
    var loadBtn = el("button", "btn-primary", "🚀 Load my trip");
    var importBtn = el("button", "btn-ghost", "📂 Import backup file (.json)");
    var fileInput = el("input"); fileInput.type = "file";
    fileInput.accept = "application/json,.json"; fileInput.style.display = "none";
    fileInput.addEventListener("change", function () {
      var f = fileInput.files && fileInput.files[0];
      if (!f) return;
      var rdr = new FileReader();
      rdr.onload = function () { loadFromText(String(rdr.result || "")); };
      rdr.onerror = function () { toast("Couldn't read that file"); };
      rdr.readAsText(f);
      fileInput.value = "";
    });
    importBtn.addEventListener("click", function () { fileInput.click(); });
    var resetBtn = el("button", "btn-ghost", "↩︎ Back to sample trip");
    back.appendChild(loadBtn);
    back.appendChild(importBtn);
    back.appendChild(fileInput);
    back.appendChild(resetBtn);
    root.appendChild(back);

    // ---- save & export ----
    var saver = el("section", "panel");
    saver.appendChild(el("h2", null, "💾 Save & export"));
    saver.appendChild(el("p", "muted",
      "Back up your whole trip — including your check-offs and notes — or export a " +
      "travel diary. The JSON backup pastes right back into “Load my trip” above to restore everything."));

    var b1 = el("button", "btn-primary", "📋 Copy trip + notes (JSON backup)");
    b1.addEventListener("click", function () {
      copyText(JSON.stringify(buildBundle(), null, 2), "Backup copied — paste somewhere safe");
    });
    var b2 = el("button", "btn-ghost", "⬇️ Download backup (.json)");
    b2.addEventListener("click", function () {
      downloadFile("supmaine-backup.json", JSON.stringify(buildBundle(), null, 2), "application/json");
    });
    var b3 = el("button", "btn-ghost", "📖 Copy travel diary (text)");
    b3.addEventListener("click", function () {
      copyText(buildDiaryMarkdown(), "Diary copied!");
    });
    var b4 = el("button", "btn-ghost", "🖨️ Printable diary → Save as PDF");
    b4.addEventListener("click", openPrintableDiary);

    var b5 = el("button", "btn-ghost btn-danger", "🧹 Clear my check-offs & notes");
    b5.addEventListener("click", clearMarks);

    saver.appendChild(b1);
    saver.appendChild(b3);
    saver.appendChild(b4);
    saver.appendChild(b2);
    saver.appendChild(b5);
    root.appendChild(saver);

    // ---- venue-finder prompt ----
    var venp = el("section", "panel");
    venp.appendChild(el("h2", null, "🔎 Find real venues"));
    venp.appendChild(el("p", "muted",
      "Some stops are “pick-one” slots (coffee/lunch/open dinners). Hand this prompt to your " +
      "research assistant to fill them with real, specific, verified venues — then paste the JSON back to me."));
    var vcode = el("div", "codeblock", esc(VENUE_PROMPT));
    venp.appendChild(vcode);
    var vbtn = el("button", "copy-btn", "📋 Copy venue-finder prompt");
    vbtn.addEventListener("click", function () { copyText(VENUE_PROMPT, "Venue prompt copied!"); });
    venp.appendChild(vbtn);
    root.appendChild(venp);

    buildBtn.addEventListener("click", function () {
      var prompt = buildTripPrompt({
        start: $("#pf-start").value, end: $("#pf-end").value,
        base: $("#pf-base").value, notes: $("#pf-notes").value,
        booked: $("#pf-booked").value, profile: $("#pf-profile").value
      });
      $("#plan-prompt").textContent = prompt;
      $("#plan-out").classList.remove("is-hidden");
      $("#plan-out").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    loadBtn.addEventListener("click", function () {
      loadFromText($("#plan-json").value);
    });

    resetBtn.addEventListener("click", function () {
      localStorage.removeItem(SAVED_KEY);
      TRIP = window.SUP_MAINE_TRIP;
      applyTripMeta(); renderAll(); go("itinerary");
      toast("Back to the sample trip");
    });
  }

  // =====================================================
  //  ASK SUP'MAINE (live AI concierge)
  // =====================================================
  var API_URL_KEY = "supmaine.api.v1", API_TOKEN_KEY = "supmaine.token.v1";
  var DEFAULT_API = "https://sup-maine.vercel.app/api/ask"; // built-in proxy — override in ⚙️ Connection
  function loadStr(k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function saveStr(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var askLog = [];

  function tripContext() {
    var t = TRIP.trip || {};
    return {
      title: t.title, dates: t.dates, base: t.base, vibe: t.vibe,
      profile: TRIP.profile || {},
      days: (TRIP.days || []).map(function (d) { return { id: d.id, date: d.date, label: d.label }; }),
      places: (TRIP.places || []).map(function (p) {
        return { day: p.day, time: p.time, name: stripLead(p.name), category: p.category };
      })
    };
  }

  function splitAnswer(text) {
    text = String(text || "");
    var additions = null, prose = text;
    var m = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*(\[[\s\S]*?\])\s*```/);
    if (m) {
      try { var arr = JSON.parse(m[1].trim()); if (Array.isArray(arr) && arr.length) additions = arr; } catch (e) {}
      prose = text.replace(m[0], "").trim();
    }
    return { prose: prose || "Done.", additions: additions };
  }

  function addAiPlaces(arr) {
    var added = 0;
    (arr || []).forEach(function (p, i) {
      if (!p || !p.name) return;
      p.id = "ai" + Date.now() + "_" + i;
      if (!p.category) p.category = "activity";
      TRIP.places = TRIP.places || [];
      TRIP.places.push(p); added++;
    });
    if (!added) { toast("Nothing to add"); return; }
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(TRIP)); } catch (e) {}
    TRIP.isSample = false;
    applyTripMeta(); renderItinerary(); updateProgress();
    toast(added + " added to your trip 🦞");
    closeAsk();
    go("itinerary");
  }

  function endpointHint(ep) {
    if (/^https?:\/\//i.test(ep)) return "";
    return " — no backend at " + ep + ". Set your deployed API URL in ⚙️ Connection below (see README → Live AI).";
  }

  // Check the hardcoded answers first (instant, offline, free).
  // Returns the matching entry or null. First match wins.
  function cannedMatch(q) {
    var list = (window.SUP_MAINE_CANNED || []);
    var s = String(q || "").toLowerCase();
    for (var i = 0; i < list.length; i++) {
      var triggers = list[i].triggers || [];
      for (var j = 0; j < triggers.length; j++) {
        if (s.indexOf(String(triggers[j]).toLowerCase()) !== -1) return list[i];
      }
    }
    return null;
  }

  // ---- THE STASH: local search over window.SUP_MAINE_STASH (free, offline) ----
  var CAT_SYN = {
    coffee: ["coffee", "cafe", "café", "espresso", "latte", "roaster", "cappuccino", "drip"],
    eat: ["eat", "restaurant", "restaurants", "dinner", "lunch", "breakfast", "brunch", "food", "seafood", "oyster", "oysters", "lobster", "meal", "dine", "bite"],
    shop: ["shop", "shopping", "store", "boutique", "bookstore", "books", "market", "antique", "antiques", "gift"],
    activity: ["activity", "activities", "hike", "hiking", "walk", "kayak", "tour", "fun", "rainy", "backup"],
    sight: ["sight", "sights", "view", "views", "scenic", "overlook", "lighthouse", "park", "sunset", "vista"]
  };
  var STOP = { the: 1, and: 1, for: 1, with: 1, near: 1, around: 1, some: 1, good: 1, great: 1, best: 1, place: 1, places: 1, spot: 1, spots: 1, find: 1, what: 1, where: 1, give: 1, show: 1, want: 1, need: 1, looking: 1, recommend: 1, day: 1 };

  function cityToDay(city) {
    var days = TRIP.days || [];
    if (!days.length) return "d1";
    if (city) {
      var c = String(city).toLowerCase();
      for (var i = 0; i < days.length; i++) {
        var d = days[i];
        var hay = ((d.label || "") + " " + (d.subtitle || "") + " " + (d.base || "")).toLowerCase();
        if (hay.indexOf(c) !== -1) return d.id;
      }
    }
    return days[0].id;
  }

  function stashToPlace(p) {
    return {
      day: p.day || cityToDay(p.city), time: p.time || "", name: p.name, emoji: p.emoji || "📍",
      category: p.category || "activity", rating: p.rating || "", ratingSource: p.ratingSource || "",
      price: p.price || "", address: p.address || "", why: p.why || "", todo: p.todo || "",
      facts: p.facts || [], tip: p.tip || "", mapsQuery: p.mapsQuery || (p.name + (p.city ? ", " + p.city : ""))
    };
  }

  function deburr(s) {
    s = String(s || "");
    return s.normalize ? s.normalize("NFD").replace(/[̀-ͯ]/g, "") : s;
  }

  function stashSearch(q) {
    var list = window.SUP_MAINE_STASH || [];
    if (!list.length) return [];
    var raw = deburr(String(q || "").toLowerCase());
    var toks = raw.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(function (t) { return t.length > 2 && !STOP[t]; });
    if (!toks.length) return [];

    // category intent
    var wantCats = {};
    toks.forEach(function (t) {
      Object.keys(CAT_SYN).forEach(function (cat) {
        if (CAT_SYN[cat].indexOf(t) !== -1 || CAT_SYN[cat].indexOf(t.replace(/s$/, "")) !== -1) wantCats[cat] = true;
      });
    });
    var wantCatList = Object.keys(wantCats);

    // city intent (accent-insensitive; match any city present in the stash, incl. multi-word)
    var wantCity = null;
    list.forEach(function (p) {
      if (p.city && raw.indexOf(deburr(String(p.city).toLowerCase())) !== -1) wantCity = deburr(String(p.city).toLowerCase());
    });

    var scored = [];
    list.forEach(function (p) {
      if (wantCatList.length && wantCatList.indexOf(p.category) === -1) return;
      if (wantCity && deburr(String(p.city || "").toLowerCase()) !== wantCity) return;
      var hay = deburr([p.name, (p.tags || []).join(" "), p.why, p.todo, (p.facts || []).join(" "), p.tip, p.city, p.category].join(" ").toLowerCase());
      var score = 0;
      if (wantCatList.length && wantCatList.indexOf(p.category) !== -1) score += 5;
      if (wantCity) score += 4;
      toks.forEach(function (t) {
        if ((p.tags || []).some(function (tag) { return deburr(String(tag).toLowerCase()).indexOf(t) !== -1; })) score += 2;
        if (deburr(String(p.name).toLowerCase()).indexOf(t) !== -1) score += 3;
        else if (hay.indexOf(t) !== -1) score += 1;
      });
      if (score > 0) scored.push({ p: p, score: score });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.filter(function (x) { return x.score >= 3; }).slice(0, 4).map(function (x) { return x.p; });
  }

  function askSend(q) {
    q = String(q || "").trim();
    if (!q) return;
    askLog.push({ role: "you", text: q });

    // "force live" escape — skip the free local layers and ask the AI directly.
    var wantsLive = /\b(live|web search|search the web|search online|fresh ideas|real ?time|ask claude)\b/i.test(q);

    if (!wantsLive) {
      // 1) Hardcoded answers win — instant, no network.
      var hit = cannedMatch(q);
      if (hit) {
        askLog.push({ role: "sup", text: hit.answer, additions: hit.additions || null });
        renderAskLog();
        return;
      }
      // 2) Search the local stash — instant, offline, $0.
      var picks = stashSearch(q);
      if (picks.length) {
        askLog.push({ role: "sup", text: "Pulled these from your stash (no AI credit used 💸) — tap to add:", picks: picks });
        renderAskLog();
        return;
      }
    }

    // 3) Fall through to the live Claude proxy.
    var pending = { role: "sup", text: "…", pending: true };
    askLog.push(pending);
    renderAskLog();
    var endpoint = loadStr(API_URL_KEY) || DEFAULT_API;
    var token = loadStr(API_TOKEN_KEY);
    var headers = { "Content-Type": "application/json" };
    if (token) headers["x-supmaine-token"] = token;
    function dropPending() { for (var i = askLog.length - 1; i >= 0; i--) { if (askLog[i].pending) { askLog.splice(i, 1); break; } } }

    // Reassure on long web-search calls; abort if it truly hangs.
    var done = false;
    var ctrl = (typeof AbortController !== "undefined") ? new AbortController() : null;
    var nudge = setTimeout(function () {
      if (done) return;
      pending.text = "thinking…";
      renderAskLog();
    }, 4000);
    var killer = setTimeout(function () { if (!done && ctrl) ctrl.abort(); }, 45000);
    function cleanup() { done = true; clearTimeout(nudge); clearTimeout(killer); }

    fetch(endpoint, { method: "POST", headers: headers, body: JSON.stringify({ question: q, trip: tripContext() }), signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }, function () { return { ok: false, j: {} }; }); })
      .then(function (res) {
        cleanup(); dropPending();
        if (!res.ok || !res.j || res.j.error) {
          askLog.push({ role: "sup", text: "⚠️ " + ((res.j && res.j.error) || "Request failed") + endpointHint(endpoint) });
        } else {
          var parsed = splitAnswer(res.j.answer || "");
          askLog.push({ role: "sup", text: parsed.prose, additions: parsed.additions });
        }
        renderAskLog();
      })
      .catch(function () {
        cleanup(); dropPending();
        askLog.push({ role: "sup", text: "⚠️ The AI took too long to answer. It works best on a solid connection — give it another try, or ask something simpler." });
        renderAskLog();
      });
  }

  function linkify(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>"); }

  function renderAskLog() {
    var box = document.getElementById("ask-log");
    if (!box) return;
    box.innerHTML = "";
    if (!askLog.length) {
      box.appendChild(el("p", "muted", "Ask me anything about your trip — “coffee in Bar Harbor”, “rainy-day Acadia”, “bookstore in Hudson”. I search your stash first (free, offline); add “live” to your question to ask the AI directly. Tap any result to add it to your itinerary."));
      return;
    }
    askLog.forEach(function (m) {
      var row = el("div", "bubble bubble--" + (m.role === "you" ? "you" : "sup") + (m.pending ? " is-pending" : ""));
      row.appendChild(el("div", "bubble__txt", m.pending ? "…" : linkify(m.text)));
      if (m.additions && m.additions.length) {
        var add = el("button", "bubble__add", "➕ Add " + m.additions.length + " to my trip");
        add.type = "button";
        add.addEventListener("click", function () { addAiPlaces(m.additions); });
        row.appendChild(add);
      }
      if (m.picks && m.picks.length) {
        m.picks.forEach(function (p) {
          var pr = el("div", "pick");
          var head = el("div", "pick__head");
          head.innerHTML = "<b>" + esc((p.emoji ? p.emoji + " " : "") + p.name) + "</b>" +
            (p.city ? " <span class='pick__city'>· " + esc(p.city) + "</span>" : "") +
            (p.rating ? " <span class='pick__rate'>★ " + esc(String(p.rating)) + "</span>" : "");
          pr.appendChild(head);
          if (p.why) { var w = el("div", "pick__why"); w.innerHTML = linkify(p.why); pr.appendChild(w); }
          var b = el("button", "pick__add", "➕ Add");
          b.type = "button";
          b.addEventListener("click", function () { addAiPlaces([stashToPlace(p)]); });
          pr.appendChild(b);
          row.appendChild(pr);
        });
      }
      box.appendChild(row);
    });
    box.scrollTop = box.scrollHeight;
  }

  function openAsk() {
    var m = document.getElementById("ask-modal");
    if (!m) return;
    m.classList.remove("is-hidden");
    renderAskLog();
    setTimeout(function () { var ta = document.getElementById("ask-ta"); if (ta) ta.focus(); }, 60);
  }
  function closeAsk() {
    var m = document.getElementById("ask-modal");
    if (m) m.classList.add("is-hidden");
  }
  function wireAsk() {
    var fab = document.getElementById("ask-fab");
    var close = document.getElementById("ask-close");
    var backdrop = document.getElementById("ask-backdrop");
    var ta = document.getElementById("ask-ta");
    var send = document.getElementById("ask-send");
    if (fab) fab.addEventListener("click", openAsk);
    if (close) close.addEventListener("click", closeAsk);
    if (backdrop) backdrop.addEventListener("click", closeAsk);
    function fire() { if (!ta) return; var v = ta.value; ta.value = ""; askSend(v); }
    if (send) send.addEventListener("click", fire);
    if (ta) ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); fire(); } });
    renderAskLog();
  }

  // =====================================================
  //  CHROME: chips, tabs, header meta
  // =====================================================
  function renderChips() {
    var wrap = $("#chips");
    wrap.innerHTML = "";
    CATEGORIES.forEach(function (c) {
      var b = el("button", "chip" + (state.filter === c.id ? " is-active" : ""),
        c.emoji + " " + c.label);
      b.type = "button";
      b.addEventListener("click", function () {
        state.filter = c.id;
        renderChips();
        renderItinerary();
      });
      wrap.appendChild(b);
    });
  }

  function applyTripMeta() {
    var t = TRIP.trip || {};
    $("#trip-tagline").textContent = t.blurb ? (t.base || "your pocket guide to Maine") : "your pocket guide to Maine";
    if (t.base) $("#trip-tagline").textContent = t.base;
    $("#trip-chip-dates").textContent = t.dates || "Add dates";
    var foot = document.getElementById("appfoot");
    if (foot) foot.textContent = "Sup'Maine " + VERSION + " · " + (TRIP.places || []).length + " spots · made with 🦞";
  }

  $("#trip-chip").addEventListener("click", function () {
    var t = TRIP.trip || {};
    toast((t.title || "Maine trip") + " · " + (t.dates || "dates TBD"));
  });

  var progBtn = document.getElementById("trip-progress");
  if (progBtn) progBtn.addEventListener("click", function () {
    var td = document.querySelector(".day--today");
    if (td) td.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function go(view) {
    state.view = view;
    ["itinerary", "profile", "plan"].forEach(function (v) {
      $("#view-" + v).classList.toggle("is-hidden", v !== view);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".tabbar__btn"), function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-go") === view);
    });
    // search + chips + progress only make sense on itinerary
    $("#chips").style.display = view === "itinerary" ? "" : "none";
    $(".searchwrap").style.display = view === "itinerary" ? "" : "none";
    var prog = document.getElementById("trip-progress");
    if (prog) prog.style.display = view === "itinerary" ? "" : "none";
    window.scrollTo({ top: 0 });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".tabbar__btn"), function (b) {
    b.addEventListener("click", function () { go(b.getAttribute("data-go")); });
  });

  $("#search").addEventListener("input", function (e) {
    state.query = e.target.value.trim().toLowerCase();
    renderItinerary();
  });

  function renderAll() {
    renderItinerary();
    renderProfile();
    renderPlan();
    renderAskLog();
  }

  // =====================================================
  //  INIT
  // =====================================================
  applyTripMeta();
  renderChips();
  renderAll();
  wireAsk();
  go("itinerary");

  // service worker (offline pocket-guide) — only on http(s)
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
