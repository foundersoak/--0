import type { NhlPlayer } from "./nhl-players";

// Modern-era depth pack: recognizable real players so contender franchises
// offer real choice on a spin. Merged + deduped by scripts/etl/nhl.ts.
//
// STAT CONVENTION: per-season PEAK (one representative great, era-realistic
// season), NOT career totals. Skaters { g, a, p, pm } with p ~= g + a;
// goalies { w, svp, gaa, so }. Ratings 78-93 (stars to very good regulars);
// 95-99 GOAT tier is reserved for the base pool.
export const NHL_PLAYERS_EXTRA: NhlPlayer[] = [
  // =========================================================================
  // 2020s — the primary gap. Build ~5-6 deep on each contender, real lines.
  // =========================================================================

  // --- Edmonton Oilers (McDavid C exists) ---
  { name: "Leon Draisaitl", team: "oilers", era: "2020s", pos: "C", stats: { g: 52, a: 58, p: 110, pm: 20 }, rating: 91, notable: "Hart MVP, Rocket Richard" },
  { name: "Zach Hyman", team: "oilers", era: "2020s", pos: "LW", stats: { g: 54, a: 23, p: 77, pm: 12 }, rating: 83, notable: "54-goal season" },
  { name: "Ryan Nugent-Hopkins", team: "oilers", era: "2020s", pos: "C", stats: { g: 18, a: 60, p: 78, pm: 10 }, rating: 80, notable: "Top-six pivot" },
  { name: "Evan Bouchard", team: "oilers", era: "2020s", pos: "D", stats: { g: 18, a: 64, p: 82, pm: 25 }, rating: 83, notable: "Power-play QB" },
  { name: "Stuart Skinner", team: "oilers", era: "2020s", pos: "G", stats: { w: 36, svp: 0.914, gaa: 2.62, so: 4 }, rating: 80, notable: "Cup-final starter" },

  // --- Colorado Avalanche (MacKinnon C, Rantanen RW, Makar D exist) ---
  { name: "Gabriel Landeskog", team: "avalanche", era: "2020s", pos: "LW", stats: { g: 30, a: 29, p: 59, pm: 30 }, rating: 84, notable: "Cup-winning captain" },
  { name: "Valeri Nichushkin", team: "avalanche", era: "2020s", pos: "RW", stats: { g: 28, a: 26, p: 54, pm: 24 }, rating: 82, notable: "Two-way scoring winger" },
  { name: "Devon Toews", team: "avalanche", era: "2020s", pos: "D", stats: { g: 13, a: 44, p: 57, pm: 52 }, rating: 84, notable: "Shutdown partner to Makar" },
  { name: "Alexandar Georgiev", team: "avalanche", era: "2020s", pos: "G", stats: { w: 40, svp: 0.918, gaa: 2.53, so: 4 }, rating: 81, notable: "40-win workhorse" },

  // --- Florida Panthers (Tkachuk LW, Bobrovsky G exist) ---
  { name: "Aleksander Barkov", team: "panthers", era: "2020s", pos: "C", stats: { g: 26, a: 53, p: 79, pm: 26 }, rating: 89, notable: "Selke, Cup-winning captain" },
  { name: "Sam Reinhart", team: "panthers", era: "2020s", pos: "RW", stats: { g: 57, a: 37, p: 94, pm: 18 }, rating: 86, notable: "57-goal season, Cup" },
  { name: "Sam Bennett", team: "panthers", era: "2020s", pos: "C", stats: { g: 28, a: 23, p: 51, pm: 14 }, rating: 82, notable: "Conn Smythe playoff driver" },
  { name: "Gustav Forsling", team: "panthers", era: "2020s", pos: "D", stats: { g: 10, a: 35, p: 45, pm: 56 }, rating: 84, notable: "Norris-caliber shutdown D" },
  { name: "Aaron Ekblad", team: "panthers", era: "2020s", pos: "D", stats: { g: 11, a: 34, p: 45, pm: 22 }, rating: 82, notable: "Top-pair anchor, Cup" },

  // --- Toronto Maple Leafs (Matthews C, Marner RW exist) ---
  { name: "William Nylander", team: "mapleleafs", era: "2020s", pos: "RW", stats: { g: 40, a: 58, p: 98, pm: 18 }, rating: 86, notable: "40-goal sniper" },
  { name: "John Tavares", team: "mapleleafs", era: "2020s", pos: "C", stats: { g: 36, a: 39, p: 75, pm: 10 }, rating: 84, notable: "Captain, perennial scorer" },
  { name: "Morgan Rielly", team: "mapleleafs", era: "2020s", pos: "D", stats: { g: 8, a: 64, p: 72, pm: 12 }, rating: 83, notable: "Offensive No. 1 D" },
  { name: "Joseph Woll", team: "mapleleafs", era: "2020s", pos: "G", stats: { w: 27, svp: 0.916, gaa: 2.59, so: 3 }, rating: 79, notable: "Playoff starter" },

  // --- Tampa Bay Lightning (Kucherov RW, Hedman D, Vasilevskiy G exist) ---
  { name: "Brayden Point", team: "lightning", era: "2020s", pos: "C", stats: { g: 46, a: 44, p: 90, pm: 16 }, rating: 87, notable: "2x Cup, clutch scorer" },
  { name: "Steven Stamkos", team: "lightning", era: "2020s", pos: "C", stats: { g: 42, a: 40, p: 82, pm: 12 }, rating: 86, notable: "2x Cup captain, sniper" },

  // --- New York Rangers (Panarin LW, Fox D, Shesterkin G exist) ---
  { name: "Mika Zibanejad", team: "rangers", era: "2020s", pos: "C", stats: { g: 39, a: 52, p: 91, pm: 15 }, rating: 85, notable: "Top-line center" },
  { name: "Vincent Trocheck", team: "rangers", era: "2020s", pos: "C", stats: { g: 26, a: 51, p: 77, pm: 20 }, rating: 82, notable: "Two-way middle-six C" },
  { name: "Chris Kreider", team: "rangers", era: "2020s", pos: "LW", stats: { g: 52, a: 23, p: 75, pm: 20 }, rating: 84, notable: "52-goal power forward" },

  // --- Boston Bruins (Marchand LW, Pastrnak RW, McAvoy D exist) ---
  { name: "Patrice Bergeron", team: "bruins", era: "2020s", pos: "C", stats: { g: 27, a: 38, p: 65, pm: 27 }, rating: 88, notable: "Record 6x Selke, captain" },
  { name: "Jeremy Swayman", team: "bruins", era: "2020s", pos: "G", stats: { w: 25, svp: 0.916, gaa: 2.53, so: 3 }, rating: 84, notable: "Franchise No. 1 goalie" },

  // --- Vegas Golden Knights (Eichel C, Stone RW exist) ---
  { name: "William Karlsson", team: "goldenknights", era: "2020s", pos: "C", stats: { g: 25, a: 35, p: 60, pm: 18 }, rating: 81, notable: "Two-way pivot, Cup" },
  { name: "Jonathan Marchessault", team: "goldenknights", era: "2020s", pos: "RW", stats: { g: 28, a: 30, p: 58, pm: 12 }, rating: 83, notable: "Conn Smythe, Cup" },
  { name: "Shea Theodore", team: "goldenknights", era: "2020s", pos: "D", stats: { g: 13, a: 39, p: 52, pm: 20 }, rating: 83, notable: "Offensive No. 1 D, Cup" },
  { name: "Alex Pietrangelo", team: "goldenknights", era: "2020s", pos: "D", stats: { g: 8, a: 41, p: 49, pm: 25 }, rating: 83, notable: "Top-pair anchor, Cup" },
  { name: "Adin Hill", team: "goldenknights", era: "2020s", pos: "G", stats: { w: 30, svp: 0.918, gaa: 2.49, so: 3 }, rating: 80, notable: "2023 Cup run starter" },

  // --- Dallas Stars (Oettinger G exists) ---
  { name: "Jason Robertson", team: "stars", era: "2020s", pos: "LW", stats: { g: 46, a: 63, p: 109, pm: 22 }, rating: 87, notable: "46-goal top winger" },
  { name: "Roope Hintz", team: "stars", era: "2020s", pos: "C", stats: { g: 37, a: 38, p: 75, pm: 24 }, rating: 84, notable: "Top-line center" },
  { name: "Miro Heiskanen", team: "stars", era: "2020s", pos: "D", stats: { g: 11, a: 62, p: 73, pm: 22 }, rating: 87, notable: "No. 1 minutes-eating D" },
  { name: "Wyatt Johnston", team: "stars", era: "2020s", pos: "C", stats: { g: 32, a: 33, p: 65, pm: 18 }, rating: 81, notable: "Young top-six scorer" },

  // --- Winnipeg Jets (Hellebuyck G exists) ---
  { name: "Kyle Connor", team: "jets", era: "2020s", pos: "LW", stats: { g: 47, a: 46, p: 93, pm: 20 }, rating: 86, notable: "Elite goal-scoring winger" },
  { name: "Mark Scheifele", team: "jets", era: "2020s", pos: "C", stats: { g: 36, a: 36, p: 72, pm: 16 }, rating: 84, notable: "No. 1 center" },
  { name: "Josh Morrissey", team: "jets", era: "2020s", pos: "D", stats: { g: 16, a: 60, p: 76, pm: 20 }, rating: 85, notable: "Offensive No. 1 D" },
  { name: "Nikolaj Ehlers", team: "jets", era: "2020s", pos: "LW", stats: { g: 25, a: 36, p: 61, pm: 18 }, rating: 82, notable: "Dynamic skating winger" },

  // --- Carolina Hurricanes ---
  { name: "Sebastian Aho", team: "hurricanes", era: "2020s", pos: "C", stats: { g: 36, a: 53, p: 89, pm: 26 }, rating: 86, notable: "No. 1 center" },
  { name: "Andrei Svechnikov", team: "hurricanes", era: "2020s", pos: "RW", stats: { g: 30, a: 39, p: 69, pm: 18 }, rating: 84, notable: "Power forward sniper" },
  { name: "Jaccob Slavin", team: "hurricanes", era: "2020s", pos: "D", stats: { g: 7, a: 41, p: 48, pm: 40 }, rating: 85, notable: "Lady Byng, elite shutdown D" },
  { name: "Brent Burns", team: "hurricanes", era: "2020s", pos: "D", stats: { g: 18, a: 43, p: 61, pm: 20 }, rating: 83, notable: "Veteran offensive D" },
  { name: "Frederik Andersen", team: "hurricanes", era: "2020s", pos: "G", stats: { w: 35, svp: 0.922, gaa: 2.18, so: 4 }, rating: 83, notable: "League-best save% season" },

  // --- New Jersey Devils ---
  { name: "Jack Hughes", team: "devils", era: "2020s", pos: "C", stats: { g: 43, a: 56, p: 99, pm: 22 }, rating: 89, notable: "Franchise No. 1 center" },
  { name: "Nico Hischier", team: "devils", era: "2020s", pos: "C", stats: { g: 31, a: 49, p: 80, pm: 25 }, rating: 85, notable: "Selke-caliber captain" },
  { name: "Jesper Bratt", team: "devils", era: "2020s", pos: "LW", stats: { g: 27, a: 56, p: 83, pm: 20 }, rating: 84, notable: "Top-line playmaker" },
  { name: "Dougie Hamilton", team: "devils", era: "2020s", pos: "D", stats: { g: 22, a: 52, p: 74, pm: 18 }, rating: 84, notable: "Offensive No. 1 D" },
  { name: "Timo Meier", team: "devils", era: "2020s", pos: "RW", stats: { g: 35, a: 31, p: 66, pm: 15 }, rating: 83, notable: "Power-forward scorer" },

  // --- Seattle Kraken ---
  { name: "Matty Beniers", team: "kraken", era: "2020s", pos: "C", stats: { g: 24, a: 33, p: 57, pm: 14 }, rating: 81, notable: "Calder winner, No. 1 C" },
  { name: "Jared McCann", team: "kraken", era: "2020s", pos: "LW", stats: { g: 40, a: 30, p: 70, pm: 20 }, rating: 82, notable: "40-goal scorer" },
  { name: "Vince Dunn", team: "kraken", era: "2020s", pos: "D", stats: { g: 14, a: 50, p: 64, pm: 24 }, rating: 83, notable: "Offensive No. 1 D" },
  { name: "Jordan Eberle", team: "kraken", era: "2020s", pos: "RW", stats: { g: 28, a: 35, p: 63, pm: 16 }, rating: 80, notable: "Veteran scoring winger, captain" },
  { name: "Philipp Grubauer", team: "kraken", era: "2020s", pos: "G", stats: { w: 30, svp: 0.917, gaa: 2.55, so: 4 }, rating: 79, notable: "No. 1 goalie" },

  // --- Pittsburgh Penguins (Crosby C exists) ---
  { name: "Evgeni Malkin", team: "penguins", era: "2020s", pos: "C", stats: { g: 27, a: 56, p: 83, pm: 15 }, rating: 86, notable: "Hall-of-Fame center" },
  { name: "Kris Letang", team: "penguins", era: "2020s", pos: "D", stats: { g: 10, a: 51, p: 61, pm: 12 }, rating: 84, notable: "No. 1 offensive D" },
  { name: "Jake Guentzel", team: "penguins", era: "2020s", pos: "LW", stats: { g: 40, a: 44, p: 84, pm: 18 }, rating: 85, notable: "40-goal top-line winger" },
  { name: "Rickard Rakell", team: "penguins", era: "2020s", pos: "RW", stats: { g: 35, a: 35, p: 70, pm: 14 }, rating: 80, notable: "Scoring winger" },

  // --- Washington Capitals (Ovechkin exists) ---
  { name: "Dylan Strome", team: "capitals", era: "2020s", pos: "C", stats: { g: 27, a: 52, p: 79, pm: 12 }, rating: 81, notable: "No. 1 center" },
  { name: "John Carlson", team: "capitals", era: "2020s", pos: "D", stats: { g: 13, a: 50, p: 63, pm: 16 }, rating: 83, notable: "Offensive No. 1 D" },
  { name: "Tom Wilson", team: "capitals", era: "2020s", pos: "RW", stats: { g: 33, a: 32, p: 65, pm: 18 }, rating: 81, notable: "Power forward" },

  // --- Vancouver Canucks (Quinn Hughes D exists) ---
  { name: "Elias Pettersson", team: "canucks", era: "2020s", pos: "C", stats: { g: 39, a: 50, p: 89, pm: 28 }, rating: 86, notable: "No. 1 center" },
  { name: "J.T. Miller", team: "canucks", era: "2020s", pos: "C", stats: { g: 37, a: 66, p: 103, pm: 24 }, rating: 85, notable: "103-point season" },
  { name: "Brock Boeser", team: "canucks", era: "2020s", pos: "RW", stats: { g: 40, a: 33, p: 73, pm: 16 }, rating: 82, notable: "40-goal sniper" },
  { name: "Thatcher Demko", team: "canucks", era: "2020s", pos: "G", stats: { w: 35, svp: 0.918, gaa: 2.45, so: 5 }, rating: 84, notable: "Vezina finalist" },

  // --- Minnesota Wild (Kaprizov LW exists) ---
  { name: "Matt Boldy", team: "wild", era: "2020s", pos: "LW", stats: { g: 31, a: 38, p: 69, pm: 12 }, rating: 82, notable: "Top-line scorer" },
  { name: "Joel Eriksson Ek", team: "wild", era: "2020s", pos: "C", stats: { g: 30, a: 31, p: 61, pm: 24 }, rating: 83, notable: "Selke-caliber two-way C" },
  { name: "Jared Spurgeon", team: "wild", era: "2020s", pos: "D", stats: { g: 9, a: 34, p: 43, pm: 22 }, rating: 81, notable: "No. 1 minutes D, captain" },
  { name: "Filip Gustavsson", team: "wild", era: "2020s", pos: "G", stats: { w: 31, svp: 0.931, gaa: 2.10, so: 4 }, rating: 82, notable: "Elite save% season" },

  // --- Nashville Predators (Josi D exists) ---
  { name: "Filip Forsberg", team: "predators", era: "2020s", pos: "LW", stats: { g: 48, a: 36, p: 84, pm: 20 }, rating: 85, notable: "48-goal franchise scorer" },
  { name: "Juuse Saros", team: "predators", era: "2020s", pos: "G", stats: { w: 36, svp: 0.919, gaa: 2.59, so: 5 }, rating: 85, notable: "Vezina-finalist workhorse" },
  { name: "Ryan O'Reilly", team: "predators", era: "2020s", pos: "C", stats: { g: 26, a: 43, p: 69, pm: 12 }, rating: 81, notable: "Selke/Conn Smythe veteran C" },

  // --- Buffalo Sabres ---
  { name: "Tage Thompson", team: "sabres", era: "2020s", pos: "C", stats: { g: 47, a: 47, p: 94, pm: 8 }, rating: 85, notable: "47-goal power center" },
  { name: "Rasmus Dahlin", team: "sabres", era: "2020s", pos: "D", stats: { g: 20, a: 53, p: 73, pm: 5 }, rating: 85, notable: "No. 1 offensive D" },
  { name: "Alex Tuch", team: "sabres", era: "2020s", pos: "RW", stats: { g: 36, a: 43, p: 79, pm: 8 }, rating: 82, notable: "Power-forward scorer" },

  // --- Montreal Canadiens ---
  { name: "Nick Suzuki", team: "canadiens", era: "2020s", pos: "C", stats: { g: 30, a: 59, p: 89, pm: 12 }, rating: 84, notable: "Captain, No. 1 center" },
  { name: "Cole Caufield", team: "canadiens", era: "2020s", pos: "RW", stats: { g: 37, a: 33, p: 70, pm: 8 }, rating: 83, notable: "Sniper" },
  { name: "Lane Hutson", team: "canadiens", era: "2020s", pos: "D", stats: { g: 6, a: 60, p: 66, pm: 6 }, rating: 83, notable: "Calder-caliber offensive D" },

  // --- Ottawa Senators ---
  { name: "Tim Stutzle", team: "senators", era: "2020s", pos: "C", stats: { g: 39, a: 51, p: 90, pm: 8 }, rating: 84, notable: "No. 1 center" },
  { name: "Brady Tkachuk", team: "senators", era: "2020s", pos: "LW", stats: { g: 37, a: 35, p: 72, pm: 6 }, rating: 84, notable: "Power-forward captain" },
  { name: "Jake Sanderson", team: "senators", era: "2020s", pos: "D", stats: { g: 11, a: 46, p: 57, pm: 12 }, rating: 82, notable: "No. 1 two-way D" },

  // =========================================================================
  // 2010s — deepen the dynasties and contenders of the decade.
  // =========================================================================

  // --- Chicago Blackhawks (Kane RW, Keith D exist) — the dynasty core ---
  { name: "Jonathan Toews", team: "blackhawks", era: "2010s", pos: "C", stats: { g: 34, a: 42, p: 76, pm: 28 }, rating: 88, notable: "3x Cup captain, Selke" },
  { name: "Marian Hossa", team: "blackhawks", era: "2010s", pos: "RW", stats: { g: 29, a: 37, p: 66, pm: 26 }, rating: 85, notable: "3x Cup, two-way winger" },
  { name: "Patrick Sharp", team: "blackhawks", era: "2010s", pos: "LW", stats: { g: 34, a: 44, p: 78, pm: 24 }, rating: 83, notable: "3x Cup scorer" },
  { name: "Brent Seabrook", team: "blackhawks", era: "2010s", pos: "D", stats: { g: 14, a: 35, p: 49, pm: 23 }, rating: 81, notable: "3x Cup, top-pair D" },
  { name: "Corey Crawford", team: "blackhawks", era: "2010s", pos: "G", stats: { w: 35, svp: 0.924, gaa: 2.26, so: 7 }, rating: 84, notable: "2x Cup-winning goalie" },

  // --- Los Angeles Kings (Kopitar/Doughty/Quick exist) ---
  { name: "Dustin Brown", team: "kings", era: "2010s", pos: "RW", stats: { g: 28, a: 26, p: 54, pm: 18 }, rating: 81, notable: "2x Cup captain" },
  { name: "Jeff Carter", team: "kings", era: "2010s", pos: "C", stats: { g: 33, a: 33, p: 66, pm: 16 }, rating: 82, notable: "2x Cup scorer" },
  { name: "Marian Gaborik", team: "kings", era: "2010s", pos: "RW", stats: { g: 27, a: 27, p: 54, pm: 12 }, rating: 80, notable: "Cup playoff sniper" },

  // --- Washington Capitals (Ovechkin, Holtby exist) ---
  { name: "Nicklas Backstrom", team: "capitals", era: "2010s", pos: "C", stats: { g: 21, a: 65, p: 86, pm: 14 }, rating: 86, notable: "Elite playmaking C, Cup" },
  { name: "Evgeny Kuznetsov", team: "capitals", era: "2010s", pos: "C", stats: { g: 27, a: 56, p: 83, pm: 20 }, rating: 84, notable: "2018 playoff scoring leader, Cup" },
  { name: "John Carlson", team: "capitals", era: "2010s", pos: "D", stats: { g: 15, a: 60, p: 75, pm: 18 }, rating: 85, notable: "No. 1 offensive D, Cup" },
  { name: "T.J. Oshie", team: "capitals", era: "2010s", pos: "RW", stats: { g: 33, a: 23, p: 56, pm: 18 }, rating: 81, notable: "Top-six scorer, Cup" },

  // --- Pittsburgh Penguins (Crosby/Malkin/Kessel exist) ---
  { name: "Kris Letang", team: "penguins", era: "2010s", pos: "D", stats: { g: 16, a: 51, p: 67, pm: 12 }, rating: 85, notable: "2x Cup No. 1 D" },
  { name: "Matt Murray", team: "penguins", era: "2010s", pos: "G", stats: { w: 32, svp: 0.923, gaa: 2.41, so: 5 }, rating: 81, notable: "2x Cup rookie goalie" },

  // --- Boston Bruins (Chara was 2000s entry) ---
  { name: "Patrice Bergeron", team: "bruins", era: "2010s", pos: "C", stats: { g: 32, a: 41, p: 73, pm: 30 }, rating: 88, notable: "Selke machine, 2011 Cup" },
  { name: "Brad Marchand", team: "bruins", era: "2010s", pos: "LW", stats: { g: 39, a: 46, p: 85, pm: 28 }, rating: 86, notable: "2011 Cup, elite two-way" },
  { name: "Tuukka Rask", team: "bruins", era: "2010s", pos: "G", stats: { w: 36, svp: 0.929, gaa: 2.12, so: 7 }, rating: 85, notable: "Vezina winner" },
  { name: "David Krejci", team: "bruins", era: "2010s", pos: "C", stats: { g: 23, a: 50, p: 73, pm: 24 }, rating: 82, notable: "Playoff scoring leader, Cup" },
  { name: "Zdeno Chara", team: "bruins", era: "2010s", pos: "D", stats: { g: 12, a: 33, p: 45, pm: 25 }, rating: 84, notable: "Norris, 2011 Cup captain" },

  // --- San Jose Sharks (Burns exists) ---
  { name: "Joe Thornton", team: "sharks", era: "2010s", pos: "C", stats: { g: 22, a: 65, p: 87, pm: 20 }, rating: 86, notable: "Elite playmaking C, captain" },
  { name: "Joe Pavelski", team: "sharks", era: "2010s", pos: "C", stats: { g: 38, a: 41, p: 79, pm: 16 }, rating: 84, notable: "Captain, clutch scorer" },
  { name: "Logan Couture", team: "sharks", era: "2010s", pos: "C", stats: { g: 31, a: 36, p: 67, pm: 14 }, rating: 82, notable: "Playoff scoring leader" },
  { name: "Marc-Edouard Vlasic", team: "sharks", era: "2010s", pos: "D", stats: { g: 8, a: 31, p: 39, pm: 24 }, rating: 81, notable: "Elite shutdown D" },

  // --- Anaheim Ducks ---
  { name: "Ryan Getzlaf", team: "ducks", era: "2010s", pos: "C", stats: { g: 25, a: 62, p: 87, pm: 20 }, rating: 85, notable: "Captain, elite playmaker" },
  { name: "Corey Perry", team: "ducks", era: "2010s", pos: "RW", stats: { g: 50, a: 48, p: 98, pm: 9 }, rating: 86, notable: "Hart MVP, 50-goal Rocket Richard" },
  { name: "John Gibson", team: "ducks", era: "2010s", pos: "G", stats: { w: 31, svp: 0.926, gaa: 2.43, so: 5 }, rating: 82, notable: "Vezina-finalist goalie" },

  // --- Tampa Bay Lightning (Stamkos/Kucherov/Hedman/Vasilevskiy exist) ---
  { name: "Brayden Point", team: "lightning", era: "2010s", pos: "C", stats: { g: 41, a: 51, p: 92, pm: 17 }, rating: 86, notable: "Top-line center" },
  { name: "Ryan McDonagh", team: "lightning", era: "2010s", pos: "D", stats: { g: 9, a: 34, p: 43, pm: 24 }, rating: 82, notable: "Top-pair shutdown D" },

  // --- St. Louis Blues (Tarasenko exists) ---
  { name: "Alex Pietrangelo", team: "blues", era: "2010s", pos: "D", stats: { g: 16, a: 38, p: 54, pm: 20 }, rating: 84, notable: "2019 Cup captain" },
  { name: "Ryan O'Reilly", team: "blues", era: "2010s", pos: "C", stats: { g: 28, a: 49, p: 77, pm: 22 }, rating: 84, notable: "2019 Conn Smythe & Selke" },
  { name: "Jordan Binnington", team: "blues", era: "2010s", pos: "G", stats: { w: 24, svp: 0.927, gaa: 1.89, so: 5 }, rating: 81, notable: "2019 Cup rookie goalie" },

  // --- Nashville Predators (Weber/Rinne exist) ---
  { name: "Roman Josi", team: "predators", era: "2010s", pos: "D", stats: { g: 15, a: 46, p: 61, pm: 20 }, rating: 85, notable: "No. 1 offensive D, captain" },
  { name: "Filip Forsberg", team: "predators", era: "2010s", pos: "LW", stats: { g: 33, a: 31, p: 64, pm: 12 }, rating: 83, notable: "Franchise scoring leader" },
  { name: "Ryan Ellis", team: "predators", era: "2010s", pos: "D", stats: { g: 13, a: 32, p: 45, pm: 20 }, rating: 80, notable: "Top-pair two-way D" },

  // --- Dallas Stars (Benn exists) ---
  { name: "Tyler Seguin", team: "stars", era: "2010s", pos: "C", stats: { g: 40, a: 44, p: 84, pm: 10 }, rating: 85, notable: "40-goal top-line C" },
  { name: "John Klingberg", team: "stars", era: "2010s", pos: "D", stats: { g: 12, a: 55, p: 67, pm: 14 }, rating: 82, notable: "Offensive No. 1 D" },

  // --- Montreal Canadiens (Subban/Price exist) ---
  { name: "Max Pacioretty", team: "canadiens", era: "2010s", pos: "LW", stats: { g: 39, a: 28, p: 67, pm: 18 }, rating: 82, notable: "Captain, 5x 30-goal scorer" },

  // --- Minnesota Wild ---
  { name: "Zach Parise", team: "wild", era: "2010s", pos: "LW", stats: { g: 33, a: 29, p: 62, pm: 14 }, rating: 82, notable: "Top-line power forward" },
  { name: "Ryan Suter", team: "wild", era: "2010s", pos: "D", stats: { g: 8, a: 43, p: 51, pm: 18 }, rating: 83, notable: "Minutes-eating No. 1 D" },

  // --- Calgary Flames (Gaudreau exists) ---
  { name: "Mark Giordano", team: "flames", era: "2010s", pos: "D", stats: { g: 17, a: 57, p: 74, pm: 39 }, rating: 84, notable: "Norris-winning captain" },

  // --- Ottawa Senators (Karlsson exists) ---
  { name: "Mark Stone", team: "senators", era: "2010s", pos: "RW", stats: { g: 28, a: 36, p: 64, pm: 21 }, rating: 83, notable: "Elite two-way winger" },

  // --- Buffalo Sabres ---
  { name: "Jack Eichel", team: "sabres", era: "2010s", pos: "C", stats: { g: 28, a: 54, p: 82, pm: 2 }, rating: 85, notable: "Franchise No. 1 center" },
  { name: "Ryan Miller", team: "sabres", era: "2010s", pos: "G", stats: { w: 34, svp: 0.916, gaa: 2.55, so: 5 }, rating: 80, notable: "Vezina-caliber goalie" },

  // --- New York Rangers (Lundqvist is 2000s) ---
  { name: "Henrik Lundqvist", team: "rangers", era: "2010s", pos: "G", stats: { w: 39, svp: 0.930, gaa: 2.05, so: 8 }, rating: 88, notable: "Vezina winner, King Henrik" },

  // --- Winnipeg Jets (Wheeler exists) ---
  { name: "Patrik Laine", team: "jets", era: "2010s", pos: "RW", stats: { g: 44, a: 26, p: 70, pm: 8 }, rating: 83, notable: "44-goal sniper" },
  { name: "Mark Scheifele", team: "jets", era: "2010s", pos: "C", stats: { g: 32, a: 41, p: 73, pm: 16 }, rating: 84, notable: "No. 1 center" },

  // --- Edmonton Oilers (McDavid exists) ---
  { name: "Leon Draisaitl", team: "oilers", era: "2010s", pos: "C", stats: { g: 50, a: 55, p: 105, pm: 3 }, rating: 89, notable: "Art Ross & Hart MVP" },

  // =========================================================================
  // 2000s — a couple of contender fills (the 2010s/2020s gap is the priority).
  // =========================================================================

  // --- Detroit Red Wings (Datsyuk/Lidstrom exist) — Cup-era core ---
  { name: "Henrik Zetterberg", team: "redwings", era: "2000s", pos: "C", stats: { g: 33, a: 39, p: 72, pm: 22 }, rating: 85, notable: "Conn Smythe, 2008 Cup" },
  { name: "Brendan Shanahan", team: "redwings", era: "2000s", pos: "LW", stats: { g: 37, a: 38, p: 75, pm: 20 }, rating: 84, notable: "Power forward, 2002 Cup" },
];
