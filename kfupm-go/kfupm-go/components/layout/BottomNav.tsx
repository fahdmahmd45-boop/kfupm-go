"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Bookmark, Compass } from "lucide-react";

const TABS = [
  { href: "/", label: "Map", icon: Map },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/explore", label: "Explore", icon: Compass },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-stretch justify-around border-t border-neutral-100 bg-white/95 pb-[calc(env(safe-area-inset-bottom)+4px)] pt-1.5 backdrop-blur dark:border-white/10 dark:bg-neutral-800/95">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center gap-0.5 py-1.5"
          >
            <Icon className={`h-5.5 w-5.5 ${active ? "text-[#007E40] dark:text-[#3ddc84]" : "text-neutral-400 dark:text-neutral-500"}`} strokeWidth={active ? 2.4 : 2} />
            <span className={`text-[11px] font-semibold ${active ? "text-[#007E40] dark:text-[#3ddc84]" : "text-neutral-400 dark:text-neutral-500"}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
