export interface ParsedCategoryFilters {
  metalTypes: string[];
  karats: string[];
  stoneTypes: (string | null)[];
  status?: string;
  sort?: string;
  page: number;
}

function toArray(param: string | string[] | undefined): string[] {
  if (!param) return [];
  return Array.isArray(param) ? param : param.split(",");
}

export function parseCategorySearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): ParsedCategoryFilters {
  return {
    metalTypes: toArray(searchParams.metal),
    karats: toArray(searchParams.karat),
    stoneTypes: toArray(searchParams.stone).map((s) => (s === "none" ? null : s)),
    status: typeof searchParams.status === "string" ? searchParams.status : undefined,
    sort: typeof searchParams.sort === "string" ? searchParams.sort : undefined,
    page: Number(searchParams.page) || 1,
  };
}

function toURLSearchParams(searchParams: Record<string, string | string[] | undefined>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue;
    for (const v of Array.isArray(value) ? value : [value]) params.append(key, v);
  }
  return params;
}

/** Toggles `value` inside the comma-separated `key` param, resetting pagination. Pure — no client JS needed for filter checkboxes. */
export function buildFilterToggleHref(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
  value: string,
): string {
  const params = toURLSearchParams(searchParams);
  const current = new Set((params.get(key) ?? "").split(",").filter(Boolean));
  if (current.has(value)) current.delete(value);
  else current.add(value);

  if (current.size > 0) params.set(key, [...current].join(","));
  else params.delete(key);
  params.delete("page");

  const qs = params.toString();
  return qs ? `?${qs}` : "?";
}

export function buildSortHref(searchParams: Record<string, string | string[] | undefined>, sort: string): string {
  const params = toURLSearchParams(searchParams);
  params.set("sort", sort);
  params.delete("page");
  return `?${params.toString()}`;
}

export function buildPageHref(searchParams: Record<string, string | string[] | undefined>, page: number): string {
  const params = toURLSearchParams(searchParams);
  params.set("page", String(page));
  return `?${params.toString()}`;
}
