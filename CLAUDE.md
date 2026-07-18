# CLAUDE.md — Anar Jewellery

## Code-writing principles (mandatory, apply on every change)

Everyone working on this project (including Claude Code) follows these 4 principles — written against the mistakes LLMs make most often when coding:

**1. Think before coding.** Don't build on assumptions, don't hide confusion. If unsure, ask — don't stay silent and proceed. If more than one interpretation is possible, present all of them, don't quietly pick one. If a simpler path exists, say so explicitly.

**2. Simplicity first.** The minimum code that solves what was asked. No unrequested feature, no single-use abstraction, no "might be needed later" configuration. If 200 lines fit in 50, rewrite it. Test question: would a senior engineer call this "overcomplicated"? If yes, simplify.

**3. Surgical changes.** Touch only where necessary. Don't "improve" adjacent code, comments, or formatting. Don't refactor what isn't broken. Match the existing style, even if you'd do it differently yourself. Remove imports/variables left unused as a result of your change, but don't remove pre-existing unrelated dead code without being asked. Test question: every changed line must trace directly back to the request.

**4. Goal-driven execution.** Define the success criterion up front, iterate until it's confirmed. Instead of "add validation," think "write tests for invalid inputs, then make them pass." For multi-step work, write a short plan: `1. [Step] → verify: [check]`.

---

## Project summary

Anar Jewellery is a website being built for a gold jewelry store with a physical location in Baku. It consists of two parts: **Storefront** (customer-facing, mobile-first, AZ+RU language) and **Admin panel** (for staff, desktop-first, **AZ+RU language, light/dark mode**).

**MVP scope (what's being built right now):**
- Single brand (Anar Jewellery only), NO multi-vendor/multi-brand support.
- NO online payment/checkout — contact via WhatsApp/phone.
- Live gold price pulled from a **real** API.
- Two languages, **both storefront and admin**: Azerbaijani (default) + Russian.
- "Modellərimiz" (AI style gallery) is a **genuinely working admin workflow** — fake data is only for the initial seed.
- The admin panel has 6 main tabs (Panel, Products, Sales, Customers, Reports, Settings) — Customers is marked "Coming Soon."
- Image storage: **Cloudflare R2** (free, zero bandwidth cost).
- Product catalog of ~264-300 items, **fake data calibrated to the statistical pattern of the real Anar Jewellery catalog** (category ratios, purity distribution, price-per-gram ratio — see the "Real data reference" section below). Photos and exact prices are fake, but the distribution is realistic.
- Store contact info (phone, address, Instagram) is **real** — see below.
- **Up to Wave E** (see "Waves"): the cinematic hero, Xəzinə, Lighthouse/SEO polish, and GA4 setup — untouched until the core site is done, the user is asked before Wave E begins.
- The site is currently a **demo** — noindexed and password-protected until the real launch (see below).

**Goal:** A real, impressive demo to show the store owner. The architecture should be designed so real payment, real inventory, and a second branch can be added later — but don't build those in the MVP, just leave the doors open.

## Waves (execution plan)

The project is split into 5 waves, detailed in `docs/waves/wave-a.md` … `wave-e.md`. When each wave finishes, that file's status is updated to "done" and a summary is written to `docs/phase_1/logs.md`.

1. **Wave A — Foundation:** review of the `design/` folder (see "Design reference"), installing the `claude-code-templates` skills, Next.js setup, Prisma schema, DB connection, next-intl skeleton (AZ+RU, admin included), design tokens coming from Stitch.
2. **Wave B — Storefront core:** homepage, category/product pages, seeding the calibrated fake 264-300 products, gold calculator.
3. **Wave C — Admin core:** Panel, Products, Sales, Settings, login, AZ+RU admin UI, light/dark mode.
4. **Wave D — Modellərimiz:** lookbook page + admin AI-image upload workflow.
5. **Wave E — Final (GATED):** cinematic hero + Xəzinə + Lighthouse/SEO polish + GA4. **When Wave D is done, Claude Code stops and asks the user: "The core site is ready — shall we move on to Wave E (visual effects + performance + analytics), or postpone it?"** Wave E does not start without explicit confirmation.

## Documentation (`docs/`) protocol

```
docs/
  phase_1/
    index.md          → status dashboard, which wave is where, links
    architecture.md    → the expanded version of CLAUDE.md as written during coding (real implementation details)
    decisions.md       → on-the-fly decisions made during coding (date + reason)
    bugs.md            → every bug: symptom, root cause, fix — timestamped
    logs.md            → work log, a short summary at the end of every session
  waves/
    wave-a.md … wave-e.md   → each wave's scope + status update when completed
```

**Rule:** after every significant step (a bug found and fixed, an architecture decision made, a wave finished), Claude Code UPDATES the corresponding file — this isn't for remembering later, it's a journal kept in real time. `index.md` must always show the latest status.

## Design reference (`design/` folder)

All screenshots/exports downloaded from Google Stitch are placed in the project root's `design/` folder (uploaded manually by the user). **Before starting Wave A, Claude Code must read this folder, understand the designs (colors, spacing, component styles, typography), and only then start coding** — it should use the actually-confirmed visual result as the primary source, rather than re-interpreting the text-based Stitch prompts in this document.

- The folder structure is free-form (can be a screenshot, an HTML/CSS export, or a Figma export) — Claude Code should adapt to whatever file format is present.
- Design tokens (colors, fonts, spacing) are extracted from this folder and carried over into the Tailwind configuration.
- When a new/additional design arrives (e.g. the Prompt 6 — Xəzinə result, in Wave E), it's added to the same folder, and Claude Code looks at it again — the folder is not a one-time thing, it's an ongoing source.

## Claude Code Skills (installed in Wave A)

Before coding begins, the following `claude-code-templates` skills are installed:

```bash
npx claude-code-templates@latest --skill creative-design/frontend-design
npx claude-code-templates@latest --skill development/senior-frontend
npx claude-code-templates@latest --skill development/senior-backend
npx claude-code-templates@latest --skill development/senior-architect
npx claude-code-templates@latest --skill creative-design/ui-design-system
npx claude-code-templates@latest --skill creative-design/ui-ux-pro-max
npx claude-code-templates@latest --skill creative-design/tailwind-patterns
npx claude-code-templates@latest --skill development/nextjs-best-practices
npx claude-code-templates@latest --skill web-development/web-performance-optimization
npx claude-code-templates@latest --skill development/mcp-integration
npx claude-code-templates@latest --skill ai-research/claude-code-guide
```

**Note:** this is not an official Anthropic tool — `davila7/claude-code-templates`, an open-source (19K+ GitHub stars) command-line tool, offers a selection from 900+ ready components (agents, skills, hooks, MCPs) suited to the project. Installed skills are written under `.claude/skills/`, and Claude Code reads them automatically — no need to reference them manually.

## Tech stack

- **Next.js 15** — App Router, Server Components by default.
- **TypeScript** — strict mode.
- **Prisma ORM + Neon Postgres** — `@prisma/adapter-neon` driver adapter.
- **Tailwind CSS**.
- **next-intl** — AZ/RU language support (the standard choice for App Router in 2026, ~2KB, Server Component compatible, locale management via middleware).
- **Recharts** — admin charts.
- **Three.js + React Three Fiber + GSAP + Lenis** — the homepage hero AND the "Xəzinə" discovery page (see below) — both use the same WebGL library, no separate library (e.g. OGL) is added (Simplicity First — since both are lazy-loaded, separate routes, there's no shared impact on the bundle). The gold object in the hero is not an external file, it's created from code with Three.js primitive geometry (see the "Cinematic 3D hero" section below).
- **d3-force** — for the force-simulation physics on the "Xəzinə" page (not rendering, position calculation only). An open-source, clearly MIT-licensed, well-established library.
- **Google Analytics 4** — event tracking (Xəzinə usage, WhatsApp clicks, language switching) + cookie-consent banner (see below).
- **Motion** (formerly known as Framer Motion — the package name is now `motion`, imported from `motion/react`; the `framer-motion` package is no longer actively developed, don't confuse the two) — the micro-animations across the rest of the site.
- **Zod** — form/validation.
- **Auth.js (NextAuth)** — admin login only.
- **Vitest** — unit tests for money calculations (the price formula, currency conversion).
- **Cloudflare R2** — image storage (300-1000 product photos, zero bandwidth cost, 10GB free — safer at this scale than Cloudinary's shared credit limit).
- **Tailwind dark mode (`class` strategy)** — admin only, preference stored in a cookie.
- **Deploy:** Vercel.

## Language support (AZ + RU)

- `middleware.ts` reads the user's `Accept-Language` header, redirects `/` to the default locale `/az`.
- Static UI text: `messages/az.json`, `messages/ru.json`.
- For dynamic content (category name, product title/description) a separate translation table is NOT built — since there are only 2 languages, plain columns like `Category.nameAz/nameRu`, `Product.titleAz/titleRu/descriptionAz/descriptionRu` are enough (a generic translation/EAV system only pays off at 3+ languages — Simplicity First).
- The language switcher in the header updates both the URL (`/az/...` ↔ `/ru/...`) and the `NEXT_LOCALE` cookie.
- **The admin panel is also AZ+RU** — the same `next-intl` mechanism from the storefront is extended to `/admin` routes too (the earlier decision kept admin AZ-only; that's been changed). Practical effect: every UI string in the admin screens must be kept in both languages, admin keys are also added to `messages/az.json`/`messages/ru.json` — the architecture doesn't change, only the string count grows.
- The structure is ready for a 3rd language (English): a line in `routing.ts` + `messages/en.json` + `nameEn`/`titleEn` columns would be enough.

## Navigation

The desktop header and the mobile bottom tab bar are fed from the same fixed array (not hardcoded separately in two places):

| Label (AZ) | Route | Desktop | Mobile tab bar |
|---|---|---|---|
| Ana səhifə (Home) | `/[locale]` | ✓ | ✓ |
| Kateqoriyalar (Categories, dropdown) | `/[locale]/[category]` | ✓ | ✓ |
| Modellərimiz | `/[locale]/lookbook` | ✓ | ✓ |
| Qızıl hesablayıcısı (Gold calculator) | `/[locale]/hesabla` | ✓ | ✓ (short: "Hesabla") |
| Haqqımızda (About) | `/[locale]/haqqimizda` | ✓ | ✓ (short: "Əlaqə", includes the address section) |
| Ünvan (Address) | `/[locale]/haqqimizda#unvan` | ✓ (anchor link to the same page) | merges into "Əlaqə" on the mobile tab |
| Language (AZ/RU) | — | ✓ toggle on the right of the header | ✓ small toggle in the mobile top header bar (there's no separate "settings" page) |
| Search (🔍) | `/[locale]/axtar?q=` | ✓ icon, in the header | ✓ icon, in the top bar |
| Favorites (♥) | client-side, no route | ✓ icon | ✓ icon |
| Admin login (👤) | `/admin/login` | ✓ small icon, far right of the header | usually hidden on mobile, or moved to the footer |

**Clarifying the four icons that appear in the header** (not named in the Stitch design, their functions could get confused):

- **🔍 Search** — see the "Search system" section below.
- **♥ Favorites** — this is NOT a customer account. Since there's no login/registration, favorites are just a list of `Product.code` values kept in `localStorage` (no DB model needed at all — Simplicity First). The `/[locale]/favoriler` page reads these codes and shows the matching products. Favorites are lost if the device changes — an acceptable trade-off for the MVP, adding simple value without building an account system.
- **👤 Profile/Login icon — THIS IS THE ADMIN LOGIN, NOT a customer account.** This site does NOT require customer registration/login (see the "Customer login/registration" section below). This icon, carried over from Stitch's generic e-commerce template, is actually a small, unobtrusive entry point leading to `/admin/login` — for store staff. Claude Code should keep it small/subtle (not a big "Log in" button), otherwise a customer might get confused about "why does this site need an account?"
- **The "çeşidlə" (sort) dropdown on the category page** — not in the header, it's on the `/[locale]/[category]` page (see Prompt 1). Options: by price (ascending/descending), by popularity, and **"by newest"** (`createdAt DESC`). The last one matters: when the admin adds a new ring, if "by newest" is selected, that ring shows up at the top of the list — this doesn't require an extra "featured" flag, it's just an ordering by `createdAt`.

The two things I added myself: a **language switcher** (needed for requirement #10) and, on desktop, a small **search icon** (fast search by product code/name, so you don't have to browse by category among 300 products).

Why "Haqqımızda" and "Ünvan" are two separate nav items but a single route: opening two different pages would be an unnecessary duplication (both are information about the store) — instead, the single `/haqqimizda` page has two sections (the story + address/map/hours), and the "Ünvan" nav link simply scrolls to that page's `#unvan` section.

## Customer login/registration — DOES NOT EXIST (a deliberate decision)

The storefront has NO customer account, login, or registration system at all — neither real nor demo. Reason: in a gold/jewelry store, customers usually don't want to open an account (a one-off, high-value purchase), and the WhatsApp-based contact model already functions like an "account" on its own (the store recognizes the customer via WhatsApp). The profile icon in the header is the admin login (see above), not for customers. If a loyalty program is added later (see "Won't-do list"), this decision could be revisited — but there's no such requirement in the MVP, or even in Phase 2.

## Search system

`/[locale]/axtar?q=...` — used both from the header's search icon (site-wide) and from the inline search box on each category page (within that category only), with the same backend logic.

**How it works:**
- Search operates on the text fields of the active `locale` (`titleAz` in `az`, `titleRu` in `ru`) + always on `Product.code` too (e.g. typing "4346" finds it directly).
- **For tolerance to typos and Azerbaijani letters (ş, ç, ö, ğ, ü, ı)**, two Postgres extensions are used:
  - `unaccent` — reduces letters like "ş/ç/ö/ğ/ü/ı" to their base form ("s/c/o/g/u/i"), so a user typing "sirga" on a regular keyboard (without special characters) finds "sırğa" products.
  - `pg_trgm` — trigram-based fuzzy matching (the `similarity()` function or the `%` operator), tolerates small typos (one or two wrong letters).
- Together, these two: a query like `unaccent(lower(titleAz)) % unaccent(lower(:query))` handles both diacritic-insensitivity and small typos. A heavy GIN/GiST index isn't needed at MVP scale (300-400 products) — can be added if the catalog grows.
- For Russian search, the same logic runs on `titleRu` — since Azerbaijani letters don't appear in Russian text, `unaccent` has no effect there, `pg_trgm` alone is enough.

## Homepage structure (top to bottom)

1. **Hero** — simple/static in Waves A-D (live gold price ticker + headline + CTA), switches to the cinematic Three.js/GSAP version in Wave E (see "Cinematic 3D hero").
2. **Categories component** — the category card grid (Rings, Necklaces, Earrings, etc.).
3. **"New arrivals" component** — the most recently added products, ordered by `createdAt DESC` (6-8 items).
4. **Footer** — see below.

## Footer

A shared footer on every page (storefront):

- A repeat of the nav links (Categories, Modellərimiz, Hesabla, Haqqımızda)
- Store info: address, phone/WhatsApp, working hours (see "Real data reference")
- Instagram icon/link
- Language switcher (a repeat of the header's, useful on mobile)
- Small legal text: "© 2026 Anar Jewellery" + (to be added before the real launch) Privacy Policy / Terms of Use links (currently placeholders, see "Won't-do list")
- The admin login link COULD also live here (in addition to/as an alternative to the header one, an even more subtle spot) — Claude Code can pick either, having both isn't required.

## Routing structure

```
/[locale]/                          → Homepage (locale: az | ru)
/[locale]/[category]                → Category listing, e.g. /az/uzukler
/[locale]/[category]/[code]         → Product detail, e.g. /az/uzukler/4346
/[locale]/lookbook                  → "Modellərimiz"
/[locale]/hesabla                   → Gold calculator
/[locale]/haqqimizda                → About + Address (anchor: #unvan)
```

**Decision — category slugs don't depend on locale.** Even at `/ru/uzukler/4346`, the word "uzukler" stays Azerbaijani, it isn't translated to "koltsa." Reason: keeping two slugs per category (canonical URL + redirect + hreflang complexity) is over-engineering for 2 languages. The category NAME shown in the UI is translated, ONLY the URL stays fixed — keeping a single canonical URL is also the right SEO practice for Google.

**What `[code]` is:** not Prisma's long `id` (cuid), but a separate `Product.code` field — short, human-readable (e.g. "4346", like on 24k.az). The route handler matches the `category` param to `Category.slug`, and `code` to `Product.code`; if there's a mismatch (an old link shared under the wrong category), a 301 redirect to the correct category happens instead of a 404.

## Database connection

`.env`: `DATABASE_URL` (pooled, `-pooler` hostname, application queries) and `DIRECT_URL` (direct, for migrations). `prisma migrate dev` only locally, `prisma migrate deploy` in production.

## Data model

```prisma
enum PriceUpdateMode {
  AUTOMATIC   // every cron fetch is applied to the whole site immediately
  MANUAL      // cron fetches and displays the price, but the old price stays on the site until admin says "Apply"
}

model Store {
  id                        String           @id @default(cuid())
  name                      String           // seed: "Anar Jewellery"
  address                   String?          // seed: "Atatürk avenue 2a, Ganjlik department store (Ganjlik Gold), 2nd hall" — real address
  phone                     String?          // seed: "+994504127999" — real, both call and WhatsApp
  whatsapp                  String?          // seed: "+994504127999" — same as phone, no separate number
  instagram                 String?          // seed: "instagram.com/anarjewellery" — real account
  priceUpdateMode           PriceUpdateMode  @default(AUTOMATIC)
  appliedGoldPriceSnapshotId String?         // only meaningful in MANUAL mode — written when admin presses "Apply"
  appliedGoldPriceSnapshot  GoldPriceSnapshot? @relation(fields: [appliedGoldPriceSnapshotId], references: [id])
  createdAt                 DateTime         @default(now())
  products                  Product[]
  staff                     Staff[]
}

model Category {
  id       String    @id @default(cuid())
  slug     String    @unique   // always Azerbaijani, fixed regardless of locale (e.g. "uzukler")
  nameAz   String
  nameRu   String
  products Product[]
}

enum MetalType {
  YELLOW_GOLD
  WHITE_GOLD
  ROSE_GOLD
  PLATINUM
  SILVER
  GOLD_PLATED_SILVER
  STEEL
  BIJOUTERIE
}

enum Gender {
  MALE
  FEMALE
  KIDS
  UNISEX
}

enum ProductStatus {
  NEW
  USED
}

enum PricingMode {
  WEIGHT_BASED   // formula based on gold weight (most jewelry)
  FIXED          // fixed price (watches, some costume jewelry) — the formula is not applied
}

model Product {
  id               String             @id @default(cuid())
  code             String             @unique  // used in the URL: /[category]/[code]
  titleAz          String
  titleRu          String
  categoryId       String
  category         Category           @relation(fields: [categoryId], references: [id])
  pricingMode      PricingMode        @default(WEIGHT_BASED)
  metalType        MetalType
  purity           Int?               // mandatory for WEIGHT_BASED: 375/417/500/583/585/750/875/916/995
  weightGrams      Decimal?           // mandatory for WEIGHT_BASED
  fixedPrice       Decimal?           // only when PricingMode = FIXED (e.g. watch price)
  priceOverride    Decimal?           // only meaningful on WEIGHT_BASED products — if set, the formula is bypassed entirely (when admin says "it calculated 500, I want 550"). On FIXED products this field must always stay null, since fixedPrice already serves the same purpose (Zod enforces this).
  stoneType        String?
  gender           Gender?
  status           ProductStatus
  laborCostPercent Decimal            @default(15)
  laborCostFixed   Decimal?
  stoneCost        Decimal?           @default(0)
  marginPercent    Decimal            @default(0)
  barterEligible   Boolean            @default(true)
  freeShipping     Boolean            @default(true)
  descriptionAz    String?
  descriptionRu    String?
  attributes       Json?              // category-specific filterable fields, see below
  images           ProductImage[]
  storeId          String
  store            Store              @relation(fields: [storeId], references: [id])
  sales            Sale[]
  leads            ContactLead[]
  styleShots       StyleShotProduct[]
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt

  @@index([categoryId])
  @@index([metalType])
  @@index([purity])
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id])
  url       String
  altAz     String  // alt text is mandatory, never left empty — the images ARE the product
  altRu     String
  order     Int     @default(0)
}
```

**Maximum 4 images per product.** There's no hard DB limit in the schema (Prisma doesn't easily enforce this), the admin upload form disables the "Add new image" button after the 4th image (at the Zod/UI level). The gallery on the product detail page **must be responsive and adapt to the image count** — a single large image when there's 1, small side-by-side thumbnails for 2-3, a full grid for 4; there should be no fixed "4-slot" template showing empty slots.

```prisma
enum StaffRole {
  ADMIN
  SALES_REP
}

model Staff {
  id         String    @id @default(cuid())
  name       String
  role       StaffRole @default(SALES_REP)
  active     Boolean   @default(true)
  storeId    String
  store      Store     @relation(fields: [storeId], references: [id])
  sales      Sale[]
  authUserId String?   @unique
}

model Sale {
  id              String   @id @default(cuid())
  productId       String
  product         Product  @relation(fields: [productId], references: [id])
  staffId         String
  staff           Staff    @relation(fields: [staffId], references: [id])
  finalPrice      Decimal
  goldPriceAtSale Decimal? // only filled on WEIGHT_BASED sales
  isBarter        Boolean  @default(false)
  notes           String?
  soldAt          DateTime @default(now())

  @@index([staffId, soldAt])
  @@index([soldAt])
}

model GoldPriceSnapshot {
  id               String   @id @default(cuid())
  pricePerGramAZN  Decimal
  pricePerOunceUSD Decimal
  source           String   @default("gold-api.com")
  fetchedAt        DateTime @default(now())
}

enum LeadChannel {
  WHATSAPP
  PHONE
  INSTAGRAM
}

model ContactLead {
  id        String      @id @default(cuid())
  productId String?
  product   Product?    @relation(fields: [productId], references: [id])
  channel   LeadChannel
  createdAt DateTime    @default(now())
}

model StyleShot {
  id            String             @id @default(cuid())
  imageUrl      String
  altAz         String
  altRu         String
  isAIGenerated Boolean            @default(true)
  products      StyleShotProduct[]
  createdAt     DateTime           @default(now())
}

model StyleShotProduct {
  styleShotId String
  styleShot   StyleShot @relation(fields: [styleShotId], references: [id])
  productId   String
  product     Product   @relation(fields: [productId], references: [id])

  @@id([styleShotId, productId])
}
```

**Why `StyleShot` has no `category` field:** it existed in an earlier version, and was removed — because it would be data that DUPLICATES the `products` relation (a photo's own category could end up disagreeing with the category of the products shown in it — a risk of logical error). The category filter chips on the `/lookbook` page are now computed via the `StyleShotProduct → Product → Category` join, no separate field is kept.

## Category-specific attributes (the `Product.attributes` JSON field)

The shared fields (`metalType`, `purity`, `weightGrams`, `gender`, `status`) exist on every product, as strongly-typed Prisma fields. But every category has its own filters — opening a dozen columns that stay empty for most products (ring size, watch brand, chain length...) would bloat the schema. Instead, the `attributes Json?` field holds keys that vary by category:

- **Rings:** `{ "ringSize": 17, "stoneShape": "oval" }`
- **Necklace/Pendant:** `{ "chainLengthCm": 45 }`
- **Earrings:** `{ "earringType": "stud" }`
- **Watch:** `{ "brand": "Casio", "movement": "quartz", "waterResistanceM": 30, "strapMaterial": "steel" }`

Since this is Postgres JSONB, a GIN index on it would be useful, but Prisma's `schema.prisma` syntax doesn't directly support a GIN index for JSON fields — if needed, it must be added via an extra raw SQL migration (`prisma migrate dev --create-only` + manually adding a `CREATE INDEX ... USING GIN` line). At MVP scale (300-400 products) filters will stay fast even without this index — it's only needed if the catalog reaches thousands of products, DON'T do it now (Simplicity First). Adding a new key to `attributes` for a new category, however, never requires a migration — that's the direct payoff of the "extensible" requirement.

**Critical logic note — `pricingMode`:** watches aren't priced by gold weight, their value is determined by brand and movement. On products where `pricingMode = FIXED`, `/lib/pricing.ts` does NOT apply the formula, it just returns `fixedPrice`. Without this distinction, a watch's price could be computed with the wrong formula and produce a meaningless number — this was the most important "logic error" trap in the project, and it's been headed off in advance.

**Note — there is no conditional requiredness at the Prisma level:** `purity` and `weightGrams` are `Int?`/`Decimal?` (nullable) in the schema — because `FIXED` products don't need them. The "mandatory for WEIGHT_BASED" note is NOT enforced at the database level, it must be enforced at the application level (Zod): when `pricingMode === "WEIGHT_BASED"`, the Zod schema must not allow `purity` and `weightGrams` to be `null` (conditional validation via `superRefine`). Forgetting this could mean a product like a watch is mistakenly set to WEIGHT_BASED with the weight left blank, silently producing a `NaN` price — tests must cover this (see "Test strategy").

## Gold types and the purity system (domain knowledge)

The fineness table — three notations expressing the same thing:

| Stamp (‰) | Karat | Purity | Note |
|---|---|---|---|
| 375 | 9K | 37.5% | Minimum legal standard in some countries |
| 417 | 10K | 41.7% | Minimum in the US, very durable |
| 500 | 12K | 50% | Rare, a transitional value |
| 583 | 14K | 58.3% | **Soviet-era** stamp (unrounded) |
| 585 | 14K | 58.5% | **International** stamp — the SAME karat as 583, just a different rounding convention |
| 750 | 18K | 75% | European jewelry standard |
| 875 | 21K | 87.5% | Common in Soviet/Middle Eastern markets |
| 916 | 22K | 91.6% | Most popular in the Middle East/Azerbaijani market |
| 995/999 | 24K | 99.5–99.9% | Bullion (bars/coins), too soft for jewelry |

**Implication for the code:** keep `purity` as an integer, do NOT merge 583 and 585 in the database (the stamp should be shown exactly as it's marked on the product), but when "14 karat" is selected in the filter UI, fetch both (585 AND 583) — filter logic should work on karat-equivalent grouping, not raw number equality.

**Attention — 925 is NOT gold:** a 925 stamp is silver (sterling silver, 92.5% pure), and must not be confused with a gold purity. When `MetalType.SILVER` is selected, `purity` can be 925 — the admin form must validate this separately.

**Metal colors** (a dimension separate from purity): yellow gold, white gold, red/rose gold, platinum, silver, gold-plated silver, steel (on watches).

**Categories:** ring, necklace, earrings, bracelet/bangle, set, pendant — these 6 come from the real Anar Jewellery catalog (see below). **Brooch, watch, gold bar/coin** are NOT in the real data — included with fake sample data (watch is `pricingMode = FIXED`, see above).

## Real data reference (Thunderbit scrape analysis, July 2026)

**Confirmation — every field in the JSON was mapped to the schema, none were left out:**

| Thunderbit JSON field | Schema equivalent |
|---|---|
| Product Name | `titleAz` (+ category was extracted from it) |
| Product URL | not stored — we build our own URL structure |
| Product Image | `ProductImage.url` |
| Price (AZN) | not stored, but reverse-engineered for price-per-gram calibration (see below) |
| Product Code | `Product.code` |
| Store Name/Location/Phone | `Store.name/address/phone` |
| Product Status | `ProductStatus` enum (NEW/USED) |
| Precious Metal | `MetalType` enum |
| Gender | `Gender` enum |
| Adjust (purity) | `Product.purity` |
| Caliber and Weight | `Product.weightGrams` |
| Precious Stones | `Product.stoneType` |
| Special Discount (barter) | `Product.barterEligible` |
| Shipping Information | `Product.freeShipping` |

An analysis of 264 real products scraped from the Anar Jewellery store page on 24k.az determines many of this project's default values. The seed script MIMICS these distributions (with made-up photos/prices, but real ratios):

**Category distribution** (264/264 categorized, using name-based keyword matching): Earrings 80 (30%), Bracelet/Bangle 55 (21%), Pendant 47 (18%), Necklace 43 (16%), Ring 23 (9%), Set 16 (6%).

**Purity distribution:** only 750 (18K, 231 items, 88%) and 585 (14K, 33 items, 12%) — the broader purity table (375-995) remains correct as general domain knowledge, but the seed's filter defaults should weight toward these two values.

**Price-per-gram calibration (the most important finding):** on stoneless 750-purity products, the price-per-gram ratio is nearly constant — average 124.4 AZN/gram (min 124.9–max 125.9). At 585 purity, average 96.2 AZN/gram. Category and whether there's a stone barely change this ratio — meaning the real store uses a single flat ratio, `stoneCost` is nearly always close to 0. The seed's `laborCostPercent`/`marginPercent` defaults should be calibrated so the live formula (based on today's spot price) produces results close to these ratios.

**Gender:** Female 246 (93%), Male 11, Kids 6, 1 blank (a data error, fixed by extracting "child" from the name).

**Stones:** 224/264 (85%) stoneless — plain gold is the majority. Among the rest: simple stone 13, Swarovski 11, malachite 5, amethyst 3, pearl 3, sapphire 2, citrine 2, topaz 1.

**Store-wide policies (not product-specific):** 264/264 eligible for "trade in old gold" (barter), 264/264 free shipping — since these are almost always true, the seed just keeps the default at true.

**Data quality lesson:** 1 obvious error was found (4 AZN/4 grams — where it should have been ~500 AZN). The import/seed script should include a sanity check on whether the price-per-gram ratio falls within a reasonable range — real data always carries small errors like this.

**Real store info** (seeded into the Store model): phone/WhatsApp `+994504127999`, address "Atatürk avenue 2a, Ganjlik department store (Ganjlik Gold), 2nd hall", Instagram `instagram.com/anarjewellery`. **Working hours are not real** — a TODO placeholder is used (Weekdays 10:00–19:00, Saturday 10:00–17:00, Sunday closed), until confirmed by the store owner.

**Russian titles:** the real data only has Azerbaijani names (some with a meaningless "(En)" suffix, cleaned up during import). The `titleRu` fields are a DRAFT translated by AI during seeding — this must be clearly marked in the code and comments so it isn't forgotten that it needs human review before the real launch.

## Price calculation logic

Every product's displayed price must go through a **single shared function** (`resolveProductPrice()`, `/lib/pricing.ts`) — the storefront, Xəzinə, the "inventory value" KPI on the admin Panel, and Reports all call this same function. The formula is never rewritten separately anywhere else — otherwise an override might show up on one screen and an outdated price on another (this is specifically to prevent that kind of silent inconsistency).

**Step 1 — override check:**
```
if (product.priceOverride != null) return product.priceOverride   // the formula is bypassed entirely
```
`priceOverride` can ONLY be set on products where `pricingMode = WEIGHT_BASED` — it gets filled in when the admin picks "manual fixed price" instead of "calculate automatically." On `FIXED` products (like watches) this field is meaningless, since `fixedPrice` already serves the same purpose — Zod enforces this via `superRefine`, the two must never both be set on the same product at once.

**Step 2 — the `pricingMode` branch** (reached only if `priceOverride` is empty):
```
if (product.pricingMode === "FIXED") return product.fixedPrice

// WEIGHT_BASED:
goldValue     = weightGrams × (purity / 1000) × effectiveGoldPricePerGramAZN
laborCost     = laborCostFixed ?? (goldValue × laborCostPercent / 100)
rawFinalPrice = (goldValue + laborCost + (stoneCost ?? 0)) × (1 + marginPercent / 100)
finalPrice    = Math.round(rawFinalPrice)   // round to the nearest whole AZN, see below
```

**Why the WEIGHT_BASED result is rounded to a whole AZN — a deliberate fix, not an afterthought:** without this, the live formula produces ugly decimals (e.g. 700.18 AZN), and the natural admin instinct is to reach for `priceOverride` just to make the number look clean — but doing that permanently freezes the product, so it stops moving with the daily gold price entirely. That's a bad trade: a cosmetic annoyance shouldn't cost the store its live pricing. Rounding to the nearest whole AZN as the very last step of the formula solves the cosmetic problem while the price keeps tracking the market every day (701 today, 699 tomorrow, etc.) — no admin action needed, and no product silently goes stale. `priceOverride` and `fixedPrice` are never rounded (whatever the admin types is used exactly), since the admin already controls their exact value.

**What `priceOverride` is actually FOR now that rounding handles the cosmetic case:** it's for a product whose price should be genuinely detached from the live gold market — e.g. a used/vintage piece with a one-off negotiated price, or a damaged/returned item manually re-priced. It is NOT meant to be reached for just to avoid a decimal — that's what the rounding above already solves. If the admin finds themselves overriding many products just because "the number looked odd," that's a sign the rounding/formula inputs need adjusting instead, not a sign to override more.

**Where `effectiveGoldPricePerGramAZN` comes from — Automatic vs Manual mode:**

The store owner's real need: sometimes he wants the price to change on its own every day, sometimes he wants "even if the market says 500, I'll apply 550 whenever I want." Hence `Store.priceUpdateMode`:

- **AUTOMATIC** (default): `effectiveGoldPricePerGramAZN` = the latest `GoldPriceSnapshot`. As soon as cron fetches a new price, it's reflected across the whole site immediately.
- **MANUAL**: cron still fetches and writes to `GoldPriceSnapshot` every time (the admin sees this as "market price: X, last updated: Y") — but `effectiveGoldPricePerGramAZN` actually comes from `Store.appliedGoldPriceSnapshot`, and the price on the site does NOT CHANGE until the admin presses **"Apply"** on the Settings → Gold Price screen. Pressing it updates `Store.appliedGoldPriceSnapshotId` to the latest snapshot. (If `appliedGoldPriceSnapshot` hasn't been set yet — e.g. on day one — it falls back to the latest snapshot, so the system doesn't start with an empty price.)

These three mechanisms (override, FIXED, AUTOMATIC/MANUAL) work together without breaking each other: the override always wins first, then the pricingMode branch, then (only for WEIGHT_BASED) the global mode.

**How the admin edits a single product's price, and what it does (and doesn't) do to cron:** on the Products tab, the admin can edit any product two ways — (a) adjust the formula inputs (purity, weight, labor %, margin %), which stays in Automatic mode and keeps moving with the daily gold price (now landing on a clean whole-AZN number thanks to the rounding above), or (b) type a number directly into `priceOverride`, which freezes that one product at that exact price — reserved for the genuine detached-from-market cases described above, not for cosmetics. **Neither option touches the cron job.** Cron keeps fetching and writing a new `GoldPriceSnapshot` every day regardless of what any individual product does — cron operates on the store-wide gold price, not per-product. An overridden product simply stops listening to it; removing the override makes it start listening again immediately, using whatever the current snapshot is at that moment.

**Where the global "store margin" (on Settings → Gold Price) actually plugs in — a clarification:** there are two margins that look similar and must not be confused. The per-product `marginPercent` is what's actually used in Step 2's formula above. The global store margin on the Settings screen is NOT applied as a second, separate multiplication on top of that (doing so would double-apply the margin — e.g. `... × 1.10 × 1.storeMargin` — producing an inflated, wrong price). Instead, the global value is only the **default that pre-fills the "Margin (%)" field when a new product is created** — the admin can then override it per product. This way the admin doesn't have to type "10%" by hand on every single product, but margin is still only ever applied once.

**Critical safety rule — `pricingMode` and non-gold metals:** the formula above always multiplies by the GOLD price (`effectiveGoldPricePerGramAZN`) — but `MetalType` also includes `SILVER` and `PLATINUM`. If a `WEIGHT_BASED` product were ever set with `metalType = SILVER` (or `PLATINUM`), the formula would price it using the gold rate, producing a wildly inflated price (gold is priced many times higher per gram than silver) — this is the single most dangerous latent bug risk in the pricing system. **Rule: Zod must enforce that whenever `metalType` is anything other than a gold variant (`YELLOW_GOLD`/`WHITE_GOLD`/`ROSE_GOLD`), `pricingMode` is required to be `FIXED` (or a `priceOverride` is required).** There is no live silver/platinum price API in the MVP — this is a deliberate Simplicity First constraint, not an oversight.

**What happens if the cron fetch fails:** if `gold-api.com` doesn't respond (network issue, API downtime, etc.), the system must NOT crash and must NOT silently write a null/zero price. The last successful `GoldPriceSnapshot` stays in place and continues to be used (`resolveProductPrice()` always reads "the latest snapshot," so an old-but-valid one is used automatically), the failed fetch attempt is logged (see `docs/phase_1/bugs.md` if it becomes a recurring issue), and the site keeps functioning normally with yesterday's price — it just doesn't get today's update until the next successful fetch.

**Live gold price API:** `gold-api.com` — free, no card required. AZN is pegged to USD at a fixed rate (~1.7), via `USD_TO_AZN_RATE` in `.env`. The API is not called on every page load — Vercel Cron fetches it a few times a day, writes to `GoldPriceSnapshot` (ALWAYS, regardless of mode), and pages read from the DB via `resolveProductPrice()`.

## Gold calculator (`/hesabla`) logic

This page isn't tied to any specific product — it's a standalone "what is my gold actually worth" tool. **It shows ONLY the raw gold value, it does NOT add labor/margin:**

```
rawGoldValue = weightGrams × (purity / 1000) × goldPricePerGramAZN
```

Below it, the page must have a small disclaimer line: *"This is the raw value of the gold itself — the price of a finished product may differ due to labor and design costs."* This is deliberate — see the decision below.

**Decision — the "trade in your old gold" CTA on the product page was removed:** in Stitch's original design, the product detail page had a secondary CTA — a "Trade this gold in for your old gold" button. As instructed, it's been removed both from the design prompt and from the actual site. Reason: the store owner doesn't want to actively push the trade-in offer on every product page. **Note — this does NOT remove the barter functionality itself:** the `Product.barterEligible` field stays (264/264 products qualify for it in the real store), it remains in the general trust-badge row on the homepage ("trade in old gold") in a passive/informational way — only the ACTIVE, insistent button on the product page was removed.

## Folder structure

```
/app
  /[locale]
    /(storefront)
      page.tsx                  → homepage
      /[category]
        page.tsx                 → category listing
        /[code]
          page.tsx                → product detail
      /lookbook                  → "Modellərimiz"
      /xezine                    → voronoi/force-layout discovery page (desktop only)
      /hesabla
      /haqqimizda
    layout.tsx                   → NextIntlClientProvider
  /admin
    /login
    /dashboard                   → Panel
    /products                    → Products (sub-tab: /style-shots → Modellərimiz management)
    /sales                       → Sales (sub-tab: sales-rep performance)
    /customers                   → Customers — "Coming Soon" empty state
    /reports                     → Reports
    /settings                    → Settings (gold price, store info, staff, language)
  /api
    /gold-price/route.ts         → protected by CRON_SECRET
middleware.ts                     → locale detection + admin auth
messages/
  az.json
  ru.json
/lib
  pricing.ts
  gold-api.ts
  prisma.ts
/prisma
  schema.prisma
  seed.ts
/components
  /storefront/...
  /admin/...
  /ui/...
```

## Admin panel — information architecture

6 main tabs in the left sidebar (+ the Modellərimiz sub-tab under Products, which can be thought of as a conceptual 7th section):

### 1. Panel (`/admin/dashboard`)

KPI cards (today's/weekly/monthly revenue, inventory value), best-selling categories, sales dynamics chart, recent sales table. **All of these are computed live** — none are filled in by hand or static: they come from real-time queries (or a short cache, revalidated every few minutes) against the `Sale`, `Product`, and `GoldPriceSnapshot` tables. Inventory value is precisely the sum of the `resolveProductPrice()` function across all active products (see "Price calculation logic").

### 2. Products (`/admin/products`)

CRUD, comprehensive filters (category, metal type, purity, status, `pricingMode`, price range), pagination (1, 2, 3 … 13, etc.). Sub-tab: **Modellərimiz** (`/admin/products/style-shots`) — see the separate section below.

**The "Add new product" form — the full field list** (this form wasn't detailed in Stitch's original design, a dedicated Stitch prompt is written for it below):

- Name (AZ), Name (RU)
- Category (dropdown, from `Category`)
- Pricing type: "Automatic (based on gold weight)" / "Fixed price" toggle (`pricingMode`)
- **If Automatic is selected:** Metal type, Purity (dropdown: 375/417/500/583/585/750/875/916/995), Weight (grams), Labor cost (% or a fixed AZN amount, one of the two), Stone type (optional), Stone cost (optional), Margin (%), an optional "Manually set a fixed price" override field (`priceOverride`)
- **If Fixed is selected:** Fixed price (AZN) (`fixedPrice`)
- Gender (Female/Male/Kids/Unisex)
- Status (New/Used)
- Category-specific attributes (dynamic fields depending on the chosen category — "size" for rings, "brand/movement" for watches, etc., see "Category-specific attributes")
- Barter eligibility (toggle, on by default), Free shipping (toggle, on by default)
- Description (AZ), Description (RU)
- Images — drag-and-drop upload, **maximum 4**, each with mandatory Alt text (AZ) + Alt text (RU) fields

### 3. Sales (`/admin/sales`)

Two sub-tabs:

- **Sales records** (active by default) — filters: category, metal type, status, price range (min/max), a "Filter" button; below it, a table (date, product, sales rep, amount, barter or not).
- **Sales-rep performance** — a leaderboard, a daily/weekly/monthly toggle, each row with name/sale count/revenue/average sale amount/mini-chart.

**An important addition — the "Add new sale record" button and modal** (this was MISSING from the original design, the gap has been filled — a dedicated Stitch prompt is below):

- Product selection (a searchable dropdown — by code or name, the currently calculated price is shown automatically once selected)
- Sales-rep selection (a dropdown of active `Staff`)
- Final price (pre-filled with the automatic price above, but **editable** — for discount/negotiation cases)
- Was it a barter? (toggle)
- Note (optional text field)
- Sale date/time (defaults to right now, but editable for entering a sale with a past date)

### 4. Customers (`/admin/customers`)

**Shown with a "Coming Soon" badge, not clickable in the MVP.** The `ContactLead` table is already collecting WhatsApp/phone clicks in the background — only the UI isn't ready, no data is lost.

### 5. Reports (`/admin/reports`)

The most comprehensive, filterable screen. A dedicated Stitch prompt was prepared (Prompt 5). **The chart type chosen should match the nature of the data** (for statistical readability):
- Sales report (over time) → **a line chart**, a 7-day moving average can be added to smooth out natural daily fluctuation.
- Sales by category → **a horizontal bar chart** (more readable than a pie chart for 6-9 categories — a pie chart makes comparison harder with many slices).
- Sales-rep performance → **a horizontal bar/leaderboard** (names on the left, length = revenue).
- Inventory value by category → **a stacked bar or a treemap** (to quickly see which category is "tying up" how much of the capital).

### 6. Settings (`/admin/settings`)

4 sub-sections:

**Gold price** — the most complex section:
- Current market spot price (live, the latest `GoldPriceSnapshot`)
- Store margin (%) — a global default margin (doesn't replace the per-product `marginPercent`, it's a general reference value)
- **Automatic/Manual toggle** (`Store.priceUpdateMode`) — when Manual is selected, shows "Market price: X AZN (last updated: ...) | Currently applied: Y AZN" + an **"Apply"** button (see "Price calculation logic")
- A price history chart, with a **time-range toggle at the top: 1 Week / 1 Month / 1 Year**
- 3 KPIs below the chart: **Highest, Lowest, Average price** (within the selected time range)

This toggle/button/chart is added on top of the existing "Gold price" screen from Stitch — no new Stitch screen is needed, Claude Code extends the existing visual language.

- **Store info** — address/phone/WhatsApp/Instagram/working hours (these fields auto-fill `/haqqimizda`)
- **Staff** — Staff CRUD (add/edit/deactivate). **Gap filled:** no design had an "Add sales rep" form (raising the question of where the dropdown data in the New Sale modal actually comes from) — Prompt 9 fills this gap, shared in chat + added to the design-prompt file.
- **Language** — default locale selection

In the earlier version, "Sales-rep performance" and "Gold price" were separate top-level tabs — now, following proper SaaS-admin IA, they've been placed under their corresponding main sections (the tab count stays at 6, instead of 8+ scattered tabs).

**Light/dark mode:** a toggle in the top-right corner, using Tailwind's `class` strategy (`dark:`-prefixed utilities), the preference is stored in a `theme` cookie (not localStorage — so there's no flash-of-wrong-theme on SSR, the cookie is read in a server component and applied on the first render). NOT applied to the storefront, admin only.

## "Modellərimiz" — the lookbook page (route: /lookbook)

The label shown in the nav is **"Modellərimiz,"** the technical route is `/lookbook` — "lookbook" is an internationally recognized term in jewelry/fashion e-commerce, stronger for SEO than a literally-translated slug. The label is translated, the slug stays fixed.

**The real admin workflow (not fake data):**

1. Staff hand a product's real photo to an external AI image tool (Krea.ai, Photta, SellerPic, etc.).
2. The tool produces an image showing that product worn on a model.
3. The image is uploaded from the **Products → Modellərimiz** sub-tab in the admin panel (`/admin/products/style-shots`).
4. The admin selects which product(s) are in the image (a single photo can contain more than one piece), and after saving it's automatically published on `/lookbook`.

- **This workflow must genuinely work in the MVP** — it's one of the most impressive features to show live during the demo. Only the initial seed data is fake, not the workflow itself.
- If `isAIGenerated` is true, show a "Süni intellektlə hazırlanmış görüntü" ("AI-generated image") badge in the UI — for transparency, don't hide it.
- On hover/tap, a "shop this look" badge appears for each product in the image, and clicking it goes to the real `/[locale]/[category]/[code]` page.
- The category filter chips are derived from the `StyleShotProduct → Product → Category` join (see the note above).

## Cinematic 3D hero (Three.js + GSAP + Lenis + Motion) — Wave E

**This section is part of Wave E — it isn't coded until Wave D is done and the user gives explicit confirmation.**

A single cinematic opening scene on the homepage hero — not for each of the 300 products, built around one generic/stylized gold object.

**Object source — no external model is sought:** the object is NOT a file downloaded from Sketchfab or generated by an AI text-to-3D tool like Meshy/Sloyd. It's created directly from code with Three.js's own primitive geometry (`TorusGeometry` — a ring shape) plus a high-metalness/low-roughness PBR gold material. Reason: since the object is a simple shape, there's no need for an external file — this completely eliminates any licensing/sourcing question, and it also follows the "Simplicity First" principle (zero external dependency, zero download, zero file-size concern). If a more detailed mesh is wanted later, this decision can be revisited, but a code-generated object is enough for the MVP.

- **Three.js + React Three Fiber:** builds the scene, dramatic lighting + a single object (atmosphere matters more than geometric density).
- **GSAP + ScrollTrigger:** ties scroll to the camera — the object enters the scene, zooms in, moves aside, the CTA appears; roughly a 3-4 second experience.
- **Lenis:** a smooth-scroll library alongside GSAP — smooths out the feel of scrolling, a small library riding on top of ScrollTrigger, doesn't add a new page/route/complexity.
- **Cursor-reactive lighting (inspired by Hubtown):** the light's position is tied to the cursor — as the mouse approaches the object, more brightness/shadow detail on the surface is revealed. Not a new object/scene, just a parameter of the single existing light source — cheap, low risk.
- **Motion** (`motion/react`): all the micro-animations across the rest of the site (card hover, filter drawer, page transitions) — works everywhere, mobile included.
- **Mobile:** the WebGL scene is never sent at all — a short, pre-rendered video loop of the same scene plays instead. A deliberate choice so it doesn't conflict with the storefront's mobile-first principle.
- Homepage only — the rest of the site doesn't carry this weight.

**Ideas deliberately NOT taken** (reviewed and rejected, noted here so they don't come up again): a Cartier Watches & Wonders-style multi-room 3D structure (the scope grows disproportionately), a Web Audio/sound layer (accessibility + autoplay risk), a WebGPU render engine + fallback logic (WebGL2 is enough for this scene, this would be premature optimization).

## "Xəzinə" — the voronoi/force-layout discovery page — Wave E

**This is also part of Wave E, the same gate rule applies.**

The MVP's second signature feature. Inspired by the "Voroforce" concept in the `nothing-to-watch` (gnovotny) project — a "treasure chest" feel that shows hundreds of product photos as cells floating in a force simulation, leaning against one another.

**Important decision — we don't fork the code:** the license of the inspiration repo is unclear to us (a fork mentions MIT, but the original repo's own license hasn't been separately verified). We don't take that risk on a commercial project — we build the same visual concept **from scratch**, with clearly-licensed open libraries (`d3-force` + the existing Three.js/R3F).

**Technical approach:**
- `d3-force` computes the position physics (where each cell sits), Three.js/R3F renders it — the computation runs in a Web Worker so the main thread isn't blocked.
- A maximum of ~150 cells (products) are shown on screen at once — not all 300, either a random selection or the newest products. The exact number is tuned during performance testing.
- When a category filter chip is selected (e.g. "Rings") the force simulation rearranges — cells slide fluidly to their new positions, the page doesn't reload.
- Cells near the cursor push apart from one another, the hovered cell grows and sharpens, clicking it goes to the real `/[locale]/[category]/[code]` product page.

**Placement:** NOT added to the main navigation as a 7th item (the nav already has 6 items, let's not overload it) — instead, a "Discover the Treasure" CTA button on the homepage leads to this page. Route: `/[locale]/xezine`.

**Desktop only:** so it doesn't conflict with the storefront's mobile-first principle, mobile is redirected entirely to the classic category grid (no WebGL/force-simulation code is ever sent to mobile — via code-splitting).

**Does NOT replace the classic catalog:** `/[locale]/[category]` (the regular filterable grid) remains the primary shopping path. Xəzinə is an additional, discovery-oriented option — a customer looking for a specific filter (e.g. "an 18-karat ring under 5 grams") will use the classic path.

## Performance budget

The targets below are **a constraint valid in every wave** (no code contradicting them is written starting from Wave A), but a **comprehensive Lighthouse audit and optimization pass is Wave E's job** — meaning we don't violate the budget, but we save the systematic measure-and-fix step for the end.

All animation/3D decisions are subject to this budget, the budget wins if there's a conflict:

- **Target Lighthouse Performance score of 90+, mobile included.**
- **LCP (Largest Contentful Paint) does not exceed 2.5 seconds.**
- The Three.js hero AND the Xəzinə page are lazy-loaded via Intersection Observer — not loaded when the page first opens, kicks in only when the user reaches that section (hero) or navigates to that route (Xəzinə).
- **Device/preference check:** if there's no WebGL2 support, OR the user's `prefers-reduced-motion` preference is active, a static/simple fallback is shown instead of the 3D hero and Xəzinə even on desktop. This is needed both for accessibility and for older desktops/tablets with weak GPUs.

## Demo/staging security

**No password wall is needed.** During development the site only runs on localhost — it's never deployed while it still has fake data. The store owner is shown the demo locally (on the laptop / via screen share). Only once the owner approves and real data has been entered is the site deployed to Vercel — meaning there's never a stage where a fake-data version is sitting on a public URL that needs hiding. (An earlier version of this document included a Vercel Password Protection step for an in-between "deployed but not yet public" phase — that phase doesn't exist in the actual workflow, so it was removed.)

The only thing kept, as simple, free insurance for the first real deploy: `Disallow: /` in `robots.txt` + `noindex, nofollow` metadata on every page, removed once the real launch is confirmed — so Google doesn't index the site a few days early while final content checks are still happening after the first deploy.

## SEO and metadata

Baseline SEO (Metadata API, a proper title/description on every page) is applied in every wave — what's left for later is the **comprehensive audit + the final polish of OG images/sitemap** (Wave E).

- The Next.js Metadata API (`generateMetadata`) creates Open Graph tags (title, image, price) on every product page — so a link shared on WhatsApp shows a nice preview (critical in a WhatsApp-based sales model).
- `sitemap.ts` / `robots.ts` (Next.js built-in conventions) — activated once the demo phase ends.

## Analytics — Wave E

**Setting up GA4 also belongs to Wave E** — analytics isn't added before the core site is done.

- **Google Analytics 4** — chosen because more powerful, event-based tracking is needed (more detailed than Vercel Analytics, but requires a cookie-consent banner — a deliberately accepted trade-off).
- A **cookie-consent banner** is MANDATORY — GA4 sets cookies, it must not activate without consent (the banner has an "Accept/Reject" choice, and if rejected the GA4 script never loads at all).
- Key events to track: Xəzinə page usage (entry, product clicks), WhatsApp/phone button clicks, language switching (AZ↔RU), gold-calculator usage, "shop this look" clicks from "Modellərimiz" images. Goal: measure which "wow" feature genuinely helps sales, and which one is just "pretty but ineffective."

## Test strategy

Money math is the most dangerous kind of bug:

- Unit tests with Vitest are MANDATORY for `/lib/pricing.ts` and `/lib/gold-api.ts`, written BEFORE the code — covering 583 vs 585, the `pricingMode = FIXED` branch, the erroneous case of `WEIGHT_BASED` with `purity`/`weightGrams` `null` (which Zod should catch), the formula being fully bypassed when `priceOverride` is set, `priceOverride` + `FIXED` on the same product (a case Zod should reject), the fallback in `MANUAL` mode when `appliedGoldPriceSnapshot` hasn't been set yet, `WEIGHT_BASED` combined with a non-gold `metalType` (which Zod should reject), a failed `gold-api.com` fetch falling back to the last successful snapshot instead of crashing or writing a null price, the WEIGHT_BASED result rounding to the nearest whole AZN while `priceOverride`/`fixedPrice` are returned exactly as entered (unrounded), and edge cases like zero/negative weight.
- Tests aren't mandatory for other parts, but anywhere money is calculated requires a test.

## API security

`/api/gold-price` can only be called by Vercel Cron or with an `Authorization: Bearer $CRON_SECRET` header — preventing anyone on the open internet from calling this endpoint and sending unnecessary requests to the external API.

## .env.example

```
DATABASE_URL=
DIRECT_URL=
USD_TO_AZN_RATE=1.7
GOLD_API_URL=https://www.gold-api.com/
CRON_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=              # r2.dev subdomain or a custom domain
NEXT_PUBLIC_GA_ID=          # Google Analytics 4 measurement ID, only loaded after cookie consent is given
```

## Mobile/desktop behavior

- **Storefront:** completely mobile-first.
- **Admin:** every page under `/admin` shows a simple summary card + a "This panel works better on a computer" message when the viewport is under 768px. Solved with a single `<MobileGate>` wrapper, simple enough not to need its own design — no separate screen was produced for it in Stitch.

## Code rules

- Server Components by default; don't open a client component unless interactivity is required.
- Form submits via Server Actions.
- Every Prisma query lives inside a function under `/lib` — no inline Prisma calls inside components.
- Currency is always Prisma `Decimal`, never `float`/`number`.
- For locale-aware fields (like `titleAz`/`titleRu`), which language to show is always determined from the active `locale` parameter, never guessed from the browser's language.
- After every significant step (a bug fixed, an architecture decision made, a wave finished), the corresponding `docs/` file is updated — see "Documentation protocol."

## Extensibility notes

- The `Store` model is a single record — a second branch won't require a code change.
- `attributes Json?` doesn't require a migration for new category-specific fields.
- `pricingMode` can be extended for new pricing models.
- The i18n structure is ready for a 3rd language (English): one line + one JSON file + two columns.
- The `Sale` model is meaningful even without payment integration — once checkout is added, it keeps writing to the same table.

## Won't-do list (out of MVP scope — a deliberate decision)

- Online payment/checkout
- Customer account/login (on the storefront side)
- Multiple branches/brands
- AR/3D product visualization (except for the hero section)
- A loyalty program
- **The Customers (CRM) UI** — the table is filling up in the background, there's no screen for it yet
- A 3rd language (English) — the structure is ready, there's no content
