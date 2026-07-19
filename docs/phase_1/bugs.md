# Bug İzləyici

Hər bug üçün: simptom, kök səbəb, həll — tarix damğalı. Kodlaşdırma başlamadığı üçün hələ boşdur.

## Format

```
### [Tarix] Qısa başlıq
**Simptom:** Nə baş verdi, necə aşkar edildi.
**Kök səbəb:** Əsl problem nə idi.
**Həll:** Nə dəyişdirildi.
**Fayl(lar):** Toxunulan fayllar.
```

---

### [2026-07-19] `globals.css` PostCSS xətası — şərhin içində `*/`
**Simptom:** `npm run dev` işə salınanda `/az` və `/ru` 500 verdi: `CssSyntaxError: Unknown word etc.` (`globals.css:73`).
**Kök səbəb:** CSS şərhi `/* ... p-*/m-*/gap-*/max-w-* etc. */` daxilində "p-*/" ardıcıllığı PostCSS tərəfindən şərhin ERKƏN bitməsi kimi oxundu (CSS şərhləri nested `*/` icazə vermir), qalan mətn etibarsız CSS kimi parse edildi.
**Həll:** Şərh mətni `*/` ardıcıllığı olmayacaq şəkildə yenidən yazıldı ("padding, margin, gap, and max-width utilities").
**Fayl(lar):** `app/globals.css`

### [2026-07-19] `prisma.config.ts`-də `shadowDatabaseUrl` = eyni fiziki DB, `_prisma_migrations` itdi
**Simptom:** İlk `prisma migrate dev --name init` uğurla keçdi (10 cədvəl + `_prisma_migrations` yaradıldı, birbaşa Node skripti ilə təsdiqləndi). Eyni komandanı dəyişiklik olmadan İKİNCİ dəfə işə salanda `P3005: database schema is not empty` xətası, sonra (config düzəldildikdən sonra) bütün cədvəllər üçün "[+] Added..." göstərən tam struktur fərqi və **"We need to reset the public schema... all data will be lost"** təklifi göründü.
**Kök səbəb:** `prisma.config.ts`-də `datasource.url = DATABASE_URL` (pooled) və `shadowDatabaseUrl = DIRECT_URL` təyin edilmişdi — amma Neon-da pooled və direct URL-lər EYNİ fiziki verilənlər bazasına işarə edir (ayrı bir "shadow" bazası deyil, sadəcə fərqli bağlantı yolu). Prisma-nın shadow-diff mexanizmi bunu dispozə edilə bilən boş bir baza kimi işlətməyə çalışanda, artıq mövcud (bizim əsl) cədvəllərlə qarşılaşdı → yarımçıq/uğursuz shadow hazırlığı zamanı əsl bazadakı `_prisma_migrations` cədvəli itdi (özəl 10 model cədvəli strukturca toxunulmaz qaldı — heç bir sətir/data itkisi olmadı, çünki bu mərhələdə cədvəllər boş idi). Əlavə olaraq, əvvəlki uğursuz cəhddən qalan advisory lock (pgbouncer bağlantısı üzərindən, `pg_advisory_lock(72707369)`) sonrakı bütün `migrate`/`resolve` əmrlərini 10 saniyəlik timeout ilə bloklayırdı.
**Həll:**
1. `prisma.config.ts`-də YALNIZ `url: DIRECT_URL` saxlanıldı, `shadowDatabaseUrl` tamamilə çıxarıldı (Prisma-nın öz aynı server üzərində müvəqqəti/dispozə edilə bilən shadow baza yaratmasına icazə verildi — Neon-un `neondb_owner` rolu bunun üçün kifayət qədər səlahiyyətlidir).
2. Sıxışmış advisory lock-u (pid, pgbouncer bağlantısı üzərindən) `pg_terminate_backend()` ilə (ayrı bir bağlantıdan) dayandırıldı — DESTRUKTİV `migrate reset` əmri İCRA EDİLMƏDİ, çünki heç bir real data itkisi riski yox idi, sadəcə bookkeeping bərpası lazım idi.
3. `npx prisma migrate resolve --applied 20260718214617_init` — mövcud cədvəllərə TOXUNMADAN yalnız `_prisma_migrations` qeydini bərpa etdi.
4. Doğrulama: `prisma migrate status` → "Database schema is up to date!", təkrar `prisma migrate dev` → "Already in sync", 10 cədvəl + sağlam `_prisma_migrations` birbaşa sorğu ilə təsdiqləndi.
**Fayl(lar):** `prisma.config.ts`
**Dərs:** Neon kimi provayderlərdə pooled/direct URL-lər EYNİ bazaya aiddir — `shadowDatabaseUrl`-ə heç birini qoymaq düzgün deyil, bu sahə YALNIZ HƏQİQƏTƏN ayrı, dispozə edilə bilən bir baza üçündür; adətən sadəcə silinməlidir ki, Prisma öz müvəqqəti bazasını avtomatik idarə etsin.

### [2026-07-19] Tailwind v4 `design/`/`docs/`/`.claude/` qovluqlarını da skan edirdi — CSS bundle şişirdi
**Simptom:** Kompil olunan CSS gözlənilmədən 5013 sətir idi, WhatsApp-yaşılı `#25d366` kimi heç yerdə yazmadığım rənglər bundle-da göründü.
**Kök səbəb:** Tailwind v4 default olaraq bütün layihəni (content siyahısı təyin etmədən) skan edir — `design/*/code.html` (Stitch mockup-ları), `docs/` və `.claude/skills/` faylları da mətn daxilində Tailwind sinif adlarına bənzər ifadələr (`bg-[#25D366]`, `rounded-sm` və s.) daşıyırdı, bunlar tətbiqin özünə aid olmadığı halda utility CSS-ə çevrilirdi.
**Həll:** `app/globals.css`-ə `@source not "../design"`, `@source not "../docs"`, `@source not "../.claude"` əlavə edildi — bundle 674 sətrə düşdü, yad rənglər yox oldu.
**Fayl(lar):** `app/globals.css`

### [2026-07-19 — Wave B] `GOLD_API_URL` səhv host göstərirdi
**Simptom:** `/lib/gold-api.ts` yazılmazdan əvvəl real endpoint yoxlanılanda `https://www.gold-api.com/price/XAU` 404 qaytardı.
**Kök səbəb:** `.env`, `.env.example` və `CLAUDE.md`-nin öz `.env.example` bloku `GOLD_API_URL=https://www.gold-api.com/` (marketinq/dizayn saytı) göstərirdi — real API isə ayrı bir subdomendə yaşayır: `https://api.gold-api.com/price/XAU` (`GET`, autentifikasiya tələb etmir, `{currency, currencySymbol, exchangeRate, name, price, symbol, updatedAt, updatedAtReadable}` qaytarır, `price` = XAU-nun USD/ons dəyəri).
**Həll:** Hər üç yerdə (`.env`, `.env.example`, `CLAUDE.md`) `GOLD_API_URL=https://api.gold-api.com/price/XAU` olaraq düzəldildi.
**Fayl(lar):** `.env`, `.env.example`, `CLAUDE.md`

### [2026-07-19 — Wave B] Server Component-dən Client Component-ə funksiya prop-u ötürülürdü
**Simptom:** `/az/uzukler` və `/az/saatlar` 500 verdi (digər səhifələr toxunulmamışdı) — `curl` ilə status kodu yoxlanarkən tapıldı. Dev server logunda: `Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server"`.
**Kök səbəb:** `app/[locale]/(storefront)/[category]/page.tsx` (server component) `SortSelect`-ə (`"use client"`) `buildHref={(sort) => buildSortHref(rawSearchParams, sort)}` adlı bir funksiyanı birbaşa prop kimi ötürürdü — RSC sərhədini funksiyalar keçə bilmir (yalnız serializasiya olunan data və ya `"use server"` ilə işarələnmiş server action-lar keçə bilər).
**Həll:** `SortSelect` özü `rawSearchParams` (sadə obyekt, serializasiya olunur) qəbul edir və `buildSortHref`-i öz daxilində çağırır — funksiya sərhədi heç keçmir.
**Fayl(lar):** `components/storefront/SortSelect.tsx`, `app/[locale]/(storefront)/[category]/page.tsx`
**Dərs:** `curl` ilə hər route-un HTTP status kodunu yoxlamaq (yalnız "səhifə açılır" demək kifayət deyil) bu cür RSC sərhəd xətalarını tez aşkarladı.

### [2026-07-19 — Wave B] `useSyncExternalStore`-un `getServerSnapshot`-ı hər dəfə yeni boş massiv qaytarırdı
**Simptom:** Real brauzerdə (Playwright ilə skrinşot alarkən) konsol xətası — əvvəlcə "The result of getServerSnapshot should be cached to avoid an infinite loop", ilk düzəlişdən sonra eyni xəbərdarlıq "getSnapshot" üçün təkrarlandı. `curl`/`tsc`/vitest heç birini tuta bilmədi, yalnız faktiki brauzer render-i üzə çıxartdı.
**Kök səbəb:** İki hissəli eyni problem: (1) `getServerSnapshot()` funksiyası `return [];` yazırdı — hər çağırışda YENİ bir massiv referansı yaradırdı; (2) bu düzəldildikdən sonra, `readCodes()` (client-side `getSnapshot`) də hər çağırışda `JSON.parse(...)` ilə TƏZƏ bir massiv qaytarırdı, məzmun eyni olsa belə. `useSyncExternalStore` həm server, həm client snapshot funksiyaları üçün dəyər faktiki dəyişməyibsə SABİT (referensial cəhətdən dəyişməyən) qaytarılmasını gözləyir, əks halda hər render yeni "dəyişiklik" kimi görünür və sonsuz dövr riski yaranır.
**Həll:** Modul səviyyəsində bir dəfə yaradılan `const EMPTY_CODES: string[] = []` sabiti `getServerSnapshot()`-dan qaytarılır; `readCodes()` isə son oxunan xam JSON mətnini (`cachedRaw`) yadda saxlayır və yalnız mətn faktiki dəyişəndə yenidən `JSON.parse` edib nəticəni keşləyir (`cachedCodes`) — məzmun eyni qalarkən eyni massiv referansı qaytarılır.
**Fayl(lar):** `lib/favorites.ts`
**Dərs:** `tsc`/`vitest`/`curl` React-a xas runtime-only xətaları (hook qaydaları, referensial sabitlik) tuta bilmir — Wave B-nin son yoxlama addımı kimi Playwright ilə əsl brauzer render-i etmək bu tip bugı tapdı, sırf statik yoxlamalarla tapılmazdı. `useSyncExternalStore` istifadə edərkən HƏM server, HƏM client snapshot funksiyası keşlənməlidir, təkcə biri kifayət etmir.

### [2026-07-19 — Wave B] `Intl.NumberFormat("az-AZ")` server/client arasında fərqli ayırıcı verdi (hidrasiya uyğunsuzluğu)
**Simptom:** `/az/hesabla` səhifəsində Playwright skrinşotu Next.js dev overlay-də "1 Issue" göstərdi — hidrasiya xətası: server "164,76 AZN" (vergüllə) render etmişdi, brauzer (client) isə "164.76 AZN" (nöqtə ilə) gözləyirdi.
**Kök səbəb:** `GoldCalculator.tsx` (bir `"use client"` komponent, dəyər hər inputda YENİDƏN brauzerdə hesablanır) birbaşa `new Intl.NumberFormat("az-AZ")` çağırırdı. Node.js-də (server) bu locale-in tam ICU verilənləri var (yoxlanıldı: `node -e "..."` → "164,76" düzgün), amma Playwright-ın endirdiyi Chromium build-də "az-AZ" üçün ICU verilənləri fərqli davranır və defolt (nöqtəli) formata keçir. ECMA-402 spesifikasiyası yalnız "en-US" kimi bir neçə əsas locale-in HƏR yerdə mövcud olmasını təmin edir — "az-AZ" isə YOX, ona görə server (Node) və client (brauzer) arasında ayrı-ayrı nəticələr mümkündür.
**Həll:** `lib/format.ts`-də yeni `formatNumberAZ()` funksiyası — HƏMİŞƏ hər yerdə mövcud olan `"en-US"` locale ilə formatlayır, sonra vergül/nöqtəni əl ilə (mübadilə yolu ilə) yerini dəyişir. Bu, ICU verilənlərinin harada mövcud olub-olmamasından asılı olmadan HƏR mühitdə eyni nəticəni zəmanət edir. `GoldCalculator.tsx` öz ayrıca `Intl.NumberFormat` çağırışını silib `formatAZN()`-dan istifadə etməyə keçdi.
**Fayl(lar):** `lib/format.ts`, `components/storefront/GoldCalculator.tsx`
**Dərs:** `Intl.NumberFormat`-ı "use client" komponentlərdə İKİ dəfə (server render + client hidrasiya) işə düşən bir dəyər üçün işlədərkən, yalnız "en-US" kimi ECMA-402-nin zəmanət etdiyi locale-lərə etibar etmək lazımdır — "az-AZ" kimi az-adopted locale-lər mühitdən-mühitə fərqli davrana bilər. Server-yalnız (Server Component) render-lərdə bu risk yoxdur, çünki HTML bir dəfə (yalnız Node-da) yaradılır və heç vaxt brauzerdə YENİDƏN hesablanmır.

### [2026-07-19 — Wave B] `.env.example` heç vaxt git-ə commit olunmamışdı
**Simptom:** Wave B-nin ilk commit-i hazırlanarkən `git add .env.example` "ignored by .gitignore" xəbərdarlığı verdi.
**Kök səbəb:** `.gitignore`-dakı `.env*` blanket pattern (Wave A-dan qalma) `.env.example`-i də (heç bir sirr saxlamayan, boş şablon fayl) tutur — halbuki `.env.example` adətən İSTƏNİLƏN developer/deploy üçün lazım olan, commit olunmalı standart bir fayldır. Nəticədə təzə bir clone-da heç bir `.env` şablonu olmurdu.
**Həll:** `.gitignore`-a `!.env.example` istisnası əlavə edildi (`.env*` qaydasının həqiqi məqsədi — sirr saxlayan real `.env`-i qorumaq — dəyişmədi).
**Fayl(lar):** `.gitignore`
