/**
 * The fineness table — see CLAUDE.md "Gold types and the purity system".
 * 583 and 585 are kept as distinct DB values (shown exactly as stamped), but
 * both belong to the same "14K" filter group.
 */
const KARAT_BY_PURITY: Record<number, string> = {
  375: "9K",
  417: "10K",
  500: "12K",
  583: "14K",
  585: "14K",
  750: "18K",
  875: "21K",
  916: "22K",
  925: "925", // sterling silver stamp, not a gold karat
  995: "24K",
  999: "24K",
};

export function karatLabel(purity: number): string {
  return KARAT_BY_PURITY[purity] ?? `${purity}`;
}

/** All raw purity values belonging to a given karat filter (e.g. "14K" -> [583, 585]). */
export function puritiesForKarat(karat: string): number[] {
  return Object.entries(KARAT_BY_PURITY)
    .filter(([, k]) => k === karat)
    .map(([purity]) => Number(purity));
}
