# İş Günlüyü

Hər sessiya sonunda qısa özət. Format: tarix, hansı dalğa, nə edildi, nə qaldı.

### [2026-07] Planlaşdırma sessiyası (kodlaşdırma öncəsi)
Claude ilə birlikdə: rəqib analiz (24k.az), texnologiya seçimi (Next.js 15 + Prisma + Neon), admin İA (6 tab), i18n (AZ+RU, admin daxil), Xəzinə/sinematik hero konsepsiyaları, 264 real məhsulun Thunderbit analizi, R2 qərarı, Wave A-E planı və `docs/` protokolu quruldu. Kodlaşdırma hələ başlamayıb — bu, Wave A-nın ilk günlük qeydi olacaq.

**Növbəti addım:** Wave A — Next.js quraşdırma.

### [2026-07-19] Wave A — Təməl (bitib)
`docs/` faylları `docs/phase_1/`-ə köçürüldü (spesifikasiya ilə uyğunlaşdırma). 11 `claude-code-templates` skill-i quraşdırıldı. Next.js layihəsi quraşdırıldı — **Next.js 16** (istifadəçi ilə təsdiqləndi, "15" spesifikasiyası köhnəlmişdi), React 19.2, Tailwind v4, `middleware.ts` əvəzinə yeni `proxy.ts` konvensiyası. Prisma 7 sxemi (`CLAUDE.md`-dəki tam data modeli) yazıldı və Neon-a qarşı ilk migrasiya uğurla işlədildi (10 cədvəl) — yol boyu Prisma 7-nin `prisma.config.ts`-ə keçmiş datasource modelini və bir dəfəlik `shadowDatabaseUrl` qarışıqlığını (bax `bugs.md`) həll etmək lazım gəldi, heç bir data itkisi olmadı. `next-intl` skeleti (routing, proxy, `[locale]` layout, boş `messages/az.json`+`ru.json`) quraşdırıldı, `/az` və `/ru` boş layout ilə açılır. Dizayn tokenləri (rənglər, tipoqrafiya, spacing) Stitch-in əsl `code.html` ixraclarından (təkcə `DESIGN.md`-dən yox) Tailwind v4-ün CSS-first `@theme` sintaksisinə köçürüldü — yolda `DESIGN.md`/əsl kod arasında bir `borderRadius` uyğunsuzluğu tapıldı və düzəldildi. Cloudflare R2 qoşuldu (`@aws-sdk/client-s3`, `/lib/r2.ts`), test şəkli yükləndi və `next/image` ilə göstərilməsi təsdiqləndi. `/ponytail-review` 3 həddindən artıq mürəkkəblik tapıntısı (istifadəçisiz `i18n/navigation.ts`, boş `messages` admin açarı, artıq mühafizəli `next.config.ts` şərti) tapdı, hamısı düzəldildi. Bütün bitmə meyarları (migrate dev xətasız, `/az`+`/ru` işləyir, R2 test şəkli göstərilir) təsdiqləndi.

**Qaldı:** Wave B başlamazdan əvvəl istifadəçi təsdiqi lazımdır.
