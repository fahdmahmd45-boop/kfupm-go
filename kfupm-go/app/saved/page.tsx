"use client";

import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { campusLocations } from "@/data/locations";
import { useFavorites } from "@/hooks/useFavorites";
import { CATEGORY_META } from "@/lib/categories";

export default function SavedPage() {
  const { favoriteIds, hydrated, toggleFavorite } = useFavorites();
  const saved = campusLocations.filter((l) => favoriteIds.includes(l.id));

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <header className="px-5 pb-3 pt-[calc(env(safe-area-inset-top)+16px)]">
        <h1 className="text-2xl font-bold text-neutral-900">Saved</h1>
        <p className="mt-0.5 text-sm text-neutral-500">Locations you&apos;ve favorited, stored on this device.</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        {!hydrated ? null : saved.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center text-neutral-400">
            <Heart className="h-10 w-10" />
            <p className="mt-3 text-sm font-medium">No saved locations yet</p>
            <p className="mt-1 max-w-[220px] text-xs">
              Tap the heart icon on any location to save it here for quick access.
            </p>
            <Link href="/" className="mt-4 rounded-full bg-neutral-900 px-4 py-2 text-xs font-bold text-white">
              Explore the map
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {saved.map((location) => {
              const meta = CATEGORY_META[location.category];
              return (
                <li
                  key={location.id}
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${meta.color}1a` }}
                  >
                    <MapPin className="h-4.5 w-4.5" style={{ color: meta.color }} />
                  </span>
                  <Link href="/" className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-neutral-900">{location.name}</p>
                    <p className="truncate text-xs text-neutral-500">{meta.label}</p>
                  </Link>
                  <button
                    aria-label="Remove from saved"
                    onClick={() => toggleFavorite(location.id)}
                    className="shrink-0 rounded-full p-2 active:bg-neutral-100"
                  >
                    <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
