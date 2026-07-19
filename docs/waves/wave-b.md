# Wave B — Storefront Çəkirdəyi

**Status:** Bitib (2026-07-19)

## Əhatə

- Ana səhifə, kateqoriya siyahısı (`/[locale]/[category]`), məhsul detalı (`/[locale]/[category]/[code]`)
- Qızıl hesablayıcı (`/[locale]/hesabla`) — canlı `gold-api.com` inteqrasiyası + Vercel Cron snapshot
- Haqqımızda/Ünvan səhifəsi (real mağaza məlumatları ilə — bax `CLAUDE.md` → "Gerçək veri referansı")
- Seed script (`prisma/seed.ts`): 264-300 sahte məhsul, real kateqoriya/əyar/qiymət-qram nisbətlərinə görə kalibrə edilmiş, `titleRu` AI tərcümə taslağı ilə
- Sanity-check: qiymət/qram nisbəti ağlabatan aralıqdan kənara çıxan seed qeydləri olmamalı

## Bitmə meyarı

- [x] Bütün kateqoriyalar üzrə filtrlər işləyir (metal, əyar, status, qiymət aralığı, kateqoriyaya-xas atributlar) — brauzerdə yoxlanıldı, hər filtr qrupu üçün faktiki fərqli dəyərlər mövcuddur (o cümlədən status: 12 USED/282 NEW)
- [x] Qızıl hesablayıcı bugünkü real qiyməti göstərir — `gold-api.com`-dan canlı çəkilən qiymət (219.68 AZN/qram) düzgün hesablanır, doğrulandı
- [x] Hər məhsul səhifəsində OG meta teqləri var (WhatsApp önizləməsi üçün) — `generateMetadata()` og:title/og:description/og:image/twitter:* yaradır, brauzerdə təsdiqləndi

## Bitəndə

`docs/phase_1/logs.md`-ə özət yazıldı, status yeniləndi. Wave C-yə keçmək üçün istifadəçi təsdiqi gözlənilir.
