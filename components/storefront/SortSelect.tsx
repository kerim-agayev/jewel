"use client";

import { useRouter } from "@/i18n/navigation";
import { buildSortHref } from "@/lib/category-filters";

interface SortSelectProps {
  value?: string;
  label: string;
  options: { value: string; label: string }[];
  rawSearchParams: Record<string, string | string[] | undefined>;
}

export function SortSelect({ value, label, options, rawSearchParams }: SortSelectProps) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-label-md text-on-surface-variant">
      {label}:
      <select
        value={value ?? "newest"}
        onChange={(event) => router.push(buildSortHref(rawSearchParams, event.target.value))}
        className="border border-outline-variant rounded-sm px-2 py-1 bg-surface-container-lowest text-on-surface"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
