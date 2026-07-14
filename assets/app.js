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
  { id: "nabay",    name: "Nabay",       tag: "Nabay",      area: "Hamilton",      lat: 52.6580, lng: -1.0500, car: true, shifts: 46 },
  { id: "paul",     name: "Paul",        tag: "Laup",       area: "Evington",      lat: 52.6280, lng: -1.0830, car: true, shifts: 41 },
  { id: "aaron",    name: "Aaron Dixon", tag: "~Aaron Dixon", area: "Evington",    lat: 52.6320, lng: -1.0700, car: true, shifts: 33 },
  { id: "shilzie",  name: "Shilzie",     tag: "~shilzie",   area: "Belgrave",      lat: 52.6560, lng: -1.1190, car: true, shifts: 38 },
  { id: "zed",      name: "Z",           tag: "~Z",         area: "Wigston",       lat: 52.5900, lng: -1.1010, car: true, shifts: 29 },
  { id: "naod",     name: "Naod",        tag: "~Naod",      area: "Hamilton",      lat: 52.6580, lng: -1.0500, car: false, shifts: 22 },
  { id: "siem",     name: "Siem",        tag: "~siem",      area: "Hamilton",      lat: 52.6580, lng: -1.0500, car: false, shifts: 21 },
  { id: "zane",     name: "Zane",        tag: "~Zane",      area: "Wigston",       lat: 52.5850, lng: -1.0930, car: false, shifts: 12 },
  { id: "kyan",     name: "Kyan",        tag: "~Kyan",      area: "Wigston",       lat: 52.5850, lng: -1.0930, car: false, shifts: 11 },
  { id: "zuri",     name: "Zuri",        tag: "Zuri",       area: "Wigston",       lat: 52.5860, lng: -1.1060, car: false, shifts: 17 },
  { id: "paige",    name: "Paige",       tag: "~Paige",     area: "Evington",      lat: 52.6260, lng: -1.0880, car: false, shifts: 15 },
  { id: "eleanor",  name: "Eleanor",     tag: "~Eleanor",   area: "Glenfield",     lat: 52.6490, lng: -1.2060, car: false, shifts: 8 },
  { id: "logan",    name: "Logan",       tag: "~Logan",     area: "Oadby",         lat: 52.5990, lng: -1.0800, car: false, shifts: 6 },
  { id: "ek",       name: "Ek",          tag: "~Ek",        area: "City centre",   lat: 52.6340, lng: -1.1150, car: false, shifts: 19 },
  { id: "kay",      name: "K",           tag: "~K",         area: "Wigston",       lat: 52.5880, lng: -1.0980, car: false, shifts: 9 },
  { id: "ziggy",    name: "Ziggy",       tag: "~Ziggy",     area: "Wigston",       lat: 52.5920, lng: -1.1020, car: false, shifts: 13 },
  { id: "bright",   name: "Bright",      tag: "~Bright",    area: "Wigston",       lat: 52.6000, lng: -1.1150, car: false, shifts: 7 },
  { id: "rihanna",  name: "Rihanna",     tag: "~Rihanna",   area: "Belgrave",      lat: 52.6480, lng: -1.1200, car: false, shifts: 10 },
  { id: "zakaria",  name: "Zakaria",     tag: "~Zakaria",   area: "Highfields",    lat: 52.6270, lng: -1.1150, car: false, shifts: 14 },
  { id: "chloe",    name: "Chloe",       tag: "~chloe",     area: "Hamilton",      lat: 52.6550, lng: -1.0450, car: false, shifts: 25 },
  { id: "jacob",    name: "Jacob",       tag: "~Jacob",     area: "Evington",      lat: 52.6220, lng: -1.0750, car: false, shifts: 5 },
  { id: "sulaimaan",name: "Sulaimaan",   tag: "~Sulaimaan", area: "Highfields",    lat: 52.6300, lng: -1.1100, car: false, shifts: 4 },
  { id: "mia",      name: "Mia",         tag: "~Mia",       area: "Braunstone",    lat: 52.6150, lng: -1.1700, car: false, shifts: 2 },
  { id: "dev",      name: "Dev",         tag: "~Dev",       area: "Beaumont Leys", lat: 52.6660, lng: -1.1500, car: true, shifts: 3 },
];

const POINTS = [
  { id: "tesco",    name: "Tesco Hamilton",       msg: "tesco Hamilton",       lat: 52.6600, lng: -1.0470, core: true },
  { id: "lidl",     name: "Lidl St George's",     msg: "lidl st George's",     lat: 52.6320, lng: -1.1180, core: true },
  { id: "mcd",      name: "Wigston McDonald's",   msg: "Wigston McDonald's",   lat: 52.5930, lng: -1.0990, core: true },
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

// Shifts: seed counts + a log of copied run sheets ({dateIso: [ids]}), so
// each person's tally grows once per date they were actually sent out on.
const shiftLog = store.get("mj_shiftlog", {});
function shiftsOf(p) {
  let n = p.shifts || 0;
  for (const ids of Object.values(shiftLog)) if (ids.includes(p.id)) n++;
  return n;
}
function logShifts() {
  if (!state.built) return;
  const ids = [];
  state.built.cars.forEach((car) => {
    ids.push(car.driver.id);
    (car.pax || car.stops.flatMap((st) => st.pax)).forEach((px) => ids.push(px.id));
  });
  state.dates.forEach((d) => {
    const set = new Set(shiftLog[d] || []);
    ids.forEach((i) => set.add(i));
    shiftLog[d] = [...set];
  });
  store.set("mj_shiftlog", shiftLog);
  renderCrew();
}

const DEMO_SELECTED = ["nabay","paul","zed","naod","siem","zane","kyan","zuri","paige","eleanor","logan","ek","zakaria"];

const saved = store.get("mj_state", null);
const state = {
  sel: new Set(saved?.sel ?? DEMO_SELECTED),
  drv: new Set(saved?.drv ?? ["nabay","paul","zed"]),
  venueId: saved?.venueId ?? "donington",
  customVenue: saved?.customVenue ?? "",
  time: saved?.time ?? "08:00",
  dates: saved?.dates ?? (saved?.date ? [saved.date] : [nextSaturday()]),
  pickupStyle: saved?.pickupStyle ?? "points",
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
    pickupStyle: state.pickupStyle,
    extraStops: [...state.extraStops],
  });
}

function localIso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function nextSaturday() {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  return localIso(d);
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

  if (state.pickupStyle === "homes") return buildHomePickups(drivers, passengers);

  const activePoints = POINTS.filter((pt) => pt.core || state.extraStops.has(pt.id));
  const warnings = [];
  const suggestions = [];

  if (venue().fixedTravel) {
    warnings.push({ kind: "info", text: `Times for ${venue().name} assume about a 45 minute drive. Nudge each stop with − and + if it's nearer or further.` });
  }

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
        text: `${bestCover.map((p) => p.name).join(" and ")} ${bestCover.length > 1 ? "are" : "is"} a long way from every stop, the nearest is ${fmt1(bestCover[0]._ptDist)} mi away. ${bestCand.name} is only ${fmt1(miles(bestCover[0], bestCand))} mi from ${bestCover.length > 1 ? "them" : bestCover[0].name}.`,
      });
    }
    far.filter((p) => !bestCand || miles(p, bestCand) > 1.6).forEach((p) => {
      warnings.push({ kind: "info", text: `${p.name} is ${fmt1(p._ptDist)} mi from ${p._pt.name}. They may need to make their own way there.` });
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

  // Phase 1: biggest remaining group first; when groups tie on size, the
  // (group, driver) pair with the shortest home-to-stop drive wins, so a
  // Hamilton driver gets the Hamilton stop, not a same-sized one across town.
  const groupsLeft = groups.map((g) => ({ point: g.point, queue: [...g.pax] }));
  while (pool.length) {
    const live = groupsLeft.filter((g) => g.queue.length);
    if (!live.length) break;
    const most = Math.max(...live.map((g) => g.queue.length));
    let best = null;
    live.filter((g) => g.queue.length === most).forEach((g) => {
      pool.forEach((d, i) => {
        const dd = miles(d, g.point);
        if (!best || dd < best.dd) best = { g, i, dd };
      });
    });
    const driver = pool.splice(best.i, 1)[0];
    cars.push({ driver, stops: [{ point: best.g.point, pax: best.g.queue.splice(0, CAP) }] });
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
        warnings.push({ kind: "info", text: `${best.driver.name} detours to ${point.name} to pick up ${p.name} (~${fmt1(bestScore)} mi extra). Shuffle crew or add a driver if that's too far.` });
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
      text: `${unseated.map((p) => p.name).join(", ")} ${unseated.length > 1 ? "have" : "has"} no seat. Switch on another driver or tick someone with a car.`,
    });
  }
  const spare = pool.map((d) => d.name);
  if (spare.length) {
    warnings.push({ kind: "info", text: `Spare driver${spare.length > 1 ? "s" : ""} not needed today: ${spare.join(", ")}.` });
  }

  return { cars, warnings, suggestions, unseated, passengers, drivers };
}

/* ---------------- Build: home pickups ---------------- */

function buildHomePickups(drivers, passengers) {
  const warnings = [];
  const unseated = [];
  if (venue().fixedTravel) {
    warnings.push({ kind: "info", text: `Times for ${venue().name} assume about a 45 minute drive. Nudge each stop with − and + if it's nearer or further.` });
  }
  const pool = drivers.map((d) => ({ ...d, pax: [] }));
  passengers.forEach((p) => {
    p._flag = null;
    let best = null, bd = Infinity;
    pool.forEach((d) => {
      if (d.pax.length >= CAP) return;
      const dd = miles(p, d);
      if (dd < bd) { bd = dd; best = d; }
    });
    if (best) best.pax.push(p); else unseated.push(p);
  });
  const [sh, sm] = state.time.split(":").map(Number);
  const shiftMin = sh * 60 + sm;
  const cars = pool.filter((d) => d.pax.length).map((d) => {
    const route = [];
    let here = d;
    const left = [...d.pax];
    while (left.length) {
      let bi = 0, bd = Infinity;
      left.forEach((p, i) => { const dd = miles(here, p); if (dd < bd) { bd = dd; bi = i; } });
      here = left.splice(bi, 1)[0];
      route.push(here);
    }
    let t = shiftMin - ARRIVE_EARLY - travelToVenue(route[route.length - 1]);
    const times = new Array(route.length);
    for (let i = route.length - 1; i >= 0; i--) {
      // Keep each earlier home at least 5 min before the next, so neighbours
      // don't both get stamped the same time.
      times[i] = i === route.length - 1 ? floor5(t) : Math.min(floor5(t), times[i + 1] - 5);
      if (i > 0) t = times[i] - (travelMin(route[i - 1], route[i]) + 3);
    }
    return { driver: d, pax: route, stops: route.map((pp, i) => ({ home: pp, time: times[i] })) };
  });
  if (unseated.length) {
    warnings.push({ kind: "problem", text: `${unseated.map((p) => p.name).join(", ")} ${unseated.length > 1 ? "have" : "has"} no seat. Switch on another driver or tick someone with a car.` });
  }
  const spare = pool.filter((d) => !d.pax.length).map((d) => d.name);
  if (spare.length) {
    warnings.push({ kind: "info", text: `Spare driver${spare.length > 1 ? "s" : ""} not needed today: ${spare.join(", ")}.` });
  }
  return { cars, warnings, suggestions: [], unseated, passengers, drivers, homes: true };
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
    cars = pickup.cars.map((c) => ({ driver: c.driver, pax: c.pax ? [...c.pax] : c.stops.flatMap((s) => s.pax) }));
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
    if (built.homes) {
      const bits = car.stops.map((s) => `${fmtTime(s.time)} @${s.home.tag}`).join(" then ");
      lines.push(`@${car.driver.tag} driver picking up from home ${bits}`, "");
    } else {
      const bits = car.stops.map((s, i) =>
        `${i > 0 ? "then onto " : ""}${s.point.msg} ${fmtTime(s.time)} ${s.pax.map((p) => "@" + p.tag).join(" ")}`);
      lines.push(`@${car.driver.tag} driver ${bits.join(" ")}`, "");
    }
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
      state.venueId = v.id;
      persist(); renderVenues(); rebuildIfBuilt();
      if (v.id === "other") $("#ov-name")?.focus();
    });
    wrap.appendChild(b);
  });
  const ovField = $("#ov-field");
  if (ovField) {
    ovField.hidden = state.venueId !== "other";
    $("#ov-name").value = state.customVenue || "";
  }
}

function renderCrew() {
  const q = ($("#crew-search").value || "").toLowerCase();
  const list = $("#crew-list");
  list.innerHTML = "";
  STAFF().slice().sort((a, b) => a.name.localeCompare(b.name)).forEach((p) => {
    if (q && !p.name.toLowerCase().includes(q) && !p.area.toLowerCase().includes(q)) return;
    const on = state.sel.has(p.id);
    const row = document.createElement("button");
    row.type = "button"; row.className = "crew-row";
    row.setAttribute("aria-pressed", String(on));
    const custom = String(p.id).startsWith("c_");
    row.innerHTML = `
      <span class="who">
        <span class="nm">${esc(p.name)} ${p.car ? '<span class="badge-car">DRIVER 🚗</span>' : ""}</span>
        <span class="ar">${esc(p.area)} · ${shiftsOf(p)} shift${shiftsOf(p) === 1 ? "" : "s"}${custom ? " · added by you" : ""}</span>
      </span>
      <span class="tick" aria-hidden="true">✓</span>`;
    row.addEventListener("click", () => {
      if (state.sel.has(p.id)) { state.sel.delete(p.id); state.drv.delete(p.id); }
      else { state.sel.add(p.id); if (p.car) state.drv.add(p.id); }
      persist(); renderCrew(); renderDrivers(); renderMath(); rebuildIfBuilt();
    });
    if (custom) {
      const del = document.createElement("span");
      del.className = "row-del";
      del.setAttribute("role", "button");
      del.setAttribute("tabindex", "0");
      del.setAttribute("aria-label", `Remove ${p.name} from the crew list`);
      del.textContent = "✕";
      const removeIt = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const i = customStaff.findIndex((c) => c.id === p.id);
        if (i >= 0) customStaff.splice(i, 1);
        store.set("mj_custom_staff", customStaff);
        state.sel.delete(p.id);
        state.drv.delete(p.id);
        persist(); renderCrew(); renderDrivers(); renderMath(); rebuildIfBuilt();
        toast(`${p.name} removed`);
      };
      del.addEventListener("click", removeIt);
      del.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") removeIt(e); });
      row.appendChild(del);
    }
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
  if (!m.crew) { bar.textContent = "Tick who's working, then build the run sheet"; return; }
  if (!m.drivers) {
    bar.classList.add("short");
    bar.textContent = `${m.crew} crew · no drivers. Switch someone on below`;
    return;
  }
  const spare = m.capacity - m.pax;
  if (spare < 0) {
    bar.classList.add("short");
    bar.textContent = `${m.crew} crew · ${m.drivers} driving · ${-spare} seat${spare === -1 ? "" : "s"} short. Add a driver`;
  } else {
    bar.innerHTML = `${m.crew} crew · ${m.drivers} driving · ${m.drivers * (CAP + 1)} seats · <span class="ok-dot">everyone seated ✓</span>${spare ? ` <span style="opacity:0.7">(${spare} spare)</span>` : ""}`;
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
      btn.className = "btn btn-brand"; btn.type = "button";
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
      const load = car.pax ? car.pax.length : car.stops.reduce((n, s) => n + s.pax.length, 0);
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
        const place = stop.home ? `${esc(stop.home.name)}'s` : esc(stop.point.name);
        const paxHtml = stop.home
          ? `<span class="p">${esc(stop.home.name)} · ${esc(stop.home.area)}</span>`
          : stop.pax.map((p) => `<span class="p">${esc(p.name)}${p._flag ? `<em class="det">${esc(p._flag)}</em>` : ""}</span>`).join("");
        sb.innerHTML = `
          <div class="stop-line">
            ${si > 0 ? '<span class="then">then</span>' : ""}
            <span class="t">${fmtTime(stop.time)}</span>
            <span>${place}</span>
            <span class="tweak">
              <button type="button" aria-label="5 minutes earlier">−</button>
              <button type="button" aria-label="5 minutes later">+</button>
            </span>
          </div>
          <div class="pax">${paxHtml}</div>`;
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
      warnEl.innerHTML = `<div class="callout problem"><p>No cars to plan. Build the pickups first.</p></div>`;
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
  const b = buildPickups();
  if (!b.cars.length) {
    state.built = null;
    renderResults();
    $("#build-btn").textContent = "Build run sheet";
    toast("Nobody to pick up yet. Tick some crew");
    return;
  }
  state.built = b;
  renderResults();
  $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
  $("#build-btn").textContent = "Rebuild run sheet";
}
// Keep the results truthful: if the crew or drivers vanish, the sheet vanishes too
function rebuildIfBuilt() {
  if (!state.built) return;
  const m = seatsMath();
  if (!m.crew || !m.drivers) {
    state.built = null;
    $("#build-btn").textContent = "Build run sheet";
    renderResults();
    return;
  }
  const b = buildPickups();
  state.built = b.cars.length ? b : null;
  if (!state.built) $("#build-btn").textContent = "Build run sheet";
  renderResults();
}

function toast(msg, action) {
  const t = $("#toast");
  t.textContent = msg;
  if (action) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "toast-act";
    b.textContent = action.label;
    b.addEventListener("click", () => { t.classList.remove("show"); action.fn(); });
    t.appendChild(b);
  }
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), action ? 6000 : 2200);
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
// Dates are added deliberately: pick a date, then tap Add
$("#date-add").addEventListener("click", () => {
  const v = $("#ev-date").value;
  if (!v) { toast("Pick a date first"); return; }
  if (v < localIso(new Date())) { toast("That date has already gone"); return; }
  if (state.dates.includes(v)) { toast("Already on the list"); return; }
  state.dates.push(v);
  persist(); renderDates(); rebuildIfBuilt();
  toast(`Added ${fmtDate(v)} ✓`);
});
$("#ov-name")?.addEventListener("input", (e) => {
  state.customVenue = e.target.value.trim();
  persist(); rebuildIfBuilt();
});
$("#ev-start").addEventListener("change", (e) => { state.time = e.target.value || "08:00"; persist(); rebuildIfBuilt(); });

$("#crew-search").addEventListener("input", renderCrew);
$("#crew-none").addEventListener("click", () => {
  if (!state.sel.size) return;
  const prevSel = [...state.sel], prevDrv = [...state.drv];
  state.sel.clear(); state.drv.clear();
  persist(); renderCrew(); renderDrivers(); renderMath(); rebuildIfBuilt();
  toast("Crew cleared", { label: "Undo", fn: () => {
    state.sel = new Set(prevSel);
    state.drv = new Set(prevDrv);
    persist(); renderCrew(); renderDrivers(); renderMath(); rebuildIfBuilt();
  }});
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
    if (state.mode === "pickup") logShifts();
    toast("Copied. Paste it into the group ✓");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = state.message || "";
    document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); ta.remove();
    if (state.mode === "pickup") logShifts();
    toast("Copied. Paste it into the group ✓");
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

// Backup / restore — the whole operation should never live on one phone
$("#backup-btn").addEventListener("click", () => {
  const data = {
    kind: "mj-runsheet-backup",
    version: 1,
    saved: new Date().toISOString(),
    state: store.get("mj_state", null),
    customStaff,
    shiftLog,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `mj-runsheet-backup-${localIso(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
  toast("Backup saved to your downloads ✓");
});
$("#restore-btn").addEventListener("click", () => $("#restore-file").click());
$("#restore-file").addEventListener("change", (e) => {
  const f = e.target.files[0];
  if (!f) return;
  f.text().then((txt) => {
    const d = JSON.parse(txt);
    if (d.kind !== "mj-runsheet-backup") throw new Error("wrong file");
    if (d.state) store.set("mj_state", d.state);
    store.set("mj_custom_staff", d.customStaff || []);
    store.set("mj_shiftlog", d.shiftLog || {});
    toast("Restored ✓ Reloading");
    setTimeout(() => location.reload(), 900);
  }).catch(() => {
    toast("That doesn't look like an MJ backup file");
    e.target.value = "";
  });
});

document.querySelectorAll("#style-chips .chip").forEach((b) => {
  b.setAttribute("aria-pressed", String(b.dataset.style === state.pickupStyle));
  b.addEventListener("click", () => {
    state.pickupStyle = b.dataset.style;
    document.querySelectorAll("#style-chips .chip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
    persist();
    rebuildIfBuilt();
  });
});

renderVenues();
renderDates();
renderCrew();
renderDrivers();
renderMath();
