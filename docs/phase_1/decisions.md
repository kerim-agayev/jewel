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

### [2026-07-19 — Wave B planlaşdırması] Sahte seed kataloqu üçün şəkil mənbəyi: Pexels API

**Qərar:** Sahte 264-300 məhsullu seed kataloqunun şəkilləri **Pexels API**-dən gəlir (Unsplash yox), kateqoriyaya uyğun axtarış terminləri ilə ("gold ring", "gold necklace", "gold earrings", "gold bracelet", "gold pendant", saat kateqoriyası üçün "wristwatch", qızıl külçə/sikkə üçün "gold bar", broş üçün "brooch pin") sorğulanır, kateqoriya başına BİR DƏFƏ (məhsul başına yox) 15-25 şəkillik hovuz kimi endirilir və Cloudflare R2-yə mövcud `uploadToR2()` funksiyası ilə yüklənir — hovuzdan hər məhsula təsadüfi 1-4 şəkil təyin olunur.

**Niyə Pexels, Unsplash yox:** Unsplash-ın pulsuz API tier-i istehsal təsdiqi (manual review) alınana qədər saat başına 50 sorğu ilə məhdudlaşır, üstəlik API qaydaları hotlink + endirmə-izləmə tərəfinə meyillidir. Pexels API açarını dərhal (təsdiq gözləmədən) verir, saat başına 200 / ayda 20,000 sorğu tanıyır, lisenziyası isə endirmə, dəyişdirmə və (kommersiya daxil) yenidən istifadəni icbari mənbə göstərmədən aydın şəkildə icazə verir — R2-yə köçürüb yenidən host edəcəyimiz toplu bir seed işi üçün daha uyğun seçim.

**Niyə boş/generik placeholder YOX:** boz placeholder qutuları olan bir zərgərlik demosu bitməmiş görünərdi və CLAUDE.md-nin "Layihə xülasəsi" bölməsindəki "real, təsirli demo" məqsədini zəiflədərdi — sahte datanın real statistik nümunəyə kalibrə edilməsinin bütün mənası kataloqun REAL görünməsidir, hətta real olmasa belə.

**Niyə AI-generasiya (Krea/Photta və s.) seed addımı üçün YOX:** həmin iş axını bilərəkdən əl ilə, bir-bir, insan-nəzarətli işləyir — real "Modellərimiz" admin funksiyası üçün doğru yanaşmadır (Wave D, işçi real məhsulu seçir, real AI alətini bir dəfə işə salır), amma ~300 seed məhsulunu avtomatik doldurmaq üçün miqyaslanmır, üstəlik seed-üçün-atılacaq şəkilləri əsl admin iş axını ilə eyni boru xəttinə qarışdırmaq CLAUDE.md-nin diqqətlə ayrı saxladığı bir xüsusiyyəti bulanıqlaşdırardı (bax "Modellərimiz" bölməsi — "yalnız ilkin seed sahtədir, iş axınının özü yox").

**Necə tətbiq olunur:** seed skripti kateqoriya başına bir şəkil hovuzu çəkir (məhsul başına yox), real R2 URL-lərini `ProductImage.url`-da saxlayır, demo təsdiqləndikdən sonra real inventar fotoları gəldikdə bu şəkillər sərbəst şəkildə əvəz olunur.

### [2026-07-19 — Wave B] Cron cədvəli `vercel.json` ilə, `vercel.ts` yox
Planda ilkin fikir `vercel.ts` idi (Vercel-in yeni tövsiyə etdiyi TypeScript konfiqurasiyası), amma bu, `@vercel/config` paketinin əlavə asılılıq kimi qurulmasını tələb edir — layihə hələ deploy olunmadığı üçün (localhost-da qalır, bax "Demo/staging security") bu fayl bu Wave-də faktiki işə salınmır, sadəcə gələcək deploy üçün hazırlanır. Sadəlik Birinci prinsipinə görə eyni funksionallığı (tək bir cron path+cədvəl) verən, sıfır əlavə asılılıq tələb edən standart `vercel.json` seçildi. Funksional fərq yoxdur, yalnız fayl formatı.
**Fayl(lar):** `vercel.json`
