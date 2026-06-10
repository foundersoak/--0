/**
 * Curated NFL legends + offensive-line set for the all-time roster-building game.
 *
 * This hand-built dataset fills the gaps open data can't cover:
 *   - Pre-2000 skill/defense legends (QB/RB/WR/TE/DL/LB/DB) for eras
 *     1960s-1990s, where nflverse has no per-play data.
 *   - Offensive linemen (OL) for EVERY era 1960s-2020s, because OL never
 *     accumulate the box-score stats the ETL keys on, so they are absent from
 *     all open feeds and must be curated even for modern decades.
 *
 * Consumed by scripts/etl/nfl.ts, which merges these into the per-(team, era,
 * role) buckets alongside modern nflverse players.
 *
 * STAT CONVENTIONS
 *   Skill/defense stats are PER-SEASON PEAK — one representative great season,
 *   not career totals — to line up with the per-season rate stats the ETL
 *   computes for modern players.
 *   OL stats are CAREER accolades: apro = first-team All-Pro selections,
 *   pb = Pro Bowls (the only position whose stats are career, since linemen
 *   have no meaningful per-season counting stats).
 *
 * RATING (0-100, vs all-time peers at the position)
 *   90-96 inner-circle GOAT tier; 80-90 clear first-ballot HOF;
 *   70-80 very good / borderline HOF.
 *
 * Franchise slugs map each player to where he was iconic (relocated teams use
 * the modern slug: Oilers->titans, Baltimore Colts->colts, STL/LA Rams->rams,
 * Oakland/LA Raiders->raiders, SD Chargers->chargers, Washington->commanders).
 */
export interface LegendEntry {
  name: string; // "Joe Montana"
  team: string; // franchise SLUG from the allowed list
  era: string; // decade id from the allowed list
  pos: string; // one of: QB RB WR TE OL DL LB DB
  stats: Record<string, number>; // role-specific keys, see schema
  rating?: number; // 0-100 all-time relative strength
  notable?: string; // short flavor e.g. "HOF, 4x Super Bowl champ"
}

export const NFL_LEGENDS: LegendEntry[] = [
  // ===================== QUARTERBACKS =====================
  // pyds / ptd / pint  (per-season peak)
  { name: "Joe Montana", team: "49ers", era: "1980s", pos: "QB", stats: { pyds: 3630, ptd: 31, pint: 13 }, rating: 95, notable: "HOF, 4x Super Bowl champ, 3x SB MVP" },
  { name: "Joe Namath", team: "jets", era: "1960s", pos: "QB", stats: { pyds: 4007, ptd: 26, pint: 28 }, rating: 80, notable: "HOF, Super Bowl III MVP, guaranteed the win" },
  { name: "Johnny Unitas", team: "colts", era: "1960s", pos: "QB", stats: { pyds: 3481, ptd: 32, pint: 24 }, rating: 90, notable: "HOF, 3x MVP, 'The Golden Arm'" },
  { name: "Bart Starr", team: "packers", era: "1960s", pos: "QB", stats: { pyds: 2438, ptd: 16, pint: 9 }, rating: 84, notable: "HOF, 5x NFL champ, SB I & II MVP" },
  { name: "Fran Tarkenton", team: "vikings", era: "1970s", pos: "QB", stats: { pyds: 2994, ptd: 25, pint: 13 }, rating: 85, notable: "HOF, MVP, scrambling pioneer" },
  { name: "Roger Staubach", team: "cowboys", era: "1970s", pos: "QB", stats: { pyds: 2998, ptd: 23, pint: 8 }, rating: 86, notable: "HOF, 2x Super Bowl champ, 'Captain America'" },
  { name: "Terry Bradshaw", team: "steelers", era: "1970s", pos: "QB", stats: { pyds: 3724, ptd: 28, pint: 20 }, rating: 84, notable: "HOF, 4x Super Bowl champ, 2x SB MVP" },
  { name: "Ken Stabler", team: "raiders", era: "1970s", pos: "QB", stats: { pyds: 2737, ptd: 27, pint: 17 }, rating: 80, notable: "HOF, MVP, Super Bowl XI champ, 'The Snake'" },
  { name: "Bob Griese", team: "dolphins", era: "1970s", pos: "QB", stats: { pyds: 2252, ptd: 22, pint: 13 }, rating: 80, notable: "HOF, led 17-0 perfect season, 2x SB champ" },
  { name: "Dan Fouts", team: "chargers", era: "1980s", pos: "QB", stats: { pyds: 4802, ptd: 33, pint: 17 }, rating: 84, notable: "HOF, 'Air Coryell' gunslinger, 6x Pro Bowl" },
  { name: "Dan Marino", team: "dolphins", era: "1980s", pos: "QB", stats: { pyds: 5084, ptd: 48, pint: 17 }, rating: 90, notable: "HOF, MVP, 5084 yds & 48 TD in 1984" },
  { name: "John Elway", team: "broncos", era: "1990s", pos: "QB", stats: { pyds: 4030, ptd: 27, pint: 10 }, rating: 89, notable: "HOF, MVP, 2x Super Bowl champ, 'The Drive'" },
  { name: "Steve Young", team: "49ers", era: "1990s", pos: "QB", stats: { pyds: 4023, ptd: 35, pint: 10 }, rating: 89, notable: "HOF, 2x MVP, SB XXIX MVP (6 TD)" },
  { name: "Brett Favre", team: "packers", era: "1990s", pos: "QB", stats: { pyds: 4413, ptd: 39, pint: 13 }, rating: 89, notable: "HOF, 3x MVP, Super Bowl XXXI champ" },
  { name: "Troy Aikman", team: "cowboys", era: "1990s", pos: "QB", stats: { pyds: 3445, ptd: 23, pint: 14 }, rating: 83, notable: "HOF, 3x Super Bowl champ, SB XXVII MVP" },
  { name: "Warren Moon", team: "titans", era: "1990s", pos: "QB", stats: { pyds: 4690, ptd: 33, pint: 13 }, rating: 83, notable: "HOF, 9x Pro Bowl, run-and-shoot star (Oilers)" },
  { name: "Jim Kelly", team: "bills", era: "1990s", pos: "QB", stats: { pyds: 3844, ptd: 25, pint: 17 }, rating: 82, notable: "HOF, 4 straight Super Bowls, K-Gun no-huddle" },
  { name: "Joe Theismann", team: "commanders", era: "1980s", pos: "QB", stats: { pyds: 3714, ptd: 29, pint: 11 }, rating: 76, notable: "MVP, Super Bowl XVII champ (Washington)" },
  { name: "Boomer Esiason", team: "bengals", era: "1980s", pos: "QB", stats: { pyds: 3959, ptd: 28, pint: 13 }, rating: 76, notable: "MVP 1988, 4x Pro Bowl" },
  { name: "Sonny Jurgensen", team: "commanders", era: "1960s", pos: "QB", stats: { pyds: 3747, ptd: 31, pint: 24 }, rating: 80, notable: "HOF, pure passer, 5x Pro Bowl (Washington)" },
  { name: "Y.A. Tittle", team: "giants", era: "1960s", pos: "QB", stats: { pyds: 3224, ptd: 36, pint: 14 }, rating: 80, notable: "HOF, MVP, 36 TD in 1963" },
  { name: "Len Dawson", team: "chiefs", era: "1960s", pos: "QB", stats: { pyds: 2879, ptd: 30, pint: 17 }, rating: 81, notable: "HOF, Super Bowl IV MVP, AFL legend" },

  // ===================== RUNNING BACKS =====================
  // ryds / rtd / rec  (per-season peak)
  { name: "Jim Brown", team: "browns", era: "1960s", pos: "RB", stats: { ryds: 1863, rtd: 17, rec: 24 }, rating: 96, notable: "HOF, 3x MVP, led NFL in rushing 8 of 9 yrs" },
  { name: "Gale Sayers", team: "bears", era: "1960s", pos: "RB", stats: { ryds: 1231, rtd: 14, rec: 29 }, rating: 86, notable: "HOF, 'The Kansas Comet', 6 TD in a game" },
  { name: "Jim Taylor", team: "packers", era: "1960s", pos: "RB", stats: { ryds: 1474, rtd: 19, rec: 25 }, rating: 80, notable: "HOF, MVP 1962, Packers dynasty bruiser" },
  { name: "Paul Hornung", team: "packers", era: "1960s", pos: "RB", stats: { ryds: 681, rtd: 13, rec: 15 }, rating: 79, notable: "HOF, MVP 1961, 'Golden Boy', 176 pts in 1960" },
  { name: "Larry Csonka", team: "dolphins", era: "1970s", pos: "RB", stats: { ryds: 1117, rtd: 9, rec: 7 }, rating: 80, notable: "HOF, Super Bowl VIII MVP, perfect-season bull" },
  { name: "Franco Harris", team: "steelers", era: "1970s", pos: "RB", stats: { ryds: 1246, rtd: 14, rec: 28 }, rating: 82, notable: "HOF, 4x SB champ, 'Immaculate Reception'" },
  { name: "O.J. Simpson", team: "bills", era: "1970s", pos: "RB", stats: { ryds: 2003, rtd: 12, rec: 29 }, rating: 86, notable: "HOF, MVP, first to 2,000 yds (1973)" },
  { name: "Walter Payton", team: "bears", era: "1980s", pos: "RB", stats: { ryds: 1852, rtd: 11, rec: 53 }, rating: 94, notable: "HOF, MVP, 'Sweetness', all-time great" },
  { name: "Earl Campbell", team: "titans", era: "1970s", pos: "RB", stats: { ryds: 1934, rtd: 19, rec: 18 }, rating: 85, notable: "HOF, 3x MVP, 'Tyler Rose' (Oilers)" },
  { name: "Tony Dorsett", team: "cowboys", era: "1980s", pos: "RB", stats: { ryds: 1646, rtd: 13, rec: 34 }, rating: 84, notable: "HOF, Super Bowl champ, 99-yd TD run" },
  { name: "Eric Dickerson", team: "rams", era: "1980s", pos: "RB", stats: { ryds: 2105, rtd: 14, rec: 26 }, rating: 88, notable: "HOF, single-season rushing record 2,105 (1984)" },
  { name: "Marcus Allen", team: "raiders", era: "1980s", pos: "RB", stats: { ryds: 1759, rtd: 11, rec: 68 }, rating: 85, notable: "HOF, MVP, Super Bowl XVIII MVP" },
  { name: "John Riggins", team: "commanders", era: "1980s", pos: "RB", stats: { ryds: 1347, rtd: 24, rec: 5 }, rating: 79, notable: "HOF, Super Bowl XVII MVP, 'The Diesel'" },
  { name: "Barry Sanders", team: "lions", era: "1990s", pos: "RB", stats: { ryds: 2053, rtd: 11, rec: 24 }, rating: 93, notable: "HOF, MVP, 2,053 yds (1997), all-time elusive" },
  { name: "Emmitt Smith", team: "cowboys", era: "1990s", pos: "RB", stats: { ryds: 1773, rtd: 25, rec: 62 }, rating: 89, notable: "HOF, MVP, all-time rushing leader, 3x SB champ" },
  { name: "Thurman Thomas", team: "bills", era: "1990s", pos: "RB", stats: { ryds: 1407, rtd: 12, rec: 62 }, rating: 84, notable: "HOF, MVP 1991, K-Gun engine, 4x AFC champ" },
  { name: "Marshall Faulk", team: "rams", era: "2000s", pos: "RB", stats: { ryds: 1359, rtd: 12, rec: 83 }, rating: 88, notable: "HOF, MVP, 'Greatest Show on Turf'" },
  { name: "Terrell Davis", team: "broncos", era: "1990s", pos: "RB", stats: { ryds: 2008, rtd: 21, rec: 25 }, rating: 84, notable: "HOF, MVP, SB XXXII MVP, 2,008 yds (1998)" },
  { name: "Curtis Martin", team: "jets", era: "1990s", pos: "RB", stats: { ryds: 1513, rtd: 14, rec: 41 }, rating: 81, notable: "HOF, rushing title at age 31, model of consistency" },
  { name: "Jerome Bettis", team: "steelers", era: "1990s", pos: "RB", stats: { ryds: 1665, rtd: 7, rec: 27 }, rating: 80, notable: "HOF, 'The Bus', Super Bowl XL champ" },
  { name: "LaDainian Tomlinson", team: "chargers", era: "2000s", pos: "RB", stats: { ryds: 1815, rtd: 28, rec: 56 }, rating: 90, notable: "HOF, MVP, 31 total TD in 2006 (record)" },

  // ===================== WIDE RECEIVERS =====================
  // rec / recyds / rectd  (per-season peak)
  { name: "Jerry Rice", team: "49ers", era: "1990s", pos: "WR", stats: { rec: 122, recyds: 1848, rectd: 22 }, rating: 96, notable: "HOF, GOAT WR, 3x SB champ, all-time records" },
  { name: "Lance Alworth", team: "chargers", era: "1960s", pos: "WR", stats: { rec: 73, recyds: 1602, rectd: 13 }, rating: 86, notable: "HOF, 'Bambi', AFL's premier deep threat" },
  { name: "Paul Warfield", team: "browns", era: "1970s", pos: "WR", stats: { rec: 43, recyds: 886, rectd: 11 }, rating: 82, notable: "HOF, elite deep threat, perfect-season Dolphin" },
  { name: "Fred Biletnikoff", team: "raiders", era: "1970s", pos: "WR", stats: { rec: 61, recyds: 1003, rectd: 9 }, rating: 79, notable: "HOF, Super Bowl XI MVP, sure-handed" },
  { name: "Lynn Swann", team: "steelers", era: "1970s", pos: "WR", stats: { rec: 61, recyds: 880, rectd: 11 }, rating: 78, notable: "HOF, Super Bowl X MVP, acrobatic catches" },
  { name: "Steve Largent", team: "seahawks", era: "1980s", pos: "WR", stats: { rec: 79, recyds: 1287, rectd: 8 }, rating: 84, notable: "HOF, held career receiving records, 7x Pro Bowl" },
  { name: "Art Monk", team: "commanders", era: "1980s", pos: "WR", stats: { rec: 106, recyds: 1372, rectd: 5 }, rating: 80, notable: "HOF, 3x SB champ, once held single-season rec record" },
  { name: "James Lofton", team: "packers", era: "1980s", pos: "WR", stats: { rec: 71, recyds: 1361, rectd: 8 }, rating: 80, notable: "HOF, 8x Pro Bowl, deep-ball master" },
  { name: "Andre Reed", team: "bills", era: "1990s", pos: "WR", stats: { rec: 90, recyds: 1312, rectd: 8 }, rating: 80, notable: "HOF, 7x Pro Bowl, K-Gun, 4x AFC champ" },
  { name: "Michael Irvin", team: "cowboys", era: "1990s", pos: "WR", stats: { rec: 111, recyds: 1603, rectd: 7 }, rating: 83, notable: "HOF, 'The Playmaker', 3x SB champ" },
  { name: "Cris Carter", team: "vikings", era: "1990s", pos: "WR", stats: { rec: 122, recyds: 1371, rectd: 13 }, rating: 85, notable: "HOF, 8x Pro Bowl, 'All he does is catch TDs'" },
  { name: "Tim Brown", team: "raiders", era: "1990s", pos: "WR", stats: { rec: 104, recyds: 1408, rectd: 9 }, rating: 82, notable: "HOF, 9x Pro Bowl, 'Mr. Raider'" },
  { name: "Randy Moss", team: "vikings", era: "1990s", pos: "WR", stats: { rec: 80, recyds: 1437, rectd: 17 }, rating: 90, notable: "HOF, 'Straight Cash', deep-threat phenom" },
  { name: "Marvin Harrison", team: "colts", era: "2000s", pos: "WR", stats: { rec: 143, recyds: 1722, rectd: 11 }, rating: 89, notable: "HOF, 143 catches (2002 record), Manning's target" },
  { name: "Isaac Bruce", team: "rams", era: "1990s", pos: "WR", stats: { rec: 119, recyds: 1781, rectd: 13 }, rating: 81, notable: "HOF, 'Greatest Show on Turf', SB XXXIV TD" },

  // ===================== TIGHT ENDS =====================
  // rec / recyds / rectd  (per-season peak)
  { name: "John Mackey", team: "colts", era: "1960s", pos: "TE", stats: { rec: 55, recyds: 829, rectd: 9 }, rating: 84, notable: "HOF, revolutionized the TE position" },
  { name: "Mike Ditka", team: "bears", era: "1960s", pos: "TE", stats: { rec: 75, recyds: 1076, rectd: 12 }, rating: 82, notable: "HOF, first TE inducted, then SB-winning coach" },
  { name: "Kellen Winslow", team: "chargers", era: "1980s", pos: "TE", stats: { rec: 89, recyds: 1290, rectd: 10 }, rating: 86, notable: "HOF, redefined TE in Air Coryell, 'The Catch' game" },
  { name: "Ozzie Newsome", team: "browns", era: "1980s", pos: "TE", stats: { rec: 89, recyds: 1002, rectd: 5 }, rating: 83, notable: "HOF, 'The Wizard', then HOF executive" },
  { name: "Shannon Sharpe", team: "broncos", era: "1990s", pos: "TE", stats: { rec: 102, recyds: 1107, rectd: 10 }, rating: 84, notable: "HOF, 3x SB champ, redefined receiving TE" },
  { name: "Dave Casper", team: "raiders", era: "1970s", pos: "TE", stats: { rec: 53, recyds: 771, rectd: 9 }, rating: 79, notable: "HOF, 'Ghost to the Post', 4x Pro Bowl" },
  { name: "Jackie Smith", team: "cardinals", era: "1960s", pos: "TE", stats: { rec: 56, recyds: 1205, rectd: 9 }, rating: 76, notable: "HOF, prolific receiving TE (St. Louis Cardinals)" },

  // ===================== DEFENSIVE LINE =====================
  // sacks / tkl / ff  (per-season peak)
  { name: "Reggie White", team: "eagles", era: "1980s", pos: "DL", stats: { sacks: 21, tkl: 76, ff: 4 }, rating: 95, notable: "HOF, 'Minister of Defense', 2x DPOY" },
  { name: "Deacon Jones", team: "rams", era: "1960s", pos: "DL", stats: { sacks: 22, tkl: 70, ff: 3 }, rating: 92, notable: "HOF, coined 'sack', 'Fearsome Foursome'" },
  { name: "Bob Lilly", team: "cowboys", era: "1960s", pos: "DL", stats: { sacks: 12, tkl: 80, ff: 3 }, rating: 89, notable: "HOF, 'Mr. Cowboy', dominant DT" },
  { name: "Gino Marchetti", team: "colts", era: "1960s", pos: "DL", stats: { sacks: 14, tkl: 78, ff: 3 }, rating: 88, notable: "HOF, greatest DE of his era, 11x Pro Bowl (Baltimore)" },
  { name: "Merlin Olsen", team: "rams", era: "1960s", pos: "DL", stats: { sacks: 11, tkl: 85, ff: 2 }, rating: 88, notable: "HOF, 14x Pro Bowl, 'Fearsome Foursome'" },
  { name: "Alan Page", team: "vikings", era: "1970s", pos: "DL", stats: { sacks: 15, tkl: 90, ff: 4 }, rating: 89, notable: "HOF, MVP 1971, 'Purple People Eaters'" },
  { name: "Mean Joe Greene", team: "steelers", era: "1970s", pos: "DL", stats: { sacks: 13, tkl: 80, ff: 4 }, rating: 91, notable: "HOF, 2x DPOY, anchor of the Steel Curtain" },
  { name: "Randy White", team: "cowboys", era: "1970s", pos: "DL", stats: { sacks: 16, tkl: 88, ff: 3 }, rating: 86, notable: "HOF, 'Manster', Super Bowl XII co-MVP" },
  { name: "Howie Long", team: "raiders", era: "1980s", pos: "DL", stats: { sacks: 13, tkl: 75, ff: 4 }, rating: 83, notable: "HOF, 8x Pro Bowl, disruptive DE" },
  { name: "Bruce Smith", team: "bills", era: "1990s", pos: "DL", stats: { sacks: 19, tkl: 78, ff: 5 }, rating: 92, notable: "HOF, all-time sack leader (200), 2x DPOY" },
  { name: "Jack Youngblood", team: "rams", era: "1970s", pos: "DL", stats: { sacks: 16, tkl: 82, ff: 3 }, rating: 84, notable: "HOF, 7x Pro Bowl, played SB on broken leg" },
  { name: "Lee Roy Selmon", team: "buccaneers", era: "1970s", pos: "DL", stats: { sacks: 11, tkl: 78, ff: 4 }, rating: 81, notable: "HOF, DPOY 1979, first Buc in Canton" },
  { name: "John Randle", team: "vikings", era: "1990s", pos: "DL", stats: { sacks: 15.5, tkl: 70, ff: 3 }, rating: 84, notable: "HOF, 7x Pro Bowl, dominant interior rusher" },
  { name: "Cortez Kennedy", team: "seahawks", era: "1990s", pos: "DL", stats: { sacks: 14, tkl: 92, ff: 3 }, rating: 83, notable: "HOF, DPOY 1992 on a 2-14 team" },
  { name: "Warren Sapp", team: "buccaneers", era: "1990s", pos: "DL", stats: { sacks: 16.5, tkl: 78, ff: 3 }, rating: 85, notable: "HOF, DPOY 1999, SB XXXVII champ" },
  { name: "Buck Buchanan", team: "chiefs", era: "1960s", pos: "DL", stats: { sacks: 12, tkl: 80, ff: 2 }, rating: 81, notable: "HOF, AFL legend, dominant DT, SB IV champ" },
  { name: "Claude Humphrey", team: "falcons", era: "1970s", pos: "DL", stats: { sacks: 14.5, tkl: 72, ff: 3 }, rating: 81, notable: "HOF, DROY 1968, 6x Pro Bowl, Falcons sack artist" },
  { name: "Michael Strahan", team: "giants", era: "2000s", pos: "DL", stats: { sacks: 22.5, tkl: 68, ff: 4 }, rating: 88, notable: "HOF, single-season sack record (22.5), SB XLII" },

  // ===================== LINEBACKERS =====================
  // tkl / sacks / int  (per-season peak)
  { name: "Lawrence Taylor", team: "giants", era: "1980s", pos: "LB", stats: { tkl: 105, sacks: 20.5, int: 1 }, rating: 95, notable: "HOF, MVP 1986, 3x DPOY, redefined pass rush" },
  { name: "Dick Butkus", team: "bears", era: "1960s", pos: "LB", stats: { tkl: 145, sacks: 6, int: 3 }, rating: 92, notable: "HOF, fiercest MLB ever, 8x Pro Bowl" },
  { name: "Ray Nitschke", team: "packers", era: "1960s", pos: "LB", stats: { tkl: 130, sacks: 5, int: 3 }, rating: 86, notable: "HOF, Packers dynasty MLB, 5x NFL champ" },
  { name: "Willie Lanier", team: "chiefs", era: "1970s", pos: "LB", stats: { tkl: 135, sacks: 4, int: 4 }, rating: 84, notable: "HOF, 'Contact', SB IV champ, 8x Pro Bowl" },
  { name: "Jack Ham", team: "steelers", era: "1970s", pos: "LB", stats: { tkl: 100, sacks: 5, int: 5 }, rating: 86, notable: "HOF, 8x Pro Bowl, Steel Curtain OLB" },
  { name: "Jack Lambert", team: "steelers", era: "1970s", pos: "LB", stats: { tkl: 146, sacks: 4, int: 6 }, rating: 88, notable: "HOF, DPOY 1976, 4x SB champ, intimidator" },
  { name: "Ted Hendricks", team: "raiders", era: "1970s", pos: "LB", stats: { tkl: 95, sacks: 7, int: 5 }, rating: 82, notable: "HOF, 'The Mad Stork', 4x SB champ" },
  { name: "Mike Singletary", team: "bears", era: "1980s", pos: "LB", stats: { tkl: 150, sacks: 3, int: 2 }, rating: 87, notable: "HOF, 2x DPOY, '46 defense' QB, 'Samurai Mike'" },
  { name: "Randy Gradishar", team: "broncos", era: "1970s", pos: "LB", stats: { tkl: 178, sacks: 3, int: 4 }, rating: 80, notable: "HOF, DPOY 1978, 'Orange Crush' anchor" },
  { name: "Junior Seau", team: "chargers", era: "1990s", pos: "LB", stats: { tkl: 155, sacks: 5.5, int: 2 }, rating: 88, notable: "HOF, 12x Pro Bowl, tackling machine" },
  { name: "Derrick Thomas", team: "chiefs", era: "1990s", pos: "LB", stats: { tkl: 90, sacks: 20, int: 1 }, rating: 85, notable: "HOF, 7 sacks in one game, edge terror" },
  { name: "Bobby Bell", team: "chiefs", era: "1960s", pos: "LB", stats: { tkl: 110, sacks: 5, int: 3 }, rating: 83, notable: "HOF, 9x Pro Bowl, supreme athlete, SB IV" },
  { name: "Sam Huff", team: "giants", era: "1960s", pos: "LB", stats: { tkl: 120, sacks: 4, int: 3 }, rating: 79, notable: "HOF, defined the glamorous MLB era" },
  { name: "Kevin Greene", team: "steelers", era: "1990s", pos: "LB", stats: { tkl: 88, sacks: 14, int: 1 }, rating: 82, notable: "HOF, 160 career sacks (3rd all-time)" },

  // ===================== DEFENSIVE BACKS =====================
  // int / pd / tkl  (per-season peak)
  { name: "Ronnie Lott", team: "49ers", era: "1980s", pos: "DB", stats: { int: 10, pd: 18, tkl: 89 }, rating: 92, notable: "HOF, 4x SB champ, hardest-hitting safety ever" },
  { name: "Night Train Lane", team: "lions", era: "1960s", pos: "DB", stats: { int: 10, pd: 16, tkl: 70 }, rating: 88, notable: "HOF, rookie-record 14 INT, fearsome tackler" },
  { name: "Mel Blount", team: "steelers", era: "1970s", pos: "DB", stats: { int: 11, pd: 20, tkl: 65 }, rating: 87, notable: "HOF, DPOY 1975, 'Mel Blount Rule' namesake" },
  { name: "Willie Brown", team: "raiders", era: "1970s", pos: "DB", stats: { int: 7, pd: 17, tkl: 55 }, rating: 82, notable: "HOF, 75-yd SB XI pick-six, shutdown corner" },
  { name: "Ken Houston", team: "commanders", era: "1970s", pos: "DB", stats: { int: 9, pd: 15, tkl: 90 }, rating: 82, notable: "HOF, 12x Pro Bowl safety (Washington)" },
  { name: "Mike Haynes", team: "patriots", era: "1980s", pos: "DB", stats: { int: 8, pd: 18, tkl: 58 }, rating: 84, notable: "HOF, 9x Pro Bowl, shutdown corner" },
  { name: "Rod Woodson", team: "steelers", era: "1990s", pos: "DB", stats: { int: 8, pd: 22, tkl: 90 }, rating: 89, notable: "HOF, DPOY 1993, 71 career INT, returner" },
  { name: "Deion Sanders", team: "cowboys", era: "1990s", pos: "DB", stats: { int: 7, pd: 24, tkl: 45 }, rating: 92, notable: "HOF, DPOY 1994, 'Prime Time', 2x SB champ" },
  { name: "Darrell Green", team: "commanders", era: "1990s", pos: "DB", stats: { int: 6, pd: 20, tkl: 70 }, rating: 85, notable: "HOF, 7x Pro Bowl, fastest man in NFL (Washington)" },
  { name: "Aeneas Williams", team: "cardinals", era: "1990s", pos: "DB", stats: { int: 9, pd: 21, tkl: 75 }, rating: 83, notable: "HOF, 8x Pro Bowl, 55 career INT" },
  { name: "Willie Wood", team: "packers", era: "1960s", pos: "DB", stats: { int: 9, pd: 15, tkl: 65 }, rating: 81, notable: "HOF, SB I interception, Packers dynasty safety" },
  { name: "Herb Adderley", team: "packers", era: "1960s", pos: "DB", stats: { int: 7, pd: 16, tkl: 55 }, rating: 82, notable: "HOF, 5x NFL champ, pick-six in SB II" },
  { name: "Larry Wilson", team: "cardinals", era: "1960s", pos: "DB", stats: { int: 10, pd: 14, tkl: 80 }, rating: 82, notable: "HOF, invented the safety blitz, 8x Pro Bowl" },
  { name: "Lem Barney", team: "lions", era: "1970s", pos: "DB", stats: { int: 10, pd: 17, tkl: 60 }, rating: 80, notable: "HOF, DROY 1967, 7x Pro Bowl, returner" },
  { name: "Ed Reed", team: "ravens", era: "2000s", pos: "DB", stats: { int: 9, pd: 19, tkl: 70 }, rating: 90, notable: "HOF, DPOY 2004, ball-hawking free safety" },

  // ===================== OFFENSIVE LINEMEN (ALL ERAS) =====================
  // apro / pb  (career: first-team All-Pro selections / Pro Bowls)
  // ---- 1960s ----
  { name: "Jim Parker", team: "colts", era: "1960s", pos: "OL", stats: { apro: 8, pb: 8 }, rating: 88, notable: "HOF, first full-time lineman inducted (Baltimore)" },
  { name: "Forrest Gregg", team: "packers", era: "1960s", pos: "OL", stats: { apro: 7, pb: 9 }, rating: 87, notable: "HOF, Lombardi's 'finest player', 9x Pro Bowl" },
  { name: "Jim Otto", team: "raiders", era: "1960s", pos: "OL", stats: { apro: 10, pb: 12 }, rating: 85, notable: "HOF, '00', every AFL All-Star, iron-man center" },
  { name: "Ron Mix", team: "chargers", era: "1960s", pos: "OL", stats: { apro: 8, pb: 9 }, rating: 83, notable: "HOF, 'The Intellectual Assassin', AFL tackle" },
  // ---- 1970s ----
  { name: "Art Shell", team: "raiders", era: "1970s", pos: "OL", stats: { apro: 2, pb: 8 }, rating: 84, notable: "HOF, anchor LT of the Raiders, later head coach" },
  { name: "Gene Upshaw", team: "raiders", era: "1970s", pos: "OL", stats: { apro: 5, pb: 7 }, rating: 84, notable: "HOF, pulling guard, only OL with 3 SB-era decades" },
  { name: "Larry Little", team: "dolphins", era: "1970s", pos: "OL", stats: { apro: 5, pb: 5 }, rating: 82, notable: "HOF, guard for the perfect-season Dolphins" },
  { name: "Mike Webster", team: "steelers", era: "1970s", pos: "OL", stats: { apro: 5, pb: 9 }, rating: 86, notable: "HOF, 'Iron Mike', center of 4x SB Steelers" },
  { name: "Ron Yary", team: "vikings", era: "1970s", pos: "OL", stats: { apro: 6, pb: 7 }, rating: 82, notable: "HOF, #1 overall pick, Purple People Eaters-era tackle" },
  { name: "Dwight Stephenson", team: "dolphins", era: "1980s", pos: "OL", stats: { apro: 4, pb: 5 }, rating: 85, notable: "HOF, best center of his era before injury" },
  // ---- 1980s ----
  { name: "Anthony Munoz", team: "bengals", era: "1980s", pos: "OL", stats: { apro: 9, pb: 11 }, rating: 92, notable: "HOF, greatest OT ever, 11x Pro Bowl" },
  { name: "John Hannah", team: "patriots", era: "1980s", pos: "OL", stats: { apro: 7, pb: 9 }, rating: 90, notable: "HOF, 'best OL ever' (SI), dominant guard" },
  { name: "Mike Munchak", team: "titans", era: "1980s", pos: "OL", stats: { apro: 3, pb: 9 }, rating: 82, notable: "HOF, Oilers guard, 9x Pro Bowl" },
  { name: "Joe DeLamielleure", team: "bills", era: "1970s", pos: "OL", stats: { apro: 6, pb: 6 }, rating: 82, notable: "HOF, blocked for O.J.'s 2,000-yd season" },
  // ---- 1990s ----
  { name: "Bruce Matthews", team: "titans", era: "1990s", pos: "OL", stats: { apro: 7, pb: 14 }, rating: 90, notable: "HOF, 14x Pro Bowl, every OL spot (Oilers/Titans)" },
  { name: "Randall McDaniel", team: "vikings", era: "1990s", pos: "OL", stats: { apro: 7, pb: 12 }, rating: 86, notable: "HOF, 12x Pro Bowl, freakishly athletic guard" },
  { name: "Larry Allen", team: "cowboys", era: "1990s", pos: "OL", stats: { apro: 7, pb: 11 }, rating: 90, notable: "HOF, strongest man in the NFL, 11x Pro Bowl" },
  { name: "Willie Roaf", team: "saints", era: "1990s", pos: "OL", stats: { apro: 7, pb: 11 }, rating: 88, notable: "HOF, 11x Pro Bowl LT, Saints then Chiefs" },
  { name: "Jackie Slater", team: "rams", era: "1990s", pos: "OL", stats: { apro: 2, pb: 7 }, rating: 80, notable: "HOF, 20 seasons at tackle for the Rams" },
  // ---- 2000s ----
  { name: "Jonathan Ogden", team: "ravens", era: "2000s", pos: "OL", stats: { apro: 4, pb: 11 }, rating: 90, notable: "HOF, first-ever Raven draftee, dominant LT" },
  { name: "Walter Jones", team: "seahawks", era: "2000s", pos: "OL", stats: { apro: 4, pb: 9 }, rating: 90, notable: "HOF, flawless LT, rarely allowed a sack" },
  { name: "Orlando Pace", team: "rams", era: "2000s", pos: "OL", stats: { apro: 3, pb: 7 }, rating: 87, notable: "HOF, 'pancake' LT, Greatest Show on Turf" },
  { name: "Alan Faneca", team: "steelers", era: "2000s", pos: "OL", stats: { apro: 6, pb: 9 }, rating: 86, notable: "HOF, 9x Pro Bowl guard, SB XL champ" },
  { name: "Steve Hutchinson", team: "seahawks", era: "2000s", pos: "OL", stats: { apro: 5, pb: 7 }, rating: 85, notable: "HOF, mauling guard, helped Alexander's MVP year" },
  { name: "Will Shields", team: "chiefs", era: "2000s", pos: "OL", stats: { apro: 2, pb: 12 }, rating: 83, notable: "HOF, 12 straight Pro Bowls at guard" },
  // ---- 2010s ----
  { name: "Joe Thomas", team: "browns", era: "2010s", pos: "OL", stats: { apro: 6, pb: 10 }, rating: 90, notable: "HOF, 10,000+ consecutive snaps, elite LT" },
  { name: "Marshal Yanda", team: "ravens", era: "2010s", pos: "OL", stats: { apro: 2, pb: 8 }, rating: 84, notable: "8x Pro Bowl guard, SB XLVII champ" },
  { name: "Jason Peters", team: "eagles", era: "2010s", pos: "OL", stats: { apro: 2, pb: 9 }, rating: 84, notable: "9x Pro Bowl LT, anchor of the Eagles line" },
  { name: "Zack Martin", team: "cowboys", era: "2010s", pos: "OL", stats: { apro: 7, pb: 9 }, rating: 87, notable: "All-Pro guard every healthy year of his career" },
  { name: "Tyron Smith", team: "cowboys", era: "2010s", pos: "OL", stats: { apro: 2, pb: 8 }, rating: 84, notable: "8x Pro Bowl LT, premier pass protector" },
  { name: "Maurkice Pouncey", team: "steelers", era: "2010s", pos: "OL", stats: { apro: 2, pb: 9 }, rating: 82, notable: "9x Pro Bowl center, Steelers anchor" },
  { name: "Matthew Slater", team: "patriots", era: "2010s", pos: "OL", stats: { apro: 0, pb: 10 }, rating: 76, notable: "10x Pro Bowl special-teams captain, 3x SB champ" },
  // ---- 2020s ----
  { name: "Quenton Nelson", team: "colts", era: "2020s", pos: "OL", stats: { apro: 3, pb: 6 }, rating: 86, notable: "All-Pro guard from his rookie year, road grader" },
  { name: "Trent Williams", team: "49ers", era: "2020s", pos: "OL", stats: { apro: 4, pb: 11 }, rating: 88, notable: "11x Pro Bowl LT, dominant athlete" },
  { name: "Lane Johnson", team: "eagles", era: "2020s", pos: "OL", stats: { apro: 2, pb: 4 }, rating: 84, notable: "Elite RT, anchor of Eagles' dominant line" },
  { name: "Jason Kelce", team: "eagles", era: "2020s", pos: "OL", stats: { apro: 6, pb: 7 }, rating: 85, notable: "6x All-Pro center, redefined the position athletically" },
  { name: "Creed Humphrey", team: "chiefs", era: "2020s", pos: "OL", stats: { apro: 1, pb: 2 }, rating: 78, notable: "Top-rated center, anchor of Chiefs' dynasty line" },
  { name: "Penei Sewell", team: "lions", era: "2020s", pos: "OL", stats: { apro: 2, pb: 3 }, rating: 84, notable: "All-Pro RT, cornerstone of the Lions' resurgence" },
];
