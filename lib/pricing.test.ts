import { describe, expect, it } from "vitest";
import { Prisma } from "@/app/generated/prisma/client";
import { getEffectiveGoldPricePerGramAZN, getWeightBasedPriceBreakdown, resolveProductPrice } from "./pricing";

const { Decimal } = Prisma;

function weightBased(overrides: Partial<Parameters<typeof resolveProductPrice>[0]> = {}) {
  return {
    pricingMode: "WEIGHT_BASED" as const,
    priceOverride: null,
    fixedPrice: null,
    weightGrams: new Decimal(10),
    purity: 750,
    laborCostPercent: new Decimal(15),
    laborCostFixed: null,
    stoneCost: new Decimal(0),
    marginPercent: new Decimal(10),
    ...overrides,
  };
}

describe("resolveProductPrice", () => {
  it("computes the WEIGHT_BASED formula and rounds to the nearest whole AZN", () => {
    // goldValue = 10 * (750/1000) * 100 = 750
    // laborCost = 750 * 15/100 = 112.5
    // raw = (750 + 112.5 + 0) * 1.10 = 948.75 -> rounds to 949
    const price = resolveProductPrice(weightBased(), new Decimal(100));
    expect(price.toNumber()).toBe(949);
  });

  it("computes correctly for 583 purity (Soviet-era stamp)", () => {
    const price = resolveProductPrice(weightBased({ purity: 583 }), new Decimal(100));
    // goldValue = 10 * 0.583 * 100 = 583; labor = 87.45; raw = 670.45 * 1.10 = 737.495 -> 737
    expect(price.toNumber()).toBe(737);
  });

  it("computes correctly for 585 purity (international stamp) — differs slightly from 583", () => {
    const price = resolveProductPrice(weightBased({ purity: 585 }), new Decimal(100));
    // goldValue = 10 * 0.585 * 100 = 585; labor = 87.75; raw = 672.75 * 1.10 = 740.025 -> 740
    expect(price.toNumber()).toBe(740);
  });

  it("uses laborCostFixed instead of laborCostPercent when set", () => {
    const price = resolveProductPrice(
      weightBased({ laborCostFixed: new Decimal(50), marginPercent: new Decimal(0) }),
      new Decimal(100),
    );
    // goldValue = 750, laborCost = 50 (fixed, ignores percent), raw = 800 * 1.0 = 800
    expect(price.toNumber()).toBe(800);
  });

  it("adds stoneCost into the formula before margin", () => {
    const price = resolveProductPrice(
      weightBased({ stoneCost: new Decimal(20), laborCostFixed: new Decimal(0), marginPercent: new Decimal(0) }),
      new Decimal(100),
    );
    // goldValue = 750, laborCost = 0, stoneCost = 20, raw = 770 * 1.0 = 770
    expect(price.toNumber()).toBe(770);
  });

  it("returns the FIXED price unrounded, ignoring the weight-based formula entirely", () => {
    const product = {
      pricingMode: "FIXED" as const,
      priceOverride: null,
      fixedPrice: new Decimal("349.99"),
      weightGrams: null,
      purity: null,
      laborCostPercent: new Decimal(15),
      laborCostFixed: null,
      stoneCost: null,
      marginPercent: new Decimal(0),
    };
    const price = resolveProductPrice(product, new Decimal(100));
    expect(price.toString()).toBe("349.99");
  });

  it("bypasses the formula entirely when priceOverride is set on a WEIGHT_BASED product", () => {
    const price = resolveProductPrice(
      weightBased({ priceOverride: new Decimal("555.5") }),
      new Decimal(100),
    );
    expect(price.toString()).toBe("555.5");
  });

  it("bypasses even a FIXED product's fixedPrice when priceOverride is set (defensive — Zod should prevent both being set)", () => {
    const product = {
      pricingMode: "FIXED" as const,
      priceOverride: new Decimal("100"),
      fixedPrice: new Decimal("349.99"),
      weightGrams: null,
      purity: null,
      laborCostPercent: new Decimal(15),
      laborCostFixed: null,
      stoneCost: null,
      marginPercent: new Decimal(0),
    };
    const price = resolveProductPrice(product, new Decimal(100));
    expect(price.toString()).toBe("100");
  });

  it("does not round priceOverride or fixedPrice — admin's exact input is preserved", () => {
    const price = resolveProductPrice(
      weightBased({ priceOverride: new Decimal("700.18") }),
      new Decimal(100),
    );
    expect(price.toString()).toBe("700.18");
  });

  it("handles zero weight without crashing (degenerate but valid)", () => {
    const price = resolveProductPrice(
      weightBased({ weightGrams: new Decimal(0), laborCostFixed: new Decimal(0), marginPercent: new Decimal(0) }),
      new Decimal(100),
    );
    expect(price.toNumber()).toBe(0);
  });

  it("throws on negative weight — never a valid product state", () => {
    expect(() => resolveProductPrice(weightBased({ weightGrams: new Decimal(-5) }), new Decimal(100))).toThrow();
  });

  it("throws instead of silently producing NaN when WEIGHT_BASED is missing weightGrams", () => {
    expect(() => resolveProductPrice(weightBased({ weightGrams: null }), new Decimal(100))).toThrow();
  });

  it("throws instead of silently producing NaN when WEIGHT_BASED is missing purity", () => {
    expect(() => resolveProductPrice(weightBased({ purity: null }), new Decimal(100))).toThrow();
  });

  it("throws when FIXED is missing fixedPrice", () => {
    const product = {
      pricingMode: "FIXED" as const,
      priceOverride: null,
      fixedPrice: null,
      weightGrams: null,
      purity: null,
      laborCostPercent: new Decimal(15),
      laborCostFixed: null,
      stoneCost: null,
      marginPercent: new Decimal(0),
    };
    expect(() => resolveProductPrice(product, new Decimal(100))).toThrow();
  });
});

describe("getWeightBasedPriceBreakdown", () => {
  it("returns intermediate values that sum to the same total resolveProductPrice() returns", () => {
    const product = weightBased();
    const breakdown = getWeightBasedPriceBreakdown(product, new Decimal(100));
    const total = resolveProductPrice(product, new Decimal(100));

    expect(breakdown.finalPrice.toNumber()).toBe(total.toNumber());
    expect(breakdown.goldValue.toNumber()).toBe(750);
    expect(breakdown.laborCost.toNumber()).toBe(112.5);
  });

  it("throws for a FIXED product — the breakdown only applies to the formula-driven price", () => {
    const product = {
      pricingMode: "FIXED" as const,
      priceOverride: null,
      fixedPrice: new Decimal(250),
      weightGrams: null,
      purity: null,
      laborCostPercent: new Decimal(15),
      laborCostFixed: null,
      stoneCost: null,
      marginPercent: new Decimal(0),
    };
    expect(() => getWeightBasedPriceBreakdown(product, new Decimal(100))).toThrow();
  });

  it("throws when priceOverride is set — the breakdown would not sum to the overridden total", () => {
    const product = weightBased({ priceOverride: new Decimal(555.5) });
    expect(() => getWeightBasedPriceBreakdown(product, new Decimal(100))).toThrow();
  });
});

describe("getEffectiveGoldPricePerGramAZN", () => {
  const latest = { pricePerGramAZN: new Decimal(101) };
  const applied = { pricePerGramAZN: new Decimal(95) };

  it("AUTOMATIC mode always uses the latest snapshot, ignoring any applied snapshot", () => {
    const price = getEffectiveGoldPricePerGramAZN({ priceUpdateMode: "AUTOMATIC" }, latest, applied);
    expect(price.toNumber()).toBe(101);
  });

  it("MANUAL mode uses the applied snapshot, not the latest", () => {
    const price = getEffectiveGoldPricePerGramAZN({ priceUpdateMode: "MANUAL" }, latest, applied);
    expect(price.toNumber()).toBe(95);
  });

  it("MANUAL mode falls back to the latest snapshot when nothing has been applied yet", () => {
    const price = getEffectiveGoldPricePerGramAZN({ priceUpdateMode: "MANUAL" }, latest, null);
    expect(price.toNumber()).toBe(101);
  });

  it("throws when no snapshot exists at all — never silently prices with zero", () => {
    expect(() => getEffectiveGoldPricePerGramAZN({ priceUpdateMode: "AUTOMATIC" }, null, null)).toThrow();
  });
});
