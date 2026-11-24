# AltensorGlobalHealthCare — Frontend Tərtibatçısı Bələdçisi (API Documentation)

Bu sənəd **AltensorGlobalHealthCare** tibbi turizm və səhiyyə koordinasiya platformasının REST API-si ilə işləyən frontend tərtibatçıları (React, Next.js, Vue və ya mobil komandası) üçün hazırlanmış tam praktiki bələdçidir.

---

## 1. Əsas Prinsiplər və Qaydalar

### 1.1 Base URL və Protokol
* **Base URL:** `http://localhost:5000/api` (və ya canlı server domeni)
* **Swagger UI:** `http://localhost:5000/` (birbaşa root-da açılır)
* **Format:** Bütün sorğu və cavablar `application/json; charset=utf-8` formatındadır (fayl yükləmələri istisna olmaqla: `multipart/form-data`).

### 1.2 Çoxdillilik (Multilingual — Az / En / Ru)
API **3 dildə** (Azərbaycan, İngilis, Rus) tam lokalizasiyanı dəstəkləyir:
* İstənilən sorğuda `?lang=az`, `?lang=en` və ya `?lang=ru` parametrini ötürə bilərsiniz.
* Və ya HTTP Header vasitəsilə: `Accept-Language: en-US` / `az` / `ru`.
* Default dil: **`az`** (Azərbaycan dili).

### 1.3 Vahid Cavab Modeli (`ApiResponse<T>`)
Bütün endpoint-lər (həm uğurlu, həm də xəta hallarında) eyni formatda cavab qaytarır:

#### Uğurlu Cavab:
```json
{
  "success": true,
  "data": { ... },
  "message": "Uğurla tamamlandı.",
  "errorCode": null,
  "errors": null,
  "traceId": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"
}
```

#### Xəta Cavabı (Məsələn, Validasiya Xətası):
```json
{
  "success": false,
  "data": null,
  "message": "Daxil edilən məlumatlarda səhvlər var.",
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "email",
      "message": "Düzgün bir e-poçt ünvanı daxil edin.",
      "code": "EmailValidator"
    },
    {
      "field": "password",
      "message": "Şifrə ən azı 8 simvol olmalıdır.",
      "code": "MinimumLengthValidator"
    }
  ],
  "traceId": "00-112233445566-7788-01"
}
```

### 1.4 Standart Xəta Kodları Cədvəli
Frontend xəta koduna (`errorCode`) əsasən UI bildirişlərini idarə edə bilər:

| Status Kodu | `errorCode` | Məna / Frontend Hərəkəti |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Formada sahə xətaları var (`errors` massivindən sahələrə xəta yazın) |
| `400` | `INVALID_CODE` | Daxil edilən 6 rəqəmli təsdiq kodu yanlışdır |
| `401` | `UNAUTHORIZED` | Token yoxdur və ya etibarsızdır → İstifadəçini `/login` səhifəsinə yönləndirin |
| `401` | `INVALID_CREDENTIALS` | Email və ya şifrə yanlışdır |
| `403` | `FORBIDDEN` | Bu əməliyyat üçün istifadəçinin hüququ çatmır |
| `404` | `*_NOT_FOUND` | Axtarılan resurs tapılmadı (klinika, prosedur, müraciət və s.) |
| `409` | `EMAIL_ALREADY_EXISTS` | Bu email artıq qeydiyyatdan keçib |
| `422` | `EMAIL_NOT_CONFIRMED` | Email təsdiqlənməyib → İstifadəçini 6 rəqəmli kod daxiletmə ekranına yönləndirin |
| `422` | `OFFER_EXPIRED` | Təklifin vaxtı bitib, qəbul edilə bilməz |
| `429` | `TOO_MANY_REQUESTS` | Çox cəhd edilib, 60 saniyə gözləmə taymeri göstərin |
| `500` | `INTERNAL_SERVER_ERROR` | Gözlənilməz server xətası |

---

## 2. Autentifikasiya və Qeydiyyat Axını

### 2.1 Qeydiyyat (Registration)
* **Endpoint:** `POST /api/auth/register`
* **Body:**
```json
{
  "firstName": "Ali",
  "lastName": "Cabbarov",
  "phoneNumber": "+994501234567",
  "email": "licabbarov1@gmail.com",
  "password": "Password123!",
  "acceptTerms": true,
  "country": "Azərbaycan"
}
```
* **Nəticə:** İstifadəçi bazada yaradılır, statusu təsdiqlənməmiş qalır və emailə 6 rəqəmli aktivasiya kodu göndərilir. Frontend istifadəçini kod daxiletmə modalına / səhifəsinə keçirir.

### 2.2 Email Təsdiqi (Confirm Email)
* **Endpoint:** `POST /api/auth/confirm-email`
* **Body:**
```json
{
  "email": "licabbarov1@gmail.com",
  "code": "123456"
}
```
* **Nəticə:** Hesab aktivləşir və dərhal `accessToken`, `refreshToken` və `user` məlumatları qaytarılır. Əlavə login sorğusuna ehtiyac qalmır!

### 2.3 Kodun Yenidən Göndərilməsi (Resend Code)
* **Endpoint:** `POST /api/auth/resend-code`
* **Body:** `{ "email": "licabbarov1@gmail.com" }`
* **Qeyd:** Hər sorğu arasında 60 saniyə gözləmə müddəti (cooldown) var.

### 2.4 Giriş (Login)
* **Endpoint:** `POST /api/auth/login`
* **Body:** `{ "email": "licabbarov1@gmail.com", "password": "Password123!" }`
* **Cavab:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "XyZ123...",
    "expiresAt": "2026-11-12T22:30:00Z",
    "user": {
      "id": "e4f8b...",
      "email": "licabbarov1@gmail.com",
      "fullName": "Ali Cabbarov",
      "roles": ["Patient"],
      "clinicId": null
    }
  }
}
```

### 2.5 Token Yeniləmə (Refresh Token)
Access token bitdikdə (401 aldıqda) Axios interceptor vasitəsilə avtomatik çağırın:
* **Endpoint:** `POST /api/auth/refresh-token`
* **Body:** `{ "accessToken": "köhnə_access_token", "refreshToken": "mövcud_refresh_token" }`

---

## 3. Public (Açıq / Anonim) Endpoint-lər

Bütün bu endpoint-lər heç bir token tələb etmir:

* `GET /api/public/categories?lang=az` — Bütün kateqoriyalar, onların alt-bölmələri və xidmətləri ağac şəklində (Baş menyu üçün).
* `GET /api/public/categories/{slug}` — Seçilmiş kateqoriya.
* `GET /api/public/services/{slug}` — Prosedurun tam tibbi izahı (hazırlıq, mərhələlər, nəticə) və onu təklif edən klinikalar + qiymətlər ("starting from...").
* `GET /api/public/services/most-searched` — Ana səhifədə ən çox axtarılan prosedurlar.
* `GET /api/public/packages` — "All-in-one" paketlər (Əməliyyat + 5* Otel + Transferlər).
* `GET /api/public/clinics` — Bütün tərəfdaş klinikalar (loqo, şəhər, həkim sayı).
* `GET /api/public/clinics/{slug}` — Klinikanın profili, həkimləri, rəyləri və xidmətləri.
* `GET /api/public/doctors` & `GET /api/public/doctors/{id}` — Həkimlərin profili və təcrübəsi.
* `GET /api/public/search?q=knee` — Prosedur və simptomlar üzrə qlobal axtarış.
* `GET /api/public/pages/about-us` — Dinamik "Haqqımızda" səhifəsi.
* `GET /api/public/pages/how-it-works` — "Necə İşləyir?" bələdçisi.
* `GET /api/public/faq` — Tez-tez verilən suallar.
* `GET /api/public/partners` — İnstitusional tərəfdaşlar (Səhiyyə Nazirliyi, Zaqreb Şəhər İcra Hakimiyyəti, Croatia Airlines və s.).
* `POST /api/public/contact` — Əlaqə formasının göndərilməsi.
* `POST /api/public/newsletter` — Bülletenə abunəlik.
* `POST /api/public/reviews` — Pasient rəyinin göndərilməsi.

---

## 4. Pasient Şəxsi Kabineti (`/api/patient/*`)

Header: `Authorization: Bearer {token}` (Yalnız `Patient` rolu)

### 4.1 Yeni Müraciət Göndərmək (Inquiry)
* **Endpoint:** `POST /api/patient/inquiries`
* **Content-Type:** `multipart/form-data`
* **Sahələr:**
  * `MedicalServiceId` (Guid, opsional)
  * `Symptoms` (string, mütləq) — Pasientin şikayətləri
  * `Description` (string, opsional)
  * `PreferredTimeframe` (string) — məs: "Gələn ayın əvvəli"
  * `NeedsAccommodation` (boolean) — Otel lazımdırmı?
  * `NeedsAirportTransfer` (boolean) — Transfer lazımdırmı?
  * `NeedsAirplaneTicket` (boolean) — Təyyarə bileti lazımdırmı?
  * `documents` (Fayl massivi) — Rentgen, MRT, analiz sənədləri (PDF, JPG, PNG, DICOM, ZIP; max 20 MB/fayl).

### 4.2 Müraciətlərim və Təkliflərin İzlənməsi
* `GET /api/patient/inquiries?status=1&page=1&pageSize=10` — Müraciətlərimin siyahısı.
* `GET /api/patient/inquiries/{id}` — Müraciətin tam detalları, sənədlər və gələn təkliflər.
* `POST /api/patient/inquiries/{id}/documents` — Əlavə sənəd yükləmək.
* `DELETE /api/patient/inquiries/{id}/documents/{docId}` — Sənədi silmək.
* `GET /api/patient/inquiries/{id}/documents/{docId}/download` — Tibbi sənədi təhlükəsiz yükləmək (PDF/şəkil browserdə açılır).

### 4.3 Təkliflərin Qəbul / İmtina Edilməsi
* `GET /api/patient/inquiries/{id}/offers` — Bu müraciətə klinikalar tərəfindən göndərilmiş rəsmi qiymət təklifləri.
  * Təklifdə müalicə, otel, transfer və bilet qiyməti ayrı-ayrı və cəm şəkildə göstərilir.
* `POST /api/patient/offers/{offerId}/accept` — Təklifi qəbul etmək. Digər təkliflər avtomatik imtina statusuna keçir, koordinator və klinika xəbərdar edilir.
* `POST /api/patient/offers/{offerId}/decline` — Təklifdən imtina etmək.

### 4.4 Koordinator və Həkimlə Çat Yazışması
* `GET /api/patient/inquiries/{id}/messages` — Çat mesajları tarixçəsi.
* `POST /api/patient/inquiries/{id}/messages` — Yeni mesaj göndərmək (`{ "body": "Mətn" }`).

---

## 5. Başlanğıc Test Hesabları

Verilənlər bazası işə düşərkən sistem tərəfindən avtomatik olaraq ilkin demo hesablar yaradılır:

| Rol | E-poçt | Şifrə | Təyinatı |
|---|---|---|---|
| **Admin** | `admin@altensorglobalhealthcare.com` | `Admin123!` | Tam sistem nəzarəti |
| **Coordinator** | `coordinator@altensorglobalhealthcare.com` | `Coordinator123!` | Pasient koordinatoru (Ivana) |
| **Doctor** | `dr.marko@altensorglobalhealthcare.com` | `Doctor123!` | Patela klinikasının aparıcı ortopedi |
| **Doctor** | `dr.ana@altensorglobalhealthcare.com` | `Doctor123!` | Sinteza klinikasının plastik cərrahı |

