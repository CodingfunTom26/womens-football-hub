// DEMO DATA
// Placeholder content for building the site. Team names are real clubs,
// but every score, scorer, kick-off time and table position is invented.
// Replace with a real data provider later (see js/data-source.js).
//
// Match fields:
//   day          -1 = yesterday, 0 = today, 1 = tomorrow
//   time         kick-off in UTC ("HH:MM"), for yesterday and tomorrow
//   kickoffInMin kick-off relative to when the page opens, in minutes,
//                for today (negative = already started)
//   events       [minute, type, side, player]
//                type: goal | pen | og | yellow | red
//                side: the team the event counts for (an own goal counts
//                      for the team that benefits)
//
// Standings rows: [teamId, won, drawn, lost, goalsFor, goalsAgainst]

window.DEMO_DATA = {
  leagues: [
    { id: "wsl",  name: "Women's Super League", code: "ENG", country: "England" },
    { id: "ligaf", name: "Liga F", code: "ESP", country: "Spain" },
    { id: "fbl",  name: "Frauen-Bundesliga", code: "GER", country: "Germany" },
    { id: "fra",  name: "Première Ligue", code: "FRA", country: "France" },
    { id: "ita",  name: "Serie A Femminile", code: "ITA", country: "Italy" },
    { id: "nwsl", name: "NWSL", code: "USA", country: "United States" }
  ],

  teams: {
    // England
    che: { name: "Chelsea", abbr: "CHE" },
    ars: { name: "Arsenal", abbr: "ARS" },
    mci: { name: "Manchester City", abbr: "MCI" },
    mun: { name: "Manchester United", abbr: "MUN" },
    avl: { name: "Aston Villa", abbr: "AVL" },
    liv: { name: "Liverpool", abbr: "LIV" },
    tot: { name: "Tottenham Hotspur", abbr: "TOT" },
    eve: { name: "Everton", abbr: "EVE" },
    // Spain
    bar: { name: "Barcelona", abbr: "BAR" },
    rma: { name: "Real Madrid", abbr: "RMA" },
    atm: { name: "Atlético Madrid", abbr: "ATM" },
    rso: { name: "Real Sociedad", abbr: "RSO" },
    ath: { name: "Athletic Club", abbr: "ATH" },
    sev: { name: "Sevilla", abbr: "SEV" },
    mcf: { name: "Madrid CFF", abbr: "MCF" },
    gra: { name: "Granada", abbr: "GRA" },
    // Germany
    fcb: { name: "Bayern Munich", abbr: "FCB" },
    wob: { name: "VfL Wolfsburg", abbr: "WOB" },
    sge: { name: "Eintracht Frankfurt", abbr: "SGE" },
    tsg: { name: "TSG Hoffenheim", abbr: "TSG" },
    b04: { name: "Bayer Leverkusen", abbr: "B04" },
    svw: { name: "Werder Bremen", abbr: "SVW" },
    scf: { name: "SC Freiburg", abbr: "SCF" },
    koe: { name: "1. FC Köln", abbr: "KOE" },
    // France
    ol:  { name: "Lyon", abbr: "OL" },
    psg: { name: "Paris Saint-Germain", abbr: "PSG" },
    pfc: { name: "Paris FC", abbr: "PFC" },
    fle: { name: "Fleury 91", abbr: "FLE" },
    mon: { name: "Montpellier", abbr: "MON" },
    dij: { name: "Dijon", abbr: "DIJ" },
    nan: { name: "Nantes", abbr: "NAN" },
    str: { name: "Strasbourg", abbr: "STR" },
    // Italy
    juv: { name: "Juventus", abbr: "JUV" },
    rom: { name: "Roma", abbr: "ROM" },
    int: { name: "Inter", abbr: "INT" },
    fio: { name: "Fiorentina", abbr: "FIO" },
    mil: { name: "AC Milan", abbr: "MIL" },
    sas: { name: "Sassuolo", abbr: "SAS" },
    com: { name: "Como", abbr: "COM" },
    laz: { name: "Lazio", abbr: "LAZ" },
    // United States
    orl: { name: "Orlando Pride", abbr: "ORL" },
    was: { name: "Washington Spirit", abbr: "WAS" },
    kc:  { name: "Kansas City Current", abbr: "KC" },
    por: { name: "Portland Thorns", abbr: "POR" },
    njy: { name: "Gotham FC", abbr: "NJY" },
    sd:  { name: "San Diego Wave", abbr: "SD" },
    nc:  { name: "North Carolina Courage", abbr: "NC" },
    sea: { name: "Seattle Reign", abbr: "SEA" }
  },

  matches: [
    // England
    { id: "wsl-1", league: "wsl", day: -1, time: "18:45", home: "ars", away: "avl",
      events: [[23, "goal", "home", "M. Holloway"], [51, "goal", "away", "R. Okafor"],
               [64, "yellow", "away", "C. Weir"], [78, "goal", "home", "L. Brandt"]] },
    { id: "wsl-2", league: "wsl", day: 0, kickoffInMin: -38, home: "che", away: "mci",
      events: [[12, "goal", "away", "S. Lindqvist"], [31, "goal", "home", "A. Moreau"],
               [40, "yellow", "home", "J. Price"], [70, "goal", "home", "A. Moreau"],
               [88, "yellow", "away", "K. Ito"]] },
    { id: "wsl-3", league: "wsl", day: 0, kickoffInMin: 150, home: "mun", away: "liv" },
    { id: "wsl-4", league: "wsl", day: 1, time: "13:00", home: "tot", away: "eve" },

    // Spain
    { id: "ligaf-1", league: "ligaf", day: -1, time: "17:00", home: "rma", away: "atm",
      events: [[35, "goal", "away", "I. Ferrer"], [59, "yellow", "away", "P. Navas"],
               [72, "pen", "home", "N. Castell"]] },
    { id: "ligaf-2", league: "ligaf", day: 0, kickoffInMin: -82, home: "bar", away: "rso",
      events: [[9, "goal", "home", "E. Vidal"], [27, "goal", "home", "C. Soler"],
               [55, "goal", "away", "J. Etxeberria"], [61, "goal", "home", "E. Vidal"],
               [74, "yellow", "away", "A. Zubia"], [84, "goal", "home", "M. Roig"]] },
    { id: "ligaf-3", league: "ligaf", day: 1, time: "11:00", home: "mcf", away: "gra" },
    { id: "ligaf-4", league: "ligaf", day: 1, time: "17:00", home: "ath", away: "sev" },

    // Germany
    { id: "fbl-1", league: "fbl", day: -1, time: "16:30", home: "wob", away: "fcb",
      events: [[44, "goal", "away", "L. Hartmann"], [67, "og", "away", "T. Becker"],
               [81, "red", "home", "F. Wagner"]] },
    { id: "fbl-2", league: "fbl", day: 0, kickoffInMin: -200, home: "sge", away: "tsg",
      events: [[15, "goal", "home", "J. Krüger"], [38, "goal", "away", "S. Wolff"],
               [57, "goal", "home", "N. Schulz"], [70, "yellow", "away", "M. Brandl"],
               [89, "pen", "home", "J. Krüger"]] },
    { id: "fbl-3", league: "fbl", day: 0, kickoffInMin: 60, home: "b04", away: "svw" },
    { id: "fbl-4", league: "fbl", day: 1, time: "14:00", home: "scf", away: "koe" },

    // France
    { id: "fra-1", league: "fra", day: -1, time: "19:00", home: "psg", away: "pfc",
      events: [[18, "goal", "home", "I. Diallo"], [49, "goal", "away", "C. Lambert"],
               [86, "goal", "away", "A. Mercier"]] },
    { id: "fra-2", league: "fra", day: 0, kickoffInMin: -20, home: "ol", away: "mon",
      events: [[6, "goal", "home", "L. Bernard"], [33, "goal", "home", "E. Fontaine"],
               [58, "goal", "away", "M. Girard"], [77, "yellow", "away", "S. Roux"]] },
    { id: "fra-3", league: "fra", day: 1, time: "15:30", home: "fle", away: "dij" },
    { id: "fra-4", league: "fra", day: 1, time: "18:00", home: "nan", away: "str" },

    // Italy
    { id: "ita-1", league: "ita", day: -1, time: "14:30", home: "rom", away: "juv",
      events: [[11, "goal", "away", "G. Ricci"], [29, "goal", "home", "F. Marino"],
               [52, "yellow", "home", "A. Conti"], [63, "goal", "home", "V. Greco"],
               [90, "goal", "away", "C. Bruno"]] },
    { id: "ita-2", league: "ita", day: 0, kickoffInMin: 120, home: "int", away: "fio" },
    { id: "ita-3", league: "ita", day: 1, time: "12:30", home: "mil", away: "laz" },
    { id: "ita-4", league: "ita", day: 1, time: "15:00", home: "sas", away: "com" },

    // United States
    { id: "nwsl-1", league: "nwsl", day: -1, time: "23:00", home: "kc", away: "sea",
      events: [[8, "goal", "home", "T. Rivers"], [54, "goal", "home", "J. Hayes"],
               [61, "yellow", "away", "D. Cole"], [76, "goal", "home", "T. Rivers"]] },
    { id: "nwsl-2", league: "nwsl", day: 0, kickoffInMin: 240, home: "was", away: "njy" },
    { id: "nwsl-3", league: "nwsl", day: 0, kickoffInMin: 300, home: "por", away: "orl" },
    { id: "nwsl-4", league: "nwsl", day: 1, time: "23:00", home: "sd", away: "nc" }
  ],

  standings: {
    wsl: [["che", 5, 1, 0, 14, 3], ["ars", 4, 1, 1, 12, 5], ["mci", 4, 0, 2, 11, 6],
          ["mun", 3, 2, 1, 9, 5], ["avl", 2, 1, 3, 7, 9], ["liv", 1, 2, 3, 5, 10],
          ["tot", 1, 1, 4, 4, 11], ["eve", 0, 2, 4, 3, 16]],
    ligaf: [["bar", 6, 0, 0, 22, 3], ["rma", 4, 1, 1, 13, 6], ["atm", 3, 2, 1, 10, 6],
            ["rso", 3, 1, 2, 9, 8], ["ath", 2, 2, 2, 7, 7], ["sev", 2, 1, 3, 6, 9],
            ["mcf", 1, 1, 4, 5, 13], ["gra", 0, 2, 4, 3, 13]],
    fbl: [["fcb", 5, 1, 0, 16, 2], ["wob", 4, 1, 1, 12, 5], ["sge", 4, 0, 2, 13, 8],
          ["tsg", 3, 1, 2, 10, 8], ["b04", 2, 2, 2, 8, 8], ["svw", 1, 2, 3, 6, 11],
          ["scf", 1, 1, 4, 5, 12], ["koe", 0, 2, 4, 3, 13]],
    fra: [["ol", 6, 0, 0, 20, 2], ["psg", 4, 1, 1, 13, 5], ["pfc", 4, 1, 1, 11, 6],
          ["fle", 2, 2, 2, 7, 8], ["mon", 2, 1, 3, 6, 9], ["dij", 2, 0, 4, 6, 11],
          ["nan", 1, 2, 3, 4, 10], ["str", 0, 1, 5, 3, 19]],
    ita: [["juv", 4, 2, 0, 12, 4], ["rom", 4, 1, 1, 11, 5], ["int", 3, 2, 1, 9, 6],
          ["fio", 3, 1, 2, 9, 7], ["mil", 2, 1, 3, 7, 9], ["sas", 1, 2, 3, 5, 9],
          ["com", 1, 1, 4, 4, 11], ["laz", 1, 0, 5, 4, 12]],
    nwsl: [["orl", 15, 5, 4, 38, 17], ["was", 14, 6, 4, 41, 22], ["kc", 13, 6, 5, 40, 24],
           ["por", 11, 7, 6, 33, 26], ["njy", 9, 7, 8, 29, 28], ["sd", 8, 6, 10, 27, 31],
           ["nc", 6, 6, 12, 22, 35], ["sea", 4, 5, 15, 19, 42]]
  }
};
