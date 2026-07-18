# Wave E — Son (QAPILI)

**Status:** Gözləyir — istifadəçi təsdiqi lazımdır, Wave D bitmədən və təsdiq alınmadan BAŞLANMIR.

## Əhatə (yalnız təsdiqdən sonra)

- Sinematik 3D hero (Three.js + R3F + GSAP ScrollTrigger), mobil fallback video
- "Xəzinə" kəşif səhifəsi (d3-force + Three.js), yalnız masaüstü
- Cihaz/tərcih yoxlaması: WebGL2 dəstəyi + `prefers-reduced-motion` — uyğun deyilsə statik fallback
- Kapsamlı Lighthouse auditi (hədəf: mobil daxil 90+) və tapılan bütün performans problemlərinin düzəldilməsi
- SEO son cilası: `sitemap.ts`, `robots.ts`, bütün OG görsellərinin yoxlanması
- Google Analytics 4 quraşdırılması + çərəz razılıq banneri + hadisə izləmə
- Demo qoruması aktivləşdirilməsi (noindex, Vercel Password Protection)

## Bitmə meyarı

- Lighthouse Performance 90+ (mobil), LCP < 2.5sn
- GA4 hadisələri Realtime-da görünür
- Demo şifrə arxasındadır, Google indeksləmir

## Bitəndə

`docs/phase_1/logs.md`-ə yekun özət — bu, Phase 1-in sonu deməkdir. `docs/phase_1/index.md`-i "Phase 1 tamamlandı" olaraq yenilə.
