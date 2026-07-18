# Anar Jewellery — Google Stitch Tasarım Promptları

Promptlar İngilizce yazıldı çünkü Stitch İngilizce promptlarda daha tutarlı ve profesyonel sonuç üretiyor; arayüz metinlerinin Azerbaycan dilinde çıkması için bunu promptun içine özellikle yazdım. Stitch tek üretimde birbirine bağlı ~5 ekrana kadar tutarlı üretebiliyor, o yüzden promptlar gruplara ayrıldı — her biri ayrı bir Stitch generation'ı.

**Not:** Prompt 1 ve 2'yi daha önce Stitch'e verdiysen, aşağıdaki güncellenmiş halleriyle karşılaştır — navigasyon ve admin yapısı bu sürümde değişti (Modellərimiz + Ünvan + dil değiştirici nav'a eklendi, admin 6 gerçek sekmeye göre yeniden düzenlendi). Değişen kısımları Stitch'e "update the navigation to include..." gibi kısa bir takip promptuyla da ekleyebilirsin, sıfırdan üretmen şart değil.

---

## Marka yönü (fikir — her promptun başında zaten var)

> Anar Jewellery is a fine gold jewelry retailer in Baku, Azerbaijan, selling rings, necklaces, earrings, bracelets, sets, and gold coins/bars. The brand feels warm, trustworthy, and quietly luxurious — not flashy. Use a refined palette: warm ivory/cream background, deep charcoal near-black text, and a muted antique-gold accent used sparingly for CTAs and highlights. Elegant serif for headings, clean sans-serif for body and UI text. Generous white space, large high-quality product photography, minimal clutter. UI copy in Azerbaijani (Latin script).

---

## PROMPT 1 — Storefront (Web + Mobile Web, 5 ekran)

```
Design a responsive e-commerce website for "Anar Jewellery", a fine gold jewelry store in Baku, Azerbaijan. Generate both desktop web and mobile web versions.

Brand direction: warm, trustworthy, quietly luxurious — not flashy. Warm ivory/cream backgrounds, deep charcoal near-black text, muted antique-gold accent color used sparingly for CTAs and highlights. Elegant serif for headings, clean sans-serif for body and UI text. Generous white space, large high-quality product photography, minimal clutter. All UI copy in Azerbaijani (Latin script).

Every screen shares a persistent header: logo on the left, top navigation with 6 items on desktop (Ana səhifə, Kateqoriyalar as a dropdown, Modellərimiz, Hesabla, Haqqımızda, Ünvan), plus a small language toggle (AZ / RU) and a search icon on the far right.

Generate these 5 connected screens:

1. Homepage: hero section with a large jewelry photograph and headline, a live "today's gold price per gram" ticker bar near the top showing an AZN price with a "son yenilənmə: bugün" label, category tiles (Üzüklər, Boyunbağılar, Sırğalar, Qolbaqlar, Dəstlər, Saatlar, Qızıl külçə/sikkə), a secondary "Xəzinəni kəşf et" button/banner (desktop only, leads to an experimental discovery page — style it as a special, slightly darker/richer callout distinct from the rest of the ivory homepage, like an invitation to something different), a "Yeni gələnlər" product grid (6-8 products with photo, name, weight in grams, purity/ayar badge, price in AZN), a trust badges row (pulsuz çatdırılma, köhnə qızılla dəyişdirmə, orijinallıq zəmanəti), sticky WhatsApp contact button bottom-right.

2. Category/listing page: left sidebar filters — a base set that always appears (Metal növü, Əyar, Qiymət aralığı, Vəziyyət: Yeni/İşlənmiş) plus a "category-specific" filter block that changes per category (e.g. for rings: Üzük ölçüsü; for watches: Marka, Mexanizm növü). Collapses into a bottom filter drawer on mobile. Product grid with the same card style as the homepage. Sort dropdown (qiymətə görə, populyarlığa görə).

3. Product detail page: large image gallery with a thumbnail strip and zoom. Product title, a transparent price breakdown card showing "Qızıl dəyəri + İşçilik haqqı + Daş = Yekun qiymət" (for weight-based products) OR a simple price display with no breakdown (for fixed-price products like watches). Specs table (kateqoriya, əyar, çəki, daş, vəziyyət, kod), a prominent "WhatsApp-dan sorğu göndər" button, related products carousel at the bottom.

4. Live gold price calculator page: a clean calculator card where the user selects purity (əyar), enters weight in grams, and sees the live spot price plus the calculated raw gold value (weight × purity only — no labor/margin added), with a small disclaimer line below it ("Bu, qızılın öz dəyəridir — hazır məhsulun qiyməti işçilik və dizayn xərcinə görə fərqli ola bilər") and a small 30-day price trend line chart above the calculator.

5. About/Address page ("Haqqımızda"): store story section at the top, then a clearly separated "Ünvan" section further down the same page (physical address with an embedded map area, working hours, WhatsApp and phone click-to-call buttons, Instagram feed preview grid) — the "Ünvan" nav link should visually correspond to jumping straight to this second section.

Use rounded product cards with soft shadows, warm ivory background throughout. Mobile version should have a bottom tab bar with 5 items (Ana səhifə, Kateqoriyalar, Modellərimiz, Hesabla, Əlaqə) and a simple top nav (no hamburger needed) on mobile.
```

---

## PROMPT 2 — Admin Core (Masaüstü öncelikli, 5 ekran)

```
Design a desktop-first admin dashboard for "Anar Jewellery" store staff to manage products and track sales. This is an internal tool, not customer-facing — clean, data-dense, functional aesthetic (think Linear or Notion, not a luxury storefront). Neutral light theme: white/very light gray surfaces, one accent color (a muted antique-gold, used sparingly for primary buttons and active states), clear data tables, card-based KPI summaries. All UI copy in Azerbaijani, with a small language toggle (AZ / RU) and a light/dark mode toggle in the top-right corner of every screen.

Left sidebar navigation with 6 items: Panel (active), Məhsullar, Satışlar, Müştərilər (this one shown slightly greyed out with a small "Tezliklə" badge next to it, not clickable), Hesabatlar, Parametrlər.

Generate these 5 connected screens:

1. Login screen: simple centered card, store logo, email/username + password fields, "Yadda saxla" checkbox — minimal, no marketing content.

2. Panel (dashboard overview): top row of 4 KPI cards (Bugünkü satış, Bu həftə, Bu ay, Anbar dəyəri), a sales trend line chart for the last 30 days, an "ən çox satan kateqoriyalar" bar chart, and a "son satışlar" activity table at the bottom (product, satıcı, məbləğ, tarix).

3. Məhsullar (product management): data table with columns (şəkil, kod, ad, kateqoriya, əyar, çəki, qiymət, status), a rich filter bar above it (kateqoriya, metal növü, əyar, status, qiymət aralığı — shown as dropdown chips), a search bar, a "Yeni məhsul əlavə et" primary button top right, row actions (redaktə et, sil), pagination. Include a secondary tab strip near the top of this screen with two tabs: "Bütün məhsullar" (active) and "Modellərimiz" (for managing AI style-shot photos).

4. Satışlar (sales): a tab strip with two tabs — "Satış qeydləri" (active, a table of individual recorded sales with date/product/staff/amount/barter columns and the same rich filter bar pattern as Məhsullar) and "Satıcı performansı" (a leaderboard ranking staff by revenue, with a Günlük/Həftəlik/Aylıq toggle, each row showing name, sold count, total revenue, average sale size, and a small sparkline).

5. Parametrlər (settings): a left-hand sub-navigation within the page (Qızıl qiyməti, Mağaza məlumatları, İşçilər, Dil) with the "Qızıl qiyməti" sub-section active by default — showing the current live gold price, a manual margin/markup input field, a price history line chart, and a timestamp of the last fetch.
```

---

## PROMPT 3 — "Modellərimiz" Lookbook Səhifəsi (storefront, route: /lookbook, 1 ekran)

Bu səhifədəki fotoğraflar generic/stok görsel deyil — real mağaza məhsullarının AI vasitəsilə model üzərində göstərilmiş halları (admin panel üzərindən yüklənib məhsula bağlanır, bax Prompt 2'nin 3-cü ekranındakı "Modellərimiz" alt-tabı). Səhifə əsas naviqasiyada **"Modellərimiz"** adıyla görünür, texniki route isə `/lookbook`.

```
Design an editorial jewelry lookbook page for "Anar Jewellery", accessible from the main navigation as "Modellərimiz". This page shows AI-generated photography of the store's actual products worn on models (rings on hands, necklaces on necks, earrings, bracelets) — real inventory, not stock photography. Same brand direction as before: warm ivory background, deep charcoal text, muted antique-gold accents, elegant serif headings. Include the same persistent header/navigation as the rest of the site, with "Modellərimiz" shown as the active nav item.

Layout: a masonry/editorial grid of large lifestyle photography (models with soft, natural lighting wearing gold jewelry), 2 columns on mobile, 3-4 on desktop. Each photo shows a subtle overlay on hover/tap with 2-3 small circular "shop this look" product thumbnails — each thumbnail links to the real product detail page for that exact piece. Category filter chips at top (Üzüklər, Boyunbağılar, Sırğalar, Qolbaqlar). Page header "Modellərimiz" with a short explanatory line ("Məhsullarımızın süni intellektlə hazırlanmış görüntüləri"). Include a small, unobtrusive corner badge on each image reading "Süni intellektlə hazırlanmış görüntü" for transparency.
```

---

## PROMPT 4 — Sinematik 3D Hero (storyboard, 3 duruş anı)

Stitch hareketli 3D üretemiyor — bu prompt yalnızca hero bölümünün 3 "duruş anı"nı (keyframe) statik olarak tasarlıyor. Gerçek scroll/kamera animasyonunu Claude Code, Three.js + GSAP + Lenis ile ayrıca kodlayacak; obje Sketchfab/AI'dan değil, doğrudan bir Torus (halka) geometrisinden koddan üretiliyor — bu yüzden prompt da net şekilde "a simple gold ring/torus" diyor, belirsiz bir "ribbon" değil.

```
Design 3 static keyframes of a cinematic homepage hero moment for "Anar Jewellery", a fine gold jewelry brand. Full-bleed, dark, dramatic mood — very different from the warm ivory storefront elsewhere on the site, intentionally so (this is a brief cinematic opening before the normal homepage appears). The centerpiece object throughout is a single simple gold ring (a torus shape, smooth polished band, no gemstone) — not an abstract shape, a clean minimalist ring.

Keyframe 1 — "Enter": almost entirely black background, the gold ring small and centered, softly lit, no text yet, a subtle downward scroll indicator at the bottom.

Keyframe 2 — "Reveal + cursor glow": the same ring now large and close, dramatically spotlit against the dark background. Show a subtle highlight/hotspot of brighter light on the part of the ring's surface nearest an implied cursor position (slightly off-center), as if the light source follows the viewer's mouse — the rest of the ring stays in richer shadow by contrast. A serif headline fades in from the left ("Hər detalda ustalıq").

Keyframe 3 — "Transition": the ring has moved to the right side of the frame and shrunk slightly, a "Kolleksiyaya bax" button and short subtext appear on the left, the background has started transitioning from black to the site's warm ivory tone at the top edge, signaling the handoff into the normal homepage below.

Keep typography and gold tone consistent with the rest of the brand (elegant serif headings, muted antique-gold), even though the background and mood in this section are darker and more theatrical than the rest of the site.
```

---

## PROMPT 5 — Hesabatlar / Reports Ekranı (admin, 1 ekran)

Bu ekran ayrı tutuldu çünki "Məhsullar, Satışlar ve Hesabatlar hepsi en kapsamlı ve rahat filtrelenebilir formda olmalı" isteğine göre en çok dikkat gereken güç-kullanıcı ekranı budur.

```
Design a comprehensive reports screen for the "Anar Jewellery" admin dashboard — same neutral, data-dense admin style as before (light theme, muted antique-gold accent, left sidebar with 6 items: Panel, Məhsullar, Satışlar, Müştərilər (greyed out, "Tezliklə" badge), Hesabatlar (active), Parametrlər).

Layout, top to bottom:
1. A report type selector as horizontal tabs: Satış hesabatı, Kateqoriya üzrə satış, Satıcı performansı, Anbar dəyəri.
2. A filter bar below it: a date range picker with quick presets (Bugün, Bu həftə, Bu ay, Bu rüb, Xüsusi aralıq), plus dropdown filters for Kateqoriya, Metal növü, Status (Yeni/İşlənmiş), Satıcı — all filters collapse into a single "Filtrlər" button on smaller screens.
3. A large chart area: a line chart for trends over the selected date range when "Satış hesabatı" is active, switching to a bar chart for "Kateqoriya üzrə satış", and a horizontal leaderboard-style bar chart for "Satıcı performansı".
4. Below the chart, a detailed sortable data table with pagination, column headers matching the active report type.
5. Top-right corner: export buttons (CSV, Excel, PDF) and a "Hesabatı yadda saxla" button for quickly returning to a frequently-used filter combination later.

Keep it dense but organized — this is a power-user screen for the store owner reviewing business performance, not a marketing page.
```

---

## PROMPT 6 — "Xəzinə" Kəşif Səhifəsi (storyboard, 3 duruş anı)

Bu da Prompt 4 kimi — Stitch canlı force-simulation üretə bilmir, yalnızca 3 statik "duruş anı"nı tasarlıyoruz. Gerçek fizik/animasyonu Claude Code, d3-force + Three.js ile ayrıca kodlayacak. Yalnız masaüstü — bu səhifə mobilə heç göndərilmir.

```
Design 3 static keyframes of an experimental "treasure discovery" page for "Anar Jewellery", desktop only. This page is intentionally different from the rest of the warm ivory storefront — a darker, richer, more mysterious mood, like opening a treasure chest. Deep charcoal/near-black background throughout, warm gold light glinting off small circular/hexagonal product photo cells packed together in an organic, non-grid arrangement (voronoi/force-directed mosaic — dozens of small cells of varying size, each showing a cropped jewelry photo).

Keyframe 1 — "Overview": many small cells (roughly 40-60 visible at once) packed edge-to-edge across the whole screen, each a circular crop of a different jewelry product photo, softly lit, slightly varied in size. A thin category filter chip bar floats at the top (Hamısı, Üzüklər, Boyunbağılar, Sırğalar, Qolbaqlar, Saatlar) with "Hamısı" active. A small subtitle near the top reads "Kolleksiyanı kəşf et".

Keyframe 2 — "Focus": the same mosaic, but now the cursor has pushed nearby cells apart to make room, and one cell in the center has grown significantly larger and sharper than its neighbors, revealing the product name, weight, and price in a small label beneath it, while the surrounding cells remain smaller and slightly blurred/dimmed.

Keyframe 3 — "Filtered": the "Saatlar" filter chip is now active in the top bar, and the mosaic has reorganized to show far fewer cells (only watch photos), redistributed to fill the space in a new organic arrangement, with the deselected categories' cells having gently faded away.

Typography and the gold accent color should still feel connected to the rest of the brand, but this page can lean more dramatic and cinematic than anywhere else on the site except the homepage hero.
```

---

## PROMPT 7 — "Yeni Məhsul Əlavə Et" Modalı/Səhifəsi (admin, 1 ekran)

Stitch-in orijinal Məhsullar ekranında bu düymə var idi amma açılan formun içi tasarlanmamışdı — bu boşluğu dolduran prompt.

```
Design a "New Product" form for the "Anar Jewellery" admin panel — same neutral admin style as before (light theme, muted antique-gold accent). Can be a full-screen modal or a dedicated page, your choice, but should feel like a structured, scrollable form organized into clear sections with subheadings, not one long undifferentiated list.

Sections, top to bottom:
1. Basic info: Name (AZ), Name (RU), Category (dropdown), Gender (dropdown: Qadın/Kişi/Uşaq/Unisex), Status (New/Used toggle).
2. Pricing type: a prominent toggle "Avtomatik (qızıl çəkisinə görə)" / "Sabit qiymət". When "Avtomatik" is selected, show: Metal type (dropdown), Purity/əyar (dropdown showing common values like 750, 585), Weight in grams (number input), Labor cost (a toggle between % and fixed AZN amount), Stone type (optional text/dropdown), Stone cost (optional, AZN), Margin (%), and a collapsed/secondary "Əl ilə sabit qiymət təyin et" override field. When "Sabit qiymət" is selected instead, show just one field: Fixed price (AZN).
3. Category-specific attributes: a section that visually implies it changes based on the selected category (e.g. show "Üzük ölçüsü" fields as an example state).
4. Additional options: Barter uyğunluğu (toggle, on by default), Pulsuz çatdırılma (toggle, on by default).
5. Description: Description (AZ) and Description (RU) textareas.
6. Images: a drag-and-drop upload area showing up to 4 image slots, each with a small "Alt-mətn (AZ)" and "Alt-mətn (RU)" input beneath its thumbnail.
7. Bottom: "Ləğv et" and "Yadda saxla" buttons, sticky at the bottom of the scroll area.
```

---

## PROMPT 8 — "Yeni Satış Qeydi Əlavə Et" Modalı (admin, 1 ekran)

Satışlar tabında ümumi statistikalar (ciro, leaderboard) var idi amma bir satışı faktiki qeydə almaq üçün heç bir giriş nöqtəsi yox idi — bu boşluğu dolduran prompt.

```
Design a "New Sale Entry" modal for the "Anar Jewellery" admin panel's Sales tab — same neutral admin style, compact and fast to fill out since staff will use this many times a day at the counter.

Fields, top to bottom:
1. Product: a searchable dropdown/combobox (search by code or name), and once selected, show a small preview row below it with the product's thumbnail, name, and its current calculated price.
2. Sales rep: a simple dropdown of active staff names.
3. Final price: a number input pre-filled with the product's calculated price from step 1, but clearly editable (show a small "avtomatik hesablanan qiymətdən fərqlidir" hint if the staff changes it).
4. Barter toggle: "Bu satış köhnə qızılla dəyişdirmə ilə oldu" yes/no toggle.
5. Note: an optional short text field.
6. Date/time: defaults to "indi" (now) but editable via a date-time picker, for entering a past sale retroactively.
7. Bottom: "Ləğv et" and "Satışı qeydə al" (primary, gold-accent) buttons.

Keep the whole form short enough to fill in under 15 seconds for the common case (product + staff + confirm price).
```

---

## PROMPT 9 — "Yeni Satıcı Əlavə Et" Formu (admin, Parametrlər → İşçilər, 1 ekran)

Yeni Satış modalındakı satıcı dropdown-u haradan doldurulur sualına cavab — heç bir dizaynda bu forma yox idi.

```
Design a "Staff / Sales Reps" management screen for the "Anar Jewellery" admin panel, under Settings → Staff — same neutral admin style as before. Show a simple table at the top listing existing staff (name, role: Admin/Sales Rep, status: Active/Inactive, a small toggle to deactivate), with an "Yeni işçi əlavə et" primary button top-right.

Clicking that button opens a small, simple modal with just 3 fields: Name (text input), Role (dropdown: Admin / Satış təmsilçisi), Active (toggle, on by default) — and "Ləğv et" / "Yadda saxla" buttons at the bottom. Keep this modal minimal, it's an internal tool used rarely (adding a new employee), not a complex form.
```

---

## Kullanım notu

1. Önce Prompt 1'i (storefront) çalıştır, çıkan 5 ekranı incele, beğenmediğin yerleri Stitch'in "Annotate" özelliğiyle işaretleyip düzelt.
2. Sonra Prompt 2'ye (admin core) geç, ardından Prompt 5'i (Hesabatlar) ayrı bir generation olarak ekle.
3. Prompt 2'de bahsi geçen "Modellərimiz" ve "Satıcı performansı" alt-tabları için ayrı ekran istemedik — Stitch'in Məhsullar/Satışlar ekranlarında kurduğu görsel dili (tablo stili, filtre çubuğu, renk paleti) Claude Code kodda tutarlı şekilde genişletecek. Her alt-tab için ayrı ayrı Stitch ekranı istemek gereksiz tekrar olurdu.
4. Admin panelin mobilde açılınca gösterdiği kısıtlı görünüm için ayrı bir Stitch ekranı üretilmedi — bu tasarım gerektirmeyecek kadar basit, Claude Code CLAUDE.md'deki tarife göre doğrudan kodluyor.
5. Beğendiğin ekranları Figma'ya aktarabilir ya da doğrudan HTML/CSS kodunu export edip Claude Code'a referans dosyası olarak verebilirsin.
6. Stitch'in aynı promptta bazen ekranlar arası tutarlılığı kaybettiği oluyor (örn. spacing kayması) — bu normal, "make this consistent with screen 2" gibi bir takip promptuyla düzeltilebiliyor.
7. Prompt 6 (Xəzinə) tamamen yeni bir görsel dil kullanıyor (koyu/dramatik) — bunu Prompt 1'in sıcak/ivory paletiyle karıştırma, bilinçli bir kontrast.
8. Admin promptlarında (2 ve 5) dark mode toggle istendi ama Stitch tek seferde hem light hem dark üretmeyi güvenilir yapamayabiliyor — önce light mode'u üret, beğendikten sonra her ekran için ayrı ayrı "now generate a dark mode version of this exact screen, same layout, inverted to dark surfaces with the same muted gold accent" gibi bir takip promptuyla dark varyantını al.
