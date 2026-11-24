# Frontend Developer Texniki Tapşırıq (Spec): Dinamik `Services`, `About Us` və Admin Panel

> **Məqsəd:** Hazırda statik fayllardan (`src/data/services.js`, `src/data/navigation.js`, `src/pages/AboutPage.jsx`) oxunan **Services** və **About Us** hissələrini tam **API-ə bağlı dinamik** hala gətirmək və **Admin Paneldən** (`/admin`) bütün kateqoriya, alt-kateqoriya, prosedur detail, klinika qiyməti, həkim bağlantısı, FAQ və About Us kontentini idarə etmək imkanı yaratmaq.
>
> **Əlaqəli Backend Spec:** `AltensorGlobalHealthCare/BACKEND_DYNAMIC_SERVICES_ABOUT_SPEC.md`

---

## 1. Mövcud Frontend Vəziyyətinin Xülasəsi

| Fayl | Hazırkı Vəziyyət (Statik / Yarımçıq) | Hədəf (Tam Dinamik) |
|---|---|---|
| `src/components/layout/Header.jsx` | `SERVICE_CATEGORIES` (`src/data/services.js`) və `NAV_ABOUT_ITEMS` (`src/data/navigation.js`) statik import olunur. | `GET /api/public/categories?headerOnly=true` və `GET /api/public/pages?parentSlug=about-us` ilə dinamik doldurulmalı. |
| `src/components/sections/ServicesSection.jsx` | Ana səhifədə `HOME_FEATURED_SERVICES` statik massivdən oxunur. | `GET /api/public/categories?homeOnly=true` (və ya `categories`) ilə dinamik. |
| `src/pages/ServicesPage.jsx` | 100% statik `SERVICE_CATEGORIES`, `DOCTORS.slice(0,2)`, `CLINICS.slice(0,2)` istifadə edir; alt-kateqoriya route-u (`/en/services/:category/:sub`) yoxdur! | 4 dinamik görünüş: Directory, Category, Subcategory, Procedure Detail — hamısı backend API-dən. |
| `src/router/AppRouter.jsx` | `/en/services/:category` və `/en/services/:category/:sub/:procedure` var, amma **Alt-kateqoriya route-u (`/en/services/:category/:sub`) yoxdur!** | `/en/services/:category/:sub` route-u əlavə edilməli. |
| `src/pages/AboutPage.jsx` | `PILLARS`, `SUBPAGE_COPY`, `NAV_ABOUT_ITEMS` 100% statikdir; Contact forması backend-ə sorğu atmır (`setContactSent(true)` fake-dir). | `GET /api/public/about-us`, `GET /api/public/pages/:slug`, `GET /api/public/how-it-works` və `POST /api/public/contact` ilə tam dinamik. |
| `src/pages/admin/AdminDashboardPage.jsx` & `AdminEntityModal.jsx` | Kateqoriya yaratmada `ParentId` (alt-kateqoriya) seçimi yoxdur, Redaktə (Edit) yoxdur, Prosedurda yalnız `aboutEn` var (`Candidate`, `Preparation`, `Steps`, `Result`, `Precautions`, klinika qiymətləri, həkim bağlantısı, prosedur FAQ-ı yoxdur). **About Us / CMS tab-ı ümumiyyətlə yoxdur!** | Tam 3 səviyyəli Services idarəetməsi + About Us / CMS idarəetmə tab-ları. |
| `src/services/adminService.js` | `updateCategory`, `updateService`, `setClinicPrice`, `deleteClinicPrice`, `assignServiceDoctors`, `getPages/upsertPage`, `pillars`, `team`, `howItWorks`, `faq`, `contactMessages` metodları yoxdur. | Bütün yeni admin endpoint-ləri əlavə edilməli. |

---

## 2. Routing Dəyişiklikləri (`src/router/AppRouter.jsx`)

`Services` üçün ZagrebMed-in 4 səviyyəli URL strukturunu tam qarşıla:
```jsx
{/* Services — 4 səviyyə */}
<Route path="/en/services" element={<ServicesPage />} />
<Route path="/en/services/:category" element={<ServicesPage />} />
<Route path="/en/services/:category/:sub" element={<ServicesPage />} />
<Route path="/en/services/:category/:sub/:procedure" element={<ServicesPage />} />
```
*(Qeyd: `eu-patients` ayrıca CMS və ya kateqoriya kimi işləyə bilər.)*

---

## 3. HİSSƏ A — Public Frontend: `Services` Dinamikləşdirilməsi

### 3.1 Yeni Public Servis (`src/services/catalogService.js` yaratmaq tövsiyə olunur)
`apiClient` (`src/services/apiClient.js`) artıq `Accept-Language` başlığını (`localStorage.getItem('altensor_lang')`) avtomatik göndərir. Dil dəyişəndə (`language` from `useUI()`) `useEffect` yenidən sorğu atmalıdır!

Lazımi metodlar:
* `getCategories({ headerOnly, homeOnly })` → `GET /public/categories`
* `getCategoryDetail(categorySlug)` → `GET /public/categories/${categorySlug}`
* `getSubcategoryDetail(categorySlug, subSlug)` → `GET /public/categories/${categorySlug}/${subSlug}`
* `getServiceDetail(procedureSlug)` → `GET /public/services/${procedureSlug}`
* `getAboutUsData()` → `GET /public/about-us`
* `getAboutMenuPages()` → `GET /public/pages?parentSlug=about-us`
* `getCmsPage(slug)` → `GET /public/pages/${slug}`
* `getHowItWorks()` → `GET /public/how-it-works`
* `submitContactMessage(payload)` → `POST /public/contact`

### 3.2 `Header.jsx` (Dinamik Mega Menu + About Dropdown)
* **SERVICES 2-level Flyout Menu:**
  * `catalogService.getCategories({ headerOnly: true })` ilə yüklə (komponent mount olanda və `language` dəyişəndə).
  * Sol sütun: Ana kateqoriyalar (`cat.title`, klik → `/en/services/${cat.slug}`).
  * Sağ panel: Aktiv kateqoriyanın `subCategories` siyahısı (`sub.title`, klik → `/en/services/${cat.slug}/${sub.slug}` — artıq `#hash` deyil, real alt-kateqoriya səhifəsinə!).
  * Mobile drawer-də də eyni dinamik `categories` state-indən istifadə et.
* **ABOUT US Dropdown:**
  * `catalogService.getAboutMenuPages()` ilə yüklə (`item.slug` → `/en/about-us/${item.slug}`, `item.title`).
  * API cavab verməzsə fallback kimi `NAV_ABOUT_ITEMS` saxlanıla bilər.

### 3.3 `HomePage` → `ServicesSection.jsx`
* `HOME_FEATURED_SERVICES` əvəzinə `catalogService.getCategories({ homeOnly: true })` (boşdursa ilk 6 kateqoriya) istifadə et.
* Hər kateqoriya kartında alt-kateqoriyalardan toplanmış ilk 4–5 proseduru `/en/services/${cat.slug}/${sub.slug}/${proc.slug}` linki ilə göstər.

### 3.4 `ServicesPage.jsx` — 4 Dinamik Görünüş (ZagrebMed Layout-una 1:1)

1. **Ümumi Kataloq (`/en/services`):**
   * `GET /public/categories`
   * 3 sütunlu grid/masonry:
     * **Level 1:** Mavi başlıq (`cat.title`) → `/en/services/${cat.slug}`
     * **Level 2:** Tünd göy alt-başlıq (`sub.title`) → `/en/services/${cat.slug}/${sub.slug}`
     * **Level 3:** Prosedur linkləri (`proc.title`) → `/en/services/${cat.slug}/${sub.slug}/${proc.slug}`

2. **Kateqoriya Səhifəsi (`/en/services/:category`):**
   * `GET /public/categories/${category}`
   * ZagrebMed kimi **25% sol başlıq / 75% sağ kontent** horizontal bölmələr:
     * **Header:** `H1` + sağda `Send inquiry` düyməsi.
     * **Procedures:** 3 sütunlu grid — hər alt-kateqoriya başlığı + onun prosedurlarının kliklənən siyahısı.
     * **Clinics** *(yalnız `data.clinics.length > 0` olduqda)*: Klinika kartları (`coverUrl`, `name`, `description`, `View profile` → `/en/clinics/${slug}`).
     * **Doctors** *(yalnız `data.doctors.length > 0` olduqda)*: 3 sütunlu həkim kartları (`photoUrl`, `specialization`, `fullName`, `View profile` → `/en/doctors/${id}`).
     * **Patient Reviews** *(yalnız `data.reviews.length > 0` olduqda)*: Swiper karusel (ad, ölkə, `Verified patient` badge, 5 ulduz, həkim/prosedur/klinika linkləri, rəy mətni).
     * **Bottom Coordinator CTA Banner:** Dinamik əsas koordinator (`PrimaryCoordinator`) fotosu, adı və `Fill out the form` düyməsi.

3. **Alt-Kateqoriya Səhifəsi (`/en/services/:category/:sub`):**
   * `GET /public/categories/${category}/${sub}`
   * Breadcrumb: `Home / Services / {ParentCategory} / {SubCategory}`.
   * Eyni 25%/75% şablon: **Procedures** (birbaşa prosedur siyahısı + `Starting from €...` badge), **Clinics**, **Doctors**, **Reviews**, **Coordinator CTA Banner**.

4. **Prosedur Detail Səhifəsi (`/en/services/:category/:sub/:procedure`):**
   * `GET /public/services/${procedure}`
   * Breadcrumb: `Home / Services / {ParentCategory} / {Category} / {Title}`.
   * **Header:** `H1 Title` + sağda `Send inquiry` düyməsi (klikdə `openInquiry(service.title)` — modal avtomatik proseduru bağlasın) + altında `Starting from €{startingPrice}` (əgər qiymət varsa).
   * **Dinamik Tibbi Bölmələr (25% sol H2 / 75% sağ kontent — yalnız dolu olan sahələri göstər):**
     * `About` (+ altında `heroImageUrl` varsa şəkil)
     * `Candidate`
     * `Preparation`
     * `Treatment` (`steps`)
     * `Result`
     * `Precautions`
     * `Treatment package` (`packageInfo`, varsa)
     * `Traveling from abroad?` (`relatedPackage` varsa promo kart + `promoBannerUrl` + paket linki)
   * **Available Clinics (+ Qiymətlər):** `availableClinics` siyahısı — klinika loqosu/cover-i, adı, şəhəri, **`Starting from €{priceFrom}`**, `View profile` linki.
   * **Specialist Doctors:** `availableDoctors` — 3 sütunlu həkim kartları (`View profile`).
   * **Patient Reviews:** `reviews` karuseli.
   * **F.A.Q.:** `faqs` — açılıb-bağlanan akkordeon kartı (yalnız bu prosedura aid FAQ-lar).
   * **Bottom Coordinator CTA Banner.**

> **Qeyd (Rich Text / HTML):** Backend-dən gələn `about`, `steps`, `content` kimi sahələr HTML və ya sətirarası (`\n`) mətn ola bilər. Təhlükəsiz render üçün ya `DOMPurify` (tövsiyə olunur), ya da strukturlaşdırılmış paraqraf renderi istifadə et.

---

## 4. HİSSƏ B — Public Frontend: `About Us` Dinamikləşdirilməsi (`src/pages/AboutPage.jsx`)

### 4.1 Layout Qaydaları (ZagrebMed-ə uyğun)
* **`/en/about-us` və bütün alt-səhifələr (`how-it-works`, `airline-partner`, `obzor-holidays-travel-partner`, `official-editorial-partner`, + admin-in yaratdığı yeni alt-səhifələr):**
  * **2 sütunlu layout:** Sol Sidebar (dinamik `subPages` siyahısı + aktiv vurğu) + Sağ Əsas Kontent.
* **`/en/about-us/contact`:**
  * **Tam enli (full-width) layout** (sol sidebar gizlənir, ZagrebMed-də olduğu kimi).
  * Sol tərəf: Əlaqə forması (`Name`, `E-mail`, `Phone` opsional, `Message`) → real **`POST /api/public/contact`** sorğusu (loading state + error handling + uğurlu bildiriş).
  * Sağ tərəf: Dinamik `PrimaryCoordinator` kartı (`photoUrl`, `fullName`, `role`, `bio`, `phone`, `whatsAppUrl`, sosial linklər).

### 4.2 Əsas `/en/about-us` Səhifəsinin Dinamik Blokları (`GET /api/public/about-us`)
1. **Intro Block:** `page.heading` + `page.content`
2. **Mission Banner Card:** Tünd göy kart (`page.missionTitle`, `page.missionText`, sağda sertifikat badge-i)
3. **Value Pillars Grid (3×2):** `pillars.map(...)` → `title`, `description`
4. **Team Section (2 sütun):** `teamMembers.map(...)` → portret foto (`resolveMediaUrl(m.photoUrl)`), ad, bio, kursiv sitat (`quote`), dairəvi `mailto:` və `tel:` düymələri
5. **Medical Partners Carousel:** `GET /api/public/clinics` məlumatından Swiper karusel (sol tərəf klinika loqosu, sağ tərəf klinikanın `description`-ı)
6. **How It Works Accordion:** `howItWorksSteps.map(...)` → 6 açılıb-bağlanan addım (`stepNumber`, `title`, `content`, opsional `ctaLabel` + `ctaUrl`).

### 4.3 `/en/about-us/how-it-works` və Digər CMS Alt-Səhifələri
* `subpage === 'how-it-works'`: `GET /api/public/how-it-works` → eyni `HowItWorksAccordion` komponentini paylaşır (kod təkrarı olmasın, ayrı reusable komponent kimi çıxar: `src/components/about/HowItWorksAccordion.jsx`).
* İstənilən digər `subpage` (məs: `airline-partner`, `obzor-holidays-travel-partner`, `official-editorial-partner` və ya admin-in yeni əlavə etdiyi səhifə):
  * `GET /api/public/pages/${subpage}` → `title`, `heading`, `subtitle`, `heroImageUrl`, `content` (rich text/HTML), altında `Send inquiry` CTA.
  * 404 gələrsə uyğun "Page not found" və ya fallback göstər.

---

## 5. HİSSƏ C — Admin Panel Genişləndirməsi (`/admin`)

Mövcud `AdminDashboardPage.jsx`, `AdminEntityModal.jsx` və `adminService.js` üzərində ediləcək yeniləmələr:

### 5.1 `adminService.js` — Əlavə Ediləcək Metodlar
```js
// Categories & Services (Tam CRUD + Relations)
getAdminCategories()                          // GET /admin/categories
updateCategory(id, data)                      // PUT /admin/categories/:id
getAdminServices(params)                      // GET /admin/services
getAdminServiceById(id)                       // GET /admin/services/:id
updateService(id, data)                       // PUT /admin/services/:id
uploadServiceHeroImage(id, file)              // POST /admin/services/:id/hero-image
uploadServicePromoBanner(id, file)            // POST /admin/services/:id/promo-banner
setClinicPrice(data)                          // POST /admin/services/price
deleteClinicPrice(serviceId, clinicId)        // DELETE /admin/services/:serviceId/clinics/:clinicId
assignServiceDoctors(serviceId, doctorIds)    // PUT /admin/services/:serviceId/doctors

// Procedure & General FAQs
getAdminFaqs(medicalServiceId)                // GET /admin/faq
createFaq(data)                               // POST /admin/faq
updateFaq(id, data)                           // PUT /admin/faq/:id
deleteFaq(id)                                 // DELETE /admin/faq/:id

// About Us & CMS
getAdminPages()                               // GET /admin/pages
getAdminPageBySlug(slug)                      // GET /admin/pages/:slug
upsertPage(data)                              // POST /admin/pages
deletePage(slug)                              // DELETE /admin/pages/:slug
getPillars() / createPillar() / updatePillar() / deletePillar()
getTeamMembers() / createTeamMember() / updateTeamMember() / deleteTeamMember() / uploadTeamPhoto(id, file)
getHowItWorksSteps() / createStep() / updateStep() / deleteStep()
getContactMessages(params) / markContactHandled(id)
```

### 5.2 Admin Paneldə "Categories & Services" Tab-ının Yenilənməsi
Hazırda sadə siyahıdır; ZagrebMed-in 3 səviyyəli strukturuna uyğun **Ağac / Accordion (Tree View)** halına gətirilməlidir:
1. **Ana Kateqoriya (Level 1):**
   * Yarat / Redaktə et / Sil (`Edit` düyməsi əlavə olunsun!).
   * Modalda əlavə sahələr: `Parent Category` (`None = Top-level` və ya ana kateqoriya seçimi), `DisplayOrder`, `Show in Header Menu` checkbox, `Show on Home Page` checkbox, `IsActive` toggle, 3 dildə (`EN` / `AZ` / `RU` tab-lı) `Title` + `Description`.
   * Hər ana kateqoriya sətrində **`+ Add Subcategory`** düyməsi (modalı avtomatik `parentId = cat.id` ilə açır).
2. **Alt-Kateqoriya (Level 2):**
   * Ana kateqoriya açıldıqda altında göstərilir.
   * Redaktə et / Sil + **`+ Add Procedure`** düyməsi (modalı avtomatik `categoryId = sub.id` ilə açır).
3. **Prosedur / Medical Service (Level 3 — Tam Detail Redaktoru):**
   * Prosedur yaratma/redaktə ekranı geniş olduğuna görə **Tab-lı Modal və ya Drawer** şəklində qurulmalıdır:
     * **Tab 1 — General & Content (EN / AZ / RU dil tab-ları ilə):**
       * `Category / Subcategory` (qruplaşdırılmış `<optgroup>` select), `Slug`, `Title`, `DurationText`, `DisplayOrder`, `IsMostSearched`, `IsActive`
       * Rich text / textarea sahələri: `About`, `Candidate`, `Preparation`, `Treatment (Steps)`, `Result`, `Precautions`, `Package Info`
       * Şəkil yükləmə (`ImageDropzone` reuse et): `Hero Image`, `Promo Banner`, `Related All-in-One Package` select.
     * **Tab 2 — Clinics & Prices (`ClinicService`):**
       * Prosedura klinika əlavə et: `[Select Clinic]` + `[PriceFrom]` + `[Currency: EUR]` + `Save Price`.
       * Mövcud klinika qiymətləri cədvəli + `Edit` / `Delete` düymələri.
     * **Tab 3 — Assigned Doctors (`DoctorMedicalService`):**
       * Həkimlərin axtarışlı multi-select checkbox siyahısı (klinika adı ilə birlikdə) → `Save Doctors`.
     * **Tab 4 — Procedure F.A.Q.:**
       * Yalnız bu prosedura aid sual-cavabların (`EN`/`AZ`/`RU`) əlavə edilməsi, redaktəsi və silinməsi.

### 5.3 Admin Panelə Yeni Tab-ların Əlavə Edilməsi
Sol Admin Sidebar-a yeni bölmələr əlavə olunsun:
1. **`About Us & CMS` Tab-ı** (daxilində 4 alt-tab):
   * **Sub-tab 1: Pages** — `about-us` (Mission Title/Text daxil), `how-it-works`, `airline-partner`, `obzor-holidays-travel-partner`, `official-editorial-partner` + **`+ New About Subpage`** düyməsi. 3 dildə (`EN`/`AZ`/`RU`) redaktə, `ShowInMenu`, `DisplayOrder`, `IsPublished`.
   * **Sub-tab 2: Value Pillars** — 6 kartın 3 dildə CRUD + `DisplayOrder`.
   * **Sub-tab 3: Team & Coordinator** — Komanda üzvlərinin 3 dildə CRUD + `ImageDropzone` ilə foto yükləmə + `Is Primary Coordinator` toggle.
   * **Sub-tab 4: How It Works Steps** — 6 addımın 3 dildə CRUD + `StepNumber`, `CtaLabel`, `CtaUrl`.
2. **`Contact Messages` Tab-ı** *(opsional, amma çox faydalı)*:
   * `/en/about-us/contact` formasından gələn mesajların siyahısı (`Unread` / `Handled` filtri + `Mark as Handled` düyməsi).

---

## 6. Mərhələli İcra Planı (Tövsiyə)

1. **Mərhələ 1 — `adminService.js` & `catalogService.js`:** Yeni API metodlarının yazılması və `language` dəyişdikdə avtomatik yenilənmənin qurulması.
2. **Mərhələ 2 — Admin Panel `Services`:** 3 səviyyəli Category/Subcategory/Procedure ağacı + Tab-lı Prosedur redaktoru (Content + Clinic Prices + Doctors + FAQ).
3. **Mərhələ 3 — Public `Services`:** `AppRouter.jsx` (`:sub` route), `Header.jsx` dinamik flyout menyu, `ServicesSection.jsx`, `ServicesPage.jsx` (4 görünüş).
4. **Mərhələ 4 — Admin Panel `About Us & CMS`:** Pages, Pillars, Team, How It Works, Contact Messages tab-ları.
5. **Mərhələ 5 — Public `About Us`:** `Header.jsx` About dropdown, `AboutPage.jsx` (Overview + How It Works + CMS subpages + real Contact forması).

---

## 7. Yoxlama Siyahısı (Acceptance Criteria)

- [ ] Admin Paneldə yaradılan yeni ana kateqoriya (məs. `Dentistry`), alt-kateqoriya (`Dental Implants`) və prosedur (`Dental Implants`) səhifə yeniləndikdən dərhal sonra Header menyusunda, `/en/services` kataloqunda, kateqoriya/alt-kateqoriya səhifələrində və detail səhifəsində görünür.
- [ ] Prosedur detail səhifəsində klinikalar, "Starting from €..." qiymətləri, təyin olunmuş həkimlər, rəylər, prosedur FAQ-ları və əlaqəli All-in-one paket promo bloku dinamik gəlir.
- [ ] Header-də dil (`EN` / `AZ` / `RU`) dəyişdirildikdə `Services` və `About Us` kontenti API-dən seçilmiş dildə yenilənir.
- [ ] Admin Paneldə `About Us` bölməsindən redaktə olunan Mission, 6 Pillar, Komanda üzvləri, `How it works` addımları və alt-səhifələr `/en/about-us/*` səhifələrində canlı əks olunur.
- [ ] `/en/about-us/contact` forması real `POST /api/public/contact` endpoint-inə sorğu göndərir və Admin Paneldə görünür.
- [ ] Statik `src/data/services.js` və `NAV_ABOUT_ITEMS` artıq əsas mənbə deyil (yalnız offline fallback kimi saxlanıla və ya təmizlənə bilər).
