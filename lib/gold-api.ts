import { Prisma } from "@/app/generated/prisma/client";

const { Decimal } = Prisma;
type Decimal = Prisma.Decimal;

const TROY_OUNCE_IN_GRAMS = 31.1034768;

export function convertOunceUSDToGramAZN(pricePerOunceUSD: Decimal, usdToAznRate: Decimal): Decimal {
  return pricePerOunceUSD.times(usdToAznRate).div(TROY_OUNCE_IN_GRAMS);
}

interface GoldApiResponse {
  price?: number;
}

/** Fetches the live XAU (gold) spot price in USD/troy-ounce from gold-api.com. Throws on any failure. */
export async function fetchLiveGoldPriceUSD(apiUrl: string): Promise<Decimal> {
  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error(`gold-api.com responded with HTTP ${res.status}`);
  }

  const data = (await res.json()) as GoldApiResponse;
  if (typeof data.price !== "number" || !Number.isFinite(data.price) || data.price <= 0) {
    throw new Error("gold-api.com returned a response with no usable price");
  }

  return new Decimal(data.price);
}

interface GoldPriceSnapshotRow {
  pricePerGramAZN: Decimal;
  pricePerOunceUSD: Decimal;
  source: string;
  fetchedAt: Date;
}

export interface GoldPriceSnapshotStore {
  create(data: { pricePerGramAZN: Decimal; pricePerOunceUSD: Decimal; source: string }): Promise<GoldPriceSnapshotRow>;
  findLatest(): Promise<GoldPriceSnapshotRow | null>;
}

/**
 * Fetches today's gold price and writes a new GoldPriceSnapshot (called by the
 * Vercel Cron endpoint). Per CLAUDE.md "What happens if the cron fetch fails":
 * never crashes, never writes a null/zero price — falls back to the last
 * successful snapshot and just logs the failed attempt.
 */
export async function refreshGoldPriceSnapshot(
  store: GoldPriceSnapshotStore,
  config: { apiUrl: string; usdToAznRate: Decimal },
): Promise<GoldPriceSnapshotRow> {
  try {
    const pricePerOunceUSD = await fetchLiveGoldPriceUSD(config.apiUrl);
    const pricePerGramAZN = convertOunceUSDToGramAZN(pricePerOunceUSD, config.usdToAznRate);
    return await store.create({ pricePerGramAZN, pricePerOunceUSD, source: "gold-api.com" });
  } catch (error) {
    console.error("[gold-api] fetch failed, falling back to last snapshot:", error);
    const last = await store.findLatest();
    if (last == null) {
      throw new Error("gold-api.com fetch failed and no previous GoldPriceSnapshot exists to fall back on");
    }
    return last;
  }
}
