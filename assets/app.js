// MJ Run Sheet — pickup/drop-off calculator (demo build)
// All addresses approximate; distances haversine × road factor.

/* ---------------- Data ---------------- */

const AREAS = {
  "Wigston":       { lat: 52.5880, lng: -1.0980 },
  "Oadby":         { lat: 52.5990, lng: -1.0800 },
  "Evington":      { lat: 52.6250, lng: -1.0820 },
  "Hamilton":      { lat: 52.6580, lng: -1.0500 },
  "Belgrave":      { lat: 52.6550, lng: -1.1180 },
  "Highfields":    { lat: 52.6290, lng: -1.1130 },
  "Glenfield":     { lat: 52.6490, lng: -1.2060 },
  "Beaumont Leys": { lat: 52.6650, lng: -1.1550 },
  "Braunstone":    { lat: 52.6150, lng: -1.1700 },
  "City centre":   { lat: 52.6360, lng: -1.1290 },
};

// tag = how they're @-mentioned in the group
const BASE_STAFF = [
  { id: "nabay",    name: "Nabay",       tag: "Nabay",      area: "Hamilton",      lat: 52.6580, lng: -1.0500, car: true  },
  { id: "paul",     name: "Paul",        tag: "Laup",       area: "Evington",      lat: 52.6280, lng: -1.0830, car: true  },
  { id: "aaron",    name: "Aaron Dixon", tag: "~Aaron Dixon", area: "Evington",    lat: 52.6320, lng: -1.0700, car: true  },
  { id: "shilzie",  name: "Shilzie",     tag: "~shilzie",   area: "Belgrave",      lat: 52.6560, lng: -1.1190, car: true  },
  { id: "zed",      name: "Z",           tag: "~Z",         area: "Wigston",       lat: 52.5900, lng: -1.1010, car: true  },
  { id: "naod",     name: "Naod",        tag: "~Naod",      area: "Hamilton",      lat: 52.6580, lng: -1.0500, car: false },
  { id: "siem",     name: "Siem",        tag: "~siem",      area: "Hamilton",      lat: 52.6580, lng: -1.0500, car: false },
  { id: "zane",     name: "Zane",        tag: "~Zane",      area: "Wigston",       lat: 52.5850, lng: -1.0930, car: false },
  { id: "kyan",     name: "Kyan",        tag: "~Kyan",      area: "Wigston",       lat: 52.5850, lng: -1.0930, car: false },
  { id: "zuri",     name: "Zuri",        tag: "Zuri",       area: "Wigston",       lat: 52.5860, lng: -1.1060, car: false },
  { id: "paige",    name: "Paige",       tag: "~Paige",     area: "Evington",      lat: 52.6260, lng: -1.0880, car: false },
  { id: "eleanor",  name: "Eleanor",     tag: "~Eleanor",   area: "Glenfield",     lat: 52.6490, lng: -1.2060, car: false },
  { id: "logan",    name: "Logan",       tag: "~Logan",     area: "Oadby",         lat: 52.5990, lng: -1.0800, car: false },
  { id: "ek",       name: "Ek",          tag: "~Ek",        area: "City centre",   lat: 52.6340, lng: -1.1150, car: false },
  { id: "kay",      name: "K",           tag: "~K",         area: "Wigston",       lat: 52.5880, lng: -1.0980, car: false },
  { id: "ziggy",    name: "Ziggy",       tag: "~Ziggy",     area: "Wigston",       lat: 52.5920, lng: -1.1020, car: false },
  { id: "bright",   name: "Bright",      tag: "~Bright",    area: "Wigston",       lat: 52.6000, lng: -1.1150, car: false },
  { id: "rihanna",  name: "Rihanna",     tag: "~Rihanna",   area: "Belgrave",      lat: 52.6480, lng: -1.1200, car: false },
  { id: "zakaria",  name: "Zakaria",     tag: "~Zakaria",   area: "Highfields",    lat: 52.6270, lng: -1.1150, car: false },
  { id: "chloe",    name: "Chloe",       tag: "~chloe",     area: "Hamilton",      lat: 52.6550, lng: -1.0450, car: false },
  { id: "jacob",    name: "Jacob",       tag: "~Jacob",     area: "Evington",      lat: 52.6220, lng: -1.0750, car: false },
  { id: "sulaimaan",name: "Sulaimaan",   tag: "~Sulaimaan", area: "Highfields",    lat: 52.6300, lng: -1.1100, car: false },
  { id: "mia",      name: "Mia",         tag: "~Mia",       area: "Braunstone",    lat: 52.6150, lng: -1.1700, car: false },
  { id: "dev",      name: "Dev",         tag: "~Dev",       area: "Beaumont Leys", lat: 52.6660, lng: -1.1500, car: true  },
];

const POINTS = [
  { id: "tesco",    name: "Tesco Hamilton",       msg: "tesco Hamilton",       lat: 52.6600, lng: -1.0470, core: true  },
  { id: "lidl",     name: "Lidl St George's",     msg: "lidl st George's",     lat: 52.6320, lng: -1.1180, core: true  },
  { id: "mcd",      name: "Wigston McDonald's",   msg: "Wigston McDonald's",   lat: 52.5930, lng: -1.0990, core: true  },
  { id: "meynells", name: "Meynell's Gorse P&R",  msg: "Meynell's Gorse park and ride", lat: 52.6350, lng: -1.2040, core: false },
  { id: "beaumont", name: "Tesco Beaumont Leys",  msg: "tesco Beaumont Leys",  lat: 52.6650, lng: -1.1550, core: false },
  { id: "fosse",    name: "Fosse Park",           msg: "Fosse Park",           lat: 52.6100, lng: -1.1690, core: false },
];

const VENUES = [
  { id: "donington", name: "Donington Park", lat: 52.8300, lng: -1.3750 },
  { id: "trent",     name: "Trent Bridge",   lat: 52.9370, lng: -1.1320 },
  { id: "warwick",   name: "Warwick Castle", lat: 52.2800, lng: -1.5850 },
];

const CAP = 4;            // passengers per car (5 incl. driver)
const MAX_PT_MILES = 2.2; // beyond this a worker is "far" from every stop
const ROAD = 1.35;        // road factor over straight-line distance
const MPH = 36;
const ARRIVE_EARLY = 15;  // minutes on site before shift
const STOP_GAP = 5;       // dwell minutes at a pickup stop

/* ---------------- State ---------------- */

const store = {
  get(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} },
};

const customStaff = store.get("mj_custom_staff", []);
const STAFF = () => BASE_STAFF.concat(customStaff);

const DEMO_SELECTED = ["nabay","paul","zed","naod","siem","zane","kyan","zuri","paige","eleanor","logan","ek","zakaria"];

const saved = store.get("mj_state", null);
const state = {
  sel: new Set(saved?.sel ?? DEMO_SELECTED),
  drv: new Set(saved?.drv ?? ["nabay","paul","zed"]),
  venueId: saved?.venueId ?? "donington",
  customVenue: saved?.customVenue ?? "",
  time: saved?.time ?? "08:00",
  dates: saved?.dates ?? (saved?.date ? [saved.date] : [nextSaturday()]),
  extraStops: new Set(saved?.extraStops ?? []),
  mode: "pickup",
  regroup: true,
  built: null, // { cars, warnings, suggestions, unseated, spareDrivers }
};

function persist() {
  store.set("mj_state", {
    sel: [...state.sel], drv: [...state.drv],
    venueId: state.venueId, customVenue: state.customVenue,
    time: state.time, dates: state.dates,
    extraStops: [...state.extraStops],
  });
}

function nextSaturday() {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ---------------- Geometry & time ---------------- */

function miles(a, b) {
  const R = 3958.8, toR = Math.PI / 180;
  const dLat = (b.lat - a.lat) * toR, dLng = (b.lng - a.lng) * toR;
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
const travelMin = (a, b) => (miles(a, b) * ROAD / MPH) * 60;
const floor5 = (m) => Math.floor(m / 5) * 5;

function fmtTime(mins) {
  mins = ((mins % 1440) + 1440) % 1440;
  let h = Math.floor(mins / 60), m = mins % 60;
  const ap = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return m === 0 ? `${h}${ap}` : `${h}.${String(m).padStart(2, "0")}${ap}`;
}

function fmtDateParts(iso) {
  const d = new Date(iso + "T12:00");
  const days = ["sun","mon","tue","wed","thu","fri","sat"];
  const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
  const n = d.getDate();
  const suffix = (n % 10 === 1 && n !== 11) ? "st" : (n % 10 === 2 && n !== 12) ? "nd" : (n % 10 === 3 && n !== 13) ? "rd" : "th";
  return { day: days[d.getDay()], nth: `${n}${suffix}`, month: months[d.getMonth()] };
}
function fmtDate(iso) {
  const p = fmtDateParts(iso);
  return `${p.day} ${p.nth} ${p.month}`;
}
function fmtDates() {
  const parts = [...state.dates].sort().map(fmtDateParts);
  if (!parts.length) return "";
  if (parts.length > 1 && parts.every((p) => p.month === parts[0].month)) {
    return parts.map((p) => `${p.day} ${p.nth}`).join(" and ") + " " + parts[0].month;
  }
  return parts.map((p) => `${p.day} ${p.nth} ${p.month}`).join(" and ");
}

function venue() {
  if (state.venueId === "other") {
    return { id: "other", name: state.customVenue || "the venue", fixedTravel: 45 };
  }
  return VENUES.find((v) => v.id === state.venueId);
}
function travelToVenue(from) {
  const v = venue();
  return v.fixedTravel ?? travelMin(from, v);
}

/* ---------------- Build: pickups ---------------- */

function buildPickups() {
  const staff = STAFF();
  const selected = staff.filter((p) => state.sel.has(p.id));
  const drivers = selected.filter((p) => state.drv.has(p.id) && p.car);
  const passengers = selected.filter((p) => !drivers.includes(p));

  const activePoints = POINTS.filter((pt) => pt.core || state.extraStops.has(pt.id));
  const warnings = [];
  const suggestions = [];

  // Nearest active point per passenger
  passengers.forEach((p) => {
    p._flag = null;
    let best = null, bestD = Infinity;
    activePoints.forEach((pt) => {
      const d = miles(p, pt);
      if (d < bestD) { bestD = d; best = pt; }
    });
    p._pt = best; p._ptDist = bestD;
  });

  // Suggest an extra stop when it would rescue "far" crew
  const far = passengers.filter((p) => p._ptDist > MAX_PT_MILES);
  if (far.length) {
    const candidates = POINTS.filter((pt) => !pt.core && !state.extraStops.has(pt.id));
    let bestCand = null, bestCover = [];
    candidates.forEach((pt) => {
      const cover = far.filter((p) => miles(p, pt) <= 1.6);
      if (cover.length > bestCover.length) { bestCover = cover; bestCand = pt; }
    });
    if (bestCand) {
      suggestions.push({
        point: bestCand,
        names: bestCover.map((p) => p.name),
        text: `${bestCover.map((p) => p.name).join(" and ")} ${bestCover.length > 1 ? "are" : "is"} a long way from every stop — the nearest is ${fmt1(bestCover[0]._ptDist)} mi away. ${bestCand.name} is only ${fmt1(miles(bestCover[0], bestCand))} mi from ${bestCover.length > 1 ? "them" : bestCover[0].name}.`,
      });
    }
    far.filter((p) => !bestCand || miles(p, bestCand) > 1.6).forEach((p) => {
      warnings.push({ kind: "info", text: `${p.name} is ${fmt1(p._ptDist)} mi from ${p._pt.name} — they may need to make their own way there.` });
    });
  }

  // Group by point, biggest demand first
  const byPoint = new Map();
  passengers.forEach((p) => {
    if (!byPoint.has(p._pt.id)) byPoint.set(p._pt.id, { point: p._pt, pax: [] });
    byPoint.get(p._pt.id).pax.push(p);
  });
  const groups = [...byPoint.values()].sort((a, b) => b.pax.length - a.pax.length);

  const pool = drivers.map((d) => ({ ...d }));
  const cars = [];
  const unseated = [];
  const carLoad = (c) => c.stops.reduce((n, s) => n + s.pax.length, 0);

  // Phase 1: hand cars to the biggest remaining group, nearest free driver first
  const groupsLeft = groups.map((g) => ({ point: g.point, queue: [...g.pax] }));
  while (pool.length) {
    groupsLeft.sort((a, b) => b.queue.length - a.queue.length);
    const g = groupsLeft[0];
    if (!g || !g.queue.length) break;
    let di = -1, dBest = Infinity;
    pool.forEach((d, i) => {
      const dd = miles(d, g.point);
      if (dd < dBest) { dBest = dd; di = i; }
    });
    const driver = pool.splice(di, 1)[0];
    cars.push({ driver, stops: [{ point: g.point, pax: g.queue.splice(0, CAP) }] });
  }

  // Phase 2: every leftover gets ANY spare seat — a filled seat beats a tidy route.
  // Prefer a car already calling at their point, then the car with the smallest detour.
  const leftovers = groupsLeft.flatMap((g) => g.queue.splice(0).map((p) => ({ p, point: g.point })));
  leftovers.forEach(({ p, point }) => {
    let best = null, bestScore = Infinity, bestStop = null;
    cars.forEach((c) => {
      if (carLoad(c) >= CAP) return;
      const sameStop = c.stops.find((s) => s.point.id === point.id) || null;
      const score = sameStop ? -1 : Math.min(...c.stops.map((s) => miles(s.point, point)));
      if (score < bestScore) { bestScore = score; best = c; bestStop = sameStop; }
    });
    if (!best) { unseated.push(p); return; }
    if (bestStop) {
      bestStop.pax.push(p);
    } else {
      best.stops.push({ point, pax: [p] });
      if (bestScore > 4.5) {
        p._flag = `detour +${fmt1(bestScore)} mi`;
        warnings.push({ kind: "info", text: `${best.driver.name} detours to ${point.name} to pick up ${p.name} (~${fmt1(bestScore)} mi extra) — shuffle crew or add a driver if that's too far.` });
      }
    }
  });

  // Times: last stop leaves in time for the venue; earlier stop backs off from it
  const [sh, sm] = state.time.split(":").map(Number);
  const shiftMin = sh * 60 + sm;
  cars.forEach((car) => {
    if (car.stops.length > 1) {
      // farther-from-venue stops go first
      car.stops.sort((a, b) => travelToVenue(b.point) - travelToVenue(a.point));
    }
    const last = car.stops[car.stops.length - 1];
    last.time = floor5(shiftMin - travelToVenue(last.point) - ARRIVE_EARLY);
    for (let i = car.stops.length - 2; i >= 0; i--) {
      car.stops[i].time = floor5(car.stops[i + 1].time - travelMin(car.stops[i].point, car.stops[i + 1].point) - STOP_GAP);
    }
  });

  if (unseated.length) {
    warnings.push({
      kind: "problem",
      text: `${unseated.map((p) => p.name).join(", ")} ${unseated.length > 1 ? "have" : "has"} no seat — switch on another driver, or tick someone with a car.`,
    });
  }
  const spare = pool.map((d) => d.name);
  if (spare.length) {
    warnings.push({ kind: "info", text: `Spare driver${spare.length > 1 ? "s" : ""} not needed today: ${spare.join(", ")}.` });
  }

  return { cars, warnings, suggestions, unseated, passengers, drivers };
}

/* ---------------- Build: drop-offs ---------------- */

function buildDropoffs(pickup) {
  const v = venue();
  let cars;
  if (state.regroup) {
    const pool = pickup.drivers.map((d) => ({ ...d, pax: [] }));
    // nearest driver-home first, capacity-bound
    const queue = [...pickup.passengers].filter((p) => !pickup.unseated.includes(p));
    queue.forEach((p) => {
      let best = null, bestD = Infinity;
      pool.forEach((d) => {
        if (d.pax.length >= CAP) return;
        const dd = miles(p, d);
        if (dd < bestD) { bestD = dd; best = d; }
      });
      if (best) best.pax.push(p);
    });
    cars = pool.filter((d) => d.pax.length).map((d) => ({ driver: d, pax: d.pax }));
  } else {
    cars = pickup.cars.map((c) => ({ driver: c.driver, pax: c.stops.flatMap((s) => s.pax) }));
  }
  // Order stops: nearest-neighbour from the venue, driver's own home last
  cars.forEach((car) => {
    const route = [];
    let here = v.fixedTravel ? car.driver : v; // custom venue: order from driver's area
    const left = [...car.pax];
    while (left.length) {
      let bi = 0, bd = Infinity;
      left.forEach((p, i) => {
        const d = miles(here, p);
        if (d < bd) { bd = d; bi = i; }
      });
      here = left.splice(bi, 1)[0];
      route.push(here);
    }
    car.route = route;
  });
  return { cars };
}

const fmt1 = (n) => (Math.round(n * 10) / 10).toFixed(1);

/* ---------------- Messages ---------------- */

function pickupMessage(built) {
  const lines = [`Hi all please find below pick up and times for ${venue().name} ${fmtDates()}`, ""];
  built.cars.forEach((car) => {
    const bits = car.stops.map((s, i) =>
      `${i > 0 ? "then onto " : ""}${s.point.msg} ${fmtTime(s.time)} ${s.pax.map((p) => "@" + p.tag).join(" ")}`);
    lines.push(`@${car.driver.tag} driver ${bits.join(" ")}`, "");
  });
  lines.push("Could you all please confirm 👍 asap please.");
  return lines.join("\n");
}

function dropoffMessage(drop) {
  const lines = [`Hi all drop offs after ${venue().name} ${fmtDates()}`, ""];
  drop.cars.forEach((car) => {
    lines.push(`@${car.driver.tag} driver ${car.route.map((p) => `@${p.tag} (${p.area})`).join(" then ")}`, "");
  });
  lines.push("Thank you all for today, safe home x");
  return lines.join("\n");
}

/* ---------------- Rendering ---------------- */

const $ = (sel) => document.querySelector(sel);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function initials(name) {
  return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function renderVenues() {
  const wrap = $("#venue-chips");
  wrap.innerHTML = "";
  VENUES.concat([{ id: "other", name: "Other…" }]).forEach((v) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip";
    b.textContent = v.id === "other" && state.venueId === "other" && state.customVenue ? state.customVenue : v.name;
    b.setAttribute("aria-pressed", String(state.venueId === v.id));
    b.addEventListener("click", () => {
      if (v.id === "other") {
        const name = prompt("Venue name?", state.customVenue || "");
        if (name === null) return;
        state.customVenue = name.trim();
      }
      state.venueId = v.id;
      persist(); renderVenues(); rebuildIfBuilt();
    });
    wrap.appendChild(b);
  });
}

function renderCrew() {
  const q = ($("#crew-search").value || "").toLowerCase();
  const list = $("#crew-list");
  list.innerHTML = "";
  STAFF().forEach((p) => {
    if (q && !p.name.toLowerCase().includes(q) && !p.area.toLowerCase().includes(q)) return;
    const on = state.sel.has(p.id);
    const row = document.createElement("button");
    row.type = "button"; row.className = "crew-row";
    row.setAttribute("aria-pressed", String(on));
    row.innerHTML = `
      <span class="avatar" aria-hidden="true">${initials(p.name)}</span>
      <span class="who">
        <span class="nm">${esc(p.name)} ${p.car ? '<span class="badge-car">DRIVER 🚗</span>' : ""}</span>
        <span class="ar">${esc(p.area)}</span>
      </span>
      <span class="tick" aria-hidden="true">✓</span>`;
    row.addEventListener("click", () => {
      if (state.sel.has(p.id)) { state.sel.delete(p.id); state.drv.delete(p.id); }
      else { state.sel.add(p.id); if (p.car) state.drv.add(p.id); }
      persist(); renderCrew(); renderDrivers(); renderMath(); rebuildIfBuilt();
    });
    list.appendChild(row);
  });
  $("#crew-count").textContent = `${state.sel.size} ticked · ${STAFF().length} on the books`;
}

function renderDrivers() {
  const wrap = $("#driver-list");
  wrap.innerHTML = "";
  const candidates = STAFF().filter((p) => state.sel.has(p.id) && p.car);
  if (!candidates.length) {
    wrap.innerHTML = `<p style="color: var(--muted); font-size: 0.95rem; padding: 8px 0;">Nobody ticked has a car yet.</p>`;
  }
  candidates.forEach((p) => {
    const row = document.createElement("div");
    row.className = "driver-row";
    row.innerHTML = `
      <p class="who">${esc(p.name)} <small>${esc(p.area)} · seats 4 + driver</small></p>`;
    const sw = document.createElement("button");
    sw.className = "switch";
    sw.setAttribute("aria-pressed", String(state.drv.has(p.id)));
    sw.setAttribute("aria-label", `${p.name} driving today`);
    sw.addEventListener("click", () => {
      state.drv.has(p.id) ? state.drv.delete(p.id) : state.drv.add(p.id);
      persist(); renderDrivers(); renderMath(); rebuildIfBuilt();
    });
    row.appendChild(sw);
    wrap.appendChild(row);
  });
  $("#driver-count").textContent = `${[...state.drv].filter((id) => state.sel.has(id)).length} driving`;
}

function seatsMath() {
  const staff = STAFF();
  const sel = staff.filter((p) => state.sel.has(p.id));
  const drivers = sel.filter((p) => state.drv.has(p.id) && p.car);
  const pax = sel.length - drivers.length;
  return { crew: sel.length, drivers: drivers.length, pax, capacity: drivers.length * CAP };
}

function renderMath() {
  const m = seatsMath();
  const bar = $("#mathbar");
  bar.classList.remove("short");
  if (!m.crew) { bar.textContent = "Tick who's working — then build the run sheet"; return; }
  if (!m.drivers) {
    bar.classList.add("short");
    bar.textContent = `${m.crew} crew · no drivers — switch someone on below`;
    return;
  }
  const spare = m.capacity - m.pax;
  if (spare < 0) {
    bar.classList.add("short");
    bar.textContent = `${m.crew} crew · ${m.drivers} driving — ${-spare} seat${spare === -1 ? "" : "s"} short. Add a driver`;
  } else {
    bar.innerHTML = `${m.crew} crew · ${m.drivers} driving · ${m.drivers * (CAP + 1)} seats — <span class="ok-dot">everyone seated ✓</span>${spare ? ` <span style="opacity:0.7">(${spare} spare)</span>` : ""}`;
  }
}

function renderResults() {
  const built = state.built;
  const resEl = $("#results");
  if (!built) { resEl.hidden = true; $("#copy-btn").hidden = true; return; }
  resEl.hidden = false;
  $("#copy-btn").hidden = false;
  $("#mode-pickup").setAttribute("aria-pressed", String(state.mode === "pickup"));
  $("#mode-dropoff").setAttribute("aria-pressed", String(state.mode === "dropoff"));
  $("#regroup-row").hidden = state.mode !== "dropoff";
  $("#regroup-switch").setAttribute("aria-pressed", String(state.regroup));

  const warnEl = $("#warnings");
  warnEl.innerHTML = "";
  const carsEl = $("#cars");
  carsEl.innerHTML = "";

  if (state.mode === "pickup") {
    built.suggestions.forEach((s) => {
      const el = document.createElement("div");
      el.className = "callout";
      el.innerHTML = `<p><strong>Suggested new stop:</strong> ${esc(s.text)}</p>`;
      const btn = document.createElement("button");
      btn.className = "btn btn-amber"; btn.type = "button";
      btn.textContent = `Add ${s.point.name} as a stop`;
      btn.addEventListener("click", () => {
        state.extraStops.add(s.point.id);
        persist(); build();
      });
      el.appendChild(btn);
      warnEl.appendChild(el);
    });
    built.warnings.forEach((w) => {
      const el = document.createElement("div");
      el.className = "callout" + (w.kind === "problem" ? " problem" : "");
      el.innerHTML = `<p>${esc(w.text)}</p>`;
      warnEl.appendChild(el);
    });

    built.cars.forEach((car, ci) => {
      const load = car.stops.reduce((n, s) => n + s.pax.length, 0);
      const el = document.createElement("div");
      el.className = "car";
      el.innerHTML = `
        <div class="car-head">
          <span class="drv">${esc(car.driver.name)}<small>driving from ${esc(car.driver.area)}</small></span>
          <span class="seats">${load}/${CAP} seats</span>
        </div>`;
      car.stops.forEach((stop, si) => {
        const sb = document.createElement("div");
        sb.className = "stop-block";
        sb.innerHTML = `
          <div class="stop-line">
            ${si > 0 ? '<span class="then">then onto</span>' : ""}
            <span class="t">${fmtTime(stop.time)}</span>
            <span>${esc(stop.point.name)}</span>
            <span class="tweak">
              <button type="button" aria-label="5 minutes earlier">−</button>
              <button type="button" aria-label="5 minutes later">+</button>
            </span>
          </div>
          <div class="pax">${stop.pax.map((p) => `<span class="p">${esc(p.name)}${p._flag ? `<em class="det">${esc(p._flag)}</em>` : ""}</span>`).join("")}</div>`;
        const [minus, plus] = sb.querySelectorAll(".tweak button");
        minus.addEventListener("click", () => { stop.time -= 5; renderResults(); });
        plus.addEventListener("click", () => { stop.time += 5; renderResults(); });
        el.appendChild(sb);
      });
      carsEl.appendChild(el);
    });
    setBubble(pickupMessage(built));
  } else {
    const drop = buildDropoffs(built);
    if (!drop.cars.length) {
      warnEl.innerHTML = `<div class="callout problem"><p>No cars to plan — build the pickups first.</p></div>`;
    }
    drop.cars.forEach((car) => {
      const el = document.createElement("div");
      el.className = "car";
      el.innerHTML = `
        <div class="car-head">
          <span class="drv">${esc(car.driver.name)}<small>heads home to ${esc(car.driver.area)}</small></span>
          <span class="seats">${car.pax.length}/${CAP} seats</span>
        </div>
        <div class="stop-block">
          <div class="pax">${car.route.map((p, i) => `<span class="p">${i + 1}. ${esc(p.name)} · ${esc(p.area)}</span>`).join("")}
          <span class="p driver-pill">then home</span></div>
        </div>`;
      carsEl.appendChild(el);
    });
    setBubble(dropoffMessage(drop));
  }
}

function setBubble(text) {
  let html = esc(text);
  // Wrap known crew tags exactly, longest first so "~Aaron Dixon" wins over partials
  STAFF().map((p) => p.tag).sort((a, b) => b.length - a.length).forEach((tag) => {
    const pattern = ("@" + tag).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(new RegExp(pattern + "(?![\\w'])", "g"), '<span class="tag">$&</span>');
  });
  $("#wa-bubble").innerHTML = html + '<span class="stamp">now ✓✓</span>';
  state.message = text;
}

/* ---------------- Actions ---------------- */

function build() {
  state.built = buildPickups();
  renderResults();
  $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
  $("#build-btn").textContent = "Rebuild run sheet";
}
function rebuildIfBuilt() { if (state.built) { state.built = buildPickups(); renderResults(); } }

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------------- Wire up ---------------- */

function renderDates() {
  const wrap = $("#date-chips");
  wrap.innerHTML = "";
  [...state.dates].sort().forEach((iso) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip";
    b.setAttribute("aria-label", `Remove ${fmtDate(iso)}`);
    b.textContent = `${fmtDate(iso)} ✕`;
    b.addEventListener("click", () => {
      state.dates = state.dates.filter((d) => d !== iso);
      persist(); renderDates(); rebuildIfBuilt();
    });
    wrap.appendChild(b);
  });
}

$("#ev-start").value = state.time;
$("#ev-date").addEventListener("change", (e) => {
  const v = e.target.value;
  if (v && !state.dates.includes(v)) {
    state.dates.push(v);
    persist(); renderDates(); rebuildIfBuilt();
  }
});
$("#ev-start").addEventListener("change", (e) => { state.time = e.target.value || "08:00"; persist(); rebuildIfBuilt(); });

$("#crew-search").addEventListener("input", renderCrew);
$("#crew-none").addEventListener("click", () => {
  state.sel.clear(); state.drv.clear();
  persist(); renderCrew(); renderDrivers(); renderMath(); rebuildIfBuilt();
});

$("#build-btn").addEventListener("click", () => {
  const m = seatsMath();
  if (!state.dates.length) { toast("Add a date first"); return; }
  if (!m.crew) { toast("Tick who's working first"); return; }
  if (!m.drivers) { toast("Switch on at least one driver"); return; }
  build();
});

$("#copy-btn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(state.message || "");
    toast("Copied — paste it into the group ✓");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = state.message || "";
    document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); ta.remove();
    toast("Copied — paste it into the group ✓");
  }
});

$("#mode-pickup").addEventListener("click", () => { state.mode = "pickup"; renderResults(); });
$("#mode-dropoff").addEventListener("click", () => { state.mode = "dropoff"; renderResults(); });
$("#regroup-switch").addEventListener("click", () => { state.regroup = !state.regroup; renderResults(); });

// Add-crew dialog
const dlg = $("#add-dialog");
const areaWrap = $("#ac-area");
Object.keys(AREAS).forEach((name, i) => {
  const b = document.createElement("button");
  b.type = "button"; b.className = "chip";
  b.textContent = name;
  b.setAttribute("aria-pressed", String(i === 0));
  b.addEventListener("click", () => {
    areaWrap.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
    b.setAttribute("aria-pressed", "true");
  });
  areaWrap.appendChild(b);
});
$("#ac-car").querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    $("#ac-car").querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");
  });
});
$("#add-crew").addEventListener("click", () => { $("#add-form").reset(); dlg.showModal(); });
$("#ac-cancel").addEventListener("click", () => dlg.close());
$("#add-form").addEventListener("submit", (e) => {
  const name = $("#ac-name").value.trim();
  if (!name) { e.preventDefault(); return; }
  const area = areaWrap.querySelector('[aria-pressed="true"]')?.textContent || "City centre";
  const car = $("#ac-car").querySelector('[aria-pressed="true"]')?.textContent === "Yes";
  const base = AREAS[area];
  const p = {
    id: "c_" + Date.now(),
    name, tag: "~" + name.split(" ")[0],
    area, car,
    lat: base.lat + (Math.random() - 0.5) * 0.006,
    lng: base.lng + (Math.random() - 0.5) * 0.006,
  };
  customStaff.push(p);
  store.set("mj_custom_staff", customStaff);
  state.sel.add(p.id);
  if (car) state.drv.add(p.id);
  persist(); renderCrew(); renderDrivers(); renderMath(); rebuildIfBuilt();
});

renderVenues();
renderDates();
renderCrew();
renderDrivers();
renderMath();
