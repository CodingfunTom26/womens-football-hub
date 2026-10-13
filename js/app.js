// APP
// Draws the pages. Gets all data through window.DataSource.

(() => {
  const $ = sel => document.querySelector(sel);
  const state = { view: "matches", day: 0, league: "all", tableLeague: "wsl", open: new Set() };

  // Remember the viewer's last filters (optional; ignored if storage is blocked)
  try {
    const saved = JSON.parse(localStorage.getItem("wfh-prefs") || "{}");
    if (saved.league) state.league = saved.league;
    if (saved.tableLeague) state.tableLeague = saved.tableLeague;
  } catch (e) { /* storage unavailable */ }

  function savePrefs() {
    try {
      localStorage.setItem("wfh-prefs", JSON.stringify({ league: state.league, tableLeague: state.tableLeague }));
    } catch (e) { /* storage unavailable */ }
  }

  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtTime = d => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const fmtDay = d => d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });

  let leagues = [];

  // ---------- Shared pieces ----------

  function leagueHead(l, extra = "") {
    return `<header class="league-head">
      <span class="league-code">${esc(l.code)}</span>
      <h2 class="league-name">${esc(l.name)}</h2>
      ${extra}
    </header>`;
  }

  function crest(t) {
    return `<span class="crest" aria-hidden="true">${esc(t.abbr)}</span>`;
  }

  const BALL = `<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 5.1l2.6 1.9-1 3H6.4l-1-3z" fill="currentColor"/></svg>`;
  const CHEVRON = `<svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // ---------- Matches ----------

  function renderDays() {
    const days = [[-1, "Yesterday"], [0, "Today"], [1, "Tomorrow"]];
    $("#days").innerHTML = days.map(([offset, label]) =>
      `<button type="button" class="day" data-day="${offset}" aria-pressed="${state.day === offset}">
        <span class="day-label">${label}</span>
        <span class="day-date">${fmtDay(DataSource.dateFor(offset))}</span>
      </button>`).join("");
  }

  function renderLeagueChips() {
    const items = [{ id: "all", name: "All leagues" }, ...leagues];
    $("#league-chips").innerHTML = items.map(l =>
      `<button type="button" class="chip" data-league="${l.id}" aria-pressed="${state.league === l.id}">
        ${l.code ? `<span class="chip-code">${esc(l.code)}</span>` : ""}${esc(l.name)}
      </button>`).join("");
  }

  function statusCell(m) {
    if (m.status === "live") {
      return `<span class="st st-live"><span class="dot" aria-hidden="true"></span>${esc(m.minuteLabel)}</span>`;
    }
    if (m.status === "ft") return `<span class="st st-ft">FT</span>`;
    return `<span class="st st-sched">${fmtTime(m.kickoff)}</span>`;
  }

  function eventSide(e) {
    const isGoal = ["goal", "pen", "og"].includes(e.type);
    const icon = isGoal ? BALL : `<span class="card card-${e.type === "red" ? "r" : "y"}" aria-hidden="true"></span>`;
    const kind = { goal: "Goal", pen: "Penalty goal", og: "Own goal", yellow: "Yellow card", red: "Red card" }[e.type];
    const note = e.type === "pen" ? " <span class=\"ev-note\">pen</span>" : e.type === "og" ? " <span class=\"ev-note\">OG</span>" : "";
    return `<span class="ev ev-${isGoal ? "goal" : "card"}"><span class="sr">${kind}: </span>${icon}<span class="ev-player">${esc(e.player)}${note}</span></span>`;
  }

  function eventsHtml(m) {
    if (!m.events.length) return `<p class="ev-empty">No events yet.</p>`;
    const rows = [];
    let htShown = false;
    m.events.forEach(e => {
      if (!htShown && e.min > 45 && m.clock > 45) {
        rows.push(htRow(m));
        htShown = true;
      }
      rows.push(`<li class="ev-row">
        <span class="ev-home">${e.side === "home" ? eventSide(e) : ""}</span>
        <span class="ev-min">${e.min}'</span>
        <span class="ev-away">${e.side === "away" ? eventSide(e) : ""}</span>
      </li>`);
    });
    if (!htShown && m.clock >= 45 && m.status !== "scheduled") rows.push(htRow(m));
    return `<ol class="ev-list">${rows.join("")}</ol>`;
  }

  function htRow(m) {
    return `<li class="ev-ht"><span>Half-time ${m.halfTimeScore.home}–${m.halfTimeScore.away}</span></li>`;
  }

  function matchItem(m) {
    const expandable = m.status !== "scheduled";
    const open = expandable && state.open.has(m.id);
    const homeWin = m.status === "ft" && m.score.home > m.score.away;
    const awayWin = m.status === "ft" && m.score.away > m.score.home;
    const team = (t, win) =>
      `<span class="team${win ? " win" : ""}">${crest(t)}<span class="tname">${esc(t.name)}</span></span>`;
    const scores = m.status === "scheduled" ? "" :
      `<span class="sc${homeWin ? " win" : ""}">${m.score.home}</span><span class="sc${awayWin ? " win" : ""}">${m.score.away}</span>`;
    const row = `${statusCell(m)}
      <span class="teams">${team(m.home, homeWin)}${team(m.away, awayWin)}</span>
      <span class="scores">${scores}</span>
      ${expandable ? CHEVRON : `<span class="chev-space"></span>`}`;

    return `<li class="match is-${m.status}">
      ${expandable
        ? `<button type="button" class="match-row" data-id="${m.id}" aria-expanded="${open}" aria-controls="ev-${m.id}">${row}</button>
           <div class="events" id="ev-${m.id}"${open ? "" : " hidden"}>${eventsHtml(m)}</div>`
        : `<div class="match-row">${row}</div>`}
    </li>`;
  }

  async function renderMatches() {
    const focusedId = document.activeElement?.dataset?.id;
    const matches = await DataSource.getMatches({ day: state.day, league: state.league });
    const list = $("#match-list");

    if (!matches.length) {
      const name = state.league === "all" ? "any league" : leagues.find(l => l.id === state.league).name;
      list.innerHTML = `<div class="empty"><p class="empty-title">No matches</p><p>Nothing scheduled for ${esc(name)} on this day. Try another day or league.</p></div>`;
      return;
    }

    const groups = leagues
      .map(l => ({ league: l, matches: matches.filter(m => m.league.id === l.id) }))
      .filter(g => g.matches.length);

    list.innerHTML = groups.map(g => {
      const live = g.matches.filter(m => m.status === "live").length;
      const badge = live ? `<span class="live-badge">${live} live</span>` : "";
      return `<section class="league-card">
        ${leagueHead(g.league, badge)}
        <ul class="matches">${g.matches.map(matchItem).join("")}</ul>
      </section>`;
    }).join("");

    if (focusedId) document.querySelector(`[data-id="${focusedId}"]`)?.focus();
  }

  async function renderLiveCount() {
    const n = await DataSource.getLiveCount();
    const el = $("#live-count");
    el.hidden = n === 0;
    el.textContent = `${n} live`;
  }

  // ---------- Tables ----------

  function renderTableChips() {
    $("#table-chips").innerHTML = leagues.map(l =>
      `<button type="button" class="chip" data-table="${l.id}" aria-pressed="${state.tableLeague === l.id}">
        <span class="chip-code">${esc(l.code)}</span>${esc(l.name)}
      </button>`).join("");
  }

  async function renderTable() {
    const l = leagues.find(x => x.id === state.tableLeague);
    const rows = await DataSource.getStandings(l.id);
    const gd = n => (n > 0 ? `+${n}` : `${n}`);
    $("#table-card").innerHTML = `<section class="league-card">
      ${leagueHead(l, `<span class="league-country">${esc(l.country)}</span>`)}
      <div class="table-scroll">
        <table class="standings">
          <thead><tr>
            <th scope="col" class="num">#</th>
            <th scope="col" class="team-col">Team</th>
            <th scope="col" class="num"><abbr title="Played">P</abbr></th>
            <th scope="col" class="num"><abbr title="Won">W</abbr></th>
            <th scope="col" class="num"><abbr title="Drawn">D</abbr></th>
            <th scope="col" class="num"><abbr title="Lost">L</abbr></th>
            <th scope="col" class="num"><abbr title="Goal difference">GD</abbr></th>
            <th scope="col" class="num"><abbr title="Points">Pts</abbr></th>
          </tr></thead>
          <tbody>${rows.map(r => `<tr>
            <td class="num rank">${r.rank}</td>
            <th scope="row" class="team-col"><span class="team">${crest(r.team)}<span class="tname">${esc(r.team.name)}</span></span></th>
            <td class="num">${r.played}</td>
            <td class="num">${r.won}</td>
            <td class="num">${r.drawn}</td>
            <td class="num">${r.lost}</td>
            <td class="num">${gd(r.goalDiff)}</td>
            <td class="num pts">${r.points}</td>
          </tr>`).join("")}</tbody>
        </table>
      </div>
    </section>`;
  }

  // ---------- Views ----------

  function showView(view) {
    state.view = view;
    document.querySelectorAll("[data-view]").forEach(b => b.setAttribute("aria-selected", b.dataset.view === view));
    $("#view-matches").hidden = view !== "matches";
    $("#view-tables").hidden = view !== "tables";
  }

  document.addEventListener("click", e => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.view) {
      showView(t.dataset.view);
    } else if (t.dataset.day) {
      state.day = Number(t.dataset.day);
      renderDays();
      renderMatches();
    } else if (t.dataset.league) {
      state.league = t.dataset.league;
      savePrefs();
      renderLeagueChips();
      renderMatches();
    } else if (t.dataset.table) {
      state.tableLeague = t.dataset.table;
      savePrefs();
      renderTableChips();
      renderTable();
    } else if (t.dataset.id) {
      const id = t.dataset.id;
      const open = !state.open.has(id);
      open ? state.open.add(id) : state.open.delete(id);
      t.setAttribute("aria-expanded", open);
      document.getElementById(`ev-${id}`).hidden = !open;
    }
  });

  async function start() {
    leagues = await DataSource.getLeagues();
    if (!leagues.some(l => l.id === state.tableLeague)) state.tableLeague = leagues[0].id;
    if (state.league !== "all" && !leagues.some(l => l.id === state.league)) state.league = "all";
    renderDays();
    renderLeagueChips();
    renderTableChips();
    await Promise.all([renderMatches(), renderTable(), renderLiveCount()]);

    // Refresh live minutes and scores every 20 seconds
    setInterval(() => {
      renderLiveCount();
      if (state.day === 0) renderMatches();
    }, 20000);
  }

  start();
})();
