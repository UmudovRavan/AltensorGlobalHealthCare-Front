export const SERVICE_CATEGORIES = [
  {
    slug: 'all-in-one-packages',
    name: 'All-in-one packages',
    subcategories: [
      { name: 'Dentistry', slug: 'dentistry' },
      { name: 'Plastic surgery', slug: 'plastic-surgery' },
      { name: 'Orthopaedics', slug: 'orthopaedics' },
      { name: 'Internal medicine', slug: 'internal-medicine' },
    ],
    featuredProcedures: [
      {
        name: 'All-in-One Dental Implant Package',
        slug: 'dental-implant-package',
        subSlug: 'dentistry',
        price: 'Starting from €2,400',
      },
      {
        name: 'All-in-One Complete Check-Up Package',
        slug: 'complete-checkup-package',
        subSlug: 'internal-medicine',
        price: 'Starting from €1,150',
      },
      {
        name: 'All-in-One Orthopaedic Surgery Package',
        slug: 'orthopaedic-surgery-package',
        subSlug: 'orthopaedics',
        price: 'Starting from €9,500',
      },
    ],
    description:
      'Complete medical travel packages combining clinical procedures, flights with partner airlines, hotel accommodation, and airport transfers.',
  },
  {
    slug: 'orthopaedics',
    name: 'Orthopaedics',
    featured: true,
    subcategories: [
      { name: 'Shoulder', slug: 'shoulder' },
      { name: 'Hip', slug: 'hip' },
      { name: 'Knee', slug: 'knee' },
      { name: 'Foot', slug: 'foot' },
      { name: 'Joints', slug: 'joints' },
      { name: 'Examination', slug: 'examination' },
      { name: 'Ligaments', slug: 'ligaments' },
      { name: 'Biopsy', slug: 'biopsy' },
      { name: 'Regenerative medicine', slug: 'regenerative-medicine' },
    ],
    featuredProcedures: [
      {
        name: 'Shoulder prosthesis',
        slug: 'shoulder-prosthesis',
        subSlug: 'shoulder',
        price: 'Starting from €8,500',
      },
      {
        name: 'Total hip endoprosthesis - TEP',
        slug: 'total-hip-endoprosthesis-tep',
        subSlug: 'hip',
        price: 'Starting from €9,000',
      },
      {
        name: 'Total knee replacement (TEP)',
        slug: 'total-knee-replacement-tep',
        subSlug: 'knee',
        price: 'Starting from €9,200',
      },
    ],
    description:
      'Minimally invasive joint replacement, arthroscopy, sports injury reconstruction, and comprehensive orthopaedic diagnostics.',
  },
  {
    slug: 'plastic-surgery',
    name: 'Plastic surgery',
    featured: true,
    subcategories: [
      { name: 'Face', slug: 'face' },
      { name: 'Breasts', slug: 'breasts' },
      { name: 'Body', slug: 'body' },
      { name: 'Hair', slug: 'hair' },
      { name: 'Minor procedures', slug: 'minor-procedures' },
      { name: 'Laser center', slug: 'laser-center' },
      { name: 'Nose', slug: 'nose' },
      { name: 'Examination', slug: 'examination' },
    ],
    featuredProcedures: [
      {
        name: 'Nose surgery (rhinoplasty)',
        slug: 'nose-surgery-rhinoplasty',
        subSlug: 'nose',
        price: 'Starting from €3,200',
      },
      {
        name: 'Eyelid surgery (blepharoplasty)',
        slug: 'eyelid-surgery-blepharoplasty',
        subSlug: 'face',
        price: 'Starting from €1,800',
      },
      {
        name: 'Breast augmentation',
        slug: 'breast-augmentation',
        subSlug: 'breasts',
        price: 'Starting from €3,900',
      },
    ],
    description:
      'Aesthetic and reconstructive procedures performed by board-certified surgeons using modern techniques and personalized care.',
  },
  {
    slug: 'dentistry',
    name: 'Dentistry',
    featured: true,
    subcategories: [
      { name: 'Dental implants', slug: 'dental-implants' },
      { name: 'Aesthetic dentistry', slug: 'aesthetic-dentistry' },
      { name: 'General dentistry', slug: 'general-dentistry' },
      { name: 'Prosthetics', slug: 'prosthetics' },
      { name: 'Laser center', slug: 'laser-center' },
      { name: 'Examination', slug: 'examination' },
    ],
    featuredProcedures: [
      {
        name: 'All on 4',
        slug: 'all-on-4',
        subSlug: 'dental-implants',
        price: 'Starting from €5,500',
      },
      {
        name: 'Dental implants',
        slug: 'dental-implants-procedure',
        subSlug: 'dental-implants',
        price: 'Starting from €750',
      },
      {
        name: 'Veneers',
        slug: 'veneers',
        subSlug: 'aesthetic-dentistry',
        price: 'Starting from €350',
      },
    ],
    description:
      'Digital implantology, ceramic veneers, All-on-4 restorations, and full-mouth aesthetic dental rehabilitation.',
  },
  {
    slug: 'dermatology',
    name: 'Dermatology',
    featured: true,
    subcategories: [
      { name: 'Anti-ageing dermatology', slug: 'anti-ageing-dermatology' },
      { name: 'Medical dermatology', slug: 'medical-dermatology' },
      { name: 'Laser center', slug: 'laser-center' },
      { name: 'Psoriasis and neurodermatitis', slug: 'psoriasis-and-neurodermatitis' },
      { name: 'Examination', slug: 'examination' },
    ],
    featuredProcedures: [
      {
        name: 'PRP treatment',
        slug: 'prp-treatment',
        subSlug: 'anti-ageing-dermatology',
        price: 'Starting from €280',
      },
      {
        name: 'Dermal fillers',
        slug: 'dermal-fillers',
        subSlug: 'anti-ageing-dermatology',
        price: 'Starting from €320',
      },
      {
        name: 'Dermatological examination',
        slug: 'dermatological-examination',
        subSlug: 'examination',
        price: 'Starting from €70',
      },
    ],
    description:
      'Clinical skin diagnostics, laser dermatology, mole mapping, and non-invasive anti-ageing aesthetic protocols.',
  },
  {
    slug: 'gynecology',
    name: 'Gynecology',
    subcategories: [
      { name: 'Examinations', slug: 'examinations' },
      { name: 'Laparoscopy', slug: 'laparoscopy' },
    ],
    featuredProcedures: [
      {
        name: 'Gynecological examination & ultrasound',
        slug: 'gynecological-examination',
        subSlug: 'examinations',
        price: 'Starting from €95',
      },
      {
        name: 'Diagnostic & operative laparoscopy',
        slug: 'laparoscopy-procedure',
        subSlug: 'laparoscopy',
        price: 'Starting from €2,100',
      },
    ],
    description: 'Preventive women’s healthcare, minimally invasive gynecological surgery, and specialist diagnostics.',
  },
  {
    slug: 'oncology',
    name: 'Oncology',
    subcategories: [
      { name: 'Examinations', slug: 'examinations' },
      { name: 'Medical therapy', slug: 'medical-therapy' },
    ],
    featuredProcedures: [
      {
        name: 'Oncological second opinion & consultation',
        slug: 'oncological-consultation',
        subSlug: 'examinations',
        price: 'Starting from €150',
      },
      {
        name: 'Targeted medical therapy protocol',
        slug: 'medical-therapy-protocol',
        subSlug: 'medical-therapy',
        price: 'Upon evaluation',
      },
    ],
    description: 'Multidisciplinary oncology consultations, second opinions, and personalized medical therapy.',
  },
  {
    slug: 'radiology',
    name: 'Radiology',
    featured: true,
    subcategories: [
      { name: 'CT Diagnosis', slug: 'ct-diagnosis' },
      { name: 'RTG Diagnosis', slug: 'rtg-diagnosis' },
      { name: 'MR Diagnosis', slug: 'mr-diagnosis' },
      { name: 'Ultrasound diagnosis', slug: 'ultrasound-diagnosis' },
    ],
    featuredProcedures: [
      {
        name: 'MSCT of the spine',
        slug: 'msct-of-the-spine',
        subSlug: 'ct-diagnosis',
        price: 'Starting from €190',
      },
      {
        name: 'MRI of the abdomen',
        slug: 'mri-of-the-abdomen',
        subSlug: 'mr-diagnosis',
        price: 'Starting from €280',
      },
      {
        name: 'Ultrasound',
        slug: 'ultrasound',
        subSlug: 'ultrasound-diagnosis',
        price: 'Starting from €65',
      },
    ],
    description:
      'High-resolution 3T MRI, multi-slice CT, digital X-ray, and specialist ultrasound imaging with rapid reporting.',
  },
  {
    slug: 'cosmetology',
    name: 'Cosmetology',
    subcategories: [
      { name: 'Face', slug: 'face' },
      { name: 'Body', slug: 'body' },
      { name: 'Laser center', slug: 'laser-center' },
      { name: 'Examination', slug: 'examination' },
    ],
    featuredProcedures: [
      {
        name: 'Laser skin rejuvenation',
        slug: 'laser-skin-rejuvenation',
        subSlug: 'laser-center',
        price: 'Starting from €240',
      },
      {
        name: 'Body contouring protocol',
        slug: 'body-contouring',
        subSlug: 'body',
        price: 'Starting from €300',
      },
    ],
    description: 'Medical-grade facial treatments, body sculpting, and advanced laser aesthetic care.',
  },
  {
    slug: 'internal-medicine',
    name: 'Internal medicine',
    featured: true,
    subcategories: [
      { name: 'General internal', slug: 'general-internal' },
      { name: "Women's Health Checkups", slug: 'womens-health-checkups' },
      { name: "Men's Health Checkups", slug: 'mens-health-checkups' },
      { name: 'Gastroenterology', slug: 'gastroenterology' },
      { name: 'Endocrinology', slug: 'endocrinology' },
      { name: 'Cardiology', slug: 'cardiology' },
      { name: 'Examinations', slug: 'examinations' },
      { name: 'Nephrology', slug: 'nephrology' },
    ],
    featuredProcedures: [
      {
        name: "Anesthesiologist's examination",
        slug: 'anesthesiologists-examination',
        subSlug: 'examinations',
        price: 'Starting from €85',
      },
      {
        name: 'Cardiologist examination and ECG',
        slug: 'cardiologist-examination-and-ecg',
        subSlug: 'cardiology',
        price: 'Starting from €110',
      },
      {
        name: 'Complete body check up',
        slug: 'complete-body-check-up',
        subSlug: 'general-internal',
        price: 'Starting from €590',
      },
    ],
    description:
      'Preventive executive check-ups, cardiology, gastroenterology, endocrinology, and internal diagnostics in a single day.',
  },
  {
    slug: 'interventional-radiology',
    name: 'Interventional radiology',
    subcategories: [
      { name: 'Ablation', slug: 'ablation' },
      { name: 'Biopsy', slug: 'biopsy' },
      { name: 'Embolization', slug: 'embolization' },
      { name: 'Infiltration', slug: 'infiltration' },
      { name: 'Spine treatment', slug: 'spine-treatment' },
    ],
    featuredProcedures: [
      {
        name: 'Minimally invasive spine treatment',
        slug: 'spine-treatment-procedure',
        subSlug: 'spine-treatment',
        price: 'Starting from €1,800',
      },
    ],
    description: 'Image-guided minimally invasive procedures for pain relief, spine therapy, and targeted diagnostics.',
  },
  {
    slug: 'pediatrics',
    name: 'Pediatrics',
    subcategories: [
      { name: 'General pediatrics', slug: 'general-pediatrics' },
      { name: 'Neuropediatrics', slug: 'neuropediatrics' },
      { name: "Children's otolaryngology", slug: 'childrens-otolaryngology' },
      { name: "Children's allergology and immunology", slug: 'childrens-allergology' },
      { name: "Children's cardiology", slug: 'childrens-cardiology' },
      { name: "Children's ophthalmology", slug: 'childrens-ophthalmology' },
      { name: "Children's orthopedics", slug: 'childrens-orthopedics' },
      { name: "Children's pulmonology", slug: 'childrens-pulmonology' },
      { name: "Children's radiology", slug: 'childrens-radiology' },
      { name: 'Child psychology', slug: 'child-psychology' },
      { name: "Children's speech therapy", slug: 'childrens-speech-therapy' },
      { name: 'Child and adolescent psychiatry', slug: 'child-psychiatry' },
      { name: 'Neonatology office', slug: 'neonatology' },
    ],
    featuredProcedures: [
      {
        name: 'Neuropediatric specialist evaluation',
        slug: 'neuropediatric-evaluation',
        subSlug: 'neuropediatrics',
        price: 'Starting from €120',
      },
    ],
    description: 'Comprehensive pediatric care across 13 subspecialties led by experienced child health specialists.',
  },
  {
    slug: 'orthodontics',
    name: 'Orthodontics',
    subcategories: [
      { name: 'Fixed braces', slug: 'fixed-braces' },
      { name: 'Clear Aligners', slug: 'clear-aligners' },
      { name: 'Bite correction', slug: 'bite-correction' },
      { name: 'Crowded teeth', slug: 'crowded-teeth' },
      { name: 'Gap between teeth', slug: 'gap-between-teeth' },
      { name: 'Protruding teeth', slug: 'protruding-teeth' },
      { name: 'Examination', slug: 'examination' },
    ],
    featuredProcedures: [
      {
        name: 'Digital Aligner Treatment Planning',
        slug: 'digital-aligner-treatment-planning',
        subSlug: 'clear-aligners',
        price: 'Starting from €2,200',
      },
    ],
    description: 'Clear aligners, fixed ceramic and metal braces, and 3D digital orthodontic planning.',
  },
  {
    slug: 'physical-therapy-and-rehabilitation',
    name: 'Physical therapy and rehabilitation',
    subcategories: [
      { name: 'Physical therapy', slug: 'physical-therapy' },
      { name: 'Examinations', slug: 'examinations' },
      { name: 'Manual Therapies', slug: 'manual-therapies' },
    ],
    featuredProcedures: [
      {
        name: 'Post-operative orthopaedic rehabilitation',
        slug: 'post-op-rehabilitation',
        subSlug: 'physical-therapy',
        price: 'Starting from €90',
      },
    ],
    description: 'Personalized physiotherapy, manual therapy, and post-surgical recovery programs.',
  },
  {
    slug: 'regenerative-medicine',
    name: 'Regenerative medicine',
    subcategories: [
      { name: 'Stem Cells', slug: 'stem-cells' },
      { name: 'Fat Transfer', slug: 'fat-transfer' },
      { name: 'Exosome therapy', slug: 'exosome-therapy' },
    ],
    featuredProcedures: [
      {
        name: 'Stem cell joint regeneration',
        slug: 'stem-cell-joint-regeneration',
        subSlug: 'stem-cells',
        price: 'Starting from €2,900',
      },
    ],
    description: 'Cutting-edge stem cell, adipose transfer, and exosome therapies for joints and tissue recovery.',
  },
  {
    slug: 'surgery',
    name: 'Surgery',
    subcategories: [{ name: 'Examinations', slug: 'examinations' }],
    featuredProcedures: [
      {
        name: 'General surgical consultation',
        slug: 'general-surgical-consultation',
        subSlug: 'examinations',
        price: 'Starting from €90',
      },
    ],
    description: 'Pre-operative evaluations and minimally invasive surgical interventions.',
  },
  {
    slug: 'infertility-treatment',
    name: 'Infertility treatment',
    subcategories: [
      { name: 'IVF procedures', slug: 'ivf-procedures' },
      { name: 'IVF examinations', slug: 'ivf-examinations' },
    ],
    featuredProcedures: [
      {
        name: 'Complete IVF treatment cycle',
        slug: 'complete-ivf-cycle',
        subSlug: 'ivf-procedures',
        price: 'Starting from €3,400',
      },
    ],
    description: 'Assisted reproduction, IVF diagnostics, and personalized fertility care.',
  },
  {
    slug: 'urology',
    name: 'Urology',
    subcategories: [
      { name: 'Circumcision', slug: 'circumcision' },
      { name: 'Surgery', slug: 'surgery' },
      { name: 'Examinations', slug: 'examinations' },
    ],
    featuredProcedures: [
      {
        name: 'Urological examination & ultrasound',
        slug: 'urological-examination',
        subSlug: 'examinations',
        price: 'Starting from €95',
      },
    ],
    description: 'Modern urological diagnostics, laser procedures, and outpatient surgical care.',
  },
  {
    slug: 'abdominal-surgery',
    name: 'Abdominal surgery',
    subcategories: [
      { name: 'Laparoscopy', slug: 'laparoscopy' },
      { name: 'Laser surgery', slug: 'laser-surgery' },
      { name: 'Open surgery', slug: 'open-surgery' },
    ],
    featuredProcedures: [
      {
        name: 'Laparoscopic umbilical hernia repair',
        slug: 'laparoscopic-umbilical-hernia-repair',
        subSlug: 'laparoscopy',
        price: 'Starting from €2,300',
      },
    ],
    description: 'Minimally invasive laparoscopic, laser, and abdominal hernia procedures.',
  },
  {
    slug: 'treatment-abroad',
    name: 'Treatment abroad',
    subcategories: [{ name: 'Austria', slug: 'austria' }],
    featuredProcedures: [
      {
        name: 'Cross-border specialist coordination (Austria)',
        slug: 'austria-coordination',
        subSlug: 'austria',
        price: 'Upon request',
      },
    ],
    description: 'Cross-border care coordination with partner European medical centers.',
  },
  {
    slug: 'vascular-surgery',
    name: 'Vascular surgery',
    subcategories: [
      { name: 'Endovenous laser', slug: 'endovenous-laser' },
      { name: 'Sclerosing', slug: 'sclerosing' },
    ],
    featuredProcedures: [
      {
        name: 'Endovenous laser vein treatment (EVLT)',
        slug: 'endovenous-laser-vein-treatment',
        subSlug: 'endovenous-laser',
        price: 'Starting from €1,350',
      },
    ],
    description: 'Minimally invasive laser and sclerotherapy solutions for varicose veins and vascular health.',
  },
]

export const HOME_FEATURED_SERVICES = SERVICE_CATEGORIES.filter((c) => c.featured)

