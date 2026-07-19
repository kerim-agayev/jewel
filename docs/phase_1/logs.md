# İş Günlüyü

Hər sessiya sonunda qısa özət. Format: tarix, hansı dalğa, nə edildi, nə qaldı.

### [2026-07] Planlaşdırma sessiyası (kodlaşdırma öncəsi)
Claude ilə birlikdə: rəqib analiz (24k.az), texnologiya seçimi (Next.js 15 + Prisma + Neon), admin İA (6 tab), i18n (AZ+RU, admin daxil), Xəzinə/sinematik hero konsepsiyaları, 264 real məhsulun Thunderbit analizi, R2 qərarı, Wave A-E planı və `docs/` protokolu quruldu. Kodlaşdırma hələ başlamayıb — bu, Wave A-nın ilk günlük qeydi olacaq.

**Növbəti addım:** Wave A — Next.js quraşdırma.

### [2026-07-19] Wave A — Təməl (bitib)
`docs/` faylları `docs/phase_1/`-ə köçürüldü (spesifikasiya ilə uyğunlaşdırma). 11 `claude-code-templates` skill-i quraşdırıldı. Next.js layihəsi quraşdırıldı — **Next.js 16** (istifadəçi ilə təsdiqləndi, "15" spesifikasiyası köhnəlmişdi), React 19.2, Tailwind v4, `middleware.ts` əvəzinə yeni `proxy.ts` konvensiyası. Prisma 7 sxemi (`CLAUDE.md`-dəki tam data modeli) yazıldı və Neon-a qarşı ilk migrasiya uğurla işlədildi (10 cədvəl) — yol boyu Prisma 7-nin `prisma.config.ts`-ə keçmiş datasource modelini və bir dəfəlik `shadowDatabaseUrl` qarışıqlığını (bax `bugs.md`) həll etmək lazım gəldi, heç bir data itkisi olmadı. `next-intl` skeleti (routing, proxy, `[locale]` layout, boş `messages/az.json`+`ru.json`) quraşdırıldı, `/az` və `/ru` boş layout ilə açılır. Dizayn tokenləri (rənglər, tipoqrafiya, spacing) Stitch-in əsl `code.html` ixraclarından (təkcə `DESIGN.md`-dən yox) Tailwind v4-ün CSS-first `@theme` sintaksisinə köçürüldü — yolda `DESIGN.md`/əsl kod arasında bir `borderRadius` uyğunsuzluğu tapıldı və düzəldildi. Cloudflare R2 qoşuldu (`@aws-sdk/client-s3`, `/lib/r2.ts`), test şəkli yükləndi və `next/image` ilə göstərilməsi təsdiqləndi. `/ponytail-review` 3 həddindən artıq mürəkkəblik tapıntısı (istifadəçisiz `i18n/navigation.ts`, boş `messages` admin açarı, artıq mühafizəli `next.config.ts` şərti) tapdı, hamısı düzəldildi. Bütün bitmə meyarları (migrate dev xətasız, `/az`+`/ru` işləyir, R2 test şəkli göstərilir) təsdiqləndi.

**Qaldı:** Wave B başlamazdan əvvəl istifadəçi təsdiqi lazımdır.

### [2026-07-19] Wave B — Storefront Çəkirdəyi (bitib)
Planlaşdırmadan əvvəl aşkarlanan boşluq bağlandı: `CLAUDE.md` sahte seed kataloqunun ŞƏKİLLƏRİNİN haradan gələcəyini demirdi (yalnız mətn/rəqəm datası təsvir olunmuşdu) — yeni "Seed product images (fake catalog)" bölməsi əlavə edildi (Pexels API, Unsplash-a qarşı seçim səbəbi ilə), qərar `decisions.md`-də tarixləndi.

**Pul hesablama (TDD, əvvəlcə testlər):** `/lib/pricing.ts` (`resolveProductPrice`, `getWeightBasedPriceBreakdown`, `getEffectiveGoldPricePerGramAZN`) və `/lib/gold-api.ts` (`refreshGoldPriceSnapshot`) — CLAUDE.md-nin "Test strategy" bölməsindəki bütün ssenarilər (583/585, FIXED budağı, override bypass, MANUAL fallback, yuvarlama, sıfır/mənfi çəki, cron fetch uğursuzluğu) Vitest ilə örtüldü, kod YALNIZ testlərdən sonra yazıldı. `/lib/validation/product.ts` (Zod, `superRefine`) — WEIGHT_BASED+qeyri-qızıl metal, priceOverride+fixedPrice ziddiyyəti kimi CLAUDE.md-nin kritik təhlükəsizlik qaydalarını məcburi edir. Yekun: 40 test, hamısı yaşıl.

**Cron:** `/api/gold-price` (`CRON_SECRET` ilə qorunur) + `vercel.json` (`vercel.ts` yox — Sadəlik Birinci, bax `decisions.md`) cədvəli quruldu; lokal inkişaf üçün seed skripti bir dəfəlik canlı sorğu edir ki, `/hesabla` dərhal real qiymət göstərsin.

**Seed (`prisma/seed.ts`):** 294 məhsul (264 real nisbətli + 30 sahte: Broş 8/Saat 15/Qızıl külçə 7 — istifadəçi ilə təsdiqləndi), Pexels-dən kateqoriya başına bir şəkil hovuzu (məhsul başına yox), qiymət/qram kalibrasiyası canlı qızıl qiymətinə əsasən (bugünkü bazar qiyməti tarixi hədəf nisbətdən (124.4 AZN/qram) yüksək olduğu üçün marja 5%-lik minimuma "floor" edildi — mənfi marja qeyri-mümkün olduğundan, bax kod şərhi). Sanity-check (real datasetdəki "4 AZN/4qr" xətasını əks etdirən) heç bir uğursuzluq vermədi.

**Səhifələr:** Ana səhifə, kateqoriya siyahısı (filtrlər + çeşidləmə + səhifələmə, hamısı server-side, JS-siz checkbox-lar), məhsul detalı (adaptiv qalereya, qiymət parçalanması / tək sətir FIXED+override üçün, OG teqlər, 301-ekvivalent redirect kateqoriya uyğunsuzluğunda), Hesablayıcı (yalnız xam qızıl dəyəri, spesifikasiyaya tam uyğun — dizayndakı 30-günlük qrafik bilərəkdən çıxarıldı), Haqqımızda/Ünvan (Google Maps embed), Sevimlilər (localStorage, `useSyncExternalStore`).

**Real brauzer testi (Playwright) 4 bug tapdı ki, `tsc`/`vitest`/`curl` tapa bilməzdi** (bax `bugs.md` tam detallar üçün): (1) Server Component-dən Client Component-ə funksiya prop-u ötürülməsi (500 xəta), (2-3) `useSyncExternalStore`-un həm server, həm client snapshot-larının keşlənməməsi (sonsuz dövr riski), (4) `Intl.NumberFormat("az-AZ")`-ın server (Node, tam ICU) və client (brauzer, fərqli ICU) arasında ayrı nəticə verməsi (hidrasiya uyğunsuzluğu) — həll: `"en-US"` ilə formatlayıb ayırıcıları əl ilə dəyişmək. Əlavə: `GOLD_API_URL` səhv host göstərirdi (düzəldildi), homepage-in "Yeni gələnlər" bölməsi seed sırasına görə yalnız qızıl külçələrlə dolmuşdu (kateqoriyalar üzrə seed sırası qarışdırıldı).

**`/ponytail-review`:** 1 real tapıntı (Decimal-in öz `.round()` metodu əvəzinə `Math.round(toNumber())` işlədilməsi) + 6 istifadə olunmayan `export` (tip yalnız daxili istifadə üçün) + 1 təkrarlanan `wa.me` linki (5 yerdə, `lib/format.ts`-ə `waLink()` çıxarıldı) + `MobileNav`-ın `NAV_ITEMS`-i təkrar yazması (indi paylaşılan array-dan render olunur) — hamısı tətbiq edildi, bir tapıntı (GoldCalculator-un purity siyahısını `KARAT_BY_PURITY`-dən derive etmək) aydınlıq/qoşulma mübadiləsinə görə RƏDD edildi.

Bütün 3 bitmə meyarı brauzerdə təsdiqləndi. `npm run build`/`test`/`lint` təmiz.

**Qaldı:** Wave C başlamazdan əvvəl istifadəçi təsdiqi lazımdır.
