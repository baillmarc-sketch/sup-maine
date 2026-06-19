/* =========================================================
   Sup'Maine — app logic
   ========================================================= */
(function () {
  "use strict";

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

  function placeCard(p) {
    var card = el("article", "card");
    card.setAttribute("data-id", p.id);

    // head
    var head = el("div", "card__head");
    head.appendChild(el("div", "card__emoji", esc(p.emoji || "📍")));

    var main = el("div", "card__main");
    var top = el("div", "card__toprow");
    top.appendChild(el("h3", "card__name", esc(p.name)));
    if (p.time) top.appendChild(el("span", "card__time", esc(p.time)));
    main.appendChild(top);

    var meta = el("div", "card__meta");
    if (p.rating) meta.appendChild(el("span", "badge badge--rating", ratingStars(p.rating) +
      (p.ratingSource ? " · " + esc(p.ratingSource) : "")));
    if (p.price) meta.appendChild(el("span", "badge badge--price", esc(p.price)));
    var catLabel = (CATEGORIES.filter(function (c) { return c.id === p.category; })[0] || {}).label || p.category;
    if (catLabel) meta.appendChild(el("span", "badge badge--cat", esc(catLabel)));
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

    // actions
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

    var wazeBtn = el("a", "act act--waze", '<span class="act__ico">🚦</span><span>Waze</span>');
    wazeBtn.href = wazeUrl(p); wazeBtn.target = "_blank"; wazeBtn.rel = "noopener";
    wazeBtn.addEventListener("click", function (ev) { ev.stopPropagation(); });

    actions.appendChild(copyBtn);
    var actRow = el("div", "actions__row");
    actRow.appendChild(mapsBtn);
    actRow.appendChild(wazeBtn);
    actions.appendChild(actRow);
    card.appendChild(actions);

    // tap head/why to expand
    [head, card.querySelector(".card__why"), card.querySelector(".expandhint")].forEach(function (z) {
      if (z) z.addEventListener("click", function () { card.classList.toggle("is-open"); });
    });

    return card;
  }

  function renderItinerary() {
    var root = $("#view-itinerary");
    root.innerHTML = "";

    var anyShown = false;
    (TRIP.days || []).forEach(function (day) {
      var dayPlaces = (TRIP.places || [])
        .filter(function (p) { return p.day === day.id && matchesFilter(p); });
      if (!dayPlaces.length) return;
      anyShown = true;

      var sec = el("section", "day");
      var head = el("div", "day__head");
      head.appendChild(el("span", "day__pill", esc(day.date)));
      head.appendChild(el("h2", "day__title", esc(day.label)));
      sec.appendChild(head);
      if (day.subtitle) sec.appendChild(el("p", "day__sub", esc(day.subtitle)));

      dayPlaces.forEach(function (p) { sec.appendChild(placeCard(p)); });
      root.appendChild(sec);
    });

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
    ta.className = ""; ta.style.cssText = "width:100%;margin-top:8px;padding:11px;border:1px solid var(--line);border-radius:11px;background:var(--paper);font-family:ui-monospace,monospace;font-size:12.5px;";
    back.appendChild(ta);
    var loadBtn = el("button", "btn-primary", "🚀 Load my trip");
    var resetBtn = el("button", "btn-ghost", "↩︎ Back to sample trip");
    back.appendChild(loadBtn);
    back.appendChild(resetBtn);
    root.appendChild(back);

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
      var raw = $("#plan-json").value.trim();
      if (!raw) { toast("Paste the JSON first"); return; }
      // tolerate ```json fences
      raw = raw.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
      try {
        var obj = JSON.parse(raw);
        if (!obj.places || !obj.days) throw new Error("missing days/places");
        localStorage.setItem(SAVED_KEY, JSON.stringify(obj));
        TRIP = obj; TRIP.isSample = false;
        applyTripMeta();
        renderAll();
        go("itinerary");
        toast("Trip loaded! 🦞");
      } catch (e) {
        toast("Hmm, that JSON didn't parse");
      }
    });

    resetBtn.addEventListener("click", function () {
      localStorage.removeItem(SAVED_KEY);
      TRIP = window.SUP_MAINE_TRIP;
      applyTripMeta(); renderAll(); go("itinerary");
      toast("Back to the sample trip");
    });
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
  }

  $("#trip-chip").addEventListener("click", function () {
    var t = TRIP.trip || {};
    toast((t.title || "Maine trip") + " · " + (t.dates || "dates TBD"));
  });

  function go(view) {
    state.view = view;
    ["itinerary", "profile", "plan"].forEach(function (v) {
      $("#view-" + v).classList.toggle("is-hidden", v !== view);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".tabbar__btn"), function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-go") === view);
    });
    // search + chips only make sense on itinerary
    $("#chips").style.display = view === "itinerary" ? "" : "none";
    $(".searchwrap").style.display = view === "itinerary" ? "" : "none";
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
  }

  // =====================================================
  //  INIT
  // =====================================================
  applyTripMeta();
  renderChips();
  renderAll();
  go("itinerary");

  // service worker (offline pocket-guide) — only on http(s)
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
