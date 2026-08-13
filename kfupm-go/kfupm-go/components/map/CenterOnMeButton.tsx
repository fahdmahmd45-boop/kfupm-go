"use client";

import { LocateFixed } from "lucide-react";

export default function CenterOnMeButton({ onClick, active }: { onClick: () => void; active: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label="Center on my location"
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 ring-1 ring-black/5 active:bg-neutral-50"
    >
      <LocateFixed className={`h-5 w-5 ${active ? "text-[#007E40]" : "text-neutral-500"}`} />
    </button>
  );
}
