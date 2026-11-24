# MedicaTurn (`/plan`) — Tam Detallı Analiz və Funksional Sənəd

**Mənbə URL:** `https://www.medicaturn.com/plan`  
**Ümumi Struktur:** 9 addımlı interaktiv müalicə planlaşdırıcısı (*Interactive Treatment Planner Wizard*)

---

## 1. Ümumi Dizayn, Başlıq və Altlıq (Layout & Shared UI)

* **Başlıq (Header):**
  * **Sol tərəf:** MedicaTurn loqosu (yaşıl/firuzəyi ürək-nəbz + qlobus ikonu və `"MedicaTurn"` mətni, `https://www.medicaturn.com/` ünvanına yönləndirir).
  * **Sağ tərəf:** Addım göstəricisi — məsələn: `Step 1 of 9 · Treatment`.
  * **Proqres Bar:** Başlığın düz altında nazik üfüqi zolaq. Hər addımda proporsional olaraq dolur (`1/9`-dən `9/9`-a doğru).
* **Arxa Fon və Yerləşmə:**
  * Təmiz ağ fon, arxada solğun yaşıl/boz rəngli dünya xəritəsi su nişanı (*watermark*).
  * Mərkəzləşdirilmiş struktur, yumru künclü ağ kartlar və xüsusi 3D tipli tibbi illüstrasiyalar.
* **Ortaq Altlıq (Footer — bütün addımlarda görünür):**
  * Kömək mətni: `Questions while you fill this in?` + `Message us on WhatsApp` (`https://wa.me/447366832288`).
  * Hüquqi linklər: `Privacy Policy` (`/privacy`) · `Consumer Health Data Privacy (US)` (`/consumer-health-data-privacy`).
* **Naviqasiya:**
  * 1-ci addımda kartı klikləyən kimi avtomatik 2-ci addıma keçir (`Continue` düyməsi yoxdur).
  * 2–8-ci addımlarda `← Back` və `Continue` (8-ci addımda `Submit Application`) düymələri var.

---

## 2. Addım 1 of 9 · `Treatment` (Kateqoriya Seçimi)

* **Başlıq (`h1`):** `What treatment are you looking for?`
* **Alt başlıq:** `Choose a category to see the usual process. Applying is free.`
* **Köməkçi mətn:** `It takes about 5 to 10 minutes. If you have photos, X-rays or medical reports, keep them to hand.`
* **Kateqoriya Kartları (3 sütunlu grid):**
  1. **Hair Transplant** — *"FUE, Sapphire FUE and DHI hair restoration in Turkiye."* (İllüstrasiya: baş dərisi və implanter qələmi)
  2. **Dental Treatments** — *"Implants, All-on-4/6, crowns and root canal: mark exactly what you need."* (İllüstrasiya: titan implant üzərində diş tacı)
  3. **Cosmetic Surgery** — *"Body, breast and facial procedures at authorised hospitals in Turkiye."* (İllüstrasiya: üz profili, cərrahi xətlər və skalpel)
  4. **Eye Treatments** — *"LASIK, SMILE, ICL and cataract surgery."* (İllüstrasiya: yaşıl lazer şüalı göz)
  5. **Weight Loss Surgery** — *"Sleeve gastrectomy, gastric bypass and gastric balloon."* (İllüstrasiya: içində balon olan mədə)
  6. **IVF Treatment** — *"IVF cycles and PGT/PGD genetic screening in Turkiye."* (İllüstrasiya: Petri qabında embrionlar və pipet)
  7. **Check-up** *(əlavə 7-ci kart)* — *"Comprehensive health screening packages with specialist review."*

---

## 3. Addım 2 of 9 · `Details` (Müalicəyə Xas Seçimlər)

Bütün müalicə axınlarının **aşağı hissəsində** 2 ortaq bölmə mövcuddur:
1. **Preferred city** (*"We'll look for hospitals and clinics in the city you prefer."*):
   * `Istanbul`, `Antalya`, `Izmir`, `Gaziantep`, `No preference` (defolt).
2. **Hospital preference** (*"Tell us whether you'd prefer a premium private hospital or a more affordable option."*):
   * `Premium hospital` — *"A premium private hospital."*
   * `Standard` — *"A more affordable hospital or clinic."*
   * `No preference` — *"We'll propose what best suits your needs."* (defolt).

### A. Hair Transplant (`Hair Transplant details`)
1. **Sual:** `How many grafts do you expect to need?`
   * *Köməkçi mətn:* *"Not sure which best matches you? Pick the diagram closest to your hair loss pattern. The clinic will confirm after reviewing your photos."*
   * *Seçimlər (4 ədəd 3D baş sıxlığı illüstrasiyalı kart; `2,000 – 3,500 grafts` əvvəlcədən seçilidir):*
     * `Up to 2,000 grafts`
     * `2,000 – 3,500 grafts`
     * `3,500 – 5,000 grafts`
     * `5,000+ grafts (mega session)`
2. **Sual:** `Preferred technique` (4 illüstrasiyalı kart; `FUE` əvvəlcədən seçilidir):
   * `FUE (Follicular Unit Extraction)` — *"Individual hair follicles are removed one by one and re-implanted into thinning areas. Leaves no linear scar."*
   * `Sapphire FUE` — *"FUE using sapphire-tipped blades for the recipient sites: finer incisions allow closer graft placement and typically faster healing."*
   * `DHI (Direct Hair Implantation)` — *"Follicles are placed directly into the scalp using a Choi implanter pen, often without shaving the recipient area."*
   * `Beard / Eyebrow Transplant` — *"Hair follicles taken from the back of the scalp are transplanted to fill gaps in the beard or eyebrows."*
3. **Sual:** `Are you considering a second session?` (`Yes`, `No`)
4. **Sual:** `Do you have an existing beard or previous transplant?` (`Yes`, `No`)

### B. Dental Treatments (`Dental Treatments details`)
1. **İnteraktiv Diş Xəritəsi:** `Mark the teeth that need treatment`
   * **Müalicə Seçicisi (rəng kodlu düymələr; `Implant` əvvəlcədən seçilidir):**
     * `Implant` (Mavi) — *"A titanium post is placed in the jawbone to replace a missing tooth root, then topped with a crown once healed."*
     * `Zirconia` (Yaşıl) — *"A very strong, tooth-coloured cap that fully covers a damaged tooth or implant. Durable, good for back teeth."*
     * `E-max` (Zeytun/Firuzəyi) — *"A translucent ceramic crown prized for looking the most natural, often chosen for front, visible teeth."*
     * `Porcelain` (Açıq yaşıl) — *"A tooth-coloured cap over a metal or ceramic base, a well-established, lower-cost crown option."*
     * `Root Canal` (Narıncı) — *"Removes infected/damaged pulp from inside the tooth and seals it, saving a tooth that would otherwise need extraction."*
     * `Clear` (Pozan ikonu — təmizləmə)
   * *Köməkçi mətn:* *"Pick a treatment above, then tap each tooth that needs it. A tooth can have more than one treatment — tap it again with a different treatment selected to add it, or the same one again to remove it."*
   * **UPPER JAW (Üst Çənə):**
     * Tam qövs düymələri: `All-on-4 (fixed full-arch bridge)`, `All-on-6 (fixed full-arch bridge)`
     * FDI diş nömrələri: `Tooth 18`–`Tooth 11`, `Tooth 21`–`Tooth 28`
   * **LOWER JAW (Alt Çənə):**
     * FDI diş nömrələri: `Tooth 48`–`Tooth 41`, `Tooth 31`–`Tooth 38`
     * Tam qövs düymələri: `All-on-4 (fixed full-arch bridge)`, `All-on-6 (fixed full-arch bridge)`
   * *Validasiya:* İrəli keçmək üçün ən azı 1 diş və ya All-on-4 / All-on-6 seçilməlidir.
2. **Əlavə suallar:**
   * `Also add a professional cleaning (scale & polish)` (*"Can be combined with any treatment above."*): `Yes`, `No`
   * `I'm not sure which teeth need treatment` (*"No problem, describe the issue below..."*): `Yes`, `No`
   * `Briefly describe the issue (optional)` — Mətn qutusu (`e.g. pain in a lower-left back tooth, a missing tooth, sensitivity, etc.`)

### C. Cosmetic Surgery (`Cosmetic Surgery details`)
* **Sual:** `Which procedure are you interested in?` (10 seçim düyməsi; `Liposuction` əvvəlcədən seçilidir):
  * `Liposuction`, `Tummy Tuck`, `Brazilian Butt Lift (BBL)`, `Rhinoplasty`, `Breast Augmentation`, `Breast Lift`, `Breast Reduction`, `Facelift`, `Otoplasty (Ear Reshaping)`, `Gynecomastia (Male Chest)`

### D. Eye Treatments (`Eye Treatments details`)
1. **Sual:** `Which procedure do you need?` (4 kart; `LASIK` əvvəlcədən seçilidir):
   * `LASIK` — *"A flap is created in the cornea and reshaped with a laser to correct vision. Fast recovery, the most common laser eye surgery."*
   * `SMILE` — *"A newer, flapless laser technique: corneal tissue is removed through a small opening, which some patients find more comfortable to recover from."*
   * `ICL (Implantable Contact Lens)` — *"A corrective lens is implanted inside the eye rather than reshaping the cornea, an option for higher prescriptions or thin corneas not suitable for laser."*
   * `Cataract Surgery` — *"The eye's clouded natural lens is removed and replaced with a clear artificial lens."*
2. **Sual:** `Which eye(s) need treatment?`
   * *Köməkçi mətn:* *"Only one eye may need it, e.g. if the other already has stable vision or had surgery before."*
   * İnteraktiv göz düymələri: `Right Eye`, `Left Eye` (hər ikisi müstəqil şəkildə seçilib-ləğv edilə bilir).

### E. Weight Loss Surgery (`Weight Loss Surgery details`)
* **Sual:** `Which procedure are you considering?` (4 düymə; `Sleeve Gastrectomy` əvvəlcədən seçilidir):
  * `Sleeve Gastrectomy`, `Gastric Bypass`, `Mini Gastric Bypass`, `Gastric Balloon`

### F. IVF Treatment (`IVF Treatment details`)
* **Sarı Xəbərdarlıq Qutusu (Hüquqi Bildiriş):**
  * **Before you continue:** *"Under Turkish law, IVF is only available to legally married couples using their own eggs and sperm, and the clinic will ask to see your marriage certificate. Donor eggs, donor sperm, donor embryos and surrogacy are not permitted in Turkiye, so we cannot arrange them."*
* **Sual 1:** `How many IVF cycles?` (`1 IVF Cycle` [əvvəlcədən seçilidir], `2 IVF Cycles`, `3 IVF Cycles`)
* **Sual 2:** `Add PGT/PGD genetic screening` (`Yes`, `No`)
  * *Köməkçi mətn:* PGT-M və PGT-A testlərinin izahı, hamiləliyə zəmanət vermədiyi və Türkiyə qanunlarına görə tibbi səbəb olmadan cinsiyyət seçiminə icazə verilmədiyi qeyd olunur.

---

## 4. Addım 3 of 9 · `About You` (Ortaq)

* **Başlıq:** `About you`
* **Alt başlıq:** `This lets us ask the right health questions next. Some questions only apply to certain ages, genders or procedures.`
* **Sahələr:**
  * `First name` (mətn)
  * `Last name` (mətn)
  * `Date of birth` (tarix seçici: Ay / Gün / İl)
  * `Gender` (açılan siyahı: `Select…`, `Male`, `Female`, `Other`, `Prefer not to say`)

---

## 5. Addım 4 of 9 · `Health Info` (Ortaq + Şərti + Müalicəyə Xas)

* **Başlıq:** `A few health questions`
* **Alt başlıq:** `Standard medical screening so the clinic can review your case safely. This is confidential and shared only with the medical team reviewing your request.`
* **Məcburi Razılıq Qutusu (Checkbox):**
  * `I explicitly consent to MedicaTurn processing my health information (special category personal data) in order to arrange my medical assessment with partner clinics, as described in the Privacy Policy.`
* **Bütün Müalicələr Üçün Ortaq Suallar:**
  1. `Do you have any of the following conditions? *` (çoxlu seçim): `Diabetes`, `High blood pressure`, `Heart disease`, `Thyroid disorder`, `Asthma / COPD`, `Kidney disease`, `Blood clotting disorder`, `None of the above`
  2. `Are you currently taking any medication? *`: `Yes` (seçiləndə mətn sahəsi açılır: `e.g. Warfarin, Metformin`), `None`
  3. `Smoking / alcohol use *`: `Neither`, `I smoke`, `I drink alcohol regularly`, `Both`
  4. `Any previous surgeries relevant to this treatment? *`: `Yes` (mətn sahəsi açılır: `e.g. Previous rhinoplasty in 2021`), `None`
  5. `Any known allergies (medication, anaesthesia, latex, etc.)? *`: `Yes` (mətn sahəsi açılır: `Please list your allergies`), `None`
* **Cinsiyyətə Bağlı Şərti Sual (Addım 3-də `Female` seçilibsə):**
  * `Are you currently pregnant or breastfeeding? *`: `Pregnant`, `Breastfeeding`, `No`
* **Müalicəyə Xas Sağlamlıq Sualları:**
  * **Hair Transplant:**
    * `Are you currently taking blood-thinning medication? *` (`Yes`, `No`)
    * `Any scalp conditions (psoriasis, eczema, infection)? *` (`Yes` -> `Please describe` qutusu açılır, `None`)
  * **Dental Treatments:**
    * `Have you been diagnosed with gum disease (periodontitis)? *` (`Yes`, `No`)
  * **Cosmetic Surgery:**
    * `Do any of these apply to you? *` (`Currently taking blood thinners`, `History of keloid / abnormal scarring`, `Significant weight change in the last 6 months`, `None of the above`)
  * **Eye Treatments:**
    * `Any current eye conditions or previous eye surgery? *` (`Yes`, `None`)
    * `Do you currently wear contact lenses? *` (`Yes`, `No`)
    * `Has your glasses/contact lens prescription been stable for the last 12 months? *` (`Yes`, `No`)
  * **Weight Loss Surgery:**
    * `Height (cm) *` (rəqəm, `100`–`230`)
    * `Current weight (kg) *` (rəqəm, `40`–`300`)
    * `Do you have any of these weight-related conditions? *` (`Type 2 diabetes`, `Sleep apnoea`, `Joint pain / mobility issues`, `None of the above`)
    * `Any history of depression, anxiety or an eating disorder relevant to your weight? (Standard pre-surgical screening) *` (`Yes`, `None`)
  * **IVF Treatment:**
    * `Previous IVF attempts (enter 0 if this will be your first) *` (rəqəm, `0`–`20`)
    * `Has male-factor infertility been diagnosed? *` (`Yes`, `No`)
    * `Do you have a recent AMH / ovarian reserve test result?` (könüllü: `Yes`, `No`)

---

## 6. Addım 5 of 9 · `Photos & Files` (Ortaq)

* **Başlıq:** `Photos & medical files`
* **Köməkçi mətn:** `Optional, but sharing existing photos, X-rays or reports helps the clinic give you a more accurate plan. JPEG, PNG, HEIC or PDF, up to 10MB each, 6 files max. Uploaded files are automatically deleted 14 days after upload.`
* **Yükləmə düyməsi:** `Click to choose files` (Məcburi deyil — fayl yükləmədən `Continue` aktivdir).

---

## 7. Addım 6 of 9 · `Plan & Price` (Müalicəyə Xas Timeline + Ortaq Şərtlər)

* **Başlıq:** `Your treatment plan`
* **Müalicəyə Xas Mərhələli Vaxt Qrafiki (Timeline):**
  * **Hair Transplant (4 mərhələ):** `1. Consultation` (Online) → `2. Arrival & Pre-Op` (1 day) → `3. Procedure Day` (6–8 hours) → `4. First Wash & Departure` (1–2 days)
  * **Dental Treatments (3 mərhələ):** `1. Photo & X-ray Review` (Online) → `2. Single Visit` (5–7 days) → `3. Two-Visit Path` (3–6 months apart)
  * **Cosmetic Surgery (5 mərhələ):** `1. Consultation` (Online) → `2. Arrival & Pre-Op` (1 day) → `3. Surgery Day` (1–3 days) → `4. Recovery` (4–7 days) → `5. Follow-up` (Online)
  * **Eye Treatments (4 mərhələ):** `1. Screening` (Online) → `2. Arrival & Exam` (1 day) → `3. Laser / Lens Procedure` (30–60 min) → `4. Next-Day Check` (1–2 days)
  * **Weight Loss Surgery (5 mərhələ):** `1. Evaluation` (Online) → `2. Pre-Op Tests` (1 day) → `3. Surgery` (2–3 days) → `4. Recovery` (3–4 days) → `5. Follow-up` (12 months online)
  * **IVF Treatment (5 mərhələ):** `1. Consultation` (Online) → `2. Ovarian Stimulation` (10–12 days) → `3. Egg Retrieval & Fertilisation` (1 day) → `4. Embryo Transfer` (1 day) → `5. Follow-up` (10–14 days later)
* **Müraciət Xülasəsi və Qiymət İzahı:**
  * `Your treatment request` bölməsində seçilən prosedurun qısa xülasəsi göstərilir (məs: `2,000 – 3,500 grafts · FUE`, `Dental Implant`, `1 IVF Cycle`).
  * Mətn: *"After you apply, we compare hospitals for your request and email you a free Treatment Proposal: the hospital's price, our Patient Coordination Fee and the total."*
* **Qiymətə daxil olmayanlar (`Not included in the proposal price`):**
  * Türkiyəyə gediş-gəliş uçuş biletləri
  * Otel və transferlər (əgər xəstəxana öz qiymətinə daxil etməyibsə)
  * Səyahət və tibbi səyahət sığortası
  * Viza rüsumları
  * Həkim müayinəsindən sonra tövsiyə olunan əlavə müalicə/testlər
  * Ağırlaşma və ya gec sağalma halında əlavə müalicə/qalma xərcləri
  * Şəxsi xərclər (restoran, alış-veriş, gəzinti)

---

## 8. Addım 7 of 9 · `Contact Info` (Ortaq)

* **Başlıq:** `Contact details`
* **Alt başlıq:** `Where should we send your free Treatment Proposal?`
* **Sahələr:**
  * `Email` (`you@example.com`)
  * `Confirm email` (`Re-enter your email`)
  * `Phone number` — Ölkə kodu seçicisi (20+ ölkə, defolt `🇬🇧 +44`) + nömrə sahəsi
  * `Preferred communication channel`: `WhatsApp` (əvvəlcədən seçili), `Email`, `Phone call`

---

## 9. Addım 8 & 9 of 9 · `Agreement` və Təsdiq

* **Başlıq:** `Application terms`
* **Alt başlıq:** `Please review and sign below to submit your application.`
* **Sürüşdürülən Şərtlər Qutusu (Scroll-gated Terms Box):**
  * MedicaTurn-ün koordinator rolu, Türkiyədəki lisenziyalı xəstəxanalar, qiymət/koordinator haqqı, tibbi risklər, ləğv/geri ödəmə və məlumatların qorunması qaydaları.
  * **Mexanizm:** `Scroll to the end to continue.` — İstifadəçi mətni sonuna qədər sürüşdürməsə, imza və razılıq qutuları `disabled` (kilidli) qalır.
* **İmza və Razılıq:**
  * `Type your full legal name as your signature` (Addım 3-dəki Ad + Soyad ilə avtomatik dolur)
  * Checkbox 1: `I have read and accept the Application Terms above.`
  * Checkbox 2: `I confirm the medical and personal details I provided are accurate to the best of my knowledge.`
* **Göndərmə Düyməsi:** `Submit Application`
* **Addım 9:** Təsdiq ekranı (müraciət göndərildikdən sonra açılır).

---

## 10. Xülasə: Nələr Var vs. Nələr Yoxdur?

### ✅ Nələr Var:
1. **9 addımlı dinamik sorğu axını (Wizard):** Seçilən müalicə kateqoriyasına görə Addım 2, 4 və 6 tam dəyişir.
2. **İnteraktiv vizual alətlər:**
   * Diş üçün tam FDI nömrəli üst/alt çənə xəritəsi + All-on-4/6 + rəngli müalicə növləri.
   * Saç əkimi üçün 4 səviyyəli qraft sıxlığı illüstrasiyaları.
   * Göz üçün Sağ/Sol göz interaktiv seçimi.
3. **Şərti məntiq (Conditional Logic):**
   * Addım 3-də `Female` seçiləndə Addım 4-də hamiləlik/əmizdirmə sualı çıxır.
   * Dərman, allergiya, əvvəlki əməliyyat və baş dərisi problemlərində `Yes` seçiləndə əlavə izahat qutusu açılır.
4. **Hüquqi uyğunluq və məxfilik:**
   * IVF üçün Türkiyə qanunvericiliyi xəbərdarlığı.
   * Xüsusi kateqoriyalı sağlamlıq məlumatları (GDPR/special category data) üçün açıq razılıq.
   * 14 gündən sonra yüklənən faylların avtomatik silinməsi qeydi.
   * Son addımda məcburi oxuma (*scroll-gate*) və rəqəmsal imza.
5. **Canlı dəstək bağlantısı:** Bütün addımların altında sabit WhatsApp düyməsi.

### ❌ Nələr Yoxdur:
1. **Canlı qiymət kalkulyatoru və ya sabit qiymət cədvəli yoxdur:** Qiymət dərhal göstərilmir; müraciətdən sonra e-poçtla fərdi "Treatment Proposal" göndərilir.
2. **Səyahət, tarix və büdcə addımları yoxdur:** Nə vaxt gəlmək istədiyiniz, neçə gün qalacağınız, otel ulduzu, hava limanı transferi, tərcüməçi dili və ya büdcə aralığı kimi suallar soruşulmur.
3. **Daimi yan panel (Summary Sidebar) yoxdur:** Seçimlərin xülasəsi yalnız Addım 6-da görünür.
4. **Klinika/Həkim seçimi yoxdur:** Yalnız şəhər (`Istanbul`, `Antalya`, `Izmir`, `Gaziantep`) və ümumi səviyyə (`Premium`, `Standard`) seçilir; konkret xəstəxana/həkim siyahısı yoxdur.
5. **Onlayn ödəniş və ya depozit sistemi yoxdur:** Müraciət tam pulsuzdur.
