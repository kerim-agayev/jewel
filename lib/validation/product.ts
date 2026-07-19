import { z } from "zod";
import { Gender, MetalType, PricingMode, ProductStatus } from "@/app/generated/prisma/client";

const GOLD_METAL_TYPES: readonly MetalType[] = [MetalType.YELLOW_GOLD, MetalType.WHITE_GOLD, MetalType.ROSE_GOLD];

/**
 * Shared product validation — see CLAUDE.md "Category-specific attributes" and
 * "Price calculation logic". Used by the seed script now and reused as-is by
 * the Wave C admin "add/edit product" form.
 */
export const productSchema = z
  .object({
    code: z.string().min(1),
    titleAz: z.string().min(1),
    titleRu: z.string().min(1),
    categoryId: z.string().min(1),
    pricingMode: z.enum(PricingMode),
    metalType: z.enum(MetalType),
    purity: z.number().int().positive().nullable().optional(),
    weightGrams: z.number().positive().nullable().optional(),
    fixedPrice: z.number().positive().nullable().optional(),
    priceOverride: z.number().nullable().optional(),
    stoneType: z.string().nullable().optional(),
    gender: z.enum(Gender).nullable().optional(),
    status: z.enum(ProductStatus),
    laborCostPercent: z.number().nonnegative().default(15),
    laborCostFixed: z.number().nonnegative().nullable().optional(),
    stoneCost: z.number().nonnegative().nullable().optional(),
    marginPercent: z.number().nonnegative().default(0),
    barterEligible: z.boolean().default(true),
    freeShipping: z.boolean().default(true),
    descriptionAz: z.string().nullable().optional(),
    descriptionRu: z.string().nullable().optional(),
    attributes: z.record(z.string(), z.unknown()).nullable().optional(),
  })
  .superRefine((product, ctx) => {
    if (product.pricingMode === PricingMode.WEIGHT_BASED) {
      if (product.purity == null) {
        ctx.addIssue({ code: "custom", path: ["purity"], message: "purity is required for WEIGHT_BASED products" });
      }
      if (product.weightGrams == null) {
        ctx.addIssue({
          code: "custom",
          path: ["weightGrams"],
          message: "weightGrams is required for WEIGHT_BASED products",
        });
      }
    }

    if (product.pricingMode === PricingMode.FIXED && product.fixedPrice == null) {
      ctx.addIssue({ code: "custom", path: ["fixedPrice"], message: "fixedPrice is required for FIXED products" });
    }

    if (product.priceOverride != null && product.fixedPrice != null) {
      ctx.addIssue({
        code: "custom",
        path: ["priceOverride"],
        message: "priceOverride and fixedPrice must never both be set on the same product",
      });
    }

    if (product.priceOverride != null && product.pricingMode !== PricingMode.WEIGHT_BASED) {
      ctx.addIssue({
        code: "custom",
        path: ["priceOverride"],
        message: "priceOverride is only meaningful on WEIGHT_BASED products",
      });
    }

    const isGoldMetal = GOLD_METAL_TYPES.includes(product.metalType);
    const isSafelyPriced = product.pricingMode === PricingMode.FIXED || product.priceOverride != null;
    if (!isGoldMetal && !isSafelyPriced) {
      ctx.addIssue({
        code: "custom",
        path: ["metalType"],
        message:
          "Non-gold metals (SILVER/PLATINUM/etc.) must be pricingMode=FIXED or have a priceOverride — the gold formula must never be applied to a non-gold metal",
      });
    }
  });

export type ProductInput = z.infer<typeof productSchema>;
