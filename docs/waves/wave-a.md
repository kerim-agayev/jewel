# Wave A — Təməl

**Status:** Bitib (2026-07-19)

## Əhatə

- `design/` qovluğunun icmalı — Stitch'dən gələn görselləri oxu, rəng/spacing/tipoqrafiyanı çıxar (bax `CLAUDE.md` → "Dizayn referansı")
- `claude-code-templates` skill-lərinin quraşdırılması (bax `CLAUDE.md` → "Claude Code Skills")
- Next.js 15 layihəsinin qurulması (App Router, TypeScript strict)
- Prisma şeması (`CLAUDE.md` → "Veri modeli") + Neon Postgres bağlantısı (pooled + direct)
- `next-intl` skeleti — `/[locale]` route strukturu, `messages/az.json` + `messages/ru.json` boş şablonlar, admin daxil
- Stitch-dən gələn dizayn tokenlərinin (rənglər, tipoqrafiya) Tailwind konfiqurasiyasına köçürülməsi
- `.env.example`-dəki bütün dəyişənlərin real `.env`-ə köçürülməsi (Neon, gold-api, R2, NextAuth)
- Cloudflare R2 bucket qurulması + `next.config.js`-də remote pattern

## Bitmə meyarı

- `npx prisma migrate dev` xətasız işləyir
- `/az` və `/ru` boş layout-la açılır, dil dəyişdirici URL-i düzgün dəyişir
- R2-yə test şəkli yüklənib storefront-da göstərilə bilir

## Bitəndə

`docs/phase_1/logs.md`-ə özət yaz, `docs/phase_1/index.md`-də statusu "Tamamlandı" et, Wave B-yə keç.
