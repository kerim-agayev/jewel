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
