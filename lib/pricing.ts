import { Prisma } from "@/app/generated/prisma/client";

const { Decimal } = Prisma;
type Decimal = Prisma.Decimal;

export interface PricingInput {
  pricingMode: "WEIGHT_BASED" | "FIXED";
  priceOverride: Decimal | null;
  fixedPrice: Decimal | null;
  weightGrams: Decimal | null;
  purity: number | null;
  laborCostPercent: Decimal;
  laborCostFixed: Decimal | null;
  stoneCost: Decimal | null;
  marginPercent: Decimal;
}

/**
 * The single shared price formula — see CLAUDE.md "Price calculation logic".
 * Every screen (storefront, Xəzinə, admin Panel, Reports) must go through this
 * function so an override or a stale price can never show up on one screen and
 * not another.
 */
export function resolveProductPrice(product: PricingInput, effectiveGoldPricePerGramAZN: Decimal): Decimal {
  if (product.priceOverride != null) return product.priceOverride;

  if (product.pricingMode === "FIXED") {
    if (product.fixedPrice == null) {
      throw new Error("FIXED product is missing fixedPrice");
    }
    return product.fixedPrice;
  }

  if (product.weightGrams == null || product.purity == null) {
    throw new Error("WEIGHT_BASED product is missing weightGrams or purity");
  }
  if (product.weightGrams.isNegative()) {
    throw new Error("weightGrams cannot be negative");
  }

  const goldValue = product.weightGrams.times(product.purity).div(1000).times(effectiveGoldPricePerGramAZN);
  const laborCost = product.laborCostFixed ?? goldValue.times(product.laborCostPercent).div(100);
  const stoneCost = product.stoneCost ?? new Decimal(0);
  const rawFinalPrice = goldValue
    .plus(laborCost)
    .plus(stoneCost)
    .times(new Decimal(1).plus(product.marginPercent.div(100)));

  return rawFinalPrice.round();
}

interface PriceBreakdown {
  goldValue: Decimal;
  laborCost: Decimal;
  stoneCost: Decimal;
  finalPrice: Decimal;
}

/**
 * Intermediate formula values for the product page's price-breakdown card —
 * reuses resolveProductPrice() for the total so the two can never drift apart.
 * Only meaningful when the formula is actually driving the price (WEIGHT_BASED,
 * no priceOverride) — callers should show a single price line otherwise.
 */
export function getWeightBasedPriceBreakdown(
  product: PricingInput,
  effectiveGoldPricePerGramAZN: Decimal,
): PriceBreakdown {
  if (product.pricingMode !== "WEIGHT_BASED" || product.priceOverride != null) {
    throw new Error("getWeightBasedPriceBreakdown only applies when the formula is driving the price (WEIGHT_BASED, no priceOverride)");
  }
  if (product.weightGrams == null || product.purity == null) {
    throw new Error("WEIGHT_BASED product is missing weightGrams or purity");
  }

  const goldValue = product.weightGrams.times(product.purity).div(1000).times(effectiveGoldPricePerGramAZN);
  const laborCost = product.laborCostFixed ?? goldValue.times(product.laborCostPercent).div(100);
  const stoneCost = product.stoneCost ?? new Decimal(0);

  return { goldValue, laborCost, stoneCost, finalPrice: resolveProductPrice(product, effectiveGoldPricePerGramAZN) };
}

interface StoreLike {
  priceUpdateMode: "AUTOMATIC" | "MANUAL";
}

interface SnapshotLike {
  pricePerGramAZN: Decimal;
}

/**
 * AUTOMATIC always tracks the latest cron fetch. MANUAL stays frozen on
 * whatever the admin last clicked "Apply", falling back to the latest
 * snapshot if nothing has been applied yet (e.g. day one).
 */
export function getEffectiveGoldPricePerGramAZN(
  store: StoreLike,
  latestSnapshot: SnapshotLike | null,
  appliedSnapshot: SnapshotLike | null,
): Decimal {
  const snapshot = store.priceUpdateMode === "MANUAL" ? (appliedSnapshot ?? latestSnapshot) : latestSnapshot;

  if (snapshot == null) {
    throw new Error("No GoldPriceSnapshot available to price against");
  }

  return snapshot.pricePerGramAZN;
}
