"use client";

import { Building2, UtensilsCrossed, SquareParking, Landmark, BookOpen, Wrench, Users, Bus, MapPin, type LucideIcon } from "lucide-react";
import type { CampusLocation } from "@/types/location";
import { CATEGORY_META } from "@/lib/categories";

const ICONS: Record<string, LucideIcon> = {
  Building2,
  UtensilsCrossed,
  SquareParking,
  Landmark,
  BookOpen,
  Wrench,
  Users,
  Bus,
  MapPin,
};

interface SearchResultsProps {
  results: CampusLocation[];
  externalResults?: CampusLocation[];
  externalLoading?: boolean;
  query: string;
  onSelect: (location: CampusLocation) => void;
}

export default function SearchResults({ results, externalResults = [], externalLoading, query, onSelect }: SearchResultsProps) {
  if (!query) return null;

  const nothingFound = results.length === 0 && externalResults.length === 0 && !externalLoading;

  return (
    <div className="max-h-[55vh] overflow-y-auto rounded-2xl bg-white/95 shadow-lg shadow-black/10 ring-1 ring-black/5 backdrop-blur panel-animate dark:bg-neutral-800/95 dark:ring-white/10">
      {nothingFound ? (
        <div className="px-4 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          No locations found for &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <>
          {results.length > 0 && (
            <ul className="divide-y divide-neutral-100 dark:divide-white/10">
              {results.map((location) => (
                <ResultRow key={location.id} location={location} onSelect={onSelect} />
              ))}
            </ul>
          )}

          {(externalResults.length > 0 || externalLoading) && (
            <div className={results.length > 0 ? "border-t border-neutral-100 dark:border-white/10" : ""}>
              <p className="px-4 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                More places nearby
              </p>
              {externalLoading && externalResults.length === 0 ? (
                <p className="px-4 pb-3 text-xs text-neutral-400 dark:text-neutral-500">Searching…</p>
              ) : (
                <ul className="divide-y divide-neutral-100 dark:divide-white/10">
                  {externalResults.map((location) => (
                    <ResultRow key={location.id} location={location} onSelect={onSelect} />
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ResultRow({ location, onSelect }: { location: CampusLocation; onSelect: (l: CampusLocation) => void }) {
  const meta = CATEGORY_META[location.category];
  const Icon = ICONS[meta.icon] ?? MapPin;
  return (
    <li>
      <button
        onClick={() => onSelect(location)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-neutral-50 dark:active:bg-neutral-700/60"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${meta.color}1a` }}
        >
          <Icon className="h-4.5 w-4.5" style={{ color: meta.color }} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold text-neutral-900 dark:text-white">
            {location.name}
          </span>
          <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
            {location.buildingNumber ? `Building ${location.buildingNumber} · ` : ""}
            {location.description && location.category === "other" ? location.description : meta.label}
          </span>
        </span>
      </button>
    </li>
  );
}
