# Qərarlar Jurnalı

Kodlaşdırma zamanı verilən anlıq memarlıq qərarları, tarix + səbəb ilə. Planlaşdırma mərhələsində (Claude ilə söhbətdə) verilən böyük qərarlar aşağıda ilkin qeyd kimi var — bundan sonrakılar Claude Code tərəfindən əlavə olunur.

### [2026-07 — planlaşdırma] Sahte veri, gerçek istatistik örüntü
264 real Anar Jewellery məhsulunun (Thunderbit scrape) statistik paylanması (kateqoriya nisbətləri, əyar dağılımı, qiymət/qram kalibrasiyası) seed data üçün istifadə olunur, amma real foto/qiymətlər YOX — real fotoların 24k.az-la əlaqədar mülkiyyət/istifadə statusu hələ mağaza sahibi ilə təsdiqlənməyib.

### [2026-07 — planlaşdırma] Cloudflare R2, Cloudinary yox
Cloudinary-nin paylaşımlı 25 kredi/ay limiti (depolama+bandwidth+dönüşüm eyni hovuzda) canlı trafikdə sürətlə tükənə bilər. R2 sıfır bandwidth ücreti + 10GB ücretsiz limit veriyor, 300-1000 görsel üçün rahat yer var.

### [2026-07 — planlaşdırma] Xəzinə sıfırdan qurulur, fork edilmir
`nothing-to-watch` (gnovotny) layihəsindən ilhamlanan "Xəzinə" kəşif səhifəsi, lisenziya qeyri-müəyyənliyi səbəbindən fork edilmir — eyni konsept `d3-force` + mövcud Three.js/R3F ilə sıfırdan qurulur.

### [2026-07 — planlaşdırma] `pricingMode` ayrımı
Saatlar qızıl çəkisinə görə deyil, sabit qiymətlə satılır (marka/mexanizm dəyəri müəyyən edir) — bu ayrım olmadan saat qiyməti səhv formula ilə hesablanardı.

### [2026-07 — planlaşdırma] Wave E qapılıdır
Sinematik hero, Xəzinə, Lighthouse/SEO cilası və GA4 — hamısı Wave D bitəndə istifadəçi təsdiqi gözləyir, avtomatik başlanmır.

### [2026-07 — planlaşdırma] Hero obje koddan yaradılır, xarici model axtarılmır
Sketchfab/Meshy/Sloyd kimi mənbələr araşdırıldı, amma qərar: `TorusGeometry` + PBR qızıl material koddan yetərlidir — lisenziya sualı, fayl endirmə, ölçü qayğısı tamamilə aradan qalxır.

### [2026-07 — planlaşdırma] Awwwards/GSAP showcase analizi — 2 fikir qəbul, 3 fikir rədd
İncələnən nümunələr: Cartier Watches & Wonders (Immersive Garden), Hubtown (Unseen Studio), Lacoste mini-oyun, Shopify Editions.
- **Qəbul edildi:** Lenis (smooth-scroll, GSAP-ın yanında) və cursor-reaktiv işıqlandırma (Hubtown-dan ilhamla, mövcud tək obyektin üzərinə).
- **Rədd edildi:** çoxlu-otaq 3D struktur (Cartier tərzi — həcm çox böyüyür), Web Audio qatı (əlçatanlıq/autoplay riski), WebGPU render mühərriki + fallback (bu səhnə üçün artıq mühəndislik).

### [2026-07 — planlaşdırma] Qiymət override + Avtomatik/Əl ilə rejim
İstifadəçi sualı: "bazar 500 desə də mağaza sahibi 550 istəyə bilər, ya da qiymətin nə vaxt tətbiq olunacağını özü seçmək istəyə bilər". Həll: `Product.priceOverride` (formulanı tamamilə keçir, yalnız WEIGHT_BASED-də mənalıdır) + `Store.priceUpdateMode` (AUTOMATIC/MANUAL) + `Store.appliedGoldPriceSnapshotId` (MANUAL-da admin "Tətbiq et" deyənə qədər saytdakı qiymət dəyişmir). Bütün ekranlar (storefront, Xəzinə, admin Panel, Hesabatlar) tək bir `resolveProductPrice()` funksiyasından keçməlidir ki, override bir yerdə görünüb başqa yerdə görünməsin kimi bir tutarsızlıq yaranmasın.

### [2026-07 — planlaşdırma] 22 maddəlik son analiz — bir sıra düzəliş və genişləndirmə
- "Modeldə" → **"Modellərimiz"** olaraq yenidən adlandırıldı (route `/lookbook` sabit qalır, yalnız etiket dəyişdi).
- Header-dəki profil ikonu **admin girişidir**, müştəri hesabı DEYİL — sayt heç bir müştəri login/qeydiyyat sistemi tələb etmir. Favorilər ♥ ikonu `localStorage`-əsaslı, hesab tələb etmir.
- Axtarış sistemi dəqiqləşdirildi: Postgres `unaccent` (ş/ç/ö/ğ/ü/ı → s/c/o/g/u/i) + `pg_trgm` (yazım xətalarına tolerantlıq).
- Məhsul başına maksimum 4 şəkil, qalereya responsive (şəkil sayına görə uyğunlaşır).
- Məhsul səhifəsindəki "köhnə qızılınızla dəyişin" CTA-sı çıxarıldı (barter data-sı qalır, yalnız aktiv düymə silindi).
- `/hesabla` yalnız xam qızıl dəyərini göstərir (işçilik/marj YOX) — izahat mətni ilə.
- Admin İA-nın 7 bölməsi (Panel/Məhsullar/Satışlar/Müştərilər/Hesabatlar/Parametrlər/Modellərimiz) üçün tam sahə/xüsusiyyət siyahısı yazıldı, o cümlədən əvvəllər dizaynda olmayan "Yeni məhsul əlavə et" formu və "Yeni satış qeydi əlavə et" modalı (ayrıca Stitch promptları yazıldı).

### [2026-07 — planlaşdırma] Vercel Password Protection tamamilə çıxarıldı
İstifadəçi iş axınını dəqiqləşdirdi: layihə tamamlanana qədər həmişə localhost-da işləyir, mağaza sahibinə lokal göstərilir, YALNIZ təsdiq + real data girildikdən sonra Vercel-ə deploy olunur. Deməli "deploy olunub amma hələ ictimai olmamalı" mərhələsi heç mövcud deyil — Password Protection-a (nə Vercel-in düyməsinə, nə bizim middleware alternativimizə) ehtiyac yoxdur. Yeganə saxlanılan tədbir: `noindex`/`robots.txt`, ilk deploy-dan sonrakı qısa "son yoxlama" pəncərəsi üçün pulsuz sığorta olaraq.

### [2026-07 — planlaşdırma] Qiymət sisteminə 4 dəqiqləşdirmə
İstifadəçi sualları admin iş axınında gizli qalmış detalları üzə çıxardı:
- Admin Məhsullar tabından istənilən məhsulun qiymətini iki yolla dəyişə bilər: formula girişlərini tənzimləyərək (Avtomatik rejimdə qalır, qızıl qiymətini izləməyə davam edir) ya da `priceOverride` yazaraq (o məhsulu dondurur). **Heç biri cron-a təsir etmir** — cron mağaza-səviyyəli qızıl qiymətini hər gün çəkməyə davam edir, override-lı məhsullar sadəcə onu "eşitmir".
- Parametrlər-dəki qlobal "Mağaza marjası" məhsul-səviyyəli `marginPercent`-in ÜSTÜNƏ ikinci dəfə tətbiq olunan ayrı bir vurma DEYİL (bu, marjanı ikiqat tətbiq edərdi) — yalnız yeni məhsul yaradılanda "Marja (%)" sahəsinin defolt dəyəridir.
- **Kritik təhlükəsizlik qaydası əlavə edildi:** `WEIGHT_BASED` + qeyri-qızıl `metalType` (SILVER/PLATINUM) kombinasiyası Zod tərəfindən rədd edilməlidir — əks halda gümüş məhsul qızıl qiymətiylə hesablanıb real dəyərinin qat-qat üzərində göstərilə bilərdi. MVP-də canlı gümüş/platin qiymət API-si yoxdur (bilərəkdən, Sadəlik Birinci).
- Cron fetch uğursuz olsa: sistem çökməməli, son uğurlu snapshot istifadə olunmağa davam etməlidir, sadəcə həmin günün yenilənməsi gecikir.

### [2026-07 — planlaşdırma] Yuvarlama əlavə edildi, override-in mənası daraldıldı
İstifadəçi düzgün bir risk gördü: canlı formula çirkin onluq ədədlər verir (700.18 AZN kimi), admin bunu "gözəlləşdirmək" üçün `priceOverride`-a əl atmağa meyilli olardı — amma bu, məhsulu bazardan tam qopararaq əbədi dondurardı. Həll: `WEIGHT_BASED` nəticəsi `resolveProductPrice()`-in son addımında ən yaxın tam AZN-ə yuvarlanır (`Math.round`), beləliklə həm rəqəm təmiz görünür həm qiymət hər gün bazarla hərəkət etməyə davam edir. `priceOverride`/`fixedPrice` yuvarlanmır (admin nə yazıbsa o istifadə olunur). Bunun nəticəsində `priceOverride`-in əsl məqsədi daraldı: kosmetik səbəb üçün YOX, məhsulun bazardan HƏQİQƏTƏN qopması lazım olan nadir hallar üçün (məs. razılaşdırılmış sabit qiymətli ikinci əl parça).

### [2026-07-19 — Wave A] `docs/` qovluğu `docs/phase_1/` altına köçürüldü
`CLAUDE.md` `docs/phase_1/{index,architecture,decisions,bugs,logs}.md` strukturunu təsvir edir, amma faktiki fayllar `docs/` altında düz (flat) yaradılmışdı (planlaşdırma sessiyasından qalma). Wave A başlamazdan əvvəl 5 fayl məzmunu toxunulmadan `docs/phase_1/`-ə köçürüldü ki, spesifikasiya ilə faktiki struktur uyğunlaşsın. `docs/waves/` yeri dəyişmədi. Nisbi linklər (`./architecture.md` və s.) yeni yerdə də düzgün işləyir, əlavə düzəliş tələb olunmadı.

### [2026-07-19 — Wave A] Admin marşrutlaşdırmasının lokal (locale) prefiksi sualı Wave C-yə saxlanıldı
`CLAUDE.md`-də ziddiyyət var: qovluq diaqramı `/admin`-i `/[locale]`-dən kənarda (bacı qovluq) göstərir, amma "Dil dəstəyi" bölməsi next-intl mexanizminin `/admin` marşrutlarına da genişləndirildiyini deyir. Wave A-da heç bir `/admin` route hələ qurulmadığı üçün bu sual bloklayıcı deyil — `middleware.ts` yalnız `/[locale]` üçün lokal aşkarlama/yönləndirmə edir. Wave C admin səhifələri qurulmazdan əvvəl qərar verilməlidir: `/admin` URL-də lokal prefiksi olacaq, yoxsa yalnız cookie-əsaslı lokal seçimi?
