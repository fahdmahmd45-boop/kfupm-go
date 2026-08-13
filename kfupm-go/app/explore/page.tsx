import Link from "next/link";
import { Compass, Sparkles, CalendarDays } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";

/**
 * Landmark/event-hosting locations to spotlight here. A full events system
 * (dates, RSVPs, notifications) is intentionally NOT built yet — this is a
 * lightweight pointer to where events happen on campus today, backed by the
 * same location IDs used on the main map.
 */
const eventSpots = [
  {
    id: "b54-exhibition-slaughterhouse",
    name: "Building 54 — Exhibition Building",
    note: "Career fairs, major exams, and exhibitions.",
  },
  {
    id: "b10-international-center",
    name: "Building 10 — Prince Nayef International Center",
    note: "Cultural events, lectures, and exhibitions.",
  },
  {
    id: "kfupm-tower",
    name: "KFUPM Tower",
    note: "A popular meeting point, often lit up for events.",
  },
];

export default function ExplorePage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <header className="px-5 pb-3 pt-[calc(env(safe-area-inset-top)+16px)]">
        <h1 className="text-2xl font-bold text-neutral-900">Explore</h1>
        <p className="mt-0.5 text-sm text-neutral-500">Campus highlights and guides.</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        <div className="mb-6">
          <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-neutral-800">
            <CalendarDays className="h-4 w-4" />
            Where events happen
          </h2>
          <ul className="space-y-2">
            {eventSpots.map((spot) => (
              <li key={spot.id}>
                <Link
                  href="/"
                  className="block rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5 active:bg-neutral-50"
                >
                  <p className="text-[15px] font-semibold text-neutral-900">{spot.name}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">{spot.note}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center pt-6 text-center text-neutral-400">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
            <Compass className="h-7 w-7" />
          </span>
          <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-neutral-600">
            <Sparkles className="h-4 w-4" />
            More to explore soon
          </p>
          <p className="mt-1 max-w-[260px] text-xs text-neutral-400">
            Full event listings with dates and reminders, shuttle info, dining highlights, and curated campus guides
            are planned for a future release.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
