import type { CampusLocation } from "@/types/location";
import { CATEGORY_META } from "@/lib/categories";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Simple, fast partial-match search across name, building number,
 * short name, keywords, and category label. Good enough for a local
 * dataset of a few hundred locations; swap for a proper index later.
 */
export function searchLocations(
  locations: CampusLocation[],
  rawQuery: string
): CampusLocation[] {
  const query = normalize(rawQuery);
  if (!query) return [];

  const scored = locations
    .map((loc) => ({ loc, score: scoreLocation(loc, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((entry) => entry.loc);
}

function scoreLocation(loc: CampusLocation, query: string): number {
  let score = 0;

  const name = normalize(loc.name);
  const shortName = loc.shortName ? normalize(loc.shortName) : "";
  const buildingNumber = loc.buildingNumber ? normalize(loc.buildingNumber) : "";
  const categoryLabel = normalize(CATEGORY_META[loc.category].label);
  const keywords = (loc.keywords ?? []).map(normalize);

  if (buildingNumber && buildingNumber === query) score += 100;
  else if (buildingNumber && buildingNumber.startsWith(query)) score += 60;

  if (name === query) score += 90;
  else if (name.startsWith(query)) score += 50;
  else if (name.includes(query)) score += 30;

  if (shortName === query) score += 80;
  else if (shortName.startsWith(query)) score += 40;
  else if (shortName.includes(query)) score += 20;

  if (categoryLabel.includes(query)) score += 25;

  for (const kw of keywords) {
    if (kw === query) score += 45;
    else if (kw.startsWith(query)) score += 25;
    else if (kw.includes(query)) score += 12;
  }

  return score;
}
