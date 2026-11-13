import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useUI } from '../hooks/useUI'
import { DOCTORS } from '../data/doctors'
import { apiClient, resolveMediaUrl } from '../services/apiClient'

function normalizeDoctor(d, idx) {
  if (d.slug && d.name) return d
  const fallbackImg = DOCTORS[idx % DOCTORS.length]?.image || DOCTORS[0]?.image
  return {
    id: d.id,
    slug: d.id,
    name: d.fullName,
    specialty: d.specialization || d.title || 'Medical Specialist',
    clinicName: d.clinicName || 'Partner Clinic',
    clinicSlug: d.clinicId || '',
    experience: d.experienceYears ? `${d.experienceYears}+ years experience` : '',
    bio: d.bio || '',
    languages: d.languages || ['English'],
    image: resolveMediaUrl(d.photoUrl) || fallbackImg,
  }
}

export default function DoctorsPage() {
  const { slug } = useParams()
  const { openInquiry } = useUI()
  const [doctorsList, setDoctorsList] = useState(DOCTORS)
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [clinicFilter, setClinicFilter] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadDoctors() {
      try {
        const res = await apiClient.get('/public/doctors')
        if (!ignore && Array.isArray(res?.data) && res.data.length > 0) {
          setDoctorsList(res.data.map((d, idx) => normalizeDoctor(d, idx)))
          return
        }
      } catch {
        // Fallback: aggregate doctors from clinic details when /public/doctors fails
      }

      try {
        const clinicsRes = await apiClient.get('/public/clinics')
        const clinics = clinicsRes?.data || []
        const details = await Promise.all(
          clinics.map((c) => apiClient.get(`/public/clinics/${c.slug}`).catch(() => null))
        )
        const aggregated = details.flatMap((d) =>
          (d?.data?.doctors || []).map((doc) => ({
            ...doc,
            clinicId: doc.clinicId || d?.data?.id || '',
            clinicName: doc.clinicName || d?.data?.name || '',
          }))
        )
        if (!ignore && aggregated.length > 0) {
          setDoctorsList(aggregated.map((d, idx) => normalizeDoctor(d, idx)))
        }
      } catch {
        // Keep static DOCTORS fallback if backend is unreachable
      }
    }

    loadDoctors()
    return () => {
      ignore = true
    }
  }, [])

  if (slug) {
    const doc =
      doctorsList.find((d) => d.slug === slug || d.id === slug) || doctorsList[0]
    return (
      <div className="zm-container py-16">
        <nav className="mb-6 text-[1.3rem] text-[#666666]">
          <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
          <Link to="/en/doctors" className="text-[#3665f6] hover:underline">Doctors</Link> /{' '}
          <span>{doc.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="overflow-hidden rounded-[12px] border border-[#3665f6] p-4">
            <img
              src={doc.image}
              alt={doc.name}
              className="h-[340px] w-full rounded-[8px] object-cover object-top"
            />
          </div>

          <div className="md:col-span-2">
            <p className="text-[1.3rem] font-bold uppercase tracking-wider text-[#3665f6]">
              {doc.specialty}
            </p>
            <h1 className="mt-2 text-[4rem] font-bold text-[#0c3a94] md:text-[5.6rem]">
              {doc.name}
            </h1>
            <p className="mt-2 text-[1.5rem] font-semibold text-[#7fbb58]">
              {doc.experience}
            </p>
            <p className="mt-5 text-[1.6rem] leading-[1.7] text-[#555555]">
              {doc.bio}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {doc.languages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-[6px] bg-[#f0f4ff] px-3.5 py-1.5 text-[1.3rem] font-semibold text-[#0c3a94]"
                >
                  {lang}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => openInquiry(`Consultation with ${doc.name}`)}
                className="zm-btn zm-btn-green"
              >
                <span>Send inquiry</span>
              </button>
              <Link
                to={`/en/clinics/${doc.clinicSlug}`}
                className="rounded-[8px] border border-[#3665f6] px-6 py-3.5 text-[1.5rem] font-semibold text-[#3665f6] hover:bg-[#3665f6] hover:text-white"
              >
                Clinic: {doc.clinicName}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const specialties = [...new Set(doctorsList.map((d) => d.specialty))]
  const clinics = [...new Set(doctorsList.map((d) => d.clinicName))]

  const filtered = doctorsList.filter((d) => {
    const matchSpec = !specialtyFilter || d.specialty === specialtyFilter
    const matchClinic = !clinicFilter || d.clinicName === clinicFilter
    const matchName =
      !nameFilter.trim() ||
      d.name.toLowerCase().includes(nameFilter.trim().toLowerCase())
    return matchSpec && matchClinic && matchName
  })

  return (
    <div className="zm-container py-16">
      <nav className="mb-6 text-[1.3rem] text-[#666666]">
        <Link to="/en" className="text-[#3665f6] hover:underline">Home</Link> /{' '}
        <span>Doctors</span>
      </nav>

      <h1 className="text-[4.8rem] font-semibold leading-[1] text-[#0c3a94] md:text-[8.2rem]">
        Doctors
      </h1>
      <p className="mt-3 text-[2rem] font-medium text-[#0c3a94] md:text-[2.6rem]">
        Award winning doctors for medical excellence
      </p>

      {/* Filter Bar */}
      <div className="mt-10 grid grid-cols-1 gap-4 rounded-[12px] bg-[#f5f8ff] p-5 md:grid-cols-3">
        <div>
          <label
            htmlFor="filter-specialization"
            className="mb-1.5 block text-[1.15rem] font-bold uppercase text-[#0a295b]"
          >
            SPECIALIZATION
          </label>
          <select
            id="filter-specialization"
            name="specialization"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="w-full rounded-[8px] border border-[#c7c7c7] bg-white px-4 py-2.5 text-[1.45rem] outline-none focus:border-[#3665f6]"
          >
            <option value="">All specializations</option>
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="filter-clinic"
            className="mb-1.5 block text-[1.15rem] font-bold uppercase text-[#0a295b]"
          >
            CLINIC
          </label>
          <select
            id="filter-clinic"
            name="clinic"
            value={clinicFilter}
            onChange={(e) => setClinicFilter(e.target.value)}
            className="w-full rounded-[8px] border border-[#c7c7c7] bg-white px-4 py-2.5 text-[1.45rem] outline-none focus:border-[#3665f6]"
          >
            <option value="">All clinics</option>
            {clinics.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="filter-doctor-name"
            className="mb-1.5 block text-[1.15rem] font-bold uppercase text-[#0a295b]"
          >
            NAME
          </label>
          <input
            id="filter-doctor-name"
            name="doctorName"
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Search doctor name..."
            className="w-full rounded-[8px] border border-[#c7c7c7] bg-white px-4 py-2.5 text-[1.45rem] outline-none focus:border-[#3665f6]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((doc) => (
          <div
            key={doc.slug}
            className="flex flex-col rounded-[12px] border border-[#3665f6] bg-white p-[20px] transition-shadow hover:shadow-lg"
          >
            <Link
              to={`/en/doctors/${doc.slug}`}
              className="block h-[200px] w-full overflow-hidden rounded-[8px]"
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="h-full w-full object-cover object-top transition-transform duration-300 hover:scale-105"
              />
            </Link>
            <p className="mt-5 text-[1.2rem] font-bold uppercase tracking-wide text-[#3665f6]">
              {doc.specialty}
            </p>
            <Link
              to={`/en/doctors/${doc.slug}`}
              className="mt-2 text-[2.4rem] font-semibold leading-[1.2] text-[#0a295b] hover:text-[#3665f6]"
            >
              {doc.name}
            </Link>
            {doc.shortBio && (
              <p className="mt-3 text-[1.4rem] leading-relaxed text-[#555555]">
                {doc.shortBio}
              </p>
            )}
            <div className="mt-auto pt-6 text-right">
              <Link
                to={`/en/doctors/${doc.slug}`}
                className="text-[1.2rem] font-bold text-[#3665f6] hover:underline"
              >
                View profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
