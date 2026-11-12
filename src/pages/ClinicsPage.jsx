import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useUI } from '../hooks/useUI'
import { CLINICS } from '../data/clinics'
import { DOCTORS } from '../data/doctors'
import { apiClient } from '../services/apiClient'

function normalizeClinic(c, idx) {
  if (c.image && c.specialties && Array.isArray(c.services)) return c
  const fallback = CLINICS[idx % CLINICS.length] || CLINICS[0]
  const servicesList = Array.isArray(c.services) && c.services.length > 0
    ? c.services.map((s) => (typeof s === 'string' ? s : s?.title || s?.name)).filter(Boolean)
    : Array.isArray(c.specialties) && c.specialties.length > 0
      ? c.specialties
      : fallback.services || fallback.specialties || ['Medical Care']

  return {
    id: c.id,
    slug: c.slug || c.id,
    name: c.name || fallback.name,
    location: c.city ? `${c.city}, Croatia` : fallback.location,
    address: c.address || (c.city ? `${c.city}, Croatia` : fallback.address),
    summary: c.shortDescription || c.description || fallback.summary || fallback.description,
    description: c.description || fallback.description,
    fullDescription: c.description || fallback.fullDescription || fallback.description,
    image: c.coverImageUrl || c.logoUrl || fallback.image,
    logoUrl: c.logoUrl || '',
    specialties: c.specialties || servicesList,
    services: servicesList,
    accreditation: c.certificates || fallback.accreditation || 'ISO Certified',
    doctors: Array.isArray(c.doctors) ? c.doctors : null,
  }
}

export default function ClinicsPage() {
  const { slug } = useParams()
  const { openInquiry } = useUI()
  const [clinicsList, setClinicsList] = useState(CLINICS)
  const [doctorsList, setDoctorsList] = useState(DOCTORS)
  const [clinicDetail, setClinicDetail] = useState(null)
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    let ignore = false
    apiClient
      .get('/public/clinics')
      .then((res) => {
        if (ignore || !Array.isArray(res?.data) || res.data.length === 0) return
        setClinicsList(res.data.map((c, idx) => normalizeClinic(c, idx)))
      })
      .catch(() => {
        // Keep static CLINICS fallback
      })

    if (slug) {
      apiClient
        .get(`/public/clinics/${slug}`)
        .then((res) => {
          if (ignore || !res?.data) return
          setClinicDetail(normalizeClinic(res.data, 0))
        })
        .catch(() => {
          setClinicDetail(null)
        })
    } else {
      setClinicDetail(null)
    }

    apiClient
      .get('/public/doctors')
      .then((res) => {
        if (ignore || !Array.isArray(res?.data) || res.data.length === 0) return
        setDoctorsList(
          res.data.map((d, idx) => ({
            slug: d.id,
            name: d.fullName,
            specialty: d.specialization || d.title || 'Specialist',
            clinicSlug: d.clinicId,
            clinicName: d.clinicName,
            image: d.photoUrl || DOCTORS[idx % DOCTORS.length]?.image,
          }))
        )
      })
      .catch(() => {
        // Keep static DOCTORS fallback if /public/doctors returns 500
      })

    return () => {
      ignore = true
    }
  }, [slug])

  if (slug) {
    const matched =
      clinicDetail ||
      clinicsList.find((c) => c.slug === slug || c.id === slug) ||
      clinicsList[0]
    const clinic = normalizeClinic(matched || CLINICS[0], 0)
    const detailDoctors = Array.isArray(clinic.doctors)
      ? clinic.doctors.map((d, idx) => ({
          slug: d.id,
          name: d.fullName,
          specialty: d.specialization || d.title || 'Specialist',
          clinicSlug: clinic.id,
          clinicName: clinic.name,
          image: d.photoUrl || DOCTORS[idx % DOCTORS.length]?.image,
        }))
      : null
    const clinicDoctors =
      detailDoctors && detailDoctors.length > 0
        ? detailDoctors
        : doctorsList.filter(
            (d) =>
              d.clinicSlug === clinic.slug ||
              d.clinicSlug === clinic.id ||
              d.clinicName === clinic.name
          )

    return (
      <div className="zm-container py-16">
        <nav className="mb-6 text-[1.3rem] text-[#666666]">
          <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
          <Link to="/en/clinics" className="text-[#3665f6] hover:underline">Clinics</Link> /{' '}
          <span>{clinic.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-[12px]">
            <img
              src={clinic.image}
              alt={clinic.name}
              className="h-[360px] w-full object-cover"
            />
          </div>

          <div>
            <p className="text-[1.2rem] font-bold uppercase tracking-wider text-[#3665f6]">
              {clinic.address}
            </p>
            <h1 className="mt-2 text-[4.4rem] font-bold text-[#0c3a94] md:text-[6rem]">
              {clinic.name}
            </h1>
            <p className="mt-4 text-[1.6rem] leading-[1.7] text-[#555555]">
              {clinic.fullDescription}
            </p>

            <div className="mt-6">
              <p className="mb-2 text-[1.2rem] font-bold uppercase text-[#0a295b]">
                Medical services
              </p>
              <div className="flex flex-wrap gap-2">
                {(clinic.services || clinic.specialties || []).map((srv) => (
                  <span
                    key={srv}
                    className="rounded-[6px] bg-[#f0f4ff] px-3 py-1.5 text-[1.3rem] font-semibold text-[#3665f6]"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => openInquiry(`Inquiry for ${clinic.name}`)}
              className="zm-btn zm-btn-green mt-8"
            >
              <span>Send inquiry</span>
            </button>
          </div>
        </div>

        {clinicDoctors.length > 0 && (
          <div className="mt-16">
            <h2 className="text-[3.4rem] font-bold text-[#0c3a94]">
              Doctors at {clinic.name}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {clinicDoctors.map((doc) => (
                <Link
                  key={doc.slug}
                  to={`/en/doctors/${doc.slug}`}
                  className="flex flex-col rounded-[12px] border border-[#3665f6] bg-white p-5 hover:shadow-md"
                >
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="h-[190px] w-full rounded-[8px] object-cover object-top"
                  />
                  <p className="mt-4 text-[1.15rem] font-bold uppercase text-[#3665f6]">
                    {doc.specialty}
                  </p>
                  <p className="mt-1 text-[2.2rem] font-semibold text-[#0a295b]">
                    {doc.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const filtered = clinicsList.filter(
    (c) =>
      !nameFilter.trim() ||
      c.name.toLowerCase().includes(nameFilter.trim().toLowerCase()),
  )

  return (
    <div className="zm-container py-16">
      <nav className="mb-6 text-[1.3rem] text-[#666666]">
        <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
        <span>Clinics</span>
      </nav>

      <h1 className="text-[4.8rem] font-semibold leading-[1] text-[#0c3a94] md:text-[8.2rem]">
        Clinics
      </h1>
      <p className="mt-3 text-[2rem] font-medium text-[#0c3a94] md:text-[2.6rem]">
        Explore leading medical providers in Zagreb
      </p>

      <div className="mt-10 max-w-[420px]">
        <label
          htmlFor="filter-clinic-name"
          className="mb-1.5 block text-[1.15rem] font-bold uppercase text-[#0a295b]"
        >
          NAME
        </label>
        <input
          id="filter-clinic-name"
          name="clinicName"
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Search clinic name..."
          className="w-full rounded-[8px] border border-[#c7c7c7] bg-white px-4 py-2.5 text-[1.5rem] outline-none focus:border-[#3665f6]"
        />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
        {filtered.map((clinic) => (
          <div key={clinic.slug} className="flex flex-col items-start">
            <Link
              to={`/en/clinics/${clinic.slug}`}
              className="block h-[256px] w-full overflow-hidden rounded-[8px]"
            >
              <img
                src={clinic.image}
                alt={clinic.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </Link>
            <Link
              to={`/en/clinics/${clinic.slug}`}
              className="mt-5 text-[3.4rem] font-bold text-[#0a295b] hover:text-[#3665f6]"
            >
              {clinic.name}
            </Link>
            <p className="mt-3 text-[1.5rem] leading-[1.6] text-[#555555]">
              {clinic.summary}
            </p>
            <Link
              to={`/en/clinics/${clinic.slug}`}
              className="zm-btn zm-btn-green zm-btn-sm mt-5"
            >
              <span>View profile</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
