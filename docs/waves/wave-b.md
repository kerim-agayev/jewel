# Wave B — Storefront Çəkirdəyi

**Status:** Başlanmayıb (Wave A-nı gözləyir)

## Əhatə

- Ana səhifə, kateqoriya siyahısı (`/[locale]/[category]`), məhsul detalı (`/[locale]/[category]/[code]`)
- Qızıl hesablayıcı (`/[locale]/hesabla`) — canlı `gold-api.com` inteqrasiyası + Vercel Cron snapshot
- Haqqımızda/Ünvan səhifəsi (real mağaza məlumatları ilə — bax `CLAUDE.md` → "Gerçək veri referansı")
- Seed script (`prisma/seed.ts`): 264-300 sahte məhsul, real kateqoriya/əyar/qiymət-qram nisbətlərinə görə kalibrə edilmiş, `titleRu` AI tərcümə taslağı ilə
- Sanity-check: qiymət/qram nisbəti ağlabatan aralıqdan kənara çıxan seed qeydləri olmamalı

## Bitmə meyarı

- Bütün kateqoriyalar üzrə filtrlər işləyir (metal, əyar, status, qiymət aralığı, kateqoriyaya-xas atributlar)
- Qızıl hesablayıcı bugünkü real qiyməti göstərir
- Hər məhsul səhifəsində OG meta teqləri var (WhatsApp önizləməsi üçün)

## Bitəndə

`docs/phase_1/logs.md`-ə özət yaz, statusu yenilə, Wave C-yə keç.
