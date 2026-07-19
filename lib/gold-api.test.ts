import { afterEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@/app/generated/prisma/client";
import { convertOunceUSDToGramAZN, fetchLiveGoldPriceUSD, refreshGoldPriceSnapshot } from "./gold-api";

const { Decimal } = Prisma;

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("convertOunceUSDToGramAZN", () => {
  it("converts USD/troy-ounce to AZN/gram using the fixed rate", () => {
    // 4019.30 USD/oz * 1.7 AZN/USD / 31.1034768 g/oz ≈ 219.68
    const result = convertOunceUSDToGramAZN(new Decimal("4019.30"), new Decimal("1.7"));
    expect(result.toNumber()).toBeCloseTo(219.68, 2);
  });
});

describe("fetchLiveGoldPriceUSD", () => {
  it("returns the price as a Decimal on a successful response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ price: 4019.300049, symbol: "XAU" }),
      }),
    );
    const price = await fetchLiveGoldPriceUSD("https://api.gold-api.com/price/XAU");
    expect(price.toNumber()).toBeCloseTo(4019.300049, 5);
  });

  it("throws when the response is not ok (network issue, API downtime)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(fetchLiveGoldPriceUSD("https://api.gold-api.com/price/XAU")).rejects.toThrow();
  });

  it("throws when the response body has no usable price field", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ symbol: "XAU" }) }),
    );
    await expect(fetchLiveGoldPriceUSD("https://api.gold-api.com/price/XAU")).rejects.toThrow();
  });
});

function makeSnapshotRow(pricePerGramAZN: number) {
  return {
    pricePerGramAZN: new Decimal(pricePerGramAZN),
    pricePerOunceUSD: new Decimal(4000),
    source: "gold-api.com",
    fetchedAt: new Date(),
  };
}

describe("refreshGoldPriceSnapshot", () => {
  const config = { apiUrl: "https://api.gold-api.com/price/XAU", usdToAznRate: new Decimal("1.7") };

  it("writes and returns a fresh snapshot on a successful fetch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ price: 4000 }) }),
    );
    const created = makeSnapshotRow(219);
    const store = {
      create: vi.fn().mockResolvedValue(created),
      findLatest: vi.fn(),
    };

    const result = await refreshGoldPriceSnapshot(store, config);

    expect(store.create).toHaveBeenCalledOnce();
    expect(store.findLatest).not.toHaveBeenCalled();
    expect(result).toBe(created);
  });

  it("falls back to the last snapshot without writing anything when the fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const last = makeSnapshotRow(215);
    const store = {
      create: vi.fn(),
      findLatest: vi.fn().mockResolvedValue(last),
    };

    const result = await refreshGoldPriceSnapshot(store, config);

    expect(store.create).not.toHaveBeenCalled();
    expect(result).toBe(last);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("throws (does not silently return a null/zero price) when the fetch fails and no prior snapshot exists", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const store = { create: vi.fn(), findLatest: vi.fn().mockResolvedValue(null) };

    await expect(refreshGoldPriceSnapshot(store, config)).rejects.toThrow();
    expect(store.create).not.toHaveBeenCalled();
  });
});
