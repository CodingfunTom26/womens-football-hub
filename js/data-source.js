// DATA LAYER
// The only file that knows where match data comes from.
// Today it reads the demo data in js/demo-data.js.
// To connect a real API later, rewrite the public functions at the bottom
// (getLeagues, getMatches, getStandings, getLiveCount) so they fetch from
// the provider and return the same shapes. The rest of the site only calls
// these functions, so it needs no changes.

window.DataSource = (() => {
  const D = window.DEMO_DATA;
  const MINUTE = 60000;
  const loadedAt = Date.now();

  // Local midnight of today + offset days
  function dateFor(offset) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + offset);
    return d;
  }

  function kickoffOf(m) {
    if (typeof m.kickoffInMin === "number") {
      return new Date(loadedAt + m.kickoffInMin * MINUTE);
    }
    const d = dateFor(m.day);
    const [h, min] = m.time.split(":").map(Number);
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), h, min));
  }

  // Simulated match clock: first half 45' + 2' stoppage, 15' break,
  // second half 45' + 4' stoppage.
  function clockOf(kickoff, now) {
    const e = (now - kickoff) / MINUTE;
    if (e < 0) return { status: "scheduled" };
    if (e < 47) {
      const c = Math.floor(e) + 1;
      return { status: "live", clock: Math.min(c, 45), label: c <= 45 ? `${c}'` : `45+${c - 45}'` };
    }
    if (e < 62) return { status: "live", clock: 45, label: "HT" };
    if (e < 111) {
      const c = 46 + Math.floor(e - 62);
      return { status: "live", clock: c, label: c <= 90 ? `${c}'` : `90+${c - 90}'` };
    }
    return { status: "ft", clock: Infinity };
  }

  const GOAL_TYPES = ["goal", "pen", "og"];

  function countGoals(events, maxMinute) {
    const score = { home: 0, away: 0 };
    events.forEach(e => {
      if (GOAL_TYPES.includes(e.type) && e.min <= maxMinute) score[e.side] += 1;
    });
    return score;
  }

  function team(id) {
    return { id, ...D.teams[id] };
  }

  function enrich(m, now) {
    const kickoff = kickoffOf(m);
    const c = clockOf(kickoff, now);
    const events = (m.events || [])
      .map(([min, type, side, player]) => ({ min, type, side, player }))
      .filter(e => c.status !== "scheduled" && e.min <= c.clock)
      .sort((a, b) => a.min - b.min);
    return {
      id: m.id,
      league: D.leagues.find(l => l.id === m.league),
      kickoff,
      status: c.status,            // "scheduled" | "live" | "ft"
      minuteLabel: c.label || "",  // e.g. "67'", "HT", "90+2'"
      clock: c.clock ?? 0,
      home: team(m.home),
      away: team(m.away),
      score: countGoals(events, Infinity),
      halfTimeScore: countGoals(events, 45),
      events
    };
  }

  // ---- Public functions (swap these for API calls later) ----

  async function getLeagues() {
    return D.leagues;
  }

  // day: -1 | 0 | 1, league: league id or "all"
  async function getMatches({ day, league }) {
    const now = Date.now();
    return D.matches
      .filter(m => m.day === day && (league === "all" || m.league === league))
      .map(m => enrich(m, now))
      .sort((a, b) => a.kickoff - b.kickoff);
  }

  async function getStandings(leagueId) {
    const rows = (D.standings[leagueId] || []).map(([id, w, d, l, gf, ga]) => ({
      team: team(id),
      played: w + d + l,
      won: w, drawn: d, lost: l,
      goalsFor: gf, goalsAgainst: ga,
      goalDiff: gf - ga,
      points: w * 3 + d
    }));
    rows.sort((a, b) =>
      b.points - a.points ||
      b.goalDiff - a.goalDiff ||
      b.goalsFor - a.goalsFor ||
      a.team.name.localeCompare(b.team.name));
    return rows.map((r, i) => ({ rank: i + 1, ...r }));
  }

  async function getLiveCount() {
    const today = await getMatches({ day: 0, league: "all" });
    return today.filter(m => m.status === "live").length;
  }

  return { dateFor, getLeagues, getMatches, getStandings, getLiveCount };
})();
