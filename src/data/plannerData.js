export const PLANNER_STEPS = [
  { number: 1, key: 'treatment', label: 'Treatment' },
  { number: 2, key: 'details', label: 'Details' },
  { number: 3, key: 'about', label: 'About You' },
  { number: 4, key: 'health', label: 'Health Info' },
  { number: 5, key: 'files', label: 'Photos & Files' },
  { number: 6, key: 'plan', label: 'Plan & Price' },
  { number: 7, key: 'contact', label: 'Contact Info' },
  { number: 8, key: 'agreement', label: 'Agreement' },
  { number: 9, key: 'done', label: 'Confirmed' },
]

export const TREATMENT_CATEGORIES = [
  {
    id: 'hair-transplant',
    title: 'Hair Transplant',
    description: 'FUE, Sapphire FUE and DHI hair restoration in Baku.',
  },
  {
    id: 'dental',
    title: 'Dental Treatments',
    description: 'Implants, All-on-4/6, crowns and root canal: mark exactly what you need.',
  },
  {
    id: 'cosmetic',
    title: 'Cosmetic Surgery',
    description: 'Body, breast and facial procedures at authorised hospitals in Baku.',
  },
  {
    id: 'eye',
    title: 'Eye Treatments',
    description: 'LASIK, SMILE, ICL and cataract surgery.',
  },
  {
    id: 'weight-loss',
    title: 'Weight Loss Surgery',
    description: 'Sleeve gastrectomy, gastric bypass and gastric balloon.',
  },
  {
    id: 'ivf',
    title: 'IVF Treatment',
    description: 'IVF cycles and PGT/PGD genetic screening in Baku.',
  },
  {
    id: 'checkup',
    title: 'Check-up',
    description: 'Comprehensive health screening packages with specialist review in Baku.',
  },
]

export const PREFERRED_CITIES = [
  { id: 'baku', label: 'Baku' },
]

export const HOSPITAL_PREFERENCES = [
  {
    id: 'premium',
    label: 'Premium hospital',
    description: 'A premium private hospital.',
  },
  {
    id: 'standard',
    label: 'Standard',
    description: 'A more affordable hospital or clinic.',
  },
  {
    id: 'no-preference',
    label: 'No preference',
    description: "We'll propose what best suits your needs.",
  },
]

export const HAIR_GRAFTS = [
  { id: 'up-to-2000', label: 'Up to 2,000 grafts', densityLevel: 1 },
  { id: '2000-3500', label: '2,000 – 3,500 grafts', densityLevel: 2 },
  { id: '3500-5000', label: '3,500 – 5,000 grafts', densityLevel: 3 },
  { id: '5000-plus', label: '5,000+ grafts (mega session)', densityLevel: 4 },
]

export const HAIR_TECHNIQUES = [
  {
    id: 'fue',
    label: 'FUE (Follicular Unit Extraction)',
    description:
      'Individual hair follicles are removed one by one and re-implanted into thinning areas. Leaves no linear scar.',
  },
  {
    id: 'sapphire-fue',
    label: 'Sapphire FUE',
    description:
      'FUE using sapphire-tipped blades for the recipient sites: finer incisions allow closer graft placement and typically faster healing.',
  },
  {
    id: 'dhi',
    label: 'DHI (Direct Hair Implantation)',
    description:
      'Follicles are placed directly into the scalp using a Choi implanter pen, often without shaving the recipient area.',
  },
  {
    id: 'beard-eyebrow',
    label: 'Beard / Eyebrow Transplant',
    description:
      'Hair follicles taken from the back of the scalp are transplanted to fill gaps in the beard or eyebrows.',
  },
]

export const DENTAL_TREATMENT_TYPES = [
  {
    id: 'implant',
    label: 'Implant',
    color: '#3665f6',
    bgLight: '#eef3ff',
    borderColor: '#3665f6',
    description:
      'A titanium post is placed in the jawbone to replace a missing tooth root, then topped with a crown once healed.',
  },
  {
    id: 'zirconia',
    label: 'Zirconia',
    color: '#2e8b57',
    bgLight: '#eaf7ef',
    borderColor: '#2e8b57',
    description:
      'A very strong, tooth-coloured cap that fully covers a damaged tooth or implant. Durable, good for back teeth.',
  },
  {
    id: 'emax',
    label: 'E-max',
    color: '#0d9488',
    bgLight: '#e6f7f5',
    borderColor: '#0d9488',
    description:
      'A translucent ceramic crown prized for looking the most natural, often chosen for front, visible teeth.',
  },
  {
    id: 'porcelain',
    label: 'Porcelain',
    color: '#7fbb58',
    bgLight: '#f1f9eb',
    borderColor: '#7fbb58',
    description:
      'A tooth-coloured cap over a metal or ceramic base, a well-established, lower-cost crown option.',
  },
  {
    id: 'root-canal',
    label: 'Root Canal',
    color: '#ea580c',
    bgLight: '#fff2eb',
    borderColor: '#ea580c',
    description:
      'Removes infected/damaged pulp from inside the tooth and seals it, saving a tooth that would otherwise need extraction.',
  },
]

export const UPPER_JAW_TEETH = [
  '18', '17', '16', '15', '14', '13', '12', '11',
  '21', '22', '23', '24', '25', '26', '27', '28',
]

export const LOWER_JAW_TEETH = [
  '48', '47', '46', '45', '44', '43', '42', '41',
  '31', '32', '33', '34', '35', '36', '37', '38',
]

export const COSMETIC_PROCEDURES = [
  'Liposuction',
  'Tummy Tuck',
  'Brazilian Butt Lift (BBL)',
  'Rhinoplasty',
  'Breast Augmentation',
  'Breast Lift',
  'Breast Reduction',
  'Facelift',
  'Otoplasty (Ear Reshaping)',
  'Gynecomastia (Male Chest)',
]

export const EYE_PROCEDURES = [
  {
    id: 'lasik',
    label: 'LASIK',
    description:
      'A flap is created in the cornea and reshaped with a laser to correct vision. Fast recovery, the most common laser eye surgery.',
  },
  {
    id: 'smile',
    label: 'SMILE',
    description:
      'A newer, flapless laser technique: corneal tissue is removed through a small opening, which some patients find more comfortable to recover from.',
  },
  {
    id: 'icl',
    label: 'ICL (Implantable Contact Lens)',
    description:
      'A corrective lens is implanted inside the eye rather than reshaping the cornea, an option for higher prescriptions or thin corneas not suitable for laser.',
  },
  {
    id: 'cataract',
    label: 'Cataract Surgery',
    description:
      "The eye's clouded natural lens is removed and replaced with a clear artificial lens.",
  },
]

export const WEIGHT_LOSS_PROCEDURES = [
  'Sleeve Gastrectomy',
  'Gastric Bypass',
  'Mini Gastric Bypass',
  'Gastric Balloon',
]

export const IVF_CYCLES = ['1 IVF Cycle', '2 IVF Cycles', '3 IVF Cycles']

export const CHECKUP_PACKAGES = [
  {
    id: 'executive-male',
    label: 'Executive Male Check-up',
    description: 'Comprehensive cardiovascular, metabolic, prostate and full blood panel.',
  },
  {
    id: 'executive-female',
    label: 'Executive Female Check-up',
    description: 'Full blood work, thyroid, breast/pelvic screening and specialist review.',
  },
  {
    id: 'cardio-checkup',
    label: 'Cardiology & Vascular Screening',
    description: 'ECG, echocardiography, stress test and lipid profile.',
  },
  {
    id: 'full-body-vip',
    label: 'VIP Full-Body Oncology & MRI Screening',
    description: 'Whole-body MRI, tumour markers and multi-disciplinary specialist review.',
  },
]

export const COMMON_CONDITIONS = [
  'Diabetes',
  'High blood pressure',
  'Heart disease',
  'Thyroid disorder',
  'Asthma / COPD',
  'Kidney disease',
  'Blood clotting disorder',
  'None of the above',
]

export const COSMETIC_HEALTH_FLAGS = [
  'Currently taking blood thinners',
  'History of keloid / abnormal scarring',
  'Significant weight change in the last 6 months',
  'None of the above',
]

export const WEIGHT_RELATED_CONDITIONS = [
  'Type 2 diabetes',
  'Sleep apnoea',
  'Joint pain / mobility issues',
  'None of the above',
]

export const TREATMENT_TIMELINES = {
  'hair-transplant': [
    { step: '1. Consultation', duration: 'Online', detail: 'Photo review and graft estimate by the medical team.' },
    { step: '2. Arrival & Pre-Op', duration: '1 day', detail: 'Blood tests, hairline design and consultation.' },
    { step: '3. Procedure Day', duration: '6–8 hours', detail: 'Local anaesthesia, extraction and graft implantation.' },
    { step: '4. First Wash & Departure', duration: '1–2 days', detail: 'Post-op check, first medical wash and aftercare kit.' },
  ],
  dental: [
    { step: '1. Photo & X-ray Review', duration: 'Online', detail: 'Dentist reviews your dental chart, photos or panoramic X-ray.' },
    { step: '2. Single Visit', duration: '5–7 days', detail: 'Crowns, veneers, root canals or initial implant placement.' },
    { step: '3. Two-Visit Path', duration: '3–6 months apart', detail: 'Final crowns placed on healed implants during your second visit.' },
  ],
  cosmetic: [
    { step: '1. Consultation', duration: 'Online', detail: 'Surgeon assesses your goals and medical history.' },
    { step: '2. Arrival & Pre-Op', duration: '1 day', detail: 'In-person exam, blood tests and anaesthesia clearance.' },
    { step: '3. Surgery Day', duration: '1–3 days', detail: 'Procedure performed at an authorised private hospital.' },
    { step: '4. Recovery', duration: '4–7 days', detail: 'Post-op monitoring and fit-to-fly clearance.' },
    { step: '5. Follow-up', duration: 'Online', detail: 'Scheduled remote check-ins with your care coordinator.' },
  ],
  eye: [
    { step: '1. Screening', duration: 'Online', detail: 'Review of your prescription and eye health history.' },
    { step: '2. Arrival & Exam', duration: '1 day', detail: 'Corneal topography and specialist suitability tests.' },
    { step: '3. Laser / Lens Procedure', duration: '30–60 min', detail: 'Quick outpatient procedure with local anaesthetic drops.' },
    { step: '4. Next-Day Check', duration: '1–2 days', detail: 'Post-op vision check before flying home.' },
  ],
  'weight-loss': [
    { step: '1. Evaluation', duration: 'Online', detail: 'BMI, metabolic profile and surgical eligibility review.' },
    { step: '2. Pre-Op Tests', duration: '1 day', detail: 'Endoscopy, blood panel and multi-disciplinary clearance.' },
    { step: '3. Surgery', duration: '2–3 days', detail: 'Laparoscopic procedure and hospital inpatient care.' },
    { step: '4. Recovery', duration: '3–4 days', detail: 'Leak test, nutritionist briefing and discharge.' },
    { step: '5. Follow-up', duration: '12 months online', detail: 'Ongoing dietitian and medical check-ins.' },
  ],
  ivf: [
    { step: '1. Consultation', duration: 'Online', detail: 'Fertility specialist reviews hormone results and history.' },
    { step: '2. Ovarian Stimulation', duration: '10–12 days', detail: 'Medication protocol and ultrasound monitoring.' },
    { step: '3. Egg Retrieval & Fertilisation', duration: '1 day', detail: 'Collection and laboratory fertilisation (plus optional PGT).' },
    { step: '4. Embryo Transfer', duration: '1 day', detail: 'Painless transfer procedure under ultrasound guidance.' },
    { step: '5. Follow-up', duration: '10–14 days later', detail: 'Beta-hCG blood test and specialist guidance.' },
  ],
  checkup: [
    { step: '1. Pre-Screening', duration: 'Online', detail: 'Tailoring the check-up panel to your age and history.' },
    { step: '2. Morning Diagnostics', duration: 'Half day', detail: 'Fasting blood work, imaging and specialist exams.' },
    { step: '3. Results & Review', duration: '1–2 days', detail: 'Comprehensive medical report and doctor consultation.' },
  ],
}

export const PROPOSAL_EXCLUSIONS = [
  'Flights to and from Baku, which you book yourself',
  'Accommodation and transfers, which you arrange yourself unless the hospital includes them in its own price',
  'Travel and medical travel insurance',
  'Visa fees, if your nationality requires a visa',
  'Additional treatments, tests or procedures the doctor recommends after examining you',
  'Extra costs if a complication or slower recovery means you need further treatment or a longer stay (for example extra hotel nights or flight changes)',
  'Personal expenses such as restaurant meals, shopping and sightseeing',
]

export const COUNTRY_CODES = [
  { flag: '🇦🇿', code: '+994', name: 'Azerbaijan' },
  { flag: '🇬🇧', code: '+44', name: 'United Kingdom' },
  { flag: '🇺🇸', code: '+1', name: 'United States / Canada' },
  { flag: '🇹🇷', code: '+90', name: 'Türkiye' },
  { flag: '🇭🇷', code: '+385', name: 'Croatia' },
  { flag: '🇩🇪', code: '+49', name: 'Germany' },
  { flag: '🇫🇷', code: '+33', name: 'France' },
  { flag: '🇳🇱', code: '+31', name: 'Netherlands' },
  { flag: '🇮🇪', code: '+353', name: 'Ireland' },
  { flag: '🇦🇪', code: '+971', name: 'United Arab Emirates' },
  { flag: '🇸🇦', code: '+966', name: 'Saudi Arabia' },
  { flag: '🇦🇺', code: '+61', name: 'Australia' },
  { flag: '🇨🇭', code: '+41', name: 'Switzerland' },
  { flag: '🇮🇹', code: '+39', name: 'Italy' },
  { flag: '🇪🇸', code: '+34', name: 'Spain' },
  { flag: '🇦🇹', code: '+43', name: 'Austria' },
  { flag: '🇧🇪', code: '+32', name: 'Belgium' },
  { flag: '🇸🇪', code: '+46', name: 'Sweden' },
  { flag: '🇳🇴', code: '+47', name: 'Norway' },
  { flag: '🇩🇰', code: '+45', name: 'Denmark' },
]

export const APPLICATION_TERMS_SECTIONS = [
  {
    title: '1. Role of Altensor Healthcare',
    body: 'Altensor Healthcare acts as an independent medical travel coordinator connecting you with licensed partner hospitals and clinics. Medical opinions, diagnoses, and treatments are provided solely by the treating physicians and accredited healthcare facilities.',
  },
  {
    title: '2. Free Treatment Proposal & Pricing',
    body: 'Submitting this application is completely free and places you under no obligation. After reviewing your request, partner clinics provide a tailored Treatment Proposal detailing the hospital price, our Patient Coordination Fee (if applicable), and the total.',
  },
  {
    title: '3. Medical Accuracy & Suitability',
    body: 'Final treatment suitability, graft counts, dental plans, or surgical techniques can only be confirmed in person after clinical examination and diagnostic tests by the treating doctor.',
  },
  {
    title: '4. Travel, Complications & Insurance',
    body: 'Unless explicitly stated in writing inside your accepted hospital package, flights, visas, accommodation, transfers, and comprehensive medical travel insurance remain your responsibility.',
  },
  {
    title: '5. Data Protection & Privacy',
    body: 'Your personal and special-category health data are processed strictly to coordinate your medical assessment with partner clinics and are handled in accordance with applicable data protection regulations.',
  },
]
