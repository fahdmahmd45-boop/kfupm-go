"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, onFocus, placeholder }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-3.5 shadow-lg shadow-black/10 ring-1 ring-black/5 backdrop-blur dark:bg-neutral-800/95 dark:ring-white/10">
      <Search className="h-5 w-5 shrink-0 text-neutral-400 dark:text-neutral-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        type="text"
        inputMode="search"
        placeholder={placeholder ?? "Where do you want to go, يا بترولي؟"}
        className="w-full bg-transparent text-[15px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-white dark:placeholder:text-neutral-500"
      />
      {value && (
        <button
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="shrink-0 rounded-full p-1 text-neutral-400 active:bg-neutral-100 dark:text-neutral-500 dark:active:bg-neutral-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
