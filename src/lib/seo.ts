/**
 * Structured-data (schema.org) builders. Kept in one place so every page emits
 * consistent JSON-LD that cross-references the same Organization/WebSite nodes
 * via stable @ids.
 */
import type { SportConfig } from "@/engine/types";
import { BRAND } from "./brand";

const ORG_ID = `${BRAND.url}/#org`;
const SITE_ID = `${BRAND.url}/#website`;

/** Sitewide Organization + WebSite nodes (emit once, in the root layout). */
export function siteGraph() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": ORG_ID,
      name: BRAND.name,
      url: BRAND.url,
      description: BRAND.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": SITE_ID,
      name: BRAND.name,
      url: BRAND.url,
      description: BRAND.description,
      publisher: { "@id": ORG_ID },
      inLanguage: "en",
    },
  ];
}

/** A BreadcrumbList from {name, path} crumbs (path is root-relative). */
export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${BRAND.url}${it.path}`,
    })),
  };
}

/** VideoGame node for a playable sport. */
export function videoGame(config: SportConfig, sportId: string) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: `${config.brand}, ${config.name} All-Time Roster Game`,
    description: config.tagline,
    url: `${BRAND.url}/${sportId}`,
    inLanguage: "en",
    genre: ["Sports", "Trivia"],
    gamePlatform: "Web browser",
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    publisher: { "@id": ORG_ID },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export interface QA {
  q: string;
  a: string;
}

/** FAQPage node from question/answer pairs. */
export function faqPage(qas: QA[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map((qa) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: { "@type": "Answer", text: qa.a },
    })),
  };
}

/** Game-mechanics FAQ for a sport (accurate for every league, no historical claims). */
export function faqsFor(c: SportConfig): QA[] {
  const cats = c.scoring.categories.map((x) => x.label);
  const catList =
    cats.length > 2
      ? `${cats.slice(0, -1).join(", ")}, and ${cats[cats.length - 1]}`
      : cats.join(" and ");
  return [
    {
      q: `How do you play ${c.brand} ${c.name}?`,
      a: `Each round a slot machine gives you a random franchise and era. You pick one real player from that team and era and slot him at a position he actually played. Fill all ${c.positions.length} roster spots, then your lineup is run through a full ${c.seasonGames}-game season simulation to see how close you get to a perfect ${c.brand}.`,
    },
    {
      q: `How is my roster scored in ${c.brand}?`,
      a: `Each player's real stats are adjusted for their era so old-timers and modern players compete fairly, then combined into categories (${catList}). A non-linear win curve turns your roster's overall strength into a season record.`,
    },
    {
      q: `Why does one weak category cap my record?`,
      a: `Every category has a floor. If your roster falls below the floor in even one area, that single weakness caps your record no matter how elite the rest of the lineup is. Going ${c.brand} means clearing every floor with a balanced, all-time roster, not just stacking one strength.`,
    },
    {
      q: `Is ${c.brand} ${c.name} free to play?`,
      a: `Yes. It is completely free, runs in your browser, and needs no app, download, or account.`,
    },
    {
      q: `How many rerolls do I get?`,
      a: `You get ${c.rerolls} rerolls per game. Each one swaps the current spin for a fresh team and era, so spend them when a spin gives you a franchise you cannot use, because once they are gone you have to draft from whatever you are dealt.`,
    },
    {
      q: `Can I share my result or play a daily challenge?`,
      a: `Yes. Every finished game has a shareable result, and the daily challenge gives everyone the same board each day so you can compare records with friends and climb the leaderboard.`,
    },
  ];
}
