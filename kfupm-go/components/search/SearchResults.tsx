"use client";

import { Building2, UtensilsCrossed, SquareParking, Landmark, BookOpen, Wrench, Users, MapPin, type LucideIcon } from "lucide-react";
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
  MapPin,
};

interface SearchResultsProps {
  results: CampusLocation[];
  query: string;
  onSelect: (location: CampusLocation) => void;
}

export default function SearchResults({ results, query, onSelect }: SearchResultsProps) {
  if (!query) return null;

  return (
    <div className="max-h-[55vh] overflow-y-auto rounded-2xl bg-white/95 shadow-lg shadow-black/10 ring-1 ring-black/5 backdrop-blur panel-animate">
      {results.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-neutral-500">
          No locations found for &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {results.map((location) => {
            const meta = CATEGORY_META[location.category];
            const Icon = ICONS[meta.icon] ?? MapPin;
            return (
              <li key={location.id}>
                <button
                  onClick={() => onSelect(location)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-neutral-50"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${meta.color}1a` }}
                  >
                    <Icon className="h-4.5 w-4.5" style={{ color: meta.color }} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold text-neutral-900">
                      {location.name}
                    </span>
                    <span className="block truncate text-xs text-neutral-500">
                      {location.buildingNumber ? `Building ${location.buildingNumber} · ` : ""}
                      {meta.label}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
