import type { SportId } from "@/engine/types";

export interface RecordEntry {
  team: string;
  season: string;
  record: string;
  blurb: string;
}

export interface Guide {
  slug: string;
  sport: SportId;
  /** <title> tag, search-intent led. */
  metaTitle: string;
  /** H1 / display title. */
  title: string;
  description: string;
  published: string; // ISO date
  /** Intro paragraphs. */
  intro: string[];
  records: RecordEntry[];
  /** Sentence above the play button. */
  cta: string;
  /** References for the records cited (originals written here; facts verified against these). */
  sources: { label: string; url: string }[];
}

export const GUIDES: Guide[] = [
  {
    slug: "best-nba-records-perfect-season",
    sport: "nba",
    metaTitle: "Best NBA Records Ever: The Closest to a Perfect 82-0 Season",
    title: "The Best NBA Records Ever (and Why Nobody Has Gone 82-0)",
    description:
      "No NBA team has ever gone 82-0. These five record-setting seasons came closest, from the 73-9 Warriors to the 72-10 Bulls. Can your all-time roster do what they couldn't?",
    published: "2026-06-09",
    intro: [
      "An undefeated NBA season, 82 wins and zero losses, has never happened, and it almost certainly never will. The schedule is long, the travel is brutal, and the league is too deep for any team to escape 82 games unscathed.",
      "But a handful of teams pushed the limit of what is possible. Here are the five best regular seasons in NBA history, the closest anyone has come to perfection.",
    ],
    records: [
      { team: "Golden State Warriors", season: "2015-16", record: "73-9", blurb: "The best regular-season record ever, led by a unanimous-MVP Stephen Curry. They won 73 of 82 and still didn't win the title." },
      { team: "Chicago Bulls", season: "1995-96", record: "72-10", blurb: "Michael Jordan's return-season juggernaut set the standard for two decades and capped it with a championship." },
      { team: "Los Angeles Lakers", season: "1971-72", record: "69-13", blurb: "Home to a 33-game winning streak that still stands as the longest in major North American pro sports." },
      { team: "Chicago Bulls", season: "1996-97", record: "69-13", blurb: "The encore to 72-10, nearly as dominant, and another ring." },
      { team: "Philadelphia 76ers", season: "1966-67", record: "68-13", blurb: "Wilt Chamberlain's most complete team finally broke the Celtics' dynasty." },
    ],
    cta: "82 and 0 has never been done. Build an all-time starting five and find out if you can pull it off.",
    sources: [
      { label: "Wikipedia: 2015-16 Golden State Warriors season", url: "https://en.wikipedia.org/wiki/2015%E2%80%9316_Golden_State_Warriors_season" },
      { label: "Wikipedia: 1995-96 Chicago Bulls season", url: "https://en.wikipedia.org/wiki/1995%E2%80%9396_Chicago_Bulls_season" },
    ],
  },
  {
    slug: "perfect-nfl-season-undefeated",
    sport: "nfl",
    metaTitle: "Has Any NFL Team Gone Undefeated? Every Perfect Season",
    title: "Has Any NFL Team Gone Undefeated? The Quest for a Perfect Season",
    description:
      "Only one NFL team ever finished a season perfect. These are the closest runs at an undefeated season, and why 17-0 has never happened.",
    published: "2026-06-09",
    intro: [
      "In over a century of pro football, exactly one team has finished a season without a loss. Perfection in the NFL is so rare it has become legend.",
      "And with the move to a 17-game regular season in 2021, a true 17-0 has still never been achieved. These five teams came the closest.",
    ],
    records: [
      { team: "Miami Dolphins", season: "1972", record: "17-0", blurb: "The only perfect season in NFL history: 14-0 in the (then 14-game) regular season plus three playoff wins and a Super Bowl." },
      { team: "New England Patriots", season: "2007", record: "16-0", blurb: "The only 16-0 regular season, before they lost Super Bowl XLII one win short of immortality." },
      { team: "Chicago Bears", season: "1985", record: "15-1", blurb: "One of the most dominant teams ever, with a lone loss the only blemish before a Super Bowl rout." },
      { team: "San Francisco 49ers", season: "1984", record: "15-1", blurb: "18-1 overall, with a championship to match." },
      { team: "Green Bay Packers", season: "1962", record: "13-1", blurb: "Lombardi's powerhouse at its peak." },
    ],
    cta: "No team has ever gone 17-0. Draft a roster of legends and chase the perfect season.",
    sources: [
      { label: "Wikipedia: Perfect season (NFL)", url: "https://en.wikipedia.org/wiki/Perfect_season" },
      { label: "Wikipedia: 2007 New England Patriots season", url: "https://en.wikipedia.org/wiki/2007_New_England_Patriots_season" },
    ],
  },
  {
    slug: "best-mlb-records-most-wins",
    sport: "mlb",
    metaTitle: "Best MLB Records of All Time: Most Wins in a Season",
    title: "The Best MLB Records Ever: The Closest to a Perfect 162-0",
    description:
      "162-0 is baseball fantasy. These teams set the real records for wins and win percentage, from the 116-win Cubs and Mariners to the '98 Yankees.",
    published: "2026-06-09",
    intro: [
      "A 162-game baseball season makes 162-0 a mathematical fantasy. Even the best teams lose 40-plus games, and the grind is the whole point.",
      "Still, a few teams rewrote the record books. Here are the greatest regular seasons in MLB history.",
    ],
    records: [
      { team: "Chicago Cubs", season: "1906", record: "116-36", blurb: "The best winning percentage (.763) of the modern era, and, incredibly, they lost the World Series." },
      { team: "Seattle Mariners", season: "2001", record: "116-46", blurb: "Tied the all-time wins record behind Ichiro's MVP debut." },
      { team: "New York Yankees", season: "1998", record: "114-48", blurb: "Often called the greatest team ever, and they rolled to the title." },
      { team: "Cleveland Indians", season: "1954", record: "111-43", blurb: "Broke the AL wins record, then got swept in the Series." },
      { team: "Los Angeles Dodgers", season: "2022", record: "111-51", blurb: "The modern National League benchmark." },
    ],
    cta: "Build a lineup of all-time greats and an ace rotation, then chase the impossible: 162-0.",
    sources: [
      { label: "Wikipedia: 1906 Chicago Cubs season", url: "https://en.wikipedia.org/wiki/1906_Chicago_Cubs_season" },
      { label: "Wikipedia: 2001 Seattle Mariners season", url: "https://en.wikipedia.org/wiki/2001_Seattle_Mariners_season" },
    ],
  },
  {
    slug: "best-nhl-records-fewest-losses",
    sport: "nhl",
    metaTitle: "Best NHL Records Ever: Fewest Losses and Most Wins",
    title: "The Best NHL Seasons Ever: The Closest to a Perfect 82-0",
    description:
      "No NHL team has gone 82-0, but the 1976-77 Canadiens lost just eight games. The greatest seasons in hockey history.",
    published: "2026-06-09",
    intro: [
      "An 82-0 hockey season is a fantasy, but one team got eerily close to never losing at all.",
      "These are the greatest regular seasons in NHL history, measured by the two things that matter most: wins, and the losses they avoided.",
    ],
    records: [
      { team: "Montreal Canadiens", season: "1976-77", record: "60-8-12", blurb: "132 points and a staggering eight losses in 80 games, the fewest ever, en route to one of four straight Cups." },
      { team: "Detroit Red Wings", season: "1995-96", record: "62-13-7", blurb: "The most wins in a season (62), a mark that stood for over two decades." },
      { team: "Tampa Bay Lightning", season: "2018-19", record: "62-16-4", blurb: "Tied the wins record, then got swept in round one." },
      { team: "Boston Bruins", season: "1929-30", record: "38-5-1", blurb: "An .875 points percentage, the best ever in a season." },
      { team: "Montreal Canadiens", season: "1977-78", record: "59-10-11", blurb: "More dynasty dominance from the greatest run in hockey history." },
    ],
    cta: "82-0 has never been done on ice. Build the unbeatable line and find out if you can.",
    sources: [
      { label: "Wikipedia: 1976-77 Montreal Canadiens season", url: "https://en.wikipedia.org/wiki/1976%E2%80%9377_Montreal_Canadiens_season" },
      { label: "Wikipedia: 1995-96 Detroit Red Wings season", url: "https://en.wikipedia.org/wiki/1995%E2%80%9396_Detroit_Red_Wings_season" },
    ],
  },
  {
    slug: "greatest-undefeated-college-football-seasons",
    sport: "cfb",
    metaTitle: "The Greatest Undefeated College Football Seasons Ever",
    title: "The Greatest Undefeated College Football Seasons of All Time",
    description:
      "Unlike the pros, college teams do go perfect. These are the greatest undefeated national champions, from 1995 Nebraska to 2019 LSU.",
    published: "2026-06-09",
    intro: [
      "Perfection is rare in pro sports, but in college football it happens. A perfect season is often the price of a national title.",
      "These five undefeated teams are among the greatest ever to do it.",
    ],
    records: [
      { team: "LSU", season: "2019", record: "15-0", blurb: "Joe Burrow's record-shattering offense ran the table through maybe the toughest schedule ever assembled." },
      { team: "Nebraska", season: "1995", record: "12-0", blurb: "Possibly the most dominant team in college football history, winning by an average of nearly 40 points." },
      { team: "Clemson", season: "2018", record: "15-0", blurb: "Trevor Lawrence's freshman champions dismantled Alabama in the final." },
      { team: "Miami", season: "2001", record: "12-0", blurb: "A roster that produced a record number of future NFL first-round picks." },
      { team: "Nebraska", season: "1971", record: "13-0", blurb: "Back-to-back titles and the original Game of the Century." },
    ],
    cta: "12-0 has been done. Build an all-time college roster and join the immortals.",
    sources: [
      { label: "Wikipedia: List of undefeated NCAA Division I football teams", url: "https://en.wikipedia.org/wiki/List_of_undefeated_NCAA_Division_I_football_teams" },
      { label: "Wikipedia: 2019 LSU Tigers football team", url: "https://en.wikipedia.org/wiki/2019_LSU_Tigers_football_team" },
    ],
  },
  {
    slug: "arsenal-invincibles-best-premier-league-seasons",
    sport: "epl",
    metaTitle: "The Invincibles and the Best Premier League Seasons Ever",
    title: "The Invincibles: The Closest to a Perfect Premier League Season",
    description:
      "Only one team went a Premier League season unbeaten: Arsenal's 2003-04 Invincibles. The greatest EPL seasons and the chase for 38-0.",
    published: "2026-06-09",
    intro: [
      "No Premier League team has ever gone 38-0. But one came as close as anyone ever has, going an entire 38-game season without a single defeat.",
      "Here are the greatest Premier League campaigns of all time.",
    ],
    records: [
      { team: "Arsenal", season: "2003-04", record: "26W-12D-0L", blurb: "The Invincibles: the only team to go a full Premier League season unbeaten. Not quite 38-0, but 38 without a loss." },
      { team: "Manchester City", season: "2017-18", record: "100 pts", blurb: "The only team to reach 100 points, winning 32 of 38." },
      { team: "Manchester City", season: "2018-19", record: "98 pts", blurb: "Won 14 in a row to edge Liverpool's 97." },
      { team: "Chelsea", season: "2004-05", record: "95 pts", blurb: "Mourinho's first title and the meanest defense the league has ever seen, with 15 goals conceded." },
      { team: "Liverpool", season: "2019-20", record: "99 pts", blurb: "Ended a 30-year wait with the second-highest points total ever." },
    ],
    cta: "Nobody has gone 38-0. Build an all-time XI and chase the perfect season.",
    sources: [
      { label: "Wikipedia: 2003-04 Arsenal F.C. season (The Invincibles)", url: "https://en.wikipedia.org/wiki/2003%E2%80%9304_Arsenal_F.C._season" },
      { label: "Wikipedia: List of Premier League seasons", url: "https://en.wikipedia.org/wiki/List_of_Premier_League_seasons" },
    ],
  },
];

export const getGuide = (slug: string): Guide | undefined => GUIDES.find((g) => g.slug === slug);
