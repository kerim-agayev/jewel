import { describe, expect, it } from "vitest";
import { MetalType, PricingMode, ProductStatus } from "@/app/generated/prisma/client";
import { productSchema } from "./product";

function baseWeightBased(overrides: Record<string, unknown> = {}) {
  return {
    code: "4346",
    titleAz: "Klassik Nişan Üzüyü",
    titleRu: "Классическое обручальное кольцо",
    categoryId: "cat_1",
    pricingMode: PricingMode.WEIGHT_BASED,
    metalType: MetalType.YELLOW_GOLD,
    purity: 585,
    weightGrams: 3.2,
    fixedPrice: null,
    priceOverride: null,
    status: ProductStatus.NEW,
    ...overrides,
  };
}

function baseFixed(overrides: Record<string, unknown> = {}) {
  return {
    code: "W-001",
    titleAz: "Casio Saat",
    titleRu: "Часы Casio",
    categoryId: "cat_watch",
    pricingMode: PricingMode.FIXED,
    metalType: MetalType.STEEL,
    purity: null,
    weightGrams: null,
    fixedPrice: 250,
    priceOverride: null,
    status: ProductStatus.NEW,
    ...overrides,
  };
}

describe("productSchema", () => {
  it("accepts a valid WEIGHT_BASED product", () => {
    expect(productSchema.safeParse(baseWeightBased()).success).toBe(true);
  });

  it("accepts a valid FIXED product", () => {
    expect(productSchema.safeParse(baseFixed()).success).toBe(true);
  });

  it("rejects WEIGHT_BASED with purity missing", () => {
    const result = productSchema.safeParse(baseWeightBased({ purity: null }));
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.path.includes("purity"))).toBe(true);
  });

  it("rejects WEIGHT_BASED with weightGrams missing", () => {
    const result = productSchema.safeParse(baseWeightBased({ weightGrams: null }));
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.path.includes("weightGrams"))).toBe(true);
  });

  it("rejects FIXED with fixedPrice missing", () => {
    const result = productSchema.safeParse(baseFixed({ fixedPrice: null }));
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.path.includes("fixedPrice"))).toBe(true);
  });

  it("rejects priceOverride and fixedPrice both set on the same product", () => {
    const result = productSchema.safeParse(
      baseWeightBased({ pricingMode: PricingMode.FIXED, fixedPrice: 250, priceOverride: 200, purity: null, weightGrams: null }),
    );
    expect(result.success).toBe(false);
  });

  it("rejects priceOverride set on a FIXED product even without fixedPrice — must stay WEIGHT_BASED-only", () => {
    const result = productSchema.safeParse(baseFixed({ priceOverride: 200 }));
    expect(result.success).toBe(false);
  });

  it("accepts priceOverride set on a WEIGHT_BASED product", () => {
    const result = productSchema.safeParse(baseWeightBased({ priceOverride: 555.5 }));
    expect(result.success).toBe(true);
  });

  it("rejects WEIGHT_BASED + a non-gold metal (SILVER) with no override — the dangerous mispricing case", () => {
    const result = productSchema.safeParse(baseWeightBased({ metalType: MetalType.SILVER, purity: 925 }));
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.path.includes("metalType"))).toBe(true);
  });

  it("accepts FIXED + a non-gold metal (SILVER) — FIXED mode sidesteps the gold formula entirely", () => {
    const result = productSchema.safeParse(baseFixed({ metalType: MetalType.SILVER }));
    expect(result.success).toBe(true);
  });

  it("accepts WEIGHT_BASED + a non-gold metal (SILVER) when a priceOverride is set — the genuine detached-from-market case", () => {
    const result = productSchema.safeParse(
      baseWeightBased({ metalType: MetalType.SILVER, purity: 925, priceOverride: 80 }),
    );
    expect(result.success).toBe(true);
  });

  it("accepts both 583 and 585 as valid purity stamps (kept distinct, not merged)", () => {
    expect(productSchema.safeParse(baseWeightBased({ purity: 583 })).success).toBe(true);
    expect(productSchema.safeParse(baseWeightBased({ purity: 585 })).success).toBe(true);
  });
});
