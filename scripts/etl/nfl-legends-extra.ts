import type { LegendEntry } from "./nfl-legends";

// Pre-2000 depth pack: recognizable real players added to give storied
// franchises real choice on a spin. Merged + deduped by scripts/etl/nfl.ts.
//
// Stats are PER-SEASON PEAK (one representative great season, era-realistic),
// matching the convention in nfl-legends.ts. Eras limited to 1960s-1990s and
// positions to QB/RB/WR/TE/DL/LB/DB (OL is fully covered elsewhere).
export const NFL_LEGENDS_EXTRA: LegendEntry[] = [
  // ============================================================
  // ============================ 1960s =========================
  // ============================================================
  // ---- packers (already deep; skip) ----
  // ---- colts ----
  { name: "Lenny Moore", team: "colts", era: "1960s", pos: "RB", stats: { ryds: 707, rtd: 16, rec: 47 }, rating: 84, notable: "HOF, dual-threat back, 1964 Comeback Player" },
  { name: "Raymond Berry", team: "colts", era: "1960s", pos: "WR", stats: { rec: 74, recyds: 1298, rectd: 10 }, rating: 84, notable: "HOF, Unitas's favorite target, sure hands" },
  { name: "Bobby Boyd", team: "colts", era: "1960s", pos: "DB", stats: { int: 9, pd: 17, tkl: 55 }, rating: 76, notable: "2x All-Pro CB, 57 career INT (Baltimore)" },
  // ---- browns ----
  { name: "Frank Ryan", team: "browns", era: "1960s", pos: "QB", stats: { pyds: 2974, ptd: 29, pint: 14 }, rating: 76, notable: "Led Browns to 1964 NFL title, 3x Pro Bowl" },
  { name: "Leroy Kelly", team: "browns", era: "1960s", pos: "RB", stats: { ryds: 1239, rtd: 16, rec: 30 }, rating: 83, notable: "HOF, succeeded Jim Brown, 2x rushing champ" },
  { name: "Paul Warfield", team: "browns", era: "1960s", pos: "WR", stats: { rec: 52, recyds: 1067, rectd: 12 }, rating: 81, notable: "HOF, dazzling deep threat before the Miami years" },
  { name: "Bill Glass", team: "browns", era: "1960s", pos: "DL", stats: { sacks: 13, tkl: 60, ff: 3 }, rating: 74, notable: "4x Pro Bowl defensive end" },
  // ---- bears (already 3; top up) ----
  { name: "Doug Atkins", team: "bears", era: "1960s", pos: "DL", stats: { sacks: 14, tkl: 62, ff: 3 }, rating: 84, notable: "HOF, fearsome 6-8 DE, 8x Pro Bowl" },
  { name: "Bill George", team: "bears", era: "1960s", pos: "LB", stats: { tkl: 120, sacks: 4, int: 3 }, rating: 82, notable: "HOF, pioneer of the middle linebacker position" },
  // ---- chiefs (already 3; top up) ----
  { name: "Otis Taylor", team: "chiefs", era: "1960s", pos: "WR", stats: { rec: 58, recyds: 1297, rectd: 11 }, rating: 79, notable: "Big-play WR, SB IV TD, AFL star" },
  { name: "Johnny Robinson", team: "chiefs", era: "1960s", pos: "DB", stats: { int: 10, pd: 18, tkl: 70 }, rating: 80, notable: "HOF, ball-hawking safety, SB IV champ" },
  { name: "Emmitt Thomas", team: "chiefs", era: "1960s", pos: "DB", stats: { int: 9, pd: 19, tkl: 58 }, rating: 79, notable: "HOF, 58 career INT, SB IV champ" },
  // ---- raiders ----
  { name: "Daryle Lamonica", team: "raiders", era: "1960s", pos: "QB", stats: { pyds: 3228, ptd: 34, pint: 25 }, rating: 78, notable: "'The Mad Bomber', 2x AFL MVP" },
  { name: "Clem Daniels", team: "raiders", era: "1960s", pos: "RB", stats: { ryds: 1099, rtd: 11, rec: 30 }, rating: 75, notable: "AFL's all-time leading rusher, 4x All-Star" },
  // ---- cowboys (already 1; top up) ----
  { name: "Don Meredith", team: "cowboys", era: "1960s", pos: "QB", stats: { pyds: 2899, ptd: 24, pint: 12 }, rating: 76, notable: "3x Pro Bowl, original Cowboys QB, 'Dandy Don'" },
  { name: "Bob Hayes", team: "cowboys", era: "1960s", pos: "WR", stats: { rec: 64, recyds: 1232, rectd: 13 }, rating: 84, notable: "HOF, Olympic sprinter, 'Bullet Bob'" },
  { name: "Chuck Howley", team: "cowboys", era: "1960s", pos: "LB", stats: { tkl: 110, sacks: 4, int: 3 }, rating: 80, notable: "6x Pro Bowl, only SB MVP from a losing team" },
  { name: "Mel Renfro", team: "cowboys", era: "1960s", pos: "DB", stats: { int: 7, pd: 18, tkl: 60 }, rating: 81, notable: "HOF, 10x Pro Bowl, shutdown corner/safety" },
  // ---- giants (already 2; top up) ----
  { name: "Frank Gifford", team: "giants", era: "1960s", pos: "RB", stats: { ryds: 0, rtd: 0, rec: 42 }, rating: 80, notable: "HOF, versatile halfback-turned-flanker, MVP" },
  { name: "Andy Robustelli", team: "giants", era: "1960s", pos: "DL", stats: { sacks: 12, tkl: 58, ff: 3 }, rating: 79, notable: "HOF, 7x Pro Bowl defensive end" },
  // ---- lions (already 1; top up) ----
  { name: "Alex Karras", team: "lions", era: "1960s", pos: "DL", stats: { sacks: 14, tkl: 64, ff: 3 }, rating: 82, notable: "4x Pro Bowl DT, 'Mongo', later an actor" },
  { name: "Joe Schmidt", team: "lions", era: "1960s", pos: "LB", stats: { tkl: 125, sacks: 4, int: 3 }, rating: 82, notable: "HOF, 10x Pro Bowl MLB, defensive captain" },
  { name: "Yale Lary", team: "lions", era: "1960s", pos: "DB", stats: { int: 8, pd: 15, tkl: 55 }, rating: 79, notable: "HOF, 9x Pro Bowl safety and punter" },
  // ---- rams (already 2; top up) ----
  { name: "Roman Gabriel", team: "rams", era: "1960s", pos: "QB", stats: { pyds: 2549, ptd: 24, pint: 7 }, rating: 78, notable: "MVP 1969, 4x Pro Bowl, durable passer" },
  { name: "Lamar Lundy", team: "rams", era: "1960s", pos: "DL", stats: { sacks: 11, tkl: 55, ff: 2 }, rating: 75, notable: "'Fearsome Foursome' defensive end" },
  { name: "Eddie Meador", team: "rams", era: "1960s", pos: "DB", stats: { int: 8, pd: 16, tkl: 65 }, rating: 76, notable: "6x Pro Bowl safety, Rams' all-time INT leader" },
  // ---- vikings ----
  { name: "Carl Eller", team: "vikings", era: "1960s", pos: "DL", stats: { sacks: 15, tkl: 70, ff: 4 }, rating: 84, notable: "HOF, 'Purple People Eaters' anchor DE" },
  { name: "Bill Brown", team: "vikings", era: "1960s", pos: "RB", stats: { ryds: 866, rtd: 11, rec: 48 }, rating: 75, notable: "4x Pro Bowl fullback, bruising Vikings back" },
  // ---- cardinals (already 2; top up) ----
  { name: "Charley Johnson", team: "cardinals", era: "1960s", pos: "QB", stats: { pyds: 3045, ptd: 28, pint: 24 }, rating: 74, notable: "Big-arm Cardinals passer (St. Louis), 2x 3,000 yds" },
  { name: "Sonny Randle", team: "cardinals", era: "1960s", pos: "WR", stats: { rec: 73, recyds: 1158, rectd: 15 }, rating: 75, notable: "4x Pro Bowl flanker, 16 catches in a game (St. Louis)" },
  // ---- chargers (already 1; top up) ----
  { name: "John Hadl", team: "chargers", era: "1960s", pos: "QB", stats: { pyds: 3365, ptd: 27, pint: 18 }, rating: 77, notable: "6x Pro Bowl, AFL passing leader (San Diego)" },
  { name: "Paul Lowe", team: "chargers", era: "1960s", pos: "RB", stats: { ryds: 1121, rtd: 7, rec: 22 }, rating: 75, notable: "AFL champ, 2x AFL rushing leader (San Diego)" },
  { name: "Ernie Ladd", team: "chargers", era: "1960s", pos: "DL", stats: { sacks: 12, tkl: 58, ff: 2 }, rating: 76, notable: "'Big Cat', mammoth 6-9 DT, 3x AFL All-Star" },
  // ---- bills ----
  { name: "Jack Kemp", team: "bills", era: "1960s", pos: "QB", stats: { pyds: 3130, ptd: 24, pint: 27 }, rating: 76, notable: "2x AFL champ, AFL MVP 1965, later congressman" },
  { name: "Cookie Gilchrist", team: "bills", era: "1960s", pos: "RB", stats: { ryds: 1096, rtd: 13, rec: 18 }, rating: 76, notable: "AFL MVP 1962, bruising fullback, 243 yds in a game" },
  { name: "George Saimes", team: "bills", era: "1960s", pos: "DB", stats: { int: 7, pd: 14, tkl: 70 }, rating: 75, notable: "AFL champ safety, 5x All-Star, sure tackler" },
  // ---- jets (already 1; top up) ----
  { name: "Don Maynard", team: "jets", era: "1960s", pos: "WR", stats: { rec: 71, recyds: 1434, rectd: 14 }, rating: 83, notable: "HOF, deep threat for Namath, AFL legend" },
  { name: "Matt Snell", team: "jets", era: "1960s", pos: "RB", stats: { ryds: 1057, rtd: 6, rec: 22 }, rating: 75, notable: "Super Bowl III workhorse, 121 yds vs Colts" },
  { name: "Gerry Philbin", team: "jets", era: "1960s", pos: "DL", stats: { sacks: 13, tkl: 56, ff: 3 }, rating: 75, notable: "All-AFL DE, anchor of the SB III defense" },
  // ---- commanders (Washington, already 1; top up) ----
  { name: "Charley Taylor", team: "commanders", era: "1960s", pos: "WR", stats: { rec: 72, recyds: 990, rectd: 9 }, rating: 81, notable: "HOF, ROY then all-time receptions leader (Washington)" },
  { name: "Bobby Mitchell", team: "commanders", era: "1960s", pos: "WR", stats: { rec: 72, recyds: 1384, rectd: 11 }, rating: 81, notable: "HOF, electric flanker/returner (Washington)" },
  { name: "Sam Huff", team: "commanders", era: "1960s", pos: "LB", stats: { tkl: 115, sacks: 3, int: 2 }, rating: 76, notable: "HOF MLB, finished his career in Washington" },

  // ============================================================
  // ============================ 1970s =========================
  // ============================================================
  // ---- steelers (already 7; skip) ----
  // ---- raiders (already 5; skip) ----
  // ---- cowboys (already 2; top up) ----
  { name: "Drew Pearson", team: "cowboys", era: "1970s", pos: "WR", stats: { rec: 58, recyds: 870, rectd: 8 }, rating: 80, notable: "HOF, 'Original Hail Mary' catch, 3x All-Pro" },
  { name: "Tony Hill", team: "cowboys", era: "1970s", pos: "WR", stats: { rec: 60, recyds: 1062, rectd: 10 }, rating: 76, notable: "3x Pro Bowl deep threat opposite Pearson" },
  { name: "Ed Too Tall Jones", team: "cowboys", era: "1970s", pos: "DL", stats: { sacks: 13, tkl: 62, ff: 3 }, rating: 80, notable: "3x Pro Bowl DE, 'Too Tall', Doomsday Defense" },
  { name: "Harvey Martin", team: "cowboys", era: "1970s", pos: "DL", stats: { sacks: 16, tkl: 58, ff: 3 }, rating: 79, notable: "DPOY 1977, Super Bowl XII co-MVP" },
  { name: "Cliff Harris", team: "cowboys", era: "1970s", pos: "DB", stats: { int: 5, pd: 17, tkl: 85 }, rating: 80, notable: "HOF, 6x Pro Bowl hard-hitting free safety" },
  // ---- dolphins (already 2; top up) ----
  { name: "Mercury Morris", team: "dolphins", era: "1970s", pos: "RB", stats: { ryds: 1000, rtd: 12, rec: 15 }, rating: 76, notable: "Perfect-season speed back, 3x Pro Bowl" },
  { name: "Paul Warfield", team: "dolphins", era: "1970s", pos: "WR", stats: { rec: 43, recyds: 883, rectd: 11 }, rating: 82, notable: "HOF, deep threat for the perfect-season Dolphins" },
  { name: "Nick Buoniconti", team: "dolphins", era: "1970s", pos: "LB", stats: { tkl: 130, sacks: 4, int: 4 }, rating: 82, notable: "HOF, undersized MLB of the No-Name Defense" },
  { name: "Jake Scott", team: "dolphins", era: "1970s", pos: "DB", stats: { int: 9, pd: 16, tkl: 70 }, rating: 78, notable: "Super Bowl VII MVP, 5x Pro Bowl safety" },
  // ---- vikings (already 2; top up) ----
  { name: "Chuck Foreman", team: "vikings", era: "1970s", pos: "RB", stats: { ryds: 1155, rtd: 13, rec: 73 }, rating: 81, notable: "Dual-threat back, 5x Pro Bowl, led NFL in catches" },
  { name: "Carl Eller", team: "vikings", era: "1970s", pos: "DL", stats: { sacks: 16, tkl: 68, ff: 4 }, rating: 84, notable: "HOF, 'Purple People Eaters' bookend DE" },
  { name: "Jim Marshall", team: "vikings", era: "1970s", pos: "DL", stats: { sacks: 12, tkl: 64, ff: 4 }, rating: 78, notable: "Iron-man DE, 282 consecutive starts" },
  { name: "Paul Krause", team: "vikings", era: "1970s", pos: "DB", stats: { int: 8, pd: 16, tkl: 60 }, rating: 82, notable: "HOF, all-time INT leader (81), free safety" },
  // ---- rams (already 1; top up) ----
  { name: "Lawrence McCutcheon", team: "rams", era: "1970s", pos: "RB", stats: { ryds: 1238, rtd: 6, rec: 39 }, rating: 76, notable: "5x Pro Bowl workhorse of the 70s Rams" },
  { name: "Harold Jackson", team: "rams", era: "1970s", pos: "WR", stats: { rec: 40, recyds: 874, rectd: 13 }, rating: 75, notable: "Deep threat, 5x Pro Bowl, led NFL in TD catches" },
  { name: "Jack Reynolds", team: "rams", era: "1970s", pos: "LB", stats: { tkl: 140, sacks: 3, int: 2 }, rating: 77, notable: "'Hacksaw', fiery MLB, 2x Pro Bowl" },
  { name: "Isiah Robertson", team: "rams", era: "1970s", pos: "LB", stats: { tkl: 135, sacks: 5, int: 4 }, rating: 77, notable: "DROY 1971, 6x Pro Bowl, ball-hawking OLB" },
  // ---- broncos (already 1; top up) ----
  { name: "Lyle Alzado", team: "broncos", era: "1970s", pos: "DL", stats: { sacks: 13, tkl: 64, ff: 3 }, rating: 78, notable: "Fierce 'Orange Crush' DE, 1977 Pro Bowl" },
  { name: "Tom Jackson", team: "broncos", era: "1970s", pos: "LB", stats: { tkl: 110, sacks: 5, int: 4 }, rating: 76, notable: "3x Pro Bowl 'Orange Crush' OLB" },
  { name: "Billy Thompson", team: "broncos", era: "1970s", pos: "DB", stats: { int: 6, pd: 16, tkl: 80 }, rating: 75, notable: "3x Pro Bowl safety, Orange Crush mainstay" },
  { name: "Riley Odoms", team: "broncos", era: "1970s", pos: "TE", stats: { rec: 54, recyds: 743, rectd: 7 }, rating: 76, notable: "4x Pro Bowl receiving tight end" },
  // ---- commanders (Washington, already 1; top up) ----
  { name: "Billy Kilmer", team: "commanders", era: "1970s", pos: "QB", stats: { pyds: 2221, ptd: 19, pint: 11 }, rating: 74, notable: "Led Washington to Super Bowl VII, gutsy passer" },
  { name: "Larry Brown", team: "commanders", era: "1970s", pos: "RB", stats: { ryds: 1216, rtd: 8, rec: 32 }, rating: 78, notable: "MVP 1972, 4x Pro Bowl (Washington)" },
  { name: "Charley Taylor", team: "commanders", era: "1970s", pos: "WR", stats: { rec: 59, recyds: 883, rectd: 7 }, rating: 79, notable: "HOF, all-time receptions leader (Washington)" },
  { name: "Chris Hanburger", team: "commanders", era: "1970s", pos: "LB", stats: { tkl: 120, sacks: 5, int: 3 }, rating: 77, notable: "HOF, 9x Pro Bowl OLB (Washington)" },
  // ---- titans (Oilers, already 1; top up) ----
  { name: "Dan Pastorini", team: "titans", era: "1970s", pos: "QB", stats: { pyds: 2962, ptd: 16, pint: 14 }, rating: 74, notable: "Led Luv Ya Blue Oilers to AFC title games" },
  { name: "Ken Burrough", team: "titans", era: "1970s", pos: "WR", stats: { rec: 53, recyds: 1063, rectd: 8 }, rating: 75, notable: "2x Pro Bowl deep threat in '#00' (Oilers)" },
  { name: "Robert Brazile", team: "titans", era: "1970s", pos: "LB", stats: { tkl: 140, sacks: 7, int: 3 }, rating: 80, notable: "HOF, DROY 1975, 7x Pro Bowl 'Dr. Doom' (Oilers)" },
  { name: "Elvin Bethea", team: "titans", era: "1970s", pos: "DL", stats: { sacks: 16, tkl: 60, ff: 3 }, rating: 79, notable: "HOF, 8x Pro Bowl defensive end (Oilers)" },
  // ---- chiefs (already 1; top up) ----
  { name: "Ed Podolak", team: "chiefs", era: "1970s", pos: "RB", stats: { ryds: 1157, rtd: 8, rec: 42 }, rating: 74, notable: "Versatile back, legendary 1971 playoff game" },
  { name: "Emmitt Thomas", team: "chiefs", era: "1970s", pos: "DB", stats: { int: 12, pd: 20, tkl: 55 }, rating: 78, notable: "HOF, led NFL with 12 INT in 1974" },
  // ---- bills (already 1; top up) ----
  { name: "Joe Ferguson", team: "bills", era: "1970s", pos: "QB", stats: { pyds: 2803, ptd: 25, pint: 17 }, rating: 74, notable: "Steady Bills passer of the O.J. era" },
  { name: "Robert James", team: "bills", era: "1970s", pos: "DB", stats: { int: 5, pd: 15, tkl: 70 }, rating: 74, notable: "3x Pro Bowl shutdown corner" },
  // ---- bears (already 0 in 70s; build) ----
  { name: "Walter Payton", team: "bears", era: "1970s", pos: "RB", stats: { ryds: 1852, rtd: 14, rec: 31 }, rating: 90, notable: "HOF, MVP 1977, 'Sweetness' breaks out" },
  { name: "Wally Chambers", team: "bears", era: "1970s", pos: "DL", stats: { sacks: 14, tkl: 66, ff: 3 }, rating: 76, notable: "DPOY-caliber DT, 3x Pro Bowl" },
  { name: "Doug Buffone", team: "bears", era: "1970s", pos: "LB", stats: { tkl: 130, sacks: 5, int: 3 }, rating: 73, notable: "Long-time Bears OLB, defensive captain" },

  // ============================================================
  // ===================== 1980s (PRIORITY) =====================
  // ============================================================
  // ---- 49ers (already 2; build) ----
  { name: "Roger Craig", team: "49ers", era: "1980s", pos: "RB", stats: { ryds: 1502, rtd: 9, rec: 92 }, rating: 82, notable: "First 1,000/1,000 season, 3x SB champ" },
  { name: "Dwight Clark", team: "49ers", era: "1980s", pos: "WR", stats: { rec: 85, recyds: 1105, rectd: 6 }, rating: 78, notable: "'The Catch', 2x Pro Bowl, 2x SB champ" },
  { name: "Charles Haley", team: "49ers", era: "1980s", pos: "DL", stats: { sacks: 16, tkl: 58, ff: 4 }, rating: 84, notable: "HOF, 5x SB champ, dominant edge rusher" },
  { name: "Fred Dean", team: "49ers", era: "1980s", pos: "DL", stats: { sacks: 17.5, tkl: 50, ff: 3 }, rating: 80, notable: "HOF, pass-rush specialist, sparked '81 title" },
  // ---- commanders (Washington, already 3; top up) ----
  { name: "Dexter Manley", team: "commanders", era: "1980s", pos: "DL", stats: { sacks: 18.5, tkl: 56, ff: 4 }, rating: 79, notable: "'Secretary of Defense', 18.5 sacks in 1986" },
  { name: "Gary Clark", team: "commanders", era: "1980s", pos: "WR", stats: { rec: 73, recyds: 1265, rectd: 7 }, rating: 78, notable: "4x Pro Bowl, 'The Posse', 2x SB champ" },
  { name: "Darrell Green", team: "commanders", era: "1980s", pos: "DB", stats: { int: 5, pd: 18, tkl: 65 }, rating: 82, notable: "HOF, fastest man in the NFL, shutdown corner" },
  // ---- raiders (already 2; top up) ----
  { name: "Todd Christensen", team: "raiders", era: "1980s", pos: "TE", stats: { rec: 95, recyds: 1153, rectd: 8 }, rating: 80, notable: "Led NFL in catches twice, 5x Pro Bowl TE" },
  { name: "Cliff Branch", team: "raiders", era: "1980s", pos: "WR", stats: { rec: 49, recyds: 858, rectd: 7 }, rating: 78, notable: "3x SB champ, blazing deep threat, 4x Pro Bowl" },
  { name: "Lester Hayes", team: "raiders", era: "1980s", pos: "DB", stats: { int: 13, pd: 22, tkl: 60 }, rating: 81, notable: "DPOY 1980, 13 INT, 'Stickum' corner" },
  { name: "Rod Martin", team: "raiders", era: "1980s", pos: "LB", stats: { tkl: 115, sacks: 6, int: 3 }, rating: 76, notable: "3 INT in Super Bowl XV, 2x Pro Bowl OLB" },
  // ---- bears (already 2; top up) ----
  { name: "Jim McMahon", team: "bears", era: "1980s", pos: "QB", stats: { pyds: 2392, ptd: 15, pint: 11 }, rating: 76, notable: "'Punky QB', led '85 Bears to Super Bowl XX" },
  { name: "Richard Dent", team: "bears", era: "1980s", pos: "DL", stats: { sacks: 17.5, tkl: 62, ff: 6 }, rating: 84, notable: "HOF, Super Bowl XX MVP, 46-defense terror" },
  { name: "Dan Hampton", team: "bears", era: "1980s", pos: "DL", stats: { sacks: 11.5, tkl: 65, ff: 3 }, rating: 82, notable: "HOF, 'Danimal', anchor of the Monsters" },
  { name: "Otis Wilson", team: "bears", era: "1980s", pos: "LB", stats: { tkl: 120, sacks: 10.5, int: 3 }, rating: 76, notable: "Hard-hitting OLB of the '85 Bears" },
  // ---- dolphins (already 1; build) ----
  { name: "Mark Clayton", team: "dolphins", era: "1980s", pos: "WR", stats: { rec: 73, recyds: 1389, rectd: 18 }, rating: 80, notable: "18 TD catches in 1984, 5x Pro Bowl, 'Marks Brothers'" },
  { name: "Mark Duper", team: "dolphins", era: "1980s", pos: "WR", stats: { rec: 71, recyds: 1306, rectd: 8 }, rating: 78, notable: "3x Pro Bowl deep threat, 'Marks Brothers'" },
  { name: "A.J. Duhe", team: "dolphins", era: "1980s", pos: "LB", stats: { tkl: 110, sacks: 6, int: 3 }, rating: 74, notable: "3 INT in 1982 AFC title game, Killer B's" },
  // ---- broncos (already 0 in 80s; build) ----
  { name: "John Elway", team: "broncos", era: "1980s", pos: "QB", stats: { pyds: 3891, ptd: 22, pint: 12 }, rating: 84, notable: "MVP-caliber, 'The Drive', 3 SB appearances" },
  { name: "Karl Mecklenburg", team: "broncos", era: "1980s", pos: "LB", stats: { tkl: 120, sacks: 9.5, int: 2 }, rating: 79, notable: "6x Pro Bowl, lined up all over the front 7" },
  { name: "Steve Watson", team: "broncos", era: "1980s", pos: "WR", stats: { rec: 60, recyds: 1244, rectd: 13 }, rating: 75, notable: "1,200-yard breakout, Pro Bowl deep threat" },
  { name: "Rulon Jones", team: "broncos", era: "1980s", pos: "DL", stats: { sacks: 13.5, tkl: 60, ff: 3 }, rating: 75, notable: "AFC sack leader 1986, 2x Pro Bowl DE" },
  { name: "Louis Wright", team: "broncos", era: "1980s", pos: "DB", stats: { int: 6, pd: 18, tkl: 60 }, rating: 76, notable: "5x Pro Bowl shutdown corner, Orange Crush era" },
  // ---- giants (already 1; build) ----
  { name: "Phil Simms", team: "giants", era: "1980s", pos: "QB", stats: { pyds: 4044, ptd: 22, pint: 14 }, rating: 79, notable: "Super Bowl XXI MVP, 22/25 passing in SB" },
  { name: "Joe Morris", team: "giants", era: "1980s", pos: "RB", stats: { ryds: 1516, rtd: 21, rec: 22 }, rating: 77, notable: "21 rushing TD in 1985, 2x Pro Bowl" },
  { name: "Mark Bavaro", team: "giants", era: "1980s", pos: "TE", stats: { rec: 66, recyds: 1001, rectd: 4 }, rating: 78, notable: "Bruising 2x Pro Bowl TE, SB XXI champ" },
  { name: "Harry Carson", team: "giants", era: "1980s", pos: "LB", stats: { tkl: 130, sacks: 5, int: 2 }, rating: 81, notable: "HOF, 9x Pro Bowl ILB, defensive captain" },
  { name: "Carl Banks", team: "giants", era: "1980s", pos: "LB", stats: { tkl: 125, sacks: 6, int: 2 }, rating: 78, notable: "All-Pro OLB next to LT, SB XXI run stopper" },
  { name: "Leonard Marshall", team: "giants", era: "1980s", pos: "DL", stats: { sacks: 15.5, tkl: 62, ff: 3 }, rating: 77, notable: "2x Pro Bowl DE, 'The Hit' on Montana" },
  // ---- bengals (already 1; build) ----
  { name: "Cris Collinsworth", team: "bengals", era: "1980s", pos: "WR", stats: { rec: 67, recyds: 1130, rectd: 8 }, rating: 78, notable: "3x Pro Bowl as a rookie-on deep threat" },
  { name: "James Brooks", team: "bengals", era: "1980s", pos: "RB", stats: { ryds: 1239, rtd: 7, rec: 54 }, rating: 78, notable: "Dual-threat back, 4x Pro Bowl, 1,000/500 season" },
  { name: "Eddie Brown", team: "bengals", era: "1980s", pos: "WR", stats: { rec: 53, recyds: 1273, rectd: 9 }, rating: 76, notable: "ROY 1985, 24.0 yds/catch in 1988" },
  // ---- browns (already 1; build) ----
  { name: "Bernie Kosar", team: "browns", era: "1980s", pos: "QB", stats: { pyds: 3854, ptd: 17, pint: 9 }, rating: 78, notable: "Led Browns to 3 AFC title games, sidearm gunslinger" },
  { name: "Clay Matthews", team: "browns", era: "1980s", pos: "LB", stats: { tkl: 130, sacks: 9, int: 3 }, rating: 79, notable: "4x Pro Bowl OLB, 19 seasons, Browns sack leader" },
  { name: "Hanford Dixon", team: "browns", era: "1980s", pos: "DB", stats: { int: 5, pd: 19, tkl: 55 }, rating: 76, notable: "3x Pro Bowl corner, coined 'Dawg Pound'" },
  { name: "Frank Minnifield", team: "browns", era: "1980s", pos: "DB", stats: { int: 4, pd: 18, tkl: 58 }, rating: 76, notable: "4x Pro Bowl corner, shutdown 'Dawgs' tandem" },
  // ---- cowboys (already 1; build) ----
  { name: "Danny White", team: "cowboys", era: "1980s", pos: "QB", stats: { pyds: 3980, ptd: 29, pint: 23 }, rating: 76, notable: "Succeeded Staubach, 3 straight NFC title games" },
  { name: "Tony Hill", team: "cowboys", era: "1980s", pos: "WR", stats: { rec: 60, recyds: 1113, rectd: 8 }, rating: 76, notable: "3x Pro Bowl deep threat of the early-80s Cowboys" },
  { name: "Everson Walls", team: "cowboys", era: "1980s", pos: "DB", stats: { int: 11, pd: 20, tkl: 55 }, rating: 78, notable: "Led NFL in INT 3 times, 4x Pro Bowl corner" },
  { name: "Ed Too Tall Jones", team: "cowboys", era: "1980s", pos: "DL", stats: { sacks: 10.5, tkl: 60, ff: 3 }, rating: 78, notable: "3x Pro Bowl DE, Doomsday Defense iron man" },
  // ---- chargers (already 2; top up) ----
  { name: "Charlie Joiner", team: "chargers", era: "1980s", pos: "WR", stats: { rec: 70, recyds: 1132, rectd: 7 }, rating: 79, notable: "HOF, possession master of Air Coryell (San Diego)" },
  { name: "Wes Chandler", team: "chargers", era: "1980s", pos: "WR", stats: { rec: 49, recyds: 1032, rectd: 9 }, rating: 78, notable: "4x Pro Bowl, 129 rec yds/game in 1982 (San Diego)" },
  { name: "Gary Johnson", team: "chargers", era: "1980s", pos: "DL", stats: { sacks: 17.5, tkl: 60, ff: 3 }, rating: 76, notable: "4x Pro Bowl DT, Air Coryell-era pass rush" },
  { name: "Chuck Muncie", team: "chargers", era: "1980s", pos: "RB", stats: { ryds: 1144, rtd: 19, rec: 30 }, rating: 76, notable: "19 rushing TD in 1981, 3x Pro Bowl back" },
  // ---- seahawks (already 1; build) ----
  { name: "Dave Krieg", team: "seahawks", era: "1980s", pos: "QB", stats: { pyds: 3671, ptd: 32, pint: 11 }, rating: 77, notable: "3x Pro Bowl, undrafted, 32 TD in 1984" },
  { name: "Curt Warner", team: "seahawks", era: "1980s", pos: "RB", stats: { ryds: 1481, rtd: 13, rec: 32 }, rating: 77, notable: "3x Pro Bowl, franchise's first star runner" },
  { name: "Kenny Easley", team: "seahawks", era: "1980s", pos: "DB", stats: { int: 10, pd: 20, tkl: 90 }, rating: 82, notable: "HOF, DPOY 1984, 'The Enforcer' safety" },
  { name: "Jacob Green", team: "seahawks", era: "1980s", pos: "DL", stats: { sacks: 16, tkl: 62, ff: 4 }, rating: 76, notable: "2x Pro Bowl DE, Seahawks all-time sack leader" },
  // ---- titans (Oilers, already 0 in 80s; build) ----
  { name: "Warren Moon", team: "titans", era: "1980s", pos: "QB", stats: { pyds: 3631, ptd: 23, pint: 17 }, rating: 81, notable: "HOF, run-and-shoot maestro, 9x Pro Bowl (Oilers)" },
  { name: "Mike Rozier", team: "titans", era: "1980s", pos: "RB", stats: { ryds: 1002, rtd: 10, rec: 22 }, rating: 75, notable: "2x Pro Bowl, Heisman winner, Oilers workhorse" },
  { name: "Drew Hill", team: "titans", era: "1980s", pos: "WR", stats: { rec: 74, recyds: 1213, rectd: 9 }, rating: 76, notable: "2x Pro Bowl run-and-shoot deep threat (Oilers)" },
  { name: "Ray Childress", team: "titans", era: "1980s", pos: "DL", stats: { sacks: 8.5, tkl: 78, ff: 3 }, rating: 78, notable: "5x Pro Bowl defensive lineman (Oilers)" },
  // ---- bills (already 0 in 80s; build) ----
  { name: "Joe Cribbs", team: "bills", era: "1980s", pos: "RB", stats: { ryds: 1185, rtd: 11, rec: 39 }, rating: 75, notable: "3x Pro Bowl, Bills' workhorse of the early 80s" },
  { name: "Fred Smerlas", team: "bills", era: "1980s", pos: "DL", stats: { sacks: 8, tkl: 70, ff: 2 }, rating: 75, notable: "5x Pro Bowl nose tackle, 'Bermuda Triangle'" },
  { name: "Jim Haslett", team: "bills", era: "1980s", pos: "LB", stats: { tkl: 120, sacks: 6, int: 2 }, rating: 73, notable: "DROY 1979, Pro Bowl ILB into the early 80s" },
  // ---- eagles (already 1; build) ----
  { name: "Ron Jaworski", team: "eagles", era: "1980s", pos: "QB", stats: { pyds: 3529, ptd: 27, pint: 12 }, rating: 76, notable: "Led Eagles to Super Bowl XV, 'Jaws'" },
  { name: "Wilbert Montgomery", team: "eagles", era: "1980s", pos: "RB", stats: { ryds: 1402, rtd: 8, rec: 50 }, rating: 77, notable: "2x Pro Bowl, iconic NFC title-game TD run" },
  { name: "Mike Quick", team: "eagles", era: "1980s", pos: "WR", stats: { rec: 73, recyds: 1409, rectd: 13 }, rating: 78, notable: "5x Pro Bowl deep threat, 99-yard TD catch" },
  { name: "Randall Cunningham", team: "eagles", era: "1980s", pos: "QB", stats: { pyds: 3808, ptd: 24, pint: 16 }, rating: 80, notable: "Electrifying dual threat, 3x Pro Bowl" },
  { name: "Jerome Brown", team: "eagles", era: "1980s", pos: "DL", stats: { sacks: 10.5, tkl: 70, ff: 3 }, rating: 77, notable: "2x Pro Bowl DT, heart of Gang Green" },
  { name: "Seth Joyner", team: "eagles", era: "1980s", pos: "LB", stats: { tkl: 130, sacks: 8, int: 4 }, rating: 78, notable: "All-Pro OLB of the Gang Green defense" },
  // ---- rams (already 1; build) ----
  { name: "Jim Everett", team: "rams", era: "1980s", pos: "QB", stats: { pyds: 4310, ptd: 31, pint: 18 }, rating: 76, notable: "Led NFL in TD passes, NFC title-game run" },
  { name: "Henry Ellard", team: "rams", era: "1980s", pos: "WR", stats: { rec: 86, recyds: 1414, rectd: 10 }, rating: 78, notable: "3x Pro Bowl, led NFL in receiving yards 1988" },
  { name: "Nolan Cromwell", team: "rams", era: "1980s", pos: "DB", stats: { int: 8, pd: 18, tkl: 85 }, rating: 77, notable: "4x Pro Bowl free safety, Rams defensive star" },
  // ---- jets (already 0 in 80s; build) ----
  { name: "Ken O'Brien", team: "jets", era: "1980s", pos: "QB", stats: { pyds: 3888, ptd: 25, pint: 8 }, rating: 76, notable: "2x Pro Bowl, led NFL in passer rating 1985" },
  { name: "Freeman McNeil", team: "jets", era: "1980s", pos: "RB", stats: { ryds: 1331, rtd: 8, rec: 38 }, rating: 76, notable: "3x Pro Bowl, led NFL in rushing 1982" },
  { name: "Al Toon", team: "jets", era: "1980s", pos: "WR", stats: { rec: 93, recyds: 1067, rectd: 8 }, rating: 77, notable: "3x Pro Bowl, led NFL with 93 catches in 1988" },
  { name: "Mark Gastineau", team: "jets", era: "1980s", pos: "DL", stats: { sacks: 22, tkl: 58, ff: 4 }, rating: 80, notable: "22 sacks in 1984, 5x Pro Bowl, 'Sack Exchange'" },
  { name: "Joe Klecko", team: "jets", era: "1980s", pos: "DL", stats: { sacks: 20.5, tkl: 64, ff: 3 }, rating: 80, notable: "HOF, Pro Bowl at 3 line spots, 'Sack Exchange'" },
  // ---- vikings (already 0 in 80s; build) ----
  { name: "Tommy Kramer", team: "vikings", era: "1980s", pos: "QB", stats: { pyds: 3912, ptd: 24, pint: 10 }, rating: 75, notable: "Pro Bowl 1986, 'Two-Minute Tommy'" },
  { name: "Ahmad Rashad", team: "vikings", era: "1980s", pos: "WR", stats: { rec: 69, recyds: 1095, rectd: 8 }, rating: 76, notable: "4x Pro Bowl, Hail Mary catch vs Browns" },
  { name: "Chris Doleman", team: "vikings", era: "1980s", pos: "DL", stats: { sacks: 21, tkl: 60, ff: 4 }, rating: 82, notable: "HOF, 21 sacks in 1989, 8x Pro Bowl" },
  { name: "Keith Millard", team: "vikings", era: "1980s", pos: "DL", stats: { sacks: 18, tkl: 70, ff: 3 }, rating: 79, notable: "DPOY 1989, 18 sacks from defensive tackle" },
  { name: "Joey Browner", team: "vikings", era: "1980s", pos: "DB", stats: { int: 6, pd: 18, tkl: 90 }, rating: 78, notable: "6x Pro Bowl safety, punishing hitter" },
  // ---- saints (already 0 in 80s; build) ----
  { name: "Dalton Hilliard", team: "saints", era: "1980s", pos: "RB", stats: { ryds: 1262, rtd: 18, rec: 52 }, rating: 75, notable: "18 total TD in 1989, Pro Bowl Saints back" },
  { name: "Rickey Jackson", team: "saints", era: "1980s", pos: "LB", stats: { tkl: 120, sacks: 12, int: 2 }, rating: 82, notable: "HOF, 'Dome Patrol', 6x Pro Bowl edge rusher" },
  { name: "Sam Mills", team: "saints", era: "1980s", pos: "LB", stats: { tkl: 135, sacks: 5, int: 3 }, rating: 80, notable: "'Field Mouse', 5x Pro Bowl, Dome Patrol leader" },
  { name: "Pat Swilling", team: "saints", era: "1980s", pos: "LB", stats: { tkl: 110, sacks: 16.5, int: 2 }, rating: 80, notable: "Dome Patrol pass rusher, DPOY 1991" },
  { name: "Vaughan Johnson", team: "saints", era: "1980s", pos: "LB", stats: { tkl: 130, sacks: 4, int: 3 }, rating: 76, notable: "4x Pro Bowl ILB, fourth of the Dome Patrol" },
  // ---- patriots (already 1; build) ----
  { name: "Steve Grogan", team: "patriots", era: "1980s", pos: "QB", stats: { pyds: 3286, ptd: 26, pint: 13 }, rating: 74, notable: "Gritty long-time Patriots QB, SB XX starter" },
  { name: "Stanley Morgan", team: "patriots", era: "1980s", pos: "WR", stats: { rec: 84, recyds: 1491, rectd: 10 }, rating: 78, notable: "4x Pro Bowl, elite yards-per-catch deep threat" },
  { name: "Andre Tippett", team: "patriots", era: "1980s", pos: "LB", stats: { tkl: 110, sacks: 18.5, int: 1 }, rating: 82, notable: "HOF, 18.5 sacks in 1984, 5x Pro Bowl edge" },
  // ---- chiefs (already 0 listed in 80s) ----
  { name: "Deron Cherry", team: "chiefs", era: "1980s", pos: "DB", stats: { int: 9, pd: 18, tkl: 90 }, rating: 78, notable: "6x Pro Bowl safety, 4 INT in one game" },
  { name: "Art Still", team: "chiefs", era: "1980s", pos: "DL", stats: { sacks: 14.5, tkl: 70, ff: 3 }, rating: 76, notable: "4x Pro Bowl defensive end, Chiefs sack leader" },

  // ============================================================
  // ============================ 1990s =========================
  // ============================================================
  // ---- cowboys (already 4; top up to spread) ----
  { name: "Charles Haley", team: "cowboys", era: "1990s", pos: "DL", stats: { sacks: 12.5, tkl: 50, ff: 4 }, rating: 80, notable: "HOF, 5x SB champ, edge rush for the dynasty" },
  { name: "Darren Woodson", team: "cowboys", era: "1990s", pos: "DB", stats: { int: 5, pd: 18, tkl: 95 }, rating: 78, notable: "5x Pro Bowl safety, 3x SB champ, team tackle leader" },
  // ---- 49ers (already 2; build) ----
  { name: "Terrell Owens", team: "49ers", era: "1990s", pos: "WR", stats: { rec: 67, recyds: 1097, rectd: 14 }, rating: 82, notable: "HOF, 'The Catch II' receiver, emerging star" },
  { name: "Brent Jones", team: "49ers", era: "1990s", pos: "TE", stats: { rec: 68, recyds: 765, rectd: 9 }, rating: 76, notable: "4x Pro Bowl TE, Young's security blanket, SB champ" },
  { name: "Bryant Young", team: "49ers", era: "1990s", pos: "DL", stats: { sacks: 11, tkl: 65, ff: 3 }, rating: 80, notable: "HOF, dominant DT, Comeback Player 1999" },
  { name: "Charles Haley", team: "49ers", era: "1990s", pos: "LB", stats: { tkl: 60, sacks: 16, int: 1 }, rating: 80, notable: "HOF edge rusher, returned to SF, 5x SB champ" },
  // ---- bills (already 4; top up) ----
  { name: "Cornelius Bennett", team: "bills", era: "1990s", pos: "LB", stats: { tkl: 110, sacks: 9, int: 2 }, rating: 78, notable: "5x Pro Bowl OLB, K-Gun-era defense, 4x AFC champ" },
  // ---- broncos (already 3; top up) ----
  { name: "Rod Smith", team: "broncos", era: "1990s", pos: "WR", stats: { rec: 86, recyds: 1222, rectd: 10 }, rating: 79, notable: "Undrafted to 2x SB champ, 3x Pro Bowl receiver" },
  { name: "Steve Atwater", team: "broncos", era: "1990s", pos: "DB", stats: { int: 5, pd: 16, tkl: 90 }, rating: 80, notable: "HOF, 8x Pro Bowl safety, devastating hitter" },
  // ---- packers (already 1; build) ----
  { name: "Reggie White", team: "packers", era: "1990s", pos: "DL", stats: { sacks: 16, tkl: 60, ff: 4 }, rating: 90, notable: "HOF, 'Minister of Defense', Super Bowl XXXI champ" },
  { name: "Sterling Sharpe", team: "packers", era: "1990s", pos: "WR", stats: { rec: 112, recyds: 1461, rectd: 18 }, rating: 82, notable: "5x Pro Bowl, 18 TD in 1994 before injury" },
  { name: "LeRoy Butler", team: "packers", era: "1990s", pos: "DB", stats: { int: 6, pd: 18, tkl: 90 }, rating: 80, notable: "HOF, 4x Pro Bowl safety, invented the Lambeau Leap" },
  { name: "Antonio Freeman", team: "packers", era: "1990s", pos: "WR", stats: { rec: 84, recyds: 1424, rectd: 14 }, rating: 77, notable: "Pro Bowl deep threat, SB XXXI TD, 'He caught it!'" },
  // ---- steelers (already 3; top up) ----
  { name: "Greg Lloyd", team: "steelers", era: "1990s", pos: "LB", stats: { tkl: 120, sacks: 10, int: 2 }, rating: 79, notable: "5x Pro Bowl OLB, ferocious Blitzburgh leader" },
  { name: "Carnell Lake", team: "steelers", era: "1990s", pos: "DB", stats: { int: 4, pd: 16, tkl: 85 }, rating: 76, notable: "5x Pro Bowl, moved safety-to-corner seamlessly" },
  // ---- vikings (already 3; top up) ----
  { name: "Robert Smith", team: "vikings", era: "1990s", pos: "RB", stats: { ryds: 1266, rtd: 6, rec: 37 }, rating: 78, notable: "Explosive Pro Bowl back, 1,200+ yards" },
  // ---- dolphins (already 0 listed in 90s; build around Marino-era) ----
  { name: "Dan Marino", team: "dolphins", era: "1990s", pos: "QB", stats: { pyds: 4453, ptd: 30, pint: 17 }, rating: 88, notable: "HOF, still slinging it, all-time passing leader" },
  { name: "O.J. McDuffie", team: "dolphins", era: "1990s", pos: "WR", stats: { rec: 90, recyds: 1050, rectd: 7 }, rating: 74, notable: "Led NFL with 90 catches in 1998" },
  { name: "Irving Fryar", team: "dolphins", era: "1990s", pos: "WR", stats: { rec: 88, recyds: 1270, rectd: 8 }, rating: 77, notable: "Pro Bowl resurgence, 1,200+ yards for Marino" },
  { name: "Zach Thomas", team: "dolphins", era: "1990s", pos: "LB", stats: { tkl: 160, sacks: 4, int: 5 }, rating: 81, notable: "HOF, tackling-machine ILB, multiple Pro Bowls" },
  { name: "Jason Taylor", team: "dolphins", era: "1990s", pos: "DL", stats: { sacks: 12, tkl: 60, ff: 4 }, rating: 80, notable: "HOF, emerging edge rusher, future DPOY" },
  // ---- chiefs (already 1; build) ----
  { name: "Joe Montana", team: "chiefs", era: "1990s", pos: "QB", stats: { pyds: 3283, ptd: 16, pint: 9 }, rating: 82, notable: "HOF, led Chiefs to AFC title game, Pro Bowl finale" },
  { name: "Marcus Allen", team: "chiefs", era: "1990s", pos: "RB", stats: { ryds: 890, rtd: 12, rec: 34 }, rating: 80, notable: "HOF, goal-line force, Comeback Player 1993" },
  { name: "Neil Smith", team: "chiefs", era: "1990s", pos: "DL", stats: { sacks: 15, tkl: 58, ff: 4 }, rating: 79, notable: "6x Pro Bowl DE, NFL sack co-leader 1993" },
  { name: "Dale Carter", team: "chiefs", era: "1990s", pos: "DB", stats: { int: 7, pd: 20, tkl: 65 }, rating: 76, notable: "4x Pro Bowl shutdown corner and returner" },
  // ---- raiders (already 1; build) ----
  { name: "Jeff Hostetler", team: "raiders", era: "1990s", pos: "QB", stats: { pyds: 3242, ptd: 20, pint: 10 }, rating: 74, notable: "Pro Bowl 1994, steady Raiders starter" },
  { name: "Chester McGlockton", team: "raiders", era: "1990s", pos: "DL", stats: { sacks: 9.5, tkl: 62, ff: 3 }, rating: 76, notable: "4x Pro Bowl defensive tackle" },
  { name: "Greg Townsend", team: "raiders", era: "1990s", pos: "DL", stats: { sacks: 13, tkl: 55, ff: 3 }, rating: 75, notable: "Pro Bowl edge rusher, Raiders sack leader" },
  { name: "Napoleon Kaufman", team: "raiders", era: "1990s", pos: "RB", stats: { ryds: 1294, rtd: 6, rec: 40 }, rating: 75, notable: "Explosive 5.8 yds/carry season, Raiders speed back" },
  // ---- eagles (already 0 listed in 90s; build) ----
  { name: "Randall Cunningham", team: "eagles", era: "1990s", pos: "QB", stats: { pyds: 3466, ptd: 19, pint: 11 }, rating: 79, notable: "Dual-threat star, Bert Bell Award winner" },
  { name: "Eric Allen", team: "eagles", era: "1990s", pos: "DB", stats: { int: 6, pd: 20, tkl: 60 }, rating: 78, notable: "Pro Bowl corner, four pick-sixes in 1993" },
  { name: "Clyde Simmons", team: "eagles", era: "1990s", pos: "DL", stats: { sacks: 19, tkl: 60, ff: 4 }, rating: 79, notable: "Led NFL with 19 sacks in 1992, Gang Green" },
  { name: "William Thomas", team: "eagles", era: "1990s", pos: "LB", stats: { tkl: 130, sacks: 7, int: 4 }, rating: 76, notable: "2x Pro Bowl OLB, ball-hawking Gang Green leader" },
  { name: "Charlie Garner", team: "eagles", era: "1990s", pos: "RB", stats: { ryds: 1229, rtd: 4, rec: 38 }, rating: 74, notable: "Explosive 1,200-yard back, 6.0 yds/carry" },
  // ---- lions (already 1; build) ----
  { name: "Herman Moore", team: "lions", era: "1990s", pos: "WR", stats: { rec: 123, recyds: 1686, rectd: 14 }, rating: 82, notable: "123 catches in 1995 (then a record), 4x Pro Bowl" },
  { name: "Brett Perriman", team: "lions", era: "1990s", pos: "WR", stats: { rec: 108, recyds: 1488, rectd: 9 }, rating: 75, notable: "108 catches in 1995 alongside Herman Moore" },
  { name: "Chris Spielman", team: "lions", era: "1990s", pos: "LB", stats: { tkl: 195, sacks: 3, int: 4 }, rating: 79, notable: "4x Pro Bowl tackling machine, 195 tackles in 1994" },
  { name: "Bennie Blades", team: "lions", era: "1990s", pos: "DB", stats: { int: 6, pd: 16, tkl: 90 }, rating: 75, notable: "Pro Bowl safety, hard-hitting Lions defender" },
  // ---- saints (already 0 listed in 90s; build) ----
  { name: "Rickey Jackson", team: "saints", era: "1990s", pos: "LB", stats: { tkl: 115, sacks: 11.5, int: 2 }, rating: 80, notable: "HOF, Dome Patrol edge rusher into the 90s" },
  { name: "Sam Mills", team: "saints", era: "1990s", pos: "LB", stats: { tkl: 130, sacks: 4, int: 3 }, rating: 78, notable: "Undersized Pro Bowl ILB, Dome Patrol leader" },
  { name: "Eric Martin", team: "saints", era: "1990s", pos: "WR", stats: { rec: 66, recyds: 1041, rectd: 7 }, rating: 74, notable: "Pro Bowl receiver, Saints' all-time leading WR" },
  { name: "Wayne Martin", team: "saints", era: "1990s", pos: "DL", stats: { sacks: 13, tkl: 62, ff: 3 }, rating: 75, notable: "Pro Bowl DE, double-digit sacks for the Saints" },
  // ---- titans (Oilers/Titans, already 1; build) ----
  { name: "Eddie George", team: "titans", era: "1990s", pos: "RB", stats: { ryds: 1399, rtd: 9, rec: 47 }, rating: 80, notable: "ROY 1996, 4x Pro Bowl workhorse, SB XXXIV" },
  { name: "Steve McNair", team: "titans", era: "1990s", pos: "QB", stats: { pyds: 3228, ptd: 15, pint: 8 }, rating: 80, notable: "'Air McNair', dual threat, led team to SB XXXIV" },
  { name: "Ray Childress", team: "titans", era: "1990s", pos: "DL", stats: { sacks: 8, tkl: 80, ff: 3 }, rating: 77, notable: "5x Pro Bowl DL, Oilers cornerstone" },
  // ---- rams (early St. Louis, already 1; build) ----
  { name: "Kurt Warner", team: "rams", era: "1990s", pos: "QB", stats: { pyds: 4353, ptd: 41, pint: 13 }, rating: 85, notable: "HOF, MVP 1999, SB XXXIV MVP, grocery-store legend" },
  { name: "Marshall Faulk", team: "rams", era: "1990s", pos: "RB", stats: { ryds: 1381, rtd: 7, rec: 87 }, rating: 86, notable: "HOF, 2,429 yds from scrimmage in 1999, OPOY" },
  { name: "Torry Holt", team: "rams", era: "1990s", pos: "WR", stats: { rec: 52, recyds: 788, rectd: 6 }, rating: 78, notable: "Greatest Show on Turf rookie, SB XXXIV champ" },
  { name: "Kevin Carter", team: "rams", era: "1990s", pos: "DL", stats: { sacks: 17, tkl: 60, ff: 3 }, rating: 78, notable: "Led NFL with 17 sacks in 1999, Pro Bowl DE" },
  { name: "London Fletcher", team: "rams", era: "1990s", pos: "LB", stats: { tkl: 138, sacks: 3, int: 2 }, rating: 76, notable: "Undrafted ILB, tackle machine, SB XXXIV champ" },
  // ---- patriots (already 0 listed in 90s; build) ----
  { name: "Drew Bledsoe", team: "patriots", era: "1990s", pos: "QB", stats: { pyds: 4555, ptd: 25, pint: 15 }, rating: 79, notable: "#1 overall pick, 4x Pro Bowl, SB XXXI starter" },
  { name: "Ben Coates", team: "patriots", era: "1990s", pos: "TE", stats: { rec: 96, recyds: 1174, rectd: 7 }, rating: 79, notable: "96 catches in 1994 (TE record), 5x Pro Bowl" },
  { name: "Curtis Martin", team: "patriots", era: "1990s", pos: "RB", stats: { ryds: 1487, rtd: 14, rec: 46 }, rating: 81, notable: "HOF, ROY 1995, back-to-back 1,400-yard seasons" },
  { name: "Willie McGinest", team: "patriots", era: "1990s", pos: "LB", stats: { tkl: 90, sacks: 9.5, int: 1 }, rating: 76, notable: "2x Pro Bowl edge, versatile Patriots defender" },
  { name: "Ty Law", team: "patriots", era: "1990s", pos: "DB", stats: { int: 9, pd: 22, tkl: 60 }, rating: 80, notable: "Led NFL with 9 INT in 1998, shutdown corner" },
  // ---- falcons (Deion era, already 0 listed in 90s; build) ----
  { name: "Deion Sanders", team: "falcons", era: "1990s", pos: "DB", stats: { int: 7, pd: 22, tkl: 40 }, rating: 88, notable: "HOF, 'Prime Time', electric corner/returner" },
  { name: "Jessie Tuggle", team: "falcons", era: "1990s", pos: "LB", stats: { tkl: 193, sacks: 5, int: 2 }, rating: 78, notable: "'The Hammer', 5x Pro Bowl tackling machine" },
  { name: "Jamal Anderson", team: "falcons", era: "1990s", pos: "RB", stats: { ryds: 1846, rtd: 16, rec: 27 }, rating: 78, notable: "'Dirty Bird', 1,846 yds in 1998, SB XXXIII" },
  { name: "Chris Doleman", team: "falcons", era: "1990s", pos: "DL", stats: { sacks: 15, tkl: 55, ff: 3 }, rating: 79, notable: "HOF, 15-sack season at age 37 for Atlanta" },
  { name: "Terance Mathis", team: "falcons", era: "1990s", pos: "WR", stats: { rec: 111, recyds: 1342, rectd: 11 }, rating: 76, notable: "Pro Bowl 1994, Falcons receiving records, SB XXXIII" },
  { name: "Andre Rison", team: "falcons", era: "1990s", pos: "WR", stats: { rec: 93, recyds: 1242, rectd: 15 }, rating: 77, notable: "'Bad Moon', 4x Pro Bowl, 15 TD catches in 1993" },
  // ---- chargers (already 1; build) ----
  { name: "Stan Humphries", team: "chargers", era: "1990s", pos: "QB", stats: { pyds: 3209, ptd: 17, pint: 12 }, rating: 74, notable: "Led San Diego to Super Bowl XXIX" },
  { name: "Natrone Means", team: "chargers", era: "1990s", pos: "RB", stats: { ryds: 1350, rtd: 12, rec: 39 }, rating: 75, notable: "Bruising Pro Bowl back, SB XXIX run game" },
  { name: "Leslie O'Neal", team: "chargers", era: "1990s", pos: "DL", stats: { sacks: 17, tkl: 58, ff: 3 }, rating: 78, notable: "6x Pro Bowl edge rusher, Chargers sack leader" },
  { name: "Rodney Harrison", team: "chargers", era: "1990s", pos: "DB", stats: { int: 6, pd: 16, tkl: 95 }, rating: 78, notable: "Pro Bowl safety, hardest hitter in the league" },
];
