# Women's Football Hub

A website for women's football: live results from Europe's top leagues and the US league in one place.

## Status

Early development. Not yet live. The site currently runs on **demo data**: clubs are real, but every score, scorer, kick-off time and table position is a placeholder.

## Planned features

**Phase 1: Live results**
- Live scores, fixtures and final results
- League tables

**Phase 2: Fantasy football**
- Pick players and score points based on real match performance

## Leagues (planned)

| League | Country |
|---|---|
| Women's Super League | England |
| Liga F | Spain |
| Frauen-Bundesliga | Germany |
| Première Ligue | France |
| Serie A Femminile | Italy |
| NWSL | United States |

Coverage depends on available data sources.

## Run it

Open `index.html` in a web browser. No installation needed.

## Project structure

| File | Purpose |
|---|---|
| `index.html` | Page layout |
| `css/styles.css` | Colours, fonts and layout |
| `js/demo-data.js` | Placeholder leagues, teams, matches and tables |
| `js/data-source.js` | Data layer: the only file to change when connecting a real API |
| `js/app.js` | Draws the matches and tables pages |
| `images/flags/` | League country flags ([flag-icons](https://github.com/lipis/flag-icons), MIT licence) |

## Roadmap

- [x] Build site with demo data
- [ ] Select a match data provider (API)
- [ ] Connect the API in `js/data-source.js`
- [ ] Choose hosting and deploy
- [ ] Fantasy football
