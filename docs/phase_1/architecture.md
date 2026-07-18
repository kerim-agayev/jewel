# Memarlıq — Genişləndirilmiş Qeydlər

Bu fayl `CLAUDE.md`-nin təkrarı deyil — orada YAZILMAYAN, kod yazılarkən üzə çıxan real tətbiq detallarını tutur (məs. "Prisma-nın JSON GIN indeksi filan versiyada belə aktivləşdi", "R2 bucket-in public URL-i belə qurdum" kimi konkret qeydlər).

## Başlanğıc vəziyyəti

Layihə hələ başlamayıb. `CLAUDE.md` ilkin memarlıq spesifikasiyasıdır — bu fayl ora əlavə/dəqiqləşdirmə üçündür, ora ziddiyyət üçün deyil.

## Format

Hər qeyd üçün:

```
### [Tarix] Başlıq
Nə qurulduğu, niyə CLAUDE.md-dəki plandan fərqli/əlavə bir seçim edildisə səbəbi.
```

### [2026-07-19 — Wave A] Next.js 16 (15 yox) + Tailwind v4
`CLAUDE.md` "Next.js 15" deyir, amma layihə başlayanda `create-next-app@latest` artıq Next.js 16.2.10-u quraşdırdı (React 19.2, Tailwind v4 ilə birgə). İstifadəçiyə soruşuldu, **Next.js 16 (ən son)** seçildi. Nəticələr:
- **`middleware.ts` → `proxy.ts`:** Next 16-da middleware konvensiyası deprecated olub, `proxy.ts` (funksiya adı `proxy`) ilə əvəz olunub (edge runtime dəstəklənmir, proxy həmişə nodejs runtime-da işləyir). next-intl 4.13.2 Next `^16.0.0`-ı rəsmi dəstəkləyir, `createMiddleware()` sadəcə `proxy.ts`-dən default export edilir.
- **Tailwind v4 CSS-first konfiqurasiya:** `tailwind.config.ts` deyil, dizayn tokenləri `app/globals.css`-də `@theme` direktivi ilə təyin olunur (quraşdırılmış `tailwind-patterns` skill-i də bunu tövsiyə edir). `postcss.config.mjs`-də `@tailwindcss/postcss` plagini var.
- Paket adı `package.json`-da `next-scaffold`-dan `anar-jewellery`-ə düzəldildi (scaffold-un müvəqqəti qovluq adından qalma).

### [2026-07-19 — Wave A] Prisma 7 — datasource konfiqurasiyası `schema.prisma`-dan `prisma.config.ts`-ə köçüb
`npm install prisma` ən son versiyanı (7.8.0) çəkdi — `CLAUDE.md`-nin yazıldığı zamankı Prisma versiyasından fərqli, mühüm memarlıq dəyişikliyi var: **`datasource` blokunda artıq `url`/`directUrl` dəstəklənmir** (`prisma validate` bunu aşkar xəta ilə rədd edir, `docs/config-datasource` səhifəsinə yönləndirir). Yeni model: bağlantı URL-ləri `prisma.config.ts`-də konfiqurasiya olunur:
```ts
datasource: {
  url: process.env["DATABASE_URL"],           // pooled — tətbiq sorğuları
  shadowDatabaseUrl: process.env["DIRECT_URL"] // direct — migrate/shadow db
}
```
`CLAUDE.md`-nin "DATABASE_URL pooled / DIRECT_URL direct, migrasiyalar üçün" bölüşdürməsi konseptual olaraq dəyişmədi, sadəcə `directUrl` sahəsinin adı `shadowDatabaseUrl`-ə çevrilib və yeri `schema.prisma`-dan `prisma.config.ts`-ə keçib. Driver adapter (`@prisma/adapter-neon`) yalnız runtime `PrismaClient`-də (`/lib/prisma.ts`) konfiqurasiya olunur — migrasiyalar üçün ayrıca adapter tənzimləməsi lazım deyil (schema engine birbaşa Postgres protokolu ilə işləyir).

Generator da dəyişib: `provider = "prisma-client"` (köhnə `prisma-client-js` deyil) — çıxış `app/generated/prisma`-ya yazılır, generasiya olunan fayl `.gitignore`-a əlavə olundu.

### [2026-07-19 — Wave A] Dizayn tokenləri: `DESIGN.md` ilə əsl `code.html`-lər arasında `borderRadius` uyğunsuzluğu tapıldı
`design/.../anar_aura/DESIGN.md`-in "rounded" bölməsi `sm:0.25rem, DEFAULT:0.5rem, md:0.75rem, lg:1rem, xl:1.5rem` deyir, amma bütün 20 real Stitch `code.html` ixracının tailwind.config-ində faktiki dəyər fərqlidir: `{DEFAULT:0.25rem, lg:0.5rem, xl:0.75rem, full:9999px}` (bütün fayllarda eyni, `grep` ilə yoxlanıldı). `CLAUDE.md`-nin "actually-confirmed visual result, mətn promptlarını yenidən yozma yox" qaydasına görə **əsl `code.html` dəyərləri** istifadə edildi, `DESIGN.md`-in bu bir bəndi diqqətə alınmadı (rəng/spacing/fontFamily/fontSize tam uyğun idi, yalnız bu bənd fərqli idi).

**Əlavə tapıntı:** Stitch-in istifadə etdiyi `cdn.tailwindcss.com` skripti Tailwind v3-dür (JS `tailwind.config` formatı), amma layihə Tailwind v4 üzərindədir. v4 boş (suffiks-siz) `rounded` sinifini tamamilə silib (miqyas `rounded-xs`-dən başlayır). Xoşbəxtlikdən Stitch-in `lg` (0.5rem)/`xl` (0.75rem)/`full` dəyərləri v4-ün öz default `--radius-lg`/`--radius-xl`/`--radius-full` dəyərləri ilə eynidir — buna görə `@theme`-də ayrıca radius override YAZILMADI (YAGNI, defolt artıq düzgündür). Gələcək dalğalarda Stitch-in `rounded` (bare) markup-ını köçürərkən v4-də `rounded-sm` (0.25rem) istifadə edilməlidir, çünki bare `rounded` artıq mövcud deyil.

### [2026-07-19 — Wave A] Cloudflare R2 — `@aws-sdk/client-s3`, `/lib/r2.ts`, test yükləmə ilə doğrulandı
`R2_ACCOUNT_ID`-dən qurulan S3-uyğun endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, `region: "auto"`. `/lib/r2.ts`-də tək bir `uploadToR2(key, body, contentType)` funksiyası var (digər Prisma sorğularının `/lib`-də cəmlənməsi qaydasına paralel olaraq). `next.config.ts`-də `images.remotePatterns` `R2_PUBLIC_URL`-dən dinamik çıxarılır (host hardcode edilmədi, `.env` dəyişsə konfiqurasiya avtomatik izləyir).

Doğrulama: `public/next.svg` müvəqqəti skriptlə bucket-ə yükləndi (`wave-a-test/next-logo.svg`), `curl` ilə birbaşa R2 URL-i 200 qaytardı, sonra `/[locale]/page.tsx`-ə müvəqqəti `next/image` ilə render edilib brauzerdə/HTML-də təsdiqləndi, sonra "boş layout" son vəziyyətini qorumaq üçün geri çıxarıldı. Müvəqqəti yükləmə skripti (`__test-r2-upload.mjs`) repo-ya əlavə olunmadı, yalnız bir dəfəlik doğrulama üçün istifadə edildi və silindi — real yükləmə axını Wave C/D-də admin panelindən qurulacaq.

**Qeyd (təhlükəsiz, əməliyyat üçün əhəmiyyətsiz):** `dotenv` paketi (v17.4.2) `.env` yükləndikdə konsola təsadüfi "tip" mesajları çap edir (məs. `⌁ auth for agents [www.vestauth.com]`) — bu, paketin öz təbliğat funksiyasıdır (`node_modules/dotenv/lib/main.js`-də səkkiz mesajlıq sabit massiv), zərərli/inyeksiya deyil, sadəcə diqqətə çarpdığı üçün qeyd olunur.

### [2026-07-19 — Wave A] `create-next-app` uyğunsuz fayllarla işləmədi
`create-next-app` mövcud `CLAUDE.md`/`.env`/`design/` görüb boş olmayan qovluqda işləməkdən imtina etdi. Həll: scaffold müvəqqəti qovluqda yaradıldı, sonra `app/`, `public/`, `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`, `README.md` layihə kökünə köçürüldü — scaffold-un öz avtomatik yaratdığı stub `CLAUDE.md`/`AGENTS.md` faylları BİLƏRƏKDƏN köçürülmədi (əsl 62KB `CLAUDE.md`-ni əzməməsi üçün).
