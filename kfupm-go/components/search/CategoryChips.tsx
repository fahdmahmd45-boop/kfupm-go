"use client";

import { Building2, UtensilsCrossed, SquareParking, Landmark, BookOpen, Wrench, Users, type LucideIcon } from "lucide-react";
import { CATEGORY_META, QUICK_CATEGORIES } from "@/lib/categories";
import type { LocationCategory } from "@/types/location";

const ICONS: Record<string, LucideIcon> = {
  Building2,
  UtensilsCrossed,
  SquareParking,
  Landmark,
  BookOpen,
  Wrench,
  Users,
};

interface CategoryChipsProps {
  activeCategory: LocationCategory | null;
  onSelect: (category: LocationCategory | null) => void;
}

export default function CategoryChips({ activeCategory, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {QUICK_CATEGORIES.map((category) => {
        const meta = CATEGORY_META[category];
        const Icon = ICONS[meta.icon] ?? Building2;
        const active = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(active ? null : category)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold shadow-sm ring-1 transition-all active:scale-95 ${
              active
                ? "bg-neutral-900 text-white ring-neutral-900"
                : "bg-white/95 text-neutral-700 ring-black/5 backdrop-blur"
            }`}
          >
            <Icon className="h-3.5 w-3.5" style={{ color: active ? "white" : meta.color }} />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
