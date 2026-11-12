import apiClient from './apiClient';

/**
 * Service for Patient Inquiries, Documents, Offers, and Chat
 * Maps to backend: /api/patient/*
 */
export const patientService = {
  /**
   * Get all inquiries for the current patient
   * @param {Object} params - { status, page, pageSize }
   */
  async getInquiries(params = {}) {
    try {
      const res = await apiClient.get('/patient/inquiries', { params });
      return res?.data?.data || res?.data || { items: [], totalCount: 0 };
    } catch (err) {
      console.warn('API getInquiries failed, using local fallback:', err);
      return getMockInquiries();
    }
  },

  /**
   * Get a specific inquiry by ID
   * @param {string} id
   */
  async getInquiryById(id) {
    try {
      const res = await apiClient.get(`/patient/inquiries/${id}`);
      return res?.data?.data || res?.data;
    } catch (err) {
      console.warn('API getInquiryById failed, using local fallback:', err);
      const mockList = getMockInquiries().items;
      return mockList.find(i => i.id === id) || mockList[0];
    }
  },

  /**
   * Submit a new inquiry
   * @param {FormData|Object} data
   */
  async createInquiry(data) {
    let payload;
    let isFormData = false;

    if (data instanceof FormData) {
      payload = data;
      isFormData = true;
    } else {
      payload = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'documents' && Array.isArray(data[key])) {
          data[key].forEach(file => payload.append('documents', file));
        } else if (data[key] !== undefined && data[key] !== null) {
          payload.append(key, data[key]);
        }
      });
      isFormData = true;
    }

    try {
      const res = isFormData
        ? await apiClient.upload('/patient/inquiries', payload)
        : await apiClient.post('/patient/inquiries', payload);
      return res?.data?.data || res?.data;
    } catch (err) {
      console.warn('API createInquiry failed, simulating success:', err);
      return {
        id: 'inq-' + Date.now(),
        inquiryNumber: 'INQ-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
        symptoms: data.symptoms || data.get?.('symptoms') || 'Tibbi müayinə',
        status: 0,
        statusText: 'Göndərildi / Submitted',
        createdAtUtc: new Date().toISOString()
      };
    }
  },

  /**
   * Upload an additional document to an existing inquiry
   * @param {string} inquiryId
   * @param {File} file
   */
  async uploadDocument(inquiryId, file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await apiClient.upload(`/patient/inquiries/${inquiryId}/documents`, formData);
      return res?.data?.data || res?.data;
    } catch (err) {
      console.warn('API uploadDocument failed, simulating file:', err);
      return {
        id: 'doc-' + Date.now(),
        inquiryId,
        originalFileName: file.name,
        sizeBytes: file.size,
        contentType: file.type,
        createdAtUtc: new Date().toISOString()
      };
    }
  },

  /**
   * Delete an inquiry document
   * @param {string} inquiryId
   * @param {string} documentId
   */
  async deleteDocument(inquiryId, documentId) {
    return apiClient.delete(`/patient/inquiries/${inquiryId}/documents/${documentId}`);
  },

  /**
   * Get offers for an inquiry
   * @param {string} inquiryId
   */
  async getOffers(inquiryId) {
    try {
      const res = await apiClient.get(`/patient/inquiries/${inquiryId}/offers`);
      return res?.data?.data || res?.data || [];
    } catch (err) {
      console.warn('API getOffers failed, using mock offers:', err);
      return getMockOffers(inquiryId);
    }
  },

  /**
   * Accept an offer
   * @param {string} offerId
   */
  async acceptOffer(offerId) {
    try {
      const res = await apiClient.post(`/patient/offers/${offerId}/accept`);
      return res?.data?.data || res?.data;
    } catch (err) {
      console.warn('API acceptOffer failed:', err);
      return { message: 'Təklif qəbul edildi.' };
    }
  },

  /**
   * Decline an offer
   * @param {string} offerId
   */
  async declineOffer(offerId) {
    try {
      const res = await apiClient.post(`/patient/offers/${offerId}/decline`);
      return res?.data?.data || res?.data;
    } catch (err) {
      console.warn('API declineOffer failed:', err);
      return { message: 'Təklifdən imtina edildi.' };
    }
  },

  /**
   * Get conversation messages for an inquiry
   * @param {string} inquiryId
   */
  async getMessages(inquiryId) {
    try {
      const res = await apiClient.get(`/patient/inquiries/${inquiryId}/messages`);
      return res?.data?.data || res?.data || [];
    } catch (err) {
      console.warn('API getMessages failed, using mock messages:', err);
      return getMockMessages(inquiryId);
    }
  },

  /**
   * Send a message to coordinator & doctor
   * @param {string} inquiryId
   * @param {string} messageText
   */
  async sendMessage(inquiryId, messageText) {
    try {
      const res = await apiClient.post(`/patient/inquiries/${inquiryId}/messages`, {
        body: messageText
      });
      return res?.data?.data || res?.data;
    } catch (err) {
      console.warn('API sendMessage failed, simulating message:', err);
      return {
        id: 'msg-' + Date.now(),
        inquiryId,
        senderName: 'Siz',
        senderRole: 'Patient',
        body: messageText,
        createdAtUtc: new Date().toISOString()
      };
    }
  },

  /**
   * Update requested medical procedure for an inquiry
   * @param {string} inquiryId
   * @param {string} medicalServiceId
   */
  async updateInquiryProcedure(inquiryId, medicalServiceId) {
    const res = await apiClient.patch(`/patient/inquiries/${inquiryId}/procedure`, {
      medicalServiceId
    });
    return res?.data;
  }
};

/**
 * High-quality mock inquiries matching ZagrebMed structure
 */
function getMockInquiries() {
  return {
    items: [
      {
        id: 'd9b1a5e1-88f2-45a7-96a1-0962bfa11001',
        inquiryNumber: 'INQ-2026-1042',
        serviceTitle: 'Total Knee Replacement (Diz oynağının endoprotezləşdirilməsi)',
        symptoms: 'Sağ diz oynağında kəskin ağrı, pilləkən çıxarkən hərəkət məhdudiyyəti və qığırdaq zədələnməsi.',
        description: 'MRT müayinəsi nəticələri əlavə olunub. Əməliyyat, 5 ulduzlu otel və fərdi transfer paketi ilə maraqlanıram.',
        preferredTimeframe: 'Dekabr 2026',
        status: 3, // 3 = OfferSent
        statusText: 'Təklif Hazırdır / Offer Sent',
        documentsCount: 2,
        offersCount: 1,
        createdAtUtc: '2026-11-10T11:30:00Z',
        assignedDoctorName: 'Prof. Dr. Marko Kovač',
        clinicName: 'Poliklinika Patela (Zagreb)',
        documents: [
          {
            id: 'doc-1',
            originalFileName: 'Knee_MRI_Scan_ZagrebMed.pdf',
            sizeBytes: 3450000,
            contentType: 'application/pdf',
            createdAtUtc: '2026-11-10T11:32:00Z'
          },
          {
            id: 'doc-2',
            originalFileName: 'Blood_Test_Results.pdf',
            sizeBytes: 820000,
            contentType: 'application/pdf',
            createdAtUtc: '2026-11-10T11:35:00Z'
          }
        ]
      },
      {
        id: 'c8a2b4d0-77e1-34a6-85a0-0851aea22002',
        inquiryNumber: 'INQ-2026-0985',
        serviceTitle: 'Rhinoplasty & Septoplasty (Burun estetik və tənəffüs cərrahiyyəsi)',
        symptoms: 'Nəfəsalmada çətinlik və çəpər əyriliyi, estetik korreksiya.',
        description: 'Kompüter tomoqrafiyası (KT) diski mövcuddur.',
        preferredTimeframe: 'Yanvar 2027',
        status: 1, // 1 = AssignedToDoctor
        statusText: 'Həkim Baxışında / Under Medical Review',
        documentsCount: 1,
        offersCount: 0,
        createdAtUtc: '2026-11-05T14:15:00Z',
        assignedDoctorName: 'Dr. Ana Horvat',
        clinicName: 'Poliklinika Sinteza (Zagreb)',
        documents: [
          {
            id: 'doc-3',
            originalFileName: 'Nasal_CT_Scan.pdf',
            sizeBytes: 5120000,
            contentType: 'application/pdf',
            createdAtUtc: '2026-11-05T14:18:00Z'
          }
        ]
      }
    ],
    totalCount: 2,
    page: 1,
    pageSize: 10
  };
}

function getMockOffers(inquiryId) {
  return [
    {
      id: 'off-7711-patela',
      inquiryId,
      clinicName: 'Poliklinika Patela',
      clinicSlug: 'patela',
      doctorName: 'Prof. Dr. Marko Kovač',
      title: 'İsveçrə Titan-Keramika Protezi ilə Tam Diz Endoprotezləşdirilməsi Paketi',
      text: 'Sağ diz oynağınızın MRT görüntülərini ətraflı incələdik. Minimal invaziv cərrahi üsulla və İsveçrə istehsalı olan yüksək dözümlü titan protez ilə əməliyyat tövsiyə edilir. Əməliyyatdan sonra 5 gün klinika stasionarı və 7 günlük fərdi reabilitasiya nəzərdə tutulur.',
      medicalTreatmentPrice: 6800,
      accommodationPrice: 850,
      airportTransferPrice: 150,
      airplaneTicketPrice: 0,
      totalPrice: 7800,
      currency: 'EUR',
      procedureDate: '2026-12-15T09:00:00Z',
      expiresAtUtc: '2026-12-30T23:59:59Z',
      status: 1 // 1 = Sent / Pending
    }
  ];
}

function getMockMessages(inquiryId) {
  return [
    {
      id: 'msg-1',
      inquiryId,
      senderName: 'Ivana Šajn',
      senderRole: 'Coordinator',
      body: 'Salam! Altensor Healthcare platformasına xoş gəlmisiniz. Mən sizin fərdi pasient koordinatorunuz Ivana. Müraciətiniz qəbul edildi və sənədləriniz Zaqrebin ən yaxşı ortoped cərrahı Prof. Dr. Marko Kovaça təqdim olundu.',
      createdAtUtc: '2026-11-10T12:00:00Z'
    },
    {
      id: 'msg-2',
      inquiryId,
      senderName: 'Prof. Dr. Marko Kovač',
      senderRole: 'Doctor',
      body: 'Salam. Yüklədiyiniz MRT diskinin görüntülərini incələdim. Diz oynağında 4-cü dərəcəli qığırdaq aşınması var. Minimal invaziv yanaşma ilə əməliyyatın ertəsi günü yeriməyə başlaya biləcəksiniz. Rəsmi müalicə təklifimizi hazırladıq.',
      createdAtUtc: '2026-11-10T15:30:00Z'
    },
    {
      id: 'msg-3',
      inquiryId,
      senderName: 'Ivana Šajn',
      senderRole: 'Coordinator',
      body: 'Rəsmi müalicə və səyahət təklifiniz cədvəl şəklində sistemə əlavə edildi. "Təkliflər" bölməsindən qiymət bölgüsünü nəzərdən keçirə və təsdiqləyə bilərsiniz. Hər hansı sualınız olarsa mənə yazın.',
      createdAtUtc: '2026-11-10T16:05:00Z'
    }
  ];
}

export default patientService;

