import "dotenv/config";
import { Prisma, Gender, MetalType, PricingMode, ProductStatus } from "@/app/generated/prisma/client";
import { resolveProductPrice } from "@/lib/pricing";
import { refreshGoldPriceSnapshot, type GoldPriceSnapshotStore } from "@/lib/gold-api";
import { productSchema } from "@/lib/validation/product";
import { prisma } from "@/lib/prisma";
import { buildImagePool } from "./pexels";

const { Decimal } = Prisma;

// ---------------------------------------------------------------------------
// Random helpers (seed data only — not cryptographic)
// ---------------------------------------------------------------------------

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildExactPool<T>(entries: [T, number][]): T[] {
  const pool: T[] = [];
  for (const [value, count] of entries) {
    for (let i = 0; i < count; i++) pool.push(value);
  }
  return shuffle(pool);
}

function randomPick<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomWeight(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

// ---------------------------------------------------------------------------
// Category definitions — 6 real (exact ratios from the Thunderbit scrape,
// CLAUDE.md "Real data reference") + 3 fake-only (counts confirmed with the
// user during Wave B planning). 264 + 30 = 294 products total.
// ---------------------------------------------------------------------------

interface CategoryConfig {
  slug: string;
  nameAz: string;
  nameRu: string;
  nounAz: string;
  nounRu: string;
  count: number;
  searchTerm: string;
  isFake: boolean;
  weightRange?: [number, number];
}

const CATEGORIES: CategoryConfig[] = [
  { slug: "sirgalar", nameAz: "Sırğalar", nameRu: "Серьги", nounAz: "Sırğa", nounRu: "Серьги", count: 80, searchTerm: "gold earrings", isFake: false, weightRange: [1.5, 6] },
  { slug: "qolbaqlar", nameAz: "Qolbaqlar", nameRu: "Браслеты", nounAz: "Qolbaq", nounRu: "Браслет", count: 55, searchTerm: "gold bracelet", isFake: false, weightRange: [8, 25] },
  { slug: "medalyonlar", nameAz: "Medalyonlar", nameRu: "Кулоны", nounAz: "Medalyon", nounRu: "Кулон", count: 47, searchTerm: "gold pendant", isFake: false, weightRange: [2, 8] },
  { slug: "boyunbagilar", nameAz: "Boyunbağılar", nameRu: "Колье", nounAz: "Boyunbağı", nounRu: "Колье", count: 43, searchTerm: "gold necklace", isFake: false, weightRange: [5, 20] },
  { slug: "uzukler", nameAz: "Üzüklər", nameRu: "Кольца", nounAz: "Üzük", nounRu: "Кольцо", count: 23, searchTerm: "gold ring", isFake: false, weightRange: [2, 6] },
  { slug: "destler", nameAz: "Dəstlər", nameRu: "Комплекты", nounAz: "Dəst", nounRu: "Комплект", count: 16, searchTerm: "gold jewelry set", isFake: false, weightRange: [15, 40] },
  { slug: "brosalar", nameAz: "Broşlar", nameRu: "Броши", nounAz: "Broş", nounRu: "Брошь", count: 8, searchTerm: "brooch pin", isFake: true, weightRange: [5, 15] },
  { slug: "saatlar", nameAz: "Saatlar", nameRu: "Часы", nounAz: "Saat", nounRu: "Часы", count: 15, searchTerm: "wristwatch", isFake: true },
  { slug: "qizil-kulce", nameAz: "Qızıl Külçə/Sikkə", nameRu: "Золотые слитки/монеты", nounAz: "Qızıl Külçə", nounRu: "Золотой Слиток", count: 7, searchTerm: "gold bar", isFake: true },
];

const REAL_CATEGORY_TOTAL = CATEGORIES.filter((c) => !c.isFake).reduce((sum, c) => sum + c.count, 0);

const ADJECTIVES_AZ = ["Zərif", "Klassik", "Modern", "Lüks", "Şıq", "Nəfis", "Orijinal", "Ənənəvi", "Parlaq", "Sadə", "Zövqlü", "Xüsusi"];
// AI-translation DRAFT — Russian adjective agreement is not grammatically verified, needs human review before real launch (see CLAUDE.md "Russian titles").
const ADJECTIVES_RU = ["Изящное", "Классическое", "Современное", "Люксовое", "Стильное", "Утончённое", "Оригинальное", "Традиционное", "Яркое", "Простое", "Со вкусом", "Особенное"];

const STONE_SHAPES = ["oval", "round", "princess", "pear", "heart"];
const EARRING_TYPES = ["stud", "hoop", "drop", "chandelier"];
const WATCH_BRANDS = ["Casio", "Seiko", "Orient", "Citizen", "Fossil"];
const WATCH_MOVEMENTS = ["quartz", "automatic"];
const GOLD_BAR_WEIGHTS = [5, 10, 20, 31.1, 50, 100];

// Real-data exact distributions across the 264 real-category items — see
// CLAUDE.md "Real data reference".
const PURITY_POOL = buildExactPool<number>([[750, 231], [585, 33]]);
const GENDER_POOL = buildExactPool<Gender>([[Gender.FEMALE, 246], [Gender.MALE, 11], [Gender.KIDS, 7]]);
const STONE_POOL = buildExactPool<string | null>([
  [null, 224],
  ["Sadə daş", 13],
  ["Swarovski", 11],
  ["Malaxit", 5],
  ["Ametist", 3],
  ["Mirvari", 3],
  ["Sapfir", 2],
  ["Sitrin", 2],
  ["Topaz", 1],
]);

if (PURITY_POOL.length !== REAL_CATEGORY_TOTAL || GENDER_POOL.length !== REAL_CATEGORY_TOTAL || STONE_POOL.length !== REAL_CATEGORY_TOTAL) {
  throw new Error("Real-data distribution pools must exactly match the 264 real-category product count");
}

function randomMetalType(): MetalType {
  const r = Math.random();
  if (r < 0.85) return MetalType.YELLOW_GOLD;
  if (r < 0.95) return MetalType.WHITE_GOLD;
  return MetalType.ROSE_GOLD;
}

// CLAUDE.md's real-data reference gives no NEW/USED ratio — a small used
// share (~8%) is seeded so the category page's "Vəziyyət" filter has
// something real to filter, matching a jewelry store's typical mix of
// pre-owned/trade-in pieces alongside new stock.
function randomStatus(): ProductStatus {
  return Math.random() < 0.08 ? ProductStatus.USED : ProductStatus.NEW;
}

// ---------------------------------------------------------------------------
// Price-per-gram calibration
//
// CLAUDE.md's target ratios (124.4 AZN/g @750, 96.2 AZN/g @585) were measured
// against the live gold price at Thunderbit scrape time. If today's live spot
// price (fetched below) has since moved high enough that the raw gold value
// alone already exceeds that historical target, hitting it exactly would
// require a negative margin — nonsensical for a real business. Margin is
// floored at MIN_MARGIN_PERCENT instead: we get as close to the historical
// ratio as a non-negative margin allows, and never below it.
// ---------------------------------------------------------------------------

const TARGET_PRICE_PER_GRAM_AZN: Record<number, number> = { 750: 124.4, 585: 96.2 };
const MIN_MARGIN_PERCENT = 5;
const DEFAULT_LABOR_COST_PERCENT = 15;

function calibrateMarginPercent(purity: number, liveGoldPricePerGramAZN: number): number {
  const target = TARGET_PRICE_PER_GRAM_AZN[purity];
  if (target == null) return 10; // no historical target for this purity (e.g. bullion) — flat modest margin

  const goldValuePerGram = (purity / 1000) * liveGoldPricePerGramAZN;
  const afterLabor = goldValuePerGram * (1 + DEFAULT_LABOR_COST_PERCENT / 100);
  const neededMultiplier = target / afterLabor;
  const marginPercent = (neededMultiplier - 1) * 100;

  return Math.max(marginPercent, MIN_MARGIN_PERCENT);
}

/** Mirrors the real dataset's logged "4 AZN for 4 grams" error — catches formula/seed bugs, not a market-price assertion. */
function sanityCheckPricePerGram(code: string, priceAZN: number, weightGrams: number, purity: number, liveGoldPricePerGramAZN: number) {
  if (weightGrams <= 0) return;
  const ratio = priceAZN / weightGrams;
  const rawGoldPerGram = (purity / 1000) * liveGoldPricePerGramAZN;

  if (ratio < rawGoldPerGram * 0.9 || ratio > rawGoldPerGram * 3) {
    throw new Error(
      `Sanity check failed for product ${code}: price/gram ratio ${ratio.toFixed(2)} AZN is outside the plausible range around raw gold value ${rawGoldPerGram.toFixed(2)} AZN/g`,
    );
  }
}

// ---------------------------------------------------------------------------
// Gold price bootstrap — one manual fetch so /hesabla has a real price
// immediately, without waiting on a deployed cron (see CLAUDE.md "Cron").
// ---------------------------------------------------------------------------

const FALLBACK_GOLD_PRICE_PER_GRAM_AZN = new Decimal(165);

async function bootstrapGoldPrice(): Promise<Prisma.Decimal> {
  const store: GoldPriceSnapshotStore = {
    create: (data) => prisma.goldPriceSnapshot.create({ data }),
    findLatest: () => prisma.goldPriceSnapshot.findFirst({ orderBy: { fetchedAt: "desc" } }),
  };

  try {
    const snapshot = await refreshGoldPriceSnapshot(store, {
      apiUrl: process.env.GOLD_API_URL!,
      usdToAznRate: new Decimal(process.env.USD_TO_AZN_RATE ?? "1.7"),
    });
    console.log(`[seed] live gold price: ${snapshot.pricePerGramAZN.toString()} AZN/g`);
    return snapshot.pricePerGramAZN;
  } catch (error) {
    console.warn("[seed] gold-api.com unreachable and no prior snapshot — using a fallback placeholder price.", error);
    await prisma.goldPriceSnapshot.create({
      data: {
        pricePerGramAZN: FALLBACK_GOLD_PRICE_PER_GRAM_AZN,
        pricePerOunceUSD: FALLBACK_GOLD_PRICE_PER_GRAM_AZN.times(31.1034768),
        source: "seed-fallback-placeholder",
      },
    });
    return FALLBACK_GOLD_PRICE_PER_GRAM_AZN;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("[seed] resetting product data (idempotent re-run)...");
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  console.log("[seed] seeding Store...");
  let storeRecord = await prisma.store.findFirst();
  if (!storeRecord) {
    storeRecord = await prisma.store.create({
      data: {
        name: "Anar Jewellery",
        address: "Atatürk avenue 2a, Ganjlik department store (Ganjlik Gold), 2nd hall",
        phone: "+994504127999",
        whatsapp: "+994504127999",
        instagram: "instagram.com/anarjewellery",
        priceUpdateMode: "AUTOMATIC",
      },
    });
  }

  console.log("[seed] seeding categories...");
  const categoryRecords = new Map<string, { id: string }>();
  for (const cat of CATEGORIES) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { nameAz: cat.nameAz, nameRu: cat.nameRu },
      create: { slug: cat.slug, nameAz: cat.nameAz, nameRu: cat.nameRu },
    });
    categoryRecords.set(cat.slug, record);
  }

  const liveGoldPricePerGramAZN = await bootstrapGoldPrice();
  const liveGoldPriceNumber = liveGoldPricePerGramAZN.toNumber();

  console.log("[seed] building Pexels image pools (one fetch per category)...");
  const imagePools = new Map<string, string[]>();
  for (const cat of CATEGORIES) {
    imagePools.set(cat.slug, await buildImagePool(cat.slug, cat.searchTerm, 20));
    console.log(`[seed]   ${cat.slug}: ${imagePools.get(cat.slug)!.length} images`);
  }

  let purityIndex = 0;
  let genderIndex = 0;
  let stoneIndex = 0;
  let globalCode = 1000;
  let createdCount = 0;

  // Shuffled across categories (not seeded category-by-category) so createdAt
  // timestamps interleave naturally — otherwise the last-seeded category (a
  // small one, e.g. gold bars) would dominate the homepage's "new arrivals"
  // section just because it happened to be inserted last.
  const workItems = shuffle(CATEGORIES.flatMap((cat) => Array.from({ length: cat.count }, () => cat)));

  for (const cat of workItems) {
    const category = categoryRecords.get(cat.slug)!;
    const pool = imagePools.get(cat.slug)!;

    const code = String(globalCode++);
    const adjIndex = randomInt(0, ADJECTIVES_AZ.length - 1);
    const titleAz = `${ADJECTIVES_AZ[adjIndex]} ${cat.nounAz}`;
    const titleRu = `${ADJECTIVES_RU[adjIndex]} ${cat.nounRu}`;

    let pricingMode: PricingMode = PricingMode.WEIGHT_BASED;
    let metalType: MetalType = randomMetalType();
    let purity: number | null = null;
    let weightGrams: number | null = null;
    let fixedPrice: number | null = null;
    let stoneType: string | null = null;
    let gender: Gender | null = null;
    let attributes: Record<string, string | number> | undefined;

    if (cat.slug === "saatlar") {
      pricingMode = PricingMode.FIXED;
      metalType = MetalType.STEEL;
      fixedPrice = randomInt(16, 120) * 5; // 80–600 AZN, rounded to the nearest 5
      gender = randomPick([Gender.UNISEX, Gender.UNISEX, Gender.MALE, Gender.FEMALE]);
      attributes = {
        brand: randomPick(WATCH_BRANDS),
        movement: randomPick(WATCH_MOVEMENTS),
        waterResistanceM: randomPick([30, 50, 100]),
        strapMaterial: randomPick(["steel", "leather"]),
      };
    } else if (cat.slug === "qizil-kulce") {
      purity = 995;
      weightGrams = randomPick(GOLD_BAR_WEIGHTS);
      gender = null;
    } else if (cat.slug === "brosalar") {
      purity = Math.random() < 0.88 ? 750 : 585;
      weightGrams = randomWeight(...cat.weightRange!);
      gender = Gender.FEMALE;
    } else {
      // 6 real categories — draw from the exact-count pools
      purity = PURITY_POOL[purityIndex++];
      weightGrams = randomWeight(...cat.weightRange!);
      gender = GENDER_POOL[genderIndex++];
      stoneType = STONE_POOL[stoneIndex++];

      if (cat.slug === "uzukler") {
        attributes = { ringSize: randomInt(15, 21), ...(stoneType ? { stoneShape: randomPick(STONE_SHAPES) } : {}) };
      } else if (cat.slug === "boyunbagilar" || cat.slug === "medalyonlar") {
        attributes = { chainLengthCm: randomInt(40, 55) };
      } else if (cat.slug === "sirgalar") {
        attributes = { earringType: randomPick(EARRING_TYPES) };
      } else if (cat.slug === "qolbaqlar") {
        attributes = { wristSizeCm: randomInt(16, 21) };
      }
      // destler (sets): no category-specific attribute, per CLAUDE.md's examples (Simplicity First).
    }

    const draft = {
      code,
      titleAz,
      titleRu,
      categoryId: category.id,
      pricingMode,
      metalType,
      purity,
      weightGrams,
      fixedPrice,
      priceOverride: null,
      stoneType,
      gender,
      status: randomStatus(),
      laborCostPercent: DEFAULT_LABOR_COST_PERCENT,
      laborCostFixed: null,
      stoneCost: 0,
      marginPercent: purity != null ? calibrateMarginPercent(purity, liveGoldPriceNumber) : 10,
      barterEligible: true,
      freeShipping: true,
      descriptionAz: null,
      descriptionRu: null,
      attributes: attributes ?? null,
    };

    const parsed = productSchema.safeParse(draft);
    if (!parsed.success) {
      throw new Error(`Seed product ${code} failed validation: ${JSON.stringify(parsed.error.issues)}`);
    }

    const decimalProduct = {
      pricingMode: draft.pricingMode,
      priceOverride: null as Prisma.Decimal | null,
      fixedPrice: draft.fixedPrice != null ? new Decimal(draft.fixedPrice) : null,
      weightGrams: draft.weightGrams != null ? new Decimal(draft.weightGrams) : null,
      purity: draft.purity,
      laborCostPercent: new Decimal(draft.laborCostPercent),
      laborCostFixed: null,
      stoneCost: new Decimal(draft.stoneCost),
      marginPercent: new Decimal(draft.marginPercent),
    };
    const finalPrice = resolveProductPrice(decimalProduct, liveGoldPricePerGramAZN);

    if (draft.pricingMode === PricingMode.WEIGHT_BASED && draft.weightGrams != null && draft.purity != null) {
      sanityCheckPricePerGram(code, finalPrice.toNumber(), draft.weightGrams, draft.purity, liveGoldPriceNumber);
    }

    const imageCount = randomInt(1, 4);
    const images = shuffle(pool).slice(0, imageCount);

    await prisma.product.create({
      data: {
        code: draft.code,
        titleAz: draft.titleAz,
        titleRu: draft.titleRu,
        categoryId: draft.categoryId,
        pricingMode: draft.pricingMode,
        metalType: draft.metalType,
        purity: draft.purity,
        weightGrams: draft.weightGrams != null ? new Decimal(draft.weightGrams) : null,
        fixedPrice: draft.fixedPrice != null ? new Decimal(draft.fixedPrice) : null,
        stoneType: draft.stoneType,
        gender: draft.gender,
        status: draft.status,
        laborCostPercent: new Decimal(draft.laborCostPercent),
        marginPercent: new Decimal(draft.marginPercent),
        stoneCost: new Decimal(draft.stoneCost),
        barterEligible: draft.barterEligible,
        freeShipping: draft.freeShipping,
        attributes: draft.attributes ?? undefined,
        storeId: storeRecord.id,
        images: {
          create: images.map((url, order) => ({
            url,
            order,
            altAz: `${cat.nameAz} — Anar Jewellery`,
            altRu: `${cat.nameRu} — Anar Jewellery`,
          })),
        },
      },
    });

    createdCount++;
  }

  console.log(`[seed] done — ${createdCount} products created.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
